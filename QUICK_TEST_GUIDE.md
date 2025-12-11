# ⚡ Quick Test Guide - AI Profile Builder

## 🚀 Quick Start (3 Steps)

### 1. Set API Key
```bash
# Create .env.local in project root
echo "GROQ_API_KEY=your_groq_api_key_here" > .env.local
```

Get your key at: https://console.groq.com/

### 2. Start Server
```bash
npm run dev
```

### 3. Test
```bash
# Quick test
curl -X POST http://localhost:3000/api/ai/profile/build \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "school": "Nairobi High",
    "county": "Nairobi",
    "grade": 10,
    "subjects": ["Math", "Physics"],
    "interests": "I love coding",
    "careerGoal": "Software Engineer"
  }'
```

Or use the test script:
```bash
./test-profile-builder.sh
```

---

## ✅ Expected Success Response

```json
{
  "professionalSummary": "...",
  "enhancedProfile": { ... },
  "suggestions": [ ... ],
  "confidence": 85
}
```

---

## ❌ Common Errors

| Error | Solution |
|-------|----------|
| `GROQ_API_KEY not found` | Add to `.env.local` and restart server |
| `AI service configuration error` | Check API key is valid |
| `Failed to build profile` | Check server logs, verify API key quota |
| Server not running | Run `npm run dev` |

---

## 📚 Full Documentation

See `TESTING_AI_PROFILE_BUILDER.md` for complete testing guide.

