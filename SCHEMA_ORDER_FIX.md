# Fix Wizard Step Order - Complete Guide

## 🔍 Root Cause

Your `.env.local` has:
```env
NEXT_PUBLIC_SCHEMA_SOURCE=db
```

This loads the schema from the **database**, which has the wrong step order.  
Clearing localStorage didn't help because the app never uses localStorage when `SCHEMA_SOURCE=db`.

---

## ✅ Solution (Choose ONE)

### **Option 1: Use File Schema** (Recommended - Fastest!)

1. **Edit `.env.local`** and change:
   ```env
   # Before
   NEXT_PUBLIC_SCHEMA_SOURCE=db
   
   # After
   NEXT_PUBLIC_SCHEMA_SOURCE=file
   ```

2. **Restart dev server**:
   ```bash
   # Press Ctrl+C in terminal
   npm run dev
   ```

3. **Refresh browser** - Step 1 should now be "Team Size" ✅

**Pros**: Instant fix, no database changes needed  
**Cons**: Can't use the planner editor in dashboard (changes won't persist)

---

### **Option 2: Fix Database Schema** (If you need `db` mode)

1. **Open Supabase Dashboard** → SQL Editor

2. **Copy and run** the SQL from: `FIX_DATABASE_SCHEMA.sql`
   (Just created in your project root)

   Or run this:
   ```sql
   DELETE FROM planner_schema;
   -- Then insert the full correct schema (see FIX_DATABASE_SCHEMA.sql)
   ```

3. **Restart dev server**:
   ```bash
   npm run dev
   ```

4. **Refresh browser** - Step 1 should now be "Team Size" ✅

**Pros**: Keeps `db` mode, can use planner editor  
**Cons**: Requires database access and SQL execution

---

## 🎯 Recommended Approach

**For development**: Use **Option 1** (file mode)  
- Faster iteration
- No database dependency
- Edit schema directly in `config/plannerSchema.ts`

**For production with dynamic schema**: Use **Option 2** (db mode)  
- Schema can be updated via dashboard
- Centralized schema management
- Good for multi-tenant setups

---

## 📋 Expected Step Order After Fix

```
Step 1: Team Size              ← First step ✅
Step 2: Frequency
Step 3: Delivery Time
Step 4: Budget
Step 5: Free Tasting
Step 6: Special Offers
Step 7: Send Your Results      ← Final step (email/phone)
```

---

## 🚨 Current Issue

**Your database has this step order:**
```
Step 1: Contact Info           ← WRONG (old order)
Step 2: Team Size
Step 3: ...
```

**Your file has this step order:**
```
Step 1: Team Size              ← CORRECT ✅
Step 2: Frequency
Step 3: ...
```

Since `SCHEMA_SOURCE=db`, the app uses the database (wrong order).

---

## 🔧 Quick Commands

### Check current schema source:
```bash
# In your terminal
grep "SCHEMA_SOURCE" .env.local
```

### Change to file mode:
```bash
# Edit .env.local manually, then:
npm run dev
```

### Verify it's working:
1. Open `http://localhost:3000`
2. Start the wizard
3. First question should be "Team Size"

---

## 💡 Why This Confusion?

The app has **3 schema sources** (in priority order):

1. **Database** (`SCHEMA_SOURCE=db`) ← You're using this
   - Loads from `planner_schema` table
   - You have an old schema here with wrong order

2. **localStorage override** (when `SCHEMA_SOURCE=file`)
   - Only used in file mode
   - You already cleared this

3. **File** (`config/plannerSchema.ts`)
   - Has the correct order
   - Only used if database fails or `SCHEMA_SOURCE=file`

---

## ✅ Action Required

**Right now**: Edit `.env.local` and change one line:

```env
NEXT_PUBLIC_SCHEMA_SOURCE=file
```

Then restart your dev server. Done! 🎉

---

## 📄 Files Reference

- `.env.local` - Environment config (change `SCHEMA_SOURCE`)
- `config/plannerSchema.ts` - File schema (correct order) ✅
- `FIX_DATABASE_SCHEMA.sql` - SQL to fix database schema
- `lib/storage.ts` - Schema loading logic (line 9-48)
