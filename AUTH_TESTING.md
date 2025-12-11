# 🔐 Authentication Testing Guide

## ✅ Pre-Testing Checklist

### 1. Environment Variables
- [ ] `.env.local` file exists
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] Values are correct (no quotes, no spaces)

### 2. Supabase Configuration
- [ ] Project is active in Supabase dashboard
- [ ] Email provider is enabled
- [ ] Email confirmation settings configured (see below)

## 🧪 Testing Steps

### Test 1: Email/Password Sign Up

1. **Go to login page**
   - Visit: http://localhost:3000/login
   - Should see login form

2. **Click "Don't have an account? Sign up"**
   - Form should switch to sign-up mode

3. **Enter test credentials**
   - Email: `test@example.com` (use a real email you can access)
   - Password: `TestPassword123!` (min 6 characters)
   - Click "Sign Up"

4. **Expected Result:**
   - ✅ Alert: "Check your email for verification!"
   - ⚠️ **If email confirmation is enabled**, check your email
   - ⚠️ **If disabled**, you should be logged in immediately

### Test 2: Email/Password Sign In

1. **Go to login page**
   - Visit: http://localhost:3000/login

2. **Enter credentials**
   - Email: Your test email
   - Password: Your test password
   - Click "Sign In"

3. **Expected Result:**
   - ✅ Redirects to `/dashboard`
   - ✅ Shows welcome message with your email
   - ✅ Session saved for offline access

### Test 3: Sign Out

1. **From dashboard**
   - Click "Sign Out" button

2. **Expected Result:**
   - ✅ Redirects to `/login`
   - ✅ Session cleared
   - ✅ Can't access dashboard without login

### Test 4: Protected Routes

1. **Try accessing dashboard without login**
   - Visit: http://localhost:3000/dashboard
   - Should redirect to `/login`

2. **Try accessing chat without login**
   - Visit: http://localhost:3000/chat
   - Should redirect to `/login`

### Test 5: Offline Session (Optional)

1. **Sign in while online**
   - Complete sign in process

2. **Disconnect internet** (or use browser DevTools → Network → Offline)

3. **Refresh page**
   - Should still show dashboard
   - Should show "Offline Mode" badge

## ⚙️ Supabase Email Settings

### For Quick Testing (Disable Email Confirmation)

1. **Go to Supabase Dashboard**
   - Navigate to: Authentication → Settings

2. **Email Auth Settings**
   - Find "Enable email confirmations"
   - **Toggle OFF** for testing
   - Click "Save"

3. **Now sign-ups work immediately** (no email verification needed)

### For Production (Enable Email Confirmation)

1. **Keep "Enable email confirmations" ON**
2. **Configure email templates** (optional)
3. **Users must verify email before login**

## 🐛 Common Issues & Fixes

### Issue: "Invalid login credentials"
**Possible Causes:**
- Wrong email/password
- Email not verified (if confirmation enabled)
- User doesn't exist

**Fix:**
- Double-check credentials
- Check Supabase dashboard → Authentication → Users
- Disable email confirmation for testing

### Issue: "Email already registered"
**Fix:**
- User already exists
- Try signing in instead
- Or delete user from Supabase dashboard

### Issue: "Missing Supabase environment variables"
**Fix:**
- Check `.env.local` exists
- Verify variable names are correct
- Restart dev server after adding env vars

### Issue: "Network error" or "Failed to fetch"
**Fix:**
- Check Supabase URL is correct
- Check internet connection
- Verify Supabase project is active
- Check browser console for detailed error

### Issue: Redirects to login after sign in
**Fix:**
- Check session is being saved
- Check browser console for errors
- Verify Supabase client configuration
- Check if email confirmation is blocking

## 🔒 Security Notes

### For Testing:
- ✅ Disable email confirmation (faster testing)
- ✅ Use test emails
- ✅ Simple passwords OK for dev

### For Production:
- ✅ Enable email confirmation
- ✅ Enforce strong passwords
- ✅ Add rate limiting
- ✅ Enable MFA (optional)

## 📝 Quick Test Script

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
# Visit: http://localhost:3000/login

# 3. Test sign up
# Email: test@example.com
# Password: Test123!

# 4. Test sign in
# Same credentials

# 5. Test sign out
# Click sign out button

# 6. Test protected routes
# Try /dashboard (should redirect)
```

## ✅ Success Criteria

Authentication is working if:
- [x] Can sign up with email/password
- [x] Can sign in with email/password
- [x] Redirects to dashboard after login
- [x] Can sign out successfully
- [x] Protected routes redirect to login
- [x] Session persists on page refresh
- [x] Offline session works (optional)

## 🚀 Ready to Test!

Your authentication is **ready for testing** if:
1. ✅ Supabase credentials are in `.env.local`
2. ✅ Dev server is running
3. ✅ You've configured email settings in Supabase

**Go ahead and test!** Start with sign up, then sign in, then test the protected routes.




