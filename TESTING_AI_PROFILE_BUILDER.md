# 🧪 Testing AI Profile Builder Locally

Complete guide to test the AI Profile Builder service locally.

---

## Prerequisites

### 1. **Environment Setup**

Create a `.env.local` file in the project root:

```bash
# Required: Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# Optional: Supabase (not required for profile builder testing)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Getting a Groq API Key:**
1. Go to https://console.groq.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_`)

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Start Development Server**

```bash
npm run dev
```

The server will start at `http://localhost:3000`

---

## Testing Methods

### Method 1: Using cURL (Quick Test)

#### Test 1: Basic Profile Build

```bash
curl -X POST http://localhost:3000/api/ai/profile/build \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "school": "Nairobi High School",
    "county": "Nairobi",
    "grade": 10,
    "subjects": ["Mathematics", "Physics", "Chemistry", "English"],
    "grades": {
      "Mathematics": "A",
      "Physics": "B+",
      "Chemistry": "A-",
      "English": "B"
    },
    "interests": "I love coding and building mobile apps. I want to become a software engineer.",
    "activities": ["Science Club", "Debate Team", "Coding Club"],
    "achievements": ["Won regional science fair 2024", "Best student in Mathematics"],
    "projects": ["Mobile app for school attendance", "Science fair project on renewable energy"],
    "careerGoal": "Software Engineer"
  }'
```

#### Test 2: Minimal Profile (Testing with less data)

```bash
curl -X POST http://localhost:3000/api/ai/profile/build \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Wanjiku",
    "school": "Mombasa Girls High",
    "county": "Mombasa",
    "grade": 8,
    "subjects": ["Mathematics", "Biology", "Kiswahili"],
    "interests": "I want to be a doctor",
    "careerGoal": "Medical Doctor"
  }'
```

#### Test 3: TVET Student Profile

```bash
curl -X POST http://localhost:3000/api/ai/profile/build \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Peter Kamau",
    "school": "Nairobi Technical Training Institute",
    "county": "Kiambu",
    "grade": 12,
    "subjects": ["Electrical Engineering", "Mathematics", "Physics"],
    "interests": "I enjoy working with electronics and want to become an electrical engineer",
    "activities": ["Robotics Club", "Technical Skills Competition"],
    "achievements": ["Best in Electrical Installation 2024"],
    "projects": ["Smart home automation system", "Solar power installation project"],
    "careerGoal": "Electrical Engineer"
  }'
```

---

### Method 2: Using Browser/Postman

1. **Open Postman** or use browser DevTools
2. **Create a new POST request**
3. **URL**: `http://localhost:3000/api/ai/profile/build`
4. **Headers**:
   - `Content-Type: application/json`
5. **Body** (raw JSON):

```json
{
  "name": "John Doe",
  "school": "Nairobi High School",
  "county": "Nairobi",
  "grade": 10,
  "subjects": ["Mathematics", "Physics", "Chemistry"],
  "grades": {
    "Mathematics": "A",
    "Physics": "B+",
    "Chemistry": "A-"
  },
  "interests": "I love coding and want to be a software engineer",
  "activities": ["Science Club", "Coding Club"],
  "achievements": ["Won science fair"],
  "projects": ["Mobile app for school"],
  "careerGoal": "Software Engineer"
}
```

6. **Send request**

---

### Method 3: Using Test Script

Create a test file `test-profile-builder.js`:

```javascript
const testProfileBuilder = async () => {
  const testData = {
    name: "John Doe",
    school: "Nairobi High School",
    county: "Nairobi",
    grade: 10,
    subjects: ["Mathematics", "Physics", "Chemistry", "English"],
    grades: {
      Mathematics: "A",
      Physics: "B+",
      Chemistry: "A-",
      English: "B"
    },
    interests: "I love coding and building mobile apps. I want to become a software engineer.",
    activities: ["Science Club", "Debate Team", "Coding Club"],
    achievements: ["Won regional science fair 2024", "Best student in Mathematics"],
    projects: ["Mobile app for school attendance", "Science fair project on renewable energy"],
    careerGoal: "Software Engineer"
  }

  try {
    const response = await fetch('http://localhost:3000/api/ai/profile/build', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()
    
    if (!response.ok) {
      console.error('Error:', result)
      return
    }

    console.log('✅ Success!')
    console.log('\n📋 Professional Summary:')
    console.log(result.professionalSummary)
    console.log('\n📊 Enhanced Profile:')
    console.log(JSON.stringify(result.enhancedProfile, null, 2))
    console.log('\n💡 Suggestions:')
    result.suggestions.forEach((s, i) => console.log(`${i + 1}. ${s}`))
    console.log(`\n🎯 Confidence: ${result.confidence}%`)
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testProfileBuilder()
```

Run with Node.js:
```bash
node test-profile-builder.js
```

---

### Method 4: Using Frontend Component

If you have a profile wizard component, you can test it directly in the browser:

1. Navigate to `http://localhost:3000/dashboard` (or wherever the profile wizard is)
2. Fill in the profile form
3. Submit and check the response

---

## Expected Response Format

```json
{
  "professionalSummary": "John Doe is a Grade 10 student at Nairobi High School with strong performance in Mathematics (A) and Chemistry (A-), demonstrating exceptional aptitude in STEM subjects. With a passion for coding and mobile app development, evidenced by his active participation in the Coding Club and his school attendance mobile app project, he is well-positioned to pursue a career in software engineering.",
  "enhancedProfile": {
    "personal": {
      "firstName": "John",
      "lastName": "Doe",
      "county": "Nairobi",
      "schoolName": "Nairobi High School"
    },
    "academicStage": {
      "stage": "SeniorSecondary",
      "currentClassOrLevel": "Form 2"
    },
    "subjectsCompetencies": {
      "subjectsTaken": ["Mathematics", "Physics", "Chemistry", "English"],
      "competencyTags": ["Critical thinking", "Digital literacy", "Problem solving"],
      "preferredStream": "STEM"
    },
    "skillsAndCertifications": [
      {
        "skill": "Mobile App Development",
        "proficiency": "Intermediate"
      },
      {
        "skill": "Programming",
        "proficiency": "Beginner"
      }
    ],
    "careerGoals": {
      "shortTerm": "Complete high school with strong STEM grades",
      "longTerm": "Software Engineer"
    }
  },
  "suggestions": [
    "Add your science fair project to strengthen STEM profile",
    "Include GitHub link for coding projects",
    "Consider adding more technical skills certifications"
  ],
  "confidence": 85
}
```

---

## Troubleshooting

### Error: "GROQ_API_KEY not found"

**Solution:**
1. Check that `.env.local` exists in project root
2. Verify the API key is correct (starts with `gsk_`)
3. Restart the dev server after adding the key
4. Check for typos: `GROQ_API_KEY` (not `GROK_API_KEY` unless you're using that)

### Error: "AI service configuration error"

**Possible causes:**
- Invalid API key
- API key expired
- Network issues

**Solution:**
1. Verify API key at https://console.groq.com/
2. Generate a new key if needed
3. Check internet connection

### Error: "Failed to build profile"

**Possible causes:**
- AI service returned invalid JSON
- Rate limiting
- Network timeout

**Solution:**
1. Check server logs for detailed error
2. Try again after a few seconds
3. Verify API key has sufficient quota

### Error: "No JSON found in AI response"

**Possible causes:**
- AI returned text instead of JSON
- Prompt was misunderstood

**Solution:**
1. Check server logs to see actual AI response
2. Try with more complete input data
3. The service should handle this gracefully and return a fallback

### Response is slow

**Normal behavior:**
- First request may take 5-10 seconds
- Subsequent requests are usually faster
- Groq is fast but depends on network

**If consistently slow:**
- Check internet connection
- Verify you're using Groq (not OpenAI)
- Check Groq status page

---

## Testing Checklist

- [ ] Environment variable `GROQ_API_KEY` is set
- [ ] Development server is running (`npm run dev`)
- [ ] Can make POST request to `/api/ai/profile/build`
- [ ] Response includes `professionalSummary`
- [ ] Response includes `enhancedProfile` with structured data
- [ ] Response includes `suggestions` array
- [ ] Response includes `confidence` score (0-100)
- [ ] Works with minimal input (name, school, grade)
- [ ] Works with complete input (all fields)
- [ ] Handles missing fields gracefully
- [ ] Error handling works (invalid API key, network errors)

---

## Next Steps

After testing the profile builder:

1. **Test Profile Evaluation**: `POST /api/ai/profile/evaluate`
2. **Test Path Generator**: `POST /api/ai/path/generate`
3. **Test Career Advisor**: `POST /api/ai/career/advise`
4. **Test Course Summarizer**: `POST /api/ai/courses/summarize`

See `AI_INTEGRATION_SUMMARY.md` for details on all AI services.

---

## Quick Test Command

Copy-paste this into your terminal:

```bash
curl -X POST http://localhost:3000/api/ai/profile/build \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "school": "Test School",
    "county": "Nairobi",
    "grade": 10,
    "subjects": ["Math", "Science"],
    "interests": "I love learning",
    "careerGoal": "Engineer"
  }' | jq .
```

(Requires `jq` for pretty JSON output, or remove `| jq .`)

