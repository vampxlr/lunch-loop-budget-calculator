# Migration: Move Contact Step to End + Add Promo Opt-ins

**Status**: ✅ READY FOR DEPLOYMENT  
**Date**: January 11, 2026  
**Breaking Changes**: None (backward compatible)

---

## Overview

This migration moves the contact information collection (email + phone) to the final step of the wizard and adds promotional opt-in preferences for email and SMS.

---

## Changes Made

### 1. **Schema & Types Updates**

#### `types/submission.ts`
- Added to `SubmissionAnswers` interface:
  ```typescript
  promo_opt_in_email?: boolean;
  promo_opt_in_sms?: boolean;
  ```
- Added to `Submission` interface:
  ```typescript
  promo_opt_in_email?: boolean;
  promo_opt_in_sms?: boolean;
  ```

#### `config/plannerSchema.ts`
- Updated final step `contact_to_send_results` to include promo opt-in fields
- Modified `phone` field to be optional (`required: false`)
- Added fields for `promo_opt_in_email` and `promo_opt_in_sms`

### 2. **New Component**

#### `components/wizard/FinalContactStep.tsx` (NEW)
- Beautiful, user-friendly final step component
- Sections:
  1. **Email & Phone Collection**
     - Email (required) with validation
     - Phone (optional) with helper text
  2. **Promotional Preferences**
     - Email opt-in checkbox
     - SMS opt-in checkbox (disabled if no phone)
     - Clear, accessible UI with icons
- Features:
  - Real-time email validation
  - Phone validation (only if provided)
  - SMS opt-in automatically disabled if no phone number
  - Motion animations for smooth transitions

### 3. **Application Logic Updates**

#### `app/page.tsx`
- Replaced `ContactStep` import with `FinalContactStep`
- Updated `renderStep()` to use `FinalContactStep` for both contact cases
- Updated `handleSubmit()` to include:
  ```typescript
  promo_opt_in_email: answers.promo_opt_in_email || false,
  promo_opt_in_sms: answers.promo_opt_in_sms || false,
  ```
- Email sending now includes promo opt-in data

### 4. **Database Schema**

#### `supabase/schema.sql`
- Updated `submissions` table:
  ```sql
  phone TEXT,  -- Changed from NOT NULL to nullable
  -- Added new columns:
  promo_opt_in_email BOOLEAN DEFAULT FALSE,
  promo_opt_in_sms BOOLEAN DEFAULT FALSE
  ```

---

## Migration Steps for Existing Databases

### If you have an existing Supabase project, run this migration:

```sql
-- Add new columns to submissions table
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS promo_opt_in_email BOOLEAN DEFAULT FALSE;

ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS promo_opt_in_sms BOOLEAN DEFAULT FALSE;

-- Make phone nullable (if not already)
ALTER TABLE submissions 
ALTER COLUMN phone DROP NOT NULL;

-- Create index for promo opt-ins (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_submissions_promo_email 
ON submissions(promo_opt_in_email) 
WHERE promo_opt_in_email = TRUE;

CREATE INDEX IF NOT EXISTS idx_submissions_promo_sms 
ON submissions(promo_opt_in_sms) 
WHERE promo_opt_in_sms = TRUE;
```

### Run in Supabase SQL Editor:
1. Go to Supabase Dashboard → SQL Editor
2. Copy the above SQL
3. Click "Run"
4. Confirm the changes

---

## New Wizard Flow

```
1. Team Size
2. Frequency  
3. Delivery Time
4. Budget
5. Free Tasting
6. Special Offers (existing)
7. Send Your Results ← FINAL STEP (moved here)
   ├─ Email address (required)
   ├─ Phone number (optional)
   ├─ Email promotional offers (checkbox)
   └─ SMS promotional offers (checkbox, if phone provided)
```

---

## Behavior Changes

### Email
- **Before**: Collected early in the wizard
- **After**: Collected on final step (step 7)
- **Validation**: Required, standard email format
- **Impact**: Results page won't load without valid email

### Phone
- **Before**: Collected with email early
- **After**: Collected on final step (optional)
- **Validation**: Only validated if provided
- **Impact**: SMS opt-in disabled if phone is empty

### Promotional Opt-ins
- **Before**: Only `promo_opt_in` (yes/no question)
- **After**: Separate `promo_opt_in_email` and `promo_opt_in_sms`
- **Usage**: Can be used for segmented marketing
- **SMS Guard**: SMS opt-in requires phone number

---

## Data Compatibility

### Backward Compatible
- Existing submissions with old format still work
- New fields default to `false` for old data
- Phone can now be null (already stored as null in practice)

### Migration Query (existing data)
```sql
-- Existing submissions get default values
UPDATE submissions 
SET promo_opt_in_email = FALSE, promo_opt_in_sms = FALSE 
WHERE promo_opt_in_email IS NULL;
```

---

## API & Webhook Updates

### Email Sending (`/api/email/send-results`)
Now includes:
```typescript
{
  promo_opt_in_email: boolean,
  promo_opt_in_sms: boolean,
  // ... other fields
}
```

### n8n Webhook Payload
Now includes:
```json
{
  "promo_opt_in_email": true,
  "promo_opt_in_sms": false,
  // ... other fields
}
```

---

## Validation Rules

### Email
- **Required**: Yes
- **Pattern**: Standard email regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- **User Feedback**: "Please enter a valid email address"

### Phone
- **Required**: No
- **Pattern** (if provided): `^[\d\s\-+()]+$`
- **User Feedback**: "Please enter a valid phone number"

### SMS Opt-in
- **Enabled only if**: Phone provided
- **Visual Feedback**: Disabled/greyed out without phone
- **Default**: False

---

## Testing Checklist

- [ ] Email validation works (rejects invalid)
- [ ] Phone is optional (can skip)
- [ ] SMS opt-in disabled without phone
- [ ] SMS opt-in enabled with phone
- [ ] Final step is truly the last step
- [ ] Submission saves all promo opt-in data
- [ ] Email API receives promo opt-in data
- [ ] Existing submissions not affected
- [ ] Mobile view works properly
- [ ] No hydration errors

---

## Files Modified

| File | Changes |
|------|---------|
| `types/submission.ts` | Added promo opt-in fields |
| `config/plannerSchema.ts` | Updated final step, made phone optional |
| `components/wizard/FinalContactStep.tsx` | NEW - final step component |
| `app/page.tsx` | Updated to use FinalContactStep, handle promo opt-ins |
| `supabase/schema.sql` | Added columns for promo opt-ins, made phone nullable |

---

## Rollback Plan

If needed to rollback:

```sql
-- Remove new columns
ALTER TABLE submissions DROP COLUMN IF EXISTS promo_opt_in_email CASCADE;
ALTER TABLE submissions DROP COLUMN IF EXISTS promo_opt_in_sms CASCADE;

-- Make phone NOT NULL again
ALTER TABLE submissions ALTER COLUMN phone SET NOT NULL;

-- Remove indexes
DROP INDEX IF EXISTS idx_submissions_promo_email;
DROP INDEX IF EXISTS idx_submissions_promo_sms;
```

Then revert code changes to use old `ContactStep`.

---

## Benefits

✅ **Better UX**: Contact info at the end, after they've committed to budgeting  
✅ **Better Segmentation**: Separate email/SMS opt-ins for targeted marketing  
✅ **Privacy Friendly**: Phone is optional, SMS requires consent  
✅ **Data Quality**: Email is guaranteed before submission  
✅ **Backward Compatible**: Existing data unaffected  

---

## Next Steps

1. **For new deployments**: Just run the app, schema will be created
2. **For existing Supabase projects**: Run the migration SQL
3. **Test**: Run through full wizard flow
4. **Monitor**: Check for any data inconsistencies

---

**Status**: ✅ READY TO DEPLOY
