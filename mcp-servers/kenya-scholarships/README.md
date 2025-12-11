# Kenya Scholarships MCP Server

MCP Server for accessing live scholarship data from Kenya's Ministry of Education and government portals.

## Features

- ✅ Fetch scholarships from Kenya Ministry of Education (education.go.ke)
- ✅ Fetch NG-CDF (National Government Constituency Development Fund) bursaries
- ✅ Fetch county-specific bursary programs
- ✅ Search across all sources with filters
- ✅ Get detailed scholarship information

## Installation

```bash
cd mcp-servers/kenya-scholarships
npm install
npm run build
```

## Configuration

Add to your Cursor/Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "kenya-scholarships": {
      "command": "node",
      "args": ["/path/to/jifunze-ai/mcp-servers/kenya-scholarships/dist/index.js"]
    }
  }
}
```

## Usage

### In Cursor/Claude Desktop

The AI can now use these tools:

1. **Fetch Ministry Scholarships**
   ```
   fetch_ministry_scholarships(limit: 50, type: "all")
   ```

2. **Fetch NG-CDF Bursaries**
   ```
   fetch_ngcdf_bursaries(county: "Nairobi")
   ```

3. **Fetch County Bursaries**
   ```
   fetch_county_bursaries(county: "Kiambu")
   ```

4. **Search All Sources**
   ```
   search_scholarships(query: "engineering", county: "Nairobi", type: "scholarship")
   ```

5. **Get Scholarship Details**
   ```
   get_scholarship_details(name: "Equity Wings to Fly", source: "all")
   ```

## Integration with Jifunze AI

### Option 1: Direct API Integration

Create an API endpoint that uses the MCP server:

```typescript
// src/app/api/scholarships/sync/route.ts
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
  // Call MCP server to fetch latest scholarships
  const { stdout } = await execAsync(
    'node mcp-servers/kenya-scholarships/dist/index.js fetch_ministry_scholarships'
  )
  
  const scholarships = JSON.parse(stdout)
  
  // Save to Supabase
  // ... save logic
}
```

### Option 2: Scheduled Sync Service

Create a cron job or scheduled function to sync scholarships:

```typescript
// src/services/scholarship-sync.service.ts
export class ScholarshipSyncService {
  static async syncFromMinistry() {
    // Use MCP server or direct scraper
    // Save to database
  }
  
  static async syncFromNGCDB() {
    // Sync NG-CDF bursaries
  }
}
```

## Data Sources

### 1. Kenya Ministry of Education
- **URL**: https://www.education.go.ke/index.php/scholarships
- **Format**: HTML table with downloadable PDFs
- **Update Frequency**: Periodic

### 2. NG-CDF Portal
- **URL**: https://ngcdf.go.ke (verify actual URL)
- **Format**: Varies by constituency
- **Update Frequency**: Annual (typically)

### 3. County Portals
- **Format**: Varies by county
- **Examples**: Nairobi, Kiambu, Nakuru, Mombasa
- **Update Frequency**: Varies

## Ethical Considerations

⚠️ **Important**: 
- Always respect robots.txt
- Don't overload servers with requests
- Cache data appropriately
- Consider reaching out to portals for API access
- Follow terms of service

## Legal Compliance

- ✅ Public data only
- ✅ Respect rate limits
- ✅ Cache data to reduce load
- ✅ Provide attribution to sources

## Future Enhancements

- [ ] Add more county portals
- [ ] Implement caching layer
- [ ] Add rate limiting
- [ ] Support for PDF parsing
- [ ] Email notifications for new scholarships
- [ ] Integration with AI extraction service

## Troubleshooting

### Scraper not working?

1. Check if website structure changed
2. Verify URLs are still valid
3. Check network connectivity
4. Review error logs

### No data returned?

1. Website might be down
2. HTML structure might have changed
3. Rate limiting might be active
4. Check selectors in scraper code

## Contributing

To add a new data source:

1. Create a new scraper in `src/scrapers/`
2. Add tool definition in `src/index.ts`
3. Update README with new source
4. Test thoroughly

