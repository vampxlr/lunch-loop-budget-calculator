# Quick Webhook Setup Guide

## Problem Fixed ✅

**Issue**: Webhook was not firing automatically after removing the finalize submission button.

**Solution**: Added automatic webhook trigger in the submission flow.

## What Changed

### 1. New API Route Created
- **File**: `app/api/webhook/send/route.ts`
- **Purpose**: Server-side endpoint to send webhook to n8n
- **Method**: POST
- **Payload**: `{ "submission_id": "sub_xxx" }`

### 2. Updated Submission Flow
- **File**: `app/page.tsx`
- **Change**: Added automatic webhook call after submission is saved
- **Timing**: Webhook is sent immediately after submission, in parallel with email

### 3. Event Logging Added
- New events: `webhook.send.requested`, `webhook.sent`, `webhook.failed`
- Check these in the Dashboard → Submissions → View Details

## Environment Variables Required

Create a `.env.local` file in the root directory with:

```env
# Required: Your n8n webhook URL
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id

# Optional but recommended: Security header
N8N_SHARED_SECRET=your-secret-key-here
```

## How It Works Now

```
User submits form
     ↓
Save to database
     ↓
Log "submission.created"
     ↓
Calculate costs
     ↓
Log "pricing.calculated"
     ↓
┌────────────────────────┬────────────────────────┐
│                        │                        │
│  Send n8n Webhook      │    Send Email         │
│  (NEW - Automatic!)    │    (Existing)         │
│                        │                        │
└────────────────────────┴────────────────────────┘
     ↓
Redirect to results page
```

## Testing the Fix

1. **Set environment variables** (see above)
2. **Complete the wizard** - submit a test entry
3. **Check n8n workflow** - you should receive the data
4. **Check event logs** in Dashboard → Submissions → View Details

## Data Sent to n8n

See `N8N_WEBHOOK_README.md` for complete payload documentation.

**Quick Summary**:
```json
{
  "submission_id": "sub_xxx",
  "email": "customer@company.com",
  "phone": "+1234567890",
  "company_name": "Company Name",
  "employees_count": 50,
  "days_per_week": 5,
  "delivery_time": "12:00",
  "budget_per_person": 15.00,
  "cost_per_person": 15.00,
  "daily_cost": 750.00,
  "weekly_cost": 3750.00,
  "monthly_cost": 15000.00,
  "free_tasting_interest": true,
  "timestamp": "2026-01-11T12:00:00Z"
}
```

## Troubleshooting

### Webhook still not firing?

1. **Check environment variables are set**
   ```bash
   # Should return your webhook URL
   echo $N8N_WEBHOOK_URL
   ```

2. **Check event logs**
   - Go to Dashboard → Submissions
   - Click on any submission
   - Look for `webhook.sent` or `webhook.failed` events

3. **Check browser console**
   - Open DevTools (F12)
   - Look for any errors during submission

4. **Verify n8n webhook is active**
   - Go to your n8n workflow
   - Ensure webhook node is enabled
   - Test webhook manually with curl (see N8N_WEBHOOK_README.md)

### Common Issues

| Issue | Solution |
|-------|----------|
| `N8N_WEBHOOK_URL` not set | Add it to `.env.local` and restart dev server |
| 404 on webhook URL | Check the URL is correct in n8n |
| 401/403 errors | Check `N8N_SHARED_SECRET` matches on both sides |
| Network timeout | Check firewall/network settings |

## Manual Webhook Resend

If webhook failed, you can manually resend from the dashboard:

1. Dashboard → Submissions
2. Click on a submission
3. Click "Resend to n8n" button
4. Webhook will be sent with `rerun: true` flag

## Files Modified

✅ `app/page.tsx` - Added webhook trigger to submission flow
✅ `app/api/webhook/send/route.ts` - New API route (created)
✅ `N8N_WEBHOOK_README.md` - Complete documentation (created)
✅ `WEBHOOK_SETUP_GUIDE.md` - This file (created)

## Next Steps

1. ✅ Add environment variables
2. ✅ Test submission flow
3. ✅ Verify n8n receives data
4. ✅ Set up n8n workflow to process data (see N8N_WEBHOOK_README.md)

---

**Need Help?**
- See `N8N_WEBHOOK_README.md` for detailed documentation
- Check event logs in the dashboard for debugging
- Test webhook manually with curl command in documentation
