# 🔐 Google OAuth Setup Guide

## Step 1: Configure Google OAuth in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Navigate to your project: https://supabase.com/dashboard
   - Select your project

2. **Enable Google Provider**
   - Go to **Authentication** → **Providers**
   - Find **Google** in the list
   - Click **Enable**

3. **Get Google OAuth Credentials**
   - You'll need to create OAuth credentials in Google Cloud Console
   - Follow the link provided in Supabase (or see steps below)

## Step 2: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" or "Google Identity"
   - Click **Enable**

3. **Create OAuth 2.0 Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - If prompted, configure OAuth consent screen first:
     - User Type: **External** (for testing)
     - App name: **Jifunze AI**
     - Support email: Your email
     - Developer contact: Your email
     - Click **Save and Continue**
     - Scopes: Add `email`, `profile`, `openid`
     - Test users: Add your email (for testing)
     - Click **Save and Continue**

4. **Create OAuth Client**
   - Application type: **Web application**
   - Name: **Jifunze AI**
   - Authorized redirect URIs: Add these:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     http://localhost:3001/auth/callback
     http://localhost:3000/auth/callback
     ```
   - Click **Create**
   - **Copy the Client ID and Client Secret**

## Step 3: Add Credentials to Supabase

1. **Back in Supabase Dashboard**
   - Go to **Authentication** → **Providers** → **Google**
   - Paste your **Client ID** and **Client Secret**
   - Click **Save**

2. **Configure Redirect URL**
   - Make sure the redirect URL in Supabase matches:
     ```
     http://localhost:3001/auth/callback
     ```
   - For production, use:
     ```
     https://your-domain.com/auth/callback
     ```

## Step 4: Update Environment Variables (Optional)

If you need to customize the redirect URL, add to `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Step 5: Test Google Sign-In

1. **Start your dev server**
   ```bash
   npm run dev
   ```

2. **Go to login page**
   - Visit: http://localhost:3001/login
   - Click **Continue with Google**
   - You should be redirected to Google sign-in
   - After signing in, you'll be redirected back to the dashboard

## Troubleshooting

### Issue: "Redirect URI mismatch"
**Fix**: 
- Check that the redirect URI in Google Cloud Console matches exactly:
  - `http://localhost:3001/auth/callback` (or your port)
  - Make sure there's no trailing slash
  - Check Supabase redirect URL in Auth settings

### Issue: "OAuth consent screen not configured"
**Fix**:
- Complete the OAuth consent screen setup in Google Cloud Console
- Add your email as a test user if using "External" user type

### Issue: "Invalid client"
**Fix**:
- Verify Client ID and Client Secret are correct in Supabase
- Make sure you copied the entire secret (no spaces)

### Issue: Redirects to login with error
**Fix**:
- Check browser console for errors
- Verify the callback route is working: `/auth/callback`
- Check Supabase logs in Dashboard → Logs → Auth

## Quick Checklist

- [ ] Google provider enabled in Supabase
- [ ] OAuth consent screen configured in Google Cloud
- [ ] OAuth client created with correct redirect URIs
- [ ] Client ID and Secret added to Supabase
- [ ] Redirect URL matches in both places
- [ ] Test user added (if using External user type)
- [ ] Dev server running on correct port

## Production Setup

When deploying to production (Vercel):

1. **Update Google OAuth Redirect URIs**
   - Add your production URL:
     ```
     https://your-app.vercel.app/auth/callback
     ```

2. **Update Supabase Redirect URL**
   - Go to Supabase → Authentication → URL Configuration
   - Add your production site URL

3. **Update Environment Variables in Vercel**
   - Add all your env vars to Vercel dashboard
   - Make sure `NEXT_PUBLIC_APP_URL` points to production

That's it! Google sign-in should work now. 🎉





