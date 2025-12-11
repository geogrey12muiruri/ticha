/**
 * Kenya Ministry of Education Scholarship Scraper
 * Scrapes scholarship data from education.go.ke/scholarships
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import type { Scholarship, OpportunityType } from '../types'

interface ScrapeOptions {
  limit?: number
  type?: 'scholarship' | 'bursary' | 'grant' | 'all'
}

export class KenyaScholarshipScraper {
  private readonly BASE_URL = 'https://www.education.go.ke'
  private readonly SCHOLARSHIPS_URL = `${this.BASE_URL}/index.php/scholarships`

  /**
   * Fetch scholarships from Ministry of Education website
   */
  async fetchScholarships(options: ScrapeOptions = {}): Promise<Partial<Scholarship>[]> {
    try {
      console.log(`Fetching scholarships from ${this.SCHOLARSHIPS_URL}`)
      
      const response = await axios.get(this.SCHOLARSHIPS_URL, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 30000,
        validateStatus: (status) => status < 500, // Don't throw on 404, etc.
      })

      if (response.status !== 200) {
        console.warn(`Received status ${response.status} from Ministry website`)
        return []
      }

      const $ = cheerio.load(response.data)
      const scholarships: Partial<Scholarship>[] = []

      // Try multiple selectors - websites change structure
      const selectors = [
        'table tbody tr',
        'table tr',
        '.scholarship-item',
        '.scholarship',
        '[class*="scholarship"]',
        'tbody tr',
      ]

      let foundRows = false
      for (const selector of selectors) {
        const rows = $(selector)
        if (rows.length > 0) {
          console.log(`Found ${rows.length} rows with selector: ${selector}`)
          foundRows = true

          rows.each((index, element) => {
            if (options.limit && scholarships.length >= options.limit) {
              return false // Break loop
            }

            const $row = $(element)
            const cells = $row.find('td, th')
            const links = $row.find('a')

            // Try to extract data from various structures
            let name = ''
            let type = ''
            let country = ''
            let duration = ''
            let deadline = ''
            let link = ''

            if (cells.length >= 2) {
              // Table structure
              name = $(cells[0]).text().trim() || $row.find('h3, h4, .title, .name').first().text().trim()
              type = $(cells[1]).text().trim().toLowerCase() || ''
              country = cells.length > 2 ? $(cells[2]).text().trim() : ''
              duration = cells.length > 3 ? $(cells[3]).text().trim() : ''
              deadline = cells.length > 4 ? $(cells[4]).text().trim() : ''
            } else {
              // Card/list structure
              name = $row.find('h3, h4, h5, .title, .name, strong').first().text().trim()
              type = $row.find('.type, .category, [class*="type"]').text().trim().toLowerCase() || ''
              country = $row.find('.country, [class*="country"]').text().trim() || ''
              duration = $row.find('.duration, [class*="duration"]').text().trim() || ''
              deadline = $row.find('.deadline, .date, [class*="deadline"]').text().trim() || ''
            }

            // Get link
            if (links.length > 0) {
              link = $(links[0]).attr('href') || ''
            }

            // Skip if no name found
            if (!name || name.length < 3) {
              return
            }

            // Filter by type if specified
            if (
              options.type &&
              options.type !== 'all' &&
              type &&
              !type.includes(options.type)
            ) {
              return
            }

            // Build full link
            const fullLink = link
              ? link.startsWith('http')
                ? link
                : `${this.BASE_URL}${link}`
              : ''

            const scholarship: Partial<Scholarship> = {
              name,
              provider: 'Kenya Ministry of Education',
              type: this.mapType(type),
              description: country
                ? `Scholarship opportunity in ${country}.${duration ? ` Duration: ${duration}` : ''}`
                : `Scholarship opportunity from Kenya Ministry of Education.${duration ? ` Duration: ${duration}` : ''}`,
              duration: duration || undefined,
              applicationDeadline: this.parseDeadline(deadline),
              applicationLink: fullLink || undefined,
              eligibility: {
                countries: country ? [country] : [],
              },
              contactInfo: {
                source: 'Ministry of Education',
                website: this.BASE_URL,
              },
            }

            scholarships.push(scholarship)
          })

          break // Found data with this selector
        }
      }

      if (!foundRows) {
        console.warn('No scholarship rows found. Website structure may have changed.')
        console.log('Page title:', $('title').text())
        console.log('Page has tables:', $('table').length)
        console.log('Sample HTML structure:', $('body').html()?.substring(0, 500))
      }

      console.log(`Extracted ${scholarships.length} scholarships`)
      return scholarships
    } catch (error: any) {
      console.error('Error scraping Ministry scholarships:', error.message)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data?.substring(0, 200))
      }
      // Return empty array on error (graceful degradation)
      return []
    }
  }

  /**
   * Map scraped type to our Scholarship type
   */
  private mapType(type: string): OpportunityType {
    if (type.includes('bursary')) return 'bursary'
    if (type.includes('grant')) return 'grant'
    if (type.includes('loan')) return 'loan'
    return 'scholarship'
  }

  /**
   * Parse deadline string to ISO date
   */
  private parseDeadline(deadlineStr: string): string | undefined {
    if (!deadlineStr) return undefined

    // Try to parse common date formats
    const date = new Date(deadlineStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString()
    }

    return undefined
  }
}

