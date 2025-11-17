---
version: 1.0
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
- Work ID: `/save-session 0001`
- Folder path: `/save-session cdd/0001-user-auth`
- Fuzzy name: `/save-session user auth`
- No parameter: `/save-session` (auto-detect from conversation)

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

1. **Find work item folder** using flexible matching (same as `/plan-work`)
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

### Step 4: Determine Session Duration

Try to estimate session duration:
- Calculate from conversation timestamps (first to last message)
- If timestamps not available, ask user:
  ```
  How long was this session?
  A) < 1 hour
  B) 1-2 hours
  C) 2-3 hours
  D) 3+ hours
  E) Enter custom (e.g., "2.5 hours")
  ```

### Step 5: Determine Status Change

Compare current status to previous:
- Read DECISIONS.md frontmatter for current status
- Check if work should transition to a new status
- Common transitions:
  - `draft` → `in-progress` (started working)
  - `in-progress` → `blocked` (hit a blocker)
  - `blocked` → `in-progress` (blocker resolved)
  - `in-progress` → `complete` (work finished - use `/complete-work` instead)

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

If status changed, update DECISIONS.md:

1. Read DECISIONS.md
2. Update frontmatter:
   - `status`: New status value
   - `updated`: Current date
3. Save DECISIONS.md

**Example Update:**

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

**User:** `/save-session`

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

**User:** `/save-session 0001`

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

**User:** `/save-session bugs/0001`

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
3. Use /complete-work if work is done
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

### After `/plan-work`:
```
✅ Implementation plan created!

Ready to start? Use:
  /save-session 0001

After each work session to track progress.
```

### Before `/complete-work`:
```
Before marking as complete, record your final session:
  /save-session 0001

Then use:
  /complete-work 0001

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

---

**Command Version:** 1.0
**Release Date:** 2025-10-29
**Author:** EMB (Ezequiel M. Benitez) @emb715
**Part of:** CDD v1.0 Methodology
