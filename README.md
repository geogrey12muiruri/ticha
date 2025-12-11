# Jifunze AI 🚀

**AI-Powered Learning Companion for Kenyan Students**

Built for the "Pajamas and Code Hackathon" by GoMyCode - Building For Africa By Africa, With AI.

## 🎯 Project Overview

Jifunze AI (meaning "Learn" in Swahili) is an intelligent, culturally-aware AI tutor designed specifically for Kenyan students. It provides:

- **Bilingual Support**: Learn in Kiswahili or English
- **Curriculum Alignment**: Follows 8-4-4 and CBC curricula
- **Cultural Relevance**: Uses Kenyan examples and context
- **Mobile-First**: Optimized for low-end phones and limited data
- **Instant Answers**: Real-time explanations and practice questions

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 + Tailwind CSS v4 + shadcn/ui
- **Backend**: Next.js API Routes
- **AI**: Groq API (Llama 3.1) via Vercel AI SDK
- **Database**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

## 🚀 Quick Start (Hackathon Setup)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Supabase (get from supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Groq API (get from console.groq.com - FREE tier available!)
GROQ_API_KEY=groq_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Quick API Key Setup:**

1. **Supabase**: 
   - Go to [supabase.com](https://supabase.com)
   - Create new project (choose East Africa region if available)
   - Copy URL and anon key from Settings → API

2. **Groq API**:
   - Go to [console.groq.com](https://console.groq.com)
   - Sign up (free tier: 14,400 requests/day!)
   - Create API key
   - Copy to `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/          # Authentication page
│   ├── api/
│   │   └── chat/           # AI chat API endpoint
│   ├── dashboard/          # User dashboard
│   ├── chat/               # Chat interface
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Custom components
├── lib/
│   ├── supabaseClient.ts   # Supabase client
│   ├── grok.ts             # AI wrapper (legacy)
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript types
└── prompts/
    └── tutor-prompt.ts     # AI system prompt
```

## 🎨 Features

### ✅ Implemented

- [x] Landing page with feature showcase
- [x] User authentication (Supabase)
- [x] Dashboard with quick access
- [x] AI chat interface
- [x] Bilingual support (English/Kiswahili)
- [x] Curriculum context (8-4-4/CBC)
- [x] Responsive design
- [x] API route for secure AI calls

### 🚧 To Build (Hackathon)

- [ ] Curriculum selector component
- [ ] Subject-specific learning paths
- [ ] Quiz generation
- [ ] Progress tracking
- [ ] Offline mode (PWA)
- [ ] SMS integration (Twilio) for low-data areas

## 🏗️ Building During Hackathon

### Priority Features (12-hour sprint):

1. **Core Chat** ✅ (Done!)
2. **Curriculum Selector** - Let users choose 8-4-4 vs CBC
3. **Subject Filtering** - Filter by Math, Science, etc.
4. **Quiz Generator** - AI generates practice questions
5. **Progress Dashboard** - Track learning stats
6. **Mobile Optimization** - Test on real phones

### Quick Wins:

- Add more Kenyan cultural examples to prompts
- Implement dark mode toggle
- Add loading skeletons
- Create demo video for pitch

## 🚢 Deployment

### Deploy to Vercel (5 minutes):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

Or use the Vercel GitHub integration for automatic deployments.

## 🎯 Hackathon Pitch Points

1. **Problem**: 2M+ Kenyan kids miss school daily; teacher shortages; rural access issues
2. **Solution**: AI tutor that works on any phone, offline-capable, culturally relevant
3. **Impact**: Scalable to all of Africa; reduces teacher workload; personalized learning
4. **Tech**: Modern stack (Next.js 16, Groq AI, Supabase) - production-ready
5. **Differentiator**: Bilingual, curriculum-aligned, mobile-first, built by Africans

## 📝 Notes for Judges

- **Cultural Relevance**: All examples use Kenyan context (M-Pesa, Nairobi landmarks, local foods)
- **Accessibility**: Works on low-end phones, optimized for limited bandwidth
- **Scalability**: Can deploy across Africa with minimal changes
- **AI Ethics**: Bias-checked prompts, diverse training data considerations

## 🤝 Team

Built for GoMyCode Hackathon - December 2024

## 📄 License

MIT

---

**Karibu! Let's build the future of African education together.** 🇰🇪
