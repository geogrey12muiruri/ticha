# 📡 API Endpoints Explained

## Two Different Endpoints for Different Purposes

### 1. `/api/scholarships` - Database Endpoint
**Purpose**: Reads scholarships from your Supabase database

**Status**: Requires database migration to work

**Usage**:
```bash
GET /api/scholarships
GET /api/scholarships?county=Nairobi&type=scholarship
```

**Response** (when database not set up):
```json
{
  "scholarships": [],
  "count": 0,
  "message": "Database table not set up. Please run migration."
}
```

**When to use**: 
- After running database migration
- When you want to read scholarships you've already saved
- For matching students to saved opportunities

---

### 2. `/api/scholarships/sync` - Live Data Endpoint ⭐
**Purpose**: Fetches LIVE scholarships from Kenya government portals

**Status**: Works immediately, doesn't require database

**Usage**:

#### Fetch from Ministry of Education:
```bash
GET /api/scholarships/sync?source=ministry&limit=50
```

#### Fetch NG-CDF Bursaries:
```bash
GET /api/scholarships/sync?source=ngcdf&county=Nairobi
```

#### Fetch County Bursaries:
```bash
GET /api/scholarships/sync?source=county&county=Kiambu
```

#### Search All Sources:
```bash
GET /api/scholarships/sync?source=all&query=engineering&county=Nairobi
```

**Response**:
```json
{
  "success": true,
  "source": "ministry",
  "count": 15,
  "scholarships": [
    {
      "name": "Equity Wings to Fly",
      "provider": "Equity Bank Foundation",
      "type": "scholarship",
      ...
    }
  ],
  "message": "Live data from Kenya government portals"
}
```

**When to use**:
- ✅ To get live, up-to-date scholarship data
- ✅ When database is not set up yet
- ✅ To sync external data to your database
- ✅ For real-time scholarship searches

---

## Quick Comparison

| Feature | `/api/scholarships` | `/api/scholarships/sync` |
|---------|---------------------|--------------------------|
| **Data Source** | Your Supabase database | Kenya government portals |
| **Requires DB** | ✅ Yes | ❌ No |
| **Live Data** | ❌ No (cached) | ✅ Yes (real-time) |
| **Use Case** | Read saved data | Fetch fresh data |

---

## Recommended Workflow

### Step 1: Fetch Live Data (No DB needed)
```bash
# Get live scholarships from Ministry
curl "http://localhost:3000/api/scholarships/sync?source=ministry&limit=50"
```

### Step 2: Save to Database (Optional)
```bash
# Sync to your database
curl -X POST "http://localhost:3000/api/scholarships/sync" \
  -H "Content-Type: application/json" \
  -d '{"source": "ministry"}'
```

### Step 3: Read from Database (After sync)
```bash
# Read from your database
curl "http://localhost:3000/api/scholarships?county=Nairobi"
```

---

## For Your Use Case

Since you want to fetch live data from government portals:

✅ **Use**: `/api/scholarships/sync?source=ministry`
❌ **Don't use**: `/api/scholarships` (until database is set up)

The sync endpoint works immediately and fetches real-time data from:
- Kenya Ministry of Education
- NG-CDF Portal
- County Government Portals

No database required! 🎉

