---
description: Mark work item complete with optional summary
author: EMB (Ezequiel M. Benitez) @emb715
version: 2.0.0
---

# /cdd:done - Complete Work Item (v2)

## Usage

```bash
/cdd:done
/cdd:done [work-id]
/cdd:done --summary  # Generate IMPLEMENTATION_SUMMARY.md
/cdd:done --skip-log  # Don't add final session
```

## Process

### Step 1: Identify Work Item

Same auto-detection as /cdd:log:
- From git changes
- From conversation history
- Ask if unclear

```
Completing work item...

Which work item are you finishing?
- 0001 - User Authentication (in-progress)
- 0002 - Dark Mode (in-progress)
```

### Step 2: Verify Completion

Read CONTEXT.md and check:
- Are all tasks marked complete?
- Any open tasks remaining?

If incomplete tasks found:
```
Some tasks are not complete:

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

Add completion entry to SESSIONS.md with work completed, final stats, key learnings.

If --skip-log flag, skip this step.

### Step 4: Update Status

Update CONTEXT.md frontmatter: status to complete, add completed date, update metrics if enabled.

### Step 5: Optional Summary Generation

If --summary flag, ask user to generate IMPLEMENTATION_SUMMARY.md.

Template sections: What Was Built, Key Decisions, How It Works, Testing, Future Considerations, Quick Reference.

Source data from CONTEXT.md, SESSIONS.md, decisions/, git log.

### Step 6: Archive (Optional)

Ask: Keep in cdd/ (recommended), move to .archive/, or delete. Most keep for reference.

### Step 7: Confirm Completion

Show: Work ID, status transition, duration, task completion, files updated, next steps.

## Example

Input: `/cdd:done`

Process:
1. Identify work item (0001-user-authentication)
2. Check tasks (8/8 complete)
3. Ask for final session log
4. Update CONTEXT.md status
5. Optionally generate summary
6. Confirm completion with stats

## Error Handling

- Work item not found: Show available items
- Already complete: Offer to reopen, update summary, or cancel
- No sessions logged: Warn and ask to confirm

Completion is the end of the story. Ship and move on.
