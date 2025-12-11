# 🔧 Environment Variable Fix

## Problem

**Error:**
```
GROQ_API_KEY or GROK_API_KEY not found in environment variables
```

**Cause:**
- Environment variables without `NEXT_PUBLIC_` prefix are only available on the **server side**
- The AI service was being called from **client-side code** (dashboard page)
- Client-side code can't access server-only environment variables

---

## Solution

### ✅ 1. Created API Route for AI Matching

**New Route:** `/api/ai/match`

**Why:**
- API routes run on the **server** where environment variables are available
- Client calls the API route instead of the service directly
- Keeps API keys secure (never exposed to client)

**Usage:**
```typescript
// Client-side code
const response = await fetch('/api/ai/match', {
  method: 'POST',
  body: JSON.stringify({ profile }),
})
```

### ✅ 2. Updated Service to Use API Route

**Before:**
```typescript
// ❌ Called AI service directly (client-side)
const matches = await AIOpportunityMatcherService.matchWithAI(...)
```

**After:**
```typescript
// ✅ Calls API route (server-side)
const response = await fetch('/api/ai/match', {
  method: 'POST',
  body: JSON.stringify({ profile }),
})
```

### ✅ 3. Improved Error Messages

Now provides clearer error messages:
- Server-side: "Please add it to your .env.local file"
- Client-side: "Please use the API route instead"

---

## Environment Variable Setup

### Step 1: Check Your `.env.local` File

Make sure you have:
```bash
GROQ_API_KEY=your_key_here
# OR
GROK_API_KEY=your_key_here
```

**Important:**
- ✅ Use `GROQ_API_KEY` or `GROK_API_KEY` (not `NEXT_PUBLIC_GROQ_API_KEY`)
- ✅ File should be `.env.local` (not `.env`)
- ✅ Restart dev server after adding/changing env vars

### Step 2: Verify Variable is Loaded

**Check in terminal:**
```bash
# Should show your key (masked)
echo $GROQ_API_KEY
```

**Or check in code (server-side only):**
```typescript
// In API route or server component
console.log('API Key exists:', !!process.env.GROQ_API_KEY)
```

### Step 3: Restart Dev Server

**After adding/changing `.env.local`:**
```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

---

## How It Works Now

### Client-Side Flow

```
Dashboard Page (Client)
    ↓
ScholarshipAPIService.matchScholarships()
    ↓
fetch('/api/ai/match') ← API call
    ↓
/api/ai/match (Server)
    ↓
AIOpportunityMatcherService.matchWithAI()
    ↓
AIService.generateResponse()
    ↓
process.env.GROQ_API_KEY ← Available here!
```

### Why This Works

1. **Client** calls API route (HTTP request)
2. **Server** receives request (has access to env vars)
3. **Server** calls AI service (env vars available)
4. **Server** returns response to client

---

## Testing

### Test 1: Check Environment Variable

```bash
# In terminal
cat .env.local | grep GROQ
```

Should show:
```
GROQ_API_KEY=gsk_...
```

### Test 2: Test API Route Directly

```bash
curl -X POST http://localhost:3000/api/ai/match \
  -H "Content-Type: application/json" \
  -d '{"profile": {"county": "Kiambu", "grade": 8}}'
```

Should return matches (or error if key is missing).

### Test 3: Test from Dashboard

1. Complete profile
2. Check browser console for errors
3. Should see matches returned

---

## Common Issues

### Issue 1: "Variable not found" even though it's in `.env.local`

**Solution:**
- ✅ Restart dev server
- ✅ Check file name is exactly `.env.local`
- ✅ Check variable name is exactly `GROQ_API_KEY` or `GROK_API_KEY`
- ✅ No spaces around `=`

### Issue 2: "Please use the API route instead"

**Solution:**
- ✅ This means you're calling AI service from client
- ✅ Use the API route instead: `/api/ai/match`
- ✅ Already fixed in `ScholarshipAPIService`

### Issue 3: API route returns 500 error

**Check:**
1. Is `GROQ_API_KEY` in `.env.local`?
2. Did you restart the server?
3. Check server logs for detailed error

---

## Summary

✅ **Fixed:** AI matching now uses API route (server-side)
✅ **Secure:** API keys never exposed to client
✅ **Works:** Environment variables accessible on server
✅ **Fallback:** Rule-based matching if AI fails

The error should now be resolved! 🎉

**Next Steps:**
1. Verify `.env.local` has `GROQ_API_KEY`
2. Restart dev server
3. Test matching from dashboard

