# 🗄️ Database Setup Guide

## Quick Start

### 1. Run Migration in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_create_scholarships.sql`
4. Click **Run** to execute the migration

### 2. Verify Tables

After running the migration, verify:
- `scholarships` table exists
- Indexes are created
- RLS policies are enabled
- Sample data is inserted

### 3. Test API

```bash
# Start your dev server
npm run dev

# Test the API endpoint
curl http://localhost:3000/api/scholarships
```

## Database Schema

### Scholarships Table

```sql
scholarships (
  id UUID PRIMARY KEY
  name VARCHAR(255)
  description TEXT
  provider VARCHAR(255)
  type VARCHAR(50) -- scholarship, bursary, loan, grant, bootcamp, learning
  category VARCHAR(50)
  eligibility JSONB
  amount VARCHAR(255)
  coverage JSONB
  duration VARCHAR(100)
  bootcamp_details JSONB
  learning_details JSONB
  application_deadline TIMESTAMP
  application_link TEXT
  contact_info JSONB
  requirements JSONB
  documents JSONB
  notes TEXT
  priority INTEGER
  verified BOOLEAN
  status VARCHAR(20) -- pending, active, closed, rejected
  created_at TIMESTAMP
  updated_at TIMESTAMP
)
```

## API Endpoints

### GET /api/scholarships

Fetch all active, verified scholarships.

**Query Parameters:**
- `type`: Filter by type (scholarship, bursary, bootcamp, etc.)
- `category`: Filter by category (Tech, Business, etc.)
- `county`: Filter by county
- `search`: Full-text search
- `limit`: Number of results (default: 100)
- `offset`: Pagination offset (default: 0)

**Example:**
```
GET /api/scholarships?type=scholarship&county=Nairobi&limit=10
```

### GET /api/scholarships/[id]

Fetch a single scholarship by ID.

**Example:**
```
GET /api/scholarships/123e4567-e89b-12d3-a456-426614174000
```

### POST /api/scholarships

Create a new scholarship (requires authentication).

**Body:**
```json
{
  "name": "Scholarship Name",
  "description": "Description",
  "provider": "Provider Name",
  "type": "scholarship",
  "eligibility": {
    "counties": ["Nairobi"],
    "minGrade": 1,
    "maxGrade": 12
  },
  ...
}
```

## Migration from Mock Data

The system now uses:
- ✅ **API Service**: `ScholarshipAPIService` (fetches from database)
- ⚠️ **Legacy Service**: `ScholarshipService` (uses mock data, deprecated)

### Update Your Code

**Before:**
```typescript
import { ScholarshipService } from '@/services/scholarship.service'
const matches = ScholarshipService.matchScholarships(profile)
```

**After:**
```typescript
import { ScholarshipAPIService } from '@/services/scholarship-api.service'
const matches = await ScholarshipAPIService.matchScholarships(profile)
```

## Adding Scholarships

### Via Supabase Dashboard

1. Go to **Table Editor** → `scholarships`
2. Click **Insert** → **Insert row**
3. Fill in the required fields
4. Set `verified = true` and `status = 'active'` for it to appear

### Via API (Future)

```typescript
const response = await fetch('/api/scholarships', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Scholarship',
    provider: 'Provider Name',
    type: 'scholarship',
    // ... other fields
  })
})
```

## AI-Powered Data Extraction (Future)

We can add AI to:
1. **Parse scholarship descriptions** → Extract eligibility criteria
2. **Generate structured data** → From unstructured text
3. **Verify information** → Check for inconsistencies
4. **Auto-categorize** → Classify scholarships

See `AI_DATA_EXTRACTION.md` for implementation details.

## Troubleshooting

### No scholarships returned?

1. Check if `verified = true` and `status = 'active'`
2. Verify RLS policies allow reading
3. Check browser console for errors
4. Verify API endpoint is accessible

### Migration errors?

1. Check if table already exists
2. Verify Supabase connection
3. Check SQL syntax
4. Review error messages in Supabase logs

## Next Steps

1. ✅ Run migration
2. ✅ Test API endpoints
3. ✅ Update frontend to use API service
4. ⚠️ Add more scholarships (via admin interface)
5. ⚠️ Implement AI data extraction
6. ⚠️ Add provider dashboard for creating scholarships


