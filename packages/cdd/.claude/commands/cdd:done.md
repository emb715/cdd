---
description: Mark work item complete with optional summary
author: EMB (Ezequiel M. Benitez) @emb715
version: 2.0.0
---

# /cdd:done - Complete Work Item (v2)

> **Philosophy:** Ship it. Mark complete, optionally summarize, move on.

## What This Does

✅ Marks work item status as `complete`
✅ Adds final session log entry
✅ Optionally generates IMPLEMENTATION_SUMMARY.md
✅ Updates CONTEXT.md frontmatter
✅ Archives work item (optional)

## What This Does NOT Do

❌ No extensive summary generation (was 1,033 lines in v1)
❌ No mandatory documentation
❌ No complex workflows

## Usage

```bash
/cdd:done
/cdd:done [work-id]
/cdd:done --summary  # Generate IMPLEMENTATION_SUMMARY.md
/cdd:done --skip-log  # Don't add final session
```

## Process

### Step 1: Identify Work Item

**Same auto-detection as /cdd:log:**
- From git changes
- From conversation history
- Ask if unclear

```
🏁 Completing work item...

Which work item are you finishing?
- 0001 - User Authentication (in-progress)
- 0002 - Dark Mode (in-progress)
```

### Step 2: Verify Completion

**Read CONTEXT.md and check:**
- Are all tasks marked complete?
- Any open tasks remaining?

**If incomplete tasks found:**
```
⚠️  Some tasks are not complete:

Open tasks:
- [ ] Write integration tests
- [ ] Update documentation

Mark as done anyway? (y/n/edit)

Options:
- y: Mark complete (tasks will stay unchecked)
- n: Cancel, finish tasks first
- edit: Let me mark tasks now
```

### Step 3: Final Session Log

**Add completion entry to SESSIONS.md:**

```markdown
---

## 2024-01-16 16:00 (FINAL SESSION)

✅ **Work Completed:**
- All core functionality implemented
- Tests passing
- Documentation updated

🎉 **Status:** Complete

📊 **Final Stats:**
- Tasks: 8/8 (100%)
- Sessions: 5
- Total time: ~12h

💡 **Key Learnings:**
- OAuth integration was simpler than expected
- JWT token rotation added extra security
- Consider adding refresh token in v2

---
```

**If --skip-log flag:**
Skip this step, just update status.

### Step 4: Update Status

**Modify CONTEXT.md frontmatter:**

```yaml
# Before
status: in-progress
updated: 2024-01-15

# After
status: complete
updated: 2024-01-16
completed: 2024-01-16
```

**If metrics enabled:**
```yaml
metrics:
  sessions: 5
  hours: 12.0
  tasks_completed: 8
  tasks_planned: 8
  completion_rate: 100
```

### Step 5: Optional Summary Generation

**If --summary flag provided:**

Ask user:
```
📝 Generate IMPLEMENTATION_SUMMARY.md?

This creates a concise summary of:
- What was built
- Key decisions made
- How it works
- Future considerations

Generate summary? (y/n)
```

**If yes, create IMPLEMENTATION_SUMMARY.md:**

```markdown
# Implementation Summary: [Work Title]

**Completed:** YYYY-MM-DD
**Duration:** X sessions, ~Xh total
**Status:** ✅ Complete

## What Was Built

[1-2 paragraphs describing what was implemented]

## Key Decisions

[Reference major decisions from CONTEXT.md Decisions section]

- **[Decision 1]:** Brief rationale
- **[Decision 2]:** Brief rationale

See full decisions in [decisions/](decisions/) folder.

## How It Works

[Brief technical overview - 2-4 paragraphs]

**Key Components:**
- `file.ts` - Purpose
- `another.ts` - Purpose

**Data Flow:**
[Simple description of how pieces connect]

## Testing

**Test coverage:**
- Unit tests: X files
- Integration tests: X files
- All tests passing ✅

**Manual testing:**
[What was tested manually]

## Future Considerations

**Potential improvements:**
- [ ] Enhancement idea 1
- [ ] Enhancement idea 2

**Known limitations:**
- Limitation 1
- Limitation 2

**If you revisit this:**
- Context in SESSIONS.md
- Decisions in decisions/ folder
- Tests in src/**/*.test.ts

---

**Quick Reference:**
- Main logic: `src/path/to/main.ts`
- Tests: `src/path/to/main.test.ts`
- Config: `config/file.ts`
```

### Step 6: Archive (Optional)

**Ask user:**
```
📦 Archive this work item?

Options:
1. Keep in cdd/ (recommended for reference)
2. Move to cdd/.archive/
3. Delete work item folder

Choose: (1/2/3)
```

**Most users choose 1** (keep for reference)

### Step 7: Confirm Completion

**Show summary:**

```
✅ Work item completed!

📁 Work: 0001-user-authentication
🏁 Status: draft → in-progress → complete
⏱️  Duration: 5 sessions, ~12h
✅ Tasks: 8/8 (100%)

Files updated:
  ✓ CONTEXT.md (status: complete)
  ✓ SESSIONS.md (final entry added)
  ✓ IMPLEMENTATION_SUMMARY.md (created)

🎉 Great work! This work item is now complete.

📖 Summary available at:
   cdd/0001-user-authentication/IMPLEMENTATION_SUMMARY.md

🎯 Next:
   Start new work with /cdd:start [description]
```

## Examples

### Example 1: Simple Completion

**Input:**
```
/cdd:done
```

**AI:**
```
🏁 Completing: 0001-user-authentication

✅ All tasks complete (8/8)

Add final session log? (y/n)
```

**User:** `y`

**AI:**
```
Final session notes (what did you finish?):
```

**User:** `Finished tests and docs, everything working.`

**AI:**
```
✅ Work item completed!

📁 0001-user-authentication
🏁 Status: complete
⏱️  5 sessions, ~12h

Updated:
  ✓ CONTEXT.md
  ✓ SESSIONS.md

Start new work: /cdd:start [description]
```

### Example 2: With Summary

**Input:**
```
/cdd:done --summary
```

**AI:**
```
🏁 Completing: 0001-user-authentication

✅ All tasks complete
📝 Generating IMPLEMENTATION_SUMMARY.md...

[Reads CONTEXT.md, SESSIONS.md, decisions/]
[Generates summary]

✅ Work item completed!

📄 Files:
  ✓ CONTEXT.md (status: complete)
  ✓ SESSIONS.md (final entry)
  ✓ IMPLEMENTATION_SUMMARY.md (created)

📖 Summary includes:
  - What was built
  - Key decisions (OAuth choice, JWT strategy)
  - How it works (auth flow diagram)
  - Future considerations

Read: cdd/0001-user-authentication/IMPLEMENTATION_SUMMARY.md
```

### Example 3: Incomplete Tasks

**Input:**
```
/cdd:done 0002
```

**AI:**
```
⚠️  Work item 0002-dark-mode has incomplete tasks:

Completed: 6/10 (60%)
Open:
- [ ] Add dark mode to settings page
- [ ] Write tests
- [ ] Update docs
- [ ] Test on mobile

Mark as done anyway? (y/n/edit)
```

**User:** `edit`

**AI:**
```
Let's update task status. Which are actually done?

[x] Create CSS variables
[x] Add theme toggle component
[x] Update header styling
[x] Update sidebar styling
[x] Update forms styling
[x] Update modals styling
[ ] Add dark mode to settings page (skip - not needed)
[x] Write tests (actually done, just forgot to check)
[ ] Update docs (skip for now)
[ ] Test on mobile (skip for v1)

Confirm these changes? (y/n)
```

**User:** `y`

**AI:**
```
✅ Updated task status (7/10 complete)

Proceeding with completion...

✅ Work item completed!
```

## Smart Features

### Auto-Summary Generation

**If --summary flag, AI generates based on:**
- CONTEXT.md (problem, solution, decisions)
- SESSIONS.md (what was done each session)
- decisions/ folder (major decisions made)
- Git log (files changed, commit messages)

**Tone:** Concise, factual, helpful for future reference

### Completion Validation

**Checks:**
- Task completion percentage
- Are there open blockers in SESSIONS.md?
- Is status already "complete"?

**Smart prompts:**
```
⚠️  Last session mentioned blocker: "API rate limit issue"

Was this resolved? (y/n)
```

### Metric Finalization

**If metrics enabled:**

Calculate and save final stats:
```yaml
metrics:
  sessions: 5
  hours: 12.0
  tasks_completed: 8
  tasks_planned: 8
  completion_rate: 100
  avg_session_duration: 2.4
  velocity: 1.6  # tasks per session
```

## Error Handling

**If work item not found:**
```
❌ Work item 0099 not found.

Available work items:
- 0001 - User Authentication (in-progress)
- 0002 - Dark Mode (in-progress)

Try: /cdd:done 0001
```

**If already complete:**
```
ℹ️  Work item 0001 is already marked complete.

Completed: 2024-01-16

Options:
1. Reopen (change status to in-progress)
2. Update summary
3. Cancel

Choose: (1/2/3)
```

**If no sessions logged:**
```
⚠️  No sessions logged for this work item.

This suggests you haven't tracked work with /cdd:log.

Mark complete anyway? (y/n)
```

## Implementation Notes

**Total length target:** ~150 lines (vs v1's 1,033 lines)

**Key simplifications:**
- No mandatory summary (was ~400 lines of generation)
- No extensive frontmatter updates (was ~200 lines)
- No complex validation (was ~150 lines)
- Simple status update + optional summary

**Files to read:**
- `cdd/XXXX-work-name/CONTEXT.md` - Check tasks, decisions
- `cdd/XXXX-work-name/SESSIONS.md` - Session history

**Files to write:**
- `cdd/XXXX-work-name/CONTEXT.md` - Update status
- `cdd/XXXX-work-name/SESSIONS.md` - Final entry
- `cdd/XXXX-work-name/IMPLEMENTATION_SUMMARY.md` - Optional

**Git operations:**
- None (user commits when ready)

---

**Remember:** Completion is the end of the story. Make it satisfying but don't overdo it. Ship and move on.
