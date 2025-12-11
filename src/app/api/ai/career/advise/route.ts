/**
 * AI Career Advisor API
 * POST /api/ai/career/advise
 * Answers career-related questions
 */

import { NextRequest, NextResponse } from 'next/server'
import { AICareerAdvisorService } from '@/services/ai-career-advisor.service'
import { ScholarshipAPIService } from '@/services/scholarship-api.service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, profile } = body

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Fetch opportunities for context
    const opportunities = profile
      ? await ScholarshipAPIService.fetchScholarships({
          county: profile.personal?.county,
          limit: 20,
        })
      : []

    const advice = await AICareerAdvisorService.answerQuestion(
      question,
      profile,
      opportunities
    )

    return NextResponse.json(advice)
  } catch (error: any) {
    console.error('Error in career advisor API:', error)
    return NextResponse.json(
      {
        error: 'Failed to get career advice',
        details: error.message,
      },
      { status: 500 }
    )
  }
}


