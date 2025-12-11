# 🔐 Google OAuth Quick Setup Guide

## Your Supabase Details

**Callback URL:** `https://wdwryfugcsxjviovxjnt.supabase.co/auth/v1/callback`

**Project Reference:** `wdwryfugcsxjviovxjnt`

---

## Step-by-Step Setup

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click "New Project"
   - Name: `Jifunze AI` (or any name)
   - Click "Create"
   - Wait for project creation, then select it

3. **Configure OAuth Consent Screen** (Required First)
   - Go to **APIs & Services** → **OAuth consent screen**
   - Select **External** (unless you have a Google Workspace)
   - Click **Create**

   **Fill in the form:**
   - App name: `Jifunze AI`
   - User support email: Your email
   - Developer contact information: Your email
   - Click **Save and Continue**

   **Scopes (Step 2):**
   - Click **Add or Remove Scopes**
   - Select: `email`, `profile`, `openid`
   - Click **Update** → **Save and Continue**

   **Test users (Step 3):**
   - Click **Add Users**
   - Add your email address (for testing)
   - Click **Save and Continue**

   **Summary:**
   - Review and click **Back to Dashboard**

4. **Create OAuth 2.0 Client ID**
   - Go to **APIs & Services** → **Credentials**
   - Click **+ Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `Jifunze AI Web Client`

   **Authorized redirect URIs** - Add these EXACT URLs:
   ```
   https://wdwryfugcsxjviovxjnt.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   ```

   - Click **Create**
   - **IMPORTANT:** Copy both:
     - **Client ID** (looks like: `123456789-abc...xyz.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-abc...xyz`)

---

### Step 2: Add Credentials to Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Enable Google Provider**
   - Go to **Authentication** → **Providers**
   - Find **Google** in the list
   - Click the toggle to **Enable** it

3. **Add Your Credentials**
   - **Client IDs (for OAuth):** Paste your Client ID from Google
   - **Client Secret (for OAuth):** Paste your Client Secret from Google
   
   **Optional Settings:**
   - ✅ **Skip nonce checks**: Leave unchecked (more secure)
   - ✅ **Allow users without an email**: Leave unchecked (we need emails)

4. **Click Save**

---

### Step 3: Verify Configuration

1. **Check Redirect URLs Match**
   - Supabase callback: `https://wdwryfugcsxjviovxjnt.supabase.co/auth/v1/callback`
   - Google Console: Should have the same URL in "Authorized redirect URIs"

2. **Test Locally**
   - Make sure your dev server is running: `npm run dev`
   - Go to: http://localhost:3000/login
   - Click "Continue with Google"
   - You should be redirected to Google sign-in
   - After signing in, you'll be redirected back to your app

---

## Troubleshooting

### ❌ "Redirect URI mismatch"
**Problem:** The redirect URI in Google Console doesn't match Supabase

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Click your OAuth 2.0 Client ID
3. Make sure this EXACT URL is in "Authorized redirect URIs":
   ```
   https://wdwryfugcsxjviovxjnt.supabase.co/auth/v1/callback
   ```
4. No trailing slashes, exact match required

### ❌ "OAuth consent screen not configured"
**Problem:** You skipped the OAuth consent screen setup

**Fix:**
1. Go to Google Cloud Console → OAuth consent screen
2. Complete all steps (App info, Scopes, Test users)
3. Make sure it's published or you're added as a test user

### ❌ "Invalid client"
**Problem:** Client ID or Secret is wrong

**Fix:**
1. Double-check you copied the entire Client ID and Secret
2. No extra spaces or line breaks
3. Make sure you're using the "Web application" credentials, not Android/iOS

### ❌ "Access blocked: This app's request is invalid"
**Problem:** OAuth consent screen not published or you're not a test user

**Fix:**
1. Go to OAuth consent screen
2. Add your email as a test user
3. OR publish the app (requires verification for production)

---

## Quick Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created (Web application)
- [ ] Redirect URI added: `https://wdwryfugcsxjviovxjnt.supabase.co/auth/v1/callback`
- [ ] Client ID and Secret copied
- [ ] Google provider enabled in Supabase
- [ ] Client ID added to Supabase
- [ ] Client Secret added to Supabase
- [ ] Tested sign-in flow

---

## Production Setup

When deploying to production (Vercel):

1. **Add Production Redirect URI in Google Console:**
   ```
   https://your-app.vercel.app/auth/callback
   ```

2. **Update Supabase Site URL:**
   - Go to Supabase → Authentication → URL Configuration
   - Add your production URL

3. **Update Environment Variables:**
   - Add `NEXT_PUBLIC_APP_URL=https://your-app.vercel.app` to Vercel

---

## 🎉 You're Done!

Once configured, users can sign in with Google with one click! The flow:
1. User clicks "Continue with Google"
2. Redirected to Google sign-in
3. After authentication, redirected back to your app
4. Automatically logged in

Good luck with your hackathon! 🚀





