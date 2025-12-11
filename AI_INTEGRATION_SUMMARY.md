# 🤖 AI Integration Summary

## Overview

The Jifunze AI platform uses **Groq API** (via OpenAI SDK) with **Llama 3.1 70B** model for AI-powered features. AI is integrated across multiple services and API endpoints.

---

## Core AI Infrastructure

### 1. **AI Service** (`src/services/ai.service.ts`)
- **Provider**: Groq API (OpenAI-compatible endpoint)
- **Model**: `llama-3.1-70b-versatile`
- **Base URL**: `https://api.groq.com/openai/v1`
- **API Key**: `GROQ_API_KEY` or `GROK_API_KEY` environment variable

**Key Method:**
```typescript
AIService.generateResponse({ message, context })
```

**Configuration:**
- Default Temperature: `0.7`
- Max Tokens: `1000`
- Cache Size: `100` responses

---

## AI Services & Features

### ✅ **1. AI Profile Builder** (`ai-profile-builder.service.ts`)

**Purpose**: Transform raw student input into polished, professional profiles

**Features:**
- Build profile from raw input (name, school, subjects, interests, etc.)
- Generate 2-sentence professional summary
- Provide enhancement suggestions
- Evaluate profile completeness and competitiveness

**API Endpoint**: `POST /api/ai/profile/build`

**Usage:**
```typescript
const result = await AIProfileBuilderService.buildProfileFromRaw({
  name: "John Doe",
  school: "Nairobi High",
  grade: 10,
  subjects: ["Mathematics", "Physics"],
  interests: "I love coding",
  careerGoal: "Software Engineer"
})
```

**Output:**
- `enhancedProfile`: Structured profile data
- `professionalSummary`: 2-sentence summary
- `suggestions`: Improvement recommendations
- `confidence`: Profile completeness score (0-100)

---

### ✅ **2. AI Opportunity Matcher** (`ai-opportunity-matcher.service.ts`)

**Purpose**: Match students to opportunities with AI explanations

**Features:**
- Combines structured scoring algorithm with LLM explanations
- Provides match explanations in natural language
- Recommends match strength (strong/moderate/weak)
- Suggests profile improvements for better matches

**How It Works:**
1. Uses existing `ScholarshipService.calculateMatchScore()` for structured scoring
2. Enhances top 10 matches with AI-generated explanations
3. Provides actionable improvement suggestions

**Usage:**
```typescript
const matches = await AIOpportunityMatcherService.matchWithAI(
  studentProfile,
  availableOpportunities
)
```

**Output:**
- `matchScore`: Numerical score (0-100)
- `aiExplanation`: Natural language explanation
- `aiRecommendation`: "strong" | "moderate" | "weak"
- `improvementSuggestions`: Array of actionable tips

---

### ✅ **3. AI Path Generator** (`ai-path-generator.service.ts`)

**Purpose**: Generate personalized learning and career paths

**Features:**
- Creates 5-step personalized pathways
- Aligns with career goals and current strengths
- Includes specific courses, scholarships, and opportunities
- Provides timeline and prerequisites

**API Endpoint**: `POST /api/ai/path/generate`

**Output Structure:**
```typescript
{
  title: "Path to Software Engineering",
  description: "Overview",
  steps: [
    {
      order: 1,
      type: "course" | "scholarship" | "bootcamp" | "mentorship" | "internship",
      title: "Step title",
      description: "What to do",
      why: "Why this step",
      resources: [...],
      prerequisites: [...],
      estimatedTime: "3 months"
    }
  ],
  estimatedDuration: "12-18 months",
  careerAlignment: "How path aligns with goal"
}
```

---

### ✅ **4. AI Career Advisor** (`ai-career-advisor.service.ts`)

**Purpose**: Chat-based career guidance for Kenyan students

**Features:**
- Answers career-related questions
- Provides Kenyan education system context (CBC, KCSE, KUCCPS, TVET)
- Suggests related opportunities
- Recommends careers based on profile

**API Endpoint**: `POST /api/ai/career/advise`

**Usage:**
```typescript
const advice = await AICareerAdvisorService.answerQuestion(
  "What can I do with a B in Mathematics?",
  studentProfile,
  availableOpportunities
)
```

**Output:**
- `answer`: Comprehensive answer
- `relatedOpportunities`: Matching opportunities
- `suggestions`: Actionable recommendations

**Component**: `CareerAdvisorChat` (`src/components/features/ai/CareerAdvisorChat.tsx`)

---

### ✅ **5. AI Course Summarizer** (`ai-course-summarizer.service.ts`)

**Purpose**: Summarize long course descriptions

**Features:**
- Converts lengthy course descriptions to concise summaries
- Extracts key information (duration, cost, skills, prerequisites)
- Makes course information more digestible

**API Endpoint**: `POST /api/ai/courses/summarize`

---

### ✅ **6. AI Data Extraction** (`ai-data-extraction.service.ts`)

**Purpose**: Extract structured scholarship data from unstructured text

**Features:**
- Parses scholarship descriptions
- Extracts eligibility criteria, amounts, deadlines, etc.
- Validates and enhances extracted data
- Handles bootcamp and learning opportunity details

**Usage:**
```typescript
const result = await AIDataExtractionService.extractFromText(
  scholarshipDescription,
  sourceUrl
)
```

**Output:**
- `scholarship`: Structured scholarship data
- `confidence`: Extraction confidence (0-100)
- `extractedFields`: List of successfully extracted fields
- `missingFields`: Required fields that are missing

**API Endpoint**: `POST /api/scholarships/extract`

---

### ✅ **7. AI Chat Tutor** (`ai.service.ts` + `/api/chat`)

**Purpose**: Educational chatbot for students

**Features:**
- Answers academic questions
- Context-aware (curriculum, subject, grade, language)
- Culturally relevant for Kenyan students
- Uses system prompt from `prompts/tutor-prompt.ts`

**API Endpoint**: `POST /api/chat`

**Usage:**
```typescript
const response = await AIService.generateResponse({
  message: "Explain photosynthesis",
  context: {
    language: "en",
    curriculum: "CBC",
    subject: "Biology",
    grade: 8
  }
})
```

**Component**: `Chat` page (`src/app/chat/page.tsx`)

---

### ✅ **8. Form Generation** (`form-generation.service.ts`)

**Purpose**: Generate scholarship application forms from descriptions

**Features:**
- Converts natural language descriptions to structured forms
- Creates sections (Personal, Academic, Financial, Documents)
- Generates HTML forms
- Validates form structure

**API Endpoint**: `POST /api/forms/generate`

**Usage:**
```typescript
const form = await FormGenerationService.generateForm(
  scholarshipDescription,
  requirements,
  eligibility
)
```

---

## API Endpoints Summary

| Endpoint | Method | Purpose | Service |
|----------|--------|---------|---------|
| `/api/chat` | POST | Chat tutor | `AIService` |
| `/api/ai/profile/build` | POST | Build profile | `AIProfileBuilderService` |
| `/api/ai/profile/evaluate` | POST | Evaluate profile | `AIProfileBuilderService` |
| `/api/ai/path/generate` | POST | Generate path | `AIPathGeneratorService` |
| `/api/ai/career/advise` | POST | Career advice | `AICareerAdvisorService` |
| `/api/ai/courses/summarize` | POST | Summarize course | `AICourseSummarizerService` |
| `/api/scholarships/extract` | POST | Extract data | `AIDataExtractionService` |
| `/api/forms/generate` | POST | Generate form | `FormGenerationService` |

---

## Integration Points

### Frontend Components

1. **Chat Page** (`src/app/chat/page.tsx`)
   - Uses `/api/chat` for tutor conversations

2. **Dashboard** (`src/app/dashboard/page.tsx`)
   - Uses `ScholarshipAPIService.matchScholarships()` (which can use AI matching)
   - Displays AI-matched opportunities

3. **Profile Wizard** (`src/components/features/profile/ComprehensiveProfileWizard.tsx`)
   - Can use AI profile builder for enhancement

4. **Career Advisor Chat** (`src/components/features/ai/CareerAdvisorChat.tsx`)
   - Uses `/api/ai/career/advise` for career guidance

---

## Current Limitations & Issues

### ⚠️ **1. Method Signature Inconsistency**

**Problem**: Some services call `AIService.generateResponse()` incorrectly.

**Current Signature:**
```typescript
AIService.generateResponse({ message, context })
```

**Incorrect Usage** (in multiple services):
```typescript
AIService.generateResponse(prompt, { temperature, maxTokens })
```

**Affected Services:**
- `ai-profile-builder.service.ts`
- `ai-opportunity-matcher.service.ts`
- `ai-path-generator.service.ts`
- `ai-career-advisor.service.ts`
- `ai-course-summarizer.service.ts`
- `ai-data-extraction.service.ts`

**Fix Needed**: Update `AIService.generateResponse()` to accept both signatures, or update all service calls.

---

### ⚠️ **2. Error Handling**

- Some services have basic error handling but could be more robust
- No retry logic for API failures
- Limited fallback responses

---

### ⚠️ **3. Rate Limiting**

- No rate limiting implemented
- Could hit Groq API limits under heavy load
- No request queuing

---

### ⚠️ **4. Caching**

- Basic caching mentioned in config but not fully implemented
- No response caching for similar queries
- Could reduce API costs and improve response times

---

## Environment Variables Required

```bash
GROQ_API_KEY=your_groq_api_key
# OR
GROK_API_KEY=your_groq_api_key
```

---

## AI Model Details

- **Provider**: Groq
- **Model**: `llama-3.1-70b-versatile`
- **Type**: Large Language Model (LLM)
- **Capabilities**: Text generation, JSON extraction, summarization, Q&A
- **Speed**: Very fast (Groq's inference engine)
- **Cost**: Pay-per-use (check Groq pricing)

---

## Future Enhancements

### 🔮 **Planned Features**

1. **ML-Based Matching** (Not yet implemented)
   - Train model on historical application outcomes
   - Predict acceptance probability
   - Learn from successful matches

2. **NLP for Data Extraction** (Partially implemented)
   - Enhanced parsing of unstructured scholarship descriptions
   - Auto-update scholarship data from web sources

3. **Fraud Detection** (Not yet implemented)
   - Pattern recognition for scam scholarships
   - Auto-flag suspicious entries

4. **Response Caching** (Not fully implemented)
   - Cache similar queries
   - Reduce API costs
   - Improve response times

5. **Retry Logic** (Not implemented)
   - Automatic retries on API failures
   - Exponential backoff
   - Graceful degradation

---

## Testing AI Services

### Manual Testing

```bash
# Test chat tutor
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain photosynthesis", "context": {"curriculum": "CBC", "subject": "Biology", "grade": 8}}'

# Test profile builder
curl -X POST http://localhost:3000/api/ai/profile/build \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "school": "Nairobi High", "grade": 10, "subjects": ["Math", "Physics"], "careerGoal": "Engineer"}'

# Test career advisor
curl -X POST http://localhost:3000/api/ai/career/advise \
  -H "Content-Type: application/json" \
  -d '{"question": "What can I do with a B in Mathematics?"}'
```

---

## Summary

**AI is well-integrated** across the platform with 8 major services:
1. ✅ Chat Tutor
2. ✅ Profile Builder
3. ✅ Opportunity Matcher
4. ✅ Path Generator
5. ✅ Career Advisor
6. ✅ Course Summarizer
7. ✅ Data Extraction
8. ✅ Form Generation

**All services use Groq API** with Llama 3.1 70B model for fast, cost-effective AI.

**Main Issue**: Method signature inconsistency needs to be fixed for proper functionality.

