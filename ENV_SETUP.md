# Environment Variables Setup

## SMTP Email Configuration

To enable email sending for results delivery, add these environment variables:

### For Gmail (Recommended)

1. Generate an app password at: https://myaccount.google.com/apppasswords
2. Add to your `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=your.email@gmail.com
SMTP_SECURE=true
```

### For Other SMTP Providers

```env
SMTP_HOST=your.smtp.host
SMTP_PORT=587 # or 465
SMTP_USER=your_email
SMTP_PASS=your_password
SMTP_FROM=from@email.com # Optional, defaults to SMTP_USER
SMTP_SECURE=false # true for port 465, false for port 587
```

## Notes

- **All SMTP variables are optional**
- If SMTP is not configured, emails will be **skipped** (not block the user)
- The app logs email events regardless of configuration
- Users can still see results even if email fails

## Other Environment Variables

See existing `.env.example` or documentation for:
- Supabase configuration
- n8n webhook integration
- Admin authentication
- Contact phone number
