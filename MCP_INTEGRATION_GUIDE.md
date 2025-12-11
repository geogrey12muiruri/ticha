# 🔌 MCP Integration Guide: Kenya Scholarships

## Overview

This guide explains how to integrate the MCP (Model Context Protocol) server for accessing live scholarship data from Kenya's government portals into your Jifunze AI platform.

## What is MCP?

**Model Context Protocol (MCP)** allows AI assistants to:
- Access external data sources (databases, APIs, websites)
- Use tools and services
- Pull real-time information
- Perform actions beyond training data

## Architecture

```
┌─────────────────┐
│   Jifunze AI    │
│   (Next.js)     │
└────────┬────────┘
         │
         │ API Calls
         │
┌────────▼────────┐
│  MCP Server     │
│  (Node.js)      │
└────────┬────────┘
         │
         │ Web Scraping / API Calls
         │
┌────────▼────────────────────────┐
│  Kenya Government Portals        │
│  - Ministry of Education         │
│  - NG-CDF Portal                 │
│  - County Portals                │
└──────────────────────────────────┘
```

## Setup Steps

### 1. Install MCP Server

```bash
cd mcp-servers/kenya-scholarships
npm install
npm run build
```

### 2. Configure Cursor/Claude Desktop

Add to your MCP settings (`~/.cursor/mcp.json` or similar):

```json
{
  "mcpServers": {
    "kenya-scholarships": {
      "command": "node",
      "args": [
        "/absolute/path/to/jifunze-ai/mcp-servers/kenya-scholarships/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

### 3. Create Sync Service

Create a service to sync MCP data to your Supabase database:

```typescript
// src/services/mcp-sync.service.ts
import { KenyaScholarshipScraper } from '../../mcp-servers/kenya-scholarships/src/scrapers/ministry-of-education'
import { ScholarshipAPIService } from './scholarship-api.service'
import { AIDataExtractionService } from './ai-data-extraction.service'

export class MCPSyncService {
  /**
   * Sync scholarships from Ministry of Education
   */
  static async syncMinistryScholarships() {
    const scraper = new KenyaScholarshipScraper()
    const rawScholarships = await scraper.fetchScholarships({ limit: 100 })

    for (const raw of rawScholarships) {
      // Use AI to enhance and extract structured data
      const extracted = await AIDataExtractionService.extractFromText(
        JSON.stringify(raw)
      )

      // Save to Supabase via API
      await fetch('/api/scholarships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...extracted.scholarship,
          source: 'ministry_of_education',
          verified: false, // Requires manual verification
        }),
      })
    }
  }

  /**
   * Sync NG-CDF bursaries
   */
  static async syncNGCDBBursaries(county?: string) {
    // Similar implementation
  }

  /**
   * Sync all sources
   */
  static async syncAll() {
    await this.syncMinistryScholarships()
    // Add other sources
  }
}
```

### 4. Create Sync API Endpoint

```typescript
// src/app/api/scholarships/sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { MCPSyncService } from '@/services/mcp-sync.service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { source } = await request.json()

    switch (source) {
      case 'ministry':
        await MCPSyncService.syncMinistryScholarships()
        break
      case 'ngcdf':
        await MCPSyncService.syncNGCDBBursaries()
        break
      case 'all':
        await MCPSyncService.syncAll()
        break
      default:
        return NextResponse.json(
          { error: 'Invalid source' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### 5. Schedule Automatic Sync

Use Vercel Cron or similar:

```typescript
// src/app/api/cron/sync-scholarships/route.ts
import { NextResponse } from 'next/server'
import { MCPSyncService } from '@/services/mcp-sync.service'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await MCPSyncService.syncAll()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-scholarships",
      "schedule": "0 2 * * *"
    }
  ]
}
```

## Integration Flow

```
1. MCP Server scrapes government portals
   ↓
2. Raw data extracted (HTML → JSON)
   ↓
3. AI extraction service structures data
   ↓
4. Data validated and enhanced
   ↓
5. Saved to Supabase database
   ↓
6. Available in Jifunze AI platform
```

## Using MCP Tools Directly

### In Cursor/Claude Desktop

You can ask the AI:

```
"Fetch the latest scholarships from Kenya Ministry of Education"
"Find NG-CDF bursaries for Nairobi county"
"Search for engineering scholarships with deadline in 2025"
```

The AI will use the MCP tools automatically.

### In Your Code

```typescript
// Direct scraper usage (without MCP protocol)
import { KenyaScholarshipScraper } from '@/mcp-servers/kenya-scholarships/src/scrapers/ministry-of-education'

const scraper = new KenyaScholarshipScraper()
const scholarships = await scraper.fetchScholarships({ limit: 50 })
```

## Data Flow Example

```typescript
// 1. Fetch from MCP/scraper
const rawData = await scraper.fetchScholarships()

// 2. Extract structured data with AI
const extracted = await AIDataExtractionService.extractFromText(
  JSON.stringify(rawData)
)

// 3. Enhance with AI
const enhanced = await AIDataExtractionService.enhanceExtraction(
  extracted.scholarship
)

// 4. Save to database
await ScholarshipAPIService.createScholarship(enhanced)

// 5. Match to students
const matches = await ScholarshipAPIService.matchScholarships(studentProfile)
```

## Benefits

✅ **Live Data**: Always up-to-date scholarship information
✅ **Automated**: No manual data entry needed
✅ **Comprehensive**: Multiple sources in one place
✅ **AI-Enhanced**: Automatic structuring and validation
✅ **Scalable**: Easy to add new sources

## Challenges & Solutions

### Challenge: Website Structure Changes
**Solution**: Use AI extraction to adapt to changes

### Challenge: Rate Limiting
**Solution**: Implement caching and respect rate limits

### Challenge: Data Quality
**Solution**: AI validation and manual verification step

### Challenge: Legal Compliance
**Solution**: Only scrape public data, respect robots.txt

## Next Steps

1. ✅ Set up MCP server
2. ✅ Create sync service
3. ✅ Test with real data
4. ⚠️ Add more data sources
5. ⚠️ Implement caching
6. ⚠️ Add error handling
7. ⚠️ Set up scheduled sync
8. ⚠️ Add monitoring/alerts

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Kenya Ministry of Education](https://www.education.go.ke)
- [NG-CDF Portal](https://ngcdf.go.ke)
- [Web Scraping Best Practices](https://www.scraperapi.com/blog/web-scraping-best-practices/)

## Support

For issues or questions:
1. Check scraper logs
2. Verify website URLs
3. Test selectors manually
4. Review error messages

---

**Note**: Always respect website terms of service and implement proper rate limiting and caching.

