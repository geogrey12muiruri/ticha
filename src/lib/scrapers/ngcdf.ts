/**
 * NG-CDF (National Government Constituency Development Fund) Bursary Scraper
 * Scrapes NG-CDF bursary information
 * 
 * NOTE: NG-CDF bursaries are typically managed at constituency level
 * and may not have a centralized online portal. Most constituencies
 * handle applications through local offices.
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
  // NG-CDF doesn't have a reliable centralized portal
  // Try common patterns, but expect most to fail
  private readonly POSSIBLE_BASE_URLS = [
    'https://ngcdf.go.ke',
    'https://www.ngcdf.go.ke',
    'https://ngcdf.parliament.go.ke',
  ]

  /**
   * Fetch NG-CDF bursaries
   * Note: NG-CDF bursaries are typically managed at constituency level
   * and may not have a centralized portal. This is a template implementation.
   */
  async fetchBursaries(
    options: NGCDBOptions = {}
  ): Promise<Partial<Scholarship>[]> {
    // NG-CDF doesn't have a reliable centralized portal
    // Return empty array and log that manual data entry is needed
    console.warn('⚠️ NG-CDF bursaries are typically managed at constituency level and do not have a centralized online portal. Manual data entry recommended.')
    
    // Try to find any NG-CDF information, but don't fail if not found
    let lastError: any = null
    
    for (const baseUrl of this.POSSIBLE_BASE_URLS) {
      try {
        const url = options.county
          ? `${baseUrl}/bursaries/${options.county.toLowerCase()}`
          : `${baseUrl}/bursaries`

        console.log(`Trying NG-CDF URL: ${url}`)
        
        const response = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 8000, // Reduced timeout for faster failure
          validateStatus: (status) => status < 500, // Accept 403, 404, etc.
          httpsAgent: new https.Agent({
            rejectUnauthorized: false, // Allow self-signed certificates
          }),
        })

        if (response.status === 200) {
          console.log(`✅ Found working NG-CDF URL: ${url}`)
          
          const $ = cheerio.load(response.data)
          const bursaries: Partial<Scholarship>[] = []
          
          // Try to parse bursary data (adjust selectors based on actual HTML)
          $('table tbody tr, .bursary-item, .scholarship-card').each((index, element) => {
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
                website: baseUrl,
              },
            }

            bursaries.push(bursary)
          })
          
          if (bursaries.length > 0) {
            return bursaries
          }
        } else if (response.status === 403) {
          console.warn(`⚠️ NG-CDF URL blocked (403): ${url}`)
        } else if (response.status === 404) {
          console.warn(`⚠️ NG-CDF URL not found (404): ${url}`)
        }
      } catch (error: any) {
        lastError = error
        if (error.response?.status === 403) {
          console.warn(`⚠️ NG-CDF URL blocked (403): ${baseUrl}`)
        } else if (error.response?.status === 404) {
          console.warn(`⚠️ NG-CDF URL not found (404): ${baseUrl}`)
        } else {
          console.warn(`❌ NG-CDF URL failed: ${baseUrl} - ${error.message}`)
        }
        continue
      }
    }

    // If all URLs failed, return empty array (don't throw)
    console.warn('⚠️ All NG-CDF URLs failed. NG-CDF bursaries are typically managed locally at constituency offices.')
    return []
  }

  /**
   * Alternative: Fetch from a specific NG-CDF constituency portal
   * Note: Each constituency may have its own website or contact method
   */
  async fetchBursariesFromConstituency(
    constituency: string,
    county: string
  ): Promise<Partial<Scholarship>[]> {
    // NG-CDF bursaries are managed at constituency level
    // Most constituencies don't have online portals
    // This would require manual data entry or constituency-specific integration
    console.warn(`⚠️ NG-CDF bursaries for ${constituency}, ${county} are typically managed locally. Contact the constituency office directly.`)
    return []
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
