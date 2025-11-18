# CDD Metrics & Evidence Log

> Tracks measurement methodology, raw datapoints, and conclusions so public claims stay evidence-based.

## 1. Methodology

- **Goal:** quantify the impact of Context-Driven Development on session efficiency and dashboard accuracy.  
- **Metrics:**
  - `context_reacquisition_minutes` — time spent recreating context at start of a session.
  - `session_duration_minutes` — total length of the work session.
  - `tasks_completed` / `tasks_planned` — progress against plan.
  - `evidence_items` — number of artefacts (tests, screenshots, deployments) attached per requirement.
- **Collection cadence:** record after every `/cdd:save-session` run (prompted automatically) and summarise weekly.
- **Tools:**  
  - Frontmatter aggregates in each `DECISIONS.md` (updated by `/cdd:save-session`).  
  - `cdd/.meta/metrics/scripts/collect-metrics.js` — generates rollups from the aggregated data into JSON/markdown summaries.  
  - Manual survey prompts when qualitative feedback is needed.

**Evidence flow:** Session updates capture progress in `DECISIONS.md` frontmatter → the metrics script snapshots every work item into `metrics-summary.json` / `.md` → `/cdd:list-work` and dashboards read those summaries so humans and AIs work from the same numbers.

## 2. Data Template

```markdown
### Work Item: <id> - <title>
- Observation window: <YYYY-MM-DD> → <YYYY-MM-DD>
- Sessions captured: <n>
- Avg context reacquisition: <minutes>
- Avg session duration: <minutes>
- Planned vs completed tasks: <completed>/<planned> (<percentage>%)
- Evidence attached per FR: <count> / <FR total>
- Notes: <qualitative observations, blockers, caveats>
```

## 3. Raw Entries

### Work Item: 0001 - Phase 02 Metrics & Dashboard Accuracy
- Observation window: 2025-01-30 → _ongoing_
- Sessions captured: 0
- Avg context reacquisition: _pending_
- Avg session duration: _pending_
- Planned vs completed tasks: 0/0 (0%)
- Evidence attached per FR: 0/0
- Notes: Instrumentation being implemented. Metrics will populate after the first instrumented session.

### Work Item: 0002 - Baseline Context Reacquisition Study
- Observation window: 2025-10-30 → _ongoing_
- Sessions captured: 1
- Avg context reacquisition: 6 minutes
- Avg session duration: 30 minutes
- Planned vs completed tasks: 3/12 (25%)
- Evidence attached per FR: 0/3
- Notes: Kickoff session focused on scaffolding artefacts and aligning frontmatter fields; next step is to dry-run the updated `/cdd:save-session` prompts before instrumented Session A.

## 4. Findings & Conclusions

- Pending first data capture. Once sessions exist, summarise insights here and update README/CHANGELOG accordingly.

## 5. Automation & Scripts

### Available Tools

**Frontmatter Management:**
```bash
# Update DECISIONS.md frontmatter programmatically
node cdd/.meta/metrics/scripts/lib/frontmatter.js path/to/DECISIONS.md --get field_name
node cdd/.meta/metrics/scripts/lib/frontmatter.js path/to/DECISIONS.md --set field_name value
```

**Metrics Collection:**
```bash
# Aggregate all work item metrics into summary files
node cdd/.meta/metrics/scripts/collect-metrics.js
```

This generates:
- `cdd/.meta/metrics-summary.json` - For dashboard consumption
- `cdd/.meta/metrics-summary.md` - For human review

### When AI Should Run Scripts

**🤖 AI AUTOMATION TRIGGER: After `/cdd:save-session` command:**

After appending to SESSION_NOTES.md and updating DECISIONS.md frontmatter, the AI MUST:

1. **Update the metrics summary:**
   ```bash
   node cdd/.meta/metrics/scripts/collect-metrics.js
   ```

2. **Confirm regeneration:**
   ```
   ✅ Metrics updated!

   Summary regenerated:
   - Work Items: X
   - Total Sessions: X
   - Total Hours: X
   - Avg Reacquisition: X min/session
   ```

**🤖 AI AUTOMATION TRIGGER: When `/cdd:list-work` is called:**

The AI SHOULD:

1. **Check if metrics-summary.json exists and is recent** (< 1 hour old)
   - If not, run `node cdd/.meta/metrics/scripts/collect-metrics.js` first
   - Then read from metrics-summary.json for accurate stats

2. **Display data from metrics-summary.json** instead of parsing files manually
   - Use `totals` for summary statistics
   - Use `items[]` array for work item details
   - Show `averages` in dashboard view

**🤖 AI AUTOMATION TRIGGER: At session end:**

Before wrapping up any CDD work session, the AI SHOULD:

1. **Remind about session save:**
   ```
   💡 Don't forget to save this session:
      /cdd:save-session [work-id]

   This will automatically update metrics for the dashboard.
   ```

2. **After session save, regenerate metrics automatically**

### Integration with Commands

#### In `/cdd:save-session` (Step 8: Update Frontmatter)

After updating DECISIONS.md frontmatter, add this step:

```markdown
**Step 8.5: Regenerate Metrics Dashboard**

After updating frontmatter, automatically refresh the metrics summary:

1. Run metrics collection script:
   ```bash
   node cdd/.meta/metrics/scripts/collect-metrics.js
   ```

2. Verify regeneration:
   - Check that metrics-summary.json updated timestamp matches current time
   - Confirm work item's metrics reflect the new session data

3. Inform user:
   ```
   ✅ Session saved and metrics updated!

   📊 Updated Metrics:
   - Your work item now shows: X sessions, X hours
   - Overall system: X total sessions across X work items
   - See full dashboard: /cdd:list-work --dashboard
   ```

If script fails, warn but don't block:
```
⚠️  Session saved, but metrics regeneration failed.
   Please run manually: node cdd/.meta/metrics/scripts/collect-metrics.js
```
```

#### In `/cdd:list-work` (Step 3: Extract Metadata)

Replace manual frontmatter reading with JSON consumption:

```markdown
**Step 3: Load Metrics Summary**

Instead of parsing each DECISIONS.md individually:

1. Check if metrics-summary.json exists:
   ```javascript
   const summaryPath = 'cdd/.meta/metrics-summary.json';
   if (fs.existsSync(summaryPath)) {
     const metrics = JSON.parse(fs.readFileSync(summaryPath));
     // Use metrics.items[] array for work item data
   }
   ```

2. If file is stale (> 1 hour) or missing, regenerate first:
   ```bash
   node cdd/.meta/metrics/scripts/collect-metrics.js
   ```

3. Display data from JSON:
   - `metrics.items[]` - Array of work items with all metadata
   - `metrics.totals` - Aggregate statistics
   - `metrics.averages` - Calculated averages
   - `metrics.generatedAt` - Last update timestamp

4. Show freshness indicator:
   ```
   📊 CDD Work Items (7 total)
   📅 Last updated: 3 minutes ago

   [table...]
   ```

Benefits:
- ✅ Faster (no frontmatter parsing)
- ✅ Consistent (single source of truth)
- ✅ Accurate (derived metrics pre-calculated)
```
