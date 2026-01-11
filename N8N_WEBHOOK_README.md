# n8n Webhook Integration Documentation

## Overview

This document describes the n8n webhook integration for the Lunch Loop application. The webhook automatically sends submission data to your n8n workflow when a user completes the lunch budget planner.

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# n8n Webhook URL (required)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id

# n8n Shared Secret (optional, recommended for security)
N8N_SHARED_SECRET=your-secret-key-here
```

**Notes:**
- `N8N_WEBHOOK_URL`: The webhook URL from your n8n workflow's webhook node
- `N8N_SHARED_SECRET`: Optional authentication header for added security

## Webhook Trigger Flow

The webhook is automatically triggered in the following sequence:

1. User completes the wizard and submits their information
2. Submission is saved to the database
3. Webhook is sent to n8n (parallel to email sending)
4. Event logs are created for tracking

## Webhook Payload Structure

### Main Webhook Payload

When a submission is completed, the following JSON payload is sent to your n8n webhook:

```json
{
  "submission_id": "sub_1234567890",
  "email": "customer@company.com",
  "phone": "+1234567890",
  "company_name": "Acme Corporation",
  "answers_json": {
    "email": "customer@company.com",
    "phone": "+1234567890",
    "company_name": "Acme Corporation",
    "employees_count": 50,
    "days_per_week": 5,
    "delivery_time": "12:00",
    "budget_per_person": 15.00,
    "budget_type": "per_person",
    "free_tasting_interest": true,
    "promo_opt_in": false
  },
  "cost_per_person": 15.00,
  "daily_cost": 750.00,
  "weekly_cost": 3750.00,
  "monthly_cost": 15000.00,
  "free_tasting_interest": true,
  "timestamp": "2026-01-11T12:34:56.789Z"
}
```

### Rerun Webhook Payload

When manually triggering a webhook resend from the dashboard, an additional `rerun` flag is included:

```json
{
  "submission_id": "sub_1234567890",
  "email": "customer@company.com",
  "phone": "+1234567890",
  "company_name": "Acme Corporation",
  "answers_json": { ... },
  "cost_per_person": 15.00,
  "daily_cost": 750.00,
  "weekly_cost": 3750.00,
  "monthly_cost": 15000.00,
  "free_tasting_interest": true,
  "timestamp": "2026-01-11T13:45:00.000Z",
  "rerun": true
}
```

## Payload Field Descriptions

### Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `submission_id` | string | Unique identifier for the submission |
| `email` | string | Customer's email address |
| `phone` | string | Customer's phone number |
| `company_name` | string | Name of the customer's company (optional) |
| `answers_json` | object | Complete form answers (see below) |
| `cost_per_person` | number | Calculated cost per person per meal |
| `daily_cost` | number | Total daily cost for all employees |
| `weekly_cost` | number | Total weekly cost |
| `monthly_cost` | number | Total monthly cost (weekly × 4) |
| `free_tasting_interest` | boolean | Whether customer is interested in free tasting |
| `timestamp` | string | ISO 8601 timestamp of submission |
| `rerun` | boolean | (Optional) Present only for manual webhook resends |

### answers_json Fields

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Customer's email address |
| `phone` | string | Customer's phone number |
| `company_name` | string | Company name (optional) |
| `employees_count` | number | Number of employees to feed |
| `days_per_week` | number | Number of days per week (1-7) |
| `delivery_time` | string | Preferred delivery time (HH:MM format, 24-hour) |
| `budget_per_person` | number | Budget per person in dollars |
| `budget_type` | string | Type of budget ("per_person" or other types) |
| `free_tasting_interest` | boolean | Interest in free tasting session |
| `promo_opt_in` | boolean | Whether customer opted in for promotional offers |

## HTTP Headers

### Request Headers Sent to n8n

```
Content-Type: application/json
x-shared-secret: your-secret-key-here (if configured)
```

## Setting Up n8n Workflow

### 1. Create Webhook Node

1. Add a **Webhook** node to your n8n workflow
2. Set the HTTP Method to **POST**
3. Set the Path (e.g., `/lunch-loop-submission`)
4. Note the webhook URL provided

### 2. (Optional) Add Authentication

If you configured `N8N_SHARED_SECRET`:

1. Add an **IF** node after the webhook
2. Check if header `x-shared-secret` equals your secret
3. Route unauthorized requests to an error response

### 3. Process the Data

Example workflow nodes you might add:

- **Extract Data**: Use Set node to extract specific fields
- **Send Email**: Use Email node to notify sales team
- **Create CRM Contact**: Use HTTP Request or CRM integration
- **Add to Google Sheets**: Use Google Sheets node for tracking
- **Send Slack Notification**: Use Slack node to alert your team

### Example n8n Workflow Setup

```
Webhook (POST)
  ↓
IF (Check Secret) [optional]
  ↓
Set (Extract Key Fields)
  ↓
[Parallel Branches]
  ├→ Send Email to Sales Team
  ├→ Create CRM Lead
  ├→ Add to Google Sheets
  └→ Send Slack Notification
```

## Testing the Webhook

### Test from Application

1. Complete the lunch planner wizard
2. Submit the form
3. Check the dashboard events log for webhook status

### Test Manually with curl

```bash
curl -X POST https://your-n8n-instance.com/webhook/your-webhook-id \
  -H "Content-Type: application/json" \
  -H "x-shared-secret: your-secret-key-here" \
  -d '{
    "submission_id": "test_123",
    "email": "test@example.com",
    "phone": "+1234567890",
    "company_name": "Test Company",
    "answers_json": {
      "email": "test@example.com",
      "phone": "+1234567890",
      "company_name": "Test Company",
      "employees_count": 25,
      "days_per_week": 5,
      "delivery_time": "12:00",
      "budget_per_person": 12.50,
      "budget_type": "per_person",
      "free_tasting_interest": true,
      "promo_opt_in": false
    },
    "cost_per_person": 12.50,
    "daily_cost": 312.50,
    "weekly_cost": 1562.50,
    "monthly_cost": 6250.00,
    "free_tasting_interest": true,
    "timestamp": "2026-01-11T12:00:00.000Z"
  }'
```

## Webhook Resending

You can manually resend webhooks from the dashboard:

1. Navigate to **Dashboard** → **Submissions**
2. Click on a submission to view details
3. Click the **"Resend to n8n"** button
4. The webhook will be sent with `rerun: true` flag

## Event Logging

All webhook attempts are logged in the events table with the following event types:

| Event Type | Description |
|------------|-------------|
| `webhook.send.requested` | Webhook sending was initiated |
| `webhook.sent` | Webhook sent successfully |
| `webhook.failed` | Webhook sending failed |
| `n8n.webhook.sent` | Direct webhook call succeeded |
| `n8n.webhook.rerun` | Manual webhook resend |

## Troubleshooting

### Webhook Not Firing

1. **Check environment variables**: Ensure `N8N_WEBHOOK_URL` is set
2. **Check event logs**: View the dashboard events for error messages
3. **Verify n8n webhook**: Ensure the webhook is active and reachable
4. **Check network**: Ensure your server can reach the n8n instance

### Authentication Errors

1. Verify the `N8N_SHARED_SECRET` matches on both sides
2. Check the header name is `x-shared-secret` (lowercase)
3. Ensure the secret doesn't contain special characters that need escaping

### Payload Issues

1. Check the n8n execution logs for parsing errors
2. Verify the webhook is expecting JSON format
3. Ensure all required fields are present in the payload

## Code References

### Main Files

- **Webhook Logic**: `lib/webhook.ts`
- **API Route**: `app/api/webhook/send/route.ts`
- **Submission Flow**: `app/page.tsx`
- **Configuration**: `lib/config.ts`

### Webhook Function

```typescript
// lib/webhook.ts
export async function sendWebhook(submission: Submission): Promise<void>
```

### API Endpoint

```
POST /api/webhook/send
Content-Type: application/json

{
  "submission_id": "sub_123"
}
```

## Security Best Practices

1. **Always use HTTPS** for webhook URLs
2. **Configure shared secret** for authentication
3. **Validate webhook responses** in n8n
4. **Monitor failed webhooks** via event logs
5. **Keep secrets in environment variables**, never in code
6. **Rotate secrets periodically** for enhanced security

## Support

For issues or questions:
1. Check the event logs in the dashboard
2. Review n8n execution logs
3. Verify environment configuration
4. Check network connectivity between services

---

**Last Updated**: January 11, 2026
**Version**: 1.0.0
