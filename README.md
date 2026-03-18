# Context-Driven Development (CDD)

> AI-native productivity workflow with human-centered decision making

[![npm version](https://badge.fury.io/js/@emb715%2Fcdd.svg)](https://www.npmjs.com/package/@emb715/cdd)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What is CDD?

CDD (Context-Driven Development) is a minimal AI workflow for solo developers. You describe the work once in a `CONTEXT.md` file. Commands handle session logging, parallel research, code review, and completion — so you stay focused on the actual work.

Best for features and bugs that span multiple sessions. For quick one-off fixes, no need to create a work item.

## Philosophy

1. **Context as infrastructure** — Single source of truth persists across sessions
2. **Humans decide, AI researches** — Final decision always human-made
3. **Zero ceremony** — No mandatory tracking, metrics, or boilerplate
4. **Progressive disclosure** — Start minimal, expand as needed
5. **Start in 30 seconds, refine as you go** — no upfront planning required

---

## Install

Run inside your project:

```bash
npx @emb715/cdd init
```

---

## Documentation

- [Quick Start](packages/cdd/QUICK_START.md) — Get productive in 2 minutes
- [Package README](packages/cdd/README.md) — Full command reference
- [Tutorial](docs/CDD_TUTORIAL.md) — Deep dive with complete examples and best practices
- [Agents Guide](packages/cdd/AGENTS.md) — Agent reference

---

## The 6 Commands

| Command | What it does |
|---------|-------------|
| `/cdd:scope [brief]` | Scope large workloads — interviews you, produces a work item plan |
| `/cdd:start [description]` | Create a work item (30 sec) |
| `/cdd:loop` | Full-cycle orchestration — parallel agents, auto-log, review |
| `/cdd:log` | Save session progress |
| `/cdd:decide "[question]"` | 4 parallel agents research options, you decide |
| `/cdd:done` | Mark work complete |

---

**Feedback and discussions:** https://github.com/emb715/cdd/discussions
