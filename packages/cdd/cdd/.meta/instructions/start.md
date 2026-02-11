# Honest Agent Instructions: /cdd:start

Execute CDD start workflow autonomously. No questions, no confirmation prompts.

**Efficiency:** Read templates once, reuse in memory. Use minimal git calls.

## Input

- `description`: User-provided work item description
- `flags`: --type=[feature|bug|refactor|spike|epic]

## Steps

### 1. Parse Input

Extract description. Detect type (case-insensitive):
- fix|bug|issue|broken → bug
- add|create|new|build → feature
- refactor|cleanup|improve|optimize → refactor
- research|explore|spike|investigate → spike
- epic|initiative|large → epic

**Smart defaults:** Scan cdd/ for recent work items. If >70% are same type, suggest that type for ambiguous descriptions.

Flags: `--type=X` overrides detection. Default: feature

### 2. Determine Sequence Number

Scan `cdd/` for `XXXX-*`. Use max + 1, start at 0001. Increment on collision.

### 3. Generate Folder Name

Format: `XXXX-kebab-case-description`. Lowercase, spaces→hyphens, no special chars.
Example: "Fix Login Timeout" → `0002-fix-login-timeout`

### 4. Create Work Item Structure

Create folder:
```
cdd/XXXX-work-name/
```

Copy and populate templates:

**CONTEXT.md:**
1. Read template: `cdd/.meta/templates/v2/CONTEXT.md`
2. Fill frontmatter: `id`, `title`, `type`, `status: draft`, `created`, `updated` (YYYY-MM-DD)
3. Fill "Why (Problem)" with description
4. Infer 3-5 starter tasks (check similar work items in cdd/ for patterns), leave Solution/Context/Decisions empty

**SESSIONS.md:**
Copy template from `cdd/.meta/templates/v2/SESSIONS.md` as-is.

### 5. Output

```
Work item created!

cdd/XXXX-work-name/
ID: XXXX
Type: [type]

Files:
  CONTEXT.md
  SESSIONS.md

Start working. Use /cdd:log when you make progress.
```

Exclude: Verbose next steps, example commands, process details, warnings.

## Execution Rules

Execute autonomously. No questions, confirmations, or blocks. Infer defaults.

Errors: Missing description → abort with usage. Missing cdd/ or templates → abort, suggest init. Collision → use next number. Missing git → use "Unknown".

## Example

Input: `/cdd:start add user authentication with OAuth`

Detected: type=feature (keyword "add"), sequence=0003, folder=`0003-add-user-authentication-with-oauth`

Output:
```
Work item created!

cdd/0003-add-user-authentication-with-oauth/
ID: 0003
Type: feature

Files:
  CONTEXT.md
  SESSIONS.md

Start working. Use /cdd:log when you make progress.
```
