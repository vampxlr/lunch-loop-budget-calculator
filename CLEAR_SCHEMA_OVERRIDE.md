# Clear Schema Override - Fix Step Order

## Problem

The wizard is showing steps in the wrong order (contact info first instead of team size).

**Root Cause**: An old schema override is stored in **localStorage** with the wrong step order. This overrides the correct file schema.

---

## Quick Fix (2 options)

### Option 1: Clear localStorage in Browser Console

1. Open your app in browser: `http://localhost:3000`
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Paste this command and press Enter:

```javascript
localStorage.removeItem('planner_schema_override');
location.reload();
```

✅ The page will reload and use the correct step order from the file!

---

### Option 2: Clear All App Data

1. Open DevTools (`F12`)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Under **Local Storage**, find your localhost
4. Find and delete the key: `planner_schema_override`
5. Refresh the page (`Ctrl+R` or `F5`)

---

## Verify Fix

After clearing, the wizard should show steps in this order:

1. **Team Size** (employees_count)
2. **Frequency** (days_per_week)
3. **Delivery Time** (delivery_time)
4. **Budget** (budget_per_person)
5. **Free Tasting** (free_tasting_interest)
6. **Special Offers** (promo_offers_opt_in)
7. **Send Your Results** (contact_to_send_results) ← Final step with email/phone

---

## Why This Happened

The planner editor allows you to customize the schema. When you save changes, it stores the schema in localStorage as `planner_schema_override`.

This overrides the file schema (`config/plannerSchema.ts`).

If you used the editor before the recent changes, it saved the OLD step order.

---

## Permanent Solution

If you want to ALWAYS use the file schema and ignore any localStorage overrides, we can update the code.

**Would you like me to add a flag to disable localStorage schema overrides?**

---

## For Production/Vercel

This localStorage override only affects your local browser. Vercel deployment won't have this issue because:

1. Each user's browser is fresh (no localStorage)
2. The app uses the file schema by default
3. Only saves to localStorage if you use the planner editor

**Your production site should already have the correct step order!**
