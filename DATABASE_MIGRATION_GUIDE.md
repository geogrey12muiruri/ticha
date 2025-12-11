# 🗄️ Database Migration Guide

## Overview

You're using **Supabase directly** (not an ORM like Prisma). This means you need to run SQL migrations manually in the Supabase dashboard.

---

## Current Status

### ✅ Existing Migrations
- `001_create_scholarships.sql` - Creates scholarships table

### ❌ Missing Migrations
- `002_create_user_profiles.sql` - Creates user_profiles table (needed for RBAC)

---

## Error You're Seeing

```
{
  "code": "PGRST205",
  "message": "Could not find the table 'public.user_profiles' in the schema cache"
}
```

**This means:** The `user_profiles` table doesn't exist in your Supabase database.

---

## Solution: Run Migrations

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run Migration 001 (if not done)

If you haven't run the scholarships migration yet:

1. Open `supabase/migrations/001_create_scholarships.sql`
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Click **Run** (or press `Ctrl+Enter`)
5. Verify success message

### Step 3: Run Migration 002 (Required)

1. Open `supabase/migrations/002_create_user_profiles.sql`
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Verify success message

### Step 4: Verify Tables Exist

Run this query to verify:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('scholarships', 'user_profiles');
```

You should see both tables listed.

---

## What Gets Created

### `user_profiles` Table

**Purpose:** Extends Supabase `auth.users` with role-based access control

**Fields:**
- `id` - References `auth.users(id)`
- `role` - Enum: student, provider, verifier, admin
- `organization_name` - For providers
- `verified` - Verification status
- `created_at`, `updated_at` - Timestamps

**Auto-Features:**
- ✅ Auto-creates profile when user signs up
- ✅ Auto-updates `updated_at` timestamp
- ✅ Row Level Security (RLS) enabled
- ✅ Users can only see/edit their own profile

---

## How It Works (No ORM)

### Direct Supabase Client

You're using the Supabase JavaScript client directly:

```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Querying Tables

```typescript
// Example from rbac.service.ts
const { data, error } = await supabase
  .from('user_profiles')  // Direct table name
  .select('role')
  .eq('id', userId)
  .single()
```

**No ORM means:**
- ✅ No schema files to sync
- ✅ No migrations to run via CLI
- ✅ Direct SQL control
- ⚠️ Must run migrations manually in Supabase

---

## Verification Steps

### 1. Check Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 2. Check RLS Policies

```sql
SELECT * FROM pg_policies 
WHERE tablename = 'user_profiles';
```

### 3. Test User Profile Creation

After a user signs up, check:

```sql
SELECT * FROM user_profiles 
WHERE id = '<user-id>';
```

### 4. Test in Application

```typescript
// This should work after migration
import { RBACService } from '@/services/rbac.service'

const role = await RBACService.getUserRole(userId)
console.log('User role:', role) // Should return 'student' by default
```

---

## Troubleshooting

### Error: "relation already exists"

**Solution:** The table already exists. You can:
1. Skip the migration
2. Or use `CREATE TABLE IF NOT EXISTS` (already in migration)

### Error: "permission denied"

**Solution:** 
1. Check you're using the correct Supabase project
2. Verify your API keys are correct
3. Check RLS policies allow your operations

### Error: "type already exists"

**Solution:** The enum type already exists. The migration handles this with `DO $$ BEGIN ... EXCEPTION ... END $$;`

### Profile Not Auto-Created on Signup

**Check:**
1. Trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. Function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
3. Test by creating a new user

---

## Migration Checklist

- [ ] Run `001_create_scholarships.sql`
- [ ] Run `002_create_user_profiles.sql`
- [ ] Verify both tables exist
- [ ] Verify RLS policies are enabled
- [ ] Test user signup creates profile
- [ ] Test RBAC service works
- [ ] Check browser console for errors

---

## Future Migrations

When you need to add more tables:

1. Create new file: `supabase/migrations/003_create_<table_name>.sql`
2. Write SQL migration
3. Run in Supabase SQL Editor
4. Document in this guide

**Example:**
```sql
-- 003_create_student_profiles.sql
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  -- ... fields
);
```

---

## Integration Status

### ✅ Completed
- Supabase client configured
- RBAC service uses `user_profiles` table
- Migration files created

### ⚠️ Pending
- Run migrations in Supabase dashboard
- Verify tables exist
- Test user profile creation

### 🔮 Future
- Add `student_profiles` table (for detailed student data)
- Add `scholarship_applications` table
- Add audit logging

---

## Quick Reference

**Run Migration:**
1. Supabase Dashboard → SQL Editor
2. Paste migration SQL
3. Click Run

**Check Tables:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Check User Profiles:**
```sql
SELECT * FROM user_profiles LIMIT 10;
```

**Test RBAC:**
```typescript
const role = await RBACService.getUserRole(userId)
```

---

## Summary

✅ **You're using Supabase directly** (no ORM)
✅ **Migrations are SQL files** you run manually
✅ **Run `002_create_user_profiles.sql`** to fix the error
✅ **Tables auto-create** when users sign up (via trigger)
✅ **RLS policies** protect data access

After running the migration, the error should be resolved! 🎉

