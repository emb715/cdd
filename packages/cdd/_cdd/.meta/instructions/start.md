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

**Smart defaults:** Scan _cdd/ for recent work items. If >70% are same type, automatically use that type for ambiguous descriptions.

Flags: `--type=X` overrides detection. Default: feature

### 2. Determine Sequence Number

Scan `_cdd/` for `XXXX-*`. Use max + 1, start at 0001. Increment on collision.

### 3. Generate Folder Name

Format: `XXXX-kebab-case-description`. Lowercase, spaces→hyphens, no special chars.
Example: "Fix Login Timeout" → `0002-fix-login-timeout`

### 3.5. Check for Active Scope Plan (optional enrichment)

Before creating the work item, check if a scope plan exists:

Scan `_cdd/.meta/scope/` for `.md` files. If any exist:
- Read the most recent one
- Search its work items table for a row whose folder name or purpose matches the current description (case-insensitive, partial match)
- If a match is found, note: `scope_match = true`, extract: `scope_purpose`, `scope_phase`, `scope_depends_on`, `scope_folder_name`

If `scope_match = true`:
- Use `scope_folder_name` as the folder name (overrides Step 3 generation)
- Use the scope's detected type if no `--type` flag was given

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
5. If `scope_match = true`:
   - Fill "Solution" with `scope_purpose` (one-sentence purpose from the scope plan)
   - Add to "Context for AI" Notes: `Scope: _cdd/.meta/scope/[scope_file]`, `Phase: [scope_phase]`, and if depends_on is not `-`: `Depends on: [scope_depends_on]`
   - Infer 2-3 starter tasks specific to this item (use scope purpose as guide)
6. If `scope_match = false`:
   - Infer 3-5 starter tasks (check similar work items in _cdd/ for patterns), leave Solution/Context/Decisions empty

**SESSIONS.md:**
Copy template from `_cdd/.meta/templates/SESSIONS.md` as-is.

### 5. Output

```
Work item created!

_cdd/XXXX-work-name/
ID: XXXX
Type: [type]
[Scoped: _cdd/.meta/scope/[scope_file] — if scope_match = true]

Files:
  CONTEXT.md
  SESSIONS.md

Start working. Use /cdd:log when you make progress.
```

Exclude: Verbose next steps, example commands, process details, warnings.

## Execution Rules

Execute autonomously. No questions, confirmations, or blocks. Infer defaults.

Errors: Missing description → abort with usage. Missing _cdd/ or templates → abort, suggest init. Collision → use next number.

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

Start working. Use /cdd:log when you make progress.
```

**Scoped (active scope plan present):**

Input: `/cdd:start auth (scoped)`

Step 1: Strip `(scoped)` → description = `auth`
Step 3.5: Scope plan found, matched row `0001-auth` → scope_match = true
Folder: `0001-auth` (from scope, overrides generated name)

Output:
```
Work item created!

_cdd/0001-auth/
ID: 0001
Type: feature
Scoped: _cdd/.meta/scope/2026-03-14-greenfield-todo-app.md

Files:
  CONTEXT.md
  SESSIONS.md

Start working. Use /cdd:log when you make progress.
```
