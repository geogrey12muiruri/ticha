# 🔧 PGRST116 Error Fix

## Problem

**Error:**
```json
{
  "code": "PGRST116",
  "details": "The result contains 0 rows",
  "message": "Cannot coerce the result to a single JSON object"
}
```

**Cause:**
Using `.single()` when the query returns 0 rows. Supabase's `.single()` expects exactly 1 row, and throws this error when there are 0 rows.

**Common Scenarios:**
1. User profile doesn't exist yet (trigger didn't fire, or user created before trigger)
2. Scholarship not found
3. Any query expecting 1 row but getting 0

---

## Solution

### Use `.maybeSingle()` Instead of `.single()`

**Before (causes error):**
```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
  .single() // ❌ Throws PGRST116 if 0 rows
```

**After (handles gracefully):**
```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
  .maybeSingle() // ✅ Returns null if 0 rows (no error)
```

**Difference:**
- `.single()` - Expects exactly 1 row, throws error if 0 or 2+ rows
- `.maybeSingle()` - Returns null if 0 rows, throws error only if 2+ rows

---

## Fixed Code

### RBAC Service

**Updated methods:**
- ✅ `getUserRole()` - Now uses `.maybeSingle()` and auto-creates profile if missing
- ✅ `getUserProfile()` - Now uses `.maybeSingle()` and auto-creates profile if missing
- ✅ `isResourceOwner()` - Now uses `.maybeSingle()` for scholarship checks

**Auto-Creation:**
If profile doesn't exist, the service now:
1. Detects missing profile (0 rows)
2. Automatically creates default profile (role: 'student')
3. Retries the query
4. Returns the result

---

## When to Use Each

### Use `.single()` When:
- ✅ You're **certain** the row exists
- ✅ Missing row is a **real error** (e.g., invalid ID)
- ✅ You want to **fail fast** if not found

**Example:**
```typescript
// Scholarship by ID - should exist
const { data, error } = await supabase
  .from('scholarships')
  .select('*')
  .eq('id', scholarshipId)
  .single() // OK - if missing, it's an error
```

### Use `.maybeSingle()` When:
- ✅ Row might not exist yet
- ✅ Missing row is **expected** (e.g., optional profile)
- ✅ You want to **handle gracefully** (create if missing)

**Example:**
```typescript
// User profile - might not exist yet
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
  .maybeSingle() // Better - returns null if missing
```

---

## Error Handling Pattern

```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
  .maybeSingle()

if (error) {
  // Handle specific error codes
  if (error.code === 'PGRST116') {
    // 0 rows - profile doesn't exist
    // Create it or return default
  }
  return null
}

if (!data) {
  // maybeSingle returns null for 0 rows (no error)
  // Create profile or return default
  return null
}

return data
```

---

## All Fixed Locations

### ✅ Fixed
- `src/services/rbac.service.ts`
  - `getUserRole()` - Uses `.maybeSingle()`
  - `getUserProfile()` - Uses `.maybeSingle()`
  - `isResourceOwner()` - Uses `.maybeSingle()`

### ✅ Already Handled
- `src/app/api/scholarships/[id]/route.ts` - Handles PGRST116 error
- `src/app/api/scholarships/route.ts` - Uses `.single()` for creation (OK)

---

## Testing

### Test Missing Profile

```typescript
// This should now work without error
const role = await RBACService.getUserRole('non-existent-user-id')
console.log(role) // Should return 'student' and create profile
```

### Test Auto-Creation

1. Delete a user profile manually
2. Call `getUserRole()` or `getUserProfile()`
3. Check database - profile should be auto-created
4. Subsequent calls should work normally

---

## Summary

✅ **Fixed:** Changed `.single()` to `.maybeSingle()` in RBAC service
✅ **Auto-Creation:** Missing profiles are automatically created
✅ **Graceful Handling:** No more PGRST116 errors for missing profiles
✅ **Backward Compatible:** Existing code continues to work

The error should now be resolved! 🎉

