# Debugging Guide - Lunch Loop

## Overview

This guide helps you debug common issues using the enhanced logging system.

## Logging Prefixes

The application uses prefixed console logs for easy filtering:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `[SUBMISSION]` | Submission save/load operations | `[SUBMISSION] Getting submission: uuid-123` |
| `[WEBHOOK]` | Webhook sending operations | `[WEBHOOK] Sending to n8n` |
| `[EVENT]` | Event logging | `[EVENT] Logging event: submission.created` |

## Common Issues and Solutions

### Issue 1: Invalid Input Syntax for Type UUID

**Error Message**:
```
Failed to get submission from DB, falling back to localStorage: {
  code: '22P02',
  message: 'invalid input syntax for type uuid: "1768147959639-ukwr1j56z"'
}
```

**Root Cause**: 
- Old ID format was `"1768147959639-ukwr1j56z"` (timestamp-random string)
- Supabase tables expect valid UUID format (e.g., `"550e8400-e29b-41d4-a716-446655440000"`)
- This error comes from old localStorage data or older submissions

**Solution Implemented** (3-part fix):
1. ✅ **Fixed UUID Generator** (`lib/utils.ts`)
   - `generateId()` now creates valid UUID v4 instead of timestamp format

2. ✅ **Added Data Filtering** (`lib/storage.ts`)
   - `getLocalSubmissions()` filters out invalid IDs from localStorage
   - `getLocalEvents()` filters out invalid submission_ids

3. ✅ **Added Auto-Cleanup** (`lib/migrations.ts`)
   - `runMigrations()` runs on app startup
   - Automatically removes old localStorage data with invalid IDs
   - Logs results with `[MIGRATION]` prefix

**What Happens Now**:
- **New submissions**: Use valid UUID v4 format ✅
- **Old localStorage data**: Automatically removed on app startup ✅
- **Old database data**: Still there (optional manual cleanup) ⚠️

**Verification**:
1. Check browser console for `[MIGRATION]` logs on page load
2. New IDs are in UUID format: `a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6` ✅
3. No more "invalid input syntax" errors (unless very old data remains in DB)

**If Error Still Appears**:
1. Hard refresh: Ctrl+Shift+R
2. Clear localStorage: DevTools → Storage → Clear All
3. Check [UUID_FIX_EXPLANATION.md](./UUID_FIX_EXPLANATION.md) for details

---

### Issue 2: Submission Not Found in Results

**Error Message**:
```
[SUBMISSION] Database error for ID xxx: {
  code: 'PGRST116',
  message: 'Cannot coerce the result to a single JSON object',
  details: 'The result contains 0 rows'
}
```

**Root Cause**:
Submission hasn't been committed to Supabase yet when trying to retrieve it. This is a timing issue between save and read operations.

**Solutions Implemented**:

1. **Increased Delay** (1.5 seconds):
   - Webhook now waits 1500ms before sending
   - Gives Supabase time to commit the transaction

2. **Retry Logic with Exponential Backoff**:
   - `getSubmission()` now retries up to 3 times
   - Waits 1 second between retries
   - Automatically handles timing issues
   - Logs retry attempts: `[SUBMISSION] Submission not found yet, retrying...`

3. **Graceful Fallback**:
   - After retries, falls back to localStorage
   - User experience is not interrupted
   - Logs show fallback: `[SUBMISSION] Falling back to localStorage`

**What You'll See in Console**:
```javascript
[SUBMISSION] Getting submission: xxx, mode: db, retries left: 3
[SUBMISSION] Querying Supabase for submission: xxx
[SUBMISSION] Submission not found yet, retrying in 1000ms... (3 retries left)
[SUBMISSION] Querying Supabase for submission: xxx
[SUBMISSION] Successfully retrieved from DB: { id: 'xxx', email: 'user@example.com' }
```

**Other Possible Causes**:

1. **Persistence Mode Mismatch**:
   - Check `.env` file:
   ```env
   PERSISTENCE_MODE=db  # Use database
   # OR
   PERSISTENCE_MODE=localStorage  # Use local storage
   ```
   - If unsure, check console logs: `[SUBMISSION] Creating new submission: ..., mode: db`

2. **Supabase Configuration**:
   - Verify tables exist: Check Supabase dashboard → SQL Editor
   - Run: `SELECT * FROM submissions LIMIT 1;`
   - Check RLS policies allow insert: Dashboard → Authentication → Policies

3. **Network Latency**:
   - High latency to Supabase can cause delays
   - Retry logic should handle this automatically
   - Check Supabase status page if persistent issues

---

### Issue 3: Webhook Not Firing

**Debugging Steps**:

1. **Check Browser Console**:
   ```
   [SUBMISSION] Creating new submission: uuid-123, mode: db
   [SUBMISSION] Saving to Supabase: { id: 'uuid-123', email: 'test@example.com' }
   [SUBMISSION] Successfully saved to DB: uuid-123
   [WEBHOOK] Webhook sent to n8n
   ```

2. **Check Environment Variables**:
   ```env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx
   ```

3. **Check Dashboard Events**:
   - Go to Dashboard → Submissions → Click any submission
   - Look for `webhook.sent` or `webhook.failed` events
   - Check the error message for details

4. **Test Webhook Manually**:
   ```bash
   curl -X POST https://your-n8n-instance.com/webhook/your-id \
     -H "Content-Type: application/json" \
     -d '{"submission_id": "test-id", "email": "test@example.com"}'
   ```

---

## Console Logging Examples

### Successful Submission Flow

```javascript
[SUBMISSION] Creating new submission: a1b2c3d4-e5f6-4g7h-i9j0-k1l2m3n4o5p6, mode: db, email: john@example.com
[SUBMISSION] Saving to Supabase: { 
  id: 'a1b2c3d4-e5f6-4g7h-i9j0-k1l2m3n4o5p6', 
  email: 'john@example.com', 
  phone: '+880 1700-123456' 
}
[SUBMISSION] Successfully saved to DB: a1b2c3d4-e5f6-4g7h-i9j0-k1l2m3n4o5p6
[WEBHOOK] Sending webhook to n8n...
[WEBHOOK] Webhook response: { status: 'sent' }
```

### Fallback to LocalStorage

```javascript
[SUBMISSION] Creating new submission: a1b2c3d4-e5f6-4g7h-i9j0-k1l2m3n4o5p6, mode: db
[SUBMISSION] Saving to Supabase: { id: 'a1b2c3d4-e5f6-4g7h-i9j0-k1l2m3n4o5p6', email: 'test@example.com' }
[SUBMISSION] Database insert error: { code: 'PGRST301', message: 'No rows affected' }
Failed to save submission to DB, falling back to localStorage: Error: ...
[SUBMISSION] Falling back to localStorage for ID: a1b2c3d4-e5f6-4g7h-i9j0-k1l2m3n4o5p6
[SUBMISSION] Saved to localStorage, total submissions: 5
```

### Retrieving Submission

```javascript
[SUBMISSION] Getting submission: a1b2c3d4-e5f6-4g7h-i9j0-k1l2m3n4o5p6, mode: db
[SUBMISSION] Querying Supabase for submission: a1b2c3d4-e5f6-4g7h-i9j0-k1l2m3n4o5p6
[SUBMISSION] Successfully retrieved from DB: { id: 'a1b2c3d4-e5f6-4g7h-i9j0-k1l2m3n4o5p6', email: 'john@example.com' }
```

---

## Debugging Workflow

### Step 1: Enable Browser DevTools
```
F12 → Console tab
```

### Step 2: Filter by Prefix
```javascript
// Type in console to see only submission logs
localStorage.debug = 'SUBMISSION:*'
```

### Step 3: Perform Action
- Complete the lunch planner wizard
- Submit the form
- Watch console for logs

### Step 4: Check Each Stage

1. **Submission Creation**
   - Look for: `[SUBMISSION] Creating new submission:`
   - Check ID format is UUID

2. **Database Save**
   - Look for: `[SUBMISSION] Successfully saved to DB:`
   - If error, check: `Database insert error: { code: '...', message: '...' }`

3. **Webhook Sending**
   - Look for: `[WEBHOOK]` logs
   - Check webhook URL in `.env`

4. **Results Page**
   - Look for: `[SUBMISSION] Getting submission:`
   - Should find the submission in database or localStorage

---

## Database Verification

### Check Supabase Tables

```sql
-- Check if submissions table exists
SELECT * FROM submissions LIMIT 1;

-- View all submissions
SELECT id, email, phone, created_at FROM submissions ORDER BY created_at DESC;

-- Check events for specific submission
SELECT event_type, status, message, created_at 
FROM events 
WHERE submission_id = 'YOUR-UUID-HERE'
ORDER BY created_at DESC;
```

### Check RLS Policies

1. Go to Supabase Dashboard
2. Select your project
3. Click "Authentication" → "Policies"
4. Verify these policies exist:
   - `Allow public insert access to submissions`
   - `Allow public read access to submissions`
   - `Allow public update access to submissions`

### Check Anon Key

1. Go to Supabase Dashboard
2. Click "Settings" → "API"
3. Copy the `anon public` key
4. Paste in `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
   ```

---

## Performance Debugging

### Check API Response Times

In Chrome DevTools:
1. Open Network tab (F12)
2. Look for `/api/webhook/send` request
3. Check timing:
   - Should complete in < 1s
   - If > 5s, webhook service may be slow

---

## Troubleshooting Checklist

- [ ] Check browser console for `[SUBMISSION]` logs
- [ ] Verify ID is in UUID format (not timestamp format)
- [ ] Check `.env` file has `N8N_WEBHOOK_URL` set
- [ ] Verify Supabase tables exist (run schema.sql)
- [ ] Check RLS policies allow inserts (Supabase Dashboard)
- [ ] Verify persistence mode matches: `db` or `localStorage`
- [ ] Check webhook URL is reachable (test with curl)
- [ ] Review Dashboard event logs for errors

---

## Getting Help

When reporting issues, include:

1. **Browser Console Log**: Copy relevant `[SUBMISSION]` and `[WEBHOOK]` logs
2. **Error Message**: Full error details including code and message
3. **Environment**: 
   - Operating system (Windows, Mac, Linux)
   - Browser (Chrome, Safari, Firefox)
   - Mobile or desktop
4. **Reproduction Steps**: Exact steps to reproduce the issue

---

**Last Updated**: January 11, 2026
**Version**: 1.0.0
