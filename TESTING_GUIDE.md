# Testing Guide - New User Flow

## Quick Test (Without Email)

The app works perfectly **without SMTP configuration**. Email sending will be gracefully skipped.

### 1. Start the App

```bash
npm run dev
```

Open: http://localhost:3000

### 2. Complete the Wizard

**Step 1: Team Size**
- Use the dial slider to set number of employees
- Click "Next"

**Step 2: Frequency**
- Select days per week (auto-advances)

**Step 3: Delivery Time**
- Use the time picker to select delivery time
- Click "Next"

**Step 4: Budget per Person**
- Select a preset budget or custom amount
- Selects auto-advance

**Step 5: Free Tasting**
- Choose Yes or No (auto-advances)

**Step 6: Special Offers** ← NEW!
- Choose if you want promotional offers
- This replaces the old "finalize" button
- Auto-advances

**Step 7: Send Your Results** ← NEW!
- Enter your email (required)
- Enter phone (optional - can leave blank)
- Click "Get Results"

### 3. View Results Page

✅ **Cost Breakdown appears FIRST at the top**
- Shows per person, daily, weekly, monthly costs
- Shows delivery modifier if applicable

✅ **Contact and Order Details below**
- Can still edit any field
- Changes recalculate costs

✅ **No "Finalize" button**
- Instead shows: "We've sent this estimate to your email"
- Displays contact phone

### 4. Check Event Logs

In the browser console or database, you should see:
- `submission.created`
- `pricing.calculated`
- `email.send.requested`
- `email.skipped` (if SMTP not configured)

## Full Test (With Email Sending)

### 1. Configure SMTP

Create `.env.local`:

```env
# For Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_SECURE=true

# Optional
SMTP_FROM=your.email@gmail.com
```

**Getting Gmail App Password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Copy the 16-character password
4. Use it as `SMTP_PASS`

### 2. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 3. Complete Wizard

Follow steps above. After clicking "Get Results":
- ✅ Email should be sent automatically
- ✅ Check your inbox for "Your Lunch Loop Office Lunch Estimate"
- ✅ Results page loads immediately (doesn't wait for email)

### 4. Check Email Content

The email should include:
- ✅ Professional HTML layout
- ✅ Cost breakdown (4 cards)
- ✅ Delivery modifier notice (if applicable)
- ✅ Your selections summary
- ✅ Free tasting notice (if selected)
- ✅ Promo offers notice (if opted in)
- ✅ Contact phone in footer

### 5. Check Event Logs

Should now see:
- `email.sent` (instead of `email.skipped`)

## Testing Edge Cases

### Test 1: Invalid Email

1. Enter invalid email (e.g., "notanemail")
2. ✅ Should show inline error
3. ✅ "Get Results" button disabled
4. Enter valid email
5. ✅ Error clears, button enabled

### Test 2: Optional Phone

1. Leave phone field completely empty
2. ✅ Should proceed without error
3. ✅ Submission created successfully

### Test 3: Email Failure

1. Configure wrong SMTP credentials
2. Complete wizard
3. ✅ Results page still loads
4. ✅ Event logged as `email.failed`
5. ✅ User not blocked

### Test 4: Back Button

1. Complete several steps
2. Click "Back" multiple times
3. ✅ Values are preserved
4. ✅ Can navigate forward again

### Test 5: Edit on Results

1. Complete wizard and view results
2. Click "Edit" on any field
3. Change value and save
4. ✅ Costs recalculate
5. ✅ Page updates

### Test 6: Off-Peak Delivery

1. Select delivery time outside 11:00 AM - 1:30 PM
2. Complete wizard
3. ✅ Cost breakdown shows delivery modifier
4. ✅ Email shows modifier notice
5. ✅ Results page highlights modifier

## Dashboard Testing

### 1. View Submissions

1. Navigate to `/dashboard/login`
2. Login (if auth enabled)
3. Go to `/dashboard`
4. ✅ All submissions listed
5. ✅ Promo opt-in shows if present

### 2. View Submission Detail

1. Click "View" on any submission
2. ✅ Promo offers shown in details
3. ✅ Phone shown (or "N/A" if empty)
4. ✅ All fields editable

## API Testing

### Test Email Endpoint Directly

```bash
curl -X POST http://localhost:3000/api/email/send-results \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "test-123",
    "to_email": "test@example.com",
    "answers_json": {
      "employees_count": 30,
      "days_per_week": 5,
      "delivery_time": "12:30",
      "budget_per_person": 280,
      "free_tasting_interest": true,
      "promo_opt_in": true
    },
    "computed_costs": {
      "cost_per_person": 280,
      "daily_cost": 8400,
      "weekly_cost": 42000,
      "monthly_cost": 181860,
      "delivery_modifier": 0
    },
    "timestamp": "2024-01-01T00:00:00Z"
  }'
```

**Expected Response (Without SMTP):**
```json
{
  "status": "skipped",
  "message": "SMTP not configured (missing environment variables)"
}
```

**Expected Response (With SMTP):**
```json
{
  "status": "sent",
  "message": "Email sent successfully"
}
```

## Common Issues

### Issue: Email not sending

**Check:**
1. SMTP environment variables set?
2. Gmail app password (not regular password)?
3. Port correct? (465 with SECURE=true or 587 with SECURE=false)
4. Check server logs for errors

**Expected Behavior:**
- Email failure should NOT block results page
- Event logged as `email.failed` or `email.skipped`

### Issue: Validation errors on phone

**Fix:**
- Phone is now optional - remove any validation
- Should accept empty string

### Issue: Step order wrong

**Check:**
- Schema loaded from `config/plannerSchema.ts`
- Order: employees → days → time → budget → tasting → promo → contact

### Issue: Cost breakdown not at top

**Check:**
- Results page should show Cost Breakdown FIRST
- Before Contact Details and Order Details

## Success Criteria

✅ All wizard steps complete in new order
✅ Promo offers step works and saves
✅ Final contact step validates email only
✅ Phone is truly optional
✅ Email sent automatically (or skipped gracefully)
✅ Results page shows cost breakdown first
✅ No "finalize" button present
✅ Email contains all information
✅ Events logged correctly
✅ Dashboard shows new fields
✅ Edits still work on results page
✅ Backwards compatible with existing data

## Performance Check

- [ ] Wizard loads quickly
- [ ] Step transitions smooth
- [ ] Email sending doesn't block UI
- [ ] Results page renders fast
- [ ] No console errors
- [ ] Animations smooth (60fps)

## Accessibility Check

- [ ] Can tab through all fields
- [ ] Email validation errors clear
- [ ] All buttons have focus states
- [ ] Labels associated with inputs
- [ ] Color contrast sufficient

## Done!

You've successfully tested the new user flow. The refactoring:
- ✅ Collects contact at the end
- ✅ Sends results via email automatically
- ✅ Shows cost breakdown first
- ✅ Replaces "finalize" with promo question
- ✅ Maintains all existing functionality

Report any issues found during testing!
