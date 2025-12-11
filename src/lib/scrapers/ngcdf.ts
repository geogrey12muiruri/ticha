/**
 * NG-CDF (National Government Constituency Development Fund) Bursary Scraper
 * Scrapes NG-CDF bursary information
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import https from 'https'
import type { Scholarship } from './types'

interface NGCDBOptions {
  county?: string
  constituency?: string
}

export class NGCDBScraper {
  private readonly BASE_URL = 'https://ngcdf.go.ke' // Adjust to actual NG-CDF portal URL

  /**
   * Fetch NG-CDF bursaries
   */
  async fetchBursaries(
    options: NGCDBOptions = {}
  ): Promise<Partial<Scholarship>[]> {
    try {
      // Note: Actual URL structure may vary
      // This is a template implementation
      const url = options.county
        ? `${this.BASE_URL}/bursaries/${options.county.toLowerCase()}`
        : `${this.BASE_URL}/bursaries`

      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 30000,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Allow self-signed certificates
        }),
      })

      const $ = cheerio.load(response.data)
      const bursaries: Partial<Scholarship>[] = []

      // Parse bursary listings (adjust selector based on actual HTML)
      $('.bursary-item, .scholarship-card, table tbody tr').each(
        (index, element) => {
          const $item = $(element)

          const name = $item.find('.title, h3, td:first-child').text().trim()
          const amount = $item.find('.amount, .value').text().trim()
          const deadline = $item.find('.deadline, .date').text().trim()
          const description = $item.find('.description, p').text().trim()

          if (!name) return // Skip if no name

          const bursary: Partial<Scholarship> = {
            name: name || 'NG-CDF Bursary',
            provider: 'NG-CDF',
            type: 'bursary',
            description: description || 'NG-CDF Constituency Bursary',
            amount: amount || undefined,
            applicationDeadline: this.parseDeadline(deadline),
            eligibility: {
              counties: options.county ? [options.county] : [],
              constituencies: options.constituency
                ? [options.constituency]
                : [],
            },
            contactInfo: {
              source: 'NG-CDF',
              website: this.BASE_URL,
            },
          }

          bursaries.push(bursary)
        }
      )

      return bursaries
    } catch (error: any) {
      console.error('Error scraping NG-CDF bursaries:', error.message)
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

