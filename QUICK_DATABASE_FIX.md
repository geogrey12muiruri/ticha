# Quick Database Fix

## Problem
The API is returning "Internal Server Error" because the `scholarships` table doesn't exist in Supabase.

## Solution Options

### Option 1: Run the Migration (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_create_scholarships.sql`
4. Click **Run** to execute the migration

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

3. **Run Migration**
   - Open `supabase/migrations/001_create_scholarships.sql`
   - Copy all SQL code
   - Paste into SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify**
   - Go to "Table Editor"
   - You should see `scholarships`, `user_profiles`, `forms`, and `audit_logs` tables

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


