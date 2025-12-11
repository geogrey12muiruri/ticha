/**
 * AI Service
 * Business logic for AI operations
 * 
 * NOTE: This service now uses direct Groq API calls instead of the AI SDK
 * to avoid compatibility issues. The direct API is more reliable.
 */

import { AIGroqDirectService } from './ai-groq-direct.service'
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

export class AIService {
  /**
   * Generate AI response - supports two calling patterns:
   * 1. generateResponse({ message, context }) - for chat tutor
   * 2. generateResponse(prompt, { temperature, maxTokens }) - for other services
   * 
   * Uses direct Groq API calls for reliability
   */
  static async generateResponse(
    paramsOrPrompt: GenerateResponseParams | string,
    options?: GenerateTextOptions
  ): Promise<string> {
    // Delegate to direct Groq API service
    return AIGroqDirectService.generateResponse(paramsOrPrompt, options)
  }
}

