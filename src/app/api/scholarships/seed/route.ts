/**
 * Seed Database API Route
 * POST /api/scholarships/seed
 * Seeds the database with comprehensive test data
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SEED_SCHOLARSHIPS, convertSeedToDatabase } from '@/data/seed-data'

export const dynamic = 'force-dynamic'

/**
 * Create Supabase client with service role (bypasses RLS)
 * For seeding/admin operations only
 */
function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  }

  // Use service role key if available (bypasses RLS), otherwise use anon key
  // Note: If using anon key, you need to run migration 003 to allow service role inserts
  const key = serviceRoleKey || anonKey
  
  if (!serviceRoleKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found. Using anon key. RLS policies may block inserts.')
    console.warn('   To fix: Add SUPABASE_SERVICE_ROLE_KEY to .env.local or run migration 003_allow_service_role_seeding.sql')
  }

  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    // Use service role client to bypass RLS for seeding
    const supabase = createServiceRoleClient()
    const stats = {
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    }

    console.log(`Starting seed: ${SEED_SCHOLARSHIPS.length} opportunities to process`)

    for (const seed of SEED_SCHOLARSHIPS) {
      try {
        const scholarshipData = convertSeedToDatabase(seed)

        // Check if already exists (by name)
        // Use service role to bypass RLS for checking
        const { data: existing } = await supabase
          .from('scholarships')
          .select('id, name')
          .eq('name', seed.name)
          .maybeSingle()

        if (existing) {
          // Update existing - use service role to bypass RLS
          const { error } = await supabase
            .from('scholarships')
            .update({
              ...scholarshipData,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id)

          if (error) {
            console.error(`Update error for ${seed.name}:`, error)
            throw error
          }
          stats.updated++
          console.log(`✅ Updated: ${seed.name}`)
        } else {
          // Insert new - use service role to bypass RLS
          const { error } = await supabase
            .from('scholarships')
            .insert(scholarshipData)

          if (error) {
            console.error(`Insert error for ${seed.name}:`, error)
            throw error
          }
          stats.inserted++
          console.log(`✅ Inserted: ${seed.name}`)
        }
      } catch (error: any) {
        const errorMsg = `Error processing ${seed.name}: ${error.message}`
        console.error(errorMsg)
        stats.errors.push(errorMsg)
        stats.skipped++
      }
    }

    const summary = {
      success: true,
      total: SEED_SCHOLARSHIPS.length,
      inserted: stats.inserted,
      updated: stats.updated,
      skipped: stats.skipped,
      errors: stats.errors,
      message: `Seeded ${stats.inserted} new and updated ${stats.updated} existing opportunities`,
    }

    console.log('Seed complete:', summary)

    return NextResponse.json(summary, { status: 200 })
  } catch (error: any) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to seed database',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/scholarships/seed
 * Returns information about seed data without seeding
 */
export async function GET() {
  const summary = {
    total: SEED_SCHOLARSHIPS.length,
    byType: SEED_SCHOLARSHIPS.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    byCategory: SEED_SCHOLARSHIPS.reduce((acc, s) => {
      const cat = s.category || 'Uncategorized'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    counties: Array.from(
      new Set(
        SEED_SCHOLARSHIPS.flatMap(s => s.eligibility?.counties || [])
      )
    ),
    message: 'Use POST /api/scholarships/seed to seed the database',
  }

  return NextResponse.json(summary)
}

