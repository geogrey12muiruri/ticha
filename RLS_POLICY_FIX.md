# 🔒 RLS Policy Infinite Recursion Fix

## Problem

**Error:**
```
{
  "code": "42P17",
  "message": "infinite recursion detected in policy for relation \"user_profiles\""
}
```

**Cause:**
The admin RLS policies were querying the `user_profiles` table to check if a user is an admin:
```sql
EXISTS (
  SELECT 1 FROM user_profiles
  WHERE id = auth.uid() AND role = 'admin'
)
```

This creates infinite recursion:
1. Policy checks if user is admin → queries `user_profiles`
2. Query triggers RLS policy check → queries `user_profiles` again
3. Infinite loop! 🔄

---

## Solution

Use a **`SECURITY DEFINER` function** that bypasses RLS to check admin status.

### Fixed Migration

The migration now includes:

```sql
-- Helper function that bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- SECURITY DEFINER allows bypassing RLS
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Admin policies use the helper function
CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  USING (public.is_admin(auth.uid()));
```

**Key Points:**
- ✅ `SECURITY DEFINER` - Runs with creator's privileges, bypasses RLS
- ✅ `STABLE` - Function result doesn't change within a transaction
- ✅ No recursion - Function bypasses RLS, so no policy check loop

---

## How to Fix

### Option 1: Drop and Recreate Policies (Recommended)

Run this in Supabase SQL Editor:

```sql
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create helper function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate policies with fixed logic
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON user_profiles
  FOR UPDATE
  USING (public.is_admin(auth.uid()));
```

### Option 2: Run Updated Migration

The migration file has been updated. You can:
1. Drop the table (if no important data): `DROP TABLE user_profiles CASCADE;`
2. Run the updated migration: `002_create_user_profiles.sql`

**⚠️ Warning:** Dropping the table will delete all user profiles!

---

## Verification

After fixing, test:

```sql
-- Test 1: Check function exists
SELECT public.is_admin('your-user-id-here');

-- Test 2: Try to query user_profiles (should work)
SELECT * FROM user_profiles WHERE id = auth.uid();

-- Test 3: Check policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

---

## Why This Works

### Before (Infinite Recursion)
```
Policy Check → Query user_profiles → Policy Check → Query user_profiles → ...
```

### After (No Recursion)
```
Policy Check → Call is_admin() → Bypass RLS → Query user_profiles → Return result
```

**`SECURITY DEFINER`** means the function runs with the privileges of the function creator (usually a superuser), so it bypasses RLS entirely.

---

## Alternative Solutions

### Option A: Store Admin in JWT Claims
- Add admin status to JWT token
- Check JWT claim instead of querying table
- More complex but avoids database queries

### Option B: Separate Admin Table
- Create `admins` table
- Check admin status from separate table
- Avoids querying `user_profiles`

### Option C: Disable RLS for Admin Checks
- Use `SECURITY DEFINER` functions (current solution)
- Simplest and most common approach

---

## Summary

✅ **Fixed:** Admin policies now use `SECURITY DEFINER` function
✅ **No Recursion:** Function bypasses RLS, preventing infinite loops
✅ **Secure:** Still maintains proper access control
✅ **Simple:** One helper function solves the issue

The updated migration file is ready to use! 🎉

