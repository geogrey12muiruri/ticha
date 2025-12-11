# ✅ Integration Checklist

## Database Setup

### Required Migrations

- [ ] **Migration 001**: Run `001_create_scholarships.sql` in Supabase SQL Editor
- [ ] **Migration 002**: Run `002_create_user_profiles.sql` in Supabase SQL Editor
- [ ] Verify `scholarships` table exists
- [ ] Verify `user_profiles` table exists
- [ ] Verify RLS policies are enabled

### Verification Queries

Run these in Supabase SQL Editor to verify:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('scholarships', 'user_profiles');

-- Check user_profiles structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles';

-- Check scholarships structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'scholarships';
```

---

## Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set in `.env.local`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set in `.env.local`
- [ ] `GROQ_API_KEY` is set (for AI features)

---

## Application Features

### Authentication
- [ ] Users can sign up
- [ ] Users can log in
- [ ] User profile auto-creates on signup (check `user_profiles` table)

### Profile Management
- [ ] Users can complete minimal profile
- [ ] Profile saves to localStorage
- [ ] Profile loads on login
- [ ] Profile persists across sessions

### Scholarships
- [ ] API endpoint `/api/scholarships` works
- [ ] Scholarships can be fetched
- [ ] Matching works with user profile
- [ ] Dashboard shows matched opportunities

### RBAC (Role-Based Access Control)
- [ ] `RBACService.getUserRole()` works
- [ ] Default role is 'student'
- [ ] Users can view their own profile
- [ ] RLS policies protect data

---

## Testing

### Manual Tests

1. **Sign Up Test:**
   ```typescript
   // After signup, check database
   SELECT * FROM user_profiles WHERE id = '<new-user-id>';
   // Should show role = 'student', verified = true
   ```

2. **Profile Test:**
   - Complete profile wizard
   - Check localStorage: `localStorage.getItem('student_profile')`
   - Refresh page → Profile should load

3. **API Test:**
   ```bash
   curl http://localhost:3000/api/scholarships
   # Should return JSON (even if empty array)
   ```

4. **RBAC Test:**
   ```typescript
   const role = await RBACService.getUserRole(userId)
   console.log(role) // Should be 'student'
   ```

---

## Common Issues & Fixes

### Issue: "Could not find table 'user_profiles'"
**Fix:** Run migration `002_create_user_profiles.sql`

### Issue: "Could not find table 'scholarships'"
**Fix:** Run migration `001_create_scholarships.sql`

### Issue: Profile not auto-creating on signup
**Fix:** Check trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Issue: RLS blocking queries
**Fix:** Check policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

---

## Integration Status

### ✅ Completed
- Supabase client configured
- Migration files created
- RBAC service implemented
- Profile wizard created
- API endpoints created

### ⚠️ Pending
- Run migrations in Supabase
- Test user signup flow
- Verify profile persistence
- Test scholarship matching

### 🔮 Future
- Database storage for profiles (replace localStorage)
- Student profiles table
- Scholarship applications table
- Audit logging

---

## Quick Start Commands

```bash
# 1. Set environment variables
cp env.example .env.local
# Edit .env.local with your keys

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Run migrations in Supabase dashboard
# - Go to SQL Editor
# - Run 001_create_scholarships.sql
# - Run 002_create_user_profiles.sql

# 5. Test
curl http://localhost:3000/api/scholarships
```

---

## Summary

**You're using Supabase directly (no ORM)**, so:
- ✅ Migrations are SQL files you run manually
- ✅ No CLI commands needed
- ✅ Just copy-paste SQL into Supabase dashboard
- ✅ Tables auto-create on user signup (via triggers)

**After running both migrations, everything should work!** 🎉

