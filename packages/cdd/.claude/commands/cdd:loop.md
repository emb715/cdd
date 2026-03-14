---
description: Full-cycle work item orchestrator with context rotation and parallel task execution
author: EMB (Ezequiel M. Benitez) @emb715
version: 1.0.0
---

# /cdd:loop

## Usage

```
/cdd:loop
/cdd:loop [work-id]
/cdd:loop --resume      # Resume from checkpoint
/cdd:loop --dry-run     # Plan task groups only, no implementation
```

## Activation

On invocation:
1. Parse input: work-id (optional), --resume flag, --dry-run flag
2. Check for _cdd/[work-id]/.loop/.resume — if found, set resume_mode=true
3. Read _cdd/.meta/loop.config.yaml into session variables (see Config)
4. Execute the protocols below in order

## Orchestrator Rules (Hard)

- Never implement code directly — always spawn sub-agents via Task tool
- Emit status after every event
- Never ask user questions — auto-detect everything
- All state persists to disk — loop survives context resets losslessly
- Spawn parallel tasks in a SINGLE message (multiple Task calls = true parallelism)

## State Files (written to _cdd/[work-id]/.loop/)

- loop-log.md      — append-only event log
- loop-status.json — task groups + per-task status
- checkpoint.md    — full restore state (written at rotation)
- .resume          — raw resume command (read by Stop hook)

## Config

On activation, read _cdd/.meta/loop.config.yaml and store ALL fields as session variables.
If file missing, use these defaults:

```
rotation_threshold: 4
agent_timeout_seconds: 120
agent_stuck_threshold_seconds: 30
task_max_retries: 1
review_enabled: true
auto_done: true
```

event_counter = 0 (resets each new context window — measures current window consumption)

---

## Protocol: DETECT WORK ITEM

Detection chain (never ask):
1. git diff --name-only HEAD — find _cdd/XXXX-* path — use that work-id
2. Conversation context — look for explicitly mentioned work-id
3. Latest modified directory in _cdd/ — use that

---

## Protocol: INITIALIZE (fresh start)

1. Create _cdd/[work-id]/.loop/ directory
2. Write loop-log.md header:
   ```
   # Loop Log: [work-id]
   Started: [ISO timestamp]
   ---
   ```
3. Read _cdd/[work-id]/CONTEXT.md — extract all unchecked tasks (- [ ])
4. For each task: extract description, done-when criteria, Files: field (= file_scope)
5. Run PARALLEL SAFETY to build task groups
6. Write loop-status.json (schema at end of file)
7. If --dry-run: print planned groups, exit

---

## Protocol: RESUME

1. Read _cdd/[work-id]/.loop/checkpoint.md
   Restore: completed_tasks, pending_tasks, current_group_index
2. Read loop-status.json — restore per-task status
3. Append to loop-log.md: "RESUMED | [ISO timestamp]"
4. Reset event_counter = 0
5. Jump to EXECUTE at current_group_index

---

## Protocol: PARALLEL SAFETY

Input: tasks with optional file_scope
Output: ordered list of task groups

Rules:
- Task with no Files: field — solo sequential group (size=1, parallel=false)
- Tasks whose Files: sets share any path string — different groups (sequential between groups)
- Tasks with no overlap — same group (parallel=true)

Algorithm:
```
current_group = []
groups = []
for task in pending_tasks:
  if task.file_scope is empty:
    flush current_group to groups
    groups.append([task])   # solo sequential
    current_group = []
  elif overlaps(task.file_scope, files already in current_group):
    flush current_group to groups
    current_group = [task]
  else:
    current_group.append(task)
flush current_group to groups
```

Store computed groups in loop-status.json.task_groups.
On resume: read stored groups — do NOT recompute (preserves original grouping).

---

## Protocol: EXECUTE

For each group (starting from current_group_index):

### Step 1 — Status

```
[LOOP] event={N}/{rotation_threshold} | group={G} | done={X} | pending={Y}
  Starting: [task descriptions]
```

### Step 2 — Spawn

If group.parallel = true:
  Spawn ALL tasks in ONE message (multiple Task calls — required for true parallelism):
  Each Task: run_in_background=true, subagent=cdd-honest

  Prompt per task:
  ```
  Implement this task for CDD work item [work-id].

  Task: [description]
  Done when: [criteria]
  Files: [file_scope list]
  Context: Read _cdd/[work-id]/CONTEXT.md for full work item context.

  Do not ask questions. Auto-detect patterns from existing codebase.
  End your output with exactly: TASK_[ID]_COMPLETE
  ```

If group.parallel = false:
  Spawn single Task (same prompt), wait for completion before proceeding.

Record spawn timestamp in loop-status.json per task: "started": "[ISO timestamp]"

### Step 3 — Wait, health-check, collect

While waiting for TASK_[ID]_COMPLETE sentinels:

  HEALTH CHECK every agent_timeout_seconds:
    For each running task where (now - started) > agent_timeout_seconds:
      Ping: emit status request to the task
      Wait agent_stuck_threshold_seconds for any response
      If no response:
        Emit: [LOOP] WARNING: Task [ID] appears stuck ([N]s without output)
        If task.retry_count < task_max_retries:
          Cancel task, increment retry_count in loop-status.json
          Re-spawn with same prompt
          Append: "RETRY | Task [ID] | attempt [N]" to loop-log.md
        Else:
          Mark task "error" in loop-status.json
          Append: "STUCK | Task [ID] | marked error after [N] retries" to loop-log.md
          Continue — do not block entire group for one stuck task

When sentinel received: mark task "done", record completed timestamp in loop-status.json.

### Step 4 — Update state

Update loop-status.json: mark all completed tasks in group as "done", group.status = "done"
Append to loop-log.md:
```
## [timestamp] Group [G] Complete
Tasks: [list] | Files touched: [list]
event_counter: [N]/{rotation_threshold}
```
event_counter += 1 — run CHECK ROTATION before continuing

### Step 5 — Auto-log

Spawn log agent (Task, run_in_background=false, subagent=cdd-honest):
```
Execute /cdd:log for work item [work-id].
Follow _cdd/.meta/instructions/log.md. Auto-detect changes. No questions.
```
Wait for completion.
Append: "Session logged | progress: X%→Y%" to loop-log.md
event_counter += 1 — run CHECK ROTATION before continuing

After all groups complete: run REVIEW

---

## Protocol: REVIEW

If config.review_enabled = false: skip directly to COMPLETION CHECK.

Spawn review agent (Task, run_in_background=true, subagent=cdd-victor-reid):
```
Review implementation for CDD work item [work-id].

Tasks completed this session: [list with descriptions]
Files changed: [list from loop-log.md]
Acceptance criteria: read done-when fields from _cdd/[work-id]/CONTEXT.md for each task.

End your output with exactly one of:
LOOP_REVIEW_COMPLETE: PASS
LOOP_REVIEW_COMPLETE: ISSUES_FOUND | [itemized issues, one per line]
```

Apply same HEALTH CHECK as task agents (agent_timeout_seconds).
Wait for sentinel.

If ISSUES_FOUND:
  Append issues to loop-log.md under "## [timestamp] Review Issues"
  Emit warning to user
  Continue to COMPLETION CHECK — do not block on review issues

event_counter += 1 — run CHECK ROTATION
Run COMPLETION CHECK

---

## Protocol: CHECK ROTATION

If event_counter < rotation_threshold: return (no rotation needed)

If event_counter >= rotation_threshold:
  1. Write _cdd/[work-id]/.loop/checkpoint.md:
     ```
     # Loop Checkpoint: [work-id]
     timestamp: [ISO]
     event_counter: [N]
     current_group_index: [index of next group to run]
     completed_tasks: [comma-separated list of task IDs]
     pending_tasks: [comma-separated list of remaining task IDs]
     ---
     Resume: /cdd:loop [work-id] --resume
     ```
  2. Write _cdd/[work-id]/.loop/.resume (single line):
     ```
     /cdd:loop [work-id] --resume
     ```
  3. Append to loop-log.md:
     ```
     ## [timestamp] CONTEXT ROTATION
     event_counter: [N] | checkpoint saved | pending: [N] tasks
     Resume: /cdd:loop [work-id] --resume
     ```
  4. Emit to user:
     ```
     [LOOP] Context rotation at event [N]. State saved to checkpoint.
     Resume: /cdd:loop [work-id] --resume
     (Stop hook auto-resumes if configured — see Stop Hook Setup below)
     ```
  5. Emit sentinel: LOOP_ROTATION_COMPLETE
  6. STOP — do not continue

---

## Protocol: COMPLETION CHECK

Read _cdd/[work-id]/CONTEXT.md — count unchecked (- [ ]) tasks.

If 0 unchecked and config.auto_done = true:
  Spawn done agent (Task, run_in_background=false, subagent=cdd-honest):
  ```
  Execute /cdd:done for work item [work-id].
  Follow _cdd/.meta/instructions/done.md. Auto-detect. No questions.
  ```
  Wait for completion.
  Delete _cdd/[work-id]/.loop/.resume if it exists.
  Append: "COMPLETE | [ISO timestamp]" to loop-log.md
  Emit: LOOP_DONE — [work-id] complete.

If unchecked tasks remain:
  Emit: [LOOP] [N] tasks remain unchecked. Review _cdd/[work-id]/CONTEXT.md.
  STOP — human decides. Never auto-done with unchecked tasks.

---

## loop-status.json Schema

```json
{
  "work_id": "XXXX-work-name",
  "loop_version": "1.0",
  "status": "running",
  "started": "ISO timestamp",
  "updated": "ISO timestamp",
  "event_counter": 0,
  "rotation_threshold": 4,
  "task_groups": [
    {
      "group": 1,
      "parallel": true,
      "tasks": ["1.1", "1.2"],
      "status": "pending"
    }
  ],
  "tasks": {
    "1.1": {
      "description": "Task description",
      "status": "pending",
      "file_scope": ["src/auth/oauth.ts"],
      "started": null,
      "completed": null,
      "retry_count": 0
    }
  },
  "review_results": [],
  "current_group_index": 0
}
```

status values — task: pending | running | done | error | skipped
status values — top-level: running | rotating | complete | error

---

## Stop Hook Setup

For automatic resume after context rotation, add to .claude/settings.json:

```json
{
  "hooks": {
    "Stop": [{"matcher": "", "hooks": [{"type": "command",
      "command": "bash .claude/hooks/cdd-loop-resume.sh"}]}]
  }
}
```

Stop hook reads .resume, outputs the command, Claude Code treats stdout as next user turn.
If no hook configured: loop prints the resume command — paste it manually to continue.
State is never lost either way.

---

## Example

```
/cdd:loop 0003-add-oauth

Detecting work item... 0003-add-oauth (5 tasks)
Reading _cdd/.meta/loop.config.yaml... rotation_threshold=4
Planning task groups...
  Group 1 (parallel):    Task 1.1 [src/auth/oauth.ts], Task 1.2 [src/auth/types.ts]
  Group 2 (sequential):  Task 1.3 [src/auth/oauth.ts, src/auth/session.ts]
  Group 3 (parallel):    Task 2.1 [src/ui/LoginButton.tsx], Task 2.2 [src/ui/OAuthCallback.tsx]

[LOOP] event=0/4 | group=1 | done=0 | pending=5
  Starting: Task 1.1, Task 1.2 (parallel)
[LOOP] event=1/4 | group=1 complete | done=2 | pending=3
[LOOP] event=2/4 | session logged | progress 0%→40%
[LOOP] event=3/4 | group=2 complete | done=3 | pending=2
[LOOP] event=4/4 | session logged → ROTATION TRIGGERED
[LOOP] Context rotation at event 4. State saved.
Resume: /cdd:loop 0003-add-oauth --resume
```

---

## Error Handling

- No tasks in CONTEXT.md: abort — "No unchecked tasks in _cdd/[work-id]/CONTEXT.md."
- Work item already complete: abort — "Already complete. Use /cdd:start for new work."
- loop-status.json missing on resume: rebuild from CONTEXT.md (checked=done, unchecked=pending)
- Task agent returns no sentinel after retries: mark "error" in loop-status.json, continue
- Unparseable Files field: treat as no file_scope — run task as sequential solo group
