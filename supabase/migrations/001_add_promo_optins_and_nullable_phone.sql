-- Migration: Add promotional opt-ins and make phone nullable
-- Date: January 11, 2026
-- Description: Adds promo_opt_in_email and promo_opt_in_sms columns, makes phone nullable
-- Run this migration on existing Supabase projects to update the submissions table

-- ============================================================================
-- ADD PROMOTIONAL OPT-IN COLUMNS
-- ============================================================================

-- Add promo_opt_in_email column if it doesn't exist
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS promo_opt_in_email BOOLEAN DEFAULT FALSE;

-- Add promo_opt_in_sms column if it doesn't exist
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS promo_opt_in_sms BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- MAKE PHONE NULLABLE
-- ============================================================================

-- Make phone column nullable (if it's currently NOT NULL)
ALTER TABLE submissions 
ALTER COLUMN phone DROP NOT NULL;

-- ============================================================================
-- ADD INDEXES FOR BETTER QUERY PERFORMANCE (OPTIONAL)
-- ============================================================================

-- Index for querying email promotional opt-ins
CREATE INDEX IF NOT EXISTS idx_submissions_promo_email 
ON submissions(promo_opt_in_email) 
WHERE promo_opt_in_email = TRUE;

-- Index for querying SMS promotional opt-ins
CREATE INDEX IF NOT EXISTS idx_submissions_promo_sms 
ON submissions(promo_opt_in_sms) 
WHERE promo_opt_in_sms = TRUE;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify the migration was successful:
-- SELECT column_name, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'submissions' 
-- ORDER BY ordinal_position;

-- ============================================================================
-- ROLLBACK SCRIPT (If needed, save this separately)
-- ============================================================================

-- To rollback this migration, run:
-- ALTER TABLE submissions DROP COLUMN IF EXISTS promo_opt_in_email CASCADE;
-- ALTER TABLE submissions DROP COLUMN IF EXISTS promo_opt_in_sms CASCADE;
-- ALTER TABLE submissions ALTER COLUMN phone SET NOT NULL;
-- DROP INDEX IF EXISTS idx_submissions_promo_email;
-- DROP INDEX IF EXISTS idx_submissions_promo_sms;
