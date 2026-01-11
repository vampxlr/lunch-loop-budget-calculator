# Verification Checklist - Lunch Loop

**Purpose**: Verify that all fixes and improvements are working correctly  
**Last Updated**: January 11, 2026  
**Status**: ✅ Ready to Verify

---

## 🔍 Quick Verification (5 minutes)

### Browser Console Check
- [ ] Open DevTools (F12 → Console tab)
- [ ] Refresh page (Ctrl+R or Cmd+R)
- [ ] Look for `[MIGRATION]` logs
- [ ] Should see: `[MIGRATION] Starting migrations...`
- [ ] Should see: `[MIGRATION] All migrations completed`
- [ ] No red error messages about UUID or invalid syntax

### ID Format Check
- [ ] Complete the wizard form
- [ ] Submit the form
- [ ] In console, look for `[SUBMISSION] Creating new submission:`
- [ ] Verify ID format is UUID: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
- [ ] Example good ID: `a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6`
- [ ] Example bad ID: `1768147959639-ukwr1j56z` ❌ (should not appear)

### Results Page Check
- [ ] Form submits successfully (no errors)
- [ ] Results page loads
- [ ] All costs display correctly
- [ ] Numbers are not cut off
- [ ] Contact information shows phone number

---

## 📱 Mobile Testing (10 minutes)

### Desktop Testing
- [ ] Open Chrome DevTools
- [ ] Click device toolbar (toggle device simulation)
- [ ] Select "iPhone 12" or similar
- [ ] Refresh page
- [ ] Test wizard on mobile view
  - [ ] Slider +/- buttons visible and working
  - [ ] Animations are smooth (no lag)
  - [ ] Text is readable
  - [ ] No horizontal scrolling
- [ ] Test results page on mobile
  - [ ] Cost cards stack properly
  - [ ] Numbers display correctly
  - [ ] No layout breaks

### Actual Mobile Device (Optional)
- [ ] Access app on phone/tablet via LAN IP
- [ ] Test all steps
- [ ] Verify smooth performance
- [ ] Check touch targets (should be 48px+)

---

## 🗄️ Database Testing (5 minutes)

### Supabase Dashboard
- [ ] Go to Supabase dashboard
- [ ] Navigate to SQL Editor
- [ ] Run: `SELECT * FROM submissions LIMIT 5;`
- [ ] Verify ID column format
  - [ ] All IDs are valid UUIDs
  - [ ] Format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
  - [ ] No old format IDs like `1768147959639-ukwr1j56z`
- [ ] Run: `SELECT COUNT(*) FROM submissions;`
- [ ] Verify count is reasonable
- [ ] Check events table: `SELECT * FROM events LIMIT 5;`
- [ ] Verify submission_id matches submission IDs

---

## 🔌 Webhook Testing (5 minutes)

### Manual Webhook Test
```bash
curl -X POST https://your-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "test-123",
    "email": "test@example.com",
    "phone": "+1234567890",
    "company_name": "Test Company",
    "employees_count": 50,
    "cost_per_person": 15.00,
    "daily_cost": 750.00,
    "weekly_cost": 3750.00,
    "monthly_cost": 15000.00,
    "timestamp": "2026-01-11T12:00:00Z"
  }'
```

- [ ] Webhook endpoint responds
- [ ] Status code: 200 (success) or similar
- [ ] No "not found" errors
- [ ] Check n8n workflow received data

### Form Submission Webhook Test
- [ ] Complete wizard and submit form
- [ ] Check DevTools Network tab
- [ ] Look for `/api/webhook/send` request
- [ ] Should be POST request
- [ ] Should complete quickly (< 1 second)
- [ ] Check n8n workflow
- [ ] Verify data was received

---

## 🐛 Error Logging Check (5 minutes)

### Console Logs
- [ ] Complete wizard
- [ ] Submit form
- [ ] In console, look for `[SUBMISSION]` prefixed logs
- [ ] Should see:
  - [ ] `[SUBMISSION] Creating new submission: [UUID]`
  - [ ] `[SUBMISSION] Saving to Supabase: {...}`
  - [ ] `[SUBMISSION] Successfully saved to DB: [UUID]`
- [ ] No error messages about invalid UUID

### Event Logs in Dashboard
- [ ] Go to Dashboard
- [ ] Click on a submission
- [ ] Scroll to "Event Timeline"
- [ ] Should see events:
  - [ ] `submission.created` - success
  - [ ] `pricing.calculated` - success
  - [ ] `webhook.sent` - success OR `webhook.failed` with reason
  - [ ] `email.sent` - success OR `email.skipped`

---

## 🎨 UI/UX Verification (10 minutes)

### Landing Page
- [ ] Theme toggle visible in top-right
- [ ] Click toggle - theme changes
- [ ] Works on desktop and mobile

### Wizard Flow
- [ ] Step 1: Contact info
  - [ ] Email/phone validation works
  - [ ] Can proceed to next step
- [ ] Step 2: Team size (Employees Count)
  - [ ] Slider works smoothly
  - [ ] +/- buttons appear (on mobile)
  - [ ] Number updates when dragging slider
  - [ ] Number updates when clicking +/-
- [ ] Step 3: Frequency
  - [ ] Chips selectable
  - [ ] Auto-advances to next step
- [ ] Step 4: Delivery time
  - [ ] Time picker works
  - [ ] Can select time
- [ ] Step 5: Budget
  - [ ] Options selectable
  - [ ] Auto-advances
- [ ] Step 6: Tasting
  - [ ] Yes/No buttons work
  - [ ] Auto-advances
- [ ] Final step: Review/Submit
  - [ ] "Get Results" button works
  - [ ] Redirects to results page

### Results Page
- [ ] Cost breakdown cards display
- [ ] Numbers show correctly (not cut off)
- [ ] Cards are responsive
- [ ] Mobile view: 2-column layout
- [ ] Desktop view: 4-column layout
- [ ] All information visible without truncation

### Dashboard
- [ ] Stats cards display
- [ ] Numbers are readable (large numbers don't overflow)
- [ ] Submissions list loads
- [ ] Can search submissions
- [ ] Can click to view submission details

---

## ⚡ Performance Testing (5 minutes)

### Animation Smoothness
- [ ] Open DevTools → Performance tab
- [ ] Refresh page
- [ ] Record performance
- [ ] Check FPS: Should be 60fps
- [ ] Mobile: Animations are smooth (no stuttering)
- [ ] Desktop: Smooth animations visible

### Load Times
- [ ] Network tab → Measure load time
- [ ] Page loads in < 3 seconds
- [ ] First Contentful Paint < 2 seconds
- [ ] Largest Contentful Paint < 3 seconds

### Mobile Performance
- [ ] No horizontal scrolling
- [ ] Minimal vertical scrolling
- [ ] Touch responses are instant
- [ ] No lag when scrolling

---

## 📋 Build Quality (5 minutes)

### Build Test
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No warnings (optional)
- [ ] Output: "✓ Compiled successfully"

### Type Checking
```bash
npx tsc --noEmit
```
- [ ] No type errors
- [ ] Output should be clean

---

## 🚀 Pre-Deployment Checklist

### Final Verification
- [ ] All above checks passed
- [ ] No errors in console
- [ ] UUID format correct
- [ ] Webhook fires successfully
- [ ] Mobile is responsive and fast
- [ ] Build succeeds
- [ ] No TypeScript errors

### Environment Variables
- [ ] `.env` file exists (don't commit)
- [ ] `.env.local` has all required variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `N8N_WEBHOOK_URL`
  - [ ] (optional) `N8N_SHARED_SECRET`

### Database
- [ ] Supabase project created
- [ ] `supabase/schema.sql` run
- [ ] 3 tables exist: submissions, events, planner_schema
- [ ] RLS policies configured
- [ ] Sample data inserted

### Ready to Deploy
- [ ] All checks passed ✅
- [ ] Documentation reviewed ✅
- [ ] Tests completed ✅
- [ ] Performance verified ✅
- [ ] Errors resolved ✅

---

## 📊 Test Results Summary

| Check | Status | Details |
|-------|--------|---------|
| Console Logs | [ ] | No errors about UUID |
| UUID Format | [ ] | Valid UUID v4 format |
| Webhook | [ ] | Fires automatically |
| Mobile | [ ] | 60fps, no scrolling |
| Build | [ ] | No TypeScript errors |
| Database | [ ] | Submissions save properly |
| UI/UX | [ ] | All features working |

---

## 🆘 If Something Fails

### UUID Error Still Appears
1. Read: [UUID_FIX_EXPLANATION.md](./UUID_FIX_EXPLANATION.md)
2. Hard refresh: Ctrl+Shift+R
3. Clear localStorage: DevTools → Storage → Clear All
4. Check: [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md)

### Build Fails
1. Run: `npm install`
2. Run: `npm run build`
3. Check error messages
4. See: [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md)

### Mobile Issues
1. Check: [MOBILE_PERFORMANCE_IMPROVEMENTS.md](./MOBILE_PERFORMANCE_IMPROVEMENTS.md)
2. Test on actual device if possible
3. Check console for errors

### Database Issues
1. Verify tables exist in Supabase
2. Check RLS policies
3. Run schema.sql again if needed
4. See: [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md) Database section

---

## ✅ Sign Off

**Verified By**: [Your Name]  
**Date**: ___________  
**Status**: ✅ Ready to Deploy  

**Notes**:
```
_________________________________________________________

_________________________________________________________
```

---

**Good luck with your deployment! 🚀**
