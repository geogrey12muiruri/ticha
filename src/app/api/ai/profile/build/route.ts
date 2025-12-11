/**
 * AI Profile Builder API
 * POST /api/ai/profile/build
 * Builds a polished profile from raw student input
 */

import { NextRequest, NextResponse } from 'next/server'
import { AIProfileBuilderService } from '@/services/ai-profile-builder.service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, school, county, grade, subjects, grades, interests, activities, achievements, projects, careerGoal } = body

    const result = await AIProfileBuilderService.buildProfileFromRaw({
      name,
      school,
      county,
      grade,
      subjects,
      grades,
      interests,
      activities,
      achievements,
      projects,
      careerGoal,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error in profile builder API:', error)
    return NextResponse.json(
      {
        error: 'Failed to build profile',
        details: error.message,
      },
      { status: 500 }
    )
  }
}


