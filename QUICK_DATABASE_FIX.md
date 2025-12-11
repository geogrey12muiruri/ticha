# Quick Database Fix

## Problems
1. The API is returning "Internal Server Error" because the `scholarships` table doesn't exist in Supabase.
2. RBAC service error: "Could not find the table 'public.user_profiles'" - the `user_profiles` table doesn't exist.

## Solution Options

### Option 1: Run the Migrations (Recommended)

**You need to run TWO migrations:**

1. **Migration 001 - Scholarships Table:**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Copy and paste the contents of `supabase/migrations/001_create_scholarships.sql`
   - Click **Run** to execute

2. **Migration 002 - User Profiles Table:**
   - Still in SQL Editor
   - Copy and paste the contents of `supabase/migrations/002_create_user_profiles.sql`
   - Click **Run** to execute

**Both migrations are required!**

### Option 2: Use Mock Data (Temporary)

The API now gracefully handles missing tables and returns an empty array. The app will work but won't show any scholarships until the database is set up.

### Option 3: Add Sample Data Manually

After running the migration, you can add sample scholarships through:
- Supabase Dashboard → Table Editor → scholarships
- Or use the POST `/api/scholarships` endpoint

## Quick Migration Steps

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run Migration 001 (Scholarships)**
   - Open `supabase/migrations/001_create_scholarships.sql`
   - Copy all SQL code
   - Paste into SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - Wait for success message

4. **Run Migration 002 (User Profiles)**
   - Open `supabase/migrations/002_create_user_profiles.sql`
   - Copy all SQL code
   - Paste into SQL Editor (new query or same one)
   - Click "Run"
   - Wait for success message

5. **Verify**
   - Go to "Table Editor"
   - You should see:
     - ✅ `scholarships` table
     - ✅ `user_profiles` table

## Testing

After running the migration, test the API:
```bash
curl http://localhost:3000/api/scholarships
```

You should get:
```json
{
  "scholarships": [],
  "count": 0,
  "limit": 100,
  "offset": 0
}
```

## Next Steps

Once the table exists:
1. Add sample scholarships (manually or via API)
2. The matching will work automatically
3. Students will see their matched opportunities


