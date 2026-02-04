---
description: Save session progress with zero-ceremony auto-detection
author: EMB (Ezequiel M. Benitez) @emb715
version: 2.0.0
---

# /cdd:log - Save Session (v2)

## Usage

```bash
/cdd:log
/cdd:log [work-id]
/cdd:log --force  # Skip confirmations
```

## Process

### Step 1: Auto-Detect Work Item

Strategy 1 - From git changes:
```bash
git diff --name-only HEAD
```

Match changed files to work item folders:
- If files in `cdd/0001-*/` → Work item 0001
- If multiple work items touched → Ask user to pick

Strategy 2 - From conversation history:
- Check recent file reads/writes
- Look for CONTEXT.md references
- Find work item mentions

Strategy 3 - Ask user if unclear:
```
Which work item are you logging?
- 0001 - User Authentication (in-progress)
- 0002 - Dark Mode Toggle (draft)
- Other (specify ID or name)
```

### Step 2: Detect File Changes

Run git commands:
```bash
git diff --name-only HEAD  # Modified
git ls-files --others --exclude-standard  # New files
```

Categorize changes:
```
Created:
- src/auth/oauth.ts
- src/auth/jwt.ts

Modified:
- src/config/auth.config.ts
- package.json

Deleted:
- src/auth/legacy.ts
```

### Step 3: Match Files to Tasks

Read CONTEXT.md tasks section.

Parse tasks with `**Files:**` hints:
```markdown
- [ ] Setup OAuth provider
      **Files:** `src/auth/oauth.ts`, `src/auth/providers/*.ts`
```

Match detected files to task files:
- `src/auth/oauth.ts` created → Matches "Setup OAuth provider"
- Exact match or glob pattern match

Build completion suggestions:
```
Detected completions:
- Setup OAuth provider (src/auth/oauth.ts created)
- Create JWT service (src/auth/jwt.ts created)
```

### Step 4: Confirm with User

Show detection results:
```
Logging session for: 0001-user-authentication

Auto-detected changes:

Completed (auto-detected):
  - Setup OAuth provider
  - Create JWT service

Modified:
  - Auth config updated
  - Dependencies added

Mark these as complete? (y/n/edit)
```

Options:
- `y` - Accept all suggestions
- `n` - I'll tell you what's done
- `edit` - Let me adjust

If user chooses 'edit':
```
Which tasks completed? (comma-separated or checkboxes)

[x] Setup OAuth provider
[x] Create JWT service
[ ] Add login UI
[ ] Write tests

Or type task names: "OAuth, JWT"
```

### Step 5: Estimate Session Duration

Use conversation timestamps:
- First message in session → Last message
- Calculate hours elapsed

If unclear, quick ask:
```
Session duration? (quick estimate)
- 1h
- 2h
- 0.5h
- (or type custom like "1.5h")
```

### Step 6: Generate Session Entry

Create minimal session log:
```markdown
---

## 2024-01-15 14:30 (1.5h)

Completed:
- Setup OAuth provider
- Create JWT service

In Progress:
- Add login UI (started, 20% done)

Next:
- Finish login UI component
- Write tests for OAuth flow

---
```

Optional sections (only if present):
```markdown
Issues:
- CORS error with Google OAuth (fixed by adding origin to config)

Notes:
- JWT expiry set to 7 days (consider making configurable)
```

### Step 7: Update CONTEXT.md

Mark completed tasks:
```markdown
# Before
- [ ] Setup OAuth provider

# After
- [x] Setup OAuth provider
```

Update phase completion counts:
```markdown
# Before
<summary><strong>Phase 1: Foundation</strong> (0/3 complete)</summary>

# After
<summary><strong>Phase 1: Foundation</strong> (2/3 complete)</summary>
```

If metrics enabled, update frontmatter:
```yaml
metrics:
  sessions: 1  # Increment
  hours: 1.5  # Add duration
  tasks_completed: 2  # Add new completions
  tasks_planned: 8  # Total tasks
```

### Step 8: Append to SESSIONS.md

Read current SESSIONS.md.

Find insertion point:
- After front matter
- Before "Template" section
- At top of session history

Append new entry with `---` separator.

### Step 9: Confirm

Show concise summary:
```
Session logged!

Work: 0001-user-authentication
Duration: 1.5h
Completed: 2 tasks
Progress: 25% → 50% (+25%)

Updated:
  CONTEXT.md (2 tasks marked complete)
  SESSIONS.md (new entry appended)

Next priorities:
  1. Finish login UI component
  2. Write tests for OAuth flow

Use /cdd:log again after your next work session.
```

## Example

Input:
```
/cdd:log
```

AI:
```
Auto-detected: 0001-user-authentication

Files changed:
  Created: src/auth/oauth.ts, src/auth/jwt.ts
  Modified: src/config/auth.config.ts

Completed (inferred):
  - Setup OAuth provider
  - Create JWT service

Mark these as complete? (y/n/edit)
```

User: `y`

AI:
```
Session logged!

Work: 0001-user-authentication
Duration: 1.5h (estimated from conversation)
Completed: 2 tasks
Progress: 0% → 25%

Updated files:
  CONTEXT.md
  SESSIONS.md
```

## File-to-Task Matching

Exact match:
```markdown
Task files: src/auth/oauth.ts
Changed: src/auth/oauth.ts
→ 100% match
```

Glob pattern:
```markdown
Task files: src/auth/providers/*.ts
Changed: src/auth/providers/google.ts
→ Glob match
```

Partial match:
```markdown
Task files: src/components/Login.tsx
Changed: src/components/Login.tsx, src/components/Login.test.tsx
→ Partial match (suggest both task + tests done)
```

## Error Handling

No git repository:
```
Not a git repository. Cannot auto-detect changes.

Which work item are you logging?
[fallback to manual selection]
```

No changes detected:
```
No file changes detected.

Did you work on research/planning? (y/n)

[If yes, allow manual session log]
```

Work item not found:
```
Work item 0099 not found.

Available work items:
- 0001 - User Authentication
- 0002 - Dark Mode Toggle

Try: /cdd:log 0001
```

## Metrics (Optional)

If --track-metrics was enabled in /cdd:start, update frontmatter automatically:
```yaml
metrics:
  sessions: 3  # +1
  hours: 5.5  # +1.5
  tasks_completed: 6  # +2
```

If metrics NOT enabled: Skip all metrics updates (zero overhead).

Git commands used:
```bash
git diff --name-only HEAD
git ls-files --others --exclude-standard
git log -1 --format=%ct  # For timestamp
```
