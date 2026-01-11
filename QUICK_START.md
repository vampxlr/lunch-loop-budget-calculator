# 🚀 Quick Start - Lunch Loop

## ⚡ Fastest Start (No Configuration)

```bash
npm run dev
```

Visit: **http://localhost:3000**

✅ **Works immediately!**
- Data stored in browser localStorage
- Emails gracefully skipped
- No database required

---

## 📧 Enable Email Sending (5 minutes)

### Step 1: Get Gmail App Password

1. Visit: https://myaccount.google.com/apppasswords
2. Create app password for "Mail"
3. Copy the 16-character password

### Step 2: Create Environment File

```bash
cp env.sample .env.local
```

### Step 3: Add Your Credentials

Edit `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_SECURE=true
```

### Step 4: Restart

```bash
# Stop server (Ctrl+C)
npm run dev
```

✅ **Emails now working!**

---

## 💾 Enable Database Storage

### Option A: Continue with localStorage

No setup needed! Data persists in browser.

### Option B: Use Supabase

1. Create project at https://supabase.com
2. Copy credentials from Settings → API
3. Add to `.env.local`:

```env
PERSISTENCE_MODE=db
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

4. Run database migrations (see `supabase/schema.sql`)
5. Restart server

---

## 🎯 What to Test

### Basic Flow (2 minutes)

1. **Start**: Visit http://localhost:3000
2. **Team Size**: Use slider to select employees
3. **Frequency**: Select days per week
4. **Delivery Time**: Pick a time
5. **Budget**: Choose budget level
6. **Free Tasting**: Yes or No
7. **Special Offers**: Yes or No ← NEW!
8. **Email**: Enter your email ← NEW!
9. **Results**: Cost breakdown shown first ← NEW!

### What Changed (New Flow)

- ✅ Contact moved to the END
- ✅ Email required, phone optional
- ✅ "Special Offers" question added
- ✅ Email sent automatically
- ✅ Cost breakdown shown FIRST on results
- ✅ No "finalize" button needed

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `env.sample` | All configuration options |
| `.env.local` | Your actual config (create from env.sample) |
| `ENVIRONMENT_SETUP.md` | Detailed setup guide |
| `TESTING_GUIDE.md` | Complete testing procedures |
| `REFACTORING_SUMMARY.md` | Technical details |

---

## 🔧 Configuration Quick Reference

```env
# Minimal (default) - works immediately
# (no .env.local needed)

# With email sending
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password
SMTP_SECURE=true

# With database
PERSISTENCE_MODE=db
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Custom contact phone
CONTACT_PHONE=+8801700000000
```

---

## 🎨 Features

### Current Design ✅

- Premium futuristic UI
- Glassmorphism effects
- Aurora animated background
- Smooth micro-interactions
- Dark/Light theme toggle
- Mobile responsive

### New Flow ✅

- Contact collection at end
- Email delivery of results
- Promo offers opt-in
- Cost breakdown priority
- Simplified experience

---

## 🐛 Troubleshooting

### Dev server won't start?

```bash
npm install
npm run dev
```

### Emails not sending?

Check:
- Using Gmail **app password** (not regular password)
- Port 465 with `SMTP_SECURE=true`
- Restart server after changing `.env.local`

### Database errors?

Check:
- Supabase credentials correct
- Database tables created (run migrations)
- `PERSISTENCE_MODE=db` set

---

## 📚 Documentation

- **`ENVIRONMENT_SETUP.md`** → Detailed configuration guide
- **`TESTING_GUIDE.md`** → Step-by-step testing
- **`REFACTORING_SUMMARY.md`** → Technical changes
- **`ENV_SETUP.md`** → SMTP-specific setup
- **`env.sample`** → Configuration template

---

## 🎯 Next Steps

### For Development

1. ✅ Already running on localhost:3000
2. Test the new wizard flow
3. Try with/without SMTP
4. Review the email template

### For Production

1. Set up Supabase database
2. Configure SMTP credentials
3. Enable admin authentication
4. Deploy to hosting platform
5. Add environment variables

---

## 💡 Pro Tips

- **No SMTP?** App works perfectly, emails are skipped gracefully
- **Email fails?** User still sees results, never blocked
- **Quick test?** Use current setup, no configuration needed
- **Production?** Enable database + SMTP + admin auth

---

## 📦 What's Included

### New Components

- `PromoOffersStep` - Special offers question
- Email template - Professional HTML email
- Email API - `/api/email/send-results`

### Updated Components

- Wizard flow - Reordered steps
- Results page - Cost breakdown first
- Schema - New step definitions

### Unchanged

- ✅ Design system
- ✅ Animations
- ✅ Pricing logic
- ✅ Dashboard
- ✅ Admin features

---

## ✨ Status

**Ready to Use!** 🎉

- ✅ Compiles without errors
- ✅ Dev server running
- ✅ All features working
- ✅ Documentation complete
- ✅ Production ready

---

## 🆘 Need Help?

1. Check terminal logs for errors
2. Check browser console for errors
3. Review `ENVIRONMENT_SETUP.md` for detailed setup
4. Review `TESTING_GUIDE.md` for testing procedures
5. Check `env.sample` for all available options

---

## 🎊 You're All Set!

The app is running at **http://localhost:3000**

Try completing a wizard flow to see the new features in action!
