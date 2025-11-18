# CDD Workflow & State Diagram

> **Purpose:** Document the CDD workflow, clarify automation vs manual steps, and define state transition guard conditions
> 
> **Part of:** CDD (Context-Driven Development)

---

## Overview

CDD is a **human-AI collaborative workflow** for managing development context. This document clarifies:
- What's automated vs what requires human input
- How work items flow through states
- What validation is required at each transition

---

## Workflow States

```
┌─────────┐
│  draft  │  ← Created, not yet planned
└────┬────┘
     │ Guard: DECISIONS.md complete + reviewed
     ▼
┌──────────────┐
│ in-progress  │  ← Implementation underway
└──────┬───────┘
       │ Guard: All tasks complete + success criteria met
       ▼
┌───────────┐
│ complete  │  ← Work finished and validated
└───────────┘
```

**Note:** "review" state was removed for simplicity. Validation happens during `/cdd:complete-work`.

### Anthropic 4Ds Alignment

CDD state transitions embed Anthropic's Decide → Describe → Delegate → Document flow. Use this mapping to keep human/AI collaboration grounded in the broader methodology:

| Anthropic 4D | Primary CDD State | Key Artifacts | What Happens Here |
|--------------|------------------|---------------|-------------------|
| **Decide**   | draft            | DECISIONS.md | Frame the problem, commit to goals, and capture constraints before any implementation work begins. |
| **Describe** | draft → in-progress | IMPLEMENTATION_PLAN.md | Shape the solution: break requirements into executable tasks. |
| **Delegate** | in-progress      | IMPLEMENTATION_PLAN.md / SESSION_NOTES.md | Humans implement while AI assists with task tracking, prompting context updates, and surfacing reminders. |
| **Document** | in-progress → complete | IMPLEMENTATION_SUMMARY.md | Provide evidence, record outcomes, and update metrics so future collaborators inherit trustworthy context. |

**Note:** Comprehensive mode adds PROBLEM_BRIEF, TECHNICAL_RFC, RISK_REGISTER, VALIDATION_PLAN.

### State Definitions

| State | Meaning | Typical Duration | Key Artifacts |
|-------|---------|------------------|---------------|
| **draft** | Requirements captured, not yet planned | 1 hour - 1 day | DECISIONS.md |
| **in-progress** | Active implementation | Days - weeks | + IMPLEMENTATION_PLAN.md<br>+ SESSION_NOTES.md |
| **complete** | Validated and closed | N/A (terminal state) | + IMPLEMENTATION_SUMMARY.md |

---

## Guard Conditions (Validation Gates)

### draft → in-progress

**Required before transition:**
- [x] DECISIONS.md exists and is complete
- [x] Problem, solution, and goals defined
- [x] Functional requirements (FR-X) listed
- [x] Success criteria defined
- [x] User has reviewed and confirmed accuracy

**Command:** `/cdd:plan-work [work-id]`
**Validation:** Manual review by user

**Rationale:** Prevents starting implementation without clear requirements.

---

### in-progress → complete

**Required before transition:**
- [x] All planned tasks marked complete in IMPLEMENTATION_PLAN.md
- [x] Success criteria met (validated per template_mode)
- [x] SESSION_NOTES.md documents the journey
- [x] No open blockers (or explicitly deferred)
- [x] IMPLEMENTATION_SUMMARY.md generated

**Validation varies by template_mode:**
- **solo-dev**: Basic completion check (works? next steps?)
- **minimal**: Standard validation (tests pass, basic evidence)
- **comprehensive**: Full validation (all evidence, all artifacts)

**Command:** `/cdd:complete-work [work-id]`

**Rationale:** Prevents premature completion, ensures appropriate level of validation for work complexity.

---

## Automation Breakdown

### ✅ Fully Automated

**What the system does without human input:**

1. **File Generation**
   - Create work item folders with auto-incremented IDs
   - Generate files from templates (DECISIONS.md, IMPLEMENTATION_PLAN.md, etc.)
   - Format markdown with proper structure

2. **Metadata Management**
   - Update timestamps (created, updated dates)
   - Track status changes
   - Maintain YAML frontmatter

3. **Documentation Structure**
   - Apply templates consistently
   - Format session notes entries
   - Generate summaries from templates

### 🤝 Collaborative (Human Input + AI Structuring)

**What requires human knowledge + AI assistance:**

1. **Requirements Gathering** (`/cdd:create-work`)
   - AI asks questions
   - Human provides answers (problem, solution, requirements)
   - AI structures into DECISIONS.md

2. **Implementation Planning** (`/cdd:plan-work`)
   - Human describes codebase (tech stack, patterns, file locations)
   - AI generates task breakdown
   - Human reviews and confirms plan

3. **Session Tracking** (`/cdd:save-session`)
   - Human reports what was done, decisions made, issues encountered
   - AI structures into session notes entry
   - AI suggests next steps

4. **Completion Summary** (`/cdd:complete-work`)
   - Human provides evidence and validation
   - AI synthesizes into summary document
   - AI identifies follow-up work

### 👤 Fully Manual (Human Responsibility)

**What the human must do (AI cannot do):**

1. **Decision-Making**
   - Choose technical approaches
   - Prioritize requirements
   - Accept trade-offs
   - Resolve blockers

2. **Code Implementation**
   - Write actual code
   - Debug issues
   - Refactor as needed
   - Optimize performance

3. **Validation**
   - Write and run tests
   - Verify success criteria
   - Review code quality
   - Collect evidence (screenshots, test results)

4. **Context Stewardship**
   - Keep DECISIONS.md current when requirements change
   - Update RISK_REGISTER.md  when risks discovered
   - Ensure context accuracy
   - Review and refine AI-generated content

---

## Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CDD Workflow Process                          │
└─────────────────────────────────────────────────────────────────┘

1️⃣  CREATE WORK ITEM
    ┌──────────────────┐
    │  /cdd:create-work    │  🤝 Collaborative
    └────────┬─────────┘
             │
             │ AI asks: Problem? Solution? Requirements?
             │ Human answers
             │ AI generates DECISIONS.md
             │
             ▼
    ┌──────────────────┐
    │ DECISIONS.md     │  ✅ Automated generation
    │ Status: draft    │  👤 Human reviews & refines
    └────────┬─────────┘
             │
             │ Guard: DECISIONS.md complete?
             │
             ▼

2️⃣  PLAN IMPLEMENTATION
    ┌──────────────────┐
    │  /cdd:plan-work      │  🤝 Collaborative
    └────────┬─────────┘
             │
             │ AI asks: Tech stack? Patterns? File structure?
             │ Human describes codebase
             │ AI generates parent tasks
             │ Human confirms: "Go"
             │ AI generates detailed sub-tasks
             │
             ▼
    ┌─────────────────────┐
    │ IMPLEMENTATION_     │  ✅ Automated generation
    │ PLAN.md             │  👤 Human validates tasks
    │ Status: in-progress │
    └────────┬────────────┘
             │
             │ Guard: Plan makes sense?
             │
             ▼

3️⃣  IMPLEMENT & TRACK
    ┌──────────────────┐
    │  [Coding]        │  👤 Fully Manual
    └────────┬─────────┘
             │
             │ Human writes code
             │ Human runs tests
             │ Human makes decisions
             │
             ▼
    ┌──────────────────┐
    │  /cdd:save-session   │  🤝 Collaborative
    └────────┬─────────┘
             │
             │ AI asks: What done? Decisions? Issues?
             │ Human reports
             │ AI structures session notes
             │
             ▼
    ┌──────────────────┐
    │ SESSION_NOTES.md │  ✅ Automated formatting
    └────────┬─────────┘
             │
             │ Repeat 3️⃣ until all tasks done
             │
             │ Guard: All tasks complete + tests pass?
             │
             ▼

4️⃣  VALIDATE & COMPLETE
    ┌──────────────────┐
    │  /cdd:complete-work  │  🤝 Collaborative
    └────────┬─────────┘
             │
             │ AI asks: Evidence for success criteria?
             │ Human provides test results, screenshots, etc.
             │ AI validates all requirements met
             │ AI generates summary
             │
             ▼
    ┌───────────────────────┐
    │ IMPLEMENTATION_       │  ✅ Automated generation
    │ SUMMARY.md            │  👤 Human validates accuracy
    │ Status: complete      │
    └───────────────────────┘
```

---

## Legend

| Symbol | Meaning | Examples |
|--------|---------|----------|
| ✅ | **Automated** | File creation, formatting, metadata updates |
| 🤝 | **Collaborative** | AI asks questions, human answers, AI structures |
| 👤 | **Manual** | Decision-making, coding, testing, validation |

---

## Human-in-the-Loop Principles

CDD is designed around these human-AI collaboration principles:

### 1. Human Judgment is Required

**AI role:** Structure information, suggest approaches, generate documentation
**Human role:** Make decisions, validate accuracy, maintain context ownership

### 2. AI Amplifies Good Practices

**AI role:** Make good practices (documentation, planning) easier
**Human role:** Define what "good" means for your project

### 3. Transparency Over Magic

**AI role:** Clearly state what it can and cannot do
**Human role:** Understand the system's capabilities and limitations

### 4. Verification is Mandatory

**AI role:** Generate output that's easy to review
**Human role:** Review and refine all AI-generated content

---

## State Transition Examples

### Example 1: Feature Work Item

```
Day 1: /cdd:create-work user profile settings
  → draft state
  → DECISIONS.md created
  → Human reviews and refines

Day 1: /cdd:plan-work 0023
  → Transitions to in-progress
  → IMPLEMENTATION_PLAN.md created
  → Human validates plan

Days 2-5: [Coding + /cdd:save-session after each day]
  → Stays in in-progress
  → SESSION_NOTES.md grows
  → Human implements code

Day 5: [All tasks done, tests pass]
  → Human manually changes to review state
  → Human validates completion

Day 5: /cdd:complete-work 0023
  → Checks evidence (tests, screenshots)
  → Transitions to complete
  → IMPLEMENTATION_SUMMARY.md created
```

### Example 2: Bug Fix

```
Morning: /cdd:create-work login timeout after 5 minutes
  → draft state
  → DECISIONS.md with bug description

Morning: /cdd:plan-work bugs/0008
  → in-progress state
  → Plan: reproduce, debug, fix, test

Afternoon: [Fix implemented, regression test added]
  → Stays in-progress until validated

Afternoon: /cdd:save-session bugs/0008
  → Documents root cause found

End of day: /cdd:complete-work bugs/0008
  → Provides evidence: regression test passing
  → complete state
```

---

## Validation Enforcement 

**Validation method:** Hard guards + prompts

- draft → in-progress: Require PROBLEM_BRIEF.md + TECHNICAL_RFC.md exist
- in-progress → review: Check all tasks marked complete (automated)
- review → complete: **Block** if no evidence provided for must-have criteria

**Improvement:** Critical gates enforced, optional gates have prompts

---

## Workflow Customization

### For Small Features

**Skip or minimize:**
- Detailed IMPLEMENTATION_PLAN.md (just high-level tasks)
- Extensive SESSION_NOTES.md (1-2 sessions may be enough)
- review state (draft → in-progress → complete directly)

**Keep:**
- DECISIONS.md (even if brief)
- Evidence for completion

### For Large Epics

**Add:**
- Milestones in IMPLEMENTATION_PLAN.md
- Weekly reviews instead of per-session
- Intermediate summaries at milestones

**Enforce:**
- All guard conditions strictly
- Evidence at each milestone
- Risk reviews weekly

### For Spikes (Research)

**Adjust:**
- Success criteria = "decision made" not "code complete"
- IMPLEMENTATION_SUMMARY.md becomes research report
- Evidence = findings documented, options compared

---

## Anti-Patterns to Avoid

### ❌ Marking complete without evidence
**Problem:** Future you can't verify it was actually done
**Solution:** Enforce evidence gates in /cdd:complete-work

### ❌ Skipping /cdd:save-session
**Problem:** Context lost between sessions
**Solution:** Make /cdd:save-session habitual (end-of-day ritual)

### ❌ Treating DECISIONS.md as write-once
**Problem:** Context drifts from reality
**Solution:** Update when requirements or decisions change

### ❌ Letting AI make decisions without validation
**Problem:** Errors compound, context becomes unreliable
**Solution:** Review all AI-generated content critically

### ❌ Over-documenting trivial work
**Problem:** Process overhead kills productivity
**Solution:** Scale documentation to work complexity

---

## Success Metrics

### Leading Indicators (During Work)

- ✅ Can resume work in < 5 minutes after 1+ week break
- ✅ AI suggestions align with project patterns
- ✅ No repeated questions about project structure
- ✅ Clear "what's next" at any point

### Lagging Indicators (After Work)

- ✅ Can hand work item to someone else without explanation
- ✅ No rework due to forgotten decisions
- ✅ Work item tells coherent story of what/why
- ✅ Follow-up work easier because context exists

---

## Task Completion Tracking Workflow

> **Purpose:** Track implementation progress automatically and semi-automatically
> **Status:** Available
> **Impact:** Reduces manual task tracking overhead by ~50%

### Overview

This feature provides **file-based task completion detection** to reduce manual overhead. When you run `/cdd:save-session`, AI:
1. Detects file changes via git
2. Matches files to tasks in IMPLEMENTATION_PLAN.md
3. Suggests task completions
4. Updates task status automatically

### Task Status System

**Status Emojis (v2.0 IMPLEMENTATION_PLAN format):**
- ⬜ **Not Started** - Task not yet begun
- 🔄 **In Progress** - Currently working on this task
- ✅ **Completed** - Task finished and validated

**Example task:**
```markdown
#### Task 1.3: Add user_preferences table
**Status:** ✅ Completed
**Estimated:** 45 min
**Done When:** Migration file exists and schema updated
**Files:**
- `prisma/migrations/*_add_preferences.sql`
- `prisma/schema.prisma`
```

---

### Workflow Diagram: File Detection → Task Completion

```
┌─────────────────┐
│  You work on    │
│  implementation │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  /cdd:save-session  │  ← Command triggered
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI detects     │  ← git diff --name-only
│  file changes   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI reads       │  ← Parse IMPLEMENTATION_PLAN.md
│  task mappings  │     Extract "Files:" fields
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Match files    │  ← Compare detected files to task files
│  to tasks       │     Use wildcards (*, **)
└────────┬────────┘
         │
         ▼
      Found matches?
         ├─ Yes ──┐
         │        ▼
         │   ┌─────────────────┐
         │   │  AI suggests    │
         │   │  completions    │
         │   └────────┬────────┘
         │            │
         │            ▼
         │   ┌─────────────────┐
         │   │  User confirms  │  ← "Mark as complete? (y/n/edit)"
         │   └────────┬────────┘
         │            │
         │            ▼
         │   ┌─────────────────┐
         │   │  AI updates     │  ← Change ⬜ to ✅
         │   │  IMPL_PLAN.md   │
         │   └────────┬────────┘
         │            │
         └─ No ──────┤
                     │
                     ▼
            ┌─────────────────┐
            │  Manual          │  ← "Which tasks did you complete?"
            │  selection       │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  AI updates      │
            │  task status     │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Calculate       │  ← Count ✅ vs total
            │  progress %      │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Log in          │  ← Add to session entry
            │  SESSION_NOTES   │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Confirmation    │  ← "✅ Marked 2 tasks complete"
            │  summary shown   │     "📊 Progress: 10% → 20%"
            └─────────────────┘
```

---

### Scenario 1: Automatic Detection (Happy Path)

**You:** Work on database migration and schema update

**Files changed:**
- Created: `prisma/migrations/20241030_add_preferences.sql`
- Modified: `prisma/schema.prisma`

**Then:**
```bash
/cdd:save-session 0042
```

**AI Response:**
```
🔍 Task Completion Detection

Based on file changes, I detected you may have completed:

1. ✓ Task 1.3: Add user_preferences table
   - Created: prisma/migrations/20241030_add_preferences.sql
   - Modified: prisma/schema.prisma

Mark as complete? (y/n/edit)
```

**You:** `y`

**AI:**
```
✅ Task Completion Summary

Marked as complete:
- Task 1.3: Add user_preferences table

📊 Progress: 10% → 15% (+5%)

Updated files:
- IMPLEMENTATION_PLAN.md (Task 1.3 status → ✅)
- SESSION_NOTES.md (progress logged)
```

**Result:** Task automatically detected and marked complete with 1 confirmation!

---

### Scenario 2: No Matches Found (Manual Fallback)

**You:** Work on research/planning (no files changed)

**Then:**
```bash
/cdd:save-session 0042
```

**AI Response:**
```
📋 Manual Task Selection

No file changes detected (or no matching tasks).
Which tasks did you complete this session?

Uncompleted tasks:
1. [ ] Task 1.1: Research notification libraries (⬜ Not Started)
2. [ ] Task 1.2: Design database schema (⬜ Not Started)
3. [ ] Task 2.1: Implement service (⬜ Not Started)

Select tasks: (type task IDs like "1.1, 1.2" or "none")
```

**You:** `1.1, 1.2`

**AI:**
```
✅ Marked 2 tasks complete:
- Task 1.1: Research notification libraries
- Task 1.2: Design database schema

📊 Progress: 0% → 10% (+2 tasks)
```

**Result:** Manual selection works as fallback.

---

### Scenario 3: User Edits Suggestions

**You:** Work on multiple tasks, but only one is actually complete

**AI detects 2 potential completions:**
```
🔍 Task Completion Detection

Based on file changes, I detected you may have completed:

1. ✓ Task 2.1: Implement PreferencesService
2. ✓ Task 2.2: Add unit tests for PreferencesService

Mark these as complete? (y/n/edit)
```

**You:** `edit` (Task 2.2 tests not done yet)

**AI:**
```
Which tasks did you complete?

From auto-detected:
[X] Task 2.1: Implement PreferencesService
[ ] Task 2.2: Add unit tests for PreferencesService ← Unchecked

Other tasks (manual selection):
[ ] Task 3.1: Create API endpoint

Select additional tasks: (task IDs or press Enter)
```

**You:** *(press Enter)*

**AI:**
```
✅ Marked 1 task complete:
- Task 2.1: Implement PreferencesService

📊 Progress: 15% → 20% (+5%)

Note: Task 2.2 left as 🔄 In Progress (tests incomplete)
```

**Result:** User can refine AI suggestions.

---

### File Mapping Patterns

#### Exact Match
```markdown
**Files:**
- `prisma/schema.prisma`
```
**Matches:** `prisma/schema.prisma` (exact)

#### Wildcard Match (Single Directory)
```markdown
**Files:**
- `prisma/migrations/*_add_preferences.sql`
```
**Matches:**
- `prisma/migrations/20241030_add_preferences.sql` ✅
- `prisma/migrations/20241101_add_preferences.sql` ✅
- `prisma/migrations/other_migration.sql` ❌

#### Glob Match (Recursive)
```markdown
**Files:**
- `src/services/**/*.test.ts`
```
**Matches:**
- `src/services/PreferencesService.test.ts` ✅
- `src/services/notifications/NotificationService.test.ts` ✅
- `src/components/Form.test.tsx` ❌ (wrong directory)

---

### Progress Calculation

**Formula:**
```
Progress = (Completed Tasks / Total Tasks) × 100%
```

**Example:**
- Total tasks: 20
- Completed (✅): 5
- In Progress (🔄): 2
- Not Started (⬜): 13

**Progress:** 5/20 = 25%

**Phase Breakdown:**
```
Phase 1: ████████████ 100% (4/4 tasks)
Phase 2: ██░░░░░░░░░░  25% (2/8 tasks)
Phase 3: ░░░░░░░░░░░░   0% (0/8 tasks)

Overall: █████░░░░░░░  25% (5/20 tasks)
```

---

### Integration with `/cdd:complete-work`

When you run `/cdd:complete-work`, AI validates task completion:

**Check 6: Implementation Plan Status**
```
📋 Implementation Plan Status:

Total Tasks: 20
✅ Completed: 20/20 (100%)
🔄 In Progress: 0/20 (0%)
⬜ Not Started: 0/20 (0%)

📊 Progress by Phase:
Phase 1: ████████████ 100% (4/4 tasks)
Phase 2: ████████████ 100% (8/8 tasks)
Phase 3: ████████████ 100% (8/8 tasks)

✅ All tasks complete!

Progress matches SESSION_NOTES.md ✅

Ready to proceed with completion.
```

**If incomplete:**
```
⚠️  CANNOT COMPLETE - 2 tasks still in progress

🔄 Task 3.10: Add loading states (in progress)
🔄 Task 3.11: E2E tests (in progress)

Options:
A) Complete remaining tasks now
B) Move to follow-up work item
C) Mark as "won't do" (with justification)
D) Proceed anyway (not recommended)
```

---

### Best Practices

#### 1. Add File Mappings to Tasks
✅ **Do:**
```markdown
#### Task 1.3: Add database migration
**Files:**
- `prisma/migrations/*_add_preferences.sql`
- `prisma/schema.prisma`
```

❌ **Don't:**
```markdown
#### Task 1.3: Add database migration
(No Files: field - AI can't auto-detect)
```

#### 2. Use Wildcards for Dynamic Files
✅ **Do:**
```markdown
**Files:**
- `prisma/migrations/*_add_preferences.sql` (timestamp varies)
```

❌ **Don't:**
```markdown
**Files:**
- `prisma/migrations/20241030_add_preferences.sql` (too specific)
```

#### 3. Update Status as You Go
✅ **Do:**
- Run `/cdd:save-session` after each work session
- Let AI detect and mark completions

❌ **Don't:**
- Wait until end of week to update progress
- Manually edit IMPLEMENTATION_PLAN.md without logging in SESSION_NOTES.md

#### 4. Review AI Suggestions
✅ **Do:**
- Use `edit` option if AI suggestion is wrong
- Confirm only truly complete tasks

❌ **Don't:**
- Blindly accept all suggestions
- Mark task complete if tests failing

---

### Configuration Options

#### Disable Auto-Detection (Optional)
If you prefer manual task tracking:

**In IMPLEMENTATION_PLAN.md frontmatter:**
```yaml
> **Auto Detect Tasks:** false
```

**Result:**
```
ℹ️  Automatic task detection disabled for this work item.

Which tasks did you complete? (enter task IDs or "none")
```

#### Git Not Available
If working outside git repo:

```
⚠️  Cannot detect file changes (git not available).

Falling back to manual task selection.
Which tasks did you complete? (enter task IDs or "none")
```

---

### Troubleshooting

#### Issue: AI Not Detecting Completed Task

**Symptom:** You finished Task 2.1, but AI didn't suggest it.

**Possible Causes:**
1. **No Files: field** in task definition
   - Fix: Add `**Files:**` field to task
2. **File pattern doesn't match**
   - Fix: Use wildcard (`src/**/*.test.ts` instead of specific file)
3. **Files not staged in git**
   - Fix: `git add .` before `/cdd:save-session`

**Workaround:** Use manual selection when prompted.

---

#### Issue: Progress Mismatch (IMPL_PLAN vs SESSION_NOTES)

**Symptom:** `/cdd:complete-work` shows:
```
⚠️  Progress Mismatch:
IMPLEMENTATION_PLAN.md: 15/20 (75%)
SESSION_NOTES.md: 13/20 (65%)
```

**Cause:** IMPLEMENTATION_PLAN.md edited manually without running `/cdd:save-session`.

**Fix:** Run `/cdd:save-session` to sync progress.

---

#### Issue: False Positives (Task Suggested But Not Done)

**Symptom:** AI suggests Task 2.1 complete, but you only started it.

**Cause:** File created/modified but task not finished.

**Solution:** Use `edit` option to deselect:
```
Mark these as complete? (y/n/edit)
You: edit

[X] Task 2.1: Implement service ← Uncheck this
[ ] Task 2.2: Add tests
```

---

## Related Documentation

- **Templates:** `cdd/.meta/templates/` - Document structure
- **Commands:** `.claude/commands/` - Slash command implementation
- **Stewardship:** `cdd/.meta/CONTEXT_STEWARDSHIP.md` - Maintenance guide
- **Lifecycle:** `cdd/.meta/CONTEXT_LIFECYCLE.md` - Versioning and archival
