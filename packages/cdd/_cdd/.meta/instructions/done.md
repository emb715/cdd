# Honest Agent Instructions: /cdd:done

Execute CDD completion workflow autonomously. Mark work item complete and generate optional summary.

**Efficiency:** Read CONTEXT.md and SESSIONS.md once, reuse data for summary. Batch writes.

## Input

- `work_id`: Optional
- `flags`: --summary (generate IMPLEMENTATION_SUMMARY.md), --skip-log

## Steps

### 1. Identify Work Item

Auto-detect (same as /cdd:log): Git changes → Conversation context → Latest in-progress. Do not ask.

### 2. Verify Completion

Read CONTEXT.md. Count tasks: total, `- [x]`, `- [ ]`. Calculate percentage. If <100%: note in output, proceed anyway.

### 3. Final Session Log

Unless --skip-log:

```markdown
## YYYY-MM-DD HH:MM (Xh) - COMPLETED

**Work Summary:** [1-2 sentences from Solution]
**Final Stats:** Tasks X/Y (ZZ%), Sessions N, Time Xh
**Key Learnings:** [From decisions/sessions]
**Status:** draft → complete
```

Append to SESSIONS.md.

### 4. Update CONTEXT.md

Frontmatter: `status: complete`, `completed: YYYY-MM-DD`, `updated: YYYY-MM-DD`

### 5. Implementation Summary

If --summary: Create `IMPLEMENTATION_SUMMARY.md`:

```markdown
# Implementation Summary: [Title]
> Generated: YYYY-MM-DD | Work Item: XXXX | Duration: Xh

## What Was Built
[Solution + completed tasks]

## Key Decisions
[Decisions section + decision doc links]

## How It Works / Testing / Future Considerations
[Tasks + file changes + test tasks + session TODOs]

## Quick Reference
**Files:** [git changes] | **Commands:** [task commands] | **Related:** [decisions/, docs]
```

Source: CONTEXT.md, SESSIONS.md, decisions/, git log

### 6. Output

```
Work item completed!

ID: XXXX-work-name
Status: draft → complete
Duration: Xh (N sessions)
Tasks: X/Y completed (ZZ%)

Updated:
  CONTEXT.md (status: complete)
  SESSIONS.md (final entry)
  [IMPLEMENTATION_SUMMARY.md (generated)]

[If <100%: Note: X tasks remain open]

Ready to ship. Use /cdd:start for next work item.
```

Exclude: Archive prompts, verbose congratulations, reopen suggestions.

## Error Handling

- Not found: `Work item [ID] not found. Available: [list]. Use /cdd:done [ID]`
- Already complete: `Work item [ID] already complete (completed: YYYY-MM-DD). Use /cdd:start for new work.`
- No sessions: Proceed, warn: `Note: No session history found. Consider logging sessions with /cdd:log.`
- Missing CONTEXT.md: `Work item [ID] missing CONTEXT.md. Corrupted work item.`

## Execution Rules

Trust user. No confirmations. Infer from existing files. Never archive.

## Summary Intelligence

Source: CONTEXT.md + SESSIONS.md
- What: Solution + completed tasks
- Decisions: Decisions section + decision docs
- How: Tasks + file changes
- Testing: test|spec|e2e tasks + coverage
- Future: TODO|consider|defer from sessions
- Quick ref: git changes + task commands

Pattern analysis:
- Frequent files → core implementation
- Recurring issues → tech debt
- Unfinished "Next" → future work

## Example

Input: `/cdd:done --summary`

Detected: work=0001, completion=8/10 (80%), duration=5.5h (3 sessions)

Output:
```
Work item completed!

ID: 0001-user-authentication
Status: draft → complete
Duration: 5.5h (3 sessions)
Tasks: 8/10 completed (80%)

Updated:
  CONTEXT.md (status: complete)
  SESSIONS.md (final entry)
  IMPLEMENTATION_SUMMARY.md (generated)

Note: 2 tasks remain open but work item marked complete.

Ready to ship. Use /cdd:start for next work item.
```
