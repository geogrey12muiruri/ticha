/**
 * AI Career & Learning Path Generator
 * Generates personalized learning and career paths based on student profile
 */

import { AIService } from './ai.service'
import type { StudentProfile } from '@/types/student-profile'
import type { Scholarship } from '@/types/scholarship'

export interface LearningPath {
  title: string
  description: string
  steps: PathStep[]
  estimatedDuration: string
  careerAlignment: string
}

export interface PathStep {
  order: number
  type: 'course' | 'scholarship' | 'bootcamp' | 'mentorship' | 'internship' | 'skill'
  title: string
  description: string
  why: string // Why this step is recommended
  resources?: Array<{
    name: string
    type: string
    link?: string
    cost?: string
  }>
  prerequisites?: string[]
  estimatedTime?: string
}

export class AIPathGeneratorService {
  /**
   * Generate personalized learning and career path
   */
  static async generatePath(
    profile: Partial<StudentProfile>,
    availableOpportunities: Scholarship[]
  ): Promise<LearningPath> {
    const prompt = `You are a career and learning path advisor for Kenyan students. Generate a personalized 5-step learning and career path based on this student profile.

Student Profile:
- Name: ${profile.personal?.firstName} ${profile.personal?.lastName}
- Stage: ${profile.academicStage?.stage} - ${profile.academicStage?.currentClassOrLevel}
- Subjects: ${profile.subjectsCompetencies?.subjectsTaken?.join(', ') || 'Not specified'}
- Stream: ${profile.subjectsCompetencies?.preferredStream || 'Not specified'}
- Career Goal: ${profile.careerGoals?.longTerm || profile.careerGoals?.shortTerm || 'Not specified'}
- Current Skills: ${profile.skillsAndCertifications?.map(s => s.skill).join(', ') || 'None'}
- Projects: ${profile.projectsPortfolio?.map(p => p.title).join(', ') || 'None'}
- Achievements: ${profile.extracurricularsAndAwards?.map(a => a.type).join(', ') || 'None'}

Available Opportunities (sample):
${availableOpportunities.slice(0, 10).map(opp => `- ${opp.name} (${opp.type}): ${opp.description}`).join('\n')}

Generate a personalized path that:
1. Aligns with their career goal
2. Builds on their current strengths
3. Addresses skill gaps
4. Includes specific courses, scholarships, and opportunities
5. Is realistic and achievable
6. Considers their academic stage

Return JSON:
{
  "title": "Path to [Career Goal]",
  "description": "Overview of the path",
  "careerAlignment": "How this path aligns with career goal",
  "estimatedDuration": "e.g., '12-18 months'",
  "steps": [
    {
      "order": 1,
      "type": "course|scholarship|bootcamp|mentorship|internship|skill",
      "title": "Step title",
      "description": "What to do",
      "why": "Why this step is recommended",
      "resources": [
        {"name": "Resource name", "type": "Course|Scholarship|...", "link": "url", "cost": "Free|KES X"}
      ],
      "prerequisites": ["..."],
      "estimatedTime": "e.g., '3 months'"
    },
    ...
  ]
}`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.5,
        maxTokens: 2500,
      })

      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      return JSON.parse(jsonMatch[0]) as LearningPath
    } catch (error) {
      console.error('Error generating path:', error)
      // Return default path
      return {
        title: 'Personalized Learning Path',
        description: 'A path tailored to your goals and strengths',
        careerAlignment: 'Aligned with your career aspirations',
        estimatedDuration: '12-18 months',
        steps: [],
      }
    }
  }

  /**
   * Generate path explanation with specific recommendations
   */
  static async explainPath(
    profile: Partial<StudentProfile>,
    path: LearningPath
  ): Promise<string> {
    const prompt = `Explain this learning path to a student in a friendly, encouraging way.

Student: ${profile.personal?.firstName} ${profile.personal?.lastName}
Career Goal: ${profile.careerGoals?.longTerm || 'Not specified'}
Current Stage: ${profile.academicStage?.currentClassOrLevel}

Path: ${path.title}
Steps: ${path.steps.length}

Write a 3-4 paragraph explanation that:
1. Acknowledges their strengths and goals
2. Explains why this path is recommended
3. Highlights key steps and why they matter
4. Encourages and motivates
5. Mentions specific opportunities (courses, scholarships) they should pursue

Be warm, encouraging, and specific. Use Kenyan context where relevant.`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.6,
        maxTokens: 500,
      })

      return response.trim()
    } catch (error) {
      console.error('Error explaining path:', error)
      return `This personalized path is designed to help you achieve your career goal of ${profile.careerGoals?.longTerm || 'your chosen field'}. Follow the steps to build the skills and qualifications you need.`
    }
  }
}


