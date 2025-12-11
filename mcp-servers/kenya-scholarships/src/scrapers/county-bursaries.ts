/**
 * County Bursary Scraper
 * Scrapes county-specific bursary programs from various county portals
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import type { Scholarship } from '../types'

export class CountyBursaryScraper {
  // Map of county names to their portal URLs
  private readonly COUNTY_PORTALS: Record<string, string> = {
    Nairobi: 'https://www.nairobi.go.ke',
    Kiambu: 'https://www.kiambu.go.ke',
    Nakuru: 'https://www.nakuru.go.ke',
    Mombasa: 'https://www.mombasa.go.ke',
    // Add more counties as needed
  }

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
      const possiblePaths = [
        '/bursaries',
        '/education/bursaries',
        '/scholarships',
        '/education/scholarships',
      ]

      for (const path of possiblePaths) {
        try {
          const url = `${portalUrl}${path}`
          const response = await axios.get(url, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            timeout: 15000,
          })

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
            return bursaries
          }
        } catch (error) {
          // Try next path
          continue
        }
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

