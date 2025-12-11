/**
 * Test endpoint for debugging scraper
 * Returns detailed information about what the scraper finds
 */

import { NextResponse } from 'next/server'
import { kenyaScholarshipScraper } from '@/services/kenya-scholarship-scraper.service'
import axios from 'axios'
import * as cheerio from 'cheerio'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const url = 'https://www.education.go.ke/index.php/scholarships'

    // Test 1: Can we reach the URL?
    let response
    try {
      response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 30000,
        validateStatus: (status) => status < 500,
      })
    } catch (error: any) {
      return NextResponse.json({
        error: 'Cannot reach website',
        message: error.message,
        url,
        details: error.response?.status,
      })
    }

    // Test 2: Parse HTML structure
    const $ = cheerio.load(response.data)
    const pageInfo = {
      title: $('title').text(),
      hasTables: $('table').length > 0,
      tableCount: $('table').length,
      rowCount: $('table tbody tr').length,
      allRowCount: $('tr').length,
      hasScholarshipClass: $('[class*="scholarship"]').length,
      hasScholarshipText: response.data.toLowerCase().includes('scholarship'),
      sampleStructure: $('body').html()?.substring(0, 500),
    }

    // Test 3: Try to extract data using the service
    const scholarships = await kenyaScholarshipScraper.fetchMinistryScholarships({ limit: 10 })

    // Test 4: Check different selectors
    const selectorTests = {
      'table tbody tr': $('table tbody tr').length,
      'table tr': $('table tr').length,
      '.scholarship-item': $('.scholarship-item').length,
      '[class*="scholarship"]': $('[class*="scholarship"]').length,
      'tbody tr': $('tbody tr').length,
      'div[class*="scholarship"]': $('div[class*="scholarship"]').length,
    }

    // Test 5: Sample first row data
    const firstRow = $('table tbody tr').first()
    const firstRowData = {
      exists: firstRow.length > 0,
      cellCount: firstRow.find('td').length,
      cells: firstRow.find('td').map((i, el) => $(el).text().trim()).get(),
      links: firstRow.find('a').map((i, el) => $(el).attr('href')).get(),
      text: firstRow.text().substring(0, 200),
    }

    // Test 6: Check for common patterns
    const patterns = {
      hasDownloadLinks: $('a[href*=".pdf"]').length,
      hasExternalLinks: $('a[href^="http"]').length,
      hasTableHeaders: $('table th').length,
    }

    return NextResponse.json({
      success: true,
      url,
      status: response.status,
      pageInfo,
      selectorTests,
      firstRowData,
      patterns,
      extractedScholarships: scholarships.length,
      scholarships: scholarships.slice(0, 3), // First 3 for inspection
      debug: {
        htmlLength: response.data.length,
        hasContent: response.data.length > 0,
        contentType: response.headers['content-type'],
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Test failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

