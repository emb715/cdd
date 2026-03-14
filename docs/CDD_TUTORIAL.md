# Context-Driven Development (CDD) Tutorial

> **Just want to start coding?** See [Quick Start](../packages/cdd/QUICK_START.md) for a 2-minute introduction.
>
> **This guide** provides deep understanding, complete examples, and best practices.

---

## Why CDD?

Every AI coding session starts the same way: you paste context, explain what you're building, clarify decisions you already made. By the third session, you're re-explaining your database schema. By the tenth, the AI suggests changes that contradict decisions from two weeks ago.

**The problem:** AI tools have no memory. Every session is amnesia.

**CDD's solution:** Documentation as infrastructure. You build a queryable knowledge base while you work. Future sessions start with context already loaded.

### When to Use CDD

**Use it when:**
- Project will span multiple sessions (>3 sessions)
- Multiple people will work on the codebase
- You need to track architectural decisions over time
- Context complexity exceeds what fits in a single prompt

**Skip it when:**
- Single-session throwaway scripts
- Project scope is under 100 lines
- You're prototyping and will rewrite from scratch

### Alternatives

- **Conventional docs:** Great for stable projects, slower to update, not AI-optimized
- **ADRs only:** Good for decisions, lacks implementation tracking
- **Project wikis:** Better for reference material, worse for active development workflow

---

## Quick Start Installation

### Install CDD Core

```bash
cd your-project-root
npx @emb715/cdd init
```

This creates:
```
_cdd/
├── .meta/           # Templates and agent instructions
└── 0000-example/    # Example work item (delete when ready)
    ├── CONTEXT.md   # Problem, solution, tasks, decisions
    └── SESSIONS.md  # Session log
```

### Verify Slash Commands

In Claude Code, type `/cdd:` and you should see autocomplete for:
- `/cdd:start` - Start new work session
- `/cdd:log` - Auto-detect and log session activity
- `/cdd:decide` - Multi-agent collaborative planning
- `/cdd:done` - Mark work complete with evidence

---

## Core Concepts

### Architecture: Honest Agent Orchestration

CDD commands use the **Honest Agent** for autonomous execution. This means cleaner conversations, faster execution, and smarter workflows.

**How it works:**

```
User runs: /cdd:start add user auth

Flow:
1. Wrapper command (56 lines) parses input
2. Spawns Honest Agent with instruction template (97 lines)
3. Agent executes autonomously (no user prompts)
4. Returns clean output to user
5. Main conversation stays unpolluted
```

**Intelligence features:**

1. **Cross-command context:** Agents read SESSIONS.md to learn from prior sessions
   - `/cdd:log` prioritizes tasks mentioned in previous "Next" sections
   - `/cdd:done` analyzes session patterns to generate better summaries

2. **Pattern learning:** Agents adapt to your project
   - `/cdd:start` suggests work types based on recent work (if >70% are bugs, suggest "bug")
   - `/cdd:log` estimates duration from SESSIONS.md average (if >2 prior sessions)
   - `/cdd:log` marks related tasks in-progress when same file touched multiple times

3. **Efficiency optimization:** Agents minimize tool calls
   - Single git diff instead of multiple queries
   - Read files once, reuse in memory
   - Batch file writes

**Why this matters:**

- Your main LLM conversation stays clean (60-80% less noise)
- Consistent behavior across all commands (all use same agent pattern)
- Agents get smarter as you work (learn from your SESSIONS.md history)
- Fully autonomous (no "Should I do X?" prompts)

**Agent permissions:**

The cdd-honest agent comes pre-configured with permissions for git read operations:
- `git diff --name-only HEAD` (detect changed files)
- `git ls-files --others --exclude-standard` (detect new files)
- `git log` (read commit history)

This means CDD commands run autonomously without prompting you for git operations. File write operations still respect your global permission mode (prompt/auto-approve).

### Unified Context File

CDD uses a single progressive `CONTEXT.md` file that grows with your project:

**CONTEXT.md structure:**
```markdown
# Project: Fernet Inflation Tracker

## Overview
Track Fernet Branca prices over time to visualize inflation in Argentina.

## Stack Decisions
- Backend: Convex (serverless, real-time)
- Frontend: React + Recharts
- Database: Convex tables (products, price_snapshots)

## Current Implementation Plan
### Database Schema
[Schema details...]

### Components
- PriceEntryForm
- PriceChart
- HistoricalTable

## Progress
- [x] Convex schema defined
- [x] Backend mutations created
- [ ] Frontend components (in progress)
- [ ] Mobile responsive testing
- [ ] Deployment

## Open Questions
- Should we add user authentication?
- Historical data: scrape or manual entry?

## Recent Decisions
### 2024-01-15: Use Unix timestamps
Convex doesn't support Date objects. Use numbers for observed_date field.

### 2024-01-16: Add currency formatting
Display prices with `.toFixed(2)` for readability.
```

### Minimal Session Log

`SESSIONS.md` captures only what matters:

```markdown
# Sessions

## 2024-01-16 10:05 - Frontend components
- Built PriceChart, PriceEntryForm, HistoricalTable
- Problem: ResponsiveContainer needed explicit parent height
- Added Recharts dependency

## 2024-01-15 14:23 - Backend setup
- Convex schema + CRUD operations
- Problem: Schema migration required clean dev environment
- Solution: Delete .convex/ folder, run `npx convex dev`
```

### Optional Decision Docs

For complex decisions, create separate files in `decisions/`:

```
decisions/
└── 001-database-choice.md
└── 002-authentication-strategy.md
```

These get linked from CONTEXT.md but live separately for deep dives.

### Evidence-Based Completion

When you run `/cdd:done`, you provide evidence. Valid evidence:

✅ **Good evidence:**
- Screenshots of working UI
- Test output showing passes
- API response examples
- Deployment URLs
- Error logs showing fixed bugs
- Diff outputs of changes

❌ **Bad evidence:**
- "I tested it and it works"
- "The code looks good"
- "Trust me"

**Why strict?** Future sessions need proof, not promises. Evidence prevents revisiting solved problems.

### Human-AI Collaboration Boundaries

**Human decides:**
- Whether work is complete
- What evidence is sufficient
- When to deviate from plan
- Which features to prioritize

**AI assists:**
- Generates initial drafts
- Suggests file structures
- Formats documentation
- Indexes for search

**Neither owns sole authority:** Human provides judgment, AI provides memory and structure.

---

## Complete Mock Session: Fernet Branca Inflation Tracker

### Project Overview

**Goal:** Track Fernet Branca prices over time in Argentina to visualize inflation.

**Stack:**
- Backend: Convex (real-time database, serverless functions)
- Frontend: React with Recharts for visualization
- Data: Products and price snapshots over time

### Step 1: Start Work

```bash
/cdd:start build fernet branca price tracker with Convex backend and React frontend
```

**Agent creates:** `_cdd/0001-build-fernet-branca-price-tracker/`

```
Work item created!

_cdd/0001-build-fernet-branca-price-tracker/
ID: 0001
Type: feature

Files:
  CONTEXT.md
  SESSIONS.md

Start working. Use /cdd:log when you make progress.
```

You then open `_cdd/0001-build-fernet-branca-price-tracker/CONTEXT.md` and fill in the problem, solution, and initial tasks:

### Step 2: Implementation Session 1

Work proceeds. After completing backend:

```bash
/cdd:log
```

**Agent auto-detects changes and logs autonomously:**

```
Session logged!

Work: 0001-build-fernet-branca-price-tracker
Duration: 1h
Completed: 3 tasks
Progress: 0% → 43% (+43%)

Updated:
  CONTEXT.md (3 tasks marked complete)
  SESSIONS.md (new entry)

Next priorities:
  1. PriceEntryForm component
  2. PriceChart component
```

**Appended to** `_cdd/0001-.../SESSIONS.md`:

```markdown
## 2024-01-15 14:23 - Backend setup (2h 15m)

**Completed:**
- Convex schema (products, price_snapshots)
- Product CRUD operations
- Price snapshot mutations with validation

**Problems:**
- Schema migration error → deleted .convex/, ran `npx convex dev` fresh
- Date handling → switched from Date objects to Unix timestamps

**Files created:**
- convex/schema.ts
- convex/products.ts
- convex/priceSnapshots.ts
```

**Updated** `_cdd/0001-.../CONTEXT.md` (tasks marked complete):

```markdown
## Progress
- [x] Convex schema
- [x] Backend mutations
- [ ] PriceEntryForm component
- [ ] PriceChart component
- [ ] HistoricalTable component
- [ ] Mobile testing
- [ ] Deployment
```

### Step 3: Multi-Agent Planning

Before building the chart, you want expert input:

```bash
/cdd:decide best approach for PriceChart with Recharts time-series visualization
```

**Sage agents research in parallel:**

**Agent 1 (Frontend Expert):**
```
For Recharts time-series:
- Use ResponsiveContainer for mobile
- Convert Unix timestamps to Date objects for XAxis
- Add custom Tooltip formatter for ARS currency
- For >1000 points, disable animations

Example:
```typescript
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={priceData}>
    <XAxis
      dataKey="observed_date"
      tickFormatter={(ts) => new Date(ts).toLocaleDateString('es-AR')}
    />
    <YAxis label={{ value: 'Precio (ARS)', angle: -90 }} />
    <Tooltip
      labelFormatter={(ts) => new Date(ts).toLocaleString('es-AR')}
      formatter={(value) => `$${value.toFixed(2)}`}
    />
    <Line type="monotone" dataKey="price_ars" stroke="#2563eb" />
  </LineChart>
</ResponsiveContainer>
```
```

**Agent 2 (Performance Expert):**
```
For Argentina inflation tracking:
- Expect exponential growth curves
- Use logarithmic Y-axis if price ranges exceed 10x
- Add `connectNulls={true}` for missing data points
- Consider adding trend line for inflation rate visualization
```

**Agent 3 (UX Expert):**
```
Argentina-specific considerations:
- Use 'es-AR' locale for date formatting
- Display prices with thousands separator (e.g., $1.234,56)
- Add reference line for "official" inflation rate
- Mobile: ensure touch targets for tooltips are ≥44px
```

**Result written to** `_cdd/0001-.../decisions/2024-01-16-chart-implementation.md`:

```markdown
# Decision: Price Chart Implementation

**Date:** 2024-01-16
**Context:** Building time-series chart for Fernet price data

## Chosen Approach

Use Recharts with:
- ResponsiveContainer for mobile
- Argentina locale ('es-AR') for dates
- Currency formatting with thousands separator
- Custom Tooltip with price formatting
- Future: Add logarithmic scale if price ranges exceed 10x

## Implementation Notes

Parent container needs explicit height for ResponsiveContainer.
Use `toFixed(2)` for price display.
```

**You add to** `_cdd/0001-.../CONTEXT.md` (Decisions section):

```markdown
## 📝 Decisions

<details>
<summary><strong>2024-01-16: Recharts time-series approach</strong></summary>

**Decision:** ResponsiveContainer + es-AR locale + logarithmic scale option

**See full analysis:** [decisions/2024-01-16-chart-implementation.md](decisions/2024-01-16-chart-implementation.md)
</details>
```

### Step 4: Implementation Session 2

After building frontend:

```bash
/cdd:log
```

**Auto-detected changes, session logged:**

```markdown
## 2024-01-16 10:05 - Frontend components (1h 45m)

**Completed:**
- PriceEntryForm, PriceChart, HistoricalTable components
- Added Recharts dependency

**Problems:**
- TypeScript error on Id type → imported from convex/_generated/dataModel
- Chart not rendering → parent div needed explicit height

**Files created:**
- src/components/PriceEntryForm.tsx
- src/components/PriceChart.tsx
- src/components/HistoricalTable.tsx

**Deviations:**
- Added currency formatting (toFixed(2)) - UX improvement
- Used 'es-AR' locale for date formatting
```

### Step 5: Complete Work

```bash
/cdd:done
```

**Agent runs autonomously and outputs:**

```
Work item completed!

ID: 0001-build-fernet-branca-price-tracker
Status: draft → complete
Duration: 2h 45m (2 sessions)
Tasks: 7/7 completed (100%)

Updated:
  CONTEXT.md (status: complete)
  SESSIONS.md (final entry)

Ready to ship. Use /cdd:start for next work item.
```

For a richer summary, use `/cdd:done --summary`. Agent generates `IMPLEMENTATION_SUMMARY.md` from your CONTEXT.md and SESSIONS.md history — no questions asked.

**Final entry appended to** `_cdd/0001-.../SESSIONS.md`:

```markdown
## 2024-01-16 18:30 (0h) - COMPLETED

**Work Summary:** Fernet price tracker with Convex backend and React frontend, mobile-responsive.
**Final Stats:** Tasks 7/7 (100%), Sessions 2, Time 2h 45m
**Key Learnings:** Convex schema migrations need clean env; ResponsiveContainer needs explicit parent height
**Status:** draft → complete
```

---

## Advanced Usage

### Task Auto-Detection with File Hints

Add file hints to tasks for automatic completion detection:

```markdown
- [ ] Implement OAuth
      **Files:** `lib/auth/oauth.ts`, `lib/auth/providers/*.ts`
```

When `/cdd:log` runs, it matches git changes to these files and auto-marks tasks complete.

**Smart matching:**
- **Exact:** `lib/auth/oauth.ts` = `lib/auth/oauth.ts`
- **Glob patterns:** `lib/auth/providers/*.ts` matches any file in that folder
- **Related files:** Creating test files alongside source files suggests both are done

### Decision Reuse

Reference past decisions in new work:

```markdown
**See previous:** [decisions/2024-01-10-similar-topic.md](decisions/2024-01-10-similar-topic.md)
```

Build a decision library over time. Future decisions benefit from past research.

### Multiple Work Items in Parallel

```bash
# Work on feature 1
/cdd:start feature A
# ... code ...
/cdd:log

# Switch to feature 2
/cdd:start feature B
# ... code ...
/cdd:log

# Both tracked separately
```

Each work item has its own folder, context, and session log. No conflicts.

---

## Code Search with jcodemunch-mcp (Optional)

> **Full setup guide:** [docs/JCODEMUNCH.md](JCODEMUNCH.md)

https://github.com/jgravelle/jcodemunch-mcp

jcodemunch-mcp is an MCP server that indexes your codebase using AST parsing and exposes structured retrieval tools in your Claude session. Install it in one command:

```bash
claude mcp add jcodemunch uvx jcodemunch-mcp
```

### How it enhances `/cdd:decide`

The Codebase Context Agent (Agent 3 in the parallel research) normally uses grep to find file-level patterns. With jcodemunch indexed, it uses `search_symbols`, `find_references`, and `get_context_bundle` to analyze actual code structure — finding existing implementations, understanding usage patterns, and estimating migration complexity with precision. This translates to decision artifacts with more accurate codebase analysis.

### How it enhances `/cdd:log`

Task auto-matching works by comparing changed file paths to the `**Files:**` hints in your tasks. With jcodemunch available, Claude can use `find_importers` and `find_references` to catch completions semantically — useful after refactors or file renames where paths change but the work is the same.

### When to add it

Add it when your project reaches 20+ source files, or when `/cdd:decide`'s codebase analysis feels shallow. For small projects, built-in Grep is sufficient.

---

## Troubleshooting

### "Work item not found"

**Problem:** `/cdd:log` can't find work item

**Solution:**
```bash
# Specify explicitly
/cdd:log 0001

# Or check folder name
ls _cdd/
```

**Root cause:** Usually happens when working directory doesn't match git changes, or you have multiple work items.

---

### "No file changes detected"

**Problem:** You worked but git shows no changes

**Solution:**
```bash
# Check git status
git status

# Or specify work manually
/cdd:log 0001
# Then describe what you did
```

**Root cause:** Files not saved, or changes not in git working directory.

---

### "Agent failed to complete"

**Problem:** Multi-agent decision had errors

**Solution:**
- Retry: `/cdd:decide [topic]` again
- Or simplify: Research manually, document in CONTEXT.md

**Root cause:** Network issues, API rate limits, or complex topics requiring more context.

---


## Best Practices

### Writing Good Evidence

**Bad:**
```
Evidence: I tested the login flow and it works fine.
```

**Good:**
```
Evidence: Login flow test results

1. Screenshot: Login form with validation errors
   [login-validation.png]

2. Test output:
   ✓ Valid credentials → dashboard redirect
   ✓ Invalid password → error message shown
   ✓ Empty fields → validation errors displayed
   ✓ Session persists after refresh

3. Deployed URL: https://app.example.com/login
   Test account: test@example.com / TestPass123
```

**Why good?** Future you can verify claims. Screenshots prove UI works. Test output shows edge cases covered. Deployment URL enables manual verification.

### Anti-Patterns: What NOT to Do

#### ❌ Don't: Log every 5 minutes
**Problem:** Noisy sessions log, overhead exceeds value

**Instead:** Log every 30-60 minutes or at natural breakpoints (after completing a task, before switching context)

---

#### ❌ Don't: Use /cdd:decide for simple choices
**Problem:** Wastes 2-5 minutes on obvious decisions

**Instead:** Just decide and add to CONTEXT.md Decisions section manually. Reserve `/cdd:decide` for genuinely hard technical choices with multiple valid approaches.

---

#### ❌ Don't: Skip file hints in tasks
**Problem:** Auto-detection can't match tasks to file changes

**Instead:** Add `**Files:**` hints for auto-completion:
```markdown
- [ ] Task name
      **Files:** `path/to/file.ts`
```

---

#### ❌ Don't: Create work items for 5-minute changes
**Problem:** Overhead exceeds work time

**Instead:** Use CDD for features/bugs taking >30 minutes. For quick fixes, just commit with a good message.

---

#### ❌ Don't: Enable metrics for every work item
**Problem:** Frontmatter pollution, slows logging, adds ceremony

**Instead:** Only use `--track-metrics` when you need data for retrospectives or reporting.

---

#### ✅ Do: Keep CONTEXT.md focused
**Why:** Long context = slower AI comprehension, harder to scan

**How:** Use `<details>` for optional sections, keep Problem/Solution concise (2-3 sentences each)

---

### When to Use decisions/ Folder

**Keep in CONTEXT.md:**
- Simple decisions (< 1 paragraph)
- Tactical choices (formatting, library versions)
- Temporary constraints

**Move to decisions/:**
- Complex architectural decisions (> 2 paragraphs)
- Long-term strategic choices (database, framework)
- Decisions requiring stakeholder buy-in
- Regulatory/compliance decisions

### Team Collaboration Patterns

**Async handoffs:**

Developer A ends session:
```bash
/cdd:log
```

Session notes include:
```markdown
## 2024-01-16 - Payment integration (blocked)

**Completed:**
- Payment form UI
- Stripe webhook setup

**Blocking issues:**
- Waiting for production API keys from DevOps
- CORS error on webhook endpoint (see logs below)

**Next developer:**
- Add API keys to .env.production when they arrive
- Check Nginx config for CORS headers
```

Developer B starts next day: reads last 2-3 SESSIONS.md entries and CONTEXT.md to get up to speed immediately, continues work.

**Parallel work:**

Multiple developers work simultaneously:
- Developer A: Works on auth refactor (updates CONTEXT.md section "Authentication")
- Developer B: Works on dashboard widget (updates CONTEXT.md section "Dashboard")

Minimal merge conflicts because CONTEXT.md is organized by feature area.

**Code review integration:**

Reviewer reads CONTEXT.md for original requirements, decisions/ for approach, SESSIONS.md for problems encountered. Reviews code with full context, catches divergence from requirements.

---

## Appendix: Command Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `/cdd:start` | Start new work session | `/cdd:start` |
| `/cdd:log` | Auto-detect and log session | `/cdd:log` |
| `/cdd:decide` | Multi-agent collaborative planning | `/cdd:decide` |
| `/cdd:done` | Mark complete with evidence | `/cdd:done` |

**Installation commands:**
```bash
npx @emb715/cdd init
```

**File structure:**
```
_cdd/
├── .meta/            # Templates and agent instructions
└── XXXX-work-name/   # One folder per work item
    ├── CONTEXT.md    # Problem, solution, tasks, decisions
    ├── SESSIONS.md   # Session log
    └── decisions/    # Optional multi-agent decision artifacts
```

---

## Next Steps

1. **Start your first session:** Run `/cdd:start` in Claude Code
2. **Use /cdd:decide for complex decisions:** Get multi-agent expert input
3. **Provide evidence when completing work:** Screenshots, test output, deployment URLs
4. **Add code search (optional):** [jcodemunch-mcp setup](JCODEMUNCH.md) — richer codebase analysis in decisions [jcodemunch official docs](https://github.com/jgravelle/jcodemunch-mcp)

**Feedback and discussions:** https://github.com/emb715/cdd/discussions
