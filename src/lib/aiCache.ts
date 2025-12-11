/**
 * AI Response Caching for Offline Support
 * Caches AI responses so similar questions can be answered offline
 */

import { getMessages, saveMessage } from './offlineStorage'

interface CachedResponse {
  question: string
  response: string
  context: any
  timestamp: number
}

const CACHE_KEY = 'ai_responses_cache'
const MAX_CACHE_SIZE = 100 // Maximum cached responses

/**
 * Generate a simple hash for question matching
 */
function hashQuestion(question: string): string {
  // Simple hash - normalize question for matching
  return question
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 100) // Limit length
}

/**
 * Check if we have a cached response for a similar question
 */
export async function getCachedResponse(
  question: string,
  context?: any
): Promise<string | null> {
  if (typeof window === 'undefined') return null

  try {
    const cacheStr = localStorage.getItem(CACHE_KEY)
    if (!cacheStr) return null

    const cache: CachedResponse[] = JSON.parse(cacheStr)
    const questionHash = hashQuestion(question)

    // Find similar questions (exact match or contains keywords)
    const similar = cache.find((cached) => {
      const cachedHash = hashQuestion(cached.question)
      return (
        cachedHash === questionHash ||
        cachedHash.includes(questionHash.substring(0, 20)) ||
        questionHash.includes(cachedHash.substring(0, 20))
      )
    })

    if (similar) {
      // Check if cache is still valid (24 hours)
      const age = Date.now() - similar.timestamp
      if (age < 24 * 60 * 60 * 1000) {
        return `[Cached Response] ${similar.response}\n\n(Note: This is a cached response from a previous session. For the latest answer, please ensure you're online.)`
      }
    }

    return null
  } catch (error) {
    console.error('Failed to get cached response:', error)
    return null
  }
}

/**
 * Cache an AI response
 */
export function cacheResponse(
  question: string,
  response: string,
  context?: any
): void {
  if (typeof window === 'undefined') return

  try {
    const cacheStr = localStorage.getItem(CACHE_KEY)
    let cache: CachedResponse[] = cacheStr ? JSON.parse(cacheStr) : []

    // Add new response
    cache.unshift({
      question,
      response,
      context,
      timestamp: Date.now(),
    })

    // Limit cache size
    if (cache.length > MAX_CACHE_SIZE) {
      cache = cache.slice(0, MAX_CACHE_SIZE)
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.error('Failed to cache response:', error)
  }
}

/**
 * Clear AI response cache
 */
export function clearAICache(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CACHE_KEY)
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { count: number; size: number } {
  if (typeof window === 'undefined') return { count: 0, size: 0 }

  try {
    const cacheStr = localStorage.getItem(CACHE_KEY)
    if (!cacheStr) return { count: 0, size: 0 }

    const cache: CachedResponse[] = JSON.parse(cacheStr)
    return {
      count: cache.length,
      size: new Blob([cacheStr]).size, // Size in bytes
    }
  } catch (error) {
    return { count: 0, size: 0 }
  }
}




