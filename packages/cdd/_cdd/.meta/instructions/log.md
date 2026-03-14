# Honest Agent Instructions: /cdd:log

Execute CDD session logging workflow autonomously. Auto-detect work item, changes, and completions.

**Efficiency:** Minimal git calls (diff + untracked), read CONTEXT.md once, batch file operations.

## Input

- `work_id`: Optional (e.g., "0001" or "0001-user-auth")
- `flags`: --force (skip confirmations)

## Steps

### 1. Detect Work Item

If work_id provided, use it. Otherwise try in order:
1. Git changes: `git diff --name-only HEAD` → match `_cdd/XXXX-*/` (most frequent if multiple)
2. Conversation context: Recent file paths → extract ID
3. Latest: Highest sequence in `_cdd/`

Never ask user.

### 2. Detect Changes

```bash
git diff --name-only HEAD  # Modified/deleted
git ls-files --others --exclude-standard  # New
```

Categorize: Created, Modified, Deleted.
Ignore: `node_modules/`, `.git/`, `dist/`, `build/`, lock files (unless package.json changed).

### 3. Match to Tasks

Read `_cdd/XXXX-work-name/CONTEXT.md` tasks. Match changes to task file hints:

- Exact: Path matches exactly → auto-complete
- Glob: Matches pattern (`src/auth/*.ts`) → auto-complete
- Partial: Path contains substring + tests exist → auto-complete
- Created file + task says "create" → auto-complete

**Pattern learning:** If same file touched in multiple sessions, mark related tasks as in-progress even if not explicitly matched.

### 4. Estimate Duration

Priority order:
1. Conversation metadata (if available)
2. Calculate from SESSIONS.md average (if >2 prior sessions)
3. Default: 1 hour

Never ask user.

### 5. Generate Entry

Before generating, review recent SESSIONS.md entries for context:
- Recurring issues → note as blocker
- Similar file patterns → infer task connections
- Prior "Next" items → prioritize if still incomplete

```markdown
## YYYY-MM-DD HH:MM (Xh)

**Completed:**
- Task names

**In Progress:**
- Task (XX% based on files)

**Next:**
- Inferred priorities (prioritize items from prior sessions' "Next")

[Optional: **Issues:** / **Notes:**]
```

### 6. Update CONTEXT.md

Mark completed tasks: `- [ ]` → `- [x]`. Update phase counts and percentages.

If metrics enabled:
- Increment `sessions`, add `hours`, update `tasks_completed`, `tasks_planned`

Update `updated:` date (YYYY-MM-DD).

### 7. Append to SESSIONS.md

Insert after frontmatter, before template. Add `---` separator. Newest first.

### 8. Output

```
Session logged!

Work: XXXX-work-name
Duration: Xh
Completed: N tasks
Progress: XX% → YY% (+ZZ%)

Updated:
  CONTEXT.md (N tasks marked complete)
  SESSIONS.md (new entry)

Next priorities:
  1. [Task from CONTEXT.md]
  2. [Second task]
```

Exclude: Verbose changes, irrelevant paths, prompts, multiple examples.

## Task Matching

Exact path = task → complete. Glob match → complete. Partial + tests → complete. No match → pending.

## Error Handling

- Not git repo: Use conversation context, proceed
- No changes: Log "In Progress" only
- Work item not found: `Work item [ID] not found. Available: [list]. Use /cdd:log [ID]`
- Missing CONTEXT.md: `Work item [ID] missing CONTEXT.md. Corrupted.`
- Missing SESSIONS.md: Create from template

## Execution Rules

Auto-complete matches. No confirmations. Infer progress. Estimate duration. Clean summary output.

Edge cases: Multiple items → most frequent. No tasks → file summary. All complete → review notes. Missing SESSIONS.md → create.

## Example

Input: `/cdd:log`

Detected: work=0001 (git changes), changes=`src/auth/oauth.ts` (created), matched="Setup OAuth provider", duration=1h

Output:
```
Session logged!

Work: 0001-user-authentication
Duration: 1h
Completed: 1 task
Progress: 0% → 20% (+20%)

Updated:
  CONTEXT.md (1 task marked complete)
  SESSIONS.md (new entry)

Next priorities:
  1. Create JWT service
  2. Add login UI component
```
