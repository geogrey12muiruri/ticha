# 🌱 Data Seeding Guide

## Quick Start

### Seed the Database

```bash
# Using curl
curl -X POST http://localhost:3000/api/scholarships/seed

# Or using the browser
# Navigate to: http://localhost:3000/api/scholarships/seed
# Then use POST request (or use a tool like Postman)
```

### Check Seed Data Info

```bash
# See what will be seeded (without actually seeding)
curl http://localhost:3000/api/scholarships/seed
```

---

## What Gets Seeded

The seed script includes **20+ diverse opportunities** covering:

### By Type:
- **Scholarships** (3) - Full scholarships from county governments
- **Bursaries** (2) - Financial aid programs
- **Bootcamps** (3) - Tech bootcamps (ALX, Moringa, Andela)
- **Learning** (4) - Free online courses (Coursera, edX, Khan Academy, YALI)
- **Mentorships** (2) - Tech and STEM mentorship programs
- **Internships** (3) - Paid internships (Safaricom, Equity, Microsoft)
- **Grants** (1) - Innovation grants

### By Category:
- **Tech** - Software engineering, web development
- **STEM** - Science, Technology, Engineering, Mathematics
- **Business** - Banking, entrepreneurship
- **Education** - Academic scholarships
- **Arts** - Creative arts and culture
- **Leadership** - Leadership development
- **Innovation** - Innovation and startup grants

### By County:
- **Nairobi** - Multiple opportunities
- **Kiambu** - STEM and bursary programs
- **Mombasa** - Arts scholarships
- **National** - Programs open to all counties

---

## Seed Data Details

### Scholarships
1. **Nairobi County Full Scholarship** - KES 150,000/year, covers tuition, accommodation, books
2. **Kiambu County STEM Scholarship** - KES 120,000/year for STEM students
3. **Mombasa County Arts & Culture Scholarship** - KES 80,000/year for creative arts

### Bursaries
1. **Nairobi County Bursary Fund** - KES 10,000-50,000/year for needy students
2. **Kiambu County Bursary Program** - KES 15,000-40,000/year

### Bootcamps
1. **ALX Software Engineering** - 12-month free bootcamp with job placement
2. **Moringa School Web Development** - 5-month intensive program
3. **Andela Technical Leadership** - 6-month remote program

### Learning Opportunities
1. **Coursera Professional Certificates** - Free courses from Google, Meta, IBM
2. **edX Free Online Courses** - Courses from Harvard, MIT
3. **Khan Academy** - Free educational content
4. **YALI Network** - Leadership courses for young Africans

### Mentorships
1. **Tech Mentorship Program - Nairobi** - 6-month mentorship with software engineers
2. **Women in STEM Mentorship** - 1-year program for female students

### Internships
1. **Safaricom Digital Talent Programme** - KES 50,000-80,000/month
2. **Equity Bank Internship** - KES 30,000-50,000/month
3. **Microsoft Kenya Internship** - Competitive stipend

### Grants
1. **Innovation Grant for Students** - KES 100,000-500,000 for student projects

---

## Features of Seed Data

✅ **Diverse Opportunity Types** - All 7 types covered
✅ **Realistic Data** - Based on actual Kenyan opportunities
✅ **Complete Information** - Eligibility, requirements, documents, deadlines
✅ **Multiple Counties** - Nairobi, Kiambu, Mombasa, National
✅ **Different Academic Levels** - Grade 1-12, post-secondary
✅ **Various Deadlines** - Spread across 30-90 days
✅ **Priority Rankings** - High priority for major opportunities
✅ **Pre-verified** - All seed data marked as verified and active

---

## How It Works

1. **Checks for Existing Data** - Uses scholarship name to check if already exists
2. **Updates Existing** - If found, updates the record
3. **Inserts New** - If not found, creates new record
4. **Marks as Verified** - All seed data is pre-verified
5. **Sets Status to Active** - All opportunities are active

---

## Response Format

### Success Response:
```json
{
  "success": true,
  "total": 20,
  "inserted": 18,
  "updated": 2,
  "skipped": 0,
  "errors": [],
  "message": "Seeded 18 new and updated 2 existing opportunities"
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Stack trace (in development only)"
}
```

---

## Testing After Seeding

### 1. Check Database
```bash
# Get all scholarships
curl http://localhost:3000/api/scholarships

# Filter by type
curl http://localhost:3000/api/scholarships?type=bootcamp

# Filter by county
curl http://localhost:3000/api/scholarships?county=Nairobi
```

### 2. Test Matching
```bash
# Test AI matching with a profile
curl -X POST http://localhost:3000/api/ai/match \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "county": "Nairobi",
      "grade": 12,
      "curriculum": "8-4-4",
      "careerInterest": "Software Engineering"
    }
  }'
```

### 3. Test Dashboard
- Complete your profile
- View matched opportunities
- Test filters and search
- View opportunity details

---

## Customizing Seed Data

Edit `src/data/seed-data.ts` to:
- Add more opportunities
- Modify existing data
- Change eligibility criteria
- Update deadlines
- Adjust priorities

Then run the seed script again - it will update existing records.

---

## Best Practices

1. **Seed Before Testing** - Always seed before testing new features
2. **Re-seed as Needed** - Safe to run multiple times (updates existing)
3. **Check Results** - Verify seed was successful before testing
4. **Customize for Your Needs** - Modify seed data for specific test scenarios

---

## Troubleshooting

### Error: "Table not found"
- Run the database migration first: `supabase/migrations/001_create_scholarships.sql`

### Error: "Permission denied"
- Check RLS policies are set up correctly
- Verify Supabase connection

### No data inserted
- Check console logs for specific errors
- Verify database connection
- Check that table exists

---

## Next Steps

After seeding:
1. ✅ Test the dashboard with real data
2. ✅ Test AI matching with diverse profiles
3. ✅ Test filters and search
4. ✅ Test opportunity detail pages
5. ✅ Verify all opportunity types display correctly

Happy testing! 🎉

