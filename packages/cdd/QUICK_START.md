# CDD Quick Start Guide

> **New to CDD?** Get productive in 2 minutes with this quick introduction.
>
> **Need depth?** See the [Complete Tutorial](../../docs/CDD_TUTORIAL.md) for architecture, examples, and best practices.

## Installation

```bash
npm install -g @emb715/cdd
cd your-project/
npx @emb715/cdd init
```

You now have CDD commands available in Claude Code!

---

## The 5-Command Workflow

### `/cdd:scope [brief]`

Scope a large body of work before starting.

```bash
/cdd:scope greenfield SaaS: auth, billing, API, admin dashboard
```

**What it does:** AI drafts a scope plan at `_cdd/scope/YYYY-MM-DD-[slug].md` with work items, phases, and dependencies (~2 min). You review and edit it, then start each item with `/cdd:start [item] (scoped)`.

→ Use when the work breakdown itself is the first problem to solve (greenfield, big epics, sprints)

---

### `/cdd:start [description]`

Create a new work item.

```bash
/cdd:start add user authentication
```

**What it does:** Creates `_cdd/0001-.../` with CONTEXT.md and SESSIONS.md (30 sec)

→ *See [Tutorial: Complete Walkthrough](../../docs/CDD_TUTORIAL.md#complete-mock-session-fernet-branca-inflation-tracker) for detailed example*

---

### `/cdd:log`

Auto-detect and log session progress.

```bash
/cdd:log
```

**What it does:** Detects file changes, marks tasks complete, appends to SESSIONS.md (10 sec)

→ *See [Tutorial: Unified Context File](../../docs/CDD_TUTORIAL.md#unified-context-file) for how task auto-detection works*

---

### `/cdd:decide [topic]`

Launch multi-agent research for hard decisions.

```bash
/cdd:decide Should we use PostgreSQL or MongoDB?
```

**What it does:** Spawns 4 parallel agents to research options, YOU make final decision (2-3 min)

→ *See [Tutorial: Complete Walkthrough](../../docs/CDD_TUTORIAL.md#step-3-multi-agent-planning) for decision-making example*

---

### `/cdd:done`

Mark work complete.

```bash
/cdd:done
```

**What it does:** Marks status complete, adds final session log (30 sec)

→ *See [Tutorial: Evidence-Based Completion](../../docs/CDD_TUTORIAL.md#evidence-based-completion) for what constitutes good evidence*

---

## Available Agents

Beyond the 4 CDD commands, you can invoke specialized agents directly:

```bash
/cdd-sage                # Adaptive expert (auto-selects mode)
/cdd-sage-specialist     # Deep technical work
/cdd-sage-balanced       # Efficient development (recommended)
/cdd-sage-mentor         # Learning mode
```

→ *See [AGENTS.md](AGENTS.md) for complete agent guide*

---

## Complete Example: Feature with Decision

```bash
# 1. Start
/cdd:start implement caching layer

# 2. Hit a decision point
/cdd:decide Redis vs Memcached vs in-memory cache

# AI researches (2 min)...
# 🤖 AI SUGGESTION: Redis (Confidence: 🟢 High)
# 💭 Your decision?
# You: A (accept)

# 3. Code based on decision
# (implement Redis cache)

# 4. Log progress
/cdd:log

# 5. Complete
/cdd:done --summary
```

**Result:** Full decision artifact saved in `decisions/`, complete work history in `SESSIONS.md`

---

## File Structure

```
your-project/
├── _cdd/
│   ├── scope/                  # Scope plans (from /cdd:scope)
│   └── 0001-caching-layer/
│       ├── CONTEXT.md          # Problem, solution, tasks, decisions
│       ├── SESSIONS.md         # Session log
│       └── decisions/          # Multi-agent decision artifacts
└── .claude/commands/           # The 5 commands
```

→ *See [Tutorial: Core Concepts](../../docs/CDD_TUTORIAL.md#core-concepts) for detailed file structure*

---

## Command Flags Quick Reference

### `/cdd:start` flags
```bash
/cdd:start [description]                 # Basic
/cdd:start [description] --type=bug      # Override type detection
```

### `/cdd:log` flags
```bash
/cdd:log                    # Auto-detect work item
/cdd:log 0001               # Specific work item
```

### `/cdd:decide` flags
```bash
/cdd:decide [topic]                      # Binary or open-ended
/cdd:decide --options="A,B,C" [topic]    # Multi-option
```

### `/cdd:done` flags
```bash
/cdd:done                   # Simple completion
/cdd:done --summary         # Generate IMPLEMENTATION_SUMMARY.md
/cdd:done --skip-log        # Don't add final session
```

---

## Time Budget

| Task | Time | When |
|------|------|------|
| Create work item | 30 sec | Once per feature/bug |
| Log session | 10 sec | After each work session |
| Multi-agent decision | 2-5 min | Hard technical choices |
| Mark complete | 30 sec | When all tasks done |

**Rule of thumb:**
- Use `/cdd:decide` when: "I'm not sure which is better, need research"
- Just decide when: "I know what to do, just documenting it"

---

## Cheat Sheet

```bash
# Start work
/cdd:start add dark mode toggle
/cdd:start fix login bug --type=bug

# Log progress
/cdd:log                    # Auto-detect
/cdd:log 0001               # Specific item

# Make decisions
/cdd:decide Should we use REST or GraphQL?
/cdd:decide "Auth strategy" --options="OAuth,Custom,Magic Link"

# Finish
/cdd:done                   # Simple
/cdd:done --summary         # With docs
```

**File hints for auto-detection:**
```markdown
- [ ] Task name
      **Files:** `path/to/file.ts`
      **Done when:** Tests passing
```

---

## Next Steps

1. **Try it:** `/cdd:start your-first-feature`
2. **Code:** Build something!
3. **Log:** `/cdd:log` after working
4. **Complete:** `/cdd:done`
5. **Learn more:** Read the [Complete Tutorial](../../docs/CDD_TUTORIAL.md)

---

## Need Help?

- **Tutorial:** [Complete guide with examples](../../docs/CDD_TUTORIAL.md)
- **Troubleshooting:** [Tutorial: Troubleshooting](../../docs/CDD_TUTORIAL.md#troubleshooting)
- **Best Practices:** [Tutorial: Best Practices](../../docs/CDD_TUTORIAL.md#best-practices)
- **Issues:** https://github.com/emb715/cdd/issues

---

**Happy building! 🚀**

*CDD - Zero ceremony, maximum flow*
