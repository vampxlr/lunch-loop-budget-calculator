# Migration Quick Reference

**File**: `supabase/migrations/001_add_promo_optins_and_nullable_phone.sql`

---

## The SQL (Copy & Paste Ready)

```sql
-- Add promo_opt_in_email column
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS promo_opt_in_email BOOLEAN DEFAULT FALSE;

-- Add promo_opt_in_sms column
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS promo_opt_in_sms BOOLEAN DEFAULT FALSE;

-- Make phone nullable
ALTER TABLE submissions 
ALTER COLUMN phone DROP NOT NULL;

-- Add indexes (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_submissions_promo_email 
ON submissions(promo_opt_in_email) 
WHERE promo_opt_in_email = TRUE;

CREATE INDEX IF NOT EXISTS idx_submissions_promo_sms 
ON submissions(promo_opt_in_sms) 
WHERE promo_opt_in_sms = TRUE;
```

---

## How to Apply

### In Supabase Dashboard:
1. SQL Editor → New query
2. Copy the SQL above
3. Click Run
4. Done!

### Expected Result:
```
Query executed successfully
```

---

## What Changes

| Column | Before | After |
|--------|--------|-------|
| `promo_opt_in_email` | ❌ doesn't exist | ✅ BOOLEAN, DEFAULT FALSE |
| `promo_opt_in_sms` | ❌ doesn't exist | ✅ BOOLEAN, DEFAULT FALSE |
| `phone` | NOT NULL | NULL (optional) |

---

## Verification

```sql
-- Check columns exist
SELECT column_name, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'submissions' 
AND column_name IN ('promo_opt_in_email', 'promo_opt_in_sms', 'phone');
```

---

## Rollback (If Needed)

```sql
ALTER TABLE submissions DROP COLUMN IF NOT EXISTS promo_opt_in_email CASCADE;
ALTER TABLE submissions DROP COLUMN IF NOT EXISTS promo_opt_in_sms CASCADE;
ALTER TABLE submissions ALTER COLUMN phone SET NOT NULL;
DROP INDEX IF EXISTS idx_submissions_promo_email;
DROP INDEX IF EXISTS idx_submissions_promo_sms;
```

---

## Status

✅ Ready to apply  
✅ Safe (backward compatible)  
✅ Reversible (rollback script provided)  
✅ Fast (< 1 minute)

---

**See `APPLY_MIGRATION.md` for detailed instructions**
