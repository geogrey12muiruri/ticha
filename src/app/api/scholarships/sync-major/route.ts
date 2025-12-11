/**
 * Sync Major Scholarships API Route
 * POST /api/scholarships/sync-major
 * Syncs major international scholarships and MOOC platforms to database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabaseClient'
import { MAJOR_SCHOLARSHIPS, MOOC_PLATFORMS, convertScholarshipSourceToScholarship, convertMOOCToScholarship } from '@/data/major-scholarships'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const stats = {
      majorScholarships: 0,
      moocPlatforms: 0,
      errors: [] as string[],
    }

    // Sync major scholarships
    for (const source of MAJOR_SCHOLARSHIPS) {
      try {
        const scholarship = convertScholarshipSourceToScholarship(source)
        
        // Check if already exists
        const { data: existing } = await supabase
          .from('scholarships')
          .select('id')
          .eq('name', scholarship.name)
          .maybeSingle()

        if (existing) {
          // Update existing
          const { error } = await supabase
            .from('scholarships')
            .update({
              ...scholarship,
              verified: true,
              status: 'active',
              priority: 10, // High priority for major scholarships
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id)

          if (error) throw error
        } else {
          // Insert new
          const { error } = await supabase
            .from('scholarships')
            .insert({
              ...scholarship,
              verified: true,
              status: 'active',
              priority: 10,
            })

          if (error) throw error
        }

        stats.majorScholarships++
      } catch (error: any) {
        console.error(`Error syncing ${source.name}:`, error)
        stats.errors.push(`${source.name}: ${error.message}`)
      }
    }

    // Sync MOOC platforms
    for (const platform of MOOC_PLATFORMS) {
      try {
        const scholarship = convertMOOCToScholarship(platform)
        
        // Check if already exists
        const { data: existing } = await supabase
          .from('scholarships')
          .select('id')
          .eq('name', scholarship.name)
          .maybeSingle()

        if (existing) {
          // Update existing
          const { error } = await supabase
            .from('scholarships')
            .update({
              ...scholarship,
              verified: true,
              status: 'active',
              priority: 5, // Medium priority for MOOC platforms
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id)

          if (error) throw error
        } else {
          // Insert new
          const { error } = await supabase
            .from('scholarships')
            .insert({
              ...scholarship,
              verified: true,
              status: 'active',
              priority: 5,
            })

          if (error) throw error
        }

        stats.moocPlatforms++
      } catch (error: any) {
        console.error(`Error syncing ${platform.name}:`, error)
        stats.errors.push(`${platform.name}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Major scholarships and MOOC platforms synced successfully',
      stats: {
        majorScholarships: stats.majorScholarships,
        moocPlatforms: stats.moocPlatforms,
        total: stats.majorScholarships + stats.moocPlatforms,
        errors: stats.errors.length,
      },
      errors: stats.errors.length > 0 ? stats.errors : undefined,
    })
  } catch (error: any) {
    console.error('Error syncing major scholarships:', error)
    return NextResponse.json(
      { error: 'Failed to sync major scholarships', details: error.message },
      { status: 500 }
    )
  }
}

