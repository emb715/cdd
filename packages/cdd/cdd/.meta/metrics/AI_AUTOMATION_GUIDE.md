# AI Automation Guide for CDD Metrics

> **Purpose:** Instructs AI agents when and how to automatically run metrics scripts during CDD workflow.
>
> **Note:** Metrics scripts are **OPTIONAL**. CDD works without them. Commands handle metrics via frontmatter updates. Scripts are for batch analysis and dashboards.

## 🤖 Automation Triggers (Optional Enhancement)

This guide tells AI agents **exactly when** to run the metrics collection scripts without being asked.

**If Node.js/npm are not available:** Skip script execution entirely. Metrics are still tracked in frontmatter.

### Trigger 1: After `/cdd:save-session` Command

**WHEN:** Immediately after updating DECISIONS.md frontmatter in Step 8

**WHAT TO RUN:**
```bash
node cdd/.meta/metrics/scripts/collect-metrics.js
```

**WHY:** 
- Keeps dashboard (`/cdd:list-work`) accurate in real-time
- Provides immediate feedback on updated metrics
- Ensures `metrics-summary.json` reflects latest session data

**AI RESPONSE FORMAT:**
```
✅ Session saved and metrics updated!

📊 Updated Metrics:
- This work item: 3 sessions, 7.5 hours, 8/15 tasks completed
- System totals: 7 work items, 18 sessions, 39 hours
- Avg reacquisition: 9.4 min/session

View full dashboard: /cdd:list-work --dashboard
```

**ERROR HANDLING:**
If script fails, don't block the session save:
```
✅ Session saved successfully!

⚠️  Note: Metrics regeneration failed. Dashboard may show stale data.

Please run manually when convenient:
  node cdd/.meta/metrics/scripts/collect-metrics.js

Session data is safely stored in:
- SESSION_NOTES.md (session entry appended)
- DECISIONS.md (frontmatter updated)
```

---

### Trigger 2: Before `/cdd:list-work` Command

**WHEN:** At the start of Step 3 (Load Metrics Summary)

**WHAT TO CHECK:**
```javascript
const summaryPath = 'cdd/.meta/metrics-summary.json';
const fs = require('fs');

// Check if file exists and age
if (!fs.existsSync(summaryPath)) {
  // Run: node cdd/.meta/metrics/scripts/collect-metrics.js
} else {
  const stats = fs.statSync(summaryPath);
  const ageMinutes = (Date.now() - stats.mtimeMs) / 1000 / 60;
  
  if (ageMinutes > 60) {
    // File is stale (> 1 hour old), regenerate
    // Run: node cdd/.meta/metrics/scripts/collect-metrics.js
  }
}
```

**WHY:**
- Ensures dashboard shows current data
- Avoids manual frontmatter parsing (faster)
- Provides derived metrics (percentages, averages)

**AI RESPONSE FORMAT:**
```
📊 CDD Work Items (7 total)
📅 Metrics updated: 5 minutes ago

[table with data from metrics-summary.json...]
```

If regenerating:
```
📊 Refreshing metrics (last update: 75 min ago)...
[run node cdd/.meta/metrics/scripts/collect-metrics.js]
✅ Metrics refreshed!

📊 CDD Work Items (7 total)
📅 Metrics updated: just now

[table...]
```

---

### Trigger 3: At End of Any CDD Work Session

**WHEN:** When wrapping up a conversation about CDD work

**WHAT TO DO:** Remind user to save session

**AI RESPONSE FORMAT:**
```
💡 Before we finish, don't forget to save this session:

   /cdd:save-session [work-id]

This will:
- Record your progress in SESSION_NOTES.md
- Update DECISIONS.md frontmatter
- Automatically refresh the metrics dashboard

Next time you run /cdd:list-work, your updated metrics will appear!
```

**WHY:**
- Encourages consistent session documentation
- Ensures metrics stay current
- Builds evidence base for productivity tracking

---

## 📋 AI Decision Tree

Use this flowchart to determine when to run metrics:

```
User runs /cdd:save-session
  ↓
AI completes Step 8 (Update frontmatter)
  ↓
AI AUTOMATICALLY runs: node cdd/.meta/metrics/scripts/collect-metrics.js
  ↓
AI reports success + shows updated metrics
  ↓
Done ✅


User runs /cdd:list-work
  ↓
AI checks: does metrics-summary.json exist?
  ↓
  NO → AI runs: node cdd/.meta/metrics/scripts/collect-metrics.js
  ↓
  YES → AI checks: is it < 1 hour old?
    ↓
    NO → AI runs: node cdd/.meta/metrics/scripts/collect-metrics.js
    ↓
    YES → AI uses existing file
  ↓
AI loads metrics-summary.json
  ↓
AI displays table + stats from JSON
  ↓
Done ✅


Conversation ends (any CDD work)
  ↓
AI reminds: "Don't forget /cdd:save-session"
  ↓
Done ✅
```

---

## 🔧 Technical Details for AI

### Script Locations

```
scripts/
├── collect-metrics.js      # Main aggregation script
└── lib/
    └── frontmatter.js      # Frontmatter utility
```

### Running the Script

**Preferred method (uses npm):**
```bash
node cdd/.meta/metrics/scripts/collect-metrics.js
```

**Direct invocation:**
```bash
node cdd/.meta/metrics/scripts/collect-metrics.js
```

**With custom CDD directory:**
```bash
node cdd/.meta/metrics/scripts/collect-metrics.js /path/to/cdd
```

### Expected Output

**Success:**
```
📈 CDD Metrics Collection
==================================================

🔍 Scanning for DECISIONS.md files in /path/to/cdd...
📊 Found 7 work item(s)
  ✓ 0001 - Phase 02 Metrics & Dashboard Accuracy (draft)
  ✓ 0002 - Baseline Context Reacquisition Study (in-progress)
  [... more items ...]

✅ JSON summary written to: /path/to/cdd/.meta/metrics-summary.json
✅ Markdown report written to: /path/to/cdd/.meta/metrics-summary.md

📊 Summary
==================================================
Work Items: 7
Total Sessions: 18
Total Hours: 39
Avg Reacquisition: 9.4 min/session
Completion Rate: 46%

✓ 7 work item(s) have session data.

✨ Done!
```

**Exit codes:**
- `0` = Success
- `1` = Error (file not found, parse error, etc.)

### Generated Files

**metrics-summary.json** (machine-readable):
```json
{
  "generatedAt": "2025-11-03T21:14:36.055Z",
  "totals": {
    "workItems": 7,
    "sessions": 18,
    "hours": 39,
    "reacquisitionMinutes": 169,
    "completedTasks": 66,
    "plannedTasks": 145
  },
  "averages": {
    "sessionsPerWorkItem": 2.6,
    "hoursPerWorkItem": 5.6,
    "reacquisitionPerSession": 9.4,
    "sessionDuration": 2.2,
    "completionRate": 46
  },
  "items": [
    {
      "id": 1,
      "title": "Phase 02 Metrics & Dashboard Accuracy",
      "type": "feature",
      "status": "draft",
      "priority": "high",
      "total_sessions": 1,
      "total_hours": 2,
      "completion_percentage": 64,
      ...
    },
    ...
  ]
}
```

**metrics-summary.md** (human-readable):
```markdown
# Metrics Summary Report

Generated: 11/3/2025, 6:14:36 PM

## Overall Totals

- **Work Items:** 7
- **Total Sessions:** 18
...

## Work Items

| ID | Title | Status | Sessions | Hours | Tasks | Completion |
|----|-------|--------|----------|-------|-------|------------|
| 0001 | ... | draft | 1 | 2 | 14/22 | 64% |
...
```

---

## 🚨 Error Scenarios

### Script Not Found

**Symptoms:**
```
sh: cdd/.meta/metrics/scripts/collect-metrics.js: No such file or directory
```

**AI Response:**
```
⚠️  Warning: Metrics script not found at cdd/.meta/metrics/scripts/collect-metrics.js

Possible causes:
- Scripts not yet installed (see Phase 02 implementation)
- Running from wrong directory
- Files not committed to repository

Falling back to manual mode (no automatic metrics).
```

### Permission Denied

**Symptoms:**
```
Error: EACCES: permission denied
```

**AI Response:**
```
⚠️  Warning: Cannot execute metrics script (permission denied)

Try fixing with:
  chmod +x cdd/.meta/metrics/scripts/collect-metrics.js

Or run manually when fixed:
  node cdd/.meta/metrics/scripts/collect-metrics.js
```

### Parse Error in DECISIONS.md

**Symptoms:**
Script warns about invalid frontmatter

**AI Response:**
```
⚠️  Some work items have invalid frontmatter:
- 0005-refactor-api-layer/DECISIONS.md

Metrics generated with available data.
Consider fixing invalid files.
```

---

## ✅ Best Practices for AI

1. **Always run after `/cdd:save-session`** - Even if it seems redundant, consistency matters

2. **Check freshness before `/cdd:list-work`** - Users expect current data in dashboards

3. **Handle errors gracefully** - Never block user workflow due to metrics failure

4. **Show what you're doing** - Brief "Refreshing metrics..." message for transparency

5. **Report outcomes** - Confirm metrics updated with summary stats

6. **Remind at end of session** - Encourage users to document their work

7. **Use JSON over parsing** - Always prefer metrics-summary.json over manual DECISIONS.md parsing

8. **Respect the schema** - Don't guess at field names; refer to this guide or scripts/README.md

---

## 📚 Related Documentation

- **scripts/README.md** - Full technical documentation for scripts
- **scripts/IMPLEMENTATION_SUMMARY.md** - Implementation details and design decisions
- **cdd/.meta/metrics/README.md** - Metrics methodology and collection protocol
- **.claude/commands/cdd:save-session.md** - Full `/cdd:save-session` command spec (includes Step 8.5)
- **.claude/commands/cdd:list-work.md** - Full `/cdd:list-work` command spec (includes Step 3 updates)

---

## 🔄 Version History

**v1.0 (2025-11-03):**
- Initial automation guide
- Integration with `/cdd:save-session` and `/cdd:list-work`
- Error handling specifications

---

**This guide is authoritative for AI behavior. Follow these triggers consistently.**

