---
description: Create a new work item with zero-ceremony quick start
author: EMB (Ezequiel M. Benitez) @emb715
version: 2.0.0
---

# /cdd:start - Create Work Item (v2)

> **Philosophy:** Get started in 30 seconds. No interviews, no ceremony, just work.

## What This Does

✅ Creates work item folder with auto-incremented ID
✅ Generates CONTEXT.md from your description
✅ Creates empty SESSIONS.md ready to log
✅ Smart type detection from keywords
✅ Optional metrics tracking with `--track-metrics`

## What This Does NOT Do

❌ No long interviews (v1 had 610 lines of questions)
❌ No template mode selection (single progressive template)
❌ No extensive frontmatter setup
❌ No automatic code analysis

## Usage

```bash
/cdd:start [description]
/cdd:start [description] --type=[feature|bug|refactor|spike|epic]
/cdd:start [description] --track-metrics
```

## Process

### Step 1: Parse Input

**Extract description and detect type from keywords:**

| Keywords | Auto-detected Type |
|----------|-------------------|
| fix, bug, issue, broken | bug |
| add, create, new, build | feature |
| refactor, cleanup, improve | refactor |
| research, explore, spike, investigate | spike |
| epic, initiative, large | epic |

**Examples:**
- "fix login timeout" → bug
- "add dark mode toggle" → feature
- "refactor database layer" → refactor
- "research caching strategies" → spike

**Flags:**
- `--type=X` - Override auto-detection
- `--track-metrics` - Enable optional metrics tracking

### Step 2: Determine Sequence Number

1. Scan `cdd/` directory for existing work items
2. Find highest sequence number (0001, 0002, etc.)
3. Increment by 1 for new work item

**Examples:**
- If `cdd/0001-user-auth/` exists, next is `0002`
- If no work items exist, start with `0001`

### Step 3: Generate Folder Name

Convert description to kebab-case:

**Examples:**
- "Fix Login Timeout" → `0002-fix-login-timeout`
- "Add Dark Mode Toggle" → `0003-add-dark-mode-toggle`
- "User Authentication System" → `0001-user-authentication-system`

### Step 4: Ask ONE Question

**Only ask for brief context (optional):**

```
📝 Creating [type]: XXXX-[name]

Quick context (optional - press Enter to skip):
- What's the core problem/goal?
- Any specific constraints or requirements?

(Keep it to 1-2 sentences, or leave blank)
```

**User can:**
- Provide 1-2 sentences
- Press Enter to skip (use description as-is)

### Step 5: Create Work Item

**Create folder structure:**
```
cdd/XXXX-work-name/
├── CONTEXT.md
└── SESSIONS.md
```

**Populate CONTEXT.md:**

1. Use template from `cdd/.meta/templates/v2/CONTEXT.md`
2. Fill in frontmatter:
   ```yaml
   id: XXXX
   title: [Title from description]
   type: [Detected or specified type]
   status: draft
   created: [Current date]
   updated: [Current date]
   ```
3. Fill Problem section from user input (or description)
4. Add placeholder Solution section
5. Add starter task checklist
6. Leave Context for AI and Decisions empty

**If `--track-metrics` flag:**
Add to frontmatter:
```yaml
metrics:
  sessions: 0
  hours: 0
  tasks_completed: 0
  tasks_planned: 0
```

**Create SESSIONS.md:**
Copy template from `cdd/.meta/templates/v2/SESSIONS.md`

### Step 6: Confirm Creation

**Show concise summary:**

```
✅ Work item created!

📁 cdd/XXXX-work-name/
🆔 ID: XXXX
📝 Type: [feature|bug|refactor|spike|epic]
📊 Metrics: [Enabled|Disabled]

📄 Files:
  ✓ CONTEXT.md - Ready to edit
  ✓ SESSIONS.md - Ready to log

🎯 Next:
  1. Edit CONTEXT.md to refine problem/solution
  2. Start working
  3. Use /cdd:log when you make progress

💡 Commands:
  /cdd:log          - Save session
  /cdd:plan [topic] - Multi-agent decision
  /cdd:done         - Mark complete
```

## Examples

### Example 1: Feature with Auto-Detection

**Input:**
```
/cdd:start add user authentication with OAuth
```

**AI Response:**
```
📝 Creating feature: 0001-add-user-authentication-with-oauth

Quick context (optional - press Enter to skip):
```

**User:** *(presses Enter)*

**AI:**
```
✅ Work item created!

📁 cdd/0001-add-user-authentication-with-oauth/
🆔 ID: 0001
📝 Type: feature
📊 Metrics: Disabled

📄 Files:
  ✓ CONTEXT.md
  ✓ SESSIONS.md

🎯 Next:
  1. Edit CONTEXT.md to add details
  2. Start working
  3. Use /cdd:log when you make progress
```

### Example 2: Bug with Context

**Input:**
```
/cdd:start fix login timeout after 5 minutes
```

**AI:**
```
📝 Creating bug: 0002-fix-login-timeout-after-5-minutes

Quick context (optional - press Enter to skip):
```

**User:**
```
Sessions expire too quickly, users complain about re-logging in constantly.
```

**AI:**
```
✅ Work item created!

📁 cdd/0002-fix-login-timeout-after-5-minutes/
🆔 ID: 0002
📝 Type: bug
📊 Metrics: Disabled

CONTEXT.md populated with:
  Problem: Sessions expire too quickly, users complain...

🎯 Start working and use /cdd:log to track progress.
```

### Example 3: With Metrics Tracking

**Input:**
```
/cdd:start refactor database connection pooling --track-metrics
```

**AI:**
```
✅ Work item created!

📁 cdd/0003-refactor-database-connection-pooling/
🆔 ID: 0003
📝 Type: refactor
📊 Metrics: ✅ Enabled

🎯 Metrics will be tracked automatically when you use /cdd:log
```

## Smart Defaults

**Title generation:**
- Capitalize first word
- Remove common prefixes ("fix the", "add a", etc.)
- Keep concise (max 60 chars for folder name)

**Type detection priority:**
1. Explicit `--type=` flag (highest)
2. Keyword detection from description
3. Ask user if ambiguous
4. Default to `feature` if unclear

**Metrics:**
- Default: OFF (zero overhead)
- Only enable with explicit `--track-metrics` flag

## Error Handling

**If sequence number collision:**
```
⚠️  Work item 0005 already exists.
   Using next available: 0006
```

**If no description provided:**
```
❌ Description required.

Usage: /cdd:start [description]

Example: /cdd:start add user authentication
```

**If git config missing (for author):**
Use "Unknown" as author, don't block creation.

## Implementation Notes

**Total length target:** ~150 lines (vs v1's 610 lines)

**Key simplifications:**
- No interview loop (removed ~300 lines)
- No template mode logic (removed ~100 lines)
- No extensive examples (removed ~150 lines)
- Single question instead of 8-step interview

**Files to read:**
- None! Pure creation from input.

**Files to write:**
- `cdd/XXXX-work-name/CONTEXT.md`
- `cdd/XXXX-work-name/SESSIONS.md`

**Git operations:**
- None during creation
- User commits when ready

---

**Remember:** Speed over perfection. Get started in 30 seconds, refine as you go.
