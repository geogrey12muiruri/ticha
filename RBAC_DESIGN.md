# 🔐 Role-Based Access Control (RBAC) Design

## User Roles & Permissions

### 1. **Student** (Default Role)
**Who:** End users seeking scholarships

**Permissions:**
- ✅ View verified scholarships
- ✅ Create/edit own profile
- ✅ Get scholarship matches
- ✅ View application guides
- ✅ Download document templates
- ✅ Track own applications
- ✅ Submit scholarship applications (if we implement)
- ❌ Create/edit scholarships
- ❌ View other users' data
- ❌ Access admin features

**Use Cases:**
- Complete questionnaire
- View matched scholarships
- Download templates
- Track applications

---

### 2. **Scholarship Provider** (New Role)
**Who:** Organizations offering scholarships (NGOs, foundations, companies)

**Permissions:**
- ✅ Create/edit own scholarships
- ✅ Upload scholarship forms
- ✅ View applications to their scholarships
- ✅ Update scholarship status (active/closed)
- ✅ View analytics for their scholarships
- ✅ Manage application deadlines
- ❌ Edit other providers' scholarships
- ❌ View student personal data (only anonymized)
- ❌ Access admin features

**Use Cases:**
- Post new scholarships
- Upload application forms
- View application statistics
- Close expired scholarships

---

### 3. **Verifier** (New Role)
**Who:** Trusted volunteers/staff who verify scholarship legitimacy

**Permissions:**
- ✅ Review submitted scholarships
- ✅ Verify scholarship information
- ✅ Flag suspicious scholarships
- ✅ Approve/reject scholarship submissions
- ✅ Add verification notes
- ❌ Create scholarships
- ❌ Edit scholarship details
- ❌ View student personal data

**Use Cases:**
- Review provider-submitted scholarships
- Verify information accuracy
- Check for scams
- Approve for publication

---

### 4. **Admin** (Highest Role)
**Who:** Platform administrators

**Permissions:**
- ✅ All permissions
- ✅ Manage users (assign roles, suspend accounts)
- ✅ Edit any scholarship
- ✅ View all data (with audit logging)
- ✅ Manage system settings
- ✅ Access analytics dashboard
- ✅ Manage verifiers
- ✅ Handle disputes

**Use Cases:**
- System management
- User management
- Data oversight
- Security monitoring

---

## Permission Matrix

| Action | Student | Provider | Verifier | Admin |
|--------|---------|----------|----------|-------|
| View Scholarships | ✅ | ✅ | ✅ | ✅ |
| Create Profile | ✅ | ✅ | ✅ | ✅ |
| Get Matches | ✅ | ❌ | ❌ | ✅ |
| Create Scholarship | ❌ | ✅ | ❌ | ✅ |
| Edit Own Scholarship | ❌ | ✅ | ❌ | ✅ |
| Edit Any Scholarship | ❌ | ❌ | ❌ | ✅ |
| Upload Forms | ❌ | ✅ | ❌ | ✅ |
| Verify Scholarship | ❌ | ❌ | ✅ | ✅ |
| View Applications | ❌ | ✅* | ❌ | ✅ |
| View Analytics | ❌ | ✅* | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| View All Data | ❌ | ❌ | ❌ | ✅ |

*Only for their own scholarships

---

## Implementation Design

### Database Schema

```sql
-- User Roles
CREATE TYPE user_role AS ENUM (
  'student',
  'provider',
  'verifier',
  'admin'
);

-- Users Table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role user_role DEFAULT 'student',
  organization_name VARCHAR(255), -- For providers
  organization_type VARCHAR(50), -- NGO, Foundation, Government, etc.
  verified BOOLEAN DEFAULT FALSE, -- Provider verification
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_role (role),
  INDEX idx_verified (verified)
);

-- Permissions (for fine-grained control)
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

-- Role Permissions (many-to-many)
CREATE TABLE role_permissions (
  role user_role,
  permission_id UUID REFERENCES permissions(id),
  PRIMARY KEY (role, permission_id)
);

-- Audit Log (track all sensitive actions)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50), -- 'scholarship', 'user', etc.
  resource_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
);
```

---

## Access Control Implementation

### Middleware for Route Protection

```typescript
// src/middleware/auth.middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUserRole } from '@/services/auth.service'

export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<NextResponse | null> {
  const user = await getUserFromRequest(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const role = await getUserRole(user.id)
  
  if (!allowedRoles.includes(role)) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }
  
  return null // Allow access
}
```

### React Hook for Client-Side

```typescript
// src/hooks/usePermissions.ts
export function usePermissions() {
  const { user } = useAuth()
  const [role, setRole] = useState<string | null>(null)
  
  useEffect(() => {
    if (user) {
      getUserRole(user.id).then(setRole)
    }
  }, [user])
  
  const hasPermission = (permission: string) => {
    // Check if role has permission
  }
  
  const can = (action: string, resource?: string) => {
    // Check if user can perform action
  }
  
  return { role, hasPermission, can }
}
```

---

## Provider Portal Features

### What Providers Can Do:

1. **Scholarship Management**
   - Create new scholarships
   - Edit existing scholarships
   - Upload application forms (PDF, DOCX)
   - Set deadlines
   - Close/archive scholarships

2. **Application Management**
   - View applications (anonymized or full, based on consent)
   - Filter by criteria
   - Export application data
   - Send communications

3. **Analytics**
   - View application statistics
   - See match rates
   - Track engagement

4. **Form Management**
   - Upload custom forms
   - Use AI-generated forms
   - Edit form templates

---

## Security Considerations

### 1. **Data Isolation**
- Providers only see their own scholarships
- Students only see their own data
- Verifiers see submissions, not personal data

### 2. **Audit Logging**
- Log all sensitive actions
- Track who did what, when
- IP address tracking

### 3. **Rate Limiting**
- Prevent abuse
- Limit API calls per role
- Protect against spam

### 4. **Verification Workflow**
- Providers must be verified before publishing
- Two-step verification for sensitive actions
- Email confirmation for role changes

---

## User Flow Examples

### Provider Flow:
1. Sign up as "Provider"
2. Submit organization verification
3. Admin/Verifier approves
4. Provider can now create scholarships
5. Upload forms or use AI generator
6. Scholarships go to verification queue
7. Verifier reviews and approves
8. Scholarship goes live

### Student Flow:
1. Sign up (default: Student role)
2. Complete profile
3. Get matches
4. View scholarships
5. Download templates
6. Track applications

### Verifier Flow:
1. Admin assigns Verifier role
2. Verifier sees pending scholarships
3. Reviews and verifies
4. Approves or flags issues
5. Scholarship published or rejected

---

## Next Steps

1. ✅ Design RBAC schema
2. ⚠️ Implement role assignment
3. ⚠️ Build provider portal
4. ⚠️ Create verification workflow
5. ⚠️ Add audit logging
6. ⚠️ Build permission checks


