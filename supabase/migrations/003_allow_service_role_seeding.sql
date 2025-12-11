-- Allow Service Role to Insert/Update Scholarships (for seeding)
-- This migration allows server-side seeding operations to bypass RLS

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can insert scholarships" ON scholarships;
DROP POLICY IF EXISTS "Service role can update scholarships" ON scholarships;

-- Allow service role to insert (for seeding/admin operations)
-- Service role bypasses RLS by default, but this makes it explicit
CREATE POLICY "Service role can insert scholarships"
  ON scholarships
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to update (for seeding/admin operations)
CREATE POLICY "Service role can update scholarships"
  ON scholarships
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Note: 
-- 1. Service role key should be in .env.local as SUPABASE_SERVICE_ROLE_KEY
-- 2. This key bypasses all RLS policies and should be kept secret
-- 3. Never use service role key in client-side code
