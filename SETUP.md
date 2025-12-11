# 🚀 Hackathon Setup Checklist

## ✅ Completed Setup

- [x] Next.js 16 project initialized
- [x] Tailwind CSS v4 configured
- [x] shadcn/ui components installed
- [x] Supabase packages installed
- [x] Vercel AI SDK installed
- [x] Project structure created
- [x] Core files created:
  - [x] Landing page (`/`)
  - [x] Login page (`/login`)
  - [x] Dashboard (`/dashboard`)
  - [x] Chat interface (`/chat`)
  - [x] API route (`/api/chat`)
  - [x] Supabase client
  - [x] Type definitions
  - [x] AI system prompt

## 🔧 Next Steps (Before Hackathon Starts)

### 1. Set Up Supabase (5 minutes)
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Copy URL and anon key
- [ ] Add to `.env.local`

### 2. Get Groq API Key (2 minutes)
- [ ] Go to [console.groq.com](https://console.groq.com)
- [ ] Sign up (free!)
- [ ] Create API key
- [ ] Add to `.env.local` as `GROQ_API_KEY`

### 3. Test Locally
- [ ] Run `npm run dev`
- [ ] Test login flow
- [ ] Test chat interface
- [ ] Verify AI responses work

### 4. Prepare for Demo
- [ ] Create demo account
- [ ] Prepare sample questions
- [ ] Test on mobile device
- [ ] Record 2-min demo video

## 🎯 Hackathon Day Priorities

### Hour 1-2: Polish & Test
- [ ] Fix any bugs
- [ ] Add curriculum selector
- [ ] Improve mobile UI
- [ ] Test on real phones

### Hour 3-4: Core Features
- [ ] Subject filtering
- [ ] Quiz generation
- [ ] Progress tracking
- [ ] Better error handling

### Hour 5-6: Polish & Deploy
- [ ] Deploy to Vercel
- [ ] Test production build
- [ ] Create pitch deck
- [ ] Record demo

### Hour 7-8: Buffer & Practice
- [ ] Practice pitch (3x)
- [ ] Prepare Q&A answers
- [ ] Network with judges
- [ ] Submit early!

## 📦 What's Ready to Use

### Pages
- **Landing Page** (`/`) - Beautiful hero with features
- **Login** (`/login`) - Auth with Supabase
- **Dashboard** (`/dashboard`) - User home
- **Chat** (`/chat`) - AI tutor interface

### Components Available
- Button, Card, Input, Textarea
- Avatar, Badge, Skeleton
- Form, Sheet, Separator
- Sonner (toast notifications)

### API
- `/api/chat` - POST endpoint for AI responses
  - Body: `{ message: string, context?: ChatContext }`
  - Returns: `{ response: string }`

## 🐛 Common Issues

### "GROQ_API_KEY not found"
- Check `.env.local` exists
- Restart dev server after adding env vars
- Verify key starts with `groq_`

### "Supabase auth error"
- Check URL and anon key are correct
- Verify Supabase project is active
- Check email verification settings

### "Module not found"
- Run `npm install` again
- Check `node_modules` exists
- Verify imports use `@/` alias

## 💡 Pro Tips

1. **Test early**: Don't wait until the last hour to test AI responses
2. **Mobile first**: Test on actual phones, not just browser dev tools
3. **Backup plan**: If AI fails, have a static demo ready
4. **Documentation**: Keep this checklist handy during the hackathon
5. **Sleep**: Take micro-naps (20 min) to stay sharp

## 🎉 You're Ready!

Everything is set up. Just add your API keys and start building! Good luck! 🚀

