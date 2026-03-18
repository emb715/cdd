---
description: Draft a scope plan for large workloads, greenfield projects, or multi-phase epics
author: EMB (Ezequiel M. Benitez) @emb715
version: 1.0.0
---

# /cdd:scope - Scope a Body of Work (v1.0 - Sage Specialist)

## Usage

```bash
/cdd:scope [brief description of the workload]
/cdd:scope greenfield SaaS: auth, billing, API, admin dashboard
/cdd:scope migrate monolith to microservices
/cdd:scope v2.0 rewrite: new data model, new UI, backward-compatible API
```

Use this when the work breakdown itself is the first problem to solve — greenfield projects, big epics, multi-phase sprints. For single features or bugs, use `/cdd:start` directly.

The agent will interview you before drafting — one question at a time, walking down each branch of the design tree and resolving dependencies between decisions one-by-one. If a question can be answered by exploring the codebase, the agent explores instead of asking. Answer until the scope is unambiguous, then the plan is produced automatically.

## Process

### Step 1: Parse Input

Extract the brief from user input. If no description provided, abort with usage.

If brief clearly resolves to a single work item, respond:
```
This looks like a single work item. Use /cdd:start [description] instead.
```

### Step 2: Detect Domain

Use Glob tool to scan project files for domain patterns (same as /cdd:decide Step 2.5):

| Pattern | Domain |
|---------|--------|
| `.tsx`, `*.jsx`, `*.vue`, `*.svelte`, `next.config.*`, `vite.config.*` | Frontend/React/Web |
| `package.json` + `express`\|`fastify`\|`hono`\|`koa` | Node/Backend |
| `Dockerfile`, `docker-compose.yml`, `.tf`, `*.hcl` | DevOps/Infrastructure |
| `.go`, `*.rs` | Systems/Backend |
| `.java`, `*.kt` | Enterprise/JVM |

Detect current max sequence number: scan `_cdd/` for `XXXX-*`, use max + 1 as starting point.

### Step 3: Launch Sage Specialist Agent

Use Task tool to spawn Sage Specialist agent:

**Agent:** `cdd-sage-specialist`

**Prompt:**
```markdown
Execute CDD scope planning workflow.

User Brief: [USER_BRIEF]
Detected Domain: [DOMAIN]
Current _cdd/ max sequence: [XXXX] (next item starts at [XXXX+1])

Instructions: Read and follow _cdd/.meta/instructions/scope.md

The instruction file contains:
- How to analyze the brief and project structure
- Work item breakdown rules (5-10 items max)
- Scope plan document format and template location
- Output format for the conversation

Execute the full workflow autonomously. Save the scope plan file. Return the items table and phase grouping for display.
```

**Task configuration:**
- Subagent type: `cdd-sage-specialist`
- Description: "Draft CDD scope plan"

### Step 4: Present Results

Display the agent's output:
- Items table (folder name, type, purpose, dependencies)
- Phase grouping
- Path to the saved scope plan file
- Next step: edit the plan, then `/cdd:start [item] (scoped)`

Main conversation stays clean. All drafting happens in agent context.

## Tools & Timing

Tools: Task (spawn Sage agent), Glob (domain detection)

Files created: `_cdd/scope/YYYY-MM-DD-[slug].md`

Timing: 5-15 min (includes design interview)
