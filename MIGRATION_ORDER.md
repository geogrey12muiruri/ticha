# 📋 Migration Order & Steps

## Required Migrations (Run in Order)

### 1. **Migration 001: Scholarships Table** ✅ REQUIRED
**File:** `supabase/migrations/001_create_scholarships.sql`

**What it does:**
- Creates the `scholarships` table
- Sets up indexes
- Creates RLS policies
- Adds sample data

**How to run:**
1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/001_create_scholarships.sql`
3. Copy all SQL code
4. Paste into SQL Editor
5. Click **Run**

---

### 2. **Migration 002: User Profiles Table** ✅ REQUIRED
**File:** `supabase/migrations/002_create_user_profiles.sql`

**What it does:**
- Creates the `user_profiles` table
- Sets up RBAC (Role-Based Access Control)
- Creates RLS policies
- Adds trigger to auto-create profiles on signup

**How to run:**
1. Still in SQL Editor (or new query)
2. Open `supabase/migrations/002_create_user_profiles.sql`
3. Copy all SQL code
4. Paste into SQL Editor
5. Click **Run**

---

### 3. **Migration 002 Fix: RLS Recursion** ⚠️ OPTIONAL (if you get recursion errors)
**File:** `supabase/migrations/002_fix_rls_recursion.sql`

**What it does:**
- Fixes infinite recursion in RLS policies
- Only needed if you see recursion errors

**When to run:** Only if you get `infinite recursion detected in policy` errors

---

### 4. **Migration 003: Allow Service Role Seeding** ⚠️ OPTIONAL (for seeding)
**File:** `supabase/migrations/003_allow_service_role_seeding.sql`

**What it does:**
- Allows service role to insert/update scholarships
- Needed for seeding if you don't have service role key

**When to run:** 
- If you want to seed without service role key
- OR skip this and add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` instead

---

## Quick Migration Checklist

- [ ] Run `001_create_scholarships.sql` in Supabase SQL Editor
- [ ] Run `002_create_user_profiles.sql` in Supabase SQL Editor
- [ ] (Optional) Run `003_allow_service_role_seeding.sql` if seeding without service role key
- [ ] Verify tables exist (see below)

---

## Verify Migrations Worked

Run this in Supabase SQL Editor:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('scholarships', 'user_profiles');

-- Should return:
-- scholarships
-- user_profiles
```

---

## After Migrations

### Option A: Use Service Role Key (Recommended)

1. Get service role key from Supabase:
   - Dashboard → Settings → API
   - Copy **Service Role Key** (secret)

2. Add to `.env.local`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

4. Run seed:
   ```bash
   curl -X POST http://localhost:3000/api/scholarships/seed
   ```

### Option B: Run Migration 003 (Alternative)

1. Run `003_allow_service_role_seeding.sql` in Supabase
2. Run seed (will use anon key):
   ```bash
   curl -X POST http://localhost:3000/api/scholarships/seed
   ```

---

## Current Status

Based on the error you're seeing:
- ❌ **RLS is blocking inserts** - This means migrations 001 and 002 are likely already run
- ✅ **Tables exist** - The error shows RLS is active (tables must exist)
- ⚠️ **Need to bypass RLS** - Either add service role key OR run migration 003

---

## Next Steps

1. **Check if tables exist:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **If tables exist:** You just need to bypass RLS (Option A or B above)

3. **If tables don't exist:** Run migrations 001 and 002 first

---

## Summary

**For seeding to work, you need:**
1. ✅ Tables created (migrations 001 & 002)
2. ✅ RLS bypass (service role key OR migration 003)

**Current situation:**
- Tables likely exist (RLS is active)
- Need to bypass RLS for seeding
- Choose Option A (service role key) or Option B (migration 003)

