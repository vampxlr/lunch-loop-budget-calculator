# Environment Setup Guide

## Quick Start

### 1. Create Your Environment File

```bash
# Copy the sample file
cp env.sample .env.local
```

### 2. Edit Configuration

Open `.env.local` and customize the settings for your needs.

---

## Configuration Options

### 📁 Application Settings

```env
# Schema Source: where wizard steps are defined
SCHEMA_SOURCE=file          # "file" or "db"

# Config Source: where app config comes from  
CONFIG_SOURCE=env           # "dummy", "env", or "db"

# Persistence: where submissions are stored
PERSISTENCE_MODE=local      # "local" or "db"
```

**Recommendations:**
- **Development:** Use defaults (file/env/local)
- **Production:** Use db for persistence

---

### 💾 Supabase Database (Optional)

Required only if using `db` mode for schema, config, or persistence.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Get these from:** https://app.supabase.com/project/_/settings/api

---

### 📧 SMTP Email (Optional)

Required for automatic email delivery of results.

#### Option 1: Gmail (Recommended)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx    # 16-char app password
SMTP_FROM=your.email@gmail.com
SMTP_SECURE=true
```

**Setup Steps:**
1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate app password (select "Mail" and your device)
4. Copy the 16-character password (remove spaces)
5. Use it as `SMTP_PASS`

#### Option 2: Other SMTP Providers

```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587                    # or 465
SMTP_USER=your_username
SMTP_PASS=your_password
SMTP_FROM=noreply@yourdomain.com
SMTP_SECURE=false               # false for 587, true for 465
```

**Important:**
- If SMTP is not configured, emails are **gracefully skipped**
- Email failures **never block** the user from seeing results
- All email events are logged

---

### 📞 Contact Information

```env
CONTACT_PHONE=+8801700000000
```

Displayed in:
- Email footer
- Results page
- Error messages

---

### 🔗 n8n Webhook (Optional)

For sending submission data to n8n automation workflows.

```env
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/lunch-loop
N8N_SHARED_SECRET=your_shared_secret
```

Leave blank to disable.

---

### 🔐 Admin Dashboard Authentication

```env
ADMIN_AUTH_ENABLED=false    # Set to "true" to require login
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme     # CHANGE IN PRODUCTION!
```

Access dashboard at: `/dashboard/login`

---

## Common Configurations

### Local Development (Current Default)

```env
SCHEMA_SOURCE=file
CONFIG_SOURCE=env
PERSISTENCE_MODE=local
# No SMTP needed - emails skipped gracefully
# No Supabase needed - data in localStorage
```

**Perfect for:** Quick testing, development

---

### Production with Database

```env
SCHEMA_SOURCE=db
CONFIG_SOURCE=db
PERSISTENCE_MODE=db

# Add Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Add SMTP credentials
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=...
SMTP_PASS=...
SMTP_SECURE=true

# Enable admin auth
ADMIN_AUTH_ENABLED=true
ADMIN_USERNAME=admin
ADMIN_PASSWORD=strong_password_here
```

**Perfect for:** Production deployment

---

### Hybrid Mode

```env
SCHEMA_SOURCE=file          # Schema in code
CONFIG_SOURCE=env           # Config from env vars
PERSISTENCE_MODE=db         # Data in database

# Only need Supabase for storage
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Perfect for:** When you want database persistence but file-based schema

---

## Testing Your Configuration

### Test Without SMTP (Quick)

```bash
npm run dev
# Visit http://localhost:3000
# Complete wizard - email will be "skipped"
# Results still show
```

### Test With SMTP

1. Add SMTP credentials to `.env.local`
2. Restart dev server:
   ```bash
   npm run dev
   ```
3. Complete wizard
4. Check your email inbox
5. Check terminal logs:
   ```
   ✓ Compiled in 200ms
   Email sent to: your.email@gmail.com
   ```

### Test Database Persistence

1. Set up Supabase project
2. Run database migrations (see `supabase/schema.sql`)
3. Add Supabase credentials to `.env.local`
4. Set `PERSISTENCE_MODE=db`
5. Restart server
6. Complete wizard
7. Check Supabase dashboard for data

---

## Environment Variables Priority

Next.js loads environment variables in this order:

1. `.env.local` (highest priority, gitignored)
2. `.env.production` or `.env.development`
3. `.env`

**Best Practice:** Use `.env.local` for all local customization

---

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] Changed default admin password
- [ ] Using Gmail app password (not main password)
- [ ] Different credentials for dev/staging/prod
- [ ] Rotate credentials regularly
- [ ] Never commit credentials to git
- [ ] Use strong passwords (16+ characters)

---

## Troubleshooting

### Emails Not Sending

**Check:**
1. SMTP credentials correct?
2. Using Gmail app password (not regular password)?
3. Port correct? (465 with SECURE=true, 587 with SECURE=false)
4. Check terminal logs for error messages

**Expected Behavior:**
- If SMTP not configured → Email skipped, user sees results
- If SMTP fails → Email failed, user sees results (not blocked)

### Database Connection Errors

**Check:**
1. Supabase URL and keys correct?
2. Database tables created? (run migrations)
3. Service role key set? (for server-side operations)
4. Check Supabase dashboard for API status

### Admin Login Not Working

**Check:**
1. `ADMIN_AUTH_ENABLED=true`?
2. Username and password match `.env.local`?
3. Server restarted after changing `.env.local`?

### Changes Not Applied

**Remember to restart dev server after changing `.env.local`:**

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## Advanced: Environment-Specific Files

For multiple environments:

```bash
.env.local              # Local development (gitignored)
.env.development        # Development defaults
.env.production         # Production defaults
.env.test              # Test environment
```

**Deploy to production:**
- Add env vars to hosting platform (Vercel, Netlify, etc.)
- Don't use `.env.local` in production
- Use platform-specific environment variable UI

---

## Questions?

See also:
- `ENV_SETUP.md` - SMTP-specific setup
- `TESTING_GUIDE.md` - Full testing procedures
- `REFACTORING_SUMMARY.md` - Technical details
- `env.sample` - Complete configuration template

---

## Summary

| Setting | Default | When to Change |
|---------|---------|----------------|
| `SCHEMA_SOURCE` | file | Use "db" for dynamic schema editing |
| `CONFIG_SOURCE` | dummy/env | Use "env" for customization |
| `PERSISTENCE_MODE` | local | Use "db" for production |
| `SMTP_*` | (none) | Add for email delivery |
| `SUPABASE_*` | (none) | Add when using db mode |
| `N8N_*` | (none) | Add for webhook integration |
| `ADMIN_AUTH_ENABLED` | false | Set true for production |

**Current Setup:** Works perfectly out of the box for local development! 🎉
