# Technical RFC: [Work Title]

> **Voice:** Lead Engineer / Architect
> **Purpose:** Define HOW we'll build it technically
> **Audience:** Developers implementing this work and future maintainers
> **Part of:** CDD Modular Artifacts (TECHNICAL_RFC.md)

---

**Work ID:** XXXX
**Problem Brief:** See `PROBLEM_BRIEF.md` for context on WHAT and WHY

**Author:** [Your Name]
**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Status:** draft | proposed | accepted | implemented

---

## 🏗️ Architecture Overview

> **High-level technical approach**

[Describe how this work fits into the existing system architecture. 2-4 sentences.]

**Example:**
> This feature adds a new `UserPreferences` service that sits between the API layer and the database. It follows the existing repository pattern used throughout the application. The service will be consumed by both the settings UI and the session initialization logic.

### Architectural Diagram (Optional)

```
┌─────────────┐
│ Settings UI │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ UserPreferences API  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ PreferencesService   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Database (Postgres)  │
└──────────────────────┘
```

---

## 🛠️ Technology Stack

> **What technologies, frameworks, and libraries will we use?**

### Core Technologies

- **Language(s):** [e.g., TypeScript, Python 3.11]
- **Framework:** [e.g., Next.js 14, Django 4.2]
- **Runtime:** [e.g., Node.js 20, Python runtime]

### Key Libraries/Dependencies

- **Library 1:** [Name + Version] - [Purpose]
  - **Example:** `zod ^3.22.0` - Schema validation for preferences object

- **Library 2:** [Name + Version] - [Purpose]
  - **Example:** `react-hook-form ^7.48.0` - Form state management

### Infrastructure

- **Database:** [Type + Version] - [Purpose]
  - **Example:** PostgreSQL 15 - Primary data store

- **Caching:** [If applicable]
  - **Example:** Redis - Session cache for frequently accessed preferences

---

## 📁 File Structure

> **What files will be created or modified?**

### Files to Create

```
src/
├── services/
│   └── preferences/
│       ├── PreferencesService.ts        # Core service logic
│       ├── PreferencesRepository.ts     # Database access layer
│       └── types.ts                      # TypeScript interfaces
│
├── app/
│   └── api/
│       └── preferences/
│           └── route.ts                  # API endpoints
│
├── components/
│   └── settings/
│       ├── PreferencesForm.tsx           # Settings UI
│       └── PreferenceSection.tsx         # Reusable section component
│
└── __tests__/
    └── services/
        └── preferences/
            ├── PreferencesService.test.ts
            └── PreferencesRepository.test.ts
```

### Files to Modify

- `prisma/schema.prisma` - Add `UserPreferences` model
- `app/layout.tsx` - Load preferences on session init
- `middleware.ts` - Add preferences hydration
- `types/index.ts` - Export new preference types

---

## 🗄️ Data Model

> **Database schema, types, and data structures**

### Database Schema

**Table:** `user_preferences`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY, NOT NULL | References users.id |
| `theme` | VARCHAR(20) | DEFAULT 'light' | UI theme preference |
| `language` | VARCHAR(10) | DEFAULT 'en' | Locale preference |
| `notifications_enabled` | BOOLEAN | DEFAULT true | Email notification opt-in |
| `settings_json` | JSONB | DEFAULT '{}' | Extensible settings object |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_user_preferences_user_id` on `user_id` (frequent lookup)

**Migrations:**
- Migration file: `20241030_add_user_preferences.sql`

### TypeScript Interfaces

```typescript
interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationsEnabled: boolean;
  settings: Record<string, unknown>; // Extensible
  createdAt: Date;
  updatedAt: Date;
}

interface PreferenceUpdatePayload {
  theme?: UserPreferences['theme'];
  language?: string;
  notificationsEnabled?: boolean;
  settings?: Record<string, unknown>;
}
```

---

## 🌐 API Design

> **Endpoints, request/response formats, error handling**

### Endpoints

#### GET `/api/preferences`

**Purpose:** Fetch current user's preferences

**Auth:** Required (JWT token)

**Request:**
```http
GET /api/preferences
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "theme": "dark",
  "language": "en",
  "notificationsEnabled": true,
  "settings": {}
}
```

**Errors:**
- `401 Unauthorized` - No valid session
- `500 Internal Server Error` - Database error

---

#### PATCH `/api/preferences`

**Purpose:** Update preferences (partial update)

**Auth:** Required (JWT token)

**Request:**
```http
PATCH /api/preferences
Authorization: Bearer {token}
Content-Type: application/json

{
  "theme": "dark",
  "language": "es"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "theme": "dark",
  "language": "es",
  "notificationsEnabled": true,
  "settings": {},
  "updatedAt": "2024-10-30T12:00:00Z"
}
```

**Validation:**
- `theme` must be one of: `light`, `dark`, `system`
- `language` must be valid locale code
- `notificationsEnabled` must be boolean

**Errors:**
- `400 Bad Request` - Invalid payload (with validation details)
- `401 Unauthorized` - No valid session
- `500 Internal Server Error` - Database error

---

## 🎨 UI/UX Implementation (For Features with UI)

> **Component architecture, state management, user interactions**

### Component Hierarchy

```
<PreferencesPage>
  └── <PreferencesForm>
        ├── <PreferenceSection title="Appearance">
        │     ├── <ThemeSelector />
        │     └── <LanguageSelector />
        │
        └── <PreferenceSection title="Notifications">
              └── <NotificationToggle />
```

### State Management

**Approach:** React Query for server state + React Hook Form for form state

- **Initial Load:** `useQuery` fetches preferences from `/api/preferences`
- **Form State:** `react-hook-form` manages local edits
- **Mutation:** `useMutation` PATCH to `/api/preferences` on save
- **Optimistic Update:** Update UI immediately, roll back on error

### User Interaction Flow

1. User navigates to `/settings`
2. Component fetches current preferences (loading state shown)
3. Form populates with current values
4. User changes theme dropdown to "Dark"
5. Form marks field as dirty
6. User clicks "Save Settings" button
7. Mutation fired → optimistic update applied
8. API call succeeds → confirm UI + toast notification
9. (If error) Roll back + show error message

---

## 🧩 Implementation Patterns

> **Code patterns, conventions, and examples to follow**

### Patterns to Follow

#### 1. Repository Pattern (Database Access)

**Reference:** `src/services/auth/AuthRepository.ts`

**Apply to:** `PreferencesRepository.ts`

```typescript
// Follow this structure:
class PreferencesRepository {
  async findByUserId(userId: string): Promise<UserPreferences | null> {
    // Use Prisma client, handle errors
  }

  async upsert(userId: string, data: PreferenceUpdatePayload): Promise<UserPreferences> {
    // Upsert logic
  }
}
```

#### 2. API Route Handlers (Next.js Pattern)

**Reference:** `src/app/api/auth/route.ts`

**Apply to:** `src/app/api/preferences/route.ts`

```typescript
// Follow this structure:
export async function GET(request: Request) {
  // 1. Validate session
  // 2. Extract user ID
  // 3. Call service
  // 4. Return Response with proper status
}
```

#### 3. Form Components (shadcn/ui Pattern)

**Reference:** `src/components/forms/LoginForm.tsx`

**Apply to:** `PreferencesForm.tsx`

- Use `shadcn/ui` components (`Form`, `Select`, `Switch`)
- Use `zod` for validation schema
- Use `react-hook-form` `useForm` hook
- Handle loading, error, and success states consistently

### Anti-Patterns to Avoid

❌ **Don't mix database logic in API routes**
- ✅ **Do:** API route → Service → Repository → Database

❌ **Don't store sensitive data in client-side preferences**
- ✅ **Do:** Keep UI preferences only, auth tokens in httpOnly cookies

❌ **Don't fetch preferences on every page load**
- ✅ **Do:** Fetch once, store in context or React Query cache

---

## 🔧 Key Technical Decisions

> **Major decisions made, alternatives considered, rationale**

### Decision 1: Use JSONB for Extensible Settings

**Context:**
We need to store arbitrary key-value preferences that may evolve over time without schema migrations.

**Options Considered:**

**Option A: JSONB column**
- ✅ **Pros:** Flexible, no schema changes needed, queryable with PostgreSQL JSON operators
- ❌ **Cons:** Less type-safe, requires runtime validation

**Option B: Separate key-value table**
- ✅ **Pros:** More relational, easier to query individual settings
- ❌ **Cons:** More complex queries, overhead for many preferences

**Decision:** ✅ Option A (JSONB) chosen

**Rationale:**
- Preferences are always fetched together (no need for individual queries)
- Schema flexibility valuable for future extensibility
- PostgreSQL JSONB performance is excellent for our scale
- Zod validation provides type safety at application boundary

**Trade-offs Accepted:**
- Less database-level type enforcement
- Requires careful validation in application code

**Revisit Conditions:**
- If we need complex queries on individual preference values
- If JSONB size exceeds reasonable limits (>10KB per user)

---

### Decision 2: [Another Major Decision]

[Follow same pattern as above]

---

## ⚡ Performance Considerations

> **Performance requirements, optimizations, scalability concerns**

### Response Time Requirements

- **Target:** < 200ms for preference fetch (95th percentile)
- **Acceptable:** < 500ms for preference update
- **Measurement:** Monitor via application metrics

### Caching Strategy

**What to cache:**
- User preferences after first fetch (session lifetime)

**Cache implementation:**
- React Query cache on client side (5 min stale time)
- Optional: Redis cache for server-side rendering (if needed)

**Cache invalidation:**
- On PATCH `/api/preferences` success, invalidate React Query cache

### Database Performance

**Indexes:**
- `user_id` indexed for fast lookup (primary access pattern)

**Query optimization:**
- Use `SELECT` specific columns, not `SELECT *`
- Single query to fetch preferences (no N+1 issues)

### Scalability

**Current scale:** 1,000 users, low traffic
**Growth plan:** No special considerations needed until 100k+ users
**Bottleneck risk:** Minimal - simple CRUD operations

---

## 🔒 Security Considerations

> **Security requirements, potential vulnerabilities, mitigations**

### Authentication & Authorization

- ✅ All endpoints require valid JWT session
- ✅ Users can only read/update their own preferences
- ✅ Middleware validates user ID matches authenticated session

### Input Validation

- ✅ Zod schemas validate all API inputs
- ✅ Theme/language values validated against whitelist
- ✅ JSONB settings size limited to 10KB per user
- ✅ SQL injection prevented by Prisma parameterization

### Data Protection

- ✅ No PII stored in preferences (just UI settings)
- ✅ HTTPS required for all API calls
- ✅ No preferences data logged in application logs

### Potential Vulnerabilities

⚠️ **Vulnerability:** Uncontrolled JSONB size could enable DoS
- **Mitigation:** Enforce 10KB limit on `settings` field

⚠️ **Vulnerability:** Preference enumeration could leak user IDs
- **Mitigation:** Only allow access to own preferences, return 401 for invalid user

---

## 🧪 Testing Strategy (High-Level)

> **What types of tests are needed? (Details in VALIDATION_PLAN.md)**

### Unit Tests

- `PreferencesService.ts` - Business logic
- `PreferencesRepository.ts` - Database operations (mocked DB)
- Validation schemas - Edge cases and invalid inputs

### Integration Tests

- API routes `/api/preferences` - End-to-end request/response
- Database migrations - Schema changes apply cleanly
- Form submission flow - UI → API → Database

### Manual Testing

- UI responsiveness on theme changes
- Preference persistence across browser sessions
- Error handling for network failures

**Full test plan:** See `VALIDATION_PLAN.md`

---

## 🧭 Context-Engineering: Invariants vs. Variants

> **What technical decisions are locked vs. flexible?**

### Invariants (Core Technical Constraints)

These should NOT change without re-architecting:

- **Database:** PostgreSQL (existing infrastructure)
- **Authentication:** JWT sessions (existing auth system)
- **API style:** RESTful HTTP (project convention)
- **Architecture pattern:** Repository pattern (codebase standard)

**If these change, significant refactoring required.**

### Variants (Implementation Flexibility)

These can be adjusted during implementation:

- **Specific library versions** (can upgrade if needed)
- **JSONB structure** (extensible by design)
- **Cache duration** (can tune based on monitoring)
- **Specific UI component choices** (within shadcn/ui ecosystem)

**These are implementation details, not architectural commitments.**

---

## 🤖 Implementation Hints for AI

> **Guidance for AI assistants implementing this work**

### Critical Files to Review First

1. **`src/services/auth/AuthRepository.ts`**
   - Why: Reference for repository pattern
   - What to learn: Error handling, Prisma usage, transaction management

2. **`src/app/api/auth/route.ts`**
   - Why: Reference for API route pattern
   - What to learn: Session validation, response formatting, error handling

3. **`src/components/forms/LoginForm.tsx`**
   - Why: Reference for form pattern
   - What to learn: react-hook-form usage, zod validation, UI patterns

### Implementation Phases (Recommended Order)

**Phase 1: Data Layer**
1. Create database migration
2. Update Prisma schema
3. Create `types.ts` interfaces
4. Implement `PreferencesRepository.ts`
5. Write repository tests

**Phase 2: Service Layer**
6. Implement `PreferencesService.ts`
7. Write service tests

**Phase 3: API Layer**
8. Create API route handlers
9. Write API integration tests

**Phase 4: UI Layer**
10. Create form components
11. Implement state management
12. Wire up API mutations

**Phase 5: Integration**
13. Connect preferences to session initialization
14. Test end-to-end flow
15. Manual UI testing

### Common Pitfalls

❌ **Pitfall:** Forgetting to validate user owns the preferences being updated
- ✅ **Solution:** Always check `session.user.id === preferences.userId`

❌ **Pitfall:** Not handling missing preferences for new users
- ✅ **Solution:** Use `upsert` operation, create default preferences on first access

❌ **Pitfall:** Mutating preferences without updating `updated_at` timestamp
- ✅ **Solution:** Let Prisma handle `updatedAt` automatically with `@updatedAt` decorator

---

## 🔗 Dependencies & Coordination

### Internal Dependencies

- **Depends on:** None (standalone feature)
- **Blocks:** [Work ID] - User dashboard customization (needs preferences API)

### External Dependencies

- **Library Approval:** Need to add `zod` (if not already in project)
- **Database Access:** Need write permissions on `user_preferences` table
- **API Gateway:** May need rate limiting rules for preference endpoints

### Coordination Needed

- **With Backend Team:** None (solo developer)
- **With Frontend Team:** None (solo developer)
- **With DevOps:** Ensure database migration runs in deployment pipeline

---

## 📝 Stewardship & Maintenance

### Ownership

- **Technical Owner:** [Name] - Maintains this RFC and technical approach
- **Code Reviewers:** [Names] - Validate implementation follows RFC
- **Approvers:** [Names] - Must approve before implementation starts

### Review Cadence

- **During Planning:** Validate RFC before starting implementation
- **Mid-Implementation:** If major technical issues discovered, update RFC
- **Before Completion:** Ensure implementation matches RFC (or RFC updated to match reality)

### Update Triggers

Update this RFC when:
- ✏️ **Architecture changes** - Different pattern or approach needed
- ✏️ **Technology changes** - Library swap or framework change
- ✏️ **API design changes** - Endpoints added/modified
- ✏️ **Data model changes** - Schema adjustments

### Decay Signals

⚠️ **Review immediately if:**
- Implementation diverges significantly from RFC
- Performance issues arise (response times exceed targets)
- Security vulnerabilities discovered
- Scalability problems emerge

---

## 📌 Open Technical Questions

> **Unresolved technical decisions or research needed**

- [ ] **Q:** Should we use server-side rendering for settings page?
  - **Impact:** Performance vs simplicity trade-off
  - **Resolution Needed By:** Before Phase 4 (UI implementation)
  - **Who Decides:** Lead developer

- [ ] **Q:** Do we need real-time preference sync across tabs?
  - **Impact:** Adds complexity (WebSocket or polling)
  - **Resolution Needed By:** Before Phase 4
  - **Who Decides:** Product owner (based on user need)

---

## 🔄 Version History

| Version | Date | Author | Change Summary |
|---------|------|--------|----------------|
| 0.1 | YYYY-MM-DD | [Name] | Initial draft RFC |
| 1.0 | YYYY-MM-DD | [Name] | Approved for implementation |
| 1.1 | YYYY-MM-DD | [Name] | Updated API design based on [reason] |

---

## 📚 Cross-References

**Related Artifacts for This Work Item:**
- **Problem & Value:** See `PROBLEM_BRIEF.md` for WHY we're building this
- **Risks & Blockers:** See `RISK_REGISTER.md` for technical risks and constraints
- **Validation:** See `VALIDATION_PLAN.md` for comprehensive test strategy
- **Implementation:** See `IMPLEMENTATION_PLAN.md` for task breakdown
- **Progress:** See `SESSION_NOTES.md` for implementation updates

**External References:**
- **Repository Pattern:** [Link to internal wiki or example]
- **API Standards:** [Link to project API guidelines]
- **Security Guidelines:** [Link to security best practices]

---

**Part of:** CDD Modular Artifacts (TECHNICAL_RFC.md)
**Template Mode:** comprehensive
