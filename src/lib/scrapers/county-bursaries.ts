/**
 * County Bursary Scraper
 * Scrapes county-specific bursary programs from various county portals
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import https from 'https'
import type { Scholarship } from './types'

export class CountyBursaryScraper {
  // Map of county names to their official portal URLs
  // Verified from devolution.go.ke/county-information
  private readonly COUNTY_PORTALS: Record<string, string> = {
    Nairobi: 'https://www.nairobi.go.ke',
    Kiambu: 'https://www.kiambu.go.ke',
    Nakuru: 'https://www.nakuru.go.ke',
    Mombasa: 'https://www.mombasa.go.ke',
    Kisumu: 'https://www.kisumu.go.ke',
    // Add more as verified
  }

  // Common paths for bursary pages on county websites
  private readonly BURSARY_PATHS = [
    '/bursaries',
    '/education/bursaries',
    '/scholarships',
    '/education/scholarships',
    '/education/bursary',
    '/services/bursaries',
    '/departments/education/bursaries',
  ]

  /**
   * Fetch bursaries for a specific county
   */
  async fetchBursaries(county: string): Promise<Partial<Scholarship>[]> {
    const portalUrl = this.COUNTY_PORTALS[county]
    if (!portalUrl) {
      console.warn(`No portal URL found for county: ${county}`)
      return []
    }

    try {
      // Try common paths for bursary pages
      let workingUrl: string | null = null
      let lastError: any = null

      for (const path of this.BURSARY_PATHS) {
        try {
          const url = `${portalUrl}${path}`
          console.log(`Trying county bursary URL: ${url}`)
          
          const response = await axios.get(url, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            timeout: 8000, // Reduced timeout
            validateStatus: (status) => status < 500, // Accept 403, 404
            httpsAgent: new https.Agent({
              rejectUnauthorized: false, // Allow self-signed certificates
            }),
          })

          if (response.status === 200) {
            workingUrl = url
            console.log(`✅ Found working county bursary URL: ${url}`)
            
            const $ = cheerio.load(response.data)
            const bursaries: Partial<Scholarship>[] = []

            // Parse bursary listings
            $('.bursary, .scholarship, article, .card').each(
              (index, element) => {
                const $item = $(element)

                const name =
                  $item.find('h2, h3, .title, .name').text().trim() ||
                  `${county} County Bursary`
                const description = $item.find('p, .description').text().trim()
                const deadline = $item.find('.deadline, .date').text().trim()
                const amount = $item.find('.amount, .value').text().trim()
                const link = $item.find('a').attr('href') || ''

                const bursary: Partial<Scholarship> = {
                  name,
                  provider: `${county} County Government`,
                  type: 'bursary',
                  description: description || `${county} County Bursary Program`,
                  amount: amount || undefined,
                  applicationDeadline: this.parseDeadline(deadline),
                  applicationLink: link.startsWith('http')
                    ? link
                    : `${portalUrl}${link}`,
                  eligibility: {
                    counties: [county],
                  },
                  contactInfo: {
                    source: `${county} County`,
                    website: portalUrl,
                  },
                }

                bursaries.push(bursary)
              }
            )

            if (bursaries.length > 0) {
              console.log(`✅ Found ${bursaries.length} bursaries from ${url}`)
              return bursaries
            } else {
              console.log(`⚠️ No bursaries found at ${url}, trying next path...`)
            }
          }
        } catch (error: any) {
          lastError = error
          const currentUrl = `${portalUrl}${path}` // Define url in catch block scope
          if (error.response?.status === 403) {
            console.warn(`⚠️ County URL blocked (403): ${currentUrl}`)
          } else if (error.response?.status === 404) {
            console.log(`⚠️ County URL not found (404): ${currentUrl}, trying next path...`)
          } else {
            console.warn(`❌ County URL failed: ${currentUrl} - ${error.message}`)
          }
          // Try next path
          continue
        }
      }

      // If no working URL found
      if (!workingUrl) {
        console.warn(`⚠️ No working bursary URL found for ${county} County. Tried paths: ${this.BURSARY_PATHS.join(', ')}`)
      }

      return []
    } catch (error: any) {
      console.error(
        `Error scraping ${county} county bursaries:`,
        error.message
      )
      return []
    }
  }

  private parseDeadline(deadlineStr: string): string | undefined {
    if (!deadlineStr) return undefined
    const date = new Date(deadlineStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString()
    }
    return undefined
  }
}

