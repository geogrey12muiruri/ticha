import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { tutorSystemPrompt } from '@/prompts/tutor-prompt'

// Configure OpenAI SDK to work with Groq API
// Groq uses OpenAI-compatible API, so we can use the OpenAI SDK
const groqClient = openai({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROK_API_KEY || process.env.GROQ_API_KEY,
})

export async function generateTutorResponse(
  userMessage: string,
  context?: {
    curriculum?: '8-4-4' | 'CBC'
    subject?: string
    language?: 'sw' | 'en'
    grade?: number
  }
) {
  try {
    const language = context?.language === 'sw' ? 'Kiswahili' : 'English'
    const curriculum = context?.curriculum || 'CBC'
    const subject = context?.subject || 'General'
    const grade = context?.grade || 8

    const enhancedPrompt = `${tutorSystemPrompt}

Current Context:
- Curriculum: ${curriculum}
- Subject: ${subject}
- Grade: ${grade}
- Language: ${language}

Student Question: ${userMessage}

Provide a helpful, culturally relevant response in ${language}:`

    const { text } = await generateText({
      model: groqClient('llama-3.3-70b-versatile'), // Updated to supported model
      prompt: enhancedPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return text
  } catch (error) {
    console.error('Error generating tutor response:', error)
    throw new Error('Failed to generate response. Please try again.')
  }
}

// Alternative: Use Anthropic Claude if Groq is unavailable
export async function generateTutorResponseClaude(
  userMessage: string,
  context?: {
    curriculum?: '8-4-4' | 'CBC'
    subject?: string
    language?: 'sw' | 'en'
    grade?: number
  }
) {
  // This would use Anthropic SDK if needed
  // For now, fallback to Groq
  return generateTutorResponse(userMessage, context)
}

