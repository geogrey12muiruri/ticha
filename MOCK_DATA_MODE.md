# 📦 Mock Data Mode - Prototyping Without Database

## Quick Start

### Enable Mock Data Mode

Add this to your `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
```

Then restart your dev server:

```bash
npm run dev
```

That's it! The app will now use mock data instead of the database.

---

## What You Get

### 18+ Opportunities (All Types)

- ✅ **3 Scholarships** - County government scholarships
- ✅ **2 Bursaries** - Financial aid programs  
- ✅ **3 Bootcamps** - ALX, Moringa, Andela
- ✅ **4 Learning** - Coursera, edX, Khan Academy, YALI
- ✅ **2 Mentorships** - Tech and STEM mentorship
- ✅ **3 Internships** - Safaricom, Equity, Microsoft
- ✅ **1 Grant** - Innovation grant

### Features

- ✅ **All opportunity types** covered
- ✅ **Multiple counties** (Nairobi, Kiambu, Mombasa, National)
- ✅ **Complete data** - eligibility, requirements, documents, deadlines
- ✅ **Realistic data** - based on actual Kenyan opportunities
- ✅ **No database needed** - works offline

---

## How It Works

### Automatic Fallback

The system automatically falls back to mock data when:
1. `NEXT_PUBLIC_USE_MOCK_DATA=true` is set
2. Database is unavailable
3. API returns empty results
4. Network errors occur

### No Code Changes Needed

The `ScholarshipAPIService` automatically handles fallback:

```typescript
// This works with both database and mock data
const matches = await ScholarshipAPIService.matchScholarships(profile)
```

---

## Testing

### 1. Test Dashboard

1. Complete your profile
2. View matched opportunities
3. All 18+ opportunities should be available

### 2. Test Filters

- Filter by type (scholarship, bootcamp, etc.)
- Filter by county (Nairobi, Kiambu, etc.)
- Filter by category (Tech, STEM, etc.)

### 3. Test Matching

- Complete profile with different counties
- See how matches change
- Test different academic levels

### 4. Test Detail Pages

- Click "View Details" on any opportunity
- See full information
- Check application links

---

## Switching Between Modes

### Use Mock Data (Prototyping)

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Use Database (Production)

```bash
# .env.local
# Remove or set to false
NEXT_PUBLIC_USE_MOCK_DATA=false
# Or just remove the line
```

---

## Mock Data Source

Mock data is generated from `src/data/seed-data.ts` - the same data used for database seeding.

This means:
- ✅ Same data structure as database
- ✅ Easy to sync when ready
- ✅ Comprehensive coverage

---

## Benefits

### For Prototyping

- ✅ **No database setup** - Start immediately
- ✅ **No migrations** - No SQL to run
- ✅ **Fast iteration** - No database delays
- ✅ **Offline development** - Works without internet
- ✅ **Consistent data** - Same data every time

### For Testing

- ✅ **Predictable results** - Same matches every time
- ✅ **Easy to test** - No database state to manage
- ✅ **Quick reset** - Just refresh the page
- ✅ **Isolated testing** - No database dependencies

---

## When to Use

### Use Mock Data When:

- ✅ Prototyping new features
- ✅ Testing UI/UX
- ✅ Demonstrating to stakeholders
- ✅ Developing offline
- ✅ Database is unavailable
- ✅ Quick iteration needed

### Use Database When:

- ✅ Production deployment
- ✅ Need persistent data
- ✅ User-generated content
- ✅ Real-time updates
- ✅ Multi-user scenarios

---

## Troubleshooting

### Mock data not showing?

1. **Check environment variable:**
   ```bash
   # Should be in .env.local
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```

2. **Restart dev server** after adding the variable

3. **Check console logs** - should see "Using mock data mode"

### Want to see database data?

1. Remove `NEXT_PUBLIC_USE_MOCK_DATA` from `.env.local`
2. Restart dev server
3. Make sure database is set up

---

## Summary

**Mock Data Mode = Fast Prototyping Without Database**

- ✅ Add one environment variable
- ✅ Get 18+ opportunities immediately
- ✅ All features work
- ✅ No database needed
- ✅ Easy to switch back

Perfect for prototyping! 🚀

