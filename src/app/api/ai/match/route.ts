/**
 * AI Matching API Route
 * POST /api/ai/match
 * Matches student profile to opportunities using AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { AIOpportunityMatcherService } from '@/services/ai-opportunity-matcher.service'
import { ScholarshipAPIService } from '@/services/scholarship-api.service'
import type { ScholarshipProfile } from '@/types/scholarship'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profile } = body

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile is required' },
        { status: 400 }
      )
    }

    console.log('Received profile for matching:', {
      hasCounty: !!profile.county,
      hasConstituency: !!profile.constituency,
      hasAcademicStage: !!profile.academicStage,
      profileKeys: Object.keys(profile),
    })

    // Fetch scholarships - prioritize live scrapers, fallback to database
    let scholarships: any[] = []

    // Check if mock data mode is enabled
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
    
    if (useMockData) {
      console.log('📦 Mock data mode enabled - skipping scrapers and database')
      const { getMockScholarships } = await import('@/data/mock-scholarships')
      scholarships = getMockScholarships({
        county: profile.county || profile.personal?.county,
        limit: 50,
      })
      console.log(`✅ Loaded ${scholarships.length} mock scholarships`)
    } else {
      // First, try to fetch from live scrapers (most up-to-date data)
      // Add timeout to prevent hanging
      try {
        console.log('Fetching from live scrapers...')
      let KenyaScholarshipScraperService: any
      try {
        const module = await import('@/services/kenya-scholarship-scraper.service')
        KenyaScholarshipScraperService = module.KenyaScholarshipScraperService
      } catch (importError: any) {
        console.error('Error importing scraper service:', importError)
        throw new Error(`Failed to import scraper service: ${importError.message}`)
      }
      
      const scraper = new KenyaScholarshipScraperService()
      
      // Add overall timeout for scraping (20 seconds max)
      const scrapePromise = scraper.searchAllSources({
        county: profile.county || undefined,
        limit: 50, // Reduced limit for faster scraping
      })
      
      const timeoutPromise = new Promise<Partial<Scholarship>[]>((_, reject) =>
        setTimeout(() => reject(new Error('Scraping timeout')), 20000)
      )
      
      const liveScholarships = await Promise.race([scrapePromise, timeoutPromise])
      
      if (liveScholarships && liveScholarships.length > 0) {
        console.log(`✅ Found ${liveScholarships.length} scholarships from live scrapers`)
        scholarships = liveScholarships
        
        // Sync to database in background (don't wait)
        scraper.syncToDatabase().catch(err => {
          console.error('Error syncing to database:', err)
        })
      } else {
        console.log('⚠️ No live scholarships found (scrapers returned empty), falling back to database...')
        throw new Error('No live data available')
      }
    } catch (scraperError: any) {
      console.warn('Live scraping failed or timed out, using database:', scraperError.message || scraperError)
      
      // Fallback to database if scrapers fail
      const { createServerClient } = await import('@/lib/supabaseClient')
      const supabase = createServerClient()
      
      let query = supabase
        .from('scholarships')
        .select('*')
        .eq('status', 'active')
        .eq('verified', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100)

      // Apply county filter if provided
      const county = profile.county || profile.personal?.county
      if (county) {
        query = query.contains('eligibility', { counties: [county] })
      }

      const { data: dbData, error: dbError } = await query

      if (dbError) {
        console.error('Database error:', dbError)
        scholarships = []
      } else if (dbData && dbData.length > 0) {
        // Transform database records to Scholarship type
        scholarships = dbData.map((record: any) => ({
          id: record.id,
          name: record.name,
          description: record.description,
          provider: record.provider,
          type: record.type,
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
        console.log(`✅ Using ${scholarships.length} scholarships from database (fallback successful)`)
      } else {
        console.log('Database is empty, using mock data as fallback')
        const { getMockScholarships } = await import('@/data/mock-scholarships')
        scholarships = getMockScholarships({
          county: profile.county || profile.personal?.county,
          limit: 50,
        })
        console.log(`✅ Loaded ${scholarships.length} mock scholarships`)
      }
    }
    }

    // Convert to StudentProfile format for AI matching
    let studentProfile: any
    try {
      studentProfile = mapToStudentProfile(profile)
      console.log('Mapped student profile:', {
        hasPersonal: !!studentProfile.personal,
        hasAcademicStage: !!studentProfile.academicStage,
      })
    } catch (mapError: any) {
      console.error('Error mapping profile:', mapError)
      // Use profile as-is if mapping fails
      studentProfile = profile
    }

    // Use AI-powered matching (with timeout and graceful fallback)
    try {
      // Set a timeout for AI matching (don't wait too long)
      const aiMatchingPromise = AIOpportunityMatcherService.matchWithAI(
        studentProfile,
        scholarships
      )
      
      // Race against a timeout (reduced for faster fallback)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI matching timeout')), 15000) // 15 second timeout (allows for 5s per match x 3 matches)
      )
      
      const aiMatches = await Promise.race([aiMatchingPromise, timeoutPromise]) as any[]

      // Convert AI matches back to standard format
      const matches = aiMatches.map(match => ({
        scholarship: match.scholarship,
        matchScore: match.matchScore,
        matchReasons: match.matchReasons,
        applicationSteps: match.applicationSteps,
        estimatedChance: match.estimatedChance,
        aiExplanation: match.aiExplanation,
        aiRecommendation: match.aiRecommendation,
        improvementSuggestions: match.improvementSuggestions,
      }))

      return NextResponse.json({ 
        matches, 
        aiEnhanced: true,
        source: 'live_scrapers',
        count: scholarships.length
      })
    } catch (aiError: any) {
      console.warn('AI matching failed or timed out, using rule-based fallback:', aiError.message)
      
      // Check if we should use mock data
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
      if (useMockData && scholarships.length === 0) {
        console.log('📦 No scholarships available, loading mock data')
        const { getMockScholarships } = await import('@/data/mock-scholarships')
        scholarships = getMockScholarships({
          county: profile.county || profile.personal?.county,
          limit: 50,
        })
        console.log(`✅ Loaded ${scholarships.length} mock scholarships for matching`)
      }
      
      // Fallback to rule-based matching
      const { ScholarshipService } = await import('@/services/scholarship.service')
      const matches = []

      for (const scholarship of scholarships) {
        const matchScore = ScholarshipService.calculateMatchScore(profile, scholarship)
        
        if (matchScore > 0) {
          const matchReasons = ScholarshipService.getMatchReasons(profile, scholarship)
          const applicationSteps = ScholarshipService.generateApplicationSteps(scholarship)
          const estimatedChance = ScholarshipService.estimateChance(matchScore)

          matches.push({
            scholarship,
            matchScore,
            matchReasons,
            applicationSteps,
            estimatedChance,
          })
        }
      }

      matches.sort((a, b) => b.matchScore - a.matchScore)

      return NextResponse.json({ 
        matches,
        fallback: true,
        aiEnhanced: false,
        source: scholarships.length > 0 ? 'database' : 'none',
        message: 'Using rule-based matching (AI unavailable)'
      })
    }
  } catch (error: any) {
    console.error('Error in AI matching API:', error)
    console.error('Error stack:', error.stack)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      cause: error.cause,
    })
    return NextResponse.json(
      { 
        error: error.message || 'Failed to match opportunities',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * Map ScholarshipProfile to StudentProfile format
 * Handles both ScholarshipProfile and StudentProfile formats
 */
function mapToStudentProfile(profile: any): any {
  // If already in StudentProfile format, return as-is
  if (profile.personal && profile.academicStage) {
    return profile
  }

  // Map from ScholarshipProfile format
  return {
    personal: {
      county: profile.county || profile.personal?.county,
      constituency: profile.constituency || profile.personal?.constituency,
      schoolName: profile.currentSchool || profile.personal?.schoolName,
      firstName: profile.name?.split(' ')[0] || profile.personal?.firstName,
    },
    academicStage: {
      stage: profile.academicStage?.stage || 
             (profile.curriculum === 'CBC' ? 'JuniorSecondary' : 'SeniorSecondary') ||
             'SeniorSecondary',
      currentClassOrLevel: profile.academicStage?.currentClassOrLevel || 
                          `Grade ${profile.grade || 8}`,
    },
    subjectsCompetencies: {
      subjectsTaken: profile.subjects || profile.subjectsCompetencies?.subjectsTaken || [],
      preferredStream: profile.preferredField || profile.subjectsCompetencies?.preferredStream,
    },
    careerGoals: {
      longTerm: profile.careerInterest || profile.careerGoals?.longTerm,
      shortTerm: profile.learningGoals?.[0] || profile.careerGoals?.shortTerm,
    },
    skillsAndCertifications: [
      ...(profile.currentSkills || []).map((skill: string) => ({ skill, proficiency: 'Intermediate' })),
      ...(profile.skillsWanted || []).map((skill: string) => ({ skill, proficiency: 'Beginner' })),
      ...(profile.skillsAndCertifications || []),
    ],
    projectsPortfolio: profile.projects || profile.projectsPortfolio || [],
    extracurricularsAndAwards: profile.extracurriculars?.map((type: string) => ({ type, years: '2024' })) || 
                              profile.extracurricularsAndAwards || [],
  }
}

