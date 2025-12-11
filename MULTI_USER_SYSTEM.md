# 👥 Multi-User System Architecture

## Overview

This document outlines the complete multi-user system with RBAC, provider portal, and AI form generation.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Jifunze AI Platform                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Students   │  │  Providers   │  │  Verifiers   │ │
│  │              │  │              │  │              │ │
│  │ • View       │  │ • Create     │  │ • Verify     │ │
│  │ • Match      │  │ • Upload     │  │ • Approve    │ │
│  │ • Apply      │  │ • Manage     │  │ • Flag       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           AI Services Layer                      │  │
│  │  • Form Generation (Groq API)                    │  │
│  │  • Form Extraction (OCR + NLP)                   │  │
│  │  • Matching (ML Model)                            │  │
│  │  • Guidance (Chatbot)                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Data Layer (Supabase)                   │  │
│  │  • Users & Roles                                 │  │
│  │  • Scholarships                                  │  │
│  │  • Applications                                  │  │
│  │  • Forms                                         │  │
│  │  • Audit Logs                                    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## User Journeys

### Student Journey

```
1. Sign Up (Default: Student role)
   ↓
2. Complete Profile Questionnaire
   ↓
3. Get Scholarship Matches
   ↓
4. View Scholarship Details
   ↓
5. Download Application Form (or use online)
   ↓
6. Fill & Submit Application
   ↓
7. Track Application Status
```

### Provider Journey

```
1. Sign Up → Request Provider Role
   ↓
2. Submit Organization Verification
   ↓
3. Admin/Verifier Approves
   ↓
4. Provider Portal Access
   ↓
5. Create Scholarship
   ├─ Option A: AI Generate Form
   ├─ Option B: Upload Existing Form
   └─ Option C: Build Manually
   ↓
6. Submit for Verification
   ↓
7. Verifier Reviews & Approves
   ↓
8. Scholarship Goes Live
   ↓
9. View Applications & Analytics
```

### Verifier Journey

```
1. Admin Assigns Verifier Role
   ↓
2. Access Verification Dashboard
   ↓
3. See Pending Scholarships
   ↓
4. Review Scholarship Details
   ├─ Check legitimacy
   ├─ Verify information
   └─ Check for scams
   ↓
5. Approve or Reject
   ↓
6. Add Verification Notes
```

---

## Database Schema (Complete)

```sql
-- User Roles
CREATE TYPE user_role AS ENUM (
  'student',
  'provider',
  'verifier',
  'admin'
);

-- User Profiles (extends Supabase auth)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role user_role DEFAULT 'student',
  
  -- Provider-specific
  organization_name VARCHAR(255),
  organization_type VARCHAR(50), -- NGO, Foundation, Government, Company
  organization_website VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB, -- Stored securely
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_role (role),
  INDEX idx_verified (verified)
);

-- Scholarships (Enhanced)
CREATE TABLE scholarships (
  id UUID PRIMARY KEY,
  provider_id UUID REFERENCES user_profiles(id),
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- scholarship, bursary, loan, grant
  
  -- Eligibility
  eligibility JSONB NOT NULL,
  
  -- Award Details
  amount_min DECIMAL,
  amount_max DECIMAL,
  currency VARCHAR(3) DEFAULT 'KES',
  coverage JSONB, -- ['tuition', 'books', etc.]
  duration VARCHAR(100),
  
  -- Application
  application_deadline TIMESTAMP,
  application_method VARCHAR(50), -- online, offline, both
  application_link TEXT,
  
  -- Form
  form_id UUID REFERENCES forms(id), -- Link to form
  form_type VARCHAR(50), -- ai_generated, uploaded, manual
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES user_profiles(id),
  verified_at TIMESTAMP,
  verification_notes TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, closed, rejected
  published_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_provider (provider_id),
  INDEX idx_status (status),
  INDEX idx_verified (verified),
  INDEX idx_deadline (application_deadline)
);

-- Forms
CREATE TABLE forms (
  id UUID PRIMARY KEY,
  scholarship_id UUID REFERENCES scholarships(id),
  provider_id UUID REFERENCES user_profiles(id),
  
  -- Form Data
  title VARCHAR(255) NOT NULL,
  structure JSONB NOT NULL, -- Form structure (sections, fields)
  instructions TEXT,
  
  -- Generation Info
  generation_method VARCHAR(50), -- ai_generated, uploaded, manual
  ai_prompt TEXT, -- If AI-generated, store prompt
  source_file_url TEXT, -- If uploaded, store file URL
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_scholarship (scholarship_id),
  INDEX idx_provider (provider_id)
);

-- Form Submissions (if we implement online forms)
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY,
  form_id UUID REFERENCES forms(id),
  scholarship_id UUID REFERENCES scholarships(id),
  student_id UUID REFERENCES user_profiles(id),
  
  -- Submission Data
  data JSONB NOT NULL, -- Form field values
  files JSONB, -- Uploaded file URLs
  
  -- Status
  status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, accepted, rejected
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES user_profiles(id),
  
  INDEX idx_scholarship (scholarship_id),
  INDEX idx_student (student_id),
  INDEX idx_status (status)
);

-- Applications (Student tracking)
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES user_profiles(id),
  scholarship_id UUID REFERENCES scholarships(id),
  
  status VARCHAR(50) DEFAULT 'interested', -- interested, applied, accepted, rejected
  applied_at TIMESTAMP,
  outcome VARCHAR(50), -- accepted, rejected, pending
  outcome_date TIMESTAMP,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(student_id, scholarship_id),
  INDEX idx_student (student_id),
  INDEX idx_scholarship (scholarship_id),
  INDEX idx_status (status)
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_created (created_at)
);
```

---

## API Routes Structure

```
/api/
├── auth/
│   ├── role/              # Get/update user role
│   └── verify-provider/   # Verify provider account
│
├── scholarships/
│   ├── [GET] /            # List (filtered by role)
│   ├── [POST] /           # Create (provider only)
│   ├── [GET] /:id         # Get details
│   ├── [PUT] /:id         # Update (owner/admin)
│   └── [DELETE] /:id      # Delete (owner/admin)
│
├── forms/
│   ├── [POST] /generate   # AI generate form
│   ├── [POST] /upload     # Upload form file
│   ├── [GET] /:id         # Get form
│   └── [PUT] /:id         # Update form
│
├── verification/
│   ├── [GET] /pending      # Get pending (verifier)
│   ├── [POST] /:id/approve # Approve (verifier)
│   └── [POST] /:id/reject  # Reject (verifier)
│
└── applications/
    ├── [GET] /            # List (filtered by role)
    ├── [POST] /           # Create (student)
    └── [GET] /:id         # Get details
```

---

## Security Implementation

### 1. **Route Protection**

```typescript
// src/middleware/rbac.middleware.ts
export async function requireRole(
  request: NextRequest,
  roles: string[]
): Promise<NextResponse | null> {
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const userRole = await getUserRole(user.id)
  if (!roles.includes(userRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // Log access
  await logAudit({
    user_id: user.id,
    action: 'access',
    resource_type: request.nextUrl.pathname,
    ip_address: request.ip
  })
  
  return null
}
```

### 2. **Data Isolation**

```typescript
// Providers only see their scholarships
if (userRole === 'provider') {
  query = query.eq('provider_id', user.id)
}

// Students only see their applications
if (userRole === 'student') {
  query = query.eq('student_id', user.id)
}
```

### 3. **File Upload Security**

```typescript
// Validate file uploads
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error('Invalid file type')
}

if (file.size > MAX_SIZE) {
  throw new Error('File too large')
}

// Scan for malware (if service available)
// Store in secure location (Supabase Storage)
```

---

## Provider Portal Features

### Dashboard
- Statistics (applications, views)
- Recent scholarships
- Pending verifications
- Quick actions

### Scholarship Management
- Create new
- Edit existing
- View analytics
- Close/archive

### Form Management
- AI generate
- Upload existing
- Build manually
- Preview & edit

### Application Management
- View submissions
- Filter & search
- Export data
- Send communications

---

## Next Implementation Steps

### Phase 1: RBAC Foundation
1. ✅ Design schema
2. ⚠️ Create user_profiles table
3. ⚠️ Implement role assignment
4. ⚠️ Build permission checks
5. ⚠️ Add audit logging

### Phase 2: Provider Portal
1. ⚠️ Provider registration flow
2. ⚠️ Verification workflow
3. ⚠️ Scholarship creation UI
4. ⚠️ Provider dashboard

### Phase 3: Form System
1. ⚠️ AI form generator
2. ⚠️ File upload
3. ⚠️ Form builder UI
4. ⚠️ Form preview/export

### Phase 4: Verification
1. ⚠️ Verifier dashboard
2. ⚠️ Review workflow
3. ⚠️ Approval/rejection
4. ⚠️ Notification system

---

## Benefits of Multi-User System

### For Platform:
- ✅ Scalable (providers add content)
- ✅ Self-sustaining (less manual work)
- ✅ More scholarships (providers post)
- ✅ Better data (providers maintain)

### For Providers:
- ✅ Easy to post scholarships
- ✅ Manage applications
- ✅ Analytics & insights
- ✅ Professional presence

### For Students:
- ✅ More scholarships
- ✅ Better information
- ✅ Easier applications
- ✅ Trusted platform

---

## Conclusion

This multi-user system transforms the platform from a **static database** to a **dynamic ecosystem** where:

- **Providers** contribute scholarships
- **AI** helps generate forms
- **Verifiers** ensure quality
- **Students** benefit from all of it

The key is **proper RBAC** to ensure security and data isolation.


