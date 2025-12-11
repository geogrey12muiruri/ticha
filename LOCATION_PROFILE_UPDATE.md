# 📍 Location-Based Profile Update

## Overview

The profile wizard now starts with **location selection** and automatically prefills constituencies and subcounties based on the selected county.

---

## Changes Made

### 1. **New Location Data Structure** (`src/constants/locations.ts`)

Created comprehensive location data for **5 prototype counties**:
- ✅ **Nairobi** - 10 constituencies with subcounties
- ✅ **Kiambu** - 10 constituencies with subcounties
- ✅ **Nakuru** - 10 constituencies with subcounties
- ✅ **Mombasa** - 6 constituencies with subcounties
- ✅ **Kisumu** - 7 constituencies with subcounties

**Total:** 43 constituencies with 129+ subcounties

### 2. **Updated Profile Wizard Flow**

**New Step Order (4 steps):**
1. **Location** - County → Constituency → Subcounty (cascading dropdowns)
2. **Basic Information** - First Name, Last Name
3. **Academic Information** - Stage, Class/Level
4. **Career & Interests** - Career Goal, Subjects

**Key Features:**
- ✅ County selection required
- ✅ Constituency dropdown appears after county selection
- ✅ Subcounty dropdown appears after constituency selection
- ✅ Constituency and subcounty are optional
- ✅ Fields reset when parent selection changes

### 3. **Updated Profile Schema**

Added to `PersonalInfo`:
```typescript
{
  county: string        // Required
  constituency?: string // Optional
  subcounty?: string   // Optional
}
```

---

## How It Works

### Step 1: Location Selection

```
1. User selects County (e.g., "Nairobi")
   ↓
2. Constituency dropdown appears with options for that county
   ↓
3. User selects Constituency (e.g., "Westlands")
   ↓
4. Subcounty dropdown appears with options for that constituency
   ↓
5. User selects Subcounty (e.g., "Parklands") [Optional]
```

### Cascading Dropdowns

**County Selection:**
- Shows all 5 prototype counties
- Required field
- Resets constituency and subcounty when changed

**Constituency Selection:**
- Only appears after county is selected
- Shows constituencies for selected county
- Optional field
- Resets subcounty when changed

**Subcounty Selection:**
- Only appears after constituency is selected
- Shows subcounties for selected constituency
- Optional field

---

## Location Data Structure

```typescript
interface County {
  name: string
  constituencies: Constituency[]
}

interface Constituency {
  name: string
  subcounties: Subcounty[]
}

interface Subcounty {
  name: string
  wards?: string[] // For future expansion
}
```

### Example: Nairobi

```typescript
{
  name: 'Nairobi',
  constituencies: [
    {
      name: 'Westlands',
      subcounties: [
        { name: 'Westlands' },
        { name: 'Parklands' },
        { name: 'Kangemi' },
      ]
    },
    {
      name: 'Dagoretti North',
      subcounties: [
        { name: 'Kilimani' },
        { name: 'Kawangware' },
        { name: 'Gatina' },
      ]
    },
    // ... 8 more constituencies
  ]
}
```

---

## Helper Functions

```typescript
// Get constituencies for a county
getConstituenciesForCounty('Nairobi')
// Returns: Array of constituencies

// Get subcounties for a constituency
getSubcountiesForConstituency('Nairobi', 'Westlands')
// Returns: Array of subcounties

// Get all county names
getCountyNames()
// Returns: ['Nairobi', 'Kiambu', 'Nakuru', 'Mombasa', 'Kisumu']
```

---

## User Experience

### Before
- User had to manually type constituency
- No validation or suggestions
- Location was just county

### After
- ✅ Dropdown selection (no typing errors)
- ✅ Auto-populated options
- ✅ Cascading selection (county → constituency → subcounty)
- ✅ Clear visual flow
- ✅ Optional fields clearly marked

---

## Profile Data Saved

When profile is completed, location data is saved:

```json
{
  "personal": {
    "county": "Nairobi",
    "constituency": "Westlands",
    "subcounty": "Parklands",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

This data is:
- ✅ Saved to localStorage
- ✅ Used for scholarship matching
- ✅ Available for location-based filtering

---

## Benefits

1. **Better Matching** - More precise location data enables better scholarship matching
2. **User-Friendly** - Dropdowns prevent typos and errors
3. **Scalable** - Easy to add more counties/constituencies
4. **Prototype-Ready** - 5 counties sufficient for testing
5. **Future-Proof** - Structure supports all 47 counties

---

## Future Enhancements

### Add More Counties
Simply add to `PROTOTYPE_COUNTIES` array:
```typescript
{
  name: 'Uasin Gishu',
  constituencies: [...]
}
```

### Add Wards
Extend `Subcounty` interface:
```typescript
{
  name: 'Westlands',
  wards: ['Ward 1', 'Ward 2', 'Ward 3']
}
```

### Auto-Detect Location
Use browser geolocation API to suggest county:
```typescript
navigator.geolocation.getCurrentPosition((position) => {
  // Suggest county based on coordinates
})
```

---

## Testing

### Test Location Selection

1. **Select County:**
   - Choose "Nairobi"
   - Constituency dropdown should appear

2. **Select Constituency:**
   - Choose "Westlands"
   - Subcounty dropdown should appear

3. **Select Subcounty:**
   - Choose "Parklands"
   - All fields should be populated

4. **Change County:**
   - Change to "Kiambu"
   - Constituency and subcounty should reset
   - New constituency options should appear

### Test Profile Save

1. Complete profile with location
2. Check localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('student_profile'))
   ```
3. Verify location fields are saved correctly

---

## Summary

✅ **Location-first approach** - Profile starts with location
✅ **5 counties** - Nairobi, Kiambu, Nakuru, Mombasa, Kisumu
✅ **Cascading dropdowns** - County → Constituency → Subcounty
✅ **Auto-population** - Options appear based on selection
✅ **Optional fields** - Constituency and subcounty are optional
✅ **Data persistence** - Location saved with profile

The profile wizard now provides a smooth, location-focused experience! 🎯

