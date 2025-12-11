/**
 * AI-Powered Scholarship Data Extraction API
 * POST /api/scholarships/extract
 * Extracts structured scholarship data from unstructured text
 */

import { NextRequest, NextResponse } from 'next/server'
import { AIDataExtractionService } from '@/services/ai-data-extraction.service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, url } = body

    if (!text && !url) {
      return NextResponse.json(
        { error: 'Either text or url is required' },
        { status: 400 }
      )
    }

    let extractionResult

    if (url) {
      // Extract from URL (requires scraping)
      extractionResult = await AIDataExtractionService.extractFromURL(url)
    } else {
      // Extract from text
      extractionResult = await AIDataExtractionService.extractFromText(text, url)
    }

    // Validate extraction
    const validation = AIDataExtractionService.validateExtraction(
      extractionResult.scholarship
    )

    // Enhance if valid
    let enhanced = extractionResult.scholarship
    if (validation.valid) {
      enhanced = await AIDataExtractionService.enhanceExtraction(enhanced)
    }

    return NextResponse.json({
      scholarship: enhanced,
      confidence: extractionResult.confidence,
      extractedFields: extractionResult.extractedFields,
      missingFields: extractionResult.missingFields,
      validation,
      enhanced: validation.valid,
    })
  } catch (error: any) {
    console.error('Error in extraction API:', error)
    return NextResponse.json(
      {
        error: 'Failed to extract scholarship data',
        details: error.message,
      },
      { status: 500 }
    )
  }
}


