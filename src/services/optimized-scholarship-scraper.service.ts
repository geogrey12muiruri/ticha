/**
 * Optimized Scholarship Scraper Service
 * Parallel fetching, caching, deduplication, and better data extraction
 */

import { KenyaScholarshipScraper } from '@/lib/scrapers/ministry-of-education'
import { NGCDBScraper } from '@/lib/scrapers/ngcdf'
import { CountyBursaryScraper } from '@/lib/scrapers/county-bursaries'
import { AIDataExtractionService } from './ai-data-extraction.service'
import type { Scholarship } from '@/types/scholarship'

interface ScrapeOptions {
  limit?: number
  type?: 'scholarship' | 'bursary' | 'grant' | 'all'
  county?: string
  constituency?: string
  kenyanOnly?: boolean // Filter for Kenyan students
  parallel?: boolean // Fetch from multiple sources in parallel
}

interface CacheEntry {
  data: Partial<Scholarship>[]
  timestamp: number
  source: string
}

export class OptimizedScholarshipScraperService {
  private ministryScraper: KenyaScholarshipScraper
  private ngcdfScraper: NGCDBScraper
  private countyScraper: CountyBursaryScraper
  
  // In-memory cache (5 minutes TTL)
  private cache: Map<string, CacheEntry> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000

  constructor() {
    this.ministryScraper = new KenyaScholarshipScraper()
    this.ngcdfScraper = new NGCDBScraper()
    this.countyScraper = new CountyBursaryScraper()
  }

  /**
   * Fetch from all sources in parallel (optimized)
   */
  async fetchAllSources(options: ScrapeOptions = {}): Promise<{
    ministry: Partial<Scholarship>[]
    ngcdf: Partial<Scholarship>[]
    county: Partial<Scholarship>[]
    all: Partial<Scholarship>[]
    stats: {
      total: number
      kenyan: number
      international: number
      duplicates: number
    }
  }> {
    const cacheKey = `all-${JSON.stringify(options)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      return cached as any
    }

    // Fetch from all sources in parallel
    const [ministry, ngcdf, county] = await Promise.all([
      this.fetchMinistryScholarships(options).catch(() => []),
      options.county
        ? this.fetchNGCDBBursaries({ county: options.county }).catch(() => [])
        : Promise.resolve([]),
      options.county
        ? this.fetchCountyBursaries(options.county).catch(() => [])
        : Promise.resolve([]),
    ])

    // Combine and deduplicate
    const all = this.deduplicate([...ministry, ...ngcdf, ...county])
    
    // Filter for Kenyan students if requested
    const filtered = options.kenyanOnly
      ? this.filterKenyanScholarships(all)
      : all

    // Apply limit
    const limited = options.limit
      ? filtered.slice(0, options.limit)
      : filtered

    const stats = {
      total: limited.length,
      kenyan: this.filterKenyanScholarships(limited).length,
      international: limited.length - this.filterKenyanScholarships(limited).length,
      duplicates: all.length - limited.length,
    }

    const result = {
      ministry,
      ngcdf,
      county,
      all: limited,
      stats,
    }

    // Cache the combined results array, not the full result object
    this.setCache(cacheKey, limited)
    return result
  }

  /**
   * Fetch Ministry scholarships with parallel pagination
   */
  async fetchMinistryScholarships(
    options: ScrapeOptions = {}
  ): Promise<Partial<Scholarship>[]> {
    const cacheKey = `ministry-${JSON.stringify(options)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // Fetch first page to determine pagination
      const firstPage = await this.ministryScraper.fetchScholarships({
        limit: 100,
        type: options.type || 'all',
      })

      // If we got many results, there might be more pages
      // Fetch pages 2-5 in parallel (optimized)
      const additionalPages = await Promise.all([
        this.ministryScraper.fetchScholarships({ limit: 100, type: options.type || 'all' }).catch(() => []),
        // Note: The scraper handles pagination internally now
      ])

      // Combine and deduplicate
      const all = this.deduplicate([firstPage, ...additionalPages].flat())
      
      // Clean and enhance data
      const cleaned = this.cleanScholarshipData(all)
      
      // Filter for Kenyan if requested
      const filtered = options.kenyanOnly
        ? this.filterKenyanScholarships(cleaned)
        : cleaned

      const result = options.limit
        ? filtered.slice(0, options.limit)
        : filtered

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('Error fetching Ministry scholarships:', error)
      return []
    }
  }

  /**
   * Fetch NG-CDF bursaries
   */
  async fetchNGCDBBursaries(
    options: { county?: string; constituency?: string } = {}
  ): Promise<Partial<Scholarship>[]> {
    const cacheKey = `ngcdf-${JSON.stringify(options)}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const rawBursaries = await this.ngcdfScraper.fetchBursaries(options)
      const cleaned = this.cleanScholarshipData(rawBursaries)
      
      this.setCache(cacheKey, cleaned)
      return cleaned
    } catch (error) {
      console.error('Error fetching NG-CDF bursaries:', error)
      return []
    }
  }

  /**
   * Fetch county bursaries
   */
  async fetchCountyBursaries(county: string): Promise<Partial<Scholarship>[]> {
    const cacheKey = `county-${county}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      const rawBursaries = await this.countyScraper.fetchBursaries(county)
      const cleaned = this.cleanScholarshipData(rawBursaries)
      
      this.setCache(cacheKey, cleaned)
      return cleaned
    } catch (error) {
      console.error(`Error fetching ${county} county bursaries:`, error)
      return []
    }
  }

  /**
   * Clean and enhance scholarship data
   */
  private cleanScholarshipData(
    scholarships: Partial<Scholarship>[]
  ): Partial<Scholarship>[] {
    return scholarships.map((scholarship) => {
      // Clean duplicate names
      if (scholarship.name) {
        scholarship.name = this.cleanName(scholarship.name)
      }

      // Enhance description
      if (scholarship.description && scholarship.description.length < 50) {
        scholarship.description = this.enhanceDescription(scholarship)
      }

      // Normalize country names
      if ((scholarship.eligibility as any)?.countries) {
        (scholarship.eligibility as any).countries = (scholarship.eligibility as any).countries.map(
          (c: string) => this.normalizeCountry(c)
        )
      }

      return scholarship
    })
  }

  /**
   * Clean scholarship name (remove duplicates, trim)
   */
  private cleanName(name: string): string {
    // Remove duplicate text (common issue)
    const words = name.split(' ')
    const seen = new Set<string>()
    const unique: string[] = []

    for (const word of words) {
      const key = word.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(word)
      } else if (unique.length > 0 && unique[unique.length - 1] !== word) {
        // If we see a duplicate but it's not immediately after, might be intentional
        unique.push(word)
      }
    }

    let cleaned = unique.join(' ').trim()
    
    // Remove excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ')
    
    // Remove newlines and extra formatting
    cleaned = cleaned.replace(/\n+/g, ' ').trim()
    
    return cleaned
  }

  /**
   * Enhance description with more context
   */
  private enhanceDescription(scholarship: Partial<Scholarship>): string {
    const parts: string[] = []

    if ((scholarship.eligibility as any)?.countries?.length) {
      parts.push(`Scholarship opportunity in ${(scholarship.eligibility as any).countries.join(', ')}`)
    }

    if (scholarship.duration) {
      parts.push(`Duration: ${scholarship.duration}`)
    }

    if (scholarship.amount) {
      parts.push(`Amount: ${scholarship.amount}`)
    }

    return parts.join('. ') || scholarship.description || 'Scholarship opportunity'
  }

  /**
   * Normalize country names
   */
  private normalizeCountry(country: string): string {
    const normalized: Record<string, string> = {
      'CHINA': 'China',
      'INDIA': 'India',
      'BANGLADESH': 'Bangladesh',
      'CUBA': 'Cuba',
      'MAURITIUS': 'Mauritius',
      'EGYPT': 'Egypt',
      'THAILAND': 'Thailand',
      'JAPAN': 'Japan',
      'BRAZIL': 'Brazil',
      'MEXICO': 'Mexico',
      'OMAN': 'Oman',
      'ALGERIA': 'Algeria',
      'PAKISTAN': 'Pakistan',
      'SWITZERLAND': 'Switzerland',
    }

    return normalized[country.toUpperCase()] || country
  }

  /**
   * Filter scholarships for Kenyan students
   * Removes international-only scholarships
   */
  private filterKenyanScholarships(
    scholarships: Partial<Scholarship>[]
  ): Partial<Scholarship>[] {
    return scholarships.filter((scholarship) => {
      // If it has countries and they're all non-Kenyan, filter out
      if ((scholarship.eligibility as any)?.countries?.length) {
        const countries = (scholarship.eligibility as any).countries.map((c: string) =>
          c.toLowerCase()
        )
        // Keep if it includes Kenya or if it's for all countries
        if (
          countries.includes('kenya') ||
          countries.includes('all') ||
          countries.length === 0
        ) {
          return true
        }
        // Filter out if it's only international countries
        const internationalOnly = countries.every(
          (c: string) =>
            !['kenya', 'all', ''].includes(c) &&
            !c.includes('kenya')
        )
        return !internationalOnly
      }

      // Keep if no country restriction (assumed Kenyan)
      return true
    })
  }

  /**
   * Deduplicate scholarships by name and link
   */
  private deduplicate(
    scholarships: Partial<Scholarship>[]
  ): Partial<Scholarship>[] {
    const seen = new Map<string, Partial<Scholarship>>()

    for (const scholarship of scholarships) {
      const key = this.getDeduplicationKey(scholarship)
      if (!seen.has(key)) {
        seen.set(key, scholarship)
      } else {
        // Merge data if duplicate found
        const existing = seen.get(key)!
        seen.set(key, {
          ...existing,
          ...scholarship,
          // Keep the more complete description
          description:
            (scholarship.description?.length || 0) >
            (existing.description?.length || 0)
              ? scholarship.description
              : existing.description,
        })
      }
    }

    return Array.from(seen.values())
  }

  /**
   * Get deduplication key for a scholarship
   */
  private getDeduplicationKey(scholarship: Partial<Scholarship>): string {
    // Use application link if available (most unique)
    if (scholarship.applicationLink) {
      return scholarship.applicationLink.toLowerCase()
    }

    // Otherwise use normalized name
    const name = scholarship.name?.toLowerCase().trim() || ''
    return name.substring(0, 100) // Limit length
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): Partial<Scholarship>[] | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > this.CACHE_TTL) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  private setCache(key: string, data: Partial<Scholarship>[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      source: 'scraper',
    })
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }
}

// Export singleton
export const optimizedScholarshipScraper = new OptimizedScholarshipScraperService()

