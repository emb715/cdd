# CDD - Context-Driven Development

## What This Is

CDD is an npm package that provides AI workflow commands for solo developers. Version 2.0 is optimized for speed, minimal ceremony, and LLM efficiency.

**Core Philosophy:** Humans decide, AI assists. No boilerplate, no ceremony, just work.

## Package Structure

```
packages/cdd/
├── .claude/
│   ├── commands/             # 4 AI command wrappers (optimized for LLMs)
│   │   ├── cdd:start.md     # Create work item (56 lines)
│   │   ├── cdd:log.md       # Save session (66 lines)
│   │   ├── cdd:decide.md    # Multi-agent decision (253 lines)
│   │   └── cdd:done.md      # Complete work (66 lines)
│   └── agents/              # Bundled CDD agent
│       └── cdd-honest.md    # Pre-configured with git read permissions
├── bin/cdd-v2.js            # CLI installer
├── cdd/.meta/               # Templates and metadata
│   ├── templates/v2/        # v2 templates (CONTEXT.md, SESSIONS.md)
│   └── instructions/        # Agent instruction files (start.md, log.md, done.md)
├── package.json             # NPM package config
└── README.md                # User documentation
```

## Key Files

**Commands (LLM-optimized):**
- All commands in `.claude/commands/` are optimized for LLM parsing (no emojis, minimal boilerplate)
- Total: 1088 lines (reduced from 1997 lines - 45% reduction)
- Each command has: Usage, Process steps, One example, Error handling

**CLI:**
- `bin/cdd-v2.js` - Installs templates and commands to user projects
- Copies `.meta/` to `cdd/` and commands to `.claude/commands/`

**Templates:**
- `cdd/.meta/templates/v2/CONTEXT.md` - Single progressive template (unified from v1's 3 modes)
- `cdd/.meta/templates/v2/SESSIONS.md` - Minimal session log
- `cdd/.meta/templates/v2/decisions/DECISION_TEMPLATE.md` - Multi-agent decision artifacts

## Version 2.0 Changes (from v1)

**Removed:**
- 5 v1 commands (3,763 lines) → 4 v2 commands (1,843 lines)
- 3 template modes → 1 progressive template
- Mandatory metrics system (v1 complexity)
- CHANGELOG.md → Auto-generated release notes

**Philosophy:**
- Speed over perfection (30 sec to start vs 10 min)
- Zero ceremony (no mandatory tracking or metrics)
- Progressive disclosure (start minimal, expand as needed)
- Human-in-the-loop (YOU decide, AI researches)

## Working with This Codebase

**Command naming:**
- Files: `cdd:log.md`, `cdd:decide.md` (NOT `cdd:save.md` or `cdd:plan.md`)
- CLI must reference correct filenames in `bin/cdd-v2.js` lines 88-92

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
# Verify all 4 commands: ls .claude/commands/cdd:*.md
```

## Critical Conventions

1. **Command files = LLM instructions** - Optimize for machine parsing, not human reading
2. **No CHANGELOG.md** - Use git commit history and GitHub auto-generated release notes
3. **Template modes removed** - Single progressive template serves all use cases
4. **No metrics system** - Zero overhead, no ceremony (archived in v2.1)
5. **Reduce context window usage** - Keep files lean, remove redundancy

## Release Process

1. Update version in `package.json`
2. Commit: `git commit -m "Release vX.Y.Z"`
3. Tag: `git tag vX.Y.Z`
4. Push: `git push origin main --tags`
5. GitHub Actions auto-publishes to npm

## Current State (2026-02-04)

- **Version:** 0.2.0 (feat/cdd-v2 branch)
- **Status:** Pre-release cleanup complete
- **Commands:** 4 (1088 lines total, 45% reduction achieved)
- **Next:** Merge to main, tag, release

## Quick Reference

**User workflow:**
1. `npx @emb715/cdd init` - Install CDD
2. `/cdd:start my-feature` - Create work item
3. Code...
4. `/cdd:log` - Save session
5. `/cdd:decide "REST or GraphQL?"` - Hard decisions (multi-agent)
6. `/cdd:done` - Complete work

**Key decision:** Humans decide, AI researches. This is embodied in `/cdd:decide` which launches 4 agents in parallel to research options, but the human makes the final call.

## Files to Ignore

- `cdd/.meta/examples/` - Old examples from v1
- `cdd/.meta/metrics/` - v1 metrics system (largely deprecated)
- `README-v1-OLD.md` - v1 documentation (archived)

## Context Window Optimization

This project practices what it preaches:
- Command files optimized for LLM parsing (minimal tokens)
- No redundant documentation
- Single source of truth (CONTEXT.md in user projects)
- Progressive disclosure (detail when needed, not upfront)

**Target:** Keep every file under 500 lines. Commands average 272 lines each.
