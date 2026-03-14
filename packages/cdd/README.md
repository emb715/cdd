# CDD - Context-Driven Development

> **Productivity-first AI workflow. Zero ceremony, maximum focus.**

[![Quick Start](https://img.shields.io/badge/Quick_Start-2_minute_intro-0ea5e9?style=for-the-badge)](https://github.com/emb715/cdd/blob/main/packages/cdd/QUICK_START.md)
[![Tutorial](https://img.shields.io/badge/Tutorial-full_guide-8b5cf6?style=for-the-badge)](https://github.com/emb715/cdd/blob/main/docs/CDD_TUTORIAL.md)
[![Discussion](https://img.shields.io/badge/Discussion-report_bug-f43f5e?style=for-the-badge)](https://github.com/emb715/cdd/discussions)

---

## What is CDD?

CDD (Context-Driven Development) is a methodology for working with AI assistants that keeps you in flow state. **No interviews, no boilerplate, no context pollution.**

You describe the work once in a `CONTEXT.md` file. Commands handle session logging, parallel research, code review, and completion — so you stay focused on the actual work.

### Core Philosophy

1. **Speed over perfection** — Start working in 30 seconds, refine as you go
2. **AI-native decisions** — Let multiple agents research in parallel, you make the call
3. **Zero ceremony** — No mandatory tracking, no overhead, just work

Best for features and bugs that span multiple sessions. For quick fixes under 30 minutes, skip CDD and commit with a good message.

---

## Install

```bash
npx @emb715/cdd init
```

Copies commands to `.claude/commands/`, agents to `.claude/agents/`, templates to `_cdd/.meta/`, and the stop hook to `.claude/hooks/`.

---

## Commands

### `/cdd:start [description]`

Create a work item. Auto-detects type from keywords (`fix` = bug, `add` = feature, `refactor` = refactor, `research` = spike). Generates `_cdd/NNNN-slug/CONTEXT.md` and `SESSIONS.md`.

```bash
/cdd:start add user authentication with OAuth
```

### `/cdd:log`

Log session progress. Reads git diff, matches changed files to tasks in `CONTEXT.md`, auto-marks completed tasks, appends to `SESSIONS.md`.

```bash
/cdd:log        # auto-detect work item
/cdd:log 0001   # specific work item
```

### `/cdd:decide [topic]`

Multi-agent decision research. Spawns 4 parallel agents (option advocates, codebase analyzer, synthesizer), presents findings and a recommendation. You make the final call. Saves a decision artifact with your rationale.

```bash
/cdd:decide Should we use REST or GraphQL?
/cdd:decide PostgreSQL vs MongoDB for user data
```

### `/cdd:done`

Mark work item complete. Verifies tasks, adds final session log, updates status.

```bash
/cdd:done
/cdd:done --summary   # generates IMPLEMENTATION_SUMMARY.md from CONTEXT.md + session history
```

### `/cdd:loop`

Full-cycle orchestrator. Reads tasks from `CONTEXT.md`, groups by file overlap for parallel safety, spawns sub-agents, auto-logs, runs code review with `cdd-victor-reid`, and optionally auto-completes. Writes `checkpoint.md` + `.resume` at rotation threshold — the stop hook auto-resumes if context rotates mid-run.

```bash
/cdd:loop
/cdd:loop --dry-run
```

Configure in `_cdd/.meta/loop.config.yaml`: `rotation_threshold`, `agent_timeout_seconds`, `review_enabled`, `auto_done`.

---

## Project Structure

After `init`, your project gets:

```
_cdd/
  NNNN-work-item/
    CONTEXT.md      # problem, solution, tasks, decisions
    SESSIONS.md     # session log
.claude/
  commands/         # cdd:start, cdd:log, cdd:decide, cdd:done, cdd:loop
  agents/           # cdd-honest, cdd-victor-reid, sage/
  hooks/
    cdd-loop-resume.sh   # auto-resumes /cdd:loop after context rotation
_cdd/.meta/
  templates/        # CONTEXT.md, SESSIONS.md templates
  loop.config.yaml  # orchestrator config
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
- [ ] Create JWT service
      **Files:** `lib/auth/jwt.ts`

## Decisions

**2026-01-15: OAuth vs Custom Auth** - Chose OAuth2. Better security, users prefer existing accounts.
```

File hints let `/cdd:log` auto-mark tasks complete when matching files are modified. Glob patterns work: `lib/auth/providers/*.ts` matches any file in that folder.

---

## Agents

| Agent | Role |
|-------|------|
| `cdd-honest` | Autonomous executor used by workflow commands (git read permissions pre-configured) |
| `cdd-victor-reid` | Code reviewer used by `/cdd:loop` |
| `cdd-sage/` | Research agents used by `/cdd:decide` |

---

## License

MIT
