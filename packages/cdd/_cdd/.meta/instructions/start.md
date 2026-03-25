# Honest Agent Instructions: /cdd:start

Execute CDD start workflow autonomously. No questions, no confirmation prompts.

**Efficiency:** Read templates once, reuse in memory. Use minimal git calls.

## Input

- `description`: User-provided work item description
- `flags`: --type=[feature|bug|refactor|spike|epic]

## Steps

### 1. Parse Input

Extract description. Strip trailing `(scoped)` token if present (case-insensitive) — it is a user hint for scope detection, not part of the description. Example: `auth (scoped)` → description = `auth`.

Detect type (case-insensitive):
- fix|bug|issue|broken → bug
- add|create|new|build → feature
- refactor|cleanup|improve|optimize → refactor
- research|explore|spike|investigate → spike
- epic|initiative|large → epic

**Smart defaults:** Scan _cdd/ for recent work items. If >70% are same type, default to that type for ambiguous descriptions.

Flags: `--type=X` overrides detection. Default: feature

### 2. Determine Sequence Number

Scan `_cdd/` for `XXXX-*`. Use max + 1, start at 0001. Increment on collision.

### 3. Generate Folder Name

Format: `XXXX-kebab-case-description`. Lowercase, spaces→hyphens, no special chars.
Example: "Fix Login Timeout" → `0002-fix-login-timeout`

### 3.5. Check for Active Scope Plan (optional enrichment)

Only applies when the user passes `(scoped)` in the description (e.g. `/cdd:start auth (scoped)`).

Find the most recent `.md` file in `_cdd/scope/`. Read its work items table and find the row matching the description. If a unique match is found (`scope_match = true`), extract: `scope_purpose`, `scope_phase`, `scope_depends_on`, `scope_folder_name`. Use `scope_folder_name` as the folder name and the scope's type if no `--type` flag was given.

If no match or ambiguous match: `scope_match = false`, proceed without enrichment.

### 4. Create Work Item Structure

Create folder:
```
_cdd/XXXX-work-name/
```

Copy and populate templates:

**CONTEXT.md:**
1. Read template: `_cdd/.meta/templates/CONTEXT.md`
2. Fill frontmatter: `id`, `title`, `type`, `status: draft`, `created`, `updated` (YYYY-MM-DD)
3. Fill "Original Prompt" with raw user input (preserve exactly as entered)
4. Fill "Why (Problem)" with description
5. Fill "Purpose" — one sentence stating what this item exists to deliver. Observable and testable. Derive from the description:
   - feature → what the user/system can do when it's working ("Users can X")
   - bug → what condition is gone ("The Y error no longer occurs under Z conditions")
   - refactor → what structural property is achieved ("Module X has no external dependencies and all tests pass")
   - spike → what is known ("Decision on X is made with documented tradeoffs")
   If `scope_match = true`, use `scope_purpose` instead.
6. If `scope_match = true`:
   - Add to "Context for AI" Notes: `Scope: _cdd/scope/[scope_file]`, `Phase: [scope_phase]`, and if depends_on is not `-`: `Depends on: [scope_depends_on]`
   - Infer 2-3 starter tasks using scope_purpose as guide
7. If `scope_match = false`:
   - Infer 3-5 starter tasks from description and similar work items in _cdd/

**SESSIONS.md:**
Copy template from `_cdd/.meta/templates/SESSIONS.md` as-is.

### 4.5. Create STATUS.md

Read `_cdd/.meta/templates/STATUS.md`. Populate and write to `_cdd/XXXX-work-name/STATUS.md`:
- `work_id`: folder name (e.g., `0003-add-user-authentication-with-oauth`)
- `phase`: 1
- `phase_label`: Phase 1 name from CONTEXT.md (or `Phase 1` if not yet defined)
- `phase_progress`: `0/N` where N = count of tasks in Phase 1 (count `- [ ]` lines in Phase 1 block)
- `last_completed`: none
- `active_task`: description of first unchecked task in Phase 1 (one line), or `none` if tasks are empty stubs
- `next_pending`: description of second unchecked task (one line), or `none`
- `blockers`: none
- `updated`: current date and time (YYYY-MM-DD HH:MM)

### 4.6. Trigger Planner Agent (opt-in, async)

Only if the user passed `--plan` flag: spawn a Planner agent using the Task tool with `run_in_background: true`.

**Subagent type:** `cdd-honest`
**Description:** "Plan work item"
**Model:** `sonnet`
**run_in_background:** true

**Agent prompt:**
```
Execute CDD planner workflow.

Work item: _cdd/[WORK_FOLDER]/CONTEXT.md

Instructions: Read and follow _cdd/.meta/instructions/plan.md

Execute autonomously. Do NOT ask questions.
```

Do NOT wait for the Planner agent. It enriches CONTEXT.md in the background.

### 5. Output

Print immediately (do not wait for Planner):

Without `--plan`:
```
Work item created!

_cdd/XXXX-work-name/
ID: XXXX
Type: [type]
[Scoped: _cdd/scope/[scope_file] — if scope_match = true]

Files:
  CONTEXT.md
  SESSIONS.md
  STATUS.md
```

With `--plan`:
```
Work item created!

_cdd/XXXX-work-name/
ID: XXXX
Type: [type]

Files:
  CONTEXT.md
  SESSIONS.md
  STATUS.md

Planning in background — CONTEXT.md will be enriched shortly.
```

Exclude: Verbose next steps, example commands, process details, warnings.

## Execution Rules

Execute autonomously. No questions, confirmations, or blocks. Infer defaults.

Errors: Missing description → abort with usage. Missing _cdd/ or templates → abort, suggest init. Collision → use next number. Missing git → use "Unknown".

## Examples

**Standard:**

Input: `/cdd:start add user authentication with OAuth`

Detected: type=feature (keyword "add"), sequence=0003, folder=`0003-add-user-authentication-with-oauth`

Output:
```
Work item created!

_cdd/0003-add-user-authentication-with-oauth/
ID: 0003
Type: feature

Files:
  CONTEXT.md
  SESSIONS.md
  STATUS.md

Start working. Use /cdd:log when you make progress.
```

**Scoped (active scope plan present):**

Input: `/cdd:start auth (scoped)`

Output:
```
Work item created!

_cdd/0001-auth/
ID: 0001
Type: feature
Scoped: _cdd/scope/2026-03-14-greenfield-todo-app.md

Files:
  CONTEXT.md
  SESSIONS.md
  STATUS.md

Start working. Use /cdd:log when you make progress.
```
