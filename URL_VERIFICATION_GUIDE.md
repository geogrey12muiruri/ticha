# 🔗 URL Verification Guide

## Current URLs Being Used

### ✅ Ministry of Education
**Base URL:** `https://www.education.go.ke`

**Scholarship Pages (trying multiple):**
1. `https://www.education.go.ke/index.php/scholarships` (current)
2. `https://www.education.go.ke/scholarships` (alternative)
3. `https://www.education.go.ke/education/scholarships` (alternative)
4. `https://www.education.go.ke/opportunities/scholarships` (alternative)

**Status:** ✅ Verified - Official Ministry website

---

### ⚠️ NG-CDF (National Government Constituency Development Fund)
**Possible URLs (trying multiple):**
1. `https://ngcdf.go.ke`
2. `https://www.ngcdf.go.ke`
3. `https://ngcdf.parliament.go.ke`

**Status:** ⚠️ **No centralized portal** - NG-CDF bursaries are managed at constituency level

**Reality:**
- Most constituencies don't have online portals
- Applications are typically handled through local constituency offices
- Manual data entry or constituency-specific integration needed

**Recommendation:** 
- Focus on other sources (Ministry, County)
- Add NG-CDF data manually or through partnerships

---

### ✅ County Governments
**Verified County URLs:**
- Nairobi: `https://www.nairobi.go.ke`
- Kiambu: `https://www.kiambu.go.ke`
- Nakuru: `https://www.nakuru.go.ke`
- Mombasa: `https://www.mombasa.go.ke`
- Kisumu: `https://www.kisumu.go.ke`

**Bursary Page Paths (trying multiple):**
1. `/bursaries`
2. `/education/bursaries`
3. `/scholarships`
4. `/education/scholarships`
5. `/education/bursary`
6. `/services/bursaries`
7. `/departments/education/bursaries`

**Status:** ✅ Verified - Official county websites

**Source:** [devolution.go.ke/county-information](https://www.devolution.go.ke/county-information/)

---

## 🔍 How to Verify URLs

### Test Ministry URL:
```bash
curl -I "https://www.education.go.ke/index.php/scholarships"
```

### Test County URL:
```bash
curl -I "https://www.nairobi.go.ke/bursaries"
```

### Test NG-CDF URL:
```bash
curl -I "https://ngcdf.go.ke/bursaries"
```

---

## 🛠️ What We've Improved

### 1. **Multiple URL Attempts**
- System now tries multiple possible URLs
- Falls back gracefully if one fails
- Logs which URLs work/fail

### 2. **Better Error Messages**
- Clear indication of which URL failed
- Status codes (403, 404, timeout) are logged
- Helpful warnings for expected failures

### 3. **Faster Failure**
- Reduced timeouts (8-10s instead of 30s)
- Quick test before full scrape
- Don't wait forever

### 4. **Graceful Degradation**
- Returns empty array instead of crashing
- System continues with other sources
- User still gets results

---

## 📊 Expected Behavior

### ✅ **Ministry of Education**
- Should work: `https://www.education.go.ke/index.php/scholarships`
- May timeout if website is slow
- System tries alternative paths if main URL fails

### ⚠️ **NG-CDF**
- **Expected to fail** - No centralized portal
- Returns empty array (not an error)
- System continues with other sources

### ✅ **County Governments**
- Should work for counties with online portals
- May vary by county (some have portals, some don't)
- System tries multiple paths per county

---

## 🎯 Recommendations

### Short Term:
1. **Focus on Ministry** - Most reliable source
2. **Add County data manually** - For counties without portals
3. **Skip NG-CDF scraping** - Use manual data entry

### Long Term:
1. **Build partnerships** - With county governments for API access
2. **Manual data entry** - For reliable, verified data
3. **User submissions** - Allow users to submit scholarship info
4. **API integrations** - If government portals add APIs

---

## 🔧 Testing URLs

### Test Endpoint:
```bash
# Test Ministry scraper
curl "http://localhost:3000/api/scholarships/sync?source=ministry&limit=5"

# Test County scraper
curl "http://localhost:3000/api/scholarships/sync?source=county&county=Nairobi"

# Test all sources
curl "http://localhost:3000/api/scholarships/sync?source=all"
```

### Check Logs:
The system now logs:
- ✅ Which URLs work
- ⚠️ Which URLs are blocked (403)
- ❌ Which URLs fail (404, timeout, etc.)

---

## 📝 Summary

**Working URLs:**
- ✅ Ministry: `https://www.education.go.ke/index.php/scholarships`
- ✅ Counties: Various (nairobi.go.ke, kiambu.go.ke, etc.)

**Not Working:**
- ❌ NG-CDF: No centralized portal (expected)

**System Behavior:**
- ✅ Tries multiple URLs
- ✅ Falls back gracefully
- ✅ Logs helpful errors
- ✅ Continues with available sources

The system is now more resilient and will automatically try alternative URLs if the primary ones fail! 🎉

