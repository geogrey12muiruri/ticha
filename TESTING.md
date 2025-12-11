# 🧪 Testing Checklist

## Quick Test Flow (5 minutes)

### 1. ✅ Server Started
- [ ] Dev server running on http://localhost:3000
- [ ] No console errors on startup
- [ ] Landing page loads correctly

### 2. 🔐 Authentication Test
- [ ] Go to `/login`
- [ ] Create a test account (use a real email for verification)
- [ ] Sign in successfully
- [ ] Redirects to `/dashboard`

**Note**: Supabase may require email verification. For testing, you can:
- Use Supabase Dashboard → Authentication → Users → Disable email confirmation
- OR use a real email and verify it

### 3. 💬 Chat/AI Test
- [ ] Go to `/chat` (or click from dashboard)
- [ ] Type a test question: "Explain photosynthesis"
- [ ] AI responds within 5-10 seconds
- [ ] Response is relevant and in English
- [ ] Try Kiswahili: "Eleza kuhusu uhai"
- [ ] AI responds appropriately

### 4. 🎨 UI/UX Test
- [ ] All pages load without errors
- [ ] Mobile responsive (test in browser dev tools)
- [ ] Buttons work
- [ ] Navigation flows correctly

## Common Issues & Fixes

### Issue: "Missing Supabase environment variables"
**Fix**: 
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after adding env vars

### Issue: "GROQ_API_KEY not found"
**Fix**:
- Check `.env.local` has `GROQ_API_KEY=groq_...`
- Restart dev server
- Verify key is correct (starts with `groq_`)

### Issue: "Email not verified" (Supabase)
**Fix**:
- Go to Supabase Dashboard → Authentication → Settings
- Disable "Enable email confirmations" for testing
- OR verify email from inbox

### Issue: AI not responding
**Fix**:
- Check browser console for errors
- Check terminal for API errors
- Verify Groq API key is valid
- Check Groq dashboard for rate limits

### Issue: CORS errors
**Fix**:
- This shouldn't happen with Next.js API routes
- If it does, check `next.config.ts`

## 🎯 What to Test Before Hackathon

1. **Full User Flow**:
   - Sign up → Login → Dashboard → Chat → Ask question → Get response

2. **Edge Cases**:
   - Empty messages
   - Very long messages
   - Special characters
   - Network errors (disconnect wifi briefly)

3. **Mobile**:
   - Test on actual phone
   - Test on slow 3G connection
   - Test keyboard interactions

4. **Performance**:
   - AI response time (< 10 seconds)
   - Page load time
   - Smooth scrolling in chat

## ✅ Success Criteria

- [x] Can create account and login
- [x] Can access chat interface
- [x] AI responds to questions
- [x] Responses are relevant and helpful
- [x] UI looks good on mobile
- [x] No console errors

## 🚀 Ready for Hackathon?

If all checks pass, you're ready to build features! Next priorities:
1. Add curriculum selector
2. Add subject filtering
3. Improve mobile UI
4. Add quiz generation
5. Deploy to Vercel





