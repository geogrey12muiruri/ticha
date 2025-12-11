/**
 * Scholarship API Service
 * Fetches scholarships from the API instead of mock data
 */

import type { Scholarship, ScholarshipProfile, ScholarshipMatch } from '@/types/scholarship'
import { ScholarshipService } from './scholarship.service'

export class ScholarshipAPIService {
  private static cache: {
    scholarships: Scholarship[]
    timestamp: number
    ttl: number
  } | null = null

  private static readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Fetch all scholarships from API
   */
  static async fetchScholarships(params?: {
    type?: string
    category?: string
    county?: string
    search?: string
    limit?: number
  }): Promise<Scholarship[]> {
    // Check cache first
    if (this.cache && Date.now() - this.cache.timestamp < this.cache.ttl) {
      return this.cache.scholarships
    }

    try {
      const queryParams = new URLSearchParams()
      if (params?.type) queryParams.set('type', params.type)
      if (params?.category) queryParams.set('category', params.category)
      if (params?.county) queryParams.set('county', params.county)
      if (params?.search) queryParams.set('search', params.search)
      if (params?.limit) queryParams.set('limit', params.limit.toString())

      const response = await fetch(`/api/scholarships?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch scholarships: ${response.statusText}`)
      }

      const data = await response.json()
      const scholarships = data.scholarships || []

      // Update cache
      this.cache = {
        scholarships,
        timestamp: Date.now(),
        ttl: this.CACHE_TTL,
      }

      return scholarships
    } catch (error) {
      console.error('Error fetching scholarships:', error)
      
      // Return cached data if available, even if expired
      if (this.cache?.scholarships) {
        console.warn('Using cached scholarships due to fetch error')
        return this.cache.scholarships
      }

      // Fallback to empty array
      return []
    }
  }

  /**
   * Fetch a single scholarship by ID
   */
  static async fetchScholarshipById(id: string): Promise<Scholarship | null> {
    try {
      const response = await fetch(`/api/scholarships/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`Failed to fetch scholarship: ${response.statusText}`)
      }

      const data = await response.json()
      return data.scholarship || null
    } catch (error) {
      console.error('Error fetching scholarship:', error)
      return null
    }
  }

  /**
   * Match student profile to scholarships (using API data)
   */
  static async matchScholarships(
    profile: ScholarshipProfile
  ): Promise<ScholarshipMatch[]> {
    // Fetch scholarships from API
    const scholarships = await this.fetchScholarships({
      county: profile.county,
      limit: 100, // Get more for better matching
    })

    // Use the existing matching logic
    const matches: ScholarshipMatch[] = []

    for (const scholarship of scholarships) {
      const matchScore = ScholarshipService['calculateMatchScore'](profile, scholarship)
      
      if (matchScore > 0) {
        const matchReasons = ScholarshipService['getMatchReasons'](profile, scholarship)
        const applicationSteps = ScholarshipService['generateApplicationSteps'](scholarship)
        const estimatedChance = ScholarshipService['estimateChance'](matchScore)

        matches.push({
          scholarship,
          matchScore,
          matchReasons,
          applicationSteps,
          estimatedChance,
        })
      }
    }

    // Sort by match score (highest first)
    return matches.sort((a, b) => b.matchScore - a.matchScore)
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  static clearCache() {
    this.cache = null
  }
}


