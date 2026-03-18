# CDD Quick Start

Get productive in 2 minutes.

## Install

Run inside your project (not globally):

```bash
npx @emb715/cdd init
```

Installs commands, agents, skill, templates, stop hook, and adds a CDD section to `CLAUDE.md`. After init, Claude will automatically suggest CDD commands when relevant.

---

## The 6 Commands

### `/cdd:scope [brief]`

Scope a large body of work before starting.

```bash
/cdd:scope greenfield SaaS: auth, billing, API, admin dashboard
```

The agent interviews you first — one question at a time, walking down the design tree — then drafts `_cdd/scope/YYYY-MM-DD-[slug].md`. Review and edit it, then start each item with `/cdd:start`.

- **You know what you're building** → skip this, use `/cdd:start`
- **You need to figure out what to build first** → use `/cdd:scope`

---

### `/cdd:start [description]`

Create a new work item.

```bash
/cdd:start add user authentication
/cdd:start fix login timeout bug
```

Creates `_cdd/0001-.../CONTEXT.md`, `SESSIONS.md`, and `STATUS.md` in ~30 seconds.

---

### `/cdd:loop`

Full-cycle orchestration. Reads tasks from `CONTEXT.md`, groups them by file overlap for parallel safety, spawns sub-agents, auto-logs, reviews with `cdd-victor-reid`, optionally auto-completes. Survives context rotation via checkpoint + stop hook.

```bash
/cdd:loop                        # auto-detect work item
/cdd:loop 0003-add-oauth         # specific work item
/cdd:loop --dry-run              # plan groups only, no execution
/cdd:loop --resume               # continue from checkpoint
/cdd:loop --accept               # continue past non-blocking review issues
/cdd:loop --rollback             # reset to last checkpoint
```

Configure via `_cdd/.meta/loop.config.yaml`.

---

### `/cdd:log`

Save session progress.

```bash
/cdd:log
```

Detects file changes, marks tasks complete, appends to `SESSIONS.md`, updates `STATUS.md`. ~10 seconds.

---

### `/cdd:decide "[question]"`

Multi-agent research for hard decisions.

```bash
/cdd:decide "Should we use PostgreSQL or MongoDB?"
/cdd:decide "REST or GraphQL?"
```

Spawns 4 parallel agents to research options. You make the final call. Saves a decision artifact. ~2-3 min.

---

### `/cdd:done`

Mark work complete.

```bash
/cdd:done
```

Verifies tasks, adds final session log, updates status. ~30 seconds.

---

## Agents (Direct Use)

Beyond CDD commands, invoke Sage agents directly for general work:

```bash
/cdd-sage                # Adaptive — auto-selects mode based on context
/cdd-sage-balanced       # Efficient development (recommended default)
/cdd-sage-specialist     # Deep technical: architecture, edge cases, optimization
/cdd-sage-mentor         # Learning mode: explains principles and reasoning
```

See [AGENTS.md](AGENTS.md) for the full guide.

---

## Example: Feature with Decision

```bash
# 1. Start
/cdd:start implement caching layer

# 2. Hit a decision point
/cdd:decide "Redis vs Memcached vs in-memory?"
# AI researches... presents findings
# You decide: Redis

# 3. Let the loop implement it
/cdd:loop

# — or implement manually, then log —
/cdd:log

# 4. Complete
/cdd:done
```

---

## File Structure

```
your-project/
├── _cdd/
│   ├── .meta/
│   │   └── loop.config.yaml     # Orchestrator config
│   ├── scope/                   # Scope plans (from /cdd:scope)
│   └── 0001-caching-layer/
│       ├── CONTEXT.md           # Problem, solution, tasks, decisions
│       ├── SESSIONS.md          # Session log
│       └── STATUS.md            # Runtime state (phase, progress, blockers)
├── .claude/
│   ├── commands/                # The 6 CDD commands
│   ├── agents/                  # cdd-honest, cdd-victor-reid, cdd-sage/
│   ├── skills/cdd-workflow/     # Auto-suggests CDD when relevant
│   └── hooks/cdd-loop-resume.sh # Auto-resumes /cdd:loop after context rotation
└── CLAUDE.md                    # CDD section added by init
```

---

## Task Format

Tasks in `CONTEXT.md` that work with `/cdd:loop` and `/cdd:log`:

```markdown
- [ ] Task description
      **Files:** `path/to/file.ts`, `path/to/test.ts`
      **Done when:** Specific, testable condition (not "it works")
```

`Done when:` is load-bearing — it's what the code reviewer uses to make PASS/FAIL calls. Make it testable: "POST /auth returns 200 with valid token. Invalid credentials return 401."

---

## Stop Hook Setup

Register the auto-resume hook in `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [{ "type": "command", "command": "bash .claude/hooks/cdd-loop-resume.sh" }]
  }
}
```

Without it: paste the resume command manually when context rotates. State is never lost.

---

## Next Steps

1. `/cdd:start your-first-feature`
2. Code, or run `/cdd:loop`
3. `/cdd:log` after each session
4. `/cdd:done` when done

Issues: https://github.com/emb715/cdd/issues
