# 🤖 AI-Powered Data Extraction

## Overview

The AI Data Extraction service uses Groq API (Llama 3.1) to extract structured scholarship data from unstructured text, making it easy to add scholarships to the database.

## How It Works

### 1. **Text Extraction**
- Input: Unstructured text (description, website content, etc.)
- AI parses the text and extracts structured data
- Output: JSON object matching Scholarship type

### 2. **Data Enhancement**
- AI improves descriptions
- Standardizes formats (dates, amounts)
- Validates eligibility criteria
- Adds missing but inferable information

### 3. **Validation**
- Checks required fields
- Validates data types
- Ensures consistency

## API Endpoint

### POST /api/scholarships/extract

Extract scholarship data from text.

**Request:**
```json
{
  "text": "Nairobi County Bursary Fund provides financial support for needy students...",
  "url": "https://example.com/scholarship" // Optional
}
```

**Response:**
```json
{
  "scholarship": {
    "name": "Nairobi County Bursary Fund",
    "description": "...",
    "provider": "Nairobi County Government",
    "type": "bursary",
    "eligibility": {
      "counties": ["Nairobi"],
      "minGrade": 1,
      "maxGrade": 12
    },
    ...
  },
  "confidence": 85,
  "extractedFields": ["name", "provider", "type", "eligibility", ...],
  "missingFields": [],
  "validation": {
    "valid": true,
    "errors": []
  },
  "enhanced": true
}
```

## Usage Examples

### Extract from Text

```typescript
import { AIDataExtractionService } from '@/services/ai-data-extraction.service'

const text = `
Nairobi County Bursary Fund
Financial support for needy students in Nairobi County
Amount: KES 10,000 - 50,000 per year
Deadline: March 31
Requirements: Must be a resident of Nairobi County
`

const result = await AIDataExtractionService.extractFromText(text)
console.log(result.scholarship)
```

### Extract and Save

```typescript
// Extract
const result = await AIDataExtractionService.extractFromText(text)

// Validate
const validation = AIDataExtractionService.validateExtraction(result.scholarship)

if (validation.valid) {
  // Enhance
  const enhanced = await AIDataExtractionService.enhanceExtraction(result.scholarship)
  
  // Save to database
  await fetch('/api/scholarships', {
    method: 'POST',
    body: JSON.stringify(enhanced)
  })
}
```

## What AI Extracts

### Basic Information
- Name
- Description
- Provider
- Type (scholarship, bursary, bootcamp, etc.)
- Category

### Eligibility
- Counties
- Grade levels
- KCPE/KCSE requirements
- Income levels
- Special conditions
- Field of study
- Career interests (for bootcamps)

### Award Details
- Amount
- Coverage (tuition, books, etc.)
- Duration

### Application Info
- Deadline
- Application link
- Contact information
- Requirements
- Documents needed

### Bootcamp-Specific
- Duration, format, schedule
- Skills taught
- Certification
- Cost

### Learning-Specific
- Course type, platform
- Duration, format
- Certification
- Cost

## Confidence Scoring

The service calculates confidence based on:
- Number of fields extracted
- Completeness of required fields
- Data quality

**Confidence Levels:**
- 80-100%: High confidence, ready to use
- 60-79%: Medium confidence, review recommended
- <60%: Low confidence, manual review required

## Error Handling

The service handles:
- Invalid JSON responses
- Missing information
- Parsing errors
- API failures

On error, it returns the original data or throws a descriptive error.

## Future Enhancements

1. **Web Scraping**: Extract directly from URLs
2. **PDF Parsing**: Extract from PDF documents
3. **Multi-language**: Support Kiswahili extraction
4. **Batch Processing**: Extract multiple scholarships at once
5. **Learning**: Improve extraction based on feedback

## Integration with Provider Dashboard

Providers can:
1. Paste scholarship description
2. AI extracts structured data
3. Review and edit extracted data
4. Submit for verification

This makes it much easier for providers to add scholarships!


