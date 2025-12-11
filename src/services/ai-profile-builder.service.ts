/**
 * AI Profile Builder Service
 * Helps students create polished, professional profiles from raw input
 */

import { AIService } from './ai.service'
import type { StudentProfile } from '@/types/student-profile'

interface RawProfileInput {
  name?: string
  school?: string
  county?: string
  grade?: number
  subjects?: string[]
  grades?: Record<string, string> | string
  interests?: string
  activities?: string[]
  achievements?: string[]
  projects?: string[]
  careerGoal?: string
}

interface ProfileEnhancement {
  enhancedProfile: Partial<StudentProfile>
  professionalSummary: string
  suggestions: string[]
  confidence: number
}

export class AIProfileBuilderService {
  /**
   * Build a polished profile from raw student input
   */
  static async buildProfileFromRaw(input: RawProfileInput): Promise<ProfileEnhancement> {
    const prompt = `You are an expert profile builder for Kenyan students. Transform the following raw student information into a polished, professional profile suitable for scholarships, mentorships, and opportunities.

Student Information:
${JSON.stringify(input, null, 2)}

Create a comprehensive profile that includes:

1. **Professional Summary** (2 sentences max):
   - Highlight top subjects, key projects/achievements, and career goal
   - Make it compelling and professional
   - Suitable for scholarship/mentor reviewers

2. **Structured Profile Data**:
   - Extract and structure all information
   - Normalize subjects to standard names
   - Identify competency tags from activities/achievements
   - Map career goal to appropriate stream (STEM, Humanities, Arts, Commerce, Vocational)
   - Suggest skills based on subjects and projects

3. **Enhancement Suggestions**:
   - What's missing that would strengthen the profile
   - How to improve existing information
   - Specific recommendations (e.g., "Add your science fair project", "Include GitHub link for coding projects")

Return JSON in this format:
{
  "professionalSummary": "2-sentence professional summary",
  "enhancedProfile": {
    "personal": {
      "firstName": "...",
      "lastName": "...",
      "county": "...",
      "schoolName": "..."
    },
    "academicStage": {
      "stage": "Primary|JuniorSecondary|SeniorSecondary|TVET|University",
      "currentClassOrLevel": "Grade X or Form Y"
    },
    "subjectsCompetencies": {
      "subjectsTaken": ["Mathematics", "Biology", ...],
      "competencyTags": ["Critical thinking", "Digital literacy", ...],
      "preferredStream": "STEM|Humanities|Arts|Commerce|Vocational"
    },
    "skillsAndCertifications": [
      {"skill": "Python", "proficiency": "Beginner|Intermediate|Advanced"}
    ],
    "careerGoals": {
      "shortTerm": "...",
      "longTerm": "..."
    }
  },
  "suggestions": [
    "Add your science fair project to strengthen STEM profile",
    "Include GitHub link for coding projects",
    ...
  ],
  "confidence": 85
}`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.4,
        maxTokens: 2000,
      })

      // Parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      const result = JSON.parse(jsonMatch[0])

      return {
        enhancedProfile: result.enhancedProfile || {},
        professionalSummary: result.professionalSummary || '',
        suggestions: result.suggestions || [],
        confidence: result.confidence || 0,
      }
    } catch (error) {
      console.error('Error building profile with AI:', error)
      throw new Error('Failed to build profile')
    }
  }

  /**
   * Rewrite profile summary in professional style
   */
  static async rewriteSummary(
    profile: Partial<StudentProfile>,
    currentSummary?: string
  ): Promise<string> {
    const prompt = `Rewrite this student profile into a concise professional summary suitable for scholarship/mentor reviewers. Keep it short (2 sentences) and highlight top subjects, projects, and career goal.

${currentSummary ? `Current Summary: ${currentSummary}\n\n` : ''}
Profile Information:
- Name: ${profile.personal?.firstName} ${profile.personal?.lastName}
- School: ${profile.personal?.schoolName || 'Not specified'}
- County: ${profile.personal?.county}
- Stage: ${profile.academicStage?.stage} - ${profile.academicStage?.currentClassOrLevel}
- Subjects: ${profile.subjectsCompetencies?.subjectsTaken?.join(', ') || 'Not specified'}
- Career Goal: ${profile.careerGoals?.longTerm || profile.careerGoals?.shortTerm || 'Not specified'}
- Skills: ${profile.skillsAndCertifications?.map(s => s.skill).join(', ') || 'Not specified'}
- Projects: ${profile.projectsPortfolio?.map(p => p.title).join(', ') || 'None'}
- Achievements: ${profile.extracurricularsAndAwards?.map(a => a.type).join(', ') || 'None'}

Write a professional 2-sentence summary that:
1. Highlights academic strengths (top subjects, grades if available)
2. Mentions key projects/achievements
3. States career goal clearly
4. Is compelling and professional
5. Suitable for scholarship/mentor reviewers

Return ONLY the summary text, no JSON, no explanations.`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.5,
        maxTokens: 200,
      })

      return response.trim()
    } catch (error) {
      console.error('Error rewriting summary:', error)
      return currentSummary || 'Student profile summary'
    }
  }

  /**
   * Evaluate profile and provide improvement suggestions
   */
  static async evaluateProfile(profile: Partial<StudentProfile>): Promise<{
    strengths: string[]
    weaknesses: string[]
    suggestions: string[]
    overallScore: number
  }> {
    const prompt = `You are an academic portfolio evaluator. Analyze this student profile and provide:

1. **Strengths**: What makes this profile strong
2. **Weaknesses**: What's missing or could be improved
3. **Suggestions**: Specific, actionable recommendations
4. **Overall Score**: 0-100 based on completeness and competitiveness

Profile:
${JSON.stringify(profile, null, 2)}

Consider:
- Completeness of information
- Academic performance indicators
- Skills and certifications
- Projects and portfolio
- Extracurricular activities
- Career goal clarity
- Competitiveness for scholarships/opportunities

Return JSON:
{
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": [
    "Add your science fair project to make your profile stronger for STEM scholarships",
    "You need more math-related courses to be competitive for data science",
    ...
  ],
  "overallScore": 75
}`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.3,
        maxTokens: 1500,
      })

      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error evaluating profile:', error)
      return {
        strengths: [],
        weaknesses: [],
        suggestions: [],
        overallScore: 0,
      }
    }
  }
}


