#!/bin/bash

# Test script for AI Profile Builder
# Usage: ./test-profile-builder.sh

echo "🧪 Testing AI Profile Builder..."
echo ""

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "❌ Error: Development server is not running"
  echo "   Please run: npm run dev"
  exit 1
fi

# Check if API key is set
if [ -z "$GROQ_API_KEY" ]; then
  echo "⚠️  Warning: GROQ_API_KEY not set in environment"
  echo "   Make sure it's in .env.local"
fi

echo "📤 Sending test request..."
echo ""

# Test 1: Basic profile
echo "Test 1: Basic Profile"
curl -X POST http://localhost:3000/api/ai/profile/build \
  -H "Content-Type: application/json" \
  -d '{
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
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 2: Minimal profile
echo "Test 2: Minimal Profile"
curl -X POST http://localhost:3000/api/ai/profile/build \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Wanjiku",
    "school": "Mombasa Girls High",
    "county": "Mombasa",
    "grade": 8,
    "subjects": ["Mathematics", "Biology"],
    "interests": "I want to be a doctor",
    "careerGoal": "Medical Doctor"
  }' | jq '.'

echo ""
echo "✅ Tests completed!"
echo ""
echo "If you see errors, check:"
echo "1. Server is running (npm run dev)"
echo "2. GROQ_API_KEY is set in .env.local"
echo "3. API key is valid"

