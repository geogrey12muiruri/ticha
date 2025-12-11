/**
 * Scholarships API Route
 * Fetches scholarships from Supabase database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseClient'
import type { Scholarship } from '@/types/scholarship'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

/**
 * GET /api/scholarships
 * Fetch all active, verified scholarships
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const county = searchParams.get('county')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('scholarships')
      .select('*')
      .eq('status', 'active')
      .eq('verified', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (type) {
      query = query.eq('type', type)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (county) {
      // Search in eligibility JSONB
      query = query.contains('eligibility', { counties: [county] })
    }

    if (search) {
      // Full-text search
      query = query.textSearch('search_vector', search, {
        type: 'websearch',
        config: 'english'
      })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching scholarships:', error)
      
      // If table doesn't exist, return empty array instead of error
      if (error.message?.includes('relation') || error.message?.includes('table') || error.message?.includes('does not exist')) {
        console.warn('Scholarships table not found. Returning empty array. Please run database migration.')
        return NextResponse.json({
          scholarships: [],
          count: 0,
          limit,
          offset,
          message: 'Database table not set up. Please run migration.',
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch scholarships', details: error.message },
        { status: 500 }
      )
    }

    // Transform database records to Scholarship type
    const scholarships: Scholarship[] = (data || []).map((record: any) => ({
      id: record.id,
      name: record.name,
      description: record.description,
      provider: record.provider,
      type: record.type as Scholarship['type'],
      category: record.category,
      eligibility: record.eligibility || {},
      amount: record.amount,
      coverage: record.coverage || [],
      duration: record.duration,
      bootcampDetails: record.bootcamp_details,
      learningDetails: record.learning_details,
      applicationDeadline: record.application_deadline,
      applicationLink: record.application_link,
      contactInfo: record.contact_info || {},
      requirements: record.requirements || [],
      documents: record.documents || [],
      notes: record.notes,
      priority: record.priority || 0,
    }))

    return NextResponse.json({
      scholarships,
      count: scholarships.length,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/scholarships
 * Create a new scholarship (for providers/admins)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    // TODO: Add authentication check
    // TODO: Add validation
    // TODO: Add provider_id from auth

    const { data, error } = await supabase
      .from('scholarships')
      .insert({
        name: body.name,
        description: body.description,
        provider: body.provider,
        type: body.type,
        category: body.category,
        eligibility: body.eligibility || {},
        amount: body.amount,
        coverage: body.coverage || [],
        duration: body.duration,
        bootcamp_details: body.bootcampDetails,
        learning_details: body.learningDetails,
        application_deadline: body.applicationDeadline,
        application_link: body.applicationLink,
        contact_info: body.contactInfo || {},
        requirements: body.requirements || [],
        documents: body.documents || [],
        notes: body.notes,
        priority: body.priority || 0,
        status: 'pending', // Requires verification
        verified: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating scholarship:', error)
      return NextResponse.json(
        { error: 'Failed to create scholarship', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ scholarship: data }, { status: 201 })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

