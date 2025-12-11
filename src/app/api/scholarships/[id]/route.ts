/**
 * Single Scholarship API Route
 * GET /api/scholarships/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseClient'
import type { Scholarship } from '@/types/scholarship'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { id } = params

    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .eq('verified', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Scholarship not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching scholarship:', error)
      return NextResponse.json(
        { error: 'Failed to fetch scholarship', details: error.message },
        { status: 500 }
      )
    }

    // Transform to Scholarship type
    const scholarship: Scholarship = {
      id: data.id,
      name: data.name,
      description: data.description,
      provider: data.provider,
      type: data.type as Scholarship['type'],
      category: data.category,
      eligibility: data.eligibility || {},
      amount: data.amount,
      coverage: data.coverage || [],
      duration: data.duration,
      bootcampDetails: data.bootcamp_details,
      learningDetails: data.learning_details,
      applicationDeadline: data.application_deadline,
      applicationLink: data.application_link,
      contactInfo: data.contact_info || {},
      requirements: data.requirements || [],
      documents: data.documents || [],
      notes: data.notes,
      priority: data.priority || 0,
    }

    return NextResponse.json({ scholarship })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}


