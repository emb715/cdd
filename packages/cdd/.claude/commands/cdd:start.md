---
description: Create a new work item with zero-ceremony quick start
author: EMB (Ezequiel M. Benitez) @emb715
version: 2.0.0
---

# /cdd:start - Create Work Item (v2)

## Usage

```bash
/cdd:start [description]
/cdd:start [description] --type=[feature|bug|refactor|spike|epic]
/cdd:start [description] --track-metrics
```

## Process

### Step 1: Parse Input

Extract description and detect type from keywords:

| Keywords | Auto-detected Type |
|----------|-------------------|
| fix, bug, issue, broken | bug |
| add, create, new, build | feature |
| refactor, cleanup, improve | refactor |
| research, explore, spike, investigate | spike |
| epic, initiative, large | epic |

Flags:
- `--type=X` - Override auto-detection
- `--track-metrics` - Enable optional metrics tracking

### Step 2: Determine Sequence Number

1. Scan `cdd/` directory for existing work items
2. Find highest sequence number (0001, 0002, etc.)
3. Increment by 1 for new work item

If `cdd/0001-user-auth/` exists, next is `0002`. If no work items exist, start with `0001`.

### Step 3: Generate Folder Name

Convert description to kebab-case:
- "Fix Login Timeout" → `0002-fix-login-timeout`
- "Add Dark Mode Toggle" → `0003-add-dark-mode-toggle`

### Step 4: Ask ONE Question

Only ask for brief context (optional):

```
Creating [type]: XXXX-[name]

Quick context (optional - press Enter to skip):
- What's the core problem/goal?
- Any specific constraints or requirements?

(Keep it to 1-2 sentences, or leave blank)
```

User can provide 1-2 sentences or press Enter to skip (use description as-is).

### Step 5: Create Work Item

Create folder structure:
```
cdd/XXXX-work-name/
├── CONTEXT.md
└── SESSIONS.md
```

Populate CONTEXT.md:

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

If `--track-metrics` flag, add to frontmatter:
```yaml
metrics:
  sessions: 0
  hours: 0
  tasks_completed: 0
  tasks_planned: 0
```

Create SESSIONS.md by copying template from `cdd/.meta/templates/v2/SESSIONS.md`

### Step 6: Confirm Creation

Show concise summary:

```
Work item created!

cdd/XXXX-work-name/
ID: XXXX
Type: [feature|bug|refactor|spike|epic]
Metrics: [Enabled|Disabled]

Files:
  CONTEXT.md - Ready to edit
  SESSIONS.md - Ready to log

Next:
  1. Edit CONTEXT.md to refine problem/solution
  2. Start working
  3. Use /cdd:log when you make progress

Commands:
  /cdd:log          - Save session
  /cdd:plan [topic] - Multi-agent decision
  /cdd:done         - Mark complete
```

## Example

Input:
```
/cdd:start add user authentication with OAuth
```

AI Response:
```
Creating feature: 0001-add-user-authentication-with-oauth

Quick context (optional - press Enter to skip):
```

User presses Enter

AI:
```
Work item created!

cdd/0001-add-user-authentication-with-oauth/
ID: 0001
Type: feature
Metrics: Disabled

Files:
  CONTEXT.md
  SESSIONS.md

Next:
  1. Edit CONTEXT.md to add details
  2. Start working
  3. Use /cdd:log when you make progress
```

## Error Handling

If sequence number collision:
```
Work item 0005 already exists. Using next available: 0006
```

If no description provided:
```
Description required.

Usage: /cdd:start [description]
Example: /cdd:start add user authentication
```

If git config missing (for author): Use "Unknown" as author, don't block creation.

Type detection priority:
1. Explicit `--type=` flag (highest)
2. Keyword detection from description
3. Ask user if ambiguous
4. Default to `feature` if unclear
