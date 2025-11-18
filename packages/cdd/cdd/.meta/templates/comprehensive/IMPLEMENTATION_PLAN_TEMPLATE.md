# Implementation Plan: [Work Title]

> **Work ID:** XXXX
> **Generated from:** DECISIONS.md (v1.0) or PROBLEM_BRIEF.md + TECHNICAL_RFC.md (v2.0)
> **Generated on:** YYYY-MM-DD
> **Status:** draft
> **Planned Tasks:** [planned_tasks_total or "TBD"]
> **Completed Tasks:** 0
> **Progress:** 0%

---

## Context from Planning Artifacts

**v1.0 (DECISIONS.md):**
- Patterns to Follow: [List key patterns from DECISIONS.md]
- Dependencies: [Internal/external dependencies]
- Files to Create/Modify: [High-level file list]

**v2.0 (Modular Artifacts):**
- **Problem:** See PROBLEM_BRIEF.md for WHY we're building this
- **Technical Approach:** See TECHNICAL_RFC.md for HOW we'll build it
- **Risks:** See RISK_REGISTER.md for blockers and assumptions
- **Validation:** See VALIDATION_PLAN.md for testing strategy

---

## Files to Work With

### Files to Create
<!-- Auto-populated from DECISIONS.md frontmatter -->
- `path/to/new/file1.ts` - [Purpose]
- `path/to/new/file1.test.ts` - Unit tests for file1
- `path/to/new/file2.tsx` - [Purpose]
- `path/to/new/file2.test.tsx` - Unit tests for file2

### Files to Modify
<!-- Auto-populated from DECISIONS.md frontmatter -->
- `path/to/existing/file3.ts` - [Changes needed]
- `path/to/existing/file3.test.ts` - Update tests
- `path/to/existing/config.ts` - [Changes needed]

---

## Implementation Tasks

### Phase 1: Setup & Configuration
**Goal:** Prepare environment and dependencies
**Estimated Time:** XX hours

#### Task 1.1: [Task Description]
**Status:** ⬜ Not Started
**Estimated:** 30 min
**Done When:** [Specific completion criteria - e.g., "Tests pass", "File exists", "API returns 200"]
**Files:**
- `path/to/file1.ts` - [Purpose of this file]
- `path/to/file2.test.ts` - [Purpose of this file]

**Details:**
[Optional: Additional context, edge cases, or important notes]

---

#### Task 1.2: [Task Description]
**Status:** ⬜ Not Started
**Estimated:** 45 min
**Done When:** [Specific completion criteria]
**Files:**
- `path/to/another/file.ts`

---

---

### Phase 2: Core Implementation
**Goal:** Build the main functionality

#### 2.0 Data Models & Schema
- **2.1** [Data model task]
  - File(s): [Files involved]
  - Pattern: [Follow schema in X file]
  - Validation: [How to verify]

- **2.2** [Schema migration task]
  - File(s): [Files involved]
  - Pattern: [Follow migration in X file]

#### 2.1 Business Logic
- **2.1.1** [Business logic task]
  - File(s): [Files involved]
  - Pattern: [Reference pattern]
  - Edge cases: [List edge cases to handle]

- **2.1.2** [Business logic task]
  - File(s): [Files involved]
  - Pattern: [Reference pattern]

#### 2.2 API Layer
- **2.2.1** [API endpoint task]
  - File(s): [Files involved]
  - Pattern: [Follow endpoint pattern in X]
  - Request/Response: [Format]

- **2.2.2** [API endpoint task]
  - File(s): [Files involved]
  - Pattern: [Follow endpoint pattern in X]

---

### Phase 3: User Interface
**Goal:** Build UI components and user experience

#### 3.0 UI Components
- **3.1** [Component task]
  - File(s): [Files involved]
  - Pattern: [Follow component in X]
  - Design: [Reference to mockup/design]

- **3.2** [Component task]
  - File(s): [Files involved]
  - Pattern: [Follow component in X]

#### 3.1 State Management
- **3.1.1** [State management task]
  - File(s): [Files involved]
  - Pattern: [Follow state pattern in X]

- **3.1.2** [State management task]
  - File(s): [Files involved]
  - Pattern: [Follow state pattern in X]

#### 3.2 User Interactions
- **3.2.1** [Interaction task]
  - File(s): [Files involved]
  - Pattern: [Follow interaction pattern in X]
  - Accessibility: [A11y requirements]

---

### Phase 4: Integration & Error Handling
**Goal:** Connect components and handle edge cases

#### 4.0 Integration
- **4.1** [Integration task]
  - File(s): [Files involved]
  - Dependencies: [What must be complete first]

- **4.2** [Integration task]
  - File(s): [Files involved]
  - Dependencies: [What must be complete first]

#### 4.1 Error Handling
- **4.1.1** [Error handling task]
  - File(s): [Files involved]
  - Scenarios: [List error scenarios to handle]

- **4.1.2** [Error handling task]
  - File(s): [Files involved]
  - Scenarios: [List error scenarios to handle]

#### 4.2 Edge Cases
- **4.2.1** [Edge case handling]
  - Scenario: [Describe edge case]
  - File(s): [Files involved]

---

### Phase 5: Testing & Quality Assurance
**Goal:** Ensure quality and reliability

#### 5.0 Unit Tests
- **5.1** [Unit test task]
  - File(s): [Test files]
  - Coverage: [What to test]
  - Pattern: [Follow test pattern in X]

- **5.2** [Unit test task]
  - File(s): [Test files]
  - Coverage: [What to test]

#### 5.1 Integration Tests
- **5.1.1** [Integration test task]
  - File(s): [Test files]
  - Workflow: [What workflow to test]

- **5.1.2** [Integration test task]
  - File(s): [Test files]
  - Workflow: [What workflow to test]

#### 5.2 Manual Testing
- **5.2.1** [Manual test scenario]
  - Steps: [Test steps]
  - Expected: [Expected outcome]

- **5.2.2** [Manual test scenario]
  - Steps: [Test steps]
  - Expected: [Expected outcome]

---

### Phase 6: Documentation & Deployment
**Goal:** Document and deploy the work

#### 6.0 Documentation
- **6.1** [Documentation task]
  - File(s): [Docs to create/update]
  - Content: [What to document]

- **6.2** [Documentation task]
  - File(s): [Docs to create/update]

#### 6.1 Code Review
- **6.1.1** Self-review code against checklist
  - [ ] Follows project patterns
  - [ ] No console.logs or debug code
  - [ ] Proper error handling
  - [ ] Tests passing
  - [ ] Documentation updated

#### 6.2 Deployment
- **6.2.1** [Deployment task]
  - Environment: [Which environment]
  - Steps: [Deployment steps]

- **6.2.2** [Verification task]
  - Verify: [What to verify in production]

---

## Task Summary

**Total Tasks:** XX
**Estimated Effort:** XX hours

### By Phase
- Phase 1 (Setup): X tasks (~X hours)
- Phase 2 (Core): X tasks (~X hours)
- Phase 3 (UI): X tasks (~X hours)
- Phase 4 (Integration): X tasks (~X hours)
- Phase 5 (Testing): X tasks (~X hours)
- Phase 6 (Documentation): X tasks (~X hours)

---

## Progress Tracking

### Completion Status
- [ ] Phase 1: Setup & Configuration (0/X tasks)
- [ ] Phase 2: Core Implementation (0/X tasks)
- [ ] Phase 3: User Interface (0/X tasks)
- [ ] Phase 4: Integration & Error Handling (0/X tasks)
- [ ] Phase 5: Testing & Quality Assurance (0/X tasks)
- [ ] Phase 6: Documentation & Deployment (0/X tasks)

### Current Phase
**Phase:** Not Started
**Current Task:** None
**Next Task:** 1.1

---

## Notes for Implementation

### Important Reminders
- [Important reminder 1]
- [Important reminder 2]

### Helpful Commands
```bash
# Run tests
npm test path/to/test/file

# Run dev server
npm run dev

# Build for production
npm run build
```

### References During Implementation
- DECISIONS.md (v1.0) or PROBLEM_BRIEF.md (v2.0) - For requirements and rationale
- SESSION_NOTES.md - To track progress and decisions
- [External Resource](URL) - Description

---

## Task Status & File Mapping Guide

### Status Emojis

Use these emojis to track task progress:

- **⬜ Not Started** - Task not yet begun
- **🔄 In Progress** - Currently working on this task
- **✅ Completed** - Task finished and validated

**How to update status:**
1. **Manual:** Edit this file and change the emoji directly
2. **AI-Assisted:** Use `/cdd:save-session` - AI detects file changes and suggests completions
3. **Tell AI:** During `/cdd:save-session`, tell AI which tasks you completed

---

### File Mapping System

The **Files:** field links tasks to specific files, enabling automatic task completion detection.

#### When to Add "Files:" Field

✅ **Add when:**
- Task creates/modifies specific files
- Task has clear file deliverables
- You want AI to auto-detect completion

❌ **Skip when:**
- Research, planning, or decision-making tasks
- Task affects too many files to list (list key files only)
- Task has no file output

#### Wildcard Patterns

Use wildcards for flexible file matching:

```markdown
**Files:**
- `prisma/migrations/*_add_user_preferences.sql` - Migration (timestamp varies)
- `src/services/**/*.test.ts` - All test files in services directory
- `docs/api/*.md` - API documentation pages
```

**AI will match:**
- `prisma/migrations/20241030_add_user_preferences.sql` ✅
- `src/services/auth/AuthService.test.ts` ✅
- `docs/api/authentication.md` ✅

#### Common File Mapping Patterns

**Creating a new feature component:**
```markdown
#### Task 2.1: Implement UserProfile component
**Status:** ⬜ Not Started
**Files:**
- `src/components/UserProfile/UserProfile.tsx` - Main component
- `src/components/UserProfile/UserProfile.test.tsx` - Unit tests
- `src/components/UserProfile/UserProfile.stories.tsx` - Storybook (optional)
```

**Database migration:**
```markdown
#### Task 1.3: Add user_preferences table
**Status:** ⬜ Not Started
**Files:**
- `prisma/migrations/*_add_user_preferences.sql` - Migration file
- `prisma/schema.prisma` - Schema update (add UserPreferences model)
```

**API endpoint:**
```markdown
#### Task 3.2: Create GET /api/preferences endpoint
**Status:** ⬜ Not Started
**Files:**
- `src/app/api/preferences/route.ts` - API handler
- `src/app/api/preferences/route.test.ts` - Integration tests
```

**Documentation:**
```markdown
#### Task 6.1: Update API documentation
**Status:** ⬜ Not Started
**Files:**
- `docs/api/README.md` - API overview
- `docs/api/preferences.md` - Preferences endpoint docs
```

**No specific files (research task):**
```markdown
#### Task 1.1: Research notification libraries
**Status:** ⬜ Not Started
**No specific files** (research/planning task)
```

---

### Task Completion Workflow

#### Option 1: Manual Status Update
```markdown
# Before
#### Task 1.1: Create database migration
**Status:** ⬜ Not Started

# After (you manually edit)
#### Task 1.1: Create database migration
**Status:** ✅ Completed
```

#### Option 2: AI-Assisted Detection (Recommended)

```bash
# You work on your code, creating/modifying files
# Then run:
/cdd:save-session [work-id]
```

**AI detects file changes:**
```
🔍 Analyzing session...

Detected file changes:
- Created: prisma/migrations/20241030_add_preferences.sql
- Modified: prisma/schema.prisma

Related tasks in IMPLEMENTATION_PLAN.md:
✓ Task 1.3: Add user_preferences table
  - Files match: prisma/migrations/*_add_preferences.sql ✅
  - Files match: prisma/schema.prisma ✅

Mark Task 1.3 as complete? (y/n/edit)
```

**You confirm:**
```
You: y

AI: ✅ Marked Task 1.3 as complete
    📊 Progress: 10% → 15% (+5%)

    Updated files:
    - IMPLEMENTATION_PLAN.md (status changed to ✅)
    - SESSION_NOTES.md (progress logged)
```

#### Option 3: Manual Tell AI

```bash
/cdd:save-session [work-id]

# AI asks: "Which tasks did you complete this session?"
# You respond: "1.1, 1.2, 2.1"
# AI updates IMPLEMENTATION_PLAN.md automatically
```

---

### Progress Tracking Features

#### Automatic Progress Calculation

When using `/cdd:save-session`, AI will:
1. Count total tasks in plan
2. Count completed tasks (✅ status)
3. Calculate progress percentage
4. Update IMPLEMENTATION_PLAN.md frontmatter
5. Log progress in SESSION_NOTES.md

#### Phase-by-Phase Breakdown

```
📊 Progress by Phase:
Phase 1: ████████████ 100% (4/4 tasks)
Phase 2: ████████░░░░  75% (6/8 tasks)
Phase 3: ░░░░░░░░░░░░   0% (0/5 tasks)

Overall: ███████░░░░░  58% (10/17 tasks)
```

---

## Dependencies & Sequencing

### Task Dependencies

Some tasks must be done in order (critical path):

- **Task 1.3** (database migration) → **Task 2.1** (use new table)
- **Phase 1** (setup) → **Phase 2** (implementation)
- **Task 3.1** (implementation) → **Task 5.1** (tests for that implementation)

### Parallel Tasks

These can be done simultaneously:

- **Task 2.1** (backend) and **Task 3.1** (frontend) - independent
- **Phase 4** (error handling) and **Phase 6** (documentation) - independent

**Tip:** Work on parallel tasks across sessions to maintain momentum.

---

## Plan Readiness Checklist

Before starting implementation:

**v1.0 (DECISIONS.md based):**
- [ ] Functional requirements mapped to tasks
- [ ] Risks captured in DECISIONS.md
- [ ] Dependencies identified
- [ ] Success criteria clear
- [ ] Open questions resolved

**v2.0 (Modular Artifacts based):**
- [ ] All success criteria from PROBLEM_BRIEF.md mapped to tasks
- [ ] Technical approach from TECHNICAL_RFC.md reflected in phases
- [ ] Active blockers from RISK_REGISTER.md resolved
- [ ] Validation tasks from VALIDATION_PLAN.md included in Phase 5
- [ ] Cross-artifact consistency verified

**Mark complete before changing status to `in-progress`**

---

**Template Mode:** comprehensive
**Generated:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Status:** [Current status]
