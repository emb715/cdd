# Platform Support

CDD supports multiple AI coding platforms. Install with:

```bash
npx @emb715/cdd init                       # interactive selection
npx @emb715/cdd init --platform=claude-code
npx @emb715/cdd init --platform=opencode
npx @emb715/cdd init --platform=copilot
npx @emb715/cdd init --platform=vscode
```

---

## Feature Matrix

| Feature | Claude Code | OpenCode | Copilot | VSCode |
|---|---|---|---|---|
| Commands | yes | yes | yes | yes |
| Agents | yes | yes | no | no |
| `/cdd:loop` | full | full | stub | stub |
| Parallel task execution | yes | yes | no | no |
| Code review (cdd-victor-reid) | yes | yes | no | no |
| Context survival | Stop hook | CDD plugin | n/a | n/a |
| Cross-session auto-resume | yes | no | no | no |
| Hooks | yes | no | no | no |
| Plugins | no | yes | no | no |
| Skills | yes | no | no | no |
| Instructions file | `CLAUDE.md` | `AGENTS.md` | `.github/copilot-instructions.md` | `.github/copilot-instructions.md` |
| Command format | `.md` | `.md` | `.prompt.md` | `.prompt.md` |

---

## Claude Code

Full support. Reference implementation.

**Installed into:**
```
.claude/
  commands/    # cdd:start, cdd:loop, cdd:log, cdd:decide, cdd:scope, cdd:done, cdd:catch
  agents/      # cdd-honest, cdd-victor-reid, cdd-sage family
  hooks/       # cdd-loop-resume.sh
  skills/      # cdd-workflow
CLAUDE.md
```

**`/cdd:loop` context survival:**

Register the Stop hook in `.claude/settings.json` to auto-resume when context rotates:

```json
{
  "hooks": {
    "Stop": [{ "type": "command", "command": "bash .claude/hooks/cdd-loop-resume.sh" }]
  }
}
```

Without the hook, paste the resume command manually when context rotates. State is never lost — `checkpoint.md` always has the full restore state.

---

## OpenCode

Full command and agent support. `/cdd:loop` runs uninterrupted via compaction plugin instead of Stop hook.

**Installed into:**
```
.opencode/
  commands/    # cdd:start, cdd:loop, cdd:log, cdd:decide, cdd:scope, cdd:done, cdd:catch
  agents/      # cdd-honest, cdd-victor-reid, cdd-sage family (mode: subagent)
  plugins/     # cdd-loop-resume.ts
AGENTS.md
```

**`/cdd:loop` context survival:**

OpenCode uses context compaction instead of context rotation. The `cdd-loop-resume.ts` plugin intercepts compaction and replaces the default compaction prompt with a CDD-aware one that encodes the full loop state — pending tasks, completed tasks, current group index, and recent log. The loop resumes automatically within the same session.

No hook registration required. The plugin is loaded automatically by OpenCode from `.opencode/plugins/`.

**Cross-session resume:**

If the session is closed before the loop finishes, resume manually:

```bash
/cdd:loop [work-id] --resume
```

State is preserved in `_cdd/[work-id]/.loop/checkpoint.md`.

**Agent differences:**

OpenCode agents are installed with `mode: subagent` in their frontmatter, making them invokable via the Task tool. This is handled automatically by `cdd init` — no manual changes needed.

**`.resume` file:**

Not written on OpenCode (used by the Claude Code Stop hook only). The plugin reads `checkpoint.md` directly.

---

## GitHub Copilot

Commands only. No agents, hooks, or plugins.

**Installed into:**
```
.github/
  prompts/     # cdd:start, cdd:loop (stub), cdd:log, cdd:decide, cdd:scope, cdd:done, cdd:catch
  copilot-instructions.md
```

**Command format:** `.prompt.md` with YAML frontmatter (`name`, `description`).

**`/cdd:loop`:** Not available. A stub is installed that explains the limitation and provides a manual equivalent.

**Agent delegation:** Stripped from all commands at install time. The model executes workflow logic inline by reading `_cdd/.meta/instructions/` files directly. All workflow logic is preserved — only the agent-spawning mechanism is removed.

**`/cdd:decide`:** The 4 parallel agents become 4 sequential research passes. Output format is identical, speed is slower (~5-8 min vs 2-3 min).

---

## VSCode Extension

Identical to GitHub Copilot. Same install paths, same `.prompt.md` format, same limitations.

---

## Command Filenames

Source command files use dashes (`cdd-start.md`) for Windows compatibility. Installed files use colons (`cdd:start.md`) matching each platform's slash-command convention.

| Source (package) | Installed (your project) |
|---|---|
| `cdd-start.md` | `cdd:start.md` |
| `cdd-loop.md` | `cdd:loop.md` |
| `cdd-log.md` | `cdd:log.md` |
| ... | ... |

The `:` convention is how you invoke the command: `/cdd:start`, `/cdd:loop`, etc.
