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
 * 
 * Smart fetching:
 * 1. First tries database
 * 2. If empty/stale, fetches from live scrapers
 * 3. Auto-syncs scraped data to database
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
    const useLiveData = searchParams.get('live') === 'true' // Force live scraping

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

    // Check if database is empty or stale
    const dbEmpty = !data || data.length === 0
    const dbStale = data && data.length > 0 && useLiveData

    // If database is empty or stale, fetch from live scrapers
    if (dbEmpty || dbStale) {
      console.log('Database empty or stale, fetching from live scrapers...')
      
      try {
        const { KenyaScholarshipScraperService } = await import('@/services/kenya-scholarship-scraper.service')
        const scraper = new KenyaScholarshipScraperService()
        
        // Fetch from all sources
        const liveScholarships = await scraper.searchAllSources({
          county: county || undefined,
          type: type as any,
        })

        // Sync to database (async, don't wait)
        scraper.syncToDatabase().catch(err => {
          console.error('Error syncing to database:', err)
        })

        // Filter and transform live data
        let filtered = liveScholarships
        
        if (county) {
          filtered = filtered.filter(s => 
            s.eligibility?.counties?.includes(county) || 
            !s.eligibility?.counties // Include if no county restriction
          )
        }

        if (type) {
          filtered = filtered.filter(s => s.type === type)
        }

        // Apply pagination
        const paginated = filtered.slice(offset, offset + limit)

        // Transform to Scholarship type
        const scholarships: Scholarship[] = paginated.map((record: any) => ({
          id: record.id || `live-${Date.now()}-${Math.random()}`,
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
          applicationDeadline: record.applicationDeadline,
          applicationLink: record.applicationLink,
          contactInfo: record.contactInfo || {},
          requirements: record.requirements || [],
          documents: record.documents || [],
          notes: record.notes,
          priority: record.priority || 0,
        }))

        return NextResponse.json({
          scholarships,
          count: filtered.length,
          limit,
          offset,
          source: 'live_scrapers',
          message: 'Live data from Kenya government portals',
        })
      } catch (scraperError: any) {
        console.error('Error fetching from scrapers:', scraperError)
        console.warn('⚠️ Scrapers failed, will try database or mock data')
        // Fall through to return database results (even if empty)
      }
    }
    
    // If database is empty and scrapers failed, use mock data
    if ((!data || data.length === 0) && !error) {
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
      
      if (useMockData) {
        console.log('📦 Using mock data (NEXT_PUBLIC_USE_MOCK_DATA=true)')
        const { getMockScholarships } = await import('@/data/mock-scholarships')
        const mockScholarships = getMockScholarships({
          type: type || undefined,
          county: county || undefined,
          category: category || undefined,
          limit,
        })
        
        return NextResponse.json({
          scholarships: mockScholarships.slice(offset, offset + limit),
          count: mockScholarships.length,
          limit,
          offset,
          source: 'mock',
          message: 'Using mock data for prototyping',
        })
      }
    }

    if (error) {
      console.error('Error fetching scholarships:', error)
      
      // If table doesn't exist, try live scrapers
      if (error.message?.includes('relation') || error.message?.includes('table') || error.message?.includes('does not exist')) {
        console.warn('Scholarships table not found. Trying live scrapers...')
        
        try {
          const { KenyaScholarshipScraperService } = await import('@/services/kenya-scholarship-scraper.service')
          const scraper = new KenyaScholarshipScraperService()
          const liveScholarships = await scraper.searchAllSources({ county: county || undefined })
          
          return NextResponse.json({
            scholarships: liveScholarships.slice(0, limit),
            count: liveScholarships.length,
            limit,
            offset,
            source: 'live_scrapers',
            message: 'Live data (database not set up)',
          })
        } catch (scraperError) {
          console.warn('⚠️ Database and scrapers failed, using mock data')
          
          // Fallback to mock data
          const { getMockScholarships } = await import('@/data/mock-scholarships')
          const mockScholarships = getMockScholarships({
            type: type || undefined,
            county: county || undefined,
            category: category || undefined,
            limit,
          })
          
          return NextResponse.json({
            scholarships: mockScholarships,
            count: mockScholarships.length,
            limit,
            offset,
            source: 'mock',
            message: 'Using mock data (database and scrapers unavailable)',
          })
        }
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
      source: 'database',
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

