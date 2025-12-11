# 🏗️ Architecture: MCP Servers & Next.js Integration

## Overview

The system uses **two different approaches** for accessing scholarship data:

1. **MCP Protocol Server** (`mcp-servers/kenya-scholarships/`) - For AI assistants (Cursor/Claude Desktop)
2. **Direct Scraper Integration** (`src/lib/scrapers/`) - For Next.js application

Both use the **same scraper code** but in different contexts.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Jifunze AI Platform                      │
│                      (Next.js App)                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────────┐
│  Next.js API     │                  │  MCP Server          │
│  Routes          │                  │  (Standalone)        │
│                  │                  │                      │
│  /api/scholarships│                  │  For Cursor/Claude  │
│  /api/scholarships│                  │  Desktop AI         │
│  /sync            │                  │                      │
└────────┬─────────┘                  └──────────┬──────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Shared Scraper Code                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │  src/lib/scrapers/                                 │    │
│  │  - ministry-of-education.ts                        │    │
│  │  - ngcdf.ts                                        │    │
│  │  - county-bursaries.ts                             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  mcp-servers/kenya-scholarships/src/scrapers/      │    │
│  │  (Same scrapers, different location)               │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         Kenya Government Portals                           │
│  - Ministry of Education (education.go.ke)                  │
│  - NG-CDF Portal                                            │
│  - County Portals                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Two Integration Paths

### Path 1: Next.js Direct Integration (Current Implementation)

**How it works:**

1. **Scrapers in `src/lib/scrapers/`**
   - These are TypeScript files that Next.js can compile directly
   - Located at: `src/lib/scrapers/ministry-of-education.ts`
   - Uses `axios` and `cheerio` for web scraping

2. **Service Layer** (`src/services/`)
   - `kenya-scholarship-scraper.service.ts` - Wraps scrapers
   - `optimized-scholarship-scraper.service.ts` - Optimized version with caching
   - Uses scrapers directly: `import { KenyaScholarshipScraper } from '@/lib/scrapers/ministry-of-education'`

3. **API Routes** (`src/app/api/scholarships/sync/route.ts`)
   - Exposes scrapers via HTTP endpoints
   - Can be called from frontend or external services
   - Example: `GET /api/scholarships/sync?source=ministry&limit=50`

4. **Data Flow:**
   ```
   Frontend → API Route → Service → Scraper → Government Portal
                ↓
         Supabase Database
   ```

**Code Example:**
```typescript
// src/app/api/scholarships/sync/route.ts
import { optimizedScholarshipScraper } from '@/services/optimized-scholarship-scraper.service'

export async function GET(request: NextRequest) {
  const results = await optimizedScholarshipScraper.fetchMinistryScholarships({
    limit: 50,
    kenyanOnly: true
  })
  return NextResponse.json({ scholarships: results })
}
```

---

### Path 2: MCP Protocol Server (For AI Assistants)

**How it works:**

1. **MCP Server** (`mcp-servers/kenya-scholarships/`)
   - Standalone Node.js server that implements MCP protocol
   - Uses same scrapers but from `mcp-servers/kenya-scholarships/src/scrapers/`
   - Exposes tools via MCP protocol (not HTTP)

2. **MCP Protocol**
   - Model Context Protocol - allows AI assistants to use external tools
   - Configured in Cursor/Claude Desktop settings
   - AI can call tools like: `fetch_ministry_scholarships(limit: 50)`

3. **Data Flow:**
   ```
   Cursor/Claude Desktop → MCP Protocol → MCP Server → Scrapers → Government Portal
   ```

**Configuration:**
```json
// ~/.cursor/mcp.json
{
  "mcpServers": {
    "kenya-scholarships": {
      "command": "node",
      "args": [
        "/path/to/jifunze-ai/mcp-servers/kenya-scholarships/dist/index.js"
      ]
    }
  }
}
```

**Usage in Cursor:**
```
User: "Fetch the latest scholarships from Kenya Ministry of Education"
AI: [Uses MCP tool fetch_ministry_scholarships]
```

---

## Why Two Approaches?

### Next.js Direct Integration
✅ **Pros:**
- Fast, direct access from web app
- No protocol overhead
- Can be called from frontend JavaScript
- Works in production (Vercel, etc.)
- Can be cached and optimized

❌ **Cons:**
- Not accessible to AI assistants
- Requires HTTP requests

### MCP Protocol Server
✅ **Pros:**
- AI assistants can use it directly
- Standard protocol for AI tools
- Can be used by Cursor, Claude Desktop, etc.
- Separates concerns

❌ **Cons:**
- Only works with MCP-compatible AI tools
- Requires separate configuration
- Not directly callable from Next.js (would need HTTP bridge)

---

## Current State

### ✅ What's Working

1. **Next.js Integration** (Primary)
   - Scrapers in `src/lib/scrapers/`
   - Services in `src/services/`
   - API routes in `src/app/api/scholarships/sync/`
   - **This is what the app uses**

2. **MCP Server** (Secondary)
   - Standalone server in `mcp-servers/kenya-scholarships/`
   - Can be configured for Cursor/Claude Desktop
   - Uses same scraper logic

### ⚠️ Current Limitation

The scrapers exist in **two locations**:
- `src/lib/scrapers/` - Used by Next.js
- `mcp-servers/kenya-scholarships/src/scrapers/` - Used by MCP server

**This is intentional** because:
- Next.js needs scrapers in `src/` to compile them
- MCP server needs scrapers in its own directory structure
- They're separate codebases that happen to share logic

---

## Data Flow Examples

### Example 1: User Requests Scholarships in Web App

```
1. User clicks "Find Scholarships" in dashboard
   ↓
2. Frontend calls: GET /api/scholarships/sync?source=ministry
   ↓
3. API route uses: optimizedScholarshipScraper.fetchMinistryScholarships()
   ↓
4. Service calls: KenyaScholarshipScraper from src/lib/scrapers/
   ↓
5. Scraper fetches: https://www.education.go.ke/scholarships
   ↓
6. Returns structured data to API
   ↓
7. API returns JSON to frontend
   ↓
8. Frontend displays scholarships
```

### Example 2: AI Assistant Uses MCP Server

```
1. User asks Cursor: "Fetch latest Kenya scholarships"
   ↓
2. Cursor uses MCP tool: fetch_ministry_scholarships(limit: 50)
   ↓
3. MCP Server receives request via stdio
   ↓
4. Server calls: KenyaScholarshipScraper from mcp-servers/.../scrapers/
   ↓
5. Scraper fetches: https://www.education.go.ke/scholarships
   ↓
6. Returns data via MCP protocol
   ↓
7. Cursor displays results to user
```

---

## Integration Points

### 1. Shared Scraper Logic

Both paths use the same scraping logic:
- Parse HTML with `cheerio`
- Extract scholarship data
- Handle pagination
- Return structured JSON

### 2. Service Layer (Next.js Only)

Next.js has additional services:
- `kenya-scholarship-scraper.service.ts` - Basic wrapper
- `optimized-scholarship-scraper.service.ts` - With caching, deduplication, filtering
- `ai-data-extraction.service.ts` - AI enhancement (optional)

### 3. API Endpoints (Next.js Only)

- `GET /api/scholarships/sync` - Fetch live data
- `POST /api/scholarships/sync` - Sync to database
- `GET /api/scholarships` - Get from database

---

## How They Work Together

### Scenario 1: Web App User

**Uses:** Next.js direct integration
- Frontend → API Route → Service → Scraper
- Fast, optimized, cached
- Returns data immediately

### Scenario 2: AI Assistant (Cursor)

**Uses:** MCP Protocol Server
- Cursor → MCP Server → Scraper
- AI can fetch data on demand
- Results shown in chat

### Scenario 3: Scheduled Sync

**Uses:** Next.js API route
- Cron job → API Route → Service → Scraper → Database
- Runs periodically (e.g., daily)
- Keeps database updated

---

## File Structure

```
jifunze-ai/
├── src/
│   ├── lib/
│   │   └── scrapers/              ← Scrapers for Next.js
│   │       ├── ministry-of-education.ts
│   │       ├── ngcdf.ts
│   │       └── county-bursaries.ts
│   ├── services/
│   │   ├── kenya-scholarship-scraper.service.ts
│   │   └── optimized-scholarship-scraper.service.ts
│   └── app/
│       └── api/
│           └── scholarships/
│               └── sync/
│                   └── route.ts   ← API endpoint
│
└── mcp-servers/
    └── kenya-scholarships/
        ├── src/
        │   ├── scrapers/          ← Scrapers for MCP (duplicate)
        │   │   ├── ministry-of-education.ts
        │   │   ├── ngcdf.ts
        │   │   └── county-bursaries.ts
        │   └── index.ts            ← MCP server entry point
        └── dist/                   ← Compiled MCP server
```

---

## Key Differences

| Aspect | Next.js Integration | MCP Server |
|--------|-------------------|------------|
| **Location** | `src/lib/scrapers/` | `mcp-servers/.../scrapers/` |
| **Protocol** | HTTP (REST API) | MCP (stdio) |
| **Access** | Web app, frontend | AI assistants only |
| **Caching** | ✅ Yes (optimized service) | ❌ No |
| **Deduplication** | ✅ Yes | ❌ No |
| **AI Enhancement** | ✅ Optional | ❌ No |
| **Production** | ✅ Works on Vercel | ⚠️ Requires Node.js runtime |

---

## Best Practices

### 1. Keep Scrapers in Sync

When updating scraper logic:
- Update both locations OR
- Create shared package (future improvement)

### 2. Use Next.js Integration for Web App

For the Jifunze AI platform:
- Use `optimizedScholarshipScraper` service
- Call via `/api/scholarships/sync` endpoint
- Leverage caching and optimization

### 3. Use MCP Server for AI Assistants

For Cursor/Claude Desktop:
- Configure MCP server
- Let AI use tools directly
- No need to call Next.js API

---

## Future Improvements

### Option 1: Shared Package
Create `packages/scrapers/` shared by both:
```typescript
// Both import from same package
import { KenyaScholarshipScraper } from '@jifunze/scrapers'
```

### Option 2: HTTP Bridge for MCP
Make MCP server call Next.js API:
```typescript
// MCP server calls Next.js API instead of scraping directly
const response = await fetch('http://localhost:3000/api/scholarships/sync')
```

### Option 3: Unified Service
Single service that both use:
```typescript
// Both Next.js and MCP use same service
import { ScholarshipService } from '@jifunze/services'
```

---

## Summary

**Current Architecture:**
- ✅ Next.js app uses scrapers directly from `src/lib/scrapers/`
- ✅ MCP server uses scrapers from `mcp-servers/.../scrapers/`
- ✅ Both work independently
- ✅ Same scraping logic, different contexts

**For Your Use Case:**
- **Web app users**: Use Next.js API routes (`/api/scholarships/sync`)
- **AI assistants**: Use MCP server (if configured)
- **Scheduled syncs**: Use Next.js API routes with cron

The two systems are **complementary**, not competing. They serve different purposes but share the same core scraping logic.

