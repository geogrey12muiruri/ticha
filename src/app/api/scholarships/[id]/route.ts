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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both sync and async params (Next.js 13+ uses async params)
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

    // Check mock data first if enabled
    if (useMockData) {
      console.log('📦 Mock data mode - checking mock scholarships')
      const { getMockScholarshipById } = await import('@/data/mock-scholarships')
      const mockScholarship = getMockScholarshipById(id)
      
      if (mockScholarship) {
        console.log(`✅ Found mock scholarship: ${mockScholarship.name}`)
        return NextResponse.json({ scholarship: mockScholarship })
      }
    }

    // Try database
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .eq('verified', true)
      .maybeSingle()

    if (error) {
      console.error('Database error:', error)
      // Fallback to mock data
      const { getMockScholarshipById } = await import('@/data/mock-scholarships')
      const mockScholarship = getMockScholarshipById(id)
      
      if (mockScholarship) {
        console.log('⚠️ Database error, using mock data')
        return NextResponse.json({ scholarship: mockScholarship })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch scholarship', details: error.message },
        { status: 500 }
      )
    }

    // If found in database, return it
    if (data) {
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
    }

    // Not found in database, try mock data
    console.log('⚠️ Scholarship not found in database, trying mock data')
    const { getMockScholarshipById } = await import('@/data/mock-scholarships')
    const mockScholarship = getMockScholarshipById(id)
    
    if (mockScholarship) {
      console.log(`✅ Found in mock data: ${mockScholarship.name}`)
      return NextResponse.json({ scholarship: mockScholarship })
    }

    // Not found anywhere
    return NextResponse.json(
      { error: 'Scholarship not found' },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('Unexpected error:', error)
    
    // Last resort: try mock data
    try {
      const resolvedParams = await Promise.resolve(params)
      const { getMockScholarshipById } = await import('@/data/mock-scholarships')
      const mockScholarship = getMockScholarshipById(resolvedParams.id)
      
      if (mockScholarship) {
        console.log('⚠️ Error occurred, using mock data as fallback')
        return NextResponse.json({ scholarship: mockScholarship })
      }
    } catch (mockError) {
      console.error('Mock data fallback also failed:', mockError)
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}


