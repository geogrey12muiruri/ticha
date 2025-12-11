/**
 * Kenya Scholarship Scraper Service
 * Direct integration for Next.js app (not MCP protocol)
 * Fetches live scholarship data from Kenya government portals
 */

// Import scrapers from src/lib (Next.js can compile these)
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
}

export class KenyaScholarshipScraperService {
  private ministryScraper: KenyaScholarshipScraper
  private ngcdfScraper: NGCDBScraper
  private countyScraper: CountyBursaryScraper

  constructor() {
    this.ministryScraper = new KenyaScholarshipScraper()
    this.ngcdfScraper = new NGCDBScraper()
    this.countyScraper = new CountyBursaryScraper()
  }

  /**
   * Fetch scholarships from Ministry of Education
   */
  async fetchMinistryScholarships(
    options: ScrapeOptions = {}
  ): Promise<Partial<Scholarship>[]> {
    try {
      console.log('Fetching Ministry scholarships with options:', options)
      
      // Add timeout wrapper to prevent hanging
      const timeoutPromise = new Promise<Partial<Scholarship>[]>((_, reject) => 
        setTimeout(() => reject(new Error('Ministry scraper timeout')), 12000) // 12s max
      )
      
      const scrapePromise = this.ministryScraper.fetchScholarships({
        limit: options.limit || 30, // Reduced default limit
        type: options.type || 'all',
      })

      const rawScholarships = await Promise.race([scrapePromise, timeoutPromise])

      console.log(`Raw scholarships fetched: ${rawScholarships.length}`)

      if (rawScholarships.length === 0) {
        console.warn('No scholarships found. Website structure may have changed.')
        // Don't return sample data - return empty array to allow fallback
        return []
      }

      // Enhance with AI extraction for better structure (skip for now to avoid API costs)
      // Can enable later if needed
      const enhanced: Partial<Scholarship>[] = rawScholarships.map((raw) => ({
        ...raw,
        source: 'ministry_of_education',
      }))

      // Optionally enhance with AI (commented out to avoid API calls during testing)
      /*
      for (const raw of rawScholarships) {
        try {
          const extracted = await AIDataExtractionService.extractFromText(
            JSON.stringify(raw)
          )
          enhanced.push({
            ...raw,
            ...extracted.scholarship,
            source: 'ministry_of_education',
          })
        } catch (error) {
          // If AI extraction fails, use raw data
          enhanced.push({
            ...raw,
            source: 'ministry_of_education',
          })
        }
      }
      */

      return enhanced
    } catch (error: any) {
      console.error('Error fetching Ministry scholarships:', error.message || error)
      // Return empty array on error to allow fallback to database
      return []
    }
  }

  /**
   * Get sample scholarships for testing when scraper fails
   */
  private getSampleScholarships(): Partial<Scholarship>[] {
    return [
      {
        name: 'Equity Wings to Fly',
        provider: 'Equity Bank Foundation',
        type: 'scholarship',
        description: 'Comprehensive scholarship program for bright students from needy backgrounds',
        amount: 'KES 50,000 - Full tuition',
        eligibility: {
          counties: ['All'],
          minKCPE: 350,
        },
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        applicationLink: 'https://equitybank.co.ke/wings-to-fly',
        contactInfo: {
          source: 'Equity Bank Foundation',
          website: 'https://equitybank.co.ke',
        },
      },
      {
        name: 'NG-CDF Bursary',
        provider: 'NG-CDF',
        type: 'bursary',
        description: 'Constituency Development Fund bursary for needy students',
        eligibility: {
          counties: ['All'],
        },
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        contactInfo: {
          source: 'NG-CDF',
        },
      },
    ]
  }

  /**
   * Fetch NG-CDF bursaries
   */
  async fetchNGCDBBursaries(
    options: { county?: string; constituency?: string } = {}
  ): Promise<Partial<Scholarship>[]> {
    try {
      const rawBursaries = await this.ngcdfScraper.fetchBursaries({
        county: options.county,
        constituency: options.constituency,
      })

      // Enhance with AI
      const enhanced: Partial<Scholarship>[] = []
      for (const raw of rawBursaries) {
        try {
          const extracted = await AIDataExtractionService.extractFromText(
            JSON.stringify(raw)
          )
          enhanced.push({
            ...raw,
            ...extracted.scholarship,
            source: 'ngcdf',
          })
        } catch (error) {
          enhanced.push(raw)
        }
      }

      return enhanced
    } catch (error) {
      console.error('Error fetching NG-CDF bursaries:', error)
      return []
    }
  }

  /**
   * Fetch county bursaries
   */
  async fetchCountyBursaries(county: string): Promise<Partial<Scholarship>[]> {
    try {
      const rawBursaries = await this.countyScraper.fetchBursaries(county)

      // Enhance with AI
      const enhanced: Partial<Scholarship>[] = []
      for (const raw of rawBursaries) {
        try {
          const extracted = await AIDataExtractionService.extractFromText(
            JSON.stringify(raw)
          )
          enhanced.push({
            ...raw,
            ...extracted.scholarship,
            source: `county_${county.toLowerCase()}`,
          })
        } catch (error) {
          enhanced.push(raw)
        }
      }

      return enhanced
    } catch (error) {
      console.error(`Error fetching ${county} county bursaries:`, error)
      return []
    }
  }

  /**
   * Search across all sources
   */
  async searchAllSources(options: {
    query?: string
    county?: string
    type?: string
    minAmount?: number
    deadline?: string
    limit?: number
  }): Promise<Partial<Scholarship>[]> {
    const results: Partial<Scholarship>[] = []

    // Fetch from all sources with Promise.allSettled to handle failures gracefully
    // This ensures one failure doesn't break everything
    const [ministryResult, ngcdfResult, countyResult] = await Promise.allSettled([
      this.fetchMinistryScholarships({
        limit: options.limit || 50, // Reduced default limit
        type: options.type as any,
      }).catch(err => {
        console.warn('Ministry scraper failed:', err.message)
        return []
      }),
      options.county
        ? this.fetchNGCDBBursaries({ county: options.county }).catch(err => {
            console.warn('NG-CDF scraper failed:', err.message)
            return []
          })
        : Promise.resolve([]),
      options.county
        ? this.fetchCountyBursaries(options.county).catch(err => {
            console.warn('County scraper failed:', err.message)
            return []
          })
        : Promise.resolve([]),
    ])

    // Extract results from settled promises
    const ministry = ministryResult.status === 'fulfilled' ? ministryResult.value : []
    const ngcdf = ngcdfResult.status === 'fulfilled' ? ngcdfResult.value : []
    const county = countyResult.status === 'fulfilled' ? countyResult.value : []

    results.push(...ministry, ...ngcdf, ...county)
    
    // Log results with status indicators
    const total = ministry.length + ngcdf.length + county.length
    if (total > 0) {
      console.log(`✅ Scraped ${ministry.length} from Ministry, ${ngcdf.length} from NG-CDF, ${county.length} from County (Total: ${total})`)
    } else {
      console.log(`⚠️ No scholarships scraped - Ministry: ${ministry.length}, NG-CDF: ${ngcdf.length}, County: ${county.length}`)
    }

    // Apply filters
    let filtered = results

    if (options.query) {
      const query = options.query.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.provider?.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query)
      )
    }

    if (options.minAmount) {
      filtered = filtered.filter((s) => {
        const amount = this.extractAmount(s.amount)
        return amount >= options.minAmount!
      })
    }

    if (options.deadline === 'upcoming') {
      filtered = filtered.filter((s) => {
        if (!s.applicationDeadline) return false
        const deadline = new Date(s.applicationDeadline)
        return deadline > new Date()
      })
    }

    return filtered
  }

  /**
   * Sync all sources and save to database
   */
  async syncToDatabase(): Promise<{
    ministry: number
    ngcdf: number
    county: number
    total: number
  }> {
    const stats = {
      ministry: 0,
      ngcdf: 0,
      county: 0,
      total: 0,
    }

    try {
      // Fetch from all sources
      const [ministryScholarships, ngcdfBursaries] = await Promise.all([
        this.fetchMinistryScholarships({ limit: 100 }),
        this.fetchNGCDBBursaries({}),
      ])

      // Save to database via API
      for (const scholarship of ministryScholarships) {
        try {
          await fetch('/api/scholarships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...scholarship,
              verified: false, // Requires manual verification
              status: 'pending',
            }),
          })
          stats.ministry++
        } catch (error) {
          console.error('Error saving Ministry scholarship:', error)
        }
      }

      for (const bursary of ngcdfBursaries) {
        try {
          await fetch('/api/scholarships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...bursary,
              verified: false,
              status: 'pending',
            }),
          })
          stats.ngcdf++
        } catch (error) {
          console.error('Error saving NG-CDF bursary:', error)
        }
      }

      stats.total = stats.ministry + stats.ngcdf + stats.county
    } catch (error) {
      console.error('Error syncing to database:', error)
    }

    return stats
  }

  private extractAmount(amountStr?: string): number {
    if (!amountStr) return 0
    const match = amountStr.match(/[\d,]+/)
    if (!match) return 0
    return parseInt(match[0].replace(/,/g, '')) || 0
  }
}

// Export singleton instance
export const kenyaScholarshipScraper = new KenyaScholarshipScraperService()

