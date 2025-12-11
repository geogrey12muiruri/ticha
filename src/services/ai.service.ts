/**
 * AI Service
 * Business logic for AI operations
 */

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { tutorSystemPrompt } from '@/prompts/tutor-prompt'
import { AI_CONFIG } from '@/constants'
import type { ChatContext } from '@/types'

export interface GenerateResponseParams {
  message: string
  context?: ChatContext
}

// Create Groq client at module level (similar to grok.ts pattern)
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY or GROK_API_KEY not found in environment variables')
  }

  // openai() returns a function that can be called with a model name
  return openai({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: apiKey,
  })
}

export class AIService {

  /**
   * Generate AI tutor response
   */
  static async generateResponse({ message, context }: GenerateResponseParams): Promise<string> {
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

Student Question: ${message}

Provide a helpful, culturally relevant response in ${language}:`

      const groqClient = getGroqClient()

      const { text } = await generateText({
        model: groqClient(AI_CONFIG.DEFAULT_MODEL),
        prompt: enhancedPrompt,
        temperature: AI_CONFIG.DEFAULT_TEMPERATURE,
        maxTokens: AI_CONFIG.MAX_TOKENS,
      })

      if (!text) {
        throw new Error('Empty response from AI service')
      }

      return text
    } catch (error: any) {
      console.error('AIService.generateResponse error:', error)
      
      // Provide user-friendly error messages
      if (error.message?.includes('API key') || error.message?.includes('GROQ') || error.message?.includes('GROK')) {
        throw new Error('AI service configuration error. Please check API key settings.')
      }
      
      if (error.message?.includes('rate limit') || error.message?.includes('429')) {
        throw new Error('AI service is temporarily unavailable. Please try again in a moment.')
      }
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.')
      }
      
      // Re-throw with original message if it's already user-friendly
      throw new Error(error.message || 'Failed to generate AI response. Please try again.')
    }
  }
}

