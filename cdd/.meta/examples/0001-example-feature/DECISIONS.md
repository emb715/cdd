---
id: 0001
title: User Profile Page
type: feature
status: complete
priority: high
created: 2024-01-15
updated: 2024-01-20
author: Demo User
tags: "user, profile, ui"

# Context for AI Implementation
context_files:
  primary:
    - src/components/UserCard.tsx - Existing user component pattern
    - src/app/dashboard/page.tsx - Page structure example
  reference:
    - src/lib/api/users.ts - API patterns
    - docs/design-system.md - UI guidelines

dependencies:
  internal:
    - User authentication must be complete
  external: []

patterns_to_follow:
  - "Follow shadcn/ui component patterns"
  - "Use React Server Components for data fetching"
  - "Match routing pattern in app/ directory"

files_to_create:
  - src/app/profile/page.tsx
  - src/components/profile/ProfileForm.tsx
  - src/components/profile/ProfileHeader.tsx

files_to_modify:
  - src/components/nav/Navbar.tsx
  - src/lib/api/users.ts
---

# User Profile Page

## Problem
Users currently have no way to view or edit their profile information. After authentication, they need a dedicated profile page to manage their account details.

## Solution
Create a user profile page that displays user information and allows editing of profile details with a clean, intuitive interface.

## Goals
- Enable users to view their profile information
- Allow users to update their profile (name, email, bio, avatar)
- Provide immediate feedback on save success/failure
- Ensure consistent UI with rest of application

## User Stories

**As a logged-in user**
**I want to** view and edit my profile information
**So that** I can keep my account details up-to-date

**Acceptance Criteria:**
- [ ] Profile page accessible from navigation
- [ ] Displays current user information
- [ ] Form allows editing name, email, bio, and avatar
- [ ] Save button with loading state
- [ ] Success/error messages displayed
- [ ] Changes persisted to database

## Functional Requirements

**FR-1:** Display user profile information
- Details: Show name, email, bio, avatar, join date
- Validation: All fields display correctly for existing users

**FR-2:** Enable profile editing
- Details: Form with editable fields for name, email, bio
- Validation: Form validation matches user schema

**FR-3:** Avatar upload functionality
- Details: Allow image upload, preview, crop
- Validation: Accepts common image formats, max 2MB

**FR-4:** Save profile changes
- Details: Save button triggers API call, shows loading state
- Validation: Success/error feedback displayed

**FR-5:** Form validation
- Details: Client-side validation for all fields
- Validation: Errors shown inline, prevents invalid submissions

## Non-Goals (Out of Scope)
- Password change (separate feature)
- Account deletion (separate feature)
- Privacy settings (future feature)
- Profile visibility controls (v2)

## Design Considerations

### UI/UX Requirements
- Clean, modern profile page layout
- Mobile-responsive design
- Inline form validation
- Accessible form labels and error messages

### Design References
- Follow existing dashboard page layout
- Use shadcn/ui form components
- Match color scheme and typography

### User Experience Flow
1. User clicks "Profile" in navigation
2. Page loads with current profile data
3. User edits fields in form
4. User clicks "Save" button
5. Loading state shown
6. Success message displayed, form updated

## Technical Considerations

### Technology Stack
- **Framework:** Next.js 14 (App Router)
- **UI:** shadcn/ui components
- **Forms:** react-hook-form + zod
- **Styling:** Tailwind CSS

### Architecture
- Server Component for initial data fetch
- Client Component for interactive form
- API route for profile updates
- Optimistic updates for better UX

### Data Model
- User table fields: name, email, bio, avatarUrl
- Validation schema matches database constraints

### API Design
- GET /api/user/profile - Fetch profile
- PATCH /api/user/profile - Update profile
- POST /api/user/avatar - Upload avatar

### Security Considerations
- Authenticated routes only
- CSRF protection on forms
- Input sanitization
- Image upload validation (type, size)

### Performance Requirements
- Initial page load < 1 second
- Form submission < 500ms
- Image upload with progress indicator

## Technical Decisions

### Decision: Use React Hook Form + Zod

**Context:**
Need form state management and validation solution.

**Options Considered:**

**Option A:** react-hook-form + zod
- **Pros:**
  - Excellent TypeScript support
  - Built-in validation
  - Small bundle size
  - Great DX
- **Cons:**
  - Learning curve for zod schemas

**Option B:** Formik
- **Pros:**
  - Popular, well-documented
  - Simple API
- **Cons:**
  - Larger bundle size
  - Less type-safe

**Decision:** react-hook-form + zod

**Rationale:** Better TypeScript integration, smaller bundle, and already used elsewhere in the project.

**Trade-offs:** Slightly more setup code, but better long-term maintainability.

**Revisit Conditions:** If bundle size becomes a concern, consider Formik.

---

### Decision: Server Components for Data Fetching

**Context:**
How to fetch initial profile data.

**Options Considered:**

**Option A:** Server Component with async/await
- **Pros:**
  - No client JS for data fetching
  - Better SEO
  - Simpler code
- **Cons:**
  - Requires understanding of RSC

**Option B:** Client Component with useEffect
- **Pros:**
  - Familiar pattern
  - More control
- **Cons:**
  - Waterfall requests
  - Larger client bundle
  - Loading states needed

**Decision:** Server Component

**Rationale:** Aligns with Next.js 14 best practices, reduces client bundle, better performance.

**Trade-offs:** Need separate Client Component for form, but this is minimal.

## Implementation Hints for AI

### Patterns to Follow
- **Form Pattern:** Use form structure from `src/components/forms/LoginForm.tsx`
  - Example: react-hook-form setup, zod schemas, shadcn/ui form components
- **Page Pattern:** Follow layout from `src/app/dashboard/page.tsx`
  - Example: Server Component wrapper, Client Component for interactivity

### Key Files to Reference
- `src/components/UserCard.tsx` - See how user data is displayed
- `src/app/dashboard/page.tsx` - Page structure with Server/Client split
- `src/lib/api/users.ts` - API call patterns
- `src/components/ui/form.tsx` - shadcn/ui form components

### Suggested Implementation Approach
1. **Phase 1:** Create page structure with Server Component
   - Fetch user data server-side
   - Pass to Client Component
2. **Phase 2:** Build ProfileForm Client Component
   - Set up react-hook-form + zod
   - Implement form fields
3. **Phase 3:** Add avatar upload
   - File input component
   - Preview functionality
4. **Phase 4:** Wire up API calls
   - Profile update mutation
   - Optimistic updates
5. **Phase 5:** Polish UX
   - Loading states
   - Error handling
   - Success feedback

### Common Pitfalls to Avoid
- ❌ **Don't** forget to handle edge cases (no avatar, partial data)
  - ✅ **Instead:** Provide fallbacks for all optional fields
- ❌ **Don't** skip email validation on client and server
  - ✅ **Instead:** Validate in zod schema AND API route
- ❌ **Don't** forget accessibility (labels, ARIA, keyboard nav)
  - ✅ **Instead:** Use shadcn/ui components (already accessible)
- ❌ **Don't** block UI while uploading large images
  - ✅ **Instead:** Show progress indicator, allow cancellation

### Edge Cases to Handle
- User with no avatar (show default)
- Email already taken by another user
- Network error during save
- Invalid image format/size
- Concurrent edits (last write wins)

## Success Metrics

### User-Facing Metrics
- Profile page loads in < 1 second
- Profile update success rate > 95%
- User completes profile in < 2 minutes

### Technical Metrics
- Form validation prevents 100% of invalid submissions
- Image uploads complete in < 3 seconds (avg)
- Zero console errors or warnings

### Definition of Done
- [X] All functional requirements implemented
- [X] Unit tests written and passing
- [X] Integration tests written and passing
- [X] Documentation updated
- [X] Code reviewed and approved
- [X] Deployed to staging
- [X] QA testing complete
- [X] Deployed to production
- [X] Success metrics validated

## Testing Requirements

### Unit Tests
- [ ] ProfileForm validation logic
- [ ] Avatar upload handling
- [ ] Form submission logic

### Integration Tests
- [ ] Full profile update flow
- [ ] Image upload and crop
- [ ] Error handling scenarios

### End-to-End Tests
- [ ] User navigates to profile page
- [ ] User edits and saves profile
- [ ] Changes persist after page reload

### Manual Testing
- [ ] Test on mobile devices
- [ ] Test with screen reader
- [ ] Test slow network conditions
- [ ] Test various image formats

## Open Questions
- [ ] Should we allow SVG avatars? (Security concern)
- [ ] Max bio character length? (Propose: 500)
- [ ] Email change confirmation flow? (Defer to v2)

## Related Work
### Dependencies
- Depends on: User authentication system

### Related Work Items
- Related to: 0002-account-settings (future)
- Follow-up: 0005-privacy-settings (future)

### External Resources
- [shadcn/ui Form Docs](https://ui.shadcn.com/docs/components/form)
- [Next.js App Router Docs](https://nextjs.org/docs/app)

## Timeline & Milestones

**Estimated Effort:** 12-16 hours

**Key Milestones:**
1. Page structure complete - Day 1
2. Form working with validation - Day 2
3. Avatar upload functional - Day 3
4. Testing and polish complete - Day 4

**Target Completion:** 2024-01-20

---

**Created:** 2024-01-15
**Last Updated:** 2024-01-20
**Status:** draft → in-progress → complete
