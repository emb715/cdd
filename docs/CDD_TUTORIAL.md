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

## Installation

```bash
cd your-project-root
npx @emb715/cdd init
```

This installs into your project:

```
_cdd/
├── .meta/
│   ├── templates/       # CONTEXT.md, SESSIONS.md, STATUS.md, SCOPE_PLAN.md
│   ├── instructions/    # Agent instruction files
│   └── loop.config.yaml # Orchestrator config
├── scope/               # Scope plans (from /cdd:scope)
└── 0000-example/        # Example work item (delete when ready)
    ├── CONTEXT.md        # Problem, solution, tasks, decisions
    ├── SESSIONS.md       # Session log
    └── STATUS.md         # Runtime state (phase, progress, active task, blockers)
.claude/
├── commands/            # The 6 CDD commands
├── agents/              # cdd-honest, cdd-victor-reid, cdd-sage/
├── skills/
│   └── cdd-workflow/    # Auto-suggests CDD commands when relevant
└── hooks/
    └── cdd-loop-resume.sh  # Auto-resumes /cdd:loop after context rotation
CLAUDE.md                # CDD section added automatically
```

### Verify Slash Commands

In Claude Code, type `/cdd:` and you should see autocomplete for:
- `/cdd:scope` — Scope large workloads (greenfield, epics, sprints)
- `/cdd:start` — Create a new work item
- `/cdd:loop` — Full-cycle orchestration with parallel agents and review
- `/cdd:log` — Auto-detect and log session activity
- `/cdd:decide` — Multi-agent research, you make the call
- `/cdd:done` — Mark work complete

---

## Core Concepts

### Architecture: Agent Orchestration

CDD commands use specialized agents for autonomous execution. This keeps conversations clean, execution fast, and workflows consistent.

**How it works:**

```
User runs: /cdd:start add user auth

Flow:
1. Command parses input
2. Spawns cdd-honest agent with instruction template
3. Agent executes autonomously (no user prompts)
4. Returns clean output to user
5. Main conversation stays unpolluted
```

**Agents:**

| Agent | Role | Used by |
|-------|------|---------|
| `cdd-honest` | Direct executor | `/cdd:start`, `/cdd:log`, `/cdd:done`, `/cdd:loop` (tasks + fixes) |
| `cdd-victor-reid` | Rigorous code reviewer | `/cdd:loop` (REVIEW protocol) |
| `cdd-sage-specialist` | Deep domain expert | `/cdd:scope`, `/cdd:decide` |
| `cdd-sage-balanced` | Efficient generalist | `/cdd:decide` |

**Agent permissions:**

`cdd-honest` comes pre-configured with git read permissions:
- `git diff --name-only HEAD` (detect changed files)
- `git ls-files --others --exclude-standard` (detect new files)
- `git log` (read commit history)

CDD commands run autonomously without prompting for git operations. File write operations still respect your global permission mode.

### Unified Context File

CDD uses a single progressive `CONTEXT.md` file that grows with your project:

```markdown
---
id: 0001
title: Fernet Price Tracker
type: feature
status: in-progress
created: 2026-01-15
---

# Fernet Price Tracker

## Why
Track Fernet Branca prices over time to visualize inflation in Argentina.

## Solution
Convex backend with React frontend. Products + price_snapshots schema.

## Tasks

- [ ] Convex schema (products, price_snapshots)
      **Files:** `convex/schema.ts`
      **Done when:** Schema deploys without error. Both tables visible in Convex dashboard.

- [ ] Backend mutations
      **Files:** `convex/products.ts`, `convex/priceSnapshots.ts`
      **Done when:** CRUD operations pass manual test via Convex dashboard. Price validation rejects negative values.

- [ ] PriceChart component
      **Files:** `src/components/PriceChart.tsx`
      **Done when:** Chart renders with real data. ResponsiveContainer fills parent. Tooltip shows ARS-formatted price.

## Decisions

**2026-01-15: Unix timestamps** — Convex doesn't support Date objects. Use numbers for observed_date.
```

### STATUS.md — Lean Runtime State

Each work item has a `STATUS.md` that captures the current runtime state in ~15 lines of YAML. It is the first thing `/cdd:loop` and agents read — much faster than loading the full CONTEXT.md.

```yaml
work_id: 0001-fernet-price-tracker
phase: execution
phase_progress: 2/5 tasks complete
active_task: T3 — PriceChart component
next_pending: T4 — HistoricalTable component
blockers: none
last_updated: 2026-01-16 10:30
```

`/cdd:log` updates STATUS.md automatically after each session.

### Done When — The Spec Contract

`Done when:` fields in tasks are load-bearing. They are what `cdd-victor-reid` uses to make PASS/FAIL calls during `/cdd:loop` review. Make them testable, not descriptive.

**Bad:** `Done when: The chart works correctly`

**Good:** `Done when: Chart renders with real data. ResponsiveContainer fills parent. Tooltip shows ARS-formatted price and date in es-AR locale.`

If `Done when:` is vague, review becomes a judgment call instead of a verification. The weaker the spec, the more likely the loop retries.

### Minimal Session Log

`SESSIONS.md` captures only what matters:

```markdown
# Sessions: 0001-fernet-price-tracker

## 2026-01-16 10:05 - Frontend components (1h 45m)
- Built PriceChart, PriceEntryForm, HistoricalTable
- Problem: ResponsiveContainer needed explicit parent height
- Added Recharts dependency
```

### Evidence-Based Completion

When you run `/cdd:done`, the agent verifies tasks are complete. Valid evidence:

**Good:**
- Test output showing passes
- API response examples
- Screenshots of working UI
- Deployment URLs
- Error logs showing fixed bugs

**Bad:**
- "I tested it and it works"
- "The code looks good"
- "Trust me"

Future sessions need proof, not promises. Evidence prevents revisiting solved problems.

### Human-AI Collaboration Boundaries

**Human decides:**
- Whether work is complete
- What evidence is sufficient
- When to deviate from plan
- Which features to prioritize

**AI assists:**
- Generates initial drafts
- Suggests file structures
- Researches decisions in parallel
- Implements tasks autonomously via `/cdd:loop`

---

## Complete Mock Session: Fernet Branca Inflation Tracker

### Project Overview

**Goal:** Track Fernet Branca prices over time in Argentina to visualize inflation.

**Stack:**
- Backend: Convex (real-time database, serverless functions)
- Frontend: React with Recharts for visualization

### Step 1: Start Work

```bash
/cdd:start build fernet branca price tracker with Convex backend and React frontend
```

**Agent creates:** `_cdd/0001-build-fernet-branca-price-tracker/`

```
Work item created: 0001-build-fernet-branca-price-tracker
Type: feature

Files:
  CONTEXT.md
  SESSIONS.md
  STATUS.md

Start working. Use /cdd:log when you make progress, or /cdd:loop to run the full cycle.
```

Open `_cdd/0001-build-fernet-branca-price-tracker/CONTEXT.md`, fill in Why, Solution, and tasks with `Files:` and `Done when:` fields.

### Step 2: Let the Loop Run It

Once tasks are defined:

```bash
/cdd:loop
```

The orchestrator:
1. Reads tasks from CONTEXT.md — extracts task IDs and file scopes only (agents read their own task details at dispatch time)
2. Groups tasks by file overlap for parallel safety
3. Spawns parallel sub-agents (cdd-honest) for non-overlapping tasks
4. Auto-logs after each group completes
5. Runs `cdd-victor-reid` review against `Done when:` criteria
6. Retries fixes for any issues found
7. Stops for human input if blocking issues can't be resolved

```
[LOOP] event=0/4 | group=1 | done=0 | pending=5
  Starting: Convex schema, Backend mutations (parallel)
[LOOP] event=1/4 | group=2 | done=2 | pending=3
  Starting: PriceChart, PriceEntryForm, HistoricalTable (parallel)
[LOOP] event=2/4 | group=3 | done=5 | pending=0
  Review: cdd-victor-reid
[LOOP] Review PASS — all done-when criteria satisfied.
[LOOP] All tasks complete. Run /cdd:done to close 0001-build-fernet-branca-price-tracker.
```

If context rotates mid-run, state is saved to checkpoint and the stop hook auto-resumes.

### Step 3: Manual Session (alternative to loop)

If you prefer to implement manually:

```bash
/cdd:log
```

**Agent auto-detects changes:**

```
Session logged: 0001-build-fernet-branca-price-tracker

Completed: 3 tasks (matched via Files: hints)
Progress: 0% → 43%
STATUS.md updated.

Next: PriceChart component, PriceEntryForm component
```

### Step 4: Multi-Agent Decision

Before building the chart, you want expert input:

```bash
/cdd:decide "best approach for PriceChart with Recharts time-series visualization"
```

4 parallel Sage agents research the question. Results written to `_cdd/0001-.../decisions/2026-01-16-chart-implementation.md`. You make the final call — agent records your rationale.

### Step 5: Complete Work

```bash
/cdd:done
```

**Agent verifies and outputs:**

```
Work item completed: 0001-build-fernet-branca-price-tracker
Status: in-progress → complete
Tasks: 5/5 (100%)
Sessions: 2

Ready to ship. Use /cdd:start for next work item.
```

---

## Advanced Usage

### Scoping Large Work First

For greenfield projects, epics, or anything where the work breakdown is itself the first problem:

```bash
/cdd:scope greenfield SaaS: auth, billing, API, admin dashboard
```

- **You know what you're building** → skip this, use `/cdd:start`
- **You need to figure out what to build first** → use `/cdd:scope`

The agent interviews you first — one question at a time, walking down the design tree — then drafts `_cdd/scope/YYYY-MM-DD-[slug].md` with work items, phases, and dependencies. Review and edit it, then start each item with `/cdd:start`.

### /cdd:loop Configuration

Edit `_cdd/.meta/loop.config.yaml` to tune orchestrator behavior:

```yaml
rotation_threshold: 4        # events before context rotation checkpoint
agent_timeout_seconds: 120   # health-check interval per agent
task_max_retries: 1          # retries for stuck tasks
review_enabled: true         # run cdd-victor-reid after execution
review_max_retries: 3        # fix-and-re-review attempts before stop
auto_done: false             # auto-run /cdd:done when all tasks complete
```

### Stop Hook Setup

Register the auto-resume hook in `.claude/settings.json` to survive context rotation without manual intervention:

```json
{
  "hooks": {
    "Stop": [{ "type": "command", "command": "bash .claude/hooks/cdd-loop-resume.sh" }]
  }
}
```

Without it: paste the resume command manually when context rotates. State is never lost — checkpoint.md always has the restore point.

### Task Auto-Detection with File Hints

```markdown
- [ ] Implement OAuth
      **Files:** `lib/auth/oauth.ts`, `lib/auth/providers/*.ts`
      **Done when:** OAuth flow completes end-to-end. /auth/callback returns a valid session token.
```

When `/cdd:log` runs, it matches git changes to `Files:` hints and auto-marks tasks complete. Glob patterns work: `lib/auth/providers/*.ts` matches any file in that folder.

### Decision Reuse

Reference past decisions in new work:

```markdown
**See previous:** [decisions/2026-01-10-auth-strategy.md](decisions/2026-01-10-auth-strategy.md)
```

Build a decision library over time. Future decisions benefit from past research.

### Multiple Work Items in Parallel

```bash
/cdd:start feature A    # creates _cdd/0001-feature-a/
/cdd:log                # auto-detects which work item changed
/cdd:start feature B    # creates _cdd/0002-feature-b/
/cdd:log
```

Each work item has its own folder, context, and session log. `/cdd:log` auto-detects which one changed via git diff.

---

## Best Practices

### Writing Good Done-When Criteria

**Bad:**
```markdown
**Done when:** The auth works correctly
```

**Good:**
```markdown
**Done when:** POST /auth/login returns 200 with valid JWT for correct credentials.
Invalid password returns 401. Expired token returns 401 on protected routes.
```

### Writing Good Evidence for /cdd:done

**Bad:**
```
Evidence: I tested the login flow and it works fine.
```

**Good:**
```
Evidence:
- Test output: 12/12 auth tests passing (npm test auth)
- Manual: login with test@example.com / TestPass123 → dashboard redirect ✓
- Manual: wrong password → "Invalid credentials" error ✓
- Deployed: https://app.example.com/login
```

### Anti-Patterns

**Don't log every 5 minutes** — overhead exceeds value. Log every 30-60 min or at natural breakpoints (task complete, context switch).

**Don't use /cdd:decide for obvious choices** — wastes 2-5 min. Reserve it for genuinely hard technical choices with multiple valid approaches.

**Don't skip file hints** — without `**Files:**`, auto-detection can't match tasks to changes. `/cdd:log` can't mark tasks complete, and `/cdd:loop` can't group tasks safely.

**Don't skip Done when:** — without testable criteria, `cdd-victor-reid` can't make a binary call. Review becomes subjective and retry loops become likely.

**Don't create work items for 5-minute changes** — for quick fixes, just commit with a good message. CDD is for work spanning multiple sessions.

**Don't run /cdd:loop without filling in tasks first** — the loop reads CONTEXT.md tasks to build its execution plan. An empty or vague task list produces empty or vague output.

### When to Use decisions/ Folder

**Keep in CONTEXT.md:**
- Simple decisions (< 1 paragraph)
- Tactical choices (formatting, library versions)
- Temporary constraints

**Move to decisions/:**
- Complex architectural decisions (> 2 paragraphs)
- Long-term strategic choices (database, framework)
- Decisions requiring multi-agent research via `/cdd:decide`

---

## Appendix: Command Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `/cdd:scope [brief]` | Scope large workloads | `/cdd:scope greenfield SaaS: auth, billing` |
| `/cdd:start [description]` | Create work item | `/cdd:start add user auth` |
| `/cdd:loop` | Full-cycle orchestration | `/cdd:loop 0001-add-oauth` |
| `/cdd:log` | Auto-detect and log session | `/cdd:log` |
| `/cdd:decide "[question]"` | Multi-agent research, you decide | `/cdd:decide "REST or GraphQL?"` |
| `/cdd:done` | Mark complete | `/cdd:done` |

**`/cdd:loop` flags:**

| Flag | Effect |
|------|--------|
| `--dry-run` | Plan task groups only, no execution |
| `--resume` | Continue from checkpoint |
| `--accept` | Continue past non-blocking review issues |
| `--skip` | Skip review entirely |
| `--rollback` | Reset to last checkpoint |

**File structure:**

```
_cdd/
├── .meta/
│   ├── templates/        # CONTEXT.md, SESSIONS.md, STATUS.md, SCOPE_PLAN.md
│   ├── instructions/     # Agent instruction files
│   └── loop.config.yaml  # Orchestrator config
├── scope/                # Scope plans (from /cdd:scope)
└── XXXX-work-name/
    ├── CONTEXT.md        # Problem, solution, tasks, decisions
    ├── SESSIONS.md       # Session log
    ├── STATUS.md         # Runtime state (phase, progress, active task, blockers)
    └── decisions/        # Multi-agent decision artifacts (from /cdd:decide)
```

---

## Next Steps

1. **Start your first session:** `/cdd:start your-first-feature`
2. **Let the loop run it:** `/cdd:loop` — or implement manually and `/cdd:log`
3. **Hard decision?** `/cdd:decide "your question"` — get multi-agent research, you decide
4. **Done:** `/cdd:done`

**Feedback and discussions:** https://github.com/emb715/cdd/discussions
