/**
 * Storage Service
 * Unified interface for offline storage operations
 */

import { initDB, saveMessage, getMessages, saveUserPrefs, getUserPrefs } from '@/lib/offlineStorage'
import { cacheResponse, getCachedResponse, clearAICache } from '@/lib/aiCache'
import type { ChatMessage } from '@/types'

export class StorageService {
  /**
   * Initialize storage
   */
  static async initialize(): Promise<void> {
    try {
      await initDB()
    } catch (error) {
      console.error('Storage initialization error:', error)
    }
  }

  /**
   * Save chat message
   */
  static async saveMessage(message: ChatMessage): Promise<void> {
    try {
      await saveMessage(message)
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  /**
   * Get all messages
   */
  static async getMessages(): Promise<ChatMessage[]> {
    try {
      return await getMessages()
    } catch (error) {
      console.error('Failed to get messages:', error)
      return []
    }
  }

  /**
   * Cache AI response
   */
  static cacheAIResponse(question: string, response: string, context?: any): void {
    cacheResponse(question, response, context)
  }

  /**
   * Get cached AI response
   */
  static async getCachedAIResponse(question: string, context?: any): Promise<string | null> {
    return await getCachedResponse(question, context)
  }

  /**
   * Save user preference
   */
  static async saveUserPreference(key: string, value: any): Promise<void> {
    try {
      await saveUserPrefs(key, value)
    } catch (error) {
      console.error('Failed to save user preference:', error)
    }
  }

  /**
   * Get user preference
   */
  static async getUserPreference(key: string): Promise<any | null> {
    try {
      return await getUserPrefs(key)
    } catch (error) {
      console.error('Failed to get user preference:', error)
      return null
    }
  }

  /**
   * Clear AI cache
   */
  static clearCache(): void {
    clearAICache()
  }
}




