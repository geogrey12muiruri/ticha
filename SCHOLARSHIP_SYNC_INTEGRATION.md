# 🔄 Scholarship Sync Integration Guide

## Overview

The Kenya Scholarship Scraper Service is now integrated directly into your Next.js application. You can fetch live scholarship data from Kenya's government portals and sync it to your Supabase database.

## Quick Start

### 1. Use the Service Directly

```typescript
import { kenyaScholarshipScraper } from '@/services/kenya-scholarship-scraper.service'

// Fetch from Ministry of Education
const scholarships = await kenyaScholarshipScraper.fetchMinistryScholarships({
  limit: 50,
  type: 'all'
})

// Fetch NG-CDF bursaries
const bursaries = await kenyaScholarshipScraper.fetchNGCDBBursaries({
  county: 'Nairobi'
})

// Fetch county bursaries
const countyBursaries = await kenyaScholarshipScraper.fetchCountyBursaries('Kiambu')

// Search across all sources
const results = await kenyaScholarshipScraper.searchAllSources({
  query: 'engineering',
  county: 'Nairobi',
  type: 'scholarship'
})

// Sync all to database
const stats = await kenyaScholarshipScraper.syncToDatabase()
```

### 2. Use the API Endpoints

#### Search Scholarships (GET)
```bash
GET /api/scholarships/sync?query=engineering&county=Nairobi&type=scholarship
```

#### Sync to Database (POST)
```bash
POST /api/scholarships/sync
Content-Type: application/json

{
  "source": "ministry" | "ngcdf" | "county" | "all",
  "county": "Nairobi",  // Required for county source
  "constituency": "Westlands"  // Optional for NG-CDF
}
```

## API Examples

### Fetch Ministry Scholarships
```typescript
const response = await fetch('/api/scholarships/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    source: 'ministry'
  })
})

const data = await response.json()
console.log(`Found ${data.count} scholarships`)
```

### Sync All Sources to Database
```typescript
const response = await fetch('/api/scholarships/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    source: 'all'
  })
})

const data = await response.json()
console.log(`Synced ${data.stats.total} scholarships`)
```

### Search Without Saving
```typescript
const response = await fetch('/api/scholarships/sync?query=engineering&county=Nairobi')
const data = await response.json()
console.log(`Found ${data.count} matching scholarships`)
```

## Integration Points

### 1. Admin Dashboard (Future)
Add a sync button for admins to manually trigger syncs:

```typescript
// In admin dashboard component
const handleSync = async () => {
  setLoading(true)
  try {
    const response = await fetch('/api/scholarships/sync', {
      method: 'POST',
      body: JSON.stringify({ source: 'all' })
    })
    const data = await response.json()
    toast.success(`Synced ${data.stats.total} scholarships`)
  } catch (error) {
    toast.error('Sync failed')
  } finally {
    setLoading(false)
  }
}
```

### 2. Scheduled Sync (Vercel Cron)
Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/scholarships/sync",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Create cron endpoint:

```typescript
// src/app/api/cron/sync-scholarships/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { kenyaScholarshipScraper } from '@/services/kenya-scholarship-scraper.service'

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const stats = await kenyaScholarshipScraper.syncToDatabase()
  return NextResponse.json({ success: true, stats })
}
```

### 3. Background Job (Alternative)
Use a background job service like:
- Vercel Cron (recommended)
- GitHub Actions
- External cron service

## Data Flow

```
1. Scraper fetches from government portals
   ↓
2. Raw HTML parsed to structured data
   ↓
3. AI extraction service enhances data
   ↓
4. Data validated and cleaned
   ↓
5. Saved to Supabase (if syncToDatabase called)
   ↓
6. Available in your application
```

## Features

✅ **Multiple Sources**: Ministry, NG-CDF, County portals
✅ **AI Enhancement**: Automatic data structuring
✅ **Search & Filter**: Query across all sources
✅ **Database Sync**: Save to Supabase automatically
✅ **Error Handling**: Graceful fallbacks
✅ **Type Safe**: Full TypeScript support

## Error Handling

The service handles errors gracefully:
- Returns empty array on scrape failures
- Continues with other sources if one fails
- Logs errors for debugging
- Doesn't crash the application

## Rate Limiting

⚠️ **Important**: 
- Don't call sync too frequently
- Respect website rate limits
- Use caching (already implemented in API service)
- Consider scheduled syncs instead of manual

## Testing

```bash
# Test API endpoint
curl http://localhost:3000/api/scholarships/sync?query=engineering

# Test sync
curl -X POST http://localhost:3000/api/scholarships/sync \
  -H "Content-Type: application/json" \
  -d '{"source": "ministry"}'
```

## Next Steps

1. ✅ Service integrated
2. ✅ API endpoints created
3. ⚠️ Add sync button to admin dashboard
4. ⚠️ Set up scheduled syncs
5. ⚠️ Add monitoring/alerting
6. ⚠️ Test with real data

## Troubleshooting

### No data returned?
- Check if websites are accessible
- Verify HTML structure hasn't changed
- Check browser console for errors
- Review scraper logs

### Sync fails?
- Check Supabase connection
- Verify database table exists
- Check API endpoint logs
- Ensure proper authentication

### Type errors?
- Run `npm run build` in mcp-servers/kenya-scholarships
- Check TypeScript version compatibility
- Verify import paths

## Support

For issues:
1. Check scraper logs
2. Verify website URLs
3. Test selectors manually
4. Review error messages

