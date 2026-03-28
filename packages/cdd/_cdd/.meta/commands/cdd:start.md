---
description: Create a new work item. Add --plan to async enrich tasks with real file paths and tested done-when criteria
author: EMB (Ezequiel M. Benitez) @emb715
version: 1.0.0
---

# /cdd:start - Create and Plan Work Item (v2.0)

## Usage

```bash
/cdd:start [description]
/cdd:start [description] --type=[feature|bug|refactor|spike|epic]
/cdd:start [description] --plan
```

## Process

### Step 1: Parse User Input

Extract description and any flags from user command.

### Step 2: Launch Creator Agent (Phase 1)

Use Task tool to spawn Honest agent:

**Agent prompt:**
```markdown
Execute CDD start workflow autonomously.

User Input: [USER_DESCRIPTION_AND_FLAGS]
Instructions: Read and follow _cdd/.meta/instructions/start.md

Execute the full workflow autonomously. Do NOT ask user questions.
Return clean output as specified in instructions.
```

**Task configuration:**
- Subagent type: `cdd-honest`
- Description: "Execute CDD start workflow"
- Model: `haiku` (fast task)

The Creator agent scaffolds the work item structure and infers starter tasks, then spawns the Planner agent internally (Step 4.6 in instructions).

### Step 3: Return Final Output

Wait for both agents to complete (Creator spawns Planner internally).
Present the Creator agent's final output to the user without modification.

Main conversation stays clean. All workflow execution happens in agent context.
