---
description: Save session progress with zero-ceremony auto-detection
author: EMB (Ezequiel M. Benitez) @emb715
version: 2.0.0
---

# /cdd:log - Save Session (v2)

> **Philosophy:** Log your progress in 10 seconds. Auto-detect everything, minimal questions.

## What This Does

✅ Auto-detects work item from git changes
✅ Infers completed tasks from file changes
✅ Estimates session duration from conversation
✅ Updates CONTEXT.md task checkboxes automatically
✅ Appends minimal entry to SESSIONS.md
✅ Optional metrics tracking (if enabled)

## What This Does NOT Do

❌ No duration questions (A/B/C/D/E - removed)
❌ No reacquisition time tracking (removed)
❌ No manual task selection (auto-inferred)
❌ No metrics scripts unless --track-metrics
❌ No extensive frontmatter updates

## Usage

```bash
/cdd:log
/cdd:log [work-id]
/cdd:log --force  # Skip confirmations
```

## Process

### Step 1: Auto-Detect Work Item

**Strategy 1: From git changes**
```bash
git diff --name-only HEAD
```

Match changed files to work item folders:
- If files in `cdd/0001-*/` → Work item 0001
- If multiple work items touched → Ask user to pick

**Strategy 2: From conversation history**
- Check recent file reads/writes
- Look for CONTEXT.md references
- Find work item mentions

**Strategy 3: Ask user**
If unclear:
```
🔍 Which work item are you logging?
- 0001 - User Authentication (in-progress)
- 0002 - Dark Mode Toggle (draft)
- Other (specify ID or name)
```

### Step 2: Detect File Changes

**Run git commands:**
```bash
git diff --name-only HEAD  # Modified
git ls-files --others --exclude-standard  # New files
```

**Categorize changes:**
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

**Read CONTEXT.md tasks section:**

Parse tasks with `**Files:**` hints:
```markdown
- [ ] Setup OAuth provider
      **Files:** `src/auth/oauth.ts`, `src/auth/providers/*.ts`
```

**Match detected files to task files:**
- `src/auth/oauth.ts` created → Matches "Setup OAuth provider"
- Exact match or glob pattern match

**Build completion suggestions:**
```
Detected completions:
✅ Setup OAuth provider (src/auth/oauth.ts created)
✅ Create JWT service (src/auth/jwt.ts created)
```

### Step 4: Confirm with User

**Show detection results:**
```
📝 Logging session for: 0001-user-authentication

🔍 Auto-detected changes:

✅ Completed (auto-detected):
  - Setup OAuth provider
  - Create JWT service

🔄 Modified:
  - Auth config updated
  - Dependencies added

Mark these as complete? (y/n/edit)
```

**Options:**
- `y` - Accept all suggestions
- `n` - I'll tell you what's done
- `edit` - Let me adjust

**If user chooses 'edit':**
```
Which tasks completed? (comma-separated or checkboxes)

[x] Setup OAuth provider
[x] Create JWT service
[ ] Add login UI
[ ] Write tests

Or type task names: "OAuth, JWT"
```

### Step 5: Estimate Session Duration

**Use conversation timestamps:**
- First message in session → Last message
- Calculate hours elapsed

**If unclear, quick ask:**
```
Session duration? (quick estimate)
- 1h
- 2h
- 0.5h
- (or type custom like "1.5h")
```

### Step 6: Generate Session Entry

**Create minimal session log:**
```markdown
---

## 2024-01-15 14:30 (1.5h)

✅ **Completed:**
- Setup OAuth provider
- Create JWT service

🔄 **In Progress:**
- Add login UI (started, 20% done)

📝 **Next:**
- Finish login UI component
- Write tests for OAuth flow

---
```

**Optional sections (only if present):**
```markdown
🐛 **Issues:**
- CORS error with Google OAuth (fixed by adding origin to config)

💡 **Notes:**
- JWT expiry set to 7 days (consider making configurable)
```

### Step 7: Update CONTEXT.md

**Mark completed tasks:**
```markdown
# Before
- [ ] Setup OAuth provider

# After
- [x] Setup OAuth provider
```

**Update phase completion counts:**
```markdown
# Before
<summary><strong>Phase 1: Foundation</strong> (0/3 complete)</summary>

# After
<summary><strong>Phase 1: Foundation</strong> (2/3 complete)</summary>
```

**If metrics enabled:**
Update frontmatter:
```yaml
metrics:
  sessions: 1  # Increment
  hours: 1.5  # Add duration
  tasks_completed: 2  # Add new completions
  tasks_planned: 8  # Total tasks
```

### Step 8: Append to SESSIONS.md

**Read current SESSIONS.md**

**Find insertion point:**
- After front matter
- Before "Template" section
- At top of session history

**Append new entry** with `---` separator

### Step 9: Confirm

**Show concise summary:**
```
✅ Session logged!

📁 Work: 0001-user-authentication
⏱️  Duration: 1.5h
✅ Completed: 2 tasks
📊 Progress: 25% → 50% (+25%)

Updated:
  ✓ CONTEXT.md (2 tasks marked complete)
  ✓ SESSIONS.md (new entry appended)

📝 Next priorities:
  1. Finish login UI component
  2. Write tests for OAuth flow

Use /cdd:log again after your next work session.
```

## Examples

### Example 1: Auto-Detection Success

**Input:**
```
/cdd:log
```

**AI:**
```
🔍 Auto-detected: 0001-user-authentication

📝 Files changed:
  Created: src/auth/oauth.ts, src/auth/jwt.ts
  Modified: src/config/auth.config.ts

✅ Completed (inferred):
  - Setup OAuth provider
  - Create JWT service

Mark these as complete? (y/n/edit)
```

**User:** `y`

**AI:**
```
✅ Session logged!

📁 Work: 0001-user-authentication
⏱️  Duration: 1.5h (estimated from conversation)
✅ Completed: 2 tasks
📊 Progress: 0% → 25%

Updated files:
  ✓ CONTEXT.md
  ✓ SESSIONS.md
```

### Example 2: Manual Specification

**Input:**
```
/cdd:log 0002
```

**AI:**
```
📝 Logging for: 0002-dark-mode-toggle

No file changes detected. What did you work on?

(Describe briefly, or list task names)
```

**User:** `Research dark mode patterns, decided on CSS variables approach`

**AI:**
```
✅ Session logged!

📝 Logged research session (30min estimated)

Next: Start implementation with CSS variables
```

### Example 3: Multiple Work Items

**Input:**
```
/cdd:log
```

**AI:**
```
🔍 Detected changes in multiple work items:

1. 0001-user-authentication (3 files)
2. 0003-database-refactor (2 files)

Which are you logging? (1, 2, or both)
```

**User:** `1`

**AI:**
```
📝 Logging for 0001-user-authentication only...
[continues with normal flow]
```

## Smart Features

### File-to-Task Matching

**Exact match:**
```markdown
Task files: src/auth/oauth.ts
Changed: src/auth/oauth.ts
→ 100% match
```

**Glob pattern:**
```markdown
Task files: src/auth/providers/*.ts
Changed: src/auth/providers/google.ts
→ Glob match
```

**Partial match:**
```markdown
Task files: src/components/Login.tsx
Changed: src/components/Login.tsx, src/components/Login.test.tsx
→ Partial match (suggest both task + tests done)
```

### Session Duration Estimation

**From conversation timestamps:**
- If clear session start/end → Calculate
- If unclear → Quick ask

**Defaults:**
- Single message exchange → 15min
- Extended conversation → 1h
- If git commits → Use commit timestamps

### Progress Calculation

**Count tasks:**
```
Total tasks: 8
Completed: 4
Progress: 50%
```

**Phase-level:**
```
Phase 1: 3/3 (100%)
Phase 2: 1/5 (20%)
Overall: 4/8 (50%)
```

## Error Handling

**No git repository:**
```
⚠️  Not a git repository. Cannot auto-detect changes.

Which work item are you logging?
[fallback to manual selection]
```

**No changes detected:**
```
ℹ️  No file changes detected.

Did you work on research/planning? (y/n)

[If yes, allow manual session log]
```

**Work item not found:**
```
❌ Work item 0099 not found.

Available work items:
- 0001 - User Authentication
- 0002 - Dark Mode Toggle

Try: /cdd:log 0001
```

## Metrics (Optional)

**If --track-metrics was enabled in /cdd:start:**

Update frontmatter automatically:
```yaml
metrics:
  sessions: 3  # +1
  hours: 5.5  # +1.5
  tasks_completed: 6  # +2
```

**If metrics NOT enabled:**
Skip all metrics updates (zero overhead)

## Implementation Notes

**Total length target:** ~200 lines (vs v1's 973 lines)

**Key simplifications:**
- No duration questions (removed ~50 lines)
- No reacquisition tracking (removed ~80 lines)
- No manual task selection loop (removed ~150 lines)
- No metrics script execution (removed ~100 lines)
- No extensive validation (removed ~200 lines)

**Git commands used:**
```bash
git diff --name-only HEAD
git ls-files --others --exclude-standard
git log -1 --format=%ct  # For timestamp
```

**Files to read:**
- `cdd/XXXX-work-name/CONTEXT.md` - Task list
- `cdd/XXXX-work-name/SESSIONS.md` - Append target

**Files to write:**
- `cdd/XXXX-work-name/CONTEXT.md` - Update checkboxes
- `cdd/XXXX-work-name/SESSIONS.md` - Append entry

---

**Remember:** Log fast, log often. Every session counts, no matter how small.
