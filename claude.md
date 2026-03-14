# CDD - Context-Driven Development

## What This Is

CDD is an npm package that provides AI workflow commands for solo developers. Optimized for speed, minimal ceremony, and LLM efficiency.

**Core Philosophy:** Humans decide, AI assists. No boilerplate, no ceremony, just work.

## Package Structure

```
packages/cdd/
├── .claude/
│   ├── commands/             # 5 AI command wrappers (optimized for LLMs)
│   │   ├── cdd:start.md     # Create work item
│   │   ├── cdd:log.md       # Save session
│   │   ├── cdd:decide.md    # Multi-agent decision
│   │   ├── cdd:done.md      # Complete work
│   │   └── cdd:loop.md      # Full-cycle orchestrator (~280 lines)
│   ├── agents/              # Bundled CDD agents
│   │   ├── cdd-honest.md    # Autonomous executor (git read permissions)
│   │   ├── cdd-victor-reid.md  # Rigorous code reviewer (for /cdd:loop review)
│   │   └── sage/            # Multi-agent decision family (for /cdd:decide)
│   └── hooks/
│       └── cdd-loop-resume.sh  # Stop hook: auto-resumes /cdd:loop after rotation
├── bin/cdd.js               # CLI installer
├── _cdd/.meta/              # Templates and metadata
│   ├── templates/           # Templates (CONTEXT.md, SESSIONS.md)
│   ├── instructions/        # Agent instruction files (start.md, log.md, done.md)
│   └── loop.config.yaml     # User-editable orchestrator config
├── package.json             # NPM package config
└── README.md                # User documentation
```

## Key Files

**Commands (LLM-optimized):**
- All commands in `.claude/commands/` are optimized for LLM parsing (no emojis, minimal boilerplate)
- Each command has: Usage, Process steps, One example, Error handling

**CLI:**
- `bin/cdd.js` - Installs templates, commands, agents, hooks, and config to user projects
- Copies `_cdd/.meta/` → user's `_cdd/.meta/`, commands → `.claude/commands/`, agents → `.claude/agents/`, hook → `.claude/hooks/`

**Templates:**
- `_cdd/.meta/templates/CONTEXT.md` - Progressive work item template
- `_cdd/.meta/templates/SESSIONS.md` - Minimal session log
- `_cdd/.meta/templates/decisions/DECISION_TEMPLATE.md` - Multi-agent decision artifacts

**Orchestrator config (user-editable):**
- `_cdd/.meta/loop.config.yaml` - Controls `/cdd:loop` behavior: `rotation_threshold`, `agent_timeout_seconds`, `agent_stuck_threshold_seconds`, `task_max_retries`, `review_enabled`, `auto_done`

## Philosophy

- Speed over perfection (30 sec to start vs 10 min)
- Zero ceremony
- Progressive disclosure (start minimal, expand as needed)
- Human-in-the-loop (YOU decide, AI researches)

## Working with This Codebase

**Command naming:**
- Files: `cdd:log.md`, `cdd:decide.md`, `cdd:loop.md` (NOT `cdd:save.md` or `cdd:plan.md`)
- CLI references filenames in `bin/cdd.js` `v2Commands` array and `essentialFiles` array

**LLM optimization rules:**
- No emojis in command files (no semantic value for LLMs)
- No "What This Does" redundant sections
- No philosophy blockquotes
- No ASCII art separators
- One example per command (not 3)
- No "Implementation Notes" meta-commentary

**Testing:**
```bash
cd packages/cdd
npm link
cd ~/test-project
npm link @emb715/cdd
npx @emb715/cdd init
# Verify all 5 commands:
ls .claude/commands/cdd:*.md
# Verify hook, agent, and config:
ls .claude/hooks/cdd-loop-resume.sh
ls .claude/agents/cdd-victor-reid.md
ls _cdd/.meta/loop.config.yaml
# Test orchestrator dry-run:
/cdd:loop --dry-run
```

## Critical Conventions

1. **Command files = LLM instructions** - Optimize for machine parsing, not human reading
2. **No CHANGELOG.md** - Use git commit history and GitHub auto-generated release notes
3. **Single progressive template** - One template serves all use cases
4. **No metrics system** - Zero overhead, no ceremony
5. **Reduce context window usage** - Keep files lean, remove redundancy

## Release Process

1. Update version in `package.json`
2. Commit: `git commit -m "Release vX.Y.Z"`
3. Tag: `git tag vX.Y.Z`
4. Push: `git push origin main --tags`
5. GitHub Actions auto-publishes to npm

## Quick Reference

**User workflow:**
1. `npx @emb715/cdd init` - Install CDD
2. `/cdd:start my-feature` - Create work item
3. Code... or `/cdd:loop` to let the orchestrator run the full cycle
4. `/cdd:log` - Save session
5. `/cdd:decide "REST or GraphQL?"` - Hard decisions (multi-agent)
6. `/cdd:done` - Complete work

**`/cdd:loop` orchestrator:**
- Reads tasks from `_cdd/[work-id]/CONTEXT.md`, groups them by file overlap (parallel safety), spawns sub-agents, auto-logs, reviews with `cdd-victor-reid`, auto-completes
- Survives context limits: writes `checkpoint.md` + `.resume` at `rotation_threshold` events, Stop hook auto-resumes
- Config: edit `_cdd/.meta/loop.config.yaml` to tune rotation threshold, timeouts, review, auto-done

**Key decision:** Humans decide, AI researches. Embodied in `/cdd:decide` (4 parallel research agents, human chooses) and `/cdd:loop` (orchestrator implements, human reviews issues).

## Workspace Notes
- `.claude/hooks/cdd-loop-resume.sh` — Stop hook for `/cdd:loop` auto-resume. Must be registered in `.claude/settings.json` under `hooks.Stop` to activate.

## Context Window Optimization

This project practices what it preaches:
- Command files optimized for LLM parsing (minimal tokens)
- No redundant documentation
- Single source of truth (CONTEXT.md in user projects)
- Progressive disclosure (detail when needed, not upfront)

**Target:** Keep every file under 300 lines. Commands average 88 lines each.
