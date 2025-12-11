/**
 * AI-Powered Data Extraction Service
 * Uses Groq API to extract structured scholarship data from unstructured text
 */

import { AIService } from './ai.service'
import type { Scholarship } from '@/types/scholarship'

interface ExtractionResult {
  scholarship: Partial<Scholarship>
  confidence: number
  extractedFields: string[]
  missingFields: string[]
}

export class AIDataExtractionService {
  /**
   * Extract scholarship data from unstructured text
   * Uses AI to parse descriptions and extract structured data
   */
  static async extractFromText(
    text: string,
    sourceUrl?: string
  ): Promise<ExtractionResult> {
    const prompt = `You are a data extraction expert. Extract scholarship information from the following text and return it as structured JSON.

Text to analyze:
${text}

${sourceUrl ? `Source URL: ${sourceUrl}` : ''}

Extract the following information:
- name: Scholarship name
- description: Brief description
- provider: Organization/entity providing the scholarship
- type: One of: scholarship, bursary, loan, grant, bootcamp, learning
- category: One of: Tech, Business, Education, Healthcare, Engineering, Arts, Agriculture, General
- eligibility: JSON object with:
  - counties: Array of Kenyan counties (if location-specific)
  - minGrade: Minimum grade level (1-12)
  - maxGrade: Maximum grade level (1-12)
  - minKCPE: Minimum KCPE score (if applicable)
  - minKCSE: Minimum KCSE grade (if applicable)
  - incomeLevel: Array of: low, medium, high
  - specialConditions: Array of: orphan, disability, single_parent
  - fieldOfStudy: Array of study fields
  - careerInterests: Array of career interests (for bootcamps/learning)
  - experienceLevel: beginner, intermediate, advanced, any
- amount: Scholarship amount (e.g., "KES 50,000/year" or "Full tuition")
- coverage: Array of what's covered: tuition, books, accommodation, etc.
- duration: Duration (e.g., "4 years", "12 weeks")
- applicationDeadline: Deadline date (ISO format if possible)
- applicationLink: Application URL if mentioned
- contactInfo: Object with email, phone, address if mentioned
- requirements: Array of requirements
- documents: Array of required documents
- notes: Any additional notes

For bootcamps, also extract:
- bootcampDetails: {
  - duration: Duration string
  - format: online, in-person, hybrid
  - schedule: full-time, part-time, weekends, evenings, flexible
  - skillsTaught: Array of skills/technologies
  - certification: boolean
  - cost: free, paid, partial, scholarship-available
}

For learning opportunities, also extract:
- learningDetails: {
  - courseType: mooc, workshop, course, seminar, webinar
  - platform: Platform name
  - duration: Duration string
  - format: online, in-person, hybrid
  - certification: boolean
  - cost: free, paid, partial
}

Return ONLY valid JSON in this format:
{
  "name": "...",
  "description": "...",
  "provider": "...",
  "type": "...",
  "category": "...",
  "eligibility": {...},
  "amount": "...",
  "coverage": [...],
  "duration": "...",
  "applicationDeadline": "...",
  "applicationLink": "...",
  "contactInfo": {...},
  "requirements": [...],
  "documents": [...],
  "notes": "...",
  "bootcampDetails": {...} (if applicable),
  "learningDetails": {...} (if applicable)
}

If information is not available, use null or empty arrays/objects. Be precise and only extract what is explicitly stated.`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.3, // Lower temperature for more consistent extraction
        maxTokens: 2000,
      })

      // Parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      const extracted = JSON.parse(jsonMatch[0])

      // Calculate confidence based on extracted fields
      const requiredFields = ['name', 'provider', 'type']
      const extractedFields = Object.keys(extracted).filter(
        key => extracted[key] !== null && extracted[key] !== undefined
      )
      const missingFields = requiredFields.filter(
        field => !extractedFields.includes(field)
      )

      const confidence = Math.min(
        100,
        Math.round((extractedFields.length / (requiredFields.length + 10)) * 100)
      )

      return {
        scholarship: extracted as Partial<Scholarship>,
        confidence,
        extractedFields,
        missingFields,
      }
    } catch (error) {
      console.error('Error extracting data with AI:', error)
      throw new Error('Failed to extract scholarship data')
    }
  }

  /**
   * Extract from URL (scrape and extract)
   * Note: This requires a backend service for web scraping
   */
  static async extractFromURL(url: string): Promise<ExtractionResult> {
    // TODO: Implement web scraping service
    // For now, this would need a backend service to fetch the page content
    throw new Error('URL extraction not yet implemented. Requires backend scraping service.')
  }

  /**
   * Validate and clean extracted data
   */
  static validateExtraction(
    extracted: Partial<Scholarship>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!extracted.name) errors.push('Missing name')
    if (!extracted.provider) errors.push('Missing provider')
    if (!extracted.type) errors.push('Missing type')
    if (!extracted.eligibility) errors.push('Missing eligibility')

    // Validate type
    const validTypes = [
      'scholarship',
      'bursary',
      'loan',
      'grant',
      'bootcamp',
      'learning',
    ]
    if (extracted.type && !validTypes.includes(extracted.type)) {
      errors.push(`Invalid type: ${extracted.type}`)
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Enhance extracted data with AI
   * Adds missing information, improves descriptions, etc.
   */
  static async enhanceExtraction(
    extracted: Partial<Scholarship>
  ): Promise<Partial<Scholarship>> {
    const prompt = `You are a scholarship data enhancement expert. Review and enhance the following scholarship data:

${JSON.stringify(extracted, null, 2)}

Enhance the data by:
1. Improving descriptions to be clear and informative
2. Standardizing format (dates, amounts, etc.)
3. Adding missing but inferable information
4. Validating eligibility criteria
5. Ensuring consistency

Return the enhanced data as JSON in the same format. Only add information that can be reasonably inferred.`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.4,
        maxTokens: 2000,
      })

      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return extracted // Return original if parsing fails
      }

      const enhanced = JSON.parse(jsonMatch[0])
      return { ...extracted, ...enhanced } as Partial<Scholarship>
    } catch (error) {
      console.error('Error enhancing data:', error)
      return extracted // Return original on error
    }
  }
}


