/**
 * AI Career Advisor Service
 * Chat-based career guidance for Kenyan students
 */

import { AIService } from './ai.service'
import type { StudentProfile } from '@/types/student-profile'
import type { Scholarship } from '@/types/scholarship'

export interface CareerAdvice {
  answer: string
  relatedOpportunities?: Array<{
    name: string
    type: string
    matchReason: string
  }>
  suggestions?: string[]
}

export class AICareerAdvisorService {
  /**
   * Answer career-related questions
   */
  static async answerQuestion(
    question: string,
    profile?: Partial<StudentProfile>,
    availableOpportunities?: Scholarship[]
  ): Promise<CareerAdvice> {
    const profileContext = profile
      ? `
Student Profile:
- Stage: ${profile.academicStage?.stage} - ${profile.academicStage?.currentClassOrLevel}
- Subjects: ${profile.subjectsCompetencies?.subjectsTaken?.join(', ') || 'Not specified'}
- Stream: ${profile.subjectsCompetencies?.preferredStream || 'Not specified'}
- Career Goal: ${profile.careerGoals?.longTerm || profile.careerGoals?.shortTerm || 'Not specified'}
- Skills: ${profile.skillsAndCertifications?.map(s => s.skill).join(', ') || 'None'}
- County: ${profile.personal?.county || 'Not specified'}
`
      : ''

    const opportunitiesContext = availableOpportunities
      ? `
Available Opportunities:
${availableOpportunities.slice(0, 5).map(opp => `- ${opp.name} (${opp.type})`).join('\n')}
`
      : ''

    const prompt = `You are a career advisor for Kenyan students. Answer this question with helpful, practical advice that considers the Kenyan education system (CBC, KCSE, KUCCPS, TVET).

Question: ${question}

${profileContext}
${opportunitiesContext}

Provide:
1. **Direct Answer**: Clear, helpful answer to the question
2. **Kenyan Context**: Reference Kenyan education system, opportunities, pathways where relevant
3. **Actionable Advice**: Specific steps or recommendations
4. **Related Opportunities**: If relevant, suggest specific scholarships, courses, or programs
5. **Encouragement**: Be supportive and motivating

Return JSON:
{
  "answer": "Comprehensive answer to the question...",
  "relatedOpportunities": [
    {
      "name": "Opportunity name",
      "type": "scholarship|course|bootcamp|mentorship|internship",
      "matchReason": "Why this matches"
    }
  ],
  "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2"]
}`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.6,
        maxTokens: 1000,
      })

      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        // Fallback: return answer as plain text
        return {
          answer: response.trim(),
          suggestions: [],
        }
      }

      return JSON.parse(jsonMatch[0]) as CareerAdvice
    } catch (error) {
      console.error('Error answering career question:', error)
      return {
        answer: 'I apologize, but I encountered an error. Please try rephrasing your question.',
        suggestions: [],
      }
    }
  }

  /**
   * Get career recommendations based on profile
   */
  static async recommendCareer(profile: Partial<StudentProfile>): Promise<{
    recommendedCareers: Array<{
      career: string
      reason: string
      pathway: string[]
      opportunities: string[]
    }>
    explanation: string
  }> {
    const prompt = `Based on this student profile, recommend 3-5 suitable careers with pathways.

Profile:
- Stage: ${profile.academicStage?.stage} - ${profile.academicStage?.currentClassOrLevel}
- Subjects: ${profile.subjectsCompetencies?.subjectsTaken?.join(', ')}
- Stream: ${profile.subjectsCompetencies?.preferredStream}
- Skills: ${profile.skillsAndCertifications?.map(s => s.skill).join(', ')}
- Interests: ${profile.subjectsCompetencies?.competencyTags?.join(', ') || 'Not specified'}
- Achievements: ${profile.extracurricularsAndAwards?.map(a => a.type).join(', ') || 'None'}

For each recommended career, provide:
1. Career name
2. Why it's a good fit
3. Pathway steps (what to study, courses to take, etc.)
4. Relevant opportunities (scholarships, programs)

Consider:
- Kenyan job market
- Education pathways (KUCCPS, TVET, University)
- Student's strengths and interests
- Realistic and achievable paths

Return JSON:
{
  "recommendedCareers": [
    {
      "career": "Career name",
      "reason": "Why this career fits",
      "pathway": ["Step 1", "Step 2", ...],
      "opportunities": ["Opportunity 1", "Opportunity 2"]
    }
  ],
  "explanation": "Overall explanation of recommendations"
}`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.5,
        maxTokens: 2000,
      })

      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error recommending careers:', error)
      return {
        recommendedCareers: [],
        explanation: 'Unable to generate career recommendations at this time.',
      }
    }
  }
}


