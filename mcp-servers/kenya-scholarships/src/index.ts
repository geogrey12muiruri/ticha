#!/usr/bin/env node

/**
 * MCP Server for Kenya Scholarships
 * Provides tools to fetch live scholarship data from:
 * - Kenya Ministry of Education
 * - NG-CDF Bursaries
 * - County Bursaries
 * - Government Scholarship Portals
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js'
import { KenyaScholarshipScraper } from './scrapers/ministry-of-education.js'
import { NGCDBScraper } from './scrapers/ngcdf.js'
import { CountyBursaryScraper } from './scrapers/county-bursaries.js'

const SERVER_NAME = 'kenya-scholarships'
const SERVER_VERSION = '1.0.0'

class KenyaScholarshipsMCPServer {
  private server: Server
  private scrapers: {
    ministry: KenyaScholarshipScraper
    ngcdf: NGCDBScraper
    county: CountyBursaryScraper
  }

  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    )

    // Initialize scrapers
    this.scrapers = {
      ministry: new KenyaScholarshipScraper(),
      ngcdf: new NGCDBScraper(),
      county: new CountyBursaryScraper(),
    }

    this.setupHandlers()
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'fetch_ministry_scholarships',
          description:
            'Fetch scholarships from Kenya Ministry of Education website (education.go.ke/scholarships). Returns structured scholarship data including name, provider, deadline, eligibility, and application links.',
          inputSchema: {
            type: 'object',
            properties: {
              limit: {
                type: 'number',
                description: 'Maximum number of scholarships to fetch (default: 50)',
                default: 50,
              },
              type: {
                type: 'string',
                description: 'Filter by type: scholarship, bursary, grant',
                enum: ['scholarship', 'bursary', 'grant', 'all'],
                default: 'all',
              },
            },
          },
        },
        {
          name: 'fetch_ngcdf_bursaries',
          description:
            'Fetch NG-CDF (National Government Constituency Development Fund) bursary information. Includes county-specific bursaries and application deadlines.',
          inputSchema: {
            type: 'object',
            properties: {
              county: {
                type: 'string',
                description: 'Filter by county name (e.g., "Nairobi", "Kiambu")',
              },
              constituency: {
                type: 'string',
                description: 'Filter by constituency name',
              },
            },
          },
        },
        {
          name: 'fetch_county_bursaries',
          description:
            'Fetch county-specific bursary programs. Includes information from county government portals.',
          inputSchema: {
            type: 'object',
            properties: {
              county: {
                type: 'string',
                description: 'County name (required)',
              },
            },
            required: ['county'],
          },
        },
        {
          name: 'search_scholarships',
          description:
            'Search across all Kenyan scholarship sources (Ministry, NG-CDF, Counties) with filters.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query (scholarship name, provider, etc.)',
              },
              county: {
                type: 'string',
                description: 'Filter by county',
              },
              type: {
                type: 'string',
                enum: ['scholarship', 'bursary', 'grant', 'loan', 'all'],
                default: 'all',
              },
              minAmount: {
                type: 'number',
                description: 'Minimum scholarship amount in KES',
              },
              deadline: {
                type: 'string',
                description: 'Filter by deadline (e.g., "2025-06-01" or "upcoming")',
              },
            },
          },
        },
        {
          name: 'get_scholarship_details',
          description:
            'Get detailed information about a specific scholarship by name or ID.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Scholarship name',
              },
              source: {
                type: 'string',
                enum: ['ministry', 'ngcdf', 'county', 'all'],
                default: 'all',
              },
            },
            required: ['name'],
          },
        },
      ] as Tool[],
    }))

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          case 'fetch_ministry_scholarships':
            const ministryType = typeof args?.type === 'string' && 
              (args.type === 'scholarship' || args.type === 'bursary' || args.type === 'grant' || args.type === 'all')
              ? args.type as 'scholarship' | 'bursary' | 'grant' | 'all'
              : 'all'
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    await this.scrapers.ministry.fetchScholarships({
                      limit: typeof args?.limit === 'number' ? args.limit : 50,
                      type: ministryType,
                    }),
                    null,
                    2
                  ),
                },
              ],
            }

          case 'fetch_ngcdf_bursaries':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    await this.scrapers.ngcdf.fetchBursaries({
                      county: typeof args?.county === 'string' ? args.county : undefined,
                      constituency: typeof args?.constituency === 'string' ? args.constituency : undefined,
                    }),
                    null,
                    2
                  ),
                },
              ],
            }

          case 'fetch_county_bursaries':
            const county = typeof args?.county === 'string' ? args.county : undefined
            if (!county) {
              throw new Error('County is required')
            }
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    await this.scrapers.county.fetchBursaries(county),
                    null,
                    2
                  ),
                },
              ],
            }

          case 'search_scholarships':
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    await this.searchAllSources(args || {}),
                    null,
                    2
                  ),
                },
              ],
            }

          case 'get_scholarship_details':
            const scholarshipName = typeof args?.name === 'string' ? args.name : ''
            const scholarshipSource = typeof args?.source === 'string' ? args.source : 'all'
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    await this.getScholarshipDetails(scholarshipName, scholarshipSource),
                    null,
                    2
                  ),
                },
              ],
            }

          default:
            throw new Error(`Unknown tool: ${name}`)
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error.message,
                stack: error.stack,
              }),
            },
          ],
          isError: true,
        }
      }
    })
  }

  private async searchAllSources(filters: any) {
    const results: any[] = []

    // Search Ministry scholarships
    try {
      const ministryResults = await this.scrapers.ministry.fetchScholarships({
        limit: 100,
        type: filters.type || 'all',
      })
      results.push(...ministryResults)
    } catch (error) {
      console.error('Error fetching Ministry scholarships:', error)
    }

    // Search NG-CDF if county specified
    if (filters.county) {
      try {
        const ngcdfResults = await this.scrapers.ngcdf.fetchBursaries({
          county: filters.county,
        })
        results.push(...ngcdfResults)
      } catch (error) {
        console.error('Error fetching NG-CDF bursaries:', error)
      }
    }

    // Filter results
    let filtered = results

    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.provider?.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query)
      )
    }

    if (filters.minAmount) {
      filtered = filtered.filter((s) => {
        const amount = this.extractAmount(s.amount)
        return amount >= filters.minAmount
      })
    }

    if (filters.deadline === 'upcoming') {
      filtered = filtered.filter((s) => {
        if (!s.applicationDeadline) return false
        const deadline = new Date(s.applicationDeadline)
        return deadline > new Date()
      })
    }

    return filtered
  }

  private async getScholarshipDetails(name: string, source: string) {
    const sources = source === 'all' ? ['ministry', 'ngcdf', 'county'] : [source]
    const results: any[] = []

    for (const src of sources) {
      try {
        let data: any[] = []
        switch (src) {
          case 'ministry':
            data = await this.scrapers.ministry.fetchScholarships({ limit: 100 })
            break
          case 'ngcdf':
            data = await this.scrapers.ngcdf.fetchBursaries({})
            break
          case 'county':
            // Would need county parameter, skip for now
            break
        }

        const match = data.find(
          (s) => s.name?.toLowerCase().includes(name.toLowerCase())
        )
        if (match) results.push(match)
      } catch (error) {
        console.error(`Error fetching from ${src}:`, error)
      }
    }

    return results.length > 0 ? results[0] : null
  }

  private extractAmount(amountStr?: string): number {
    if (!amountStr) return 0
    const match = amountStr.match(/[\d,]+/)
    if (!match) return 0
    return parseInt(match[0].replace(/,/g, '')) || 0
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('Kenya Scholarships MCP Server running on stdio')
  }
}

// Start server
const server = new KenyaScholarshipsMCPServer()
server.run().catch(console.error)

