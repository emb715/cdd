---
description: Save session progress and decisions in work item's SESSION_NOTES.md
author: EMB (Ezequiel M. Benitez) @emb715
---

# Save Session Progress for Work Item

You are tasked with documenting the current work session by appending a new session entry to the work item's SESSION_NOTES.md file. This captures progress, decisions, and context in real-time.

## Critical Rules - READ FIRST

1. **DO NOT** start new work or implement code
2. **MUST** identify which work item is being worked on
3. **MUST** analyze the current session comprehensively
4. **MUST** append to SESSION_NOTES.md (not replace)
5. **MUST** update status in DECISIONS.md frontmatter if changed
6. **SHOULD** suggest next tasks based on IMPLEMENTATION_PLAN.md

## Process

### Step 1: Identify Work Item

The user may specify the work item in several ways:
- Work ID: `/cdd:save-session 0001`
- Folder path: `/cdd:save-session cdd/0001-user-auth`
- Fuzzy name: `/cdd:save-session user auth`
- No parameter: `/cdd:save-session` (auto-detect from conversation)

**Auto-Detection Strategy:**

If no parameter provided:
1. Search conversation history for work item references
2. Look for files recently discussed or modified
3. Check if user has been working on a specific work item
4. If unclear, ask user to specify

**Example:**
```
🔍 Detecting work item from conversation...

Found recent activity on:
📁 cdd/0001-user-authentication-system/

Is this the work item you want to note? (y/n)
```

### Step 2: Locate and Validate Work Item

1. **Find work item folder** using flexible matching (same as `/cdd:plan-work`)
2. **Validate required files exist:**
   - DECISIONS.md - Required (for status updates)
   - SESSION_NOTES.md - Required (target file)
   - IMPLEMENTATION_PLAN.md - Optional (for progress tracking)

3. **Read current state:**
   - Current status from DECISIONS.md frontmatter
   - Last session from SESSION_NOTES.md
   - Progress on tasks from IMPLEMENTATION_PLAN.md (if exists)

### Step 3: Analyze Current Session

Review the conversation history and identify:

**Work Completed:**
- What files were created?
- What files were modified?
- What features were implemented?
- What bugs were fixed?
- What tasks from IMPLEMENTATION_PLAN.md were completed?

**Decisions Made:**
- What technical decisions were discussed?
- What approaches were chosen and why?
- What alternatives were considered and rejected?
- What trade-offs were made?
- Should any be documented in DECISIONS.md?

**Context & Progress:**
- What was the session goal?
- How much of the goal was achieved?
- What tasks from IMPLEMENTATION_PLAN.md are in progress?
- What is the overall progress percentage?

**Challenges & Solutions:**
- What problems were encountered?
- How were they solved?
- What workarounds were implemented?
- What debugging was done?
- How much time was lost to issues?

**Testing Status:**
- What tests were written?
- Are tests passing or failing?
- What test coverage was added?

**Current State:**
- Has the work status changed? (draft → in-progress, etc.)
- What is working now that wasn't before?
- What is partially complete?
- What is blocked or pending?

**Next Steps:**
- What should be done in the next session?
- What dependencies or blockers exist?
- What is the priority order?

**🔍 VALIDATION CHECKS (Context Engineering Feedback Loop):**

> **Note:** Validation depth adapts to `template_mode` from DECISIONS.md frontmatter.

**Read `template_mode` from DECISIONS.md and adjust validation questions:**

**For solo-dev mode (minimal validation):**
1. Any blockers?
2. What's next?

**For minimal mode (basic validation):**
1. Any assumptions changed?
2. New risks or blockers?
3. What's next?

**For comprehensive mode (full validation):**
Ask ALL questions below, referencing modular artifacts:

1. **Assumptions Changed? (→ RISK_REGISTER.md)**
   ```
   Did you discover anything that invalidates our assumptions?
   - New constraints or limitations discovered?
   - Technical approach won't work as planned?
   - Dependency no longer available or suitable?
   - Performance worse than expected?

   If yes:
   - "Let's update RISK_REGISTER.md now to mark assumption as invalidated."
   - "Should we add mitigation plan or update TECHNICAL_RFC.md approach?"
   ```

2. **New Risks or Blockers? (→ RISK_REGISTER.md)**
   ```
   Did you encounter any new risks or blockers?
   - Active blocker preventing progress?
   - New risk discovered (security, performance, timeline)?
   - External dependency issue?
   - Technical debt or maintenance concern?

   If blocker: "Let's add to RISK_REGISTER.md Active Blockers section immediately."
   If risk: "Let's add to RISK_REGISTER.md with probability/impact/mitigation."
   ```

3. **Technical Decisions Made? (→ TECHNICAL_RFC.md)**
   ```
   Did you make any significant technical decisions this session?
   - Chose between multiple approaches?
   - Changed API design or data model?
   - Adopted new library or pattern?
   - Refactored architecture?

   If yes:
   - "Let's document in TECHNICAL_RFC.md Key Technical Decisions section."
   - "Include: Options considered, Decision made, Rationale, Trade-offs"
   ```

4. **Requirements Drift? (→ PROBLEM_BRIEF.md)**
   ```
   Quick sanity check - are we still solving the original problem?
   - Success criteria still relevant?
   - Scope crept beyond non-goals?
   - User value proposition still valid?
   - New success criterion needed?

   If requirements changed:
   - "Let's update PROBLEM_BRIEF.md to reflect new understanding."
   - "Increment PROBLEM_BRIEF version (likely MINOR bump)."
   ```

5. **Tests Written or Passing? (→ VALIDATION_PLAN.md)**
   ```
   Did you make progress on validation this session?
   - Tests written or passing?
   - Evidence collected (screenshots, logs, metrics)?
   - Manual testing completed?
   - Bugs found that need tracking?

   If yes:
   - "Let's update VALIDATION_PLAN.md test status and evidence."
   - "Mark which success criteria from PROBLEM_BRIEF are now validated."
   ```

6. **Verification Needed Before Continuing?**
   ```
   Before the next session, does anything need validation?
   - Assumption to verify (talk to stakeholder, check data)?
   - Test results to review with team?
   - Design approval needed from product owner?
   - External dependency to confirm available?

   If yes:
   - "I'll add these as prerequisites for next session."
   - "Should we add to RISK_REGISTER.md as pending validations?"
   ```

**🎯 Artifact Update Reminders:**

After the above questions, provide a quick checklist:

```
Based on this session, which artifacts need updating?

Suggested updates:
[ ] RISK_REGISTER.md - New risk or assumption invalidated
[ ] TECHNICAL_RFC.md - Decision documented
[ ] PROBLEM_BRIEF.md - Success criteria adjusted
[ ] VALIDATION_PLAN.md - Test progress tracked
[ ] No artifact updates needed (all current)

Would you like me to help update any of these now?
(Or you can update manually later - I'll note in SESSION_NOTES what needs updating)
```

**These questions enforce the feedback loops recommended in IMPROVEMENTS.md (§4) and align with CONTEXT_STEWARDSHIP.md update triggers.**

---

### Step 3.5: Detect and Track Task Completions

> **Purpose:** Automatically detect completed tasks and update IMPLEMENTATION_PLAN.md

This step reduces manual overhead by using file changes to suggest task completions.

#### Sub-Step 1: Detect File Changes

**Use git to detect what changed:**
```bash
# AI runs this internally
git diff --name-only HEAD
git ls-files --others --exclude-standard  # Untracked files
```

**Example output:**
```
Created: prisma/migrations/20241030_add_preferences.sql
Modified: prisma/schema.prisma
Modified: src/services/PreferencesService.ts
Created: src/services/PreferencesService.test.ts
```

---

#### Sub-Step 2: Read IMPLEMENTATION_PLAN.md

**Parse tasks from IMPLEMENTATION_PLAN.md:**
- Extract all tasks with **Status:** field
- Extract **Files:** field for each task
- Build task index with file mappings

**Example parsed task:**
```
Task ID: 1.3
Description: Add user_preferences table
Status: ⬜ Not Started
Files:
  - prisma/migrations/*_add_preferences.sql
  - prisma/schema.prisma
```

---

#### Sub-Step 3: Match Files to Tasks

**For each detected file change, check if it matches any task's Files: field:**

**Matching logic:**
- Exact match: `prisma/schema.prisma` matches `prisma/schema.prisma` ✅
- Wildcard match: `prisma/migrations/20241030_add_preferences.sql` matches `prisma/migrations/*_add_preferences.sql` ✅
- Glob match: `src/services/PreferencesService.test.ts` matches `src/services/**/*.test.ts` ✅

**Build suggestions list:**
```
Suggested completions:
- Task 1.3: Add user_preferences table
  - Files match: prisma/migrations/*_add_preferences.sql ✅
  - Files match: prisma/schema.prisma ✅
  - Confidence: High (2/2 files match)

- Task 2.1: Implement PreferencesService
  - Files match: src/services/PreferencesService.ts ✅
  - Files match: src/services/PreferencesService.test.ts ✅
  - Confidence: High (2/2 files match)
```

---

#### Sub-Step 4: Present Suggestions to User

**If file-based matches found:**
```
🔍 Task Completion Detection

Based on file changes, I detected you may have completed:

1. ✓ Task 1.3: Add user_preferences table
   - Created: prisma/migrations/20241030_add_preferences.sql
   - Modified: prisma/schema.prisma

2. ✓ Task 2.1: Implement PreferencesService
   - Modified: src/services/PreferencesService.ts
   - Created: src/services/PreferencesService.test.ts

Mark these as complete? (y/n/edit)

Options:
- y: Mark all suggested tasks as ✅ Completed
- n: Skip task completion (I'll ask manually)
- edit: Let me choose which tasks to mark (show checklist)
```

**If user chooses "edit":**
```
Which tasks did you complete?

From auto-detected:
[X] Task 1.3: Add user_preferences table
[X] Task 2.1: Implement PreferencesService

Other tasks (manual selection):
[ ] Task 2.2: Add unit tests for PreferencesService
[ ] Task 3.1: Create API endpoint

Select: (type task IDs like "2.2, 3.1" or press Enter to skip)
```

---

#### Sub-Step 5: Fallback to Manual Selection

**If no file matches found (or user said "n"):**
```
📋 Manual Task Selection

Which tasks did you complete this session?

Uncompleted tasks:
1. [ ] Task 1.3: Add user_preferences table (⬜ Not Started)
2. [ ] Task 2.1: Implement PreferencesService (⬜ Not Started)
3. [ ] Task 2.2: Add unit tests (🔄 In Progress)
4. [ ] Task 3.1: Create API endpoint (⬜ Not Started)

Select tasks: (type task IDs like "1.3, 2.1" or "none")
```

---

#### Sub-Step 6: Update IMPLEMENTATION_PLAN.md

**For each confirmed task:**
1. Change `**Status:** ⬜ Not Started` to `**Status:** ✅ Completed`
2. Or change `**Status:** 🔄 In Progress` to `**Status:** ✅ Completed`

**Example file edit:**
```markdown
# Before
#### Task 1.3: Add user_preferences table
**Status:** ⬜ Not Started
**Estimated:** 45 min
**Done When:** Migration file exists and schema updated

# After
#### Task 1.3: Add user_preferences table
**Status:** ✅ Completed
**Estimated:** 45 min
**Done When:** Migration file exists and schema updated
```

---

#### Sub-Step 7: Calculate Progress

**Count tasks:**
- Total tasks: Count all tasks with `**Status:**` field
- Completed: Count tasks with `**Status:** ✅ Completed`
- In Progress: Count tasks with `**Status:** 🔄 In Progress`
- Not Started: Count tasks with `**Status:** ⬜ Not Started`

**Calculate percentage:**
```
Progress = (Completed / Total) × 100%
Example: 5 completed / 20 total = 25%
```

**Update IMPLEMENTATION_PLAN.md frontmatter:**
```yaml
> **Completed Tasks:** 5
> **Progress:** 25%
```

---

#### Sub-Step 8: Log in SESSION_NOTES.md

**Add to session entry:**
```markdown
### ✅ Completed

**Tasks finished this session:**
- Task 1.3: Add user_preferences table
- Task 2.1: Implement PreferencesService

### 📊 Progress Update

**Tasks Completed:** 5/20 (25%)
**Phase Breakdown:**
- Phase 1: ████████████ 100% (4/4 tasks)
- Phase 2: ██░░░░░░░░░░  25% (2/8 tasks)
- Phase 3: ░░░░░░░░░░░░   0% (0/8 tasks)

**Overall Progress:** 3/20 → 5/20 (+2 tasks, +10%)
```

---

#### Sub-Step 9: Provide Confirmation

**Show summary:**
```
✅ Task Completion Summary

Marked as complete:
- Task 1.3: Add user_preferences table
- Task 2.1: Implement PreferencesService

📊 Progress: 15% → 25% (+10%)

Updated files:
- IMPLEMENTATION_PLAN.md (2 tasks marked ✅)
- SESSION_NOTES.md (progress logged)

Next tasks suggested:
- Task 2.2: Add unit tests for PreferencesService
- Task 2.3: Wire up API endpoint
```

---

#### Error Handling

**If IMPLEMENTATION_PLAN.md doesn't exist:**
```
ℹ️  No IMPLEMENTATION_PLAN.md found.

This work item doesn't have an implementation plan yet.
Would you like to create one with /cdd:plan-work?

Skipping task completion tracking for this session.
```

**If IMPLEMENTATION_PLAN.md has no tasks with Status: field:**
```
⚠️  IMPLEMENTATION_PLAN.md found, but no tasks have Status: field.

This plan uses old format (checkboxes only).
Task completion tracking works best with new format (Status: emojis).

Proceeding without automatic task detection.
```

**If git is not available:**
```
⚠️  Cannot detect file changes (git not available or not a git repo).

Falling back to manual task selection.
Which tasks did you complete? (enter task IDs or "none")
```

---

#### Configuration Options

**User can optionally skip this step:**
```
# In SESSION_NOTES.md or DECISIONS.md frontmatter
auto_detect_task_completion: false
```

**If disabled:**
```
ℹ️  Automatic task detection disabled for this work item.

Which tasks did you complete? (enter task IDs or "none")
```

---

### Step 4: Capture Duration & Context Reacquisition Time

Track both the productive session length and time spent re-establishing context:

- Estimate total session duration (timestamps in the conversation help).
- Ask the user:
  ```
  How long was this session?
  A) < 1 hour
  B) 1-2 hours
  C) 2-3 hours
  D) 3+ hours
  E) Enter custom (e.g., "2.5 hours")
  ```
- Ask again for context reacquisition:
  ```
  How many minutes did you spend getting back up to speed before coding?
  A) 0-2
  B) 3-5
  C) 6-10
  D) 11-15
  E) Enter custom (e.g., "12")
  ```

Convert the answers to numeric minutes (e.g., “1-2 hours” → 90) so you can update aggregates later.

### Step 5: Determine Status Change

Compare current status to previous:
- Read DECISIONS.md frontmatter for current status
- Check if work should transition to a new status
- Common transitions:
  - `draft` → `in-progress` (started working)
  - `in-progress` → `blocked` (hit a blocker)
  - `blocked` → `in-progress` (blocker resolved)
  - `in-progress` → `complete` (work finished - use `/cdd:complete-work` instead)

**Ask user if status should change:**
```
Current status: draft

Should the status change?
A) → in-progress (started implementation)
B) → blocked (hit a blocker)
C) No change (still draft)
```

### Step 6: Generate Session Entry

Create a comprehensive session entry following the template structure:

```markdown
---

## Session YYYY-MM-DD HH:MM
**Duration:** X.X hours
**Status Change:** [previous status] → [new status]

### 🎯 Session Goal
[What you intended to accomplish in this session]

### ✅ Completed
- Task or accomplishment
- Another task completed

### 💡 Decisions Made

**Decision:** [What was decided]
- **Rationale:** [Why this decision was made]
- **Alternatives Considered:** [What else was considered]
- **Impact:** [What this affects or enables]

### 🔧 Files Changed

**Created:**
- `path/to/new/file.ts` - [Purpose of this file]
- `path/to/new/file.test.ts` - Unit tests

**Modified:**
- `path/to/existing/file.ts` - [What changes were made]

**Deleted:**
- `path/to/removed/file.ts` - [Why it was removed]

### 🐛 Issues Encountered

**Issue:** [Problem description]
- **Symptoms:** [What happened]
- **Root Cause:** [What caused it]
- **Solution:** [How it was resolved]
- **Prevention:** [How to avoid in future]
- **Time Lost:** ~X minutes

### 💭 Learnings & Insights
- [Something learned during this session]
- [Insight gained about the codebase]

### ⚠️ Blockers
- **Blocker:** [What's blocking progress]
  - **Impact:** [How this affects the work]
  - **Needs:** [What's needed to unblock]

### 📊 Progress Update

**Tasks Completed:**
- [X] Task 1.1 - Description
- [X] Task 2.1 - Description

**Tasks In Progress:**
- [ ] Task 2.2 - Description (80% complete)

**Tasks Remaining:**
- [ ] Task 3.1 - Description

**Overall Progress:** XX% complete (XX/XX tasks done)

### 🧪 Testing Status
- **Tests Written:** X new tests
- **Tests Passing:** X/X (100% pass rate)
- **Coverage:** XX% (changed files)

### 📝 Next Session

**Priority Tasks:**
1. [ ] [Highest priority task]
2. [ ] [Second priority task]

**Prerequisites:**
- [X] [Something that must be done first - DONE]
- [ ] [Something that needs resolving]

**Notes for Future Self:**
- Remember to [important reminder]
- Watch out for [potential pitfall]

### 🔗 References Used
- [Resource](URL) - How it helped

### ⏱️ Time Breakdown
- Planning: XX minutes
- Implementation: XX minutes
- Debugging: XX minutes
- Testing: XX minutes

**Most Time-Consuming:** [What took longest]

---
```

### Step 7: Append to SESSION_NOTES.md

**Important:** Do not replace SESSION_NOTES.md - APPEND the new entry.

**Process:**
1. Read current SESSION_NOTES.md content
2. Find the insertion point (usually before "Session Template" or "Session Statistics")
3. Insert new session entry with separator (`---`)
4. Update session statistics at the bottom:
   - Increment total sessions count
   - Add to total time
   - Update status timeline if status changed

**Example Append Operation:**

```markdown
[Existing content...]

---

## Session 2024-01-16 10:00
[Previous session entry...]

---

## Session 2024-01-17 14:30    ← NEW ENTRY APPENDED HERE
**Duration:** 2.0 hours
**Status Change:** draft → in-progress

[New session content...]

---

## Session Template (Copy for New Sessions)
[Template remains...]

---

## Session Statistics

**Total Sessions:** 3  ← UPDATED
**Total Time:** 6.5 hours  ← UPDATED
[Rest of statistics...]
```

### Step 8: Update DECISIONS.md Frontmatter

Keep the work item’s rollup metrics in sync:

1. Read existing frontmatter values (`status`, `updated`, `total_sessions`, `total_hours`, `total_reacquisition_minutes`, `completed_tasks_total`).  
2. If status changed, set `status` and `updated` (current date).  
3. Increment `total_sessions` by 1.  
4. Add the new session duration (minutes or hours – stay consistent) to `total_hours`.  
5. Add the reacquisition minutes to `total_reacquisition_minutes`.  
6. Increment `completed_tasks_total` by the number of tasks finished in this session.  
7. Write the file back.

You can edit manually or use the helper script, e.g.:
```bash
node scripts/lib/frontmatter.js \
  path/to/DECISIONS.md \
  '{"total_sessions":4,"total_hours":8.5,"total_reacquisition_minutes":36,"completed_tasks_total":7,"status":"in-progress","updated":"2025-01-30"}'
```

**Manual Example:**

```yaml
---
id: 0001
title: User Authentication
status: in-progress  ← CHANGED from draft
updated: 2024-01-17  ← CHANGED from 2024-01-15
---
```

### Step 9: Suggest Next Tasks

Based on IMPLEMENTATION_PLAN.md (if it exists):

1. Read IMPLEMENTATION_PLAN.md
2. Find uncompleted tasks
3. Suggest logical next steps
4. Consider dependencies

**Example Suggestions:**

```
🎯 Suggested Next Tasks:

Based on your progress, here's what to focus on next:

**High Priority:**
1. Task 2.2 - Complete OAuth integration
   - Currently 80% done
   - Blocking tasks 3.1 and 3.2

2. Task 2.3 - Add unit tests for auth module
   - Needed before moving to Phase 3

**After Current Tasks:**
3. Task 3.1 - Build login UI component
   - Depends on Task 2.2 completion

**Estimated Time:** ~2-3 hours for priority tasks
```

### Step 10: Confirm and Summarize

Provide clear confirmation:

```
✅ Session saved successfully!

📁 Work: 0001-user-authentication-system
📝 Session: 2024-01-17 14:30 (2.0 hours)
📊 Status: draft → in-progress
📈 Progress: 25% → 40% (+15%)

## Session Summary:
✅ Completed: 5 tasks (Auth config, User model, API routes)
📝 Decisions: 2 technical decisions documented
🐛 Issues: 1 resolved (OAuth configuration)
📄 Files: 4 created, 2 modified
🧪 Tests: 8 new tests, all passing

## Current State:
✓ Phase 1: Setup (100% complete)
🔄 Phase 2: Core (60% complete)
⏹️  Phase 3: UI (not started)

## Next Session Focus:
1. Complete OAuth integration (Task 2.2)
2. Add unit tests (Task 2.3)
3. Start login UI component (Task 3.1)

💡 Estimated 2-3 hours to complete Phase 2

📍 Session saved in: cdd/0001-user-authentication-system/SESSION_NOTES.md
```

## Examples

### Example 1: Save Session with Auto-Detection

**User:** `/cdd:save-session`

**AI:**
```
🔍 Analyzing recent activity...

Found active work on:
📁 cdd/0001-user-authentication-system/

Recent changes detected:
- Created: lib/auth/config.ts, lib/auth/providers.ts
- Modified: prisma/schema.prisma

Is this correct? (y/n)
```

**User:** `y`

**AI:**
```
[Analyzes session, generates entry, appends to SESSION_NOTES.md]

✅ Session saved successfully!
[Confirmation summary...]
```

### Example 2: Save Session with Work ID

**User:** `/cdd:save-session 0001`

**AI:**
```
📝 Saving session for work 0001-user-authentication-system...

How long was this session?
A) < 1 hour
B) 1-2 hours
C) 2-3 hours
D) 3+ hours
```

**User:** `B`

**AI:**
```
Should the status change?
Current: draft

A) → in-progress
B) → blocked
C) No change
```

**User:** `A`

**AI:**
```
[Generates and appends session entry]

✅ Session saved!
Status updated: draft → in-progress
```

### Example 3: Save Session for Bug Work

**User:** `/cdd:save-session bugs/0001`

**AI:**
```
📝 Saving session for bug 0001-login-timeout...

[Detects bug-specific context]
[Generates session entry focused on debugging steps]
[Tracks issue resolution progress]

✅ Session saved!

Bug Status: 🔍 Root cause identified
Next: Implement fix in auth/session.ts
```

## Special Handling

### First Session for Work Item

If SESSION_NOTES.md is still the template (no sessions logged):

```
📝 This is the first session for this work item!

[Initializes session statistics]
[Sets initial status timeline]
[Adds first session entry]

✅ First session logged!

Work 0001 is now officially in progress.
```

### Multiple Work Items in One Session

If user worked on multiple items:

```
I detected work on multiple items:
1. 0001-user-authentication
2. 0002-dark-mode-toggle

Which should I record this session for?
Or type "both" to record separate sessions for each.
```

### No Changes Detected

If no files changed or work discussed:

```
⚠️  No changes detected in this conversation.

Did you work on this item in another session/tool?

Options:
1. Manually describe what you did
2. Skip saving this session
3. Use /cdd:complete-work if work is done
```

## Adaptive Session Notes

Customize session entry based on work type:

**Features:**
- Emphasize user-facing changes
- Track feature completeness
- Note UI/UX progress

**Bugs:**
- Focus on debugging steps
- Track root cause investigation
- Note fix verification

**Refactors:**
- Track code quality improvements
- Note before/after comparisons
- Ensure tests still pass

**Spikes:**
- Document research findings
- Track options evaluated
- Note recommendations

**Epics:**
- Track sub-feature progress
- Link to related work items
- Note strategic decisions

## Integration with Other Commands

### After `/cdd:plan-work`:
```
✅ Implementation plan created!

Ready to start? Use:
  /cdd:save-session 0001

After each work session to track progress.
```

### Before `/cdd:complete-work`:
```
Before marking as complete, record your final session:
  /cdd:save-session 0001

Then use:
  /cdd:complete-work 0001

To generate implementation summary.
```

## Remember

- **DO NOT** replace SESSION_NOTES.md, always APPEND
- **DO** update session statistics
- **DO** update DECISIONS.md status if changed
- **DO** be comprehensive but focused
- **DO** make entries helpful for future sessions
- **DO** suggest concrete next steps
- **DO** capture decisions and learnings in real-time
