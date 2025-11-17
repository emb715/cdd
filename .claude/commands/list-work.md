---
version: 1.0
description: List and filter all work items in the CDD system
author: EMB (Ezequiel M. Benitez) @emb715
---

# List Work Items

You are tasked with displaying a comprehensive list of all work items in the CDD system, with optional filtering and sorting capabilities.

## Critical Rules - READ FIRST

1. **DO NOT** modify any files
2. **MUST** scan the cdd/ directory for all work items
3. **MUST** read frontmatter from each DECISIONS.md
4. **SHOULD** present in clear, scannable format
5. **SHOULD** support filtering by status, type, priority

## Process

### Step 1: Receive Command

User may request:
- `/list-work` - List all work items
- `/list-work --status=in-progress` - Filter by status
- `/list-work --type=bug` - Filter by type
- `/list-work --priority=high` - Filter by priority
- `/list-work --status=draft --type=feature` - Multiple filters

### Step 2: Scan for Work Items

Search the cdd/ directory structure:

```
cdd/
├── XXXX-work-name/           ← Feature work items
├── bugs/
│   └── XXXX-work-name/       ← Bug work items
├── refactor/
│   └── XXXX-work-name/       ← Refactor work items
├── spikes/
│   └── XXXX-work-name/       ← Spike work items
└── epics/
    └── XXXX-work-name/       ← Epic work items
```

**Scan Strategy:**
1. Find all directories matching pattern: `XXXX-*` or `*/XXXX-*`
2. Check each for DECISIONS.md file
3. If DECISIONS.md exists, it's a valid work item
4. Extract work ID from folder name

### Step 3: Extract Metadata

For each work item, read DECISIONS.md frontmatter:

```yaml
---
id: 0001
title: User Authentication System
type: feature
status: in-progress
priority: high
created: 2024-01-15
updated: 2024-01-20
author: John Doe
tags: "auth, security, backend"
---
```

**Extract:**
- ID
- Title
- Type (feature, bug, refactor, spike, epic)
- Status (draft, in-progress, blocked, complete)
- Priority (critical, high, medium, low)
- Created date
- Updated date
- Author
- Tags

**Handle Missing/Invalid Data:**
- If frontmatter missing, show [Unknown] for fields
- If file doesn't parse, mark as [Invalid]
- Still include in list but flag the issue

### Step 4: Apply Filters

If filters specified, apply them:

**Status Filter:**
- `--status=draft` - Only draft items
- `--status=in-progress` - Only in-progress items
- `--status=blocked` - Only blocked items
- `--status=complete` - Only complete items

**Type Filter:**
- `--type=feature` - Only features
- `--type=bug` - Only bugs
- `--type=refactor` - Only refactors
- `--type=spike` - Only spikes
- `--type=epic` - Only epics

**Priority Filter:**
- `--priority=critical` - Only critical items
- `--priority=high` - Only high priority
- `--priority=medium` - Only medium priority
- `--priority=low` - Only low priority

**Combined Filters:**
- Multiple filters use AND logic
- Example: `--status=in-progress --priority=high` shows only high-priority in-progress items

### Step 5: Sort Work Items

**Default Sort:** By ID (ascending)

**Optional Sorts:**
- `--sort=updated` - Most recently updated first
- `--sort=created` - Most recently created first
- `--sort=priority` - Critical → High → Medium → Low
- `--sort=status` - draft → in-progress → blocked → complete

### Step 6: Display Work Items

Present in clear, scannable table format:

**Compact View (Default):**

```
📋 CDD Work Items (XX total)

┌──────┬────────────────────────────┬──────────┬────────────┬──────────┐
│ ID   │ Title                      │ Type     │ Status     │ Priority │
├──────┼────────────────────────────┼──────────┼────────────┼──────────┤
│ 0001 │ User Authentication System │ Feature  │ Complete   │ High     │
│ 0002 │ Dark Mode Toggle           │ Feature  │ In Progress│ Medium   │
│ 0003 │ API Rate Limiting          │ Feature  │ Draft      │ High     │
├──────┼────────────────────────────┼──────────┼────────────┼──────────┤
│ B001 │ Login Timeout Issue        │ Bug      │ In Progress│ Critical │
│ B002 │ Profile Image Upload       │ Bug      │ Draft      │ Medium   │
├──────┼────────────────────────────┼──────────┼────────────┼──────────┤
│ R001 │ Database Query Optimization│ Refactor │ Draft      │ Low      │
├──────┼────────────────────────────┼──────────┼────────────┼──────────┤
│ S001 │ GraphQL vs REST Evaluation │ Spike    │ Complete   │ Medium   │
├──────┼────────────────────────────┼──────────┼────────────┼──────────┤
│ E001 │ V2 Platform Redesign       │ Epic     │ In Progress│ Critical │
└──────┴────────────────────────────┴──────────┴────────────┴──────────┘

Use `/show-work [ID]` to see details
```

**Extended View (with `--details`):**

```
📋 CDD Work Items - Detailed View

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 0001 | User Authentication System
   📁 cdd/0001-user-authentication-system/
   📝 Type: Feature | Status: ✅ Complete | Priority: High
   👤 Author: John Doe
   📅 Created: 2024-01-15 | Updated: 2024-01-20
   🏷️  Tags: auth, security, backend
   📊 Progress: 42/42 tasks (100%)
   ⏱️  Duration: 5 sessions, 10.5 hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 0002 | Dark Mode Toggle
   📁 cdd/0002-dark-mode-toggle/
   📝 Type: Feature | Status: 🔄 In Progress | Priority: Medium
   👤 Author: Jane Smith
   📅 Created: 2024-01-17 | Updated: 2024-01-20
   🏷️  Tags: ui, theme, accessibility
   📊 Progress: 8/15 tasks (53%)
   ⏱️  Duration: 2 sessions, 3.5 hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[... more items ...]
```

### Step 7: Provide Summary Statistics

After table, show summary:

```
📊 Summary Statistics:

By Status:
  ✅ Complete: 3 items (30%)
  🔄 In Progress: 5 items (50%)
  📝 Draft: 1 item (10%)
  🚧 Blocked: 1 item (10%)

By Type:
  🎨 Features: 5 items (50%)
  🐛 Bugs: 3 items (30%)
  🔧 Refactors: 1 item (10%)
  🔬 Spikes: 1 item (10%)

By Priority:
  🔴 Critical: 2 items (20%)
  🟠 High: 4 items (40%)
  🟡 Medium: 3 items (30%)
  🟢 Low: 1 item (10%)

Total Work Items: 10
Active (in-progress): 5
Completed: 3
Pending (draft): 2
```

### Step 8: Provide Action Suggestions

Based on current state, suggest actions:

```
🎯 Suggested Actions:

High Priority Items:
  → Work 0003 (API Rate Limiting) is Draft - Run /plan-work 0003
  → Bug B001 (Login Timeout) is Critical - Focus here first!

Blocked Items:
  → Work 0005 needs attention - Review blockers

Recently Updated:
  → Work 0002 updated today - Continue work with /save-session 0002

Ready to Complete:
  → Work 0006 at 95% - Consider /complete-work 0006

💡 Quick Commands:
  /show-work [ID]     - View work item details
  /plan-work [ID]     - Generate implementation plan
  /save-session [ID]  - Save session progress
  /complete-work [ID] - Mark as complete
```

## Examples

### Example 1: List All Work

**User:** `/list-work`

**AI:**
```
📋 CDD Work Items (10 total)

[Table of all work items...]

📊 Summary Statistics:
[Statistics...]

🎯 Suggested Actions:
[Suggestions...]
```

### Example 2: Filter by Status

**User:** `/list-work --status=in-progress`

**AI:**
```
📋 CDD Work Items - Filtered: Status = In Progress

┌──────┬────────────────────────────┬──────────┬────────────┬──────────┐
│ ID   │ Title                      │ Type     │ Status     │ Priority │
├──────┼────────────────────────────┼──────────┼────────────┼──────────┤
│ 0002 │ Dark Mode Toggle           │ Feature  │ In Progress│ Medium   │
│ B001 │ Login Timeout Issue        │ Bug      │ In Progress│ Critical │
│ E001 │ V2 Platform Redesign       │ Epic     │ In Progress│ Critical │
└──────┴────────────────────────────┴──────────┴────────────┴──────────┘

Showing 3 of 10 total work items

🎯 Focus Areas:
- Bug B001 is Critical priority - address first
- Epic E001 has multiple dependencies
- Work 0002 progressing well (53% complete)
```

### Example 3: Filter by Type and Priority

**User:** `/list-work --type=bug --priority=critical`

**AI:**
```
📋 CDD Work Items - Filtered: Type = Bug, Priority = Critical

┌──────┬─────────────────────┬──────┬────────────┬──────────┐
│ ID   │ Title               │ Type │ Status     │ Priority │
├──────┼─────────────────────┼──────┼────────────┼──────────┤
│ B001 │ Login Timeout Issue │ Bug  │ In Progress│ Critical │
└──────┴─────────────────────┴──────┴────────────┴──────────┘

Showing 1 of 10 total work items

🚨 Critical Bug Requires Attention!
This is the only critical bug - should be top priority.

Current status: In Progress
Last updated: 2 hours ago
Progress: Root cause identified, fix in progress

Next step: /save-session B001 to track fix progress
```

### Example 4: No Work Items Found

**User:** `/list-work`

**AI:**
```
📋 CDD Work Items

No work items found in cdd/

Get started by creating your first work item:
  /create-work [description]

Examples:
  /create-work user authentication system
  /create-work fix login timeout bug
  /create-work refactor database queries

Or learn more about CDD:
  See: cdd/.meta/README.md
```

### Example 5: Detailed View

**User:** `/list-work --details`

**AI:**
```
📋 CDD Work Items - Detailed View

[Extended card view for each item...]

Total: 10 work items displayed
Use filters to narrow down: --status, --type, --priority
```

## Special Views

### Dashboard View (`--dashboard`)

Show visual dashboard:

```
📊 CDD Dashboard

┌─────────────────────────────────────────────────────────┐
│  Status Distribution                                     │
│  ████████████░░░░░░░░ 50% In Progress (5)               │
│  ██████░░░░░░░░░░░░░░ 30% Complete (3)                  │
│  ████░░░░░░░░░░░░░░░░ 10% Draft (1)                     │
│  ██░░░░░░░░░░░░░░░░░░ 10% Blocked (1)                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Priority Breakdown                                      │
│  🔴 Critical: 2    🟠 High: 4    🟡 Medium: 3   🟢 Low: 1│
└─────────────────────────────────────────────────────────┘

Recent Activity (Last 7 Days):
  📝 3 work items created
  ✅ 1 work item completed
  🔄 12 sessions logged
  ⏱️  22.5 hours total time

Top Priority Items:
  🔴 B001 - Login Timeout Issue (In Progress)
  🔴 E001 - V2 Platform Redesign (In Progress)
  🟠 0003 - API Rate Limiting (Draft)
```

### Quick Status (`--quick`)

Minimal output:

```
📋 Quick Status

✅ Complete: 3
🔄 Active: 5
📝 Pending: 2

Total: 10 items
```

## Integration with Other Commands

### From List to Action:

```
User sees work item in list
   ↓
/show-work [ID]        → View details
   ↓
/plan-work [ID]        → Generate plan
   ↓
/save-session [ID]     → Track work
   ↓
/complete-work [ID]    → Finish work
```

### In Workflow:

```
Morning routine:
  /list-work --status=in-progress
  → See what's active
  → Continue work on item
  → Use /save-session when done

Planning routine:
  /list-work --status=draft
  → See what needs planning
  → Run /plan-work on priority items

Review routine:
  /list-work --dashboard
  → See overall project health
  → Identify bottlenecks
```

## Remember

- **DO** provide clear, scannable output
- **DO** support multiple filtering options
- **DO** show helpful statistics
- **DO** suggest next actions
- **DO NOT** modify any files
- **DO NOT** overwhelm with too much info (use compact view by default)

## Future Enhancements

Ideas for future versions:
- Export to CSV/JSON
- Search by tags or keywords
- Group by author or epic
- Timeline view
- Burndown charts
- Velocity metrics

---

**Command Version:** 1.0
**Release Date:** 2025-10-29
**Author:** EMB (Ezequiel M. Benitez) @emb715
**Part of:** CDD v1.0 Methodology
