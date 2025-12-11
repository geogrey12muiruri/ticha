/**
 * AI Course Summarizer Service
 * Summarizes long course descriptions for students
 */

import { AIService } from './ai.service'

export interface CourseSummary {
  title: string
  shortDescription: string // 1-2 sentences
  keyPoints: string[] // 3-5 bullet points
  whoIsThisFor: string
  whatYouWillLearn: string[]
  timeCommitment: string
  prerequisites: string[]
  cost: string
}

export class AICourseSummarizerService {
  /**
   * Summarize a course description
   */
  static async summarizeCourse(
    courseName: string,
    fullDescription: string,
    additionalInfo?: {
      duration?: string
      cost?: string
      platform?: string
    }
  ): Promise<CourseSummary> {
    const prompt = `You are a course summarizer. Summarize this course description in a clear, concise way that helps students quickly understand if it's right for them.

Course Name: ${courseName}

Full Description:
${fullDescription}

${additionalInfo?.duration ? `Duration: ${additionalInfo.duration}\n` : ''}
${additionalInfo?.cost ? `Cost: ${additionalInfo.cost}\n` : ''}
${additionalInfo?.platform ? `Platform: ${additionalInfo.platform}\n` : ''}

Extract and summarize:
1. **Short Description** (1-2 sentences): What is this course about?
2. **Key Points** (3-5 bullet points): Main highlights
3. **Who Is This For**: Target audience
4. **What You Will Learn** (3-5 items): Key learning outcomes
5. **Time Commitment**: How much time is needed
6. **Prerequisites**: What you need to know before starting
7. **Cost**: Cost information

Return JSON:
{
  "title": "${courseName}",
  "shortDescription": "1-2 sentence summary",
  "keyPoints": ["...", "..."],
  "whoIsThisFor": "Target audience description",
  "whatYouWillLearn": ["...", "..."],
  "timeCommitment": "e.g., '2-3 hours per week for 4 weeks'",
  "prerequisites": ["..."],
  "cost": "Free|KES X|Affordable"
}`

    try {
      const response = await AIService.generateResponse(prompt, {
        temperature: 0.3,
        maxTokens: 1000,
      })

      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      return JSON.parse(jsonMatch[0]) as CourseSummary
    } catch (error) {
      console.error('Error summarizing course:', error)
      return {
        title: courseName,
        shortDescription: fullDescription.substring(0, 200),
        keyPoints: [],
        whoIsThisFor: 'Students interested in this topic',
        whatYouWillLearn: [],
        timeCommitment: additionalInfo?.duration || 'Not specified',
        prerequisites: [],
        cost: additionalInfo?.cost || 'Not specified',
      }
    }
  }

  /**
   * Batch summarize multiple courses
   */
  static async summarizeCourses(
    courses: Array<{
      name: string
      description: string
      duration?: string
      cost?: string
      platform?: string
    }>
  ): Promise<CourseSummary[]> {
    // Summarize in parallel (with rate limiting consideration)
    const summaries = await Promise.all(
      courses.map(course =>
        this.summarizeCourse(course.name, course.description, {
          duration: course.duration,
          cost: course.cost,
          platform: course.platform,
        })
      )
    )

    return summaries
  }
}


