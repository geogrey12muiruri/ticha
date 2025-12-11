# 🗺️ Implementation Roadmap: Multi-User System

## Overview

This roadmap outlines the implementation of the multi-user system with RBAC, provider portal, and AI form generation.

---

## Phase 1: Database & RBAC Foundation (Week 1-2)

### Database Setup
- [ ] Create `user_profiles` table in Supabase
- [ ] Create `scholarships` table (enhanced with provider_id)
- [ ] Create `forms` table
- [ ] Create `audit_logs` table
- [ ] Set up Row Level Security (RLS) policies

### RBAC Service
- [x] Create `RBACService` class
- [x] Implement role management
- [x] Implement permission checks
- [ ] Add audit logging
- [ ] Create `useRBAC` hook

### Authentication Integration
- [ ] Update sign-up to create user profile
- [ ] Add role assignment on registration
- [ ] Update auth middleware for role checks

---

## Phase 2: Provider Portal (Week 3-4)

### Provider Registration
- [ ] Provider sign-up flow
- [ ] Organization information form
- [ ] Verification request submission
- [ ] Email notifications

### Provider Dashboard
- [ ] Dashboard UI
- [ ] Statistics display
- [ ] Recent scholarships
- [ ] Quick actions

### Scholarship Management
- [ ] Create scholarship form
- [ ] Edit scholarship
- [ ] Delete scholarship
- [ ] View own scholarships
- [ ] Status management

---

## Phase 3: Form System (Week 5-6)

### AI Form Generation
- [x] Create `FormGenerationService`
- [x] AI form generator (using Groq)
- [ ] Form validation
- [ ] Form preview
- [ ] Form editing

### Form Upload
- [ ] File upload endpoint
- [ ] File storage (Supabase Storage)
- [ ] File validation
- [ ] Form extraction (future: OCR)

### Form Builder
- [ ] Manual form builder UI
- [ ] Drag-and-drop interface
- [ ] Field configuration
- [ ] Section management

### Form Display
- [ ] HTML form renderer
- [ ] PDF export
- [ ] Form download
- [ ] Online form submission (optional)

---

## Phase 4: Verification System (Week 7-8)

### Verifier Dashboard
- [ ] Pending scholarships list
- [ ] Scholarship review interface
- [ ] Approval/rejection workflow
- [ ] Verification notes

### Verification Workflow
- [ ] Auto-queue new scholarships
- [ ] Assign verifiers
- [ ] Review interface
- [ ] Approval process
- [ ] Notification system

### Provider Verification
- [ ] Provider verification queue
- [ ] Organization verification
- [ ] Document review
- [ ] Approval workflow

---

## Phase 5: Enhanced Features (Week 9-12)

### Analytics
- [ ] Provider analytics dashboard
- [ ] Application statistics
- [ ] Match rates
- [ ] Engagement metrics

### Notifications
- [ ] Email notifications
- [ ] In-app notifications
- [ ] Deadline reminders
- [ ] Status updates

### Application Management
- [ ] Application tracking
- [ ] Status updates
- [ ] Communication system
- [ ] Export functionality

---

## Database Migration Script

```sql
-- Run this in Supabase SQL Editor

-- 1. Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'provider', 'verifier', 'admin')),
  organization_name VARCHAR(255),
  organization_type VARCHAR(50),
  organization_website VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create scholarships table (enhanced)
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES user_profiles(id);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS form_id UUID;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS form_type VARCHAR(50);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES user_profiles(id);
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS verification_notes TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'closed', 'rejected'));
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

-- 3. Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES user_profiles(id),
  title VARCHAR(255) NOT NULL,
  structure JSONB NOT NULL,
  instructions TEXT,
  generation_method VARCHAR(50),
  ai_prompt TEXT,
  source_file_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_verified ON user_profiles(verified);
CREATE INDEX IF NOT EXISTS idx_scholarships_provider ON scholarships(provider_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_verified ON scholarships(verified);
CREATE INDEX IF NOT EXISTS idx_forms_scholarship ON forms(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- 6. Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Providers can view their own scholarships
CREATE POLICY "Providers can view own scholarships"
  ON scholarships FOR SELECT
  USING (
    auth.uid() = provider_id OR
    status = 'active' -- Everyone can see active scholarships
  );

-- Providers can create scholarships
CREATE POLICY "Providers can create scholarships"
  ON scholarships FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'provider' AND verified = true
    )
  );

-- Providers can update their own scholarships
CREATE POLICY "Providers can update own scholarships"
  ON scholarships FOR UPDATE
  USING (auth.uid() = provider_id);

-- Admins can do everything
CREATE POLICY "Admins have full access"
  ON scholarships FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Next Immediate Steps

1. **Run Database Migration**
   - Execute SQL script in Supabase
   - Verify tables created
   - Test RLS policies

2. **Update Auth Service**
   - Create user profile on sign-up
   - Assign default role (student)

3. **Build Provider Registration**
   - Registration form
   - Organization info
   - Verification request

4. **Create Provider Dashboard**
   - Basic layout
   - Statistics
   - Scholarship list

5. **Implement Form Generator**
   - Test AI generation
   - Build UI
   - Add preview

---

## Testing Checklist

### RBAC Testing
- [ ] Student can only view scholarships
- [ ] Provider can create scholarships
- [ ] Provider can only edit own scholarships
- [ ] Verifier can verify scholarships
- [ ] Admin can do everything

### Form Generation Testing
- [ ] AI generates valid form structure
- [ ] Form preview works
- [ ] Form can be edited
- [ ] Form exports to PDF

### Security Testing
- [ ] RLS policies work correctly
- [ ] Audit logs capture actions
- [ ] File uploads are validated
- [ ] API routes are protected

---

## Success Criteria

### Phase 1 Complete When:
- ✅ Database tables created
- ✅ RBAC service working
- ✅ Users have roles
- ✅ Permissions enforced

### Phase 2 Complete When:
- ✅ Providers can register
- ✅ Providers can create scholarships
- ✅ Provider dashboard functional

### Phase 3 Complete When:
- ✅ AI form generation works
- ✅ Forms can be uploaded
- ✅ Forms can be edited
- ✅ Forms can be exported

### Phase 4 Complete When:
- ✅ Verifiers can review
- ✅ Verification workflow works
- ✅ Scholarships go through approval

---

## Notes

- Start with Phase 1 (foundation)
- Test thoroughly before moving to next phase
- Keep security as priority
- Document all changes
- Monitor audit logs


