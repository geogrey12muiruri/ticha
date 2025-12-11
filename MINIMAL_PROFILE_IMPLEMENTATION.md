# 🎯 Minimal Profile Implementation

## Overview

The student profile has been simplified for prototyping with **persistent storage** using localStorage.

---

## Changes Made

### 1. **New Minimal Profile Wizard** (`MinimalProfileWizard.tsx`)

**3 Simple Steps** (down from 8):
1. **Basic Information** - Name, County
2. **Academic Information** - Stage, Current Class/Level
3. **Career & Interests** - Career Goal, Subjects

**Essential Fields Only:**
- ✅ First Name
- ✅ Last Name
- ✅ County
- ✅ Academic Stage
- ✅ Current Class/Level
- ✅ Career Goal
- ✅ Subjects (at least one)

**Removed for Prototyping:**
- ❌ Skills & Certifications
- ❌ Projects & Portfolio
- ❌ Extracurriculars & Awards
- ❌ Access & Readiness
- ❌ Preferences & Filters
- ❌ Verification

---

### 2. **Profile Persistence**

**Storage:** localStorage (browser storage)

**How it works:**
1. When profile is completed → Saved to `localStorage.setItem('student_profile', ...)`
2. On login → Loads from `localStorage.getItem('student_profile')`
3. If profile exists → User goes straight to dashboard
4. If no profile → Shows minimal wizard

**Key Code:**
```typescript
// Save profile
localStorage.setItem('student_profile', JSON.stringify(completedProfile))

// Load profile
const savedProfile = localStorage.getItem('student_profile')
if (savedProfile) {
  const parsedProfile = JSON.parse(savedProfile)
  // Use profile data
}
```

---

### 3. **Updated Dashboard Logic**

**Before:**
- Always showed wizard (hardcoded `hasProfile = false`)
- Profile data lost on page refresh

**After:**
- Checks localStorage on load
- Loads existing profile if found
- Only shows wizard if no profile exists
- Profile persists across sessions

---

## User Flow

### First Time User
```
1. Login → Dashboard
2. No profile found → Minimal Wizard appears
3. Fill 3 steps (2-3 minutes)
4. Profile saved to localStorage
5. Dashboard shows matches
```

### Returning User
```
1. Login → Dashboard
2. Profile found in localStorage
3. Profile loaded automatically
4. Dashboard shows matches immediately
5. No wizard shown
```

---

## Profile Data Structure

**Minimal Profile:**
```typescript
{
  personal: {
    firstName: "John",
    lastName: "Doe",
    county: "Nairobi"
  },
  academicStage: {
    stage: "SeniorSecondary",
    currentClassOrLevel: "Form 2"
  },
  subjectsCompetencies: {
    subjectsTaken: ["Mathematics", "Physics", "Chemistry"]
  },
  careerGoals: {
    longTerm: "Software Engineering"
  }
}
```

**Stored in:** `localStorage` as JSON string

---

## Benefits

✅ **Fast Setup** - 3 steps instead of 8
✅ **Persistent** - Profile saved across sessions
✅ **No Re-entry** - Users don't fill form every time
✅ **Prototype-Ready** - Minimal fields for testing
✅ **Easy to Expand** - Can add more fields later

---

## Future Enhancements

### Option 1: Database Storage
Replace localStorage with Supabase:
```typescript
// Save to database
await supabase.from('student_profiles').upsert({
  user_id: user.id,
  profile_data: profile
})

// Load from database
const { data } = await supabase
  .from('student_profiles')
  .select('profile_data')
  .eq('user_id', user.id)
```

### Option 2: Progressive Enhancement
Start with minimal, add fields later:
- Step 4: Skills (optional)
- Step 5: Projects (optional)
- Step 6: Achievements (optional)

### Option 3: Profile Completion Score
Show progress:
- Minimal: 30% complete
- With Skills: 50% complete
- With Projects: 70% complete
- Full Profile: 100% complete

---

## Testing

### Test Profile Persistence

1. **Fill profile** → Complete wizard
2. **Refresh page** → Profile should still be there
3. **Logout and login** → Profile should persist
4. **Clear localStorage** → Wizard should appear again

### Test in Browser Console

```javascript
// Check if profile exists
localStorage.getItem('student_profile')

// Clear profile (for testing)
localStorage.removeItem('student_profile')

// View profile
JSON.parse(localStorage.getItem('student_profile'))
```

---

## Migration Path

When ready to move to database:

1. **Keep localStorage as fallback**
2. **Add database save on completion**
3. **Load from database first, localStorage second**
4. **Gradually migrate existing localStorage profiles**

```typescript
// Hybrid approach
const loadProfile = async () => {
  // Try database first
  const dbProfile = await loadFromDatabase()
  if (dbProfile) return dbProfile
  
  // Fallback to localStorage
  const localProfile = localStorage.getItem('student_profile')
  if (localProfile) {
    // Save to database for future
    await saveToDatabase(JSON.parse(localProfile))
    return JSON.parse(localProfile)
  }
  
  return null
}
```

---

## Summary

✅ **Minimal Profile** - 3 steps, essential fields only
✅ **Persistent Storage** - localStorage (browser)
✅ **Auto-Load** - Profile loads on login
✅ **No Re-entry** - Users don't fill form repeatedly
✅ **Prototype-Ready** - Fast setup for testing

The profile is now **minimal and persistent**, perfect for prototyping!

