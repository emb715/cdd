# Context-Driven Development (CDD)

> AI-native productivity workflow with human-centered decision making

[![npm version](https://badge.fury.io/js/@emb715%2Fcdd.svg)](https://www.npmjs.com/package/@emb715/cdd)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is CDD?

Context-Driven Development is a minimal, AI-assisted workflow for solo developers. It provides:

- **Structured context** - Single CONTEXT.md file per work item
- **Progress tracking** - Automatic session logging
- **Decision support** - Multi-agent research for hard choices
- **Zero ceremony** - Minimal overhead, maximum flow

**Core Philosophy:** Humans decide, AI assists. No boilerplate, no ceremony, just work.

---

## Installation

```bash
npx @emb715/cdd init
```

That's it! You now have:
- `_cdd/` folder for work items
- `.claude/commands/` with 4 AI commands
- Templates ready to use

---

## The 4-Command Workflow

### 1. Start Work
```bash
/cdd:start add user authentication
```

Creates `_cdd/0001-add-user-authentication/` with CONTEXT.md and SESSIONS.md (30 seconds).

### 2. Log Progress
```bash
/cdd:log
```

Auto-detects file changes, marks tasks complete, appends to SESSIONS.md (10 seconds).

### 3. Make Decisions
```bash
/cdd:decide Should we use PostgreSQL or MongoDB?
```

Launches 4 parallel AI agents to research options, presents findings, YOU make the final call (2-3 minutes).

### 4. Complete Work
```bash
/cdd:done
```

Marks work complete, adds final session log, optionally generates summary (30 seconds).

---

## File Structure

```
your-project/
├── _cdd/
│   ├── 0001-user-auth/
│   │   ├── CONTEXT.md          # Single source of truth
│   │   ├── SESSIONS.md         # Session log
│   │   └── decisions/          # Multi-agent decisions (optional)
│   │       └── 2024-01-15-db-choice.md
│   └── 0002-dark-mode/
│       ├── CONTEXT.md
│       └── SESSIONS.md
└── .claude/
    └── commands/
        ├── cdd:start.md
        ├── cdd:log.md
        ├── cdd:decide.md
        └── cdd:done.md
```

---

## CONTEXT.md Anatomy

Everything in one file:

```markdown
---
id: 0001
title: User Authentication
type: feature
status: in-progress
created: 2024-01-15
---

# User Authentication

## 🎯 Why (Problem)
[2-3 sentences: what problem are you solving?]

## 💡 Solution
[2-3 sentences: how will you solve it?]

## ✅ Tasks

<details open>
<summary><strong>Phase 1: Foundation</strong> (2/3 complete)</summary>

- [x] Setup OAuth providers
      **Files:** `lib/auth/oauth.ts`
      **Done when:** Config exists, tests pass

- [x] Create JWT service
      **Files:** `lib/auth/jwt.ts`
      **Done when:** Service implemented, tests passing

- [ ] Add session middleware
      **Files:** `lib/middleware/auth.ts`
      **Done when:** Middleware integrated

</details>

## 🧠 Context for AI

**Patterns to follow:**
- Use existing `TokenService` pattern

**Key files:**
- `lib/auth/` - Auth utilities

## 📝 Decisions

<details>
<summary><strong>2024-01-15: OAuth vs Custom Auth</strong></summary>

**Decision:** OAuth2

**Rationale:** Better security, users prefer it

**See full analysis:** [decisions/2024-01-15-auth-strategy.md](decisions/2024-01-15-auth-strategy.md)

</details>
```

**Key features:**
- Single file (no jumping around)
- Progressive disclosure (collapse/expand sections)
- Task hints (files → auto-detection)
- AI-friendly context

---

## Example Workflows

### Simple Feature
```bash
/cdd:start add dark mode toggle
# Code...
/cdd:log
/cdd:done
```

Time: 1 session, no decisions needed

### Complex Feature with Decisions
```bash
/cdd:start implement caching layer
/cdd:decide "Redis vs Memcached vs in-memory"
# Code based on decision...
/cdd:log
/cdd:decide "Caching strategy: write-through vs write-back"
# Code more...
/cdd:log
/cdd:done --summary
```

Time: Multiple sessions, 2+ decisions

### Bug Fix
```bash
/cdd:start fix login timeout after 5 minutes
# Investigate and fix...
/cdd:log
/cdd:done
```

Time: 1-2 sessions

---

## Multi-Agent Decision Making

When you hit a hard decision:

```bash
/cdd:decide Should we use REST or GraphQL?
```

**What happens:**
1. Spawns 4 specialized agents in parallel:
   - Option A advocate (researches pros/cons)
   - Option B advocate (researches pros/cons)
   - Codebase context analyzer (checks patterns, dependencies)
   - Analysis agent (compares objectively)
2. Researches for 2-3 minutes
3. Presents findings + AI suggestion with confidence level
4. **You make final decision**
5. Saves decision with your rationale

**Output example:**
```
🤖 AI SUGGESTION: PostgreSQL
Confidence: 🟢 High

Supporting Evidence:
1. You already use Postgres
2. JSONB handles key-value needs
3. Team familiar with SQL

💭 What's your decision? (A/B/C)
> You choose: A

✅ YOUR DECISION: PostgreSQL
```

**Key principle:** AI suggests, human decides. This is NOT automation - it's research assistance.

---

## Task Auto-Detection

Add file hints to tasks:

```markdown
- [ ] Implement OAuth
      **Files:** `lib/auth/oauth.ts`, `lib/auth/providers/*.ts`
```

When `/cdd:log` runs, it matches git changes to these files and auto-marks tasks complete.

**Smart matching:**
- Exact: `lib/auth/oauth.ts` = `lib/auth/oauth.ts`
- Related: Test file created alongside source = both complete
- Glob: `lib/auth/providers/*.ts` matches any file in that folder

---

## Time Budget

| Task | Time | When |
|------|------|------|
| Create work item | 30 sec | Once per feature/bug |
| Log session | 10 sec | After each work session |
| Make simple decision | 0 sec | Just decide and document |
| Multi-agent decision | 2-5 min | Hard technical choices |
| Mark complete | 30 sec | When all tasks done |

**Rule of thumb:**
- Use `/cdd:decide` when: "I'm not sure which is better, need research"
- Just decide when: "I know what to do, just documenting it"

---

## Best Practices

### ✅ Do

- Follow the implementation plan phases
- Save sessions regularly (not just at completion)
- Add `**Files:**` hints for auto-detection
- Keep CONTEXT.md focused with `<details>` tags
- Use `/cdd:decide` for hard technical choices

### ❌ Don't

- Don't log every 5 minutes (noisy session log)
- Don't use `/cdd:decide` for obvious decisions (2-5 min overhead)
- Don't skip file hints in tasks (breaks auto-detection)
- Don't create work items for 5-minute changes
- Don't make work items too large (break into multiple)

---

## Documentation

- **Quick Start:** [2-minute introduction](packages/cdd/QUICK_START.md) - Get productive immediately
- **Tutorial:** [Complete guide with examples](docs/CDD_TUTORIAL.md) - Deep dive into architecture and best practices
- **Package Docs:** [Technical reference](packages/cdd/README.md) - Full feature documentation
- **Code Search:** [jcodemunch-mcp setup](docs/JCODEMUNCH.md) - Optional: richer code analysis in decisions. [jcodemunch official docs](https://github.com/jgravelle/jcodemunch-mcp)
- **Templates:** `_cdd/.meta/templates/` - See what gets generated
- **Issues:** https://github.com/emb715/cdd/issues

---

## Philosophy

1. **Humans decide, AI researches** - Final decision always human-made
2. **Zero ceremony** - No mandatory tracking, metrics, or boilerplate
3. **Progressive disclosure** - Start minimal, expand as needed
4. **Context as infrastructure** - Single source of truth persists
5. **Speed over perfection** - 30 sec to start vs 10 min setup

---

## Get Started

```bash
# Install
npx @emb715/cdd init

# Create your first work item
/cdd:start your-first-feature

# Code...

# Log progress
/cdd:log

# Complete
/cdd:done
```

That's it! You're now doing Context-Driven Development.

---

## License

MIT License - see [LICENSE](LICENSE) file for full terms.

**Questions or feedback?** Open a new discussion or reach out to @emb715
