/**
 * Scholarship Sync API
 * Syncs scholarships from Kenya government portals to database
 */

import { NextRequest, NextResponse } from 'next/server'
import { optimizedScholarshipScraper } from '@/services/optimized-scholarship-scraper.service'
import { kenyaScholarshipScraper } from '@/services/kenya-scholarship-scraper.service'
import type { Scholarship } from '@/types/scholarship'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, county, constituency, kenyanOnly } = body

    let results: any[] = []
    let stats = { ministry: 0, ngcdf: 0, county: 0, total: 0, kenyan: 0, international: 0 }

    switch (source) {
      case 'ministry':
        results = await optimizedScholarshipScraper.fetchMinistryScholarships({
          limit: 100,
          kenyanOnly,
        })
        stats.ministry = results.length
        stats.kenyan = optimizedScholarshipScraper['filterKenyanScholarships'](results).length
        stats.international = results.length - stats.kenyan
        break

      case 'ngcdf':
        results = await optimizedScholarshipScraper.fetchNGCDBBursaries({
          county,
          constituency,
        })
        stats.ngcdf = results.length
        break

      case 'county':
        if (!county) {
          return NextResponse.json(
            { error: 'County is required' },
            { status: 400 }
          )
        }
        results = await optimizedScholarshipScraper.fetchCountyBursaries(county)
        stats.county = results.length
        break

      case 'all':
        // Fetch from all sources in parallel and sync to database
        const allSources = await optimizedScholarshipScraper.fetchAllSources({
          kenyanOnly,
          parallel: true,
        })
        
        // Sync to database
        const syncStats = await kenyaScholarshipScraper.syncToDatabase()
        
        return NextResponse.json({
          success: true,
          stats: {
            ...syncStats,
            ...allSources.stats,
          },
          message: `Synced ${syncStats.total} scholarships to database`,
        })

      default:
        return NextResponse.json(
          { error: 'Invalid source. Use: ministry, ngcdf, county, or all' },
          { status: 400 }
        )
    }

    stats.total = results.length

    return NextResponse.json({
      success: true,
      count: results.length,
      scholarships: results,
      stats,
    })
  } catch (error: any) {
    console.error('Error syncing scholarships:', error)
    return NextResponse.json(
      {
        error: 'Failed to sync scholarships',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/scholarships/sync
 * Fetch live scholarships from Kenya government portals (doesn't require database)
 * This is the endpoint you want to use to get live data from external sources
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source') || 'all' // Default to all sources
    const query = searchParams.get('query')
    const county = searchParams.get('county')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const kenyanOnly = searchParams.get('kenyanOnly') === 'true' // Filter for Kenyan students

    let results: Partial<Scholarship>[] = []
    let stats: any = {}

    // Use optimized scraper for better performance
    if (source === 'all') {
      // Fetch from all sources in parallel (optimized)
      const allSources = await optimizedScholarshipScraper.fetchAllSources({
        limit,
        type: type as any,
        county: county || undefined,
        kenyanOnly,
        parallel: true,
      })
      
      results = allSources.all
      stats = allSources.stats
    } else if (source === 'ministry') {
      results = await optimizedScholarshipScraper.fetchMinistryScholarships({
        limit,
        type: type as any,
        kenyanOnly,
      })
      stats = {
        total: results.length,
        kenyan: optimizedScholarshipScraper['filterKenyanScholarships'](results).length,
        international: results.length - optimizedScholarshipScraper['filterKenyanScholarships'](results).length,
      }
    } else if (source === 'ngcdf') {
      results = await optimizedScholarshipScraper.fetchNGCDBBursaries({
        county: county || undefined,
      })
      stats = { total: results.length }
    } else if (source === 'county') {
      if (!county) {
        return NextResponse.json(
          { error: 'County parameter required for county source' },
          { status: 400 }
        )
      }
      results = await optimizedScholarshipScraper.fetchCountyBursaries(county)
      stats = { total: results.length }
    }

    // Apply search query filter if provided
    if (query) {
      const queryLower = query.toLowerCase()
      results = results.filter(
        (s) =>
          s.name?.toLowerCase().includes(queryLower) ||
          s.provider?.toLowerCase().includes(queryLower) ||
          s.description?.toLowerCase().includes(queryLower) ||
          s.eligibility?.countries?.some((c) =>
            c.toLowerCase().includes(queryLower)
          )
      )
    }

    return NextResponse.json({
      success: true,
      source,
      count: results.length,
      scholarships: results,
      stats,
      message: 'Live data from Kenya government portals (optimized)',
      filters: {
        kenyanOnly,
        county: county || null,
        type: type || null,
        query: query || null,
      },
    })
  } catch (error: any) {
    console.error('Error fetching live scholarships:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch live scholarships',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

