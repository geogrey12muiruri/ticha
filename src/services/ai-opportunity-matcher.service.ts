/**
 * AI Opportunity Matcher Service
 * Core matching engine using AI to match students to opportunities
 * Combines structured scoring with LLM explanation
 */

import { AIService } from './ai.service'
import { ScholarshipService } from './scholarship.service'
import type { StudentProfile } from '@/types/student-profile'
import type { Scholarship, ScholarshipMatch } from '@/types/scholarship'

export interface AIMatchResult extends ScholarshipMatch {
  aiExplanation: string // LLM-generated explanation of why this matches
  aiRecommendation: 'strong' | 'moderate' | 'weak' // AI assessment
  improvementSuggestions?: string[] // How to improve match score
}

export class AIOpportunityMatcherService {
  /**
   * Match student profile to opportunities with AI explanations
   */
  static async matchWithAI(
    profile: Partial<StudentProfile>,
    opportunities: Scholarship[]
  ): Promise<AIMatchResult[]> {
    // First, get structured matches using existing algorithm
    const legacyProfile = this.mapToLegacyProfile(profile)
    const structuredMatches: ScholarshipMatch[] = []

    for (const opportunity of opportunities) {
      const matchScore = ScholarshipService.calculateMatchScore(legacyProfile, opportunity)
      
      if (matchScore > 0) {
        const matchReasons = ScholarshipService.getMatchReasons(legacyProfile, opportunity)
        const applicationSteps = ScholarshipService.generateApplicationSteps(opportunity)
        const estimatedChance = ScholarshipService.estimateChance(matchScore)

        structuredMatches.push({
          scholarship: opportunity,
          matchScore,
          matchReasons,
          applicationSteps,
          estimatedChance,
        })
      }
    }

    // Sort by score
    structuredMatches.sort((a, b) => b.matchScore - a.matchScore)

    // Get top matches and enhance with AI explanations
    const topMatches = structuredMatches.slice(0, 10)
    const aiEnhanced = await Promise.all(
      topMatches.map(match => this.enhanceMatchWithAI(profile, match))
    )

    return aiEnhanced
  }

  /**
   * Enhance a match with AI explanation
   */
  private static async enhanceMatchWithAI(
    profile: Partial<StudentProfile>,
    match: ScholarshipMatch
  ): Promise<AIMatchResult> {
    const prompt = `You are an opportunity matching advisor. Explain why this opportunity matches (or doesn't match) this student profile.

Student Profile:
- Name: ${profile.personal?.firstName} ${profile.personal?.lastName}
- Stage: ${profile.academicStage?.stage} - ${profile.academicStage?.currentClassOrLevel}
- Subjects: ${profile.subjectsCompetencies?.subjectsTaken?.join(', ') || 'Not specified'}
- Stream: ${profile.subjectsCompetencies?.preferredStream || 'Not specified'}
- Career Goal: ${profile.careerGoals?.longTerm || profile.careerGoals?.shortTerm || 'Not specified'}
- Skills: ${profile.skillsAndCertifications?.map(s => s.skill).join(', ') || 'None'}
- County: ${profile.personal?.county || 'Not specified'}
- Projects: ${profile.projectsPortfolio?.map(p => p.title).join(', ') || 'None'}

Opportunity:
- Name: ${match.scholarship.name}
- Type: ${match.scholarship.type}
- Provider: ${match.scholarship.provider}
- Description: ${match.scholarship.description}
- Eligibility: ${JSON.stringify(match.scholarship.eligibility)}

Match Score: ${match.matchScore}%
Match Reasons: ${match.matchReasons.join(', ')}
Estimated Chance: ${match.estimatedChance}

Provide:
1. **Explanation**: 2-3 sentences explaining why this is a good match (or not)
2. **Recommendation**: "strong", "moderate", or "weak" based on match quality
3. **Improvement Suggestions**: If score is low, how can student improve their profile to match better?

Return JSON:
{
  "aiExplanation": "Explanation of the match...",
  "aiRecommendation": "strong|moderate|weak",
  "improvementSuggestions": ["Suggestion 1", "Suggestion 2"]
}`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.4,
        maxTokens: 500,
      })

      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const aiData = JSON.parse(jsonMatch[0])
        return {
          ...match,
          aiExplanation: aiData.aiExplanation || match.matchReasons.join('. '),
          aiRecommendation: aiData.aiRecommendation || 'moderate',
          improvementSuggestions: aiData.improvementSuggestions || [],
        }
      }

      // Fallback
      return {
        ...match,
        aiExplanation: match.matchReasons.join('. '),
        aiRecommendation: match.estimatedChance === 'high' ? 'strong' : match.estimatedChance === 'medium' ? 'moderate' : 'weak',
        improvementSuggestions: [],
      }
    } catch (error) {
      console.error('Error enhancing match with AI:', error)
      return {
        ...match,
        aiExplanation: match.matchReasons.join('. '),
        aiRecommendation: match.estimatedChance === 'high' ? 'strong' : 'moderate',
        improvementSuggestions: [],
      }
    }
  }

  /**
   * Map new profile format to legacy format for compatibility
   */
  private static mapToLegacyProfile(profile: Partial<StudentProfile>): any {
    return {
      county: profile.personal?.county,
      constituency: profile.personal?.county, // Approximate
      grade: this.extractGrade(profile.academicStage?.currentClassOrLevel),
      curriculum: this.mapStageToCurriculum(profile.academicStage?.stage),
      currentSchool: profile.personal?.schoolName,
      schoolType: profile.personal?.schoolType?.toLowerCase(),
      kcpeScore: profile.assessmentsAndGrades?.kcpe?.score as number,
      kcseGrade: profile.assessmentsAndGrades?.kcse?.meanGrade,
      subjects: profile.subjectsCompetencies?.subjectsTaken,
      preferredField: this.mapStreamToField(profile.subjectsCompetencies?.preferredStream),
      careerInterest: profile.careerGoals?.longTerm || profile.careerGoals?.shortTerm,
      careerGoals: profile.careerGoals?.longTerm ? [profile.careerGoals.longTerm] : [],
      currentSkills: profile.skillsAndCertifications?.map(s => s.skill),
      skillsWanted: profile.skillsAndCertifications?.filter(s => s.proficiency === 'Beginner').map(s => s.skill),
      learningGoals: profile.careerGoals?.shortTerm ? [profile.careerGoals.shortTerm] : [],
      preferredFormat: profile.accessAndReadiness?.device === 'Laptop' ? 'online' : 'any',
      timeAvailability: this.mapHoursToAvailability(profile.accessAndReadiness?.availabilityHoursPerWeek),
      certifications: profile.skillsAndCertifications?.filter(s => s.evidence?.certificateUrl).map(s => s.skill),
      achievements: profile.extracurricularsAndAwards?.map(a => a.type),
      extracurriculars: profile.extracurricularsAndAwards?.map(a => a.type),
      languages: profile.accessAndReadiness?.preferredLanguage ? [profile.accessAndReadiness.preferredLanguage] : [],
      bio: '', // Will be generated by AI
    }
  }

  private static extractGrade(classOrLevel?: string): number | undefined {
    if (!classOrLevel) return undefined
    const gradeMatch = classOrLevel.match(/(\d+)/)
    return gradeMatch ? parseInt(gradeMatch[1]) : undefined
  }

  private static mapStageToCurriculum(stage?: string): '8-4-4' | 'CBC' | undefined {
    if (!stage) return undefined
    if (stage.includes('CBC') || stage === 'JuniorSecondary' || stage === 'Primary') return 'CBC'
    return '8-4-4'
  }

  private static mapStreamToField(stream?: string): string | undefined {
    if (!stream) return undefined
    const mapping: Record<string, string> = {
      'STEM': 'Engineering',
      'Humanities': 'Arts',
      'Arts': 'Design',
      'Commerce': 'Business',
      'Vocational': 'Technical',
    }
    return mapping[stream] || stream
  }

  private static mapHoursToAvailability(hours?: number): 'full-time' | 'part-time' | 'weekends' | 'evenings' | 'flexible' {
    if (!hours) return 'flexible'
    if (hours >= 30) return 'full-time'
    if (hours >= 15) return 'part-time'
    return 'flexible'
  }
}


