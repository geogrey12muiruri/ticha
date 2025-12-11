/**
 * AI Course Summarizer API
 * POST /api/ai/courses/summarize
 * Summarizes course descriptions
 */

import { NextRequest, NextResponse } from 'next/server'
import { AICourseSummarizerService } from '@/services/ai-course-summarizer.service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseName, description, duration, cost, platform } = body

    if (!courseName || !description) {
      return NextResponse.json(
        { error: 'Course name and description are required' },
        { status: 400 }
      )
    }

    const summary = await AICourseSummarizerService.summarizeCourse(
      courseName,
      description,
      { duration, cost, platform }
    )

    return NextResponse.json(summary)
  } catch (error: any) {
    console.error('Error in course summarizer API:', error)
    return NextResponse.json(
      {
        error: 'Failed to summarize course',
        details: error.message,
      },
      { status: 500 }
    )
  }
}


