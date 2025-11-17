---
version: 1.0
description: Generate a detailed implementation plan from a work item's DECISIONS.md
author: EMB (Ezequiel M. Benitez) @emb715
---

# Generate Implementation Plan for Work Item

You are tasked with creating a comprehensive, step-by-step implementation plan based on an existing work item's DECISIONS.md file. This plan will guide implementation and leverages AI-optimized metadata.

## Critical Rules - READ FIRST

1. **DO NOT** start implementing code
2. **MUST** analyze the specified work item's DECISIONS.md first
3. **MUST** leverage context files, patterns, and dependencies from frontmatter
4. **MUST** assess the current codebase state before generating tasks
5. **MUST** generate parent tasks first, then WAIT for user confirmation
6. **ONLY** generate sub-tasks after user responds with "Go"
7. Save the implementation plan to `IMPLEMENTATION_PLAN.md` in the work item folder

## Process

### Step 1: Receive Work Item Reference

The user has specified a work item using one of these formats:
- Work ID: `/plan-work 0001`
- Folder path: `/plan-work cdd/0001-user-auth`
- Fuzzy name: `/plan-work user auth`
- No parameter: `/plan-work` (auto-detect from recent conversation)

### Step 2: Locate Work Item

**Find the work item folder using flexible matching:**

1. **If work ID provided (e.g., "0001"):**
   - Search in `cdd/XXXX-*/`
   - Search in `cdd/bugs/XXXX-*/`
   - Search in `cdd/refactor/XXXX-*/`
   - Search in `cdd/spikes/XXXX-*/`
   - Search in `cdd/epics/XXXX-*/`

2. **If folder path provided:**
   - Use path directly

3. **If fuzzy name provided (e.g., "user auth"):**
   - Search for folders containing the keywords
   - Offer choices if multiple matches found

4. **If no parameter:**
   - Check conversation context for recently discussed work items
   - Ask user to specify if not found

**Example matching:**
- User: `/plan-work auth`
- Found: `cdd/0001-user-authentication-system/`
- Confirm: "Found work item 0001-user-authentication-system. Proceed? (y/n)"

### Step 3: Analyze DECISIONS.md

Read and thoroughly analyze `DECISIONS.md`, paying special attention to:

**YAML Frontmatter (Critical Metadata):**
- `id`, `type`, `status`, `priority` - For context and urgency
- `context_files.primary` - **Critical files** to review before planning
- `context_files.reference` - Supporting files for patterns/examples
- `dependencies.internal` - What must be done first
- `dependencies.external` - External blockers or requirements
- `patterns_to_follow` - **Specific code patterns** to match
- `files_to_create` - Estimated new files
- `files_to_modify` - Files that need changes
- `tags` - Domain/category information

**Document Body:**
- Functional requirements (FR-1, FR-2, etc.)
- User stories and acceptance criteria
- Technical considerations and decisions
- Design considerations
- Implementation hints for AI
- Success metrics and testing requirements

### Step 4: Assess Current Codebase

**Priority 1: Review Context Files from DECISIONS.md**

1. **Read all `context_files.primary`**
   - These are the critical files identified in DECISIONS.md
   - Understand patterns, architecture, conventions

2. **Review `context_files.reference`**
   - These show patterns to follow
   - Learn from existing implementations

3. **Understand `patterns_to_follow`**
   - Note the specific patterns the work requires
   - Find examples in codebase

4. **Review `files_to_modify`**
   - Understand these files before creating tasks
   - Note current state and what needs to change

**Priority 2: Assess Broader Context**

**Architecture & Patterns:**
- What architectural patterns are being used?
- What are the naming conventions?
- How are files organized?
- What testing framework is in place?

**Existing Infrastructure:**
- What libraries/frameworks are in use?
- Existing auth, routing, state management?
- What styling approach is used?
- What API patterns exist?

**Relevant Existing Code:**
- Similar features or components already implemented?
- Existing utilities, helpers, services to leverage?
- Where should new files be placed?

**Example Context Assessment:**

```
📊 Codebase Analysis for Work 0001 (User Authentication):

Context Files Reviewed:
✓ src/app/api/route.ts - Existing API patterns
✓ src/components/forms/LoginForm.tsx - Form patterns
✓ lib/database/schema.ts - Database patterns

Tech Stack Detected:
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- shadcn/ui components
- Tailwind CSS

Patterns to Follow:
- API routes use Next.js route handlers
- Forms use react-hook-form + zod
- Database uses Prisma Client
- UI follows shadcn/ui patterns

Recommendation: Use next-auth for authentication (native Next.js support)
```

### Step 5: Phase 1 - Generate Parent Tasks

Based on DECISIONS.md analysis and codebase assessment, create high-level parent tasks.

**Guidelines for Parent Tasks:**

- Typically 4-8 high-level tasks (use judgment based on complexity)
- Each represents a major phase or component
- Should flow logically (setup → core → UI → integration → testing)
- Use decimal numbering: 1.0, 2.0, 3.0, etc.
- Reference work type from DECISIONS.md

**Example Parent Task Structure:**

```markdown
## Implementation Tasks

### Phase 1: Setup & Configuration
**Goal:** Prepare environment and dependencies

#### 1.0 Project Setup

### Phase 2: Core Implementation
**Goal:** Build the main functionality

#### 2.0 Data Models & Schema
#### 2.1 Business Logic
#### 2.2 API Layer

### Phase 3: User Interface
**Goal:** Build UI components and user experience

#### 3.0 UI Components
#### 3.1 State Management
#### 3.2 User Interactions

### Phase 4: Integration & Error Handling
**Goal:** Connect components and handle edge cases

#### 4.0 Integration
#### 4.1 Error Handling
#### 4.2 Edge Cases

### Phase 5: Testing & Quality Assurance
**Goal:** Ensure quality and reliability

#### 5.0 Unit Tests
#### 5.1 Integration Tests
#### 5.2 Manual Testing

### Phase 6: Documentation & Deployment
**Goal:** Document and deploy

#### 6.0 Documentation
#### 6.1 Code Review
#### 6.2 Deployment
```

**After generating parent tasks, STOP and inform the user:**

```
📋 Implementation Plan - Parent Tasks Generated

I've generated the high-level implementation phases for:
**Work 0001:** User Authentication System

## Parent Tasks:
1.0 Project Setup (X tasks estimated)
2.0 Data Models & Schema (X tasks estimated)
3.0 Business Logic (X tasks estimated)
4.0 API Layer (X tasks estimated)
5.0 UI Components (X tasks estimated)
6.0 Integration & Testing (X tasks estimated)

This plan follows patterns from:
- src/app/api/route.ts (API patterns)
- src/components/forms/ (Form patterns)
- lib/database/schema.ts (Database patterns)

Ready to generate detailed sub-tasks?
Type "Go" to proceed, or provide feedback to adjust the plan.
```

### Step 6: Wait for Confirmation

**PAUSE HERE.** Do not proceed until the user responds with:
- "Go" or "yes" or "proceed"
- If user provides feedback, adjust parent tasks and ask again

### Step 7: Phase 2 - Generate Sub-Tasks

Once confirmed, break down each parent task into actionable sub-tasks.

**Guidelines for Sub-Tasks:**

- Each sub-task is specific and actionable
- Use decimal numbering: 1.1, 1.2, 2.1, 2.2, etc.
- Include relevant technical details:
  - Specific file paths
  - Function/component names
  - Patterns to follow (with file references)
- Consider implementation order (dependencies)
- Should be completable in reasonable timeframe (< 2 hours each)
- Reference patterns from codebase

**Example Sub-Tasks:**

```markdown
### Phase 1: Setup & Configuration

#### 1.0 Project Setup

- **1.1** Install and configure next-auth package
  - File(s): `package.json`, `next.config.js`
  - Command: `npm install next-auth`
  - Pattern: Follow package installation in existing package.json

- **1.2** Create authentication configuration file
  - File(s): `lib/auth/config.ts`
  - Pattern: Follow config pattern in `lib/database/config.ts`
  - Notes: Set up OAuth providers (Google), credentials provider

- **1.3** Set up environment variables
  - File(s): `.env.local`, `.env.example`
  - Variables: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - Pattern: Follow env variable structure in existing .env files

#### 1.1 Database Schema

- **1.1.1** Create User model in Prisma schema
  - File(s): `prisma/schema.prisma`
  - Pattern: Follow User model example in `context_files.primary`
  - Fields: id, email, name, password (hashed), createdAt, updatedAt

- **1.1.2** Create database migration
  - Command: `npx prisma migrate dev --name add_user_model`
  - Pattern: Follow migration naming in existing migrations/
  - Validation: Check migration file generated correctly

- **1.1.3** Generate Prisma Client types
  - Command: `npx prisma generate`
  - Validation: Types available in `@prisma/client`
```

**Sub-Task Quality Checklist:**
- ✅ Clear and specific action
- ✅ Mentions relevant file paths
- ✅ References existing patterns with specific file/line refs
- ✅ Logically ordered within parent task
- ✅ Includes validation steps where applicable
- ✅ Suitable for junior developer to understand

### Step 8: Identify Relevant Files

Based on tasks and DECISIONS.md, create comprehensive file list:

**Format:**

```markdown
## Files to Work With

### Files to Create (from DECISIONS.md + analysis)
- `lib/auth/config.ts` - NextAuth configuration
- `lib/auth/providers.ts` - OAuth and credentials providers
- `lib/auth/session.ts` - Session management utilities
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `components/auth/LoginForm.tsx` - Login form component
- `components/auth/RegisterForm.tsx` - Registration form component
- `__tests__/auth/config.test.ts` - Unit tests for auth config
- `__tests__/auth/session.test.ts` - Unit tests for session utils

### Files to Modify (from DECISIONS.md + analysis)
- `prisma/schema.prisma` - Add User model
- `lib/database/client.ts` - Export user-related queries
- `app/layout.tsx` - Add session provider
- `middleware.ts` - Add route protection
- `components/nav/Navbar.tsx` - Add login/logout buttons
```

### Step 9: Add Implementation Notes

Include helpful context for implementation:

```markdown
## Notes for Implementation

### Important Reminders
- All passwords must be hashed using bcrypt (min 10 rounds)
- Session cookies should be httpOnly and secure
- Protected routes require middleware check
- Forms must include CSRF protection

### Helpful Commands
\`\`\`bash
# Run development server
npm run dev

# Run tests
npm test

# Run tests for specific file
npm test __tests__/auth/config.test.ts

# Create database migration
npx prisma migrate dev --name migration_name

# Generate Prisma types
npx prisma generate
\`\`\`

### Key Patterns to Follow
- **API Routes:** Follow pattern in `src/app/api/route.ts`
  - Use Next.js route handlers (not pages API)
  - Return Response objects with proper status codes

- **Forms:** Follow pattern in `src/components/forms/LoginForm.tsx`
  - Use react-hook-form for form state
  - Use zod for validation schemas
  - Use shadcn/ui form components

- **Database:** Follow pattern in `lib/database/schema.ts`
  - Use Prisma Client for all queries
  - Use transactions for multi-step operations
  - Handle database errors gracefully

### Common Pitfalls to Avoid
- ❌ Don't store passwords in plain text (always hash)
- ❌ Don't expose sensitive data in client components
- ❌ Don't skip input validation on API routes
- ❌ Don't forget to update .env.example with new variables

### Testing Strategy
- Unit test all auth utilities and helpers
- Integration test full auth flow (register → login → protected route)
- Manual test OAuth flow with real Google account
- Test error scenarios (wrong password, expired session, etc.)
```

### Step 10: Generate Final IMPLEMENTATION_PLAN.md

Combine everything into the complete document structure:

```markdown
# Implementation Plan: [Work Title]

> **Work ID:** XXXX
> **Generated from:** DECISIONS.md
> **Generated on:** YYYY-MM-DD HH:MM
> **Status:** Not Started

---

## Context from DECISIONS.md

### Patterns to Follow
[From DECISIONS.md frontmatter]

### Dependencies
[From DECISIONS.md frontmatter]

### Context Files to Review
[From DECISIONS.md frontmatter]

---

## Files to Work With

### Files to Create
[Generated list]

### Files to Modify
[Generated list]

---

## Implementation Tasks

[All parent tasks with sub-tasks]

---

## Task Summary

**Total Tasks:** XX
**Estimated Effort:** XX hours

### By Phase
[Breakdown]

---

## Progress Tracking

[Checklist of phases]

---

## Notes for Implementation

[Implementation notes, commands, patterns, pitfalls]

---

**Generated:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
```

### Step 11: Save Implementation Plan

Save to: `cdd/XXXX-work-name/IMPLEMENTATION_PLAN.md`

**Validation:**
- ✅ Work item folder exists
- ✅ DECISIONS.md exists and was analyzed
- ✅ IMPLEMENTATION_PLAN.md created successfully
- ✅ All sections populated with relevant content

### Step 12: Confirm and Summarize

After saving, provide clear confirmation:

```
✅ Implementation plan generated successfully!

📁 Location: cdd/0001-user-authentication-system/IMPLEMENTATION_PLAN.md
📊 Total Tasks: 45 sub-tasks across 6 phases
⏱️  Estimated Effort: ~18 hours
🎯 Next: Ready to start implementation!

## Quick Stats:
- Phase 1 (Setup): 8 tasks (~2 hours)
- Phase 2 (Core): 12 tasks (~5 hours)
- Phase 3 (UI): 10 tasks (~4 hours)
- Phase 4 (Integration): 6 tasks (~3 hours)
- Phase 5 (Testing): 7 tasks (~3 hours)
- Phase 6 (Deployment): 2 tasks (~1 hour)

## Key Patterns Referenced:
✓ API routes from src/app/api/route.ts
✓ Forms from src/components/forms/
✓ Database from lib/database/schema.ts

🎯 Ready to Start?
1. Review IMPLEMENTATION_PLAN.md
2. Start with Phase 1, Task 1.1
3. Use `/save-session 0001` after each session
4. Track progress in IMPLEMENTATION_PLAN.md

💡 Pro Tip: Focus on one phase at a time, test as you go!
```

## Examples

### Example 1: Plan by Work ID

**User:** `/plan-work 0001`

**AI:**
```
🔍 Found work item: 0001-user-authentication-system

📖 Analyzing DECISIONS.md...
✓ Read requirements (8 functional requirements)
✓ Reviewed context files (3 primary, 2 reference)
✓ Identified patterns to follow
✓ Assessed codebase (Next.js 14, Prisma, shadcn/ui)

[Generates parent tasks]
[Waits for "Go"]
[User confirms]
[Generates sub-tasks]
[Saves IMPLEMENTATION_PLAN.md]
[Confirms completion]
```

### Example 2: Plan by Fuzzy Name

**User:** `/plan-work auth`

**AI:**
```
🔍 Searching for work items matching "auth"...

Found 2 matches:
1. 0001-user-authentication-system (Feature, In Progress)
2. bugs/0003-auth-token-expiry (Bug, Draft)

Which would you like to plan? (1 or 2)
```

**User:** `1`

**AI:** [Proceeds with planning 0001]

## Special Handling

### No Work Item Specified

If user runs `/plan-work` without parameters:

```
Please specify a work item:

Examples:
  /plan-work 0001           - Plan by work ID
  /plan-work user-auth      - Plan by name search
  /plan-work cdd/0001-...   - Plan by full path

Or list all work items:
  /list-work
```

### Work Item Not Found

If work item doesn't exist:

```
❌ Work item not found: "XXXX"

Available work items:
- 0001: user-authentication-system (Feature, In Progress)
- 0002: dark-mode-toggle (Feature, Draft)
- bugs/0001: login-timeout (Bug, Draft)

Use /list-work to see all work items.
```

### DECISIONS.md Missing or Invalid

If DECISIONS.md doesn't exist or is incomplete:

```
⚠️  Warning: DECISIONS.md is missing or incomplete

The implementation plan requires a valid DECISIONS.md file.

Options:
1. Run `/create-work` to create a new work item
2. Manually create DECISIONS.md using template in cdd/.meta/templates/
3. Check if you have the correct work ID

Need help? Use /list-work to see valid work items.
```

## Adaptive Planning

Adjust planning based on work type:

**Features:**
- Focus on user flows
- Include UI/UX tasks
- Emphasize testing user scenarios

**Bugs:**
- Start with reproduction
- Focus on root cause identification
- Include regression tests

**Refactors:**
- Start with current state analysis
- Include before/after comparisons
- Ensure all existing tests still pass

**Spikes:**
- Focus on research tasks
- Include documentation of findings
- Timeboxed tasks

**Epics:**
- Break into sub-features
- Link to related work items
- High-level milestones

## Remember

- **ALWAYS** use two-phase approach (parent → wait → sub-tasks)
- **DO NOT** implement code, only create the plan
- **BE THOROUGH** in codebase analysis
- **ADAPT** to actual project structure and conventions
- **REFERENCE** specific files and patterns from codebase
- **MAKE** tasks actionable and clear for any developer
- **INCLUDE** validation steps where applicable

---

**Command Version:** 1.0
**Release Date:** 2025-10-29
**Author:** EMB (Ezequiel M. Benitez) @emb715
**Part of:** CDD v1.0 Methodology
