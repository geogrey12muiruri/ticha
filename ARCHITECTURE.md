# 🏗️ Enterprise Architecture

## Project Structure

```
src/
├── app/                          # Next.js App Router (Pages only)
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api/                      # API Routes
│   │   └── chat/
│   ├── auth/                     # Auth callbacks
│   ├── dashboard/
│   ├── chat/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/                    # React Components
│   ├── features/                 # Feature-specific components
│   │   └── auth/
│   │       └── LoginForm.tsx
│   ├── shared/                   # Shared/reusable components
│   │   ├── BrandHeader.tsx
│   │   └── AuthLayout.tsx
│   └── ui/                       # shadcn/ui components
│
├── hooks/                         # Custom React Hooks
│   ├── useAuth.ts
│   └── useChat.ts
│
├── services/                      # Business Logic Layer
│   ├── auth.service.ts
│   ├── ai.service.ts
│   └── storage.service.ts
│
├── lib/                          # Utilities & Configs
│   ├── supabaseClient.ts
│   ├── offlineAuth.ts
│   ├── offlineStorage.ts
│   ├── aiCache.ts
│   └── utils.ts
│
├── constants/                     # Constants & Configuration
│   └── index.ts
│
├── validators/                    # Validation Logic
│   └── auth.validator.ts
│
├── types/                         # TypeScript Types
│   └── index.ts
│
├── prompts/                       # AI Prompts
│   └── tutor-prompt.ts
│
└── middleware.ts                  # Next.js Middleware
```

## Architecture Principles

### 1. **Separation of Concerns**

- **Pages** (`app/`) - Only routing and page composition
- **Components** - UI presentation only
- **Services** - Business logic
- **Hooks** - State management and side effects
- **Validators** - Input validation
- **Constants** - Configuration

### 2. **Service Layer Pattern**

All business logic is in services:
- `AuthService` - Authentication operations
- `AIService` - AI/ML operations
- `StorageService` - Data persistence

### 3. **Custom Hooks**

Reusable logic extracted to hooks:
- `useAuth` - Authentication state and operations
- `useChat` - Chat state and operations

### 4. **Component Organization**

- **Features** - Feature-specific components
- **Shared** - Reusable across features
- **UI** - Base UI components (shadcn)

### 5. **Type Safety**

- All services typed
- All hooks typed
- All components typed
- Centralized types in `types/`

## Design Patterns Used

### 1. **Service Layer Pattern**
```typescript
// Business logic in services
AuthService.signIn({ email, password })
AIService.generateResponse({ message, context })
```

### 2. **Custom Hooks Pattern**
```typescript
// Reusable stateful logic
const { user, signIn, signOut } = useAuth()
const { messages, sendMessage } = useChat()
```

### 3. **Component Composition**
```typescript
// Small, focused components
<AuthLayout>
  <LoginForm />
</AuthLayout>
```

### 4. **Constants Pattern**
```typescript
// Centralized configuration
ROUTES.LOGIN
AUTH_CONFIG.SESSION_EXPIRY_HOURS
```

### 5. **Validator Pattern**
```typescript
// Centralized validation
AuthValidator.validateEmail(email)
AuthValidator.validatePassword(password)
```

## File Organization Rules

### ✅ DO:
- Put business logic in `services/`
- Put reusable hooks in `hooks/`
- Put shared components in `components/shared/`
- Put feature components in `components/features/`
- Put constants in `constants/`
- Put validators in `validators/`
- Keep pages thin (composition only)

### ❌ DON'T:
- Put business logic in components
- Put business logic in pages
- Scatter constants across files
- Duplicate validation logic
- Mix concerns in single files

## Code Examples

### Service Usage
```typescript
// In component
const result = await AuthService.signIn({ email, password })
if (result.success) {
  // Handle success
}
```

### Hook Usage
```typescript
// In component
const { user, signIn, loading } = useAuth()
```

### Validator Usage
```typescript
// In component
const validation = AuthValidator.validateEmail(email)
if (!validation.valid) {
  setError(validation.error)
}
```

## Benefits

1. **Maintainability** - Easy to find and update code
2. **Testability** - Services and hooks are testable
3. **Reusability** - Components and hooks are reusable
4. **Scalability** - Easy to add new features
5. **Type Safety** - Full TypeScript coverage
6. **Best Practices** - Follows Next.js and React patterns

## Next Steps

- [ ] Add error boundaries
- [ ] Add loading states service
- [ ] Add analytics service
- [ ] Add logging service
- [ ] Add unit tests for services
- [ ] Add integration tests




