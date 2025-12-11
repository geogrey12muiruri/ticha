# 🔧 Seeding Fix - RLS Policy Issue

## Problem

The seed script is failing with:
```
new row violates row-level security policy for table "scholarships"
```

This is because RLS (Row Level Security) is blocking unauthenticated inserts.

## Solution Options

### Option 1: Use Service Role Key (Recommended)

The service role key bypasses all RLS policies.

#### Step 1: Get Service Role Key from Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Find **Service Role Key** (secret)
4. Copy the key

#### Step 2: Add to `.env.local`

```bash
# Add this line to .env.local
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**⚠️ Important:** Never commit this key to git! It bypasses all security.

#### Step 3: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
# Restart it
npm run dev
```

#### Step 4: Run Seed Again

```bash
curl -X POST http://localhost:3000/api/scholarships/seed
```

---

### Option 2: Run SQL Migration (Alternative)

If you don't want to use the service role key, you can run a SQL migration to allow seeding.

#### Step 1: Run Migration in Supabase

1. Go to Supabase SQL Editor
2. Copy and paste the contents of `supabase/migrations/003_allow_service_role_seeding.sql`
3. Click **Run**

This creates policies that allow service role to insert/update.

#### Step 2: Run Seed Again

```bash
curl -X POST http://localhost:3000/api/scholarships/seed
```

---

### Option 3: Temporarily Disable RLS (Quick Fix)

**⚠️ Only for development/testing!**

Run this in Supabase SQL Editor:

```sql
-- Temporarily disable RLS
ALTER TABLE scholarships DISABLE ROW LEVEL SECURITY;

-- Run your seed script
-- (curl -X POST http://localhost:3000/api/scholarships/seed)

-- Re-enable RLS
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
```

---

## Recommended Approach

**Use Option 1 (Service Role Key)** because:
- ✅ Most secure (key is secret, not in code)
- ✅ No need to modify database policies
- ✅ Works for all admin operations
- ✅ Standard practice for server-side operations

---

## Verify Seeding Worked

After seeding, check:

```bash
# Get all scholarships
curl http://localhost:3000/api/scholarships

# Should return multiple opportunities
```

Or check in Supabase:
```sql
SELECT name, type, provider, status, verified 
FROM scholarships 
ORDER BY created_at DESC;
```

---

## Troubleshooting

### Still Getting RLS Errors?

1. **Check environment variable is loaded:**
   ```bash
   # In your terminal
   echo $SUPABASE_SERVICE_ROLE_KEY
   # Should show the key (if set)
   ```

2. **Restart dev server** after adding the key

3. **Check Supabase logs** for detailed error messages

4. **Verify key is correct** - copy from Supabase dashboard again

---

## Security Note

The service role key has **full access** to your database and **bypasses all RLS policies**. 

- ✅ **Safe for:** Server-side operations, seeding, admin tasks
- ❌ **Never use for:** Client-side code, public APIs, user-facing features
- 🔒 **Keep secret:** Never commit to git, never expose in client code

---

## Next Steps

Once seeding is successful:
1. ✅ Test the dashboard
2. ✅ Complete your profile
3. ✅ View matched opportunities
4. ✅ Test filters and search

Happy testing! 🎉

