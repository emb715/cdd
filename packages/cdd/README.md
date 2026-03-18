# CDD - Context-Driven Development

> **Productivity-first AI workflow. Zero ceremony, maximum focus.**

[![Quick Start](https://img.shields.io/badge/Quick_Start-2_minute_intro-0ea5e9?style=for-the-badge)](https://github.com/emb715/cdd/blob/main/packages/cdd/QUICK_START.md)
[![Discussion](https://img.shields.io/badge/Discussion-report_bug-f43f5e?style=for-the-badge)](https://github.com/emb715/cdd/discussions)

---

## What is CDD?

CDD (Context-Driven Development) is a methodology for working with AI assistants that keeps you in flow state. **No boilerplate, no context pollution, no ceremony.**

You describe the work once in a `CONTEXT.md` file. Commands handle session logging, parallel research, code review, and completion — so you stay focused on the actual work.

Best for features and bugs that span multiple sessions. For quick one-off fixes, no need to create a work item.

### Philosophy

1. **Context as infrastructure** — Single source of truth persists across sessions
2. **Humans decide, AI researches** — Final decision always human-made
3. **Zero ceremony** — No mandatory tracking, no overhead, just work
4. **Progressive disclosure** — Start minimal, expand as needed
5. **Start in 30 seconds, refine as you go** — no upfront planning required

---

## Install

Project-based install — run this inside your project:

```bash
npx @emb715/cdd init
```

Installs into your project:
- Commands → `.claude/commands/`
- Agents → `.claude/agents/`
- Skill → `.claude/skills/cdd-workflow/` (Claude auto-suggests CDD when relevant)
- Templates → `_cdd/.meta/`
- Stop hook → `.claude/hooks/`
- CDD section → `CLAUDE.md` (created or updated)

---

## Commands

### `/cdd:scope [brief]`

Scope a large body of work before starting. Use when the work breakdown itself is the first problem — greenfield projects, big epics, multi-phase sprints.

- **You know what you're building** → skip this, use `/cdd:start`
- **You need to figure out what to build first** → use `/cdd:scope`

```bash
/cdd:scope greenfield SaaS: auth, billing, API, admin dashboard
/cdd:scope migrate monolith to microservices
```

The agent interviews you first — one question at a time, walking down the design tree — then drafts a scope plan at `_cdd/scope/YYYY-MM-DD-[slug].md`. Review it, then start each item with `/cdd:start`.

### `/cdd:start [description]`

Create a work item. Auto-detects type from keywords (`fix` = bug, `add` = feature, `refactor` = refactor, `research` = spike). Generates `_cdd/NNNN-slug/CONTEXT.md`, `SESSIONS.md`, and `STATUS.md`.

```bash
/cdd:start add user authentication with OAuth
/cdd:start fix login timeout bug
```

### `/cdd:loop`

Full-cycle orchestrator. Reads tasks from `CONTEXT.md`, groups by file overlap for parallel safety, spawns sub-agents (each reads only its own task block), auto-logs, runs code review with `cdd-victor-reid`, and optionally auto-completes. Writes `checkpoint.md` + `.resume` at rotation threshold — the stop hook auto-resumes if context rotates mid-run.

```bash
/cdd:loop
/cdd:loop 0003-add-oauth
/cdd:loop --dry-run     # plan task groups only
/cdd:loop --resume      # continue from checkpoint
/cdd:loop --accept      # continue past non-blocking review issues
/cdd:loop --skip        # skip review
/cdd:loop --rollback    # reset to last checkpoint
```

Configure in `_cdd/.meta/loop.config.yaml`: `rotation_threshold`, `agent_timeout_seconds`, `review_enabled`, `auto_done`.

### `/cdd:log`

Log session progress. Reads git diff, matches changed files to tasks in `CONTEXT.md`, auto-marks completed tasks, appends to `SESSIONS.md`, updates `STATUS.md`.

```bash
/cdd:log        # auto-detect work item
/cdd:log 0001   # specific work item
```

### `/cdd:decide "[question]"`

Multi-agent decision research. Spawns 4 parallel agents (option advocates, codebase analyzer, synthesizer), presents findings and a recommendation. You make the final call. Saves a decision artifact with your rationale.

```bash
/cdd:decide "Should we use REST or GraphQL?"
/cdd:decide "PostgreSQL vs MongoDB for user data"
```

### `/cdd:done`

Mark work item complete. Verifies tasks, adds final session log, updates status.

```bash
/cdd:done
```

---

## Project Structure

After `init`, your project gets:

```
_cdd/
  .meta/
    templates/          # CONTEXT.md, SESSIONS.md, STATUS.md, SCOPE_PLAN.md
    instructions/       # Agent instruction files
    loop.config.yaml    # Orchestrator config
  scope/                # Scope plans (from /cdd:scope)
  0001-work-item/
    CONTEXT.md          # Problem, solution, tasks, decisions
    SESSIONS.md         # Session log
    STATUS.md           # Lean runtime state (phase, progress, active task, blockers)
.claude/
  commands/             # cdd:start, cdd:log, cdd:decide, cdd:done, cdd:scope, cdd:loop
  agents/               # cdd-honest, cdd-victor-reid, cdd-sage/
  skills/
    cdd-workflow/       # Auto-triggers CDD guidance in Claude sessions
  hooks/
    cdd-loop-resume.sh  # Auto-resumes /cdd:loop after context rotation
CLAUDE.md               # CDD section added automatically
```

---

## CONTEXT.md Format

```markdown
---
id: 0001
title: User Authentication
type: feature
status: in-progress
created: 2026-01-15
---

# User Authentication

## Why
Users need secure login.

## Solution
OAuth2 + JWT sessions.

## Tasks

- [ ] Setup OAuth providers
      **Files:** `lib/auth/oauth.ts`
      **Done when:** OAuth flow completes end-to-end. `/auth/callback` returns a valid session token.

- [ ] Create JWT service
      **Files:** `lib/auth/jwt.ts`
      **Done when:** `signToken` and `verifyToken` pass unit tests. Expired tokens return 401.

## Decisions

**2026-01-15: OAuth vs Custom Auth** — Chose OAuth2. Better security, users prefer existing accounts.
```

`Done when:` fields are load-bearing — they're what `cdd-victor-reid` uses to make PASS/FAIL calls during `/cdd:loop` review. Make them testable, not descriptive.

File hints let `/cdd:log` auto-mark tasks complete when matching files are modified. Glob patterns work: `lib/auth/providers/*.ts`.

---

## Agents

| Agent | Role |
|-------|------|
| `cdd-honest` | Autonomous executor used by workflow commands |
| `cdd-victor-reid` | Code reviewer used by `/cdd:loop` |
| `cdd-sage` | Adaptive expert — auto-selects Specialist, Balanced, or Mentor mode |
| `cdd-sage-specialist` | Deep technical work, architecture, edge cases |
| `cdd-sage-balanced` | Efficient general development (recommended default) |
| `cdd-sage-mentor` | Teaching mode — explains principles and reasoning |


---

## Documentation

- [Quick Start](https://github.com/emb715/cdd/blob/main/packages/cdd/QUICK_START.md) — 2-minute intro
- [Tutorial](https://github.com/emb715/cdd/blob/main/docs/CDD_TUTORIAL.md) — complete guide with examples
- [Agents Guide](https://github.com/emb715/cdd/blob/main/packages/cdd/AGENTS.md) — agent reference

---

## License

MIT
