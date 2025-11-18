# Technical RFC: User Notification Preferences

> **Voice:** Lead Engineer / Architect
> **Purpose:** Define HOW we'll build it technically
> **Artifact Version:** 1.2.0
> **Part of:** CDD v2.0 Case Study

---

**Work ID:** 0042
**Problem Brief:** See `PROBLEM_BRIEF.md` for context on WHAT and WHY

**Author:** Alex Chen (Lead Engineer)
**Created:** 2024-10-16
**Last Updated:** 2024-10-25
**Status:** implemented

---

## 🏗️ Architecture Overview

This feature adds a `NotificationPreferences` service that manages user-specific notification settings. It follows our existing repository pattern and integrates with the current notification sending system without requiring changes to that system.

**Key Design Decision:** Preferences are enforced at send-time (not stored in notification queue). When sending notification, we check user preferences first. This keeps the notification system decoupled.

### Architecture Diagram

```
┌────────────────┐
│ Settings UI    │
└───────┬────────┘
        │
        ▼
┌──────────────────────────┐
│ /api/preferences         │  ← New API routes
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ NotificationPreferences  │  ← New service
│ Service                  │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ PreferencesRepository    │  ← New repository
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────┐
│ Database (Postgres)      │
│ notification_preferences │  ← New table
└──────────────────────────┘

Integration point:
┌──────────────────────────┐
│ Existing Notification    │
│ Sending System           │
└───────────┬──────────────┘
            │ (checks preferences before send)
            ▼
┌──────────────────────────┐
│ NotificationPreferences  │
│ Service.canSend()        │
└──────────────────────────┘
```

---

## 🛠️ Technology Stack

### Core Technologies

- **Language:** TypeScript 5.2
- **Framework:** Next.js 14 (App Router)
- **Runtime:** Node.js 20

### Key Libraries/Dependencies

- **zod** ^3.22.0 - Schema validation for preference payloads
- **@prisma/client** ^5.5.0 - Database ORM
- **react-hook-form** ^7.48.0 - Form state management in UI
- **None new** - Uses existing stack

### Infrastructure

- **Database:** PostgreSQL 15 - Primary data store
- **Caching:** None needed initially (preferences cached client-side by React Query)

---

## 📁 File Structure

### Files to Create

```
src/
├── services/
│   └── notifications/
│       ├── NotificationPreferencesService.ts     # Business logic
│       ├── NotificationPreferencesRepository.ts  # DB access
│       └── types.ts                              # TypeScript types
│
├── app/
│   └── api/
│       └── preferences/
│           └── notifications/
│               └── route.ts                      # API endpoints
│
├── components/
│   └── settings/
│       ├── NotificationPreferencesForm.tsx       # Main UI
│       ├── PreferenceToggle.tsx                  # Reusable toggle
│       └── QuickActions.tsx                      # Quick unsubscribe
│
└── __tests__/
    └── services/
        └── notifications/
            ├── NotificationPreferencesService.test.ts
            └── NotificationPreferencesRepository.test.ts
```

### Files to Modify

- `prisma/schema.prisma` - Add `NotificationPreferences` model
- `src/services/notifications/NotificationSender.ts` - Check preferences before send
- `app/settings/page.tsx` - Add notification preferences section
- `types/notifications.ts` - Export new preference types

---

## 🗄️ Data Model

### Database Schema

**Table:** `notification_preferences`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `user_id` | UUID | FOREIGN KEY → users.id, NOT NULL, UNIQUE | One preference set per user |
| `email_system` | BOOLEAN | DEFAULT true | System alerts (critical) |
| `email_social` | BOOLEAN | DEFAULT true | Social notifications |
| `email_marketing` | BOOLEAN | DEFAULT false | Marketing emails |
| `email_product` | BOOLEAN | DEFAULT true | Product updates |
| `frequency` | VARCHAR(20) | DEFAULT 'realtime' | 'realtime' \| 'daily' \| 'weekly' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- `idx_notification_prefs_user_id` on `user_id` (frequent lookup by user)

**Constraints:**
- `user_id` UNIQUE - one preference set per user
- `frequency` CHECK - must be 'realtime', 'daily', or 'weekly'

**Migration File:** `20241016_add_notification_preferences.sql`

---

### TypeScript Interfaces

```typescript
// src/services/notifications/types.ts

export type NotificationType = 'system' | 'social' | 'marketing' | 'product';

export type NotificationFrequency = 'realtime' | 'daily' | 'weekly';

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailSystem: boolean;
  emailSocial: boolean;
  emailMarketing: boolean;
  emailProduct: boolean;
  frequency: NotificationFrequency;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferenceUpdate {
  emailSystem?: boolean;
  emailSocial?: boolean;
  emailMarketing?: boolean;
  emailProduct?: boolean;
  frequency?: NotificationFrequency;
}

export interface CanSendResult {
  canSend: boolean;
  reason?: string; // e.g., "User disabled marketing emails"
}
```

---

## 🌐 API Design

### GET `/api/preferences/notifications`

**Purpose:** Fetch current user's notification preferences

**Auth:** Required (JWT session)

**Request:**
```http
GET /api/preferences/notifications
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "emailSystem": true,
  "emailSocial": true,
  "emailMarketing": false,
  "emailProduct": true,
  "frequency": "realtime",
  "createdAt": "2024-10-16T10:00:00Z",
  "updatedAt": "2024-10-20T14:30:00Z"
}
```

**Response (404 Not Found):** User has no preferences yet (use defaults)
```json
{
  "error": "NotFound",
  "message": "No preferences found, using defaults"
}
```

**Errors:**
- `401 Unauthorized` - No valid session
- `500 Internal Server Error` - Database error

---

### PATCH `/api/preferences/notifications`

**Purpose:** Update notification preferences (partial update supported)

**Auth:** Required (JWT session)

**Request:**
```http
PATCH /api/preferences/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "emailMarketing": false,
  "emailSocial": false,
  "frequency": "daily"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "emailSystem": true,
  "emailSocial": false,
  "emailMarketing": false,
  "emailProduct": true,
  "frequency": "daily",
  "updatedAt": "2024-10-25T16:45:00Z"
}
```

**Validation Rules:**
- All email fields must be boolean
- `frequency` must be one of: 'realtime', 'daily', 'weekly'
- At least one email type must remain enabled (can't disable all)

**Errors:**
- `400 Bad Request` - Invalid payload (with validation details)
  ```json
  {
    "error": "ValidationError",
    "details": [
      { "field": "frequency", "message": "Must be realtime, daily, or weekly" }
    ]
  }
  ```
- `401 Unauthorized` - No valid session
- `422 Unprocessable Entity` - Can't disable all notification types
  ```json
  {
    "error": "InvalidOperation",
    "message": "At least one notification type must be enabled"
  }
  ```
- `500 Internal Server Error` - Database error

---

## 🎨 UI/UX Implementation

### Component Hierarchy

```
<NotificationPreferencesForm>
  ├── <PreferenceSection title="Email Notifications">
  │     ├── <PreferenceToggle label="System Alerts" field="emailSystem" />
  │     ├── <PreferenceToggle label="Social" field="emailSocial" />
  │     ├── <PreferenceToggle label="Marketing" field="emailMarketing" />
  │     └── <PreferenceToggle label="Product Updates" field="emailProduct" />
  │
  ├── <PreferenceSection title="Frequency">
  │     └── <FrequencySelector />
  │
  └── <QuickActions>
        └── <Button>Unsubscribe from Marketing</Button>
```

### State Management

**Approach:** React Query for server state + React Hook Form for form state

- **Initial Load:** `useQuery` fetches from `/api/preferences/notifications`
- **Form State:** `react-hook-form` manages local edits
- **Mutation:** `useMutation` PATCH to `/api/preferences/notifications`
- **Optimistic Update:** Update UI immediately, roll back on error
- **Validation:** Zod schema validates before submission

### User Interaction Flow

1. User navigates to Settings → Notifications
2. Component fetches current preferences (loading spinner shown)
3. Form populates with current values
4. User toggles "Marketing" OFF
5. Form marks field as dirty, enables Save button
6. User clicks "Save Preferences"
7. Mutation fired → optimistic update applied
8. API call succeeds → toast notification "Preferences saved!"
9. (If error) Roll back + show error toast

---

## 🧩 Implementation Patterns

### Pattern 1: Repository Pattern (Database Access)

**Reference:** `src/services/auth/AuthRepository.ts`

**Apply to:** `NotificationPreferencesRepository.ts`

```typescript
// Follow this structure:
class NotificationPreferencesRepository {
  async findByUserId(userId: string): Promise<NotificationPreferences | null> {
    return await prisma.notificationPreferences.findUnique({
      where: { userId }
    });
  }

  async upsert(
    userId: string,
    data: NotificationPreferenceUpdate
  ): Promise<NotificationPreferences> {
    return await prisma.notificationPreferences.upsert({
      where: { userId },
      update: { ...data, updatedAt: new Date() },
      create: { userId, ...this.getDefaults(), ...data }
    });
  }

  private getDefaults(): NotificationPreferences {
    return {
      emailSystem: true,
      emailSocial: true,
      emailMarketing: false, // Default OFF for new users
      emailProduct: true,
      frequency: 'realtime'
    };
  }
}
```

---

### Pattern 2: API Route Handlers (Next.js Pattern)

**Reference:** `src/app/api/auth/route.ts`

**Apply to:** `src/app/api/preferences/notifications/route.ts`

```typescript
export async function GET(request: Request) {
  // 1. Validate session
  const session = await getSession(request);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Call service
  const preferences = await notificationPreferencesService.get(session.userId);

  // 3. Return response
  return Response.json(preferences, { status: 200 });
}

export async function PATCH(request: Request) {
  const session = await getSession(request);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Validate with Zod
  const validation = preferencesUpdateSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { error: 'ValidationError', details: validation.error.issues },
      { status: 400 }
    );
  }

  const updated = await notificationPreferencesService.update(
    session.userId,
    validation.data
  );

  return Response.json(updated, { status: 200 });
}
```

---

### Pattern 3: Form Components (shadcn/ui + react-hook-form)

**Reference:** `src/components/forms/LoginForm.tsx`

**Apply to:** `NotificationPreferencesForm.tsx`

- Use `shadcn/ui` components (`Form`, `Switch`, `Button`)
- Use `zod` for validation schema
- Use `react-hook-form` `useForm` hook
- Handle loading, error, and success states consistently

---

## 🔧 Key Technical Decisions

### Decision 1: Check Preferences at Send-Time (Not Queue-Time)

**Context:**
Existing notification system queues notifications, then sends via worker. Where should we check user preferences?

**Options Considered:**

**Option A: Check at queue-time** (before adding to queue)
- ✅ **Pros:** Cleaner separation, queue only has sendable notifications
- ❌ **Cons:** Hard to implement (queue system doesn't have user context), requires refactoring notification system

**Option B: Check at send-time** (in worker before sending)
- ✅ **Pros:** Minimal changes to existing system, preferences service decoupled
- ❌ **Cons:** Queue may have notifications that won't be sent (waste)

**Decision:** ✅ Option B (send-time) chosen

**Rationale:**
- Existing notification system is stable, don't want to refactor
- Preference checks are fast (indexed DB query)
- Queue "waste" is negligible (notifications are small)
- Easier to add preference checking to existing worker

**Trade-offs Accepted:**
- Queue contains notifications that won't be sent (but they're filtered out before actual send)
- Slight inefficiency (but not performance-critical)

**Revisit Conditions:**
- If queue grows significantly (>100k/day), reconsider for efficiency
- If refactoring notification system anyway, integrate at queue-time

---

### Decision 2: Use Boolean Columns (Not JSONB)

**Context:**
How to store preferences in database?

**Options:**

**Option A: JSONB column**
- ✅ **Pros:** Flexible, easy to add new preference types
- ❌ **Cons:** Harder to query, less type-safe, no database validation

**Option B: Boolean columns** (emailSystem, emailSocial, etc.)
- ✅ **Pros:** Type-safe, queryable, database-level validation
- ❌ **Cons:** Schema change needed for new preference types

**Decision:** ✅ Option B (boolean columns) chosen

**Rationale:**
- We have only 4 notification types currently (well-defined)
- Type safety valuable (prevents errors)
- Easy to query (e.g., "how many users disabled marketing?")
- Adding new types is rare (acceptable schema migration cost)

**Trade-offs Accepted:**
- Less flexible (adding new type = migration)
- More columns in table

**Revisit Conditions:**
- If we add >10 notification types, reconsider JSONB
- If we need dynamic preference types from plugins/extensions

---

## ⚡ Performance Considerations

### Response Time Requirements

- **Target:** < 200ms for GET `/api/preferences/notifications` (p95)
- **Target:** < 300ms for PATCH `/api/preferences/notifications` (p95)
- **Measurement:** Application metrics / APM

### Caching Strategy

**What to cache:**
- User preferences after first fetch (React Query cache, 5 min stale time)

**Cache implementation:**
- React Query on client side only (no server-side cache needed)

**Cache invalidation:**
- On PATCH success, React Query invalidates and refetches

### Database Performance

**Indexes:**
- `user_id` indexed (PRIMARY lookup pattern)

**Query optimization:**
- Single query to fetch by user_id (no N+1 issues)
- Upsert used for create/update (avoids SELECT then INSERT/UPDATE)

**Expected Load:**
- Read-heavy (90% reads, 10% writes)
- ~1000 requests/hour initially

**Scalability:**
- No special considerations until >100k users
- If needed: Add Redis cache for preferences

---

## 🔒 Security Considerations

### Authentication & Authorization

- ✅ All endpoints require valid JWT session
- ✅ Users can only read/update their own preferences
- ✅ Middleware validates `session.userId === preferences.userId`

### Input Validation

- ✅ Zod schemas validate all API inputs
- ✅ Boolean fields validated (must be true/false)
- ✅ Frequency validated against whitelist
- ✅ SQL injection prevented by Prisma parameterization

### Data Protection

- ✅ Preferences not sensitive (notification settings, not PII)
- ✅ HTTPS required for all API calls
- ✅ Preferences included in GDPR data export
- ✅ Preferences deleted when user deletes account (CASCADE)

### Potential Vulnerabilities

⚠️ **Vulnerability:** User disables all notifications, can't receive critical system alerts
- **Mitigation:** Enforce at least one type enabled (validation rule)

⚠️ **Vulnerability:** Preference enumeration (guess user IDs, read preferences)
- **Mitigation:** Session validation ensures user can only access own preferences

---

## 🧪 Testing Strategy (High-Level)

> **Details in VALIDATION_PLAN.md**

### Unit Tests

- `NotificationPreferencesService` - Business logic (get, update, canSend)
- `NotificationPreferencesRepository` - Database operations (mocked DB)
- Validation schemas - Edge cases and invalid inputs

### Integration Tests

- API routes `/api/preferences/notifications` - GET, PATCH end-to-end
- Database migrations - Schema changes apply cleanly
- Preference checking integration - NotificationSender uses preferences

### E2E Tests

- User updates preferences via UI and verifies persistence
- User disables marketing, confirms no marketing emails sent (mocked)
- Quick unsubscribe flow works end-to-end

---

## 🧭 Context-Engineering: Invariants vs. Variants

### Invariants (Core Technical Constraints)

These should NOT change without re-architecting:

- **Database:** PostgreSQL (existing infrastructure)
- **API Style:** RESTful Next.js route handlers (project standard)
- **Architecture:** Repository pattern (codebase convention)
- **Validation:** Zod schemas (team standard)

**If these change, significant refactoring required.**

### Variants (Implementation Flexibility)

These can be adjusted during implementation:

- **Specific table columns** (can add columns if needed)
- **API response format** (can add fields without breaking)
- **UI component structure** (can refactor without affecting API)
- **Cache duration** (can tune based on usage patterns)

**These are implementation details, not architectural commitments.**

---

## 🤖 Implementation Hints for AI

### Critical Files to Review First

1. **`src/services/auth/AuthRepository.ts`**
   - Why: Reference for repository pattern
   - What to learn: Error handling, Prisma usage

2. **`src/app/api/auth/route.ts`**
   - Why: Reference for API route pattern
   - What to learn: Session validation, response formatting

3. **`src/services/notifications/NotificationSender.ts`**
   - Why: Integration point for preference checking
   - What to learn: How notifications are currently sent

### Implementation Order (Recommended)

**Phase 1: Data Layer**
1. Create database migration
2. Update Prisma schema
3. Generate Prisma types
4. Create `types.ts` interfaces
5. Implement `PreferencesRepository.ts`
6. Write repository tests

**Phase 2: Service Layer**
7. Implement `NotificationPreferencesService.ts`
8. Write service tests

**Phase 3: API Layer**
9. Create API route handlers
10. Write API integration tests

**Phase 4: Integration**
11. Add preference check to `NotificationSender.ts`
12. Test integrated flow

**Phase 5: UI Layer**
13. Create form components
14. Wire up API mutations
15. Manual UI testing

### Common Pitfalls

❌ **Pitfall:** Forgetting to validate session owns the preferences
- ✅ **Solution:** Always check `session.userId === preferences.userId`

❌ **Pitfall:** Not handling "no preferences yet" case (404)
- ✅ **Solution:** Use defaults from repository, or auto-create on first access

❌ **Pitfall:** Allowing user to disable all notification types
- ✅ **Solution:** Add validation rule: at least one must be enabled

---

## 🔗 Dependencies & Coordination

### Internal Dependencies

None - standalone feature

### External Dependencies

None - uses existing infrastructure

### Coordination Needed

- **With Backend Team:** None (solo developer)
- **With Frontend Team:** None (solo developer)
- **With DevOps:** Database migration needs staging/prod deployment

---

## 📝 Stewardship & Maintenance

### Ownership

- **Technical Owner:** Alex Chen - Maintains RFC and technical approach
- **Code Reviewers:** Senior engineers - Validate implementation follows RFC
- **Approvers:** Tech Lead - Must approve before implementation starts

### Review Cadence

- **During Planning:** Validate RFC before starting implementation
- **Mid-Implementation:** If architectural issues arise, update RFC
- **Before Completion:** Ensure implementation matches RFC

### Update Triggers

Update this RFC when:
- ✏️ **Architecture changes** - Different pattern needed
- ✏️ **API design changes** - Endpoints added/modified
- ✏️ **Data model changes** - Schema adjustments
- ✏️ **Performance issues** - Approach needs rethinking

---

## 📌 Open Technical Questions

None remaining - all resolved during planning.

---

## 🔄 Version History

| Version | Date | Author | Change Summary |
|---------|------|--------|----------------|
| 1.0.0 | 2024-10-16 | Alex Chen | Initial technical RFC |
| 1.1.0 | 2024-10-20 | Alex Chen | Added Decision 1 (send-time checking) after team discussion |
| 1.2.0 | 2024-10-25 | Alex Chen | Finalized API design, added validation rules |

---

## 📚 Cross-References

**Related Artifacts for This Work Item:**
- **Problem & Value:** See `PROBLEM_BRIEF.md` for WHY we're building this
- **Risks & Blockers:** See `RISK_REGISTER.md` for GDPR and technical risks
- **Validation:** See `VALIDATION_PLAN.md` for comprehensive test strategy
- **Implementation:** See `IMPLEMENTATION_PLAN.md` for task breakdown

**External References:**
- Repository Pattern: [Internal wiki - /docs/patterns/repository](internal)
- API Standards: [Internal wiki - /docs/api-guidelines](internal)

---

**Template Version:** 1.0
**Created:** 2024-10-30
**Part of:** CDD v2.0 Case Study - User Notification Preferences
**Author:** CDD v2.0 Methodology Team
