# ⚡ Quick Authentication Test (2 minutes)

## Step 1: Verify Setup

```bash
# Check if .env.local exists and has Supabase credentials
cat .env.local | grep SUPABASE
```

Should show:
- `NEXT_PUBLIC_SUPABASE_URL=https://...`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

## Step 2: Start Server

```bash
npm run dev
```

Server should start on http://localhost:3000

## Step 3: Test Sign Up

1. **Open browser**: http://localhost:3000/login
2. **Click**: "Don't have an account? Sign up"
3. **Enter**:
   - Email: `test@example.com` (use real email)
   - Password: `Test123!`
4. **Click**: "Sign Up"
5. **Expected**: Alert or redirect to dashboard

## Step 4: Test Sign In

1. **If logged out**, go to: http://localhost:3000/login
2. **Enter**:
   - Email: `test@example.com`
   - Password: `Test123!`
3. **Click**: "Sign In"
4. **Expected**: Redirects to dashboard with welcome message

## Step 5: Test Sign Out

1. **From dashboard**, click "Sign Out"
2. **Expected**: Redirects to login page

## ✅ If All Pass: Authentication is Working!

## ❌ If Issues:

### "Missing Supabase environment variables"
→ Check `.env.local` exists and has correct values

### "Invalid login credentials"
→ Check email/password are correct
→ Check Supabase dashboard → Users (user exists?)

### "Email not verified"
→ Go to Supabase → Authentication → Settings
→ Disable "Enable email confirmations" for testing

### "Network error"
→ Check Supabase URL is correct
→ Check internet connection
→ Check Supabase project is active

---

**That's it!** If sign up, sign in, and sign out all work, you're good to go! 🎉




