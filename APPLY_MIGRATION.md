# Apply Migration to Existing Database

**Migration**: Add Promotional Opt-ins and Make Phone Nullable  
**File**: `supabase/migrations/001_add_promo_optins_and_nullable_phone.sql`  
**Status**: Ready to apply

---

## Quick Start (3 Steps)

### Step 1: Backup Your Database
```bash
# In Supabase Dashboard, take a backup first:
# 1. Go to Project Settings
# 2. Click "Backups"
# 3. Click "Request backup"
# 4. Wait for backup to complete
```

### Step 2: Open SQL Editor
```
1. Go to Supabase Dashboard
2. Select your project
3. Click "SQL Editor" (left sidebar)
4. Click "New query"
```

### Step 3: Copy & Run Migration
```
1. Open: supabase/migrations/001_add_promo_optins_and_nullable_phone.sql
2. Copy ALL the SQL code (from -- Migration to the end)
3. Paste into Supabase SQL Editor
4. Click "Run"
5. You should see: "Query executed successfully"
```

---

## What This Migration Does

✅ **Adds `promo_opt_in_email` column**
- Boolean field for email promotional opt-ins
- Defaults to `FALSE`
- Already exists in code, this adds it to DB

✅ **Adds `promo_opt_in_sms` column**
- Boolean field for SMS promotional opt-ins
- Defaults to `FALSE`
- Already exists in code, this adds it to DB

✅ **Makes `phone` column nullable**
- Phone was previously `NOT NULL`
- Now can be `NULL` (optional)
- Existing phone data is preserved

✅ **Adds performance indexes** (optional but recommended)
- Faster queries for promotional opt-ins
- Useful for segmented marketing queries

---

## Expected Output

When you run the migration, you should see:
```
Query executed successfully
```

That's it! The database is now updated.

---

## Verify Migration Success

After running the migration, run these verification queries:

### Query 1: Check columns exist
```sql
SELECT column_name, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'submissions' 
AND column_name IN ('promo_opt_in_email', 'promo_opt_in_sms', 'phone')
ORDER BY ordinal_position;
```

**Expected result**:
- `promo_opt_in_email` - NOT NULL - DEFAULT FALSE
- `promo_opt_in_sms` - NOT NULL - DEFAULT FALSE
- `phone` - YES (nullable) - NULL

### Query 2: Check data is preserved
```sql
SELECT COUNT(*) as total_submissions,
       COUNT(phone) as submissions_with_phone,
       COUNT(CASE WHEN promo_opt_in_email THEN 1 END) as email_optins,
       COUNT(CASE WHEN promo_opt_in_sms THEN 1 END) as sms_optins
FROM submissions;
```

This shows you:
- Total submissions (should be same as before)
- How many have phone numbers
- How many opted in to email/SMS

---

## If Something Goes Wrong

### Error: "column already exists"
This is fine! It means the migration was already run or the columns exist.
Just proceed with the deployment.

### Error: "syntax error"
Make sure you copied the entire SQL file correctly.
Check for missing semicolons or incomplete statements.

### Error: "permission denied"
Make sure you're logged in as a user with `service_role` or admin permissions.
Go to Supabase Dashboard > Authentication > Users and verify your role.

---

## Rollback (If Needed)

If you need to undo this migration, run this in SQL Editor:

```sql
-- Rollback: Remove promotional opt-ins and make phone NOT NULL again
ALTER TABLE submissions DROP COLUMN IF EXISTS promo_opt_in_email CASCADE;
ALTER TABLE submissions DROP COLUMN IF EXISTS promo_opt_in_sms CASCADE;
ALTER TABLE submissions ALTER COLUMN phone SET NOT NULL;
DROP INDEX IF EXISTS idx_submissions_promo_email;
DROP INDEX IF EXISTS idx_submissions_promo_sms;
```

**Note**: This rollback script is also at the bottom of the migration file.

---

## After Migration

Once migration is complete:

1. ✅ Deploy your updated application code
2. ✅ Test the final step of the wizard
3. ✅ Verify data is saved correctly
4. ✅ Check email includes promo opt-in data

---

## Timeline

- **Backup**: 5-15 minutes (depending on data size)
- **Migration**: < 1 minute (very fast)
- **Total**: ~15-20 minutes

---

## Support

If you have issues:
1. Check Supabase status page (https://status.supabase.com)
2. Review error message carefully
3. Check this guide for the specific error
4. If stuck, refer to `MIGRATION_CONTACT_STEP_FINAL.md` for detailed info

---

**Status**: ✅ Ready to apply  
**Reversible**: Yes (rollback script provided)  
**Safe**: Yes (backup first)
