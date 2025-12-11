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

    // Fetch scholarships directly from database (server-side)
    // Don't use ScholarshipAPIService.fetchScholarships() as it uses relative URLs
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
    if (profile.county) {
      query = query.contains('eligibility', { counties: [profile.county] })
    }

    const { data: dbData, error: dbError } = await query

    let scholarships: any[] = []

    // If database is empty or error, fetch from scrapers
    if (dbError || !dbData || dbData.length === 0) {
      console.log('Database empty or error, fetching from live scrapers...')
      try {
        const { KenyaScholarshipScraperService } = await import('@/services/kenya-scholarship-scraper.service')
        const scraper = new KenyaScholarshipScraperService()
        const liveScholarships = await scraper.searchAllSources({
          county: profile.county || undefined,
        })
        scholarships = liveScholarships
      } catch (scraperError) {
        console.error('Error fetching from scrapers:', scraperError)
        scholarships = []
      }
    } else {
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
    }

    // Convert to StudentProfile format for AI matching
    const studentProfile = mapToStudentProfile(profile)

    // Use AI-powered matching (with timeout and graceful fallback)
    try {
      // Set a timeout for AI matching (don't wait too long)
      const aiMatchingPromise = AIOpportunityMatcherService.matchWithAI(
        studentProfile,
        scholarships
      )
      
      // Race against a timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI matching timeout')), 8000) // 8 second timeout
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

      return NextResponse.json({ matches, aiEnhanced: true })
    } catch (aiError: any) {
      console.warn('AI matching failed or timed out, using rule-based fallback:', aiError.message)
      
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
        message: 'Using rule-based matching (AI unavailable)'
      })
    }
  } catch (error: any) {
    console.error('Error in AI matching API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to match opportunities' },
      { status: 500 }
    )
  }
}

/**
 * Map ScholarshipProfile to StudentProfile format
 */
function mapToStudentProfile(profile: ScholarshipProfile): any {
  return {
    personal: {
      county: profile.county,
      constituency: profile.constituency,
      schoolName: profile.currentSchool,
    },
    academicStage: {
      stage: profile.curriculum === 'CBC' ? 'JuniorSecondary' : 'SeniorSecondary',
      currentClassOrLevel: `Grade ${profile.grade || 8}`,
    },
    subjectsCompetencies: {
      subjectsTaken: profile.subjects || [],
      preferredStream: profile.preferredField,
    },
    careerGoals: {
      longTerm: profile.careerInterest,
      shortTerm: profile.learningGoals?.[0],
    },
    skillsAndCertifications: [
      ...(profile.currentSkills || []).map(skill => ({ skill, proficiency: 'Intermediate' })),
      ...(profile.skillsWanted || []).map(skill => ({ skill, proficiency: 'Beginner' })),
    ],
    projectsPortfolio: profile.projects || [],
    extracurricularsAndAwards: profile.extracurriculars?.map(type => ({ type, years: '2024' })) || [],
  }
}

