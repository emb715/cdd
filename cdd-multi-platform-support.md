# Plan: CDD Multi-Platform Support

## Context

CDD currently hardcodes `.claude/` throughout the installer and all source files. This locks it to Claude Code only. The goal is to extend CDD to support Claude Code, OpenCode, GitHub Copilot, and VSCode (Copilot Chat) via an interactive platform selection during `init`, or via a `--platform` flag.

This is a breaking change — no backwards compatibility needed.

## Platform Reference Table

| Platform | Config dir | Commands dir | Agents | Hooks | Skills | Instructions file |
|---|---|---|---|---|---|---|
| Claude Code | `.claude/` | `.claude/commands/` | `.claude/agents/` | `.claude/hooks/` + settings.json | `.claude/skills/` | `CLAUDE.md` |
| OpenCode | `.opencode/` | `.opencode/commands/` | `.opencode/agents/` | none documented | none | `AGENTS.md` |
| GitHub Copilot | `.github/` | `.github/prompts/` (`.prompt.md`) | none | `.github/hooks/hooks.json` | none | `.github/copilot-instructions.md` |
| VSCode Extension | `.github/` | `.github/prompts/` (`.prompt.md`) | none | none | none | `.github/copilot-instructions.md` |

**Feature availability per platform:**
- Claude Code: full (commands, agents, hooks, skills, CLAUDE.md)
- OpenCode: commands + agents + AGENTS.md (no hooks)
- Copilot: commands (`.prompt.md` format) + copilot-instructions.md (no agents, no hooks)
- VSCode Extension: same as Copilot

## Source Files: Single Source of Truth

**No platform-specific directories.** All canonical source files move into `_cdd/.meta/` — the established CDD internals location. The `.claude/` directory at package root is deleted entirely.

```
packages/cdd/
├── _cdd/
│   └── .meta/
│       ├── commands/        # canonical source (moved from .claude/commands/)
│       │   ├── cdd:start.md
│       │   ├── cdd:log.md
│       │   ├── cdd:decide.md
│       │   ├── cdd:done.md
│       │   ├── cdd:scope.md
│       │   ├── cdd:loop.md
│       │   └── cdd:catch.md
│       ├── agents/          # canonical source (moved from .claude/agents/)
│       ├── hooks/           # canonical source (moved from .claude/hooks/)
│       ├── skills/          # canonical source (moved from .claude/skills/)
│       ├── templates/       # unchanged
│       ├── instructions/    # unchanged
│       └── loop.config.yaml # unchanged
└── bin/cdd.js               # refactored installer with transform pipeline
```

**Why `_cdd/.meta/`:** Already the established "CDD internals" location. `commands/`, `agents/`, `hooks/`, `skills/` are generic names — no platform implied. `bin/cdd.js` already reads from here for templates and instructions, so this is consistent.

At `init` time, `bin/cdd.js` reads canonical source files from `_cdd/.meta/`, runs them through a transform pipeline, and writes the output to the platform's target directory. No duplication.

## What Changes Per Platform

There are exactly four differences across platforms — all handled as transforms in `bin/cdd.js`:

| Transform | Claude Code | OpenCode | Copilot / VSCode |
|---|---|---|---|
| Destination path | `.claude/commands/` | `.opencode/commands/` | `.github/prompts/` |
| File extension | `.md` | `.md` | `.prompt.md` |
| Frontmatter | already present | already present | already present (strip name field, keep description) |
| Claude-specific blocks | keep | strip agent/hook refs | strip agent/hook refs + stub `cdd:loop` |

### What "Claude-specific blocks" means

Every current command file uses the Task tool and subagents. The content falls into two categories:

**Portable (keep for all platforms):**
- Usage examples
- Process logic (what to do, in what order)
- File paths, templates, detection strategies
- Output format specs

**Claude-specific (strip for non-Claude platforms):**
- `Use Task tool to spawn...` — replace with inline execution instruction
- `Subagent type: cdd-honest` — remove
- `Model: haiku` — remove
- Agent names in prompts (`cdd-honest`, `cdd-sage-*`, `cdd-victor-reid`) — remove
- Stop hook references — remove

**`cdd:loop` special case:**
`cdd:loop` is entirely built around the Task tool, parallel agent spawning, and the Stop hook. There is no meaningful subset of it that works on non-Claude platforms. For Copilot/VSCode/OpenCode, install a stub:

```md
# /cdd:loop

Not available on [Platform]. This command requires Claude Code's Task tool and sub-agent system.

Manual equivalent:
1. Read _cdd/[work-id]/CONTEXT.md for pending tasks
2. Work through tasks sequentially
3. Run /cdd:log after each session
4. Run /cdd:done when all tasks complete
```

## Transform Pipeline (bin/cdd.js)

```js
function transformCommand(content, commandName, platform) {
  let out = content;

  if (!platform.supportsAgents) {
    out = stripAgentBlocks(out);        // removes Task tool / subagent lines
    out = stripHookReferences(out);     // removes Stop hook / settings.json refs
  }

  if (platform.commandFormat === 'prompt.md') {
    out = normalizeFrontmatter(out, commandName);  // ensure valid .prompt.md frontmatter
  }

  return out;
}

function stripAgentBlocks(content) {
  // Remove lines containing: Task tool, Subagent type, cdd-honest, cdd-sage, cdd-victor-reid
  // Replace "Launch X Agent" sections with "Execute the following steps directly:"
  // Keep all process logic, file paths, output format
}

function stripHookReferences(content) {
  // Remove: Stop Hook Setup section, settings.json references, .resume file references
}

function normalizeFrontmatter(content, commandName) {
  // Parse existing YAML frontmatter
  // Ensure `name:` and `description:` fields present (required by Copilot)
  // Remove extra CDD-specific fields that Copilot doesn't need
}
```

The stub for `cdd:loop` is generated inline — no separate stub file to maintain:

```js
function buildLoopStub(platform) {
  return `---
name: cdd-loop
description: Full-cycle orchestrator (requires Claude Code)
---

# /cdd:loop

Not available on ${platform.name}. This command requires Claude Code's Task tool and sub-agent system.

Manual equivalent:
1. Read _cdd/[work-id]/CONTEXT.md for pending tasks
2. Work through tasks sequentially
3. Run /cdd:log after each session
4. Run /cdd:done when all tasks complete
`;
}
```

## bin/cdd.js Changes

### 1. Platform detection

```js
// Via CLI flag: npx @emb715/cdd init --platform=opencode
// Or interactive prompt if no flag given
const platformArg = args.find(a => a.startsWith('--platform='));
const platform = platformArg
  ? PLATFORMS[platformArg.split('=')[1]]
  : PLATFORMS[await selectPlatform()];
```

`selectPlatform()` shows a numbered menu:
```
Which AI coding platform are you using?
  1) Claude Code  (full support)
  2) OpenCode     (commands + agents)
  3) GitHub Copilot (commands only)
  4) VSCode Extension (commands only)
```

### 2. Platform config object

```js
const PLATFORMS = {
  'claude-code': {
    name: 'Claude Code',
    configDir: '.claude',
    commandsDir: '.claude/commands',
    agentsDir: '.claude/agents',
    hooksDir: '.claude/hooks',
    skillsDir: '.claude/skills/cdd-workflow',
    instructionsFile: 'CLAUDE.md',
    commandFormat: 'md',
    supportsAgents: true,
    supportsHooks: true,
    supportsSkills: true,
  },
  'opencode': {
    name: 'OpenCode',
    configDir: '.opencode',
    commandsDir: '.opencode/commands',
    agentsDir: '.opencode/agents',
    hooksDir: null,
    skillsDir: null,
    instructionsFile: 'AGENTS.md',
    commandFormat: 'md',
    supportsAgents: true,
    supportsHooks: false,
    supportsSkills: false,
  },
  'copilot': {
    name: 'GitHub Copilot',
    configDir: '.github',
    commandsDir: '.github/prompts',
    agentsDir: null,
    hooksDir: null,
    skillsDir: null,
    instructionsFile: '.github/copilot-instructions.md',
    commandFormat: 'prompt.md',
    supportsAgents: false,
    supportsHooks: false,
    supportsSkills: false,
  },
  'vscode': {
    name: 'VSCode Extension',
    configDir: '.github',
    commandsDir: '.github/prompts',
    agentsDir: null,
    hooksDir: null,
    skillsDir: null,
    instructionsFile: '.github/copilot-instructions.md',
    commandFormat: 'prompt.md',
    supportsAgents: false,
    supportsHooks: false,
    supportsSkills: false,
  },
};
```

### 3. Refactored install steps

```js
// Commands (transform pipeline applied here)
installCommands(platform, cwd, packageRoot);

// Agents (if supported)
if (platform.supportsAgents) installAgents(platform, cwd, packageRoot);

// Hooks (if supported)
if (platform.supportsHooks) installHooks(platform, cwd, packageRoot);

// Skills (if supported)
if (platform.supportsSkills) installSkills(platform, cwd, packageRoot);

// Instructions file
installInstructions(platform, cwd);

// Feature availability summary
printFeatureTable(platform);
```

`installCommands` reads each source file from `_cdd/.meta/commands/`, applies `transformCommand()`, and writes the result to `platform.commandsDir`. For `cdd:loop` on non-Claude platforms, it writes the stub instead.

### 4. Feature summary (printed at end)

Claude Code:
```
CDD initialized for Claude Code

Feature availability:
  [OK] Commands (/cdd:start, /cdd:loop, /cdd:log, /cdd:decide, /cdd:scope, /cdd:done, /cdd:catch)
  [OK] Agents (cdd-honest, cdd-sage family, cdd-victor-reid)
  [OK] Hooks (cdd-loop auto-resume on context rotation)
  [OK] Skills (cdd-workflow auto-trigger)
```

GitHub Copilot:
```
CDD initialized for GitHub Copilot

Feature availability:
  [OK] Commands (prompts in .github/prompts/)
  [--] Agents: not supported by GitHub Copilot
  [--] Hooks: not supported by GitHub Copilot
  [--] Skills: not supported by GitHub Copilot

Note: /cdd:loop auto-resume and parallel task execution require Claude Code.
```

## Legacy Cleanup

On re-init, clean up both old `.claude/` paths AND any previous platform-specific paths if the platform has changed.

## Files to Create / Modify

### Modify
- `packages/cdd/bin/cdd.js` — add PLATFORMS config, platform selection, transform pipeline, feature table; update all source path references from `.claude/` to `_cdd/.meta/`

### Move (source reorganization)
- `packages/cdd/.claude/commands/` → `packages/cdd/_cdd/.meta/commands/`
- `packages/cdd/.claude/agents/` → `packages/cdd/_cdd/.meta/agents/`
- `packages/cdd/.claude/hooks/` → `packages/cdd/_cdd/.meta/hooks/`
- `packages/cdd/.claude/skills/` → `packages/cdd/_cdd/.meta/skills/`

### Delete
- `packages/cdd/.claude/` — entire directory, replaced by `_cdd/.meta/` subdirectories above

### No new source directories
One source per artifact. No `platforms/` subdirectory.

## Verification

```bash
cd packages/cdd
npm link

# Test Claude Code (existing behavior unchanged)
mkdir /tmp/test-claude && cd /tmp/test-claude
npx @emb715/cdd init --platform=claude-code
ls .claude/commands/cdd:*.md
ls .claude/agents/
ls .claude/hooks/cdd-loop-resume.sh
ls .claude/skills/cdd-workflow/SKILL.md
grep "CDD" CLAUDE.md

# Test OpenCode
mkdir /tmp/test-opencode && cd /tmp/test-opencode
npx @emb715/cdd init --platform=opencode
ls .opencode/commands/
ls .opencode/agents/
grep "CDD" AGENTS.md
# Verify: cdd:loop is stub, agent Task-tool lines removed from other commands

# Test Copilot
mkdir /tmp/test-copilot && cd /tmp/test-copilot
npx @emb715/cdd init --platform=copilot
ls .github/prompts/*.prompt.md
grep "CDD" .github/copilot-instructions.md
# Verify: cdd:loop.prompt.md is stub, no agent refs in other commands

# Test interactive selection
mkdir /tmp/test-interactive && cd /tmp/test-interactive
npx @emb715/cdd init   # should show numbered menu

# Sanity check: source files in _cdd/.meta/, no .claude/ at package root
ls packages/cdd/_cdd/.meta/commands/   # 7 .md files
test ! -d packages/cdd/.claude && echo "OK: .claude/ deleted"
```
