# Metrics Workflow Example

> **Purpose:** Demonstrates how the automated metrics system works in practice during a CDD workflow session.

## Scenario: Working on a Feature

Let's walk through a complete session where metrics are automatically collected and displayed.

---

## Session Start

**User:** "I want to work on user authentication"

**AI:**
```
📂 Opening work item: cdd/0003-user-authentication/

Current status: in-progress
Last session: 2 days ago
Progress: 12/20 tasks (60%)

Let's continue! What would you like to work on?
```

---

## During Work

**User:** "Implement OAuth integration"

**AI:** 
```
[Implements code, creates files, etc.]

✅ Completed:
- Created lib/auth/oauth.ts
- Added OAuth2 provider configuration
- Implemented token exchange flow
- Added unit tests

Files changed: 4 created, 2 modified
```

---

## Session End

**User:** "/cdd:save-session 0003"

**AI:**
```
📝 Saving session for work 0003-user-authentication-system...

🔍 Detected file changes:
- Created: lib/auth/oauth.ts
- Created: lib/auth/providers/google.ts
- Created: lib/auth/providers/github.ts
- Created: lib/auth/oauth.test.ts
- Modified: lib/auth/config.ts
- Modified: package.json

📋 Task Completion Detection

Based on file changes, you may have completed:

1. ✓ Task 2.3: Implement OAuth integration
   - Created: lib/auth/oauth.ts
   - Created: lib/auth/oauth.test.ts

Mark this as complete? (y/n)
```

**User:** "y"

**AI:**
```
How long was this session?
A) < 1 hour
B) 1-2 hours
C) 2-3 hours
D) Enter custom
```

**User:** "B"

**AI:**
```
How many minutes did you spend getting back up to speed?
A) 0-2 min
B) 3-5 min
C) 6-10 min
D) 11-15 min
```

**User:** "C"

**AI:**
```
✅ Appending session entry to SESSION_NOTES.md...
✅ Updating DECISIONS.md frontmatter...
   - total_sessions: 3 → 4
   - total_hours: 8.5 → 10
   - total_reacquisition_minutes: 25 → 33
   - completed_tasks_total: 12 → 13

📊 Regenerating metrics dashboard...
```

**AI runs automatically:**
```bash
node cdd/.meta/metrics/scripts/collect-metrics.js
```

**Output:**
```
📈 CDD Metrics Collection
==================================================

🔍 Scanning for DECISIONS.md files...
📊 Found 7 work item(s)
  ✓ 0001 - Phase 02 Metrics & Dashboard Accuracy (draft)
  ✓ 0002 - Baseline Context Reacquisition Study (in-progress)
  ✓ 0003 - User Authentication System (in-progress) ← UPDATED!
  ✓ 0004 - Fix Login Session Timeout Bug (complete)
  ✓ 0005 - Refactor API Layer for Better Maintainability (in-progress)
  ✓ 0006 - Database Query Performance Investigation (draft)
  ✓ 0007 - Mobile App Development Initiative (blocked)

✅ JSON summary written to: cdd/.meta/metrics-summary.json
✅ Markdown report written to: cdd/.meta/metrics-summary.md

📊 Summary
==================================================
Work Items: 7
Total Sessions: 19 (was 18)
Total Hours: 40.5 (was 39)
Avg Reacquisition: 9.3 min/session
Completion Rate: 47%

✨ Done!
```

**AI reports back:**
```
✅ Session saved and metrics updated!

📊 Updated Metrics:
- This work item: 4 sessions, 10 hours, 13/20 tasks (65% complete)
- System totals: 7 work items, 19 sessions, 40.5 hours
- Avg reacquisition: 9.3 min/session

View full dashboard: /cdd:list-work --dashboard

📝 Session saved in: cdd/0003-user-authentication-system/SESSION_NOTES.md

🎯 Suggested Next Tasks:
1. Task 2.4 - Add OAuth callback handlers
2. Task 3.1 - Create login UI component

Would you like to continue working?
```

---

## Later: Viewing Dashboard

**User:** "/cdd:list-work"

**AI:**
```
📊 Checking metrics freshness...
   Last updated: 2 minutes ago ✓

📊 CDD Work Items (7 total)
📅 Metrics updated: 2 minutes ago

┌──────┬────────────────────────────┬──────────┬────────────┬──────────┬────────┬────────┬──────────┐
│ ID   │ Title                      │ Type     │ Status     │ Priority │ Sessions │ Hours │ Tasks    │
├──────┼────────────────────────────┼──────────┼────────────┼──────────┼────────┼────────┼──────────┤
│ 0001 │ Phase 02 Metrics Dashboard │ Feature  │ Draft      │ High     │ 1      │ 2.0    │ 14/22   │
│ 0002 │ Baseline Context Study     │ Spike    │ In Progress│ High     │ 2      │ 1.5    │ 6/12    │
│ 0003 │ User Authentication System │ Feature  │ In Progress│ High     │ 4      │ 10.0   │ 13/20   │
│ 0004 │ Fix Login Timeout Bug      │ Bug      │ Complete   │ Critical │ 2      │ 3.0    │ 8/8     │
│ 0005 │ Refactor API Layer         │ Refactor │ In Progress│ Medium   │ 5      │ 12.5   │ 15/28   │
│ 0006 │ Database Performance       │ Spike    │ Draft      │ Medium   │ 1      │ 1.5    │ 3/10    │
│ 0007 │ Mobile App Initiative      │ Epic     │ Blocked    │ Low      │ 4      │ 10.0   │ 8/45    │
└──────┴────────────────────────────┴──────────┴────────────┴──────────┴────────┴────────┴──────────┘

📊 Summary Statistics:

By Status:
  🔄 In Progress: 3 items (43%)
  📝 Draft: 2 items (29%)
  ✅ Complete: 1 item (14%)
  🚧 Blocked: 1 item (14%)

📈 Productivity Metrics (from metrics-summary.json):
  📋 Total Work Items: 7
  🕒 Total Sessions: 19
  ⏳ Total Hours: 40.5
  🔁 Total Reacquisition Time: 177 min
  ✅ Tasks Completed: 67 / 145 (46%)

📊 Averages:
  📈 Sessions per Work Item: 2.7
  ⏱️  Hours per Work Item: 5.8
  🔁 Reacquisition per Session: 9.3 min
  ⏰ Session Duration: 2.1 hours
  ✅ Overall Completion Rate: 46%

---

💡 Tips:
  • Metrics auto-update after /cdd:save-session
  • Manual refresh: node cdd/.meta/metrics/scripts/collect-metrics.js
  • View markdown report: cdd/.meta/metrics-summary.md
  • Last updated: 2 minutes ago

🎯 Suggested Actions:

High Priority Items:
  → Work 0003 (User Authentication) is progressing well (65% complete)
  → Work 0001 (Metrics Dashboard) needs attention - only 1 session so far

Blocked Items:
  → Work 0007 (Mobile App) - Review blockers and dependencies

Recently Updated:
  → Work 0003 updated 5 minutes ago - Great momentum!
```

---

## Behind the Scenes

### What Happened Automatically

1. **During `/cdd:save-session`:**
   - ✅ AI detected file changes
   - ✅ AI suggested task completions
   - ✅ AI updated DECISIONS.md frontmatter
   - ✅ AI ran `node cdd/.meta/metrics/scripts/collect-metrics.js` automatically
   - ✅ AI reported updated metrics

2. **During `/cdd:list-work`:**
   - ✅ AI checked metrics-summary.json freshness (< 1 hour = OK)
   - ✅ AI loaded data from JSON (fast, no parsing)
   - ✅ AI displayed table with current data
   - ✅ AI showed aggregate stats from metrics.totals
   - ✅ AI showed averages from metrics.averages

### Files Updated

```
cdd/0003-user-authentication-system/
├── DECISIONS.md ← Frontmatter updated
│   ├── total_sessions: 4
│   ├── total_hours: 10
│   ├── total_reacquisition_minutes: 33
│   └── completed_tasks_total: 13
└── SESSION_NOTES.md ← New session entry appended

cdd/.meta/
├── metrics-summary.json ← Regenerated (all work items)
└── metrics-summary.md ← Regenerated (human-readable)
```

---

## What If Metrics Failed?

**Scenario:** Script has a bug or permission issue

**AI Response:**
```
✅ Session saved successfully!

⚠️  Note: Metrics regeneration failed (exit code 1).
   Dashboard may show stale data.

Error output:
  Error: EACCES: permission denied, open 'metrics-summary.json'

Please run manually when convenient:
  chmod +x scripts/collect-metrics.js
  node cdd/.meta/metrics/scripts/collect-metrics.js

Session data is safely stored in:
- SESSION_NOTES.md (session entry appended)
- DECISIONS.md (frontmatter updated)

Your work is safe! The metrics issue doesn't affect your data.
```

**Key Points:**
- ✅ Session still saved successfully
- ✅ User informed of issue
- ✅ Clear remediation steps provided
- ✅ Workflow not blocked

---

## Manual Metrics Refresh

If a user wants to refresh metrics manually:

**User:** "Update the metrics dashboard"

**AI:**
```
📊 Refreshing metrics dashboard...
```

**AI runs:**
```bash
node cdd/.meta/metrics/scripts/collect-metrics.js
```

**Output:**
```
[... metrics collection output ...]

✨ Done!
```

**AI:**
```
✅ Metrics refreshed!

📊 Current Summary:
- Work Items: 7
- Total Sessions: 19
- Total Hours: 40.5
- Avg Reacquisition: 9.3 min/session
- Completion Rate: 46%

View full report:
- JSON: cdd/.meta/metrics-summary.json
- Markdown: cdd/.meta/metrics-summary.md

Use /cdd:list-work to see the updated dashboard.
```

---

## Evidence-Based Claims

With metrics now tracked automatically, documentation can cite real data:

**Before (anecdotal):**
```markdown
CDD reduces context reacquisition time significantly!
```

**After (evidence-based):**
```markdown
Based on 19 tracked sessions across 7 work items (as of 2025-11-03):
- Average context reacquisition: 9.3 minutes per session
- Average session duration: 2.1 hours
- Overall task completion rate: 46%

See full metrics: cdd/.meta/metrics-summary.md
```

---

## Summary

**What's Automated:**
- ✅ Metrics regeneration after every `/cdd:save-session`
- ✅ Freshness check before every `/cdd:list-work`
- ✅ Dashboard display from pre-calculated JSON
- ✅ Error handling with graceful fallbacks

**What's Manual (Optional):**
- 🔄 Running `node cdd/.meta/metrics/scripts/collect-metrics.js` to force refresh
- 🔄 Reading `metrics-summary.md` for reports
- 🔄 Using frontmatter scripts for custom updates

**Benefits:**
- 🚀 Faster `/cdd:list-work` (no frontmatter parsing)
- 📊 Always-current dashboard data
- 🎯 Evidence-based productivity tracking
- 🤖 Zero manual overhead for users

**Phase 02 Goal Achieved:**
> "Instrument evidence collection and ensure `/cdd:list-work` only reports verifiable data."

✅ **Complete!** All metrics now flow automatically from session documentation through scripts to dashboard display.

