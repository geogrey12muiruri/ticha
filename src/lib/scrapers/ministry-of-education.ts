/**
 * Kenya Ministry of Education Scholarship Scraper
 * Scrapes scholarship data from education.go.ke/scholarships
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import https from 'https'
import type { Scholarship, OpportunityType } from './types'

interface ScrapeOptions {
  limit?: number
  type?: 'scholarship' | 'bursary' | 'grant' | 'all'
}

export class KenyaScholarshipScraper {
  private readonly BASE_URL = 'https://www.education.go.ke'
  // Try multiple possible scholarship page URLs
  private readonly POSSIBLE_SCHOLARSHIP_URLS = [
    `${this.BASE_URL}/index.php/scholarships`, // Current URL
    `${this.BASE_URL}/scholarships`, // Alternative path
    `${this.BASE_URL}/education/scholarships`, // Alternative path
    `${this.BASE_URL}/opportunities/scholarships`, // Alternative path
  ]
  private readonly SCHOLARSHIPS_URL = this.POSSIBLE_SCHOLARSHIP_URLS[0] // Default to first

  /**
   * Fetch scholarships from Ministry of Education website
   * Handles pagination if present
   */
  async fetchScholarships(options: ScrapeOptions = {}): Promise<Partial<Scholarship>[]> {
    // Try each possible URL until one works
    let workingUrl: string | null = null
    let lastError: any = null

    for (const url of this.POSSIBLE_SCHOLARSHIP_URLS) {
      try {
        console.log(`Trying URL: ${url}`)
        const testResponse = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 8000, // Increased from 5s to 8s for slow websites
          validateStatus: (status) => status < 500,
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        })

        if (testResponse.status === 200) {
          workingUrl = url
          console.log(`✅ Found working URL: ${url}`)
          break
        }
      } catch (error: any) {
        lastError = error
        console.log(`❌ URL failed: ${url} - ${error.message}`)
        continue
      }
    }

    if (!workingUrl) {
      console.error('❌ All Ministry scholarship URLs failed. Last error:', lastError?.message)
      throw new Error(`Cannot access Ministry of Education scholarships. Tried: ${this.POSSIBLE_SCHOLARSHIP_URLS.join(', ')}`)
    }

    try {
      console.log(`Fetching scholarships from ${workingUrl}`)
      
      const allScholarships: Partial<Scholarship>[] = []
      let currentPage = 1
      const maxPages = 5 // Reduced from 10 for faster scraping
      let hasMorePages = true

      while (hasMorePages && currentPage <= maxPages) {
        // Check if pagination exists (common patterns: ?page=, /page/, etc.)
        const pageUrl = currentPage === 1 
          ? workingUrl 
          : `${workingUrl}${workingUrl.includes('?') ? '&' : '?'}page=${currentPage}`
        
        console.log(`Fetching page ${currentPage}: ${pageUrl}`)
        
        const response = await axios.get(pageUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          timeout: 10000, // Reduced from 30s to 10s for faster failure
          validateStatus: (status) => status < 500,
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        })

        if (response.status !== 200) {
          console.warn(`Received status ${response.status} from Ministry website on page ${currentPage}`)
          hasMorePages = false
          break
        }

        const $ = cheerio.load(response.data)
        const pageScholarships: Partial<Scholarship>[] = []

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
            if (options.limit && pageScholarships.length >= options.limit) {
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

            // Skip if no name found or if it's a header row
            if (!name || name.length < 3) {
              return
            }
            
            // Skip header rows (common patterns)
            if (name.toUpperCase() === name && name.length < 50 && 
                (name.includes('SCHOLARSHIP') || name.includes('COUNTRY') || name.includes('DEADLINE'))) {
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

            pageScholarships.push(scholarship)
          })

          break // Found data with this selector
        }
      }

        // Check if we found any scholarships on this page
        if (pageScholarships.length === 0) {
          console.log(`No scholarships found on page ${currentPage}, stopping pagination`)
          hasMorePages = false
        } else {
          allScholarships.push(...pageScholarships)
          console.log(`Extracted ${pageScholarships.length} scholarships from page ${currentPage}`)
          
          // Check for pagination - look for "Next" link or pagination elements
          const nextPageLink = $('a[rel="next"], .pagination a:contains("Next"), .pager-next, a:contains("Next")').first()
          const hasNextPage = nextPageLink.length > 0
          const paginationExists = $('.pagination, .pager, [class*="pagination"]').length > 0
          
          // Check if page 2 exists by trying to fetch it (if we're on page 1)
          if (currentPage === 1) {
            // Always try page 2 if page 1 had data (since we know page 2 exists from test)
            currentPage++
          } else if (hasNextPage || paginationExists) {
            // Continue to next page if next link exists or pagination is present
            currentPage++
          } else {
            // No more pages
            hasMorePages = false
          }
          
          // Stop if we've reached the limit
          if (options.limit && allScholarships.length >= options.limit) {
            hasMorePages = false
          }
          
          // Safety: Stop if we got fewer scholarships than expected (might be last page)
          // Page 1 had 15 rows, if we get significantly fewer, might be last page
          if (currentPage > 1 && pageScholarships.length < 5 && allScholarships.length > 0) {
            console.log(`Page ${currentPage} has only ${pageScholarships.length} scholarships, likely last page`)
            hasMorePages = false
          }
        }
      }

      // Apply limit if specified
      const result = options.limit 
        ? allScholarships.slice(0, options.limit)
        : allScholarships

      console.log(`Total extracted: ${result.length} scholarships from ${currentPage - 1} page(s)`)
      return result
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

