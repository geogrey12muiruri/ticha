/**
 * Test pagination on Ministry website
 * Checks if there are multiple pages of scholarships
 */

import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import https from 'https'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const url = 'https://www.education.go.ke/index.php/scholarships'
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 30000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })

    const $ = cheerio.load(response.data)
    
    // Check for pagination
    const pagination = {
      hasPagination: $('.pagination, .pager, [class*="pagination"], [class*="pager"]').length > 0,
      paginationElements: $('.pagination, .pager, [class*="pagination"], [class*="pager"]').length,
      paginationLinks: $('.pagination a, .pager a, [class*="pagination"] a').length,
      nextLink: $('a[rel="next"], .pagination a:contains("Next"), .pager-next').length,
      pageNumbers: $('.pagination a, .pager a').map((i, el) => {
        const text = $(el).text().trim()
        const num = parseInt(text)
        return isNaN(num) ? null : { text, number: num, href: $(el).attr('href') }
      }).get().filter(Boolean),
    }

    // Count scholarships on page
    const scholarshipCount = {
      tableRows: $('table tbody tr').length,
      allRows: $('table tr').length,
      links: $('table a[href*=".pdf"]').length,
    }

    // Check for "View More" or "Load More" buttons
    const loadMore = {
      hasViewMore: $('a:contains("View More"), button:contains("Load More"), a:contains("More")').length,
      hasShowAll: $('a:contains("Show All"), a:contains("See All")').length,
    }

    // Test page 2
    let page2Exists = false
    let page2Count = 0
    try {
      const page2Url = `${url}?page=2`
      const page2Response = await axios.get(page2Url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        validateStatus: () => true, // Don't throw on 404
      })
      
      if (page2Response.status === 200) {
        const $page2 = cheerio.load(page2Response.data)
        page2Exists = true
        page2Count = $page2('table tbody tr').length
      }
    } catch (error) {
      // Page 2 doesn't exist or error
    }

    return NextResponse.json({
      success: true,
      url,
      pagination,
      scholarshipCount,
      loadMore,
      page2: {
        exists: page2Exists,
        count: page2Count,
      },
      recommendation: page2Exists 
        ? 'Pagination exists - use ?page=2, ?page=3, etc.'
        : page2Count === 0 && scholarshipCount.tableRows > 0
        ? 'All scholarships on one page'
        : 'Check website structure - may need different approach',
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Test failed',
      message: error.message,
    }, { status: 500 })
  }
}

