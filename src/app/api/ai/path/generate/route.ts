/**
 * AI Path Generator API
 * POST /api/ai/path/generate
 * Generates personalized learning and career path
 */

import { NextRequest, NextResponse } from 'next/server'
import { AIPathGeneratorService } from '@/services/ai-path-generator.service'
import { ScholarshipAPIService } from '@/services/scholarship-api.service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profile } = body

    // Fetch available opportunities
    const opportunities = await ScholarshipAPIService.fetchScholarships({
      limit: 50,
    })

    const path = await AIPathGeneratorService.generatePath(profile, opportunities)
    const explanation = await AIPathGeneratorService.explainPath(profile, path)

    return NextResponse.json({
      path,
      explanation,
    })
  } catch (error: any) {
    console.error('Error in path generator API:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate path',
        details: error.message,
      },
      { status: 500 }
    )
  }
}


