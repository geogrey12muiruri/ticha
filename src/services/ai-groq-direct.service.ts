/**
 * Direct Groq API Service
 * Bypasses AI SDK and uses Groq API directly via fetch
 * More reliable and simpler than the SDK wrapper
 */

import { AI_CONFIG } from '@/constants'
import type { ChatContext } from '@/types'

export interface GenerateResponseParams {
  message: string
  context?: ChatContext
}

export interface GenerateTextOptions {
  temperature?: number
  maxTokens?: number
  model?: string
}

export class AIGroqDirectService {
  private static readonly GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
  
  /**
   * Get API key from environment
   */
  private static getApiKey(): string {
    const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY
    if (!apiKey) {
      throw new Error('GROQ_API_KEY or GROK_API_KEY not found in environment variables')
    }
    return apiKey
  }

  /**
   * Generate AI response - supports two calling patterns
   */
  static async generateResponse(
    paramsOrPrompt: GenerateResponseParams | string,
    options?: GenerateTextOptions
  ): Promise<string> {
    try {
      let prompt: string
      let temperature: number
      let maxTokens: number
      let model: string

      // Handle two calling patterns
      if (typeof paramsOrPrompt === 'string') {
        // Pattern 2: generateResponse(prompt, { temperature, maxTokens })
        prompt = paramsOrPrompt
        temperature = options?.temperature ?? AI_CONFIG.DEFAULT_TEMPERATURE
        maxTokens = options?.maxTokens ?? AI_CONFIG.MAX_TOKENS
        model = options?.model ?? AI_CONFIG.DEFAULT_MODEL
      } else {
        // Pattern 1: generateResponse({ message, context })
        const { message, context } = paramsOrPrompt
        const language = context?.language === 'sw' ? 'Kiswahili' : 'English'
        const curriculum = context?.curriculum || 'CBC'
        const subject = context?.subject || 'General'
        const grade = context?.grade || 8

        // Import tutor prompt dynamically to avoid circular dependencies
        const { tutorSystemPrompt } = await import('@/prompts/tutor-prompt')
        
        prompt = `${tutorSystemPrompt}

Current Context:
- Curriculum: ${curriculum}
- Subject: ${subject}
- Grade: ${grade}
- Language: ${language}

Student Question: ${message}

Provide a helpful, culturally relevant response in ${language}:`
        
        temperature = AI_CONFIG.DEFAULT_TEMPERATURE
        maxTokens = AI_CONFIG.MAX_TOKENS
        model = AI_CONFIG.DEFAULT_MODEL
      }

      const apiKey = this.getApiKey()

      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // Reduced to 5 second timeout for faster failure

      try {
        // Call Groq API directly with timeout
        const response = await fetch(this.GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: temperature,
            max_tokens: maxTokens,
          }),
          signal: controller.signal, // Add timeout signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.error?.message || 
            `Groq API error: ${response.status} ${response.statusText}`
          )
        }

        const data = await response.json()
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid response format from Groq API')
        }

        const text = data.choices[0].message.content

        if (!text) {
          throw new Error('Empty response from AI service')
        }

        return text
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        
        // Handle timeout specifically
        if (fetchError.name === 'AbortError' || fetchError.code === 'ETIMEDOUT') {
          throw new Error('AI service request timed out. Please try again.')
        }
        
        // Re-throw other errors
        throw fetchError
      }
    } catch (error: any) {
      console.error('AIGroqDirectService.generateResponse error:', error)
      
      // Provide user-friendly error messages
      if (error.message?.includes('API key') || error.message?.includes('GROQ') || error.message?.includes('GROK')) {
        throw new Error('AI service configuration error. Please check API key settings.')
      }
      
      if (error.message?.includes('rate limit') || error.message?.includes('429')) {
        throw new Error('AI service is temporarily unavailable. Please try again in a moment.')
      }
      
      if (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT') || error.message?.includes('timed out')) {
        throw new Error('AI service request timed out. The service may be slow or unavailable.')
      }
      
      if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('ECONNREFUSED')) {
        throw new Error('Network error. Please check your internet connection.')
      }
      
      // Re-throw with original message if it's already user-friendly
      throw new Error(error.message || 'Failed to generate AI response. Please try again.')
    }
  }
}

