/**
 * AI Profile Evaluator API
 * POST /api/ai/profile/evaluate
 * Evaluates profile and provides improvement suggestions
 */

import { NextRequest, NextResponse } from 'next/server'
import { AIProfileBuilderService } from '@/services/ai-profile-builder.service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profile } = body

    const result = await AIProfileBuilderService.evaluateProfile(profile)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error in profile evaluator API:', error)
    return NextResponse.json(
      {
        error: 'Failed to evaluate profile',
        details: error.message,
      },
      { status: 500 }
    )
  }
}


