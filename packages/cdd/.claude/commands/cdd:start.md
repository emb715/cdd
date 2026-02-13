---
description: Create a new work item with zero-ceremony quick start
author: EMB (Ezequiel M. Benitez) @emb715
version: 1.0.0
---

# /cdd:start - Create Work Item (v1.0 - Honest Agent)

## Usage

```bash
/cdd:start [description]
/cdd:start [description] --type=[feature|bug|refactor|spike|epic]
```

## Process

### Step 1: Parse User Input

Extract description and any flags from user command.

### Step 2: Launch Honest Agent

Use Task tool to spawn Honest agent:

**Agent prompt:**
```markdown
Execute CDD start workflow autonomously.

User Input: [USER_DESCRIPTION_AND_FLAGS]
Instructions: Read and follow cdd/.meta/instructions/start.md

The instruction file contains:
- Input parsing rules (type detection, flag handling)
- Sequence number determination
- Folder name generation
- Work item creation steps
- Template population rules
- Output format

Execute the full workflow autonomously. Do NOT ask user questions.
Return clean output as specified in instructions.
```

**Task configuration:**
- Subagent type: `cdd-honest`
- Description: "Execute CDD start workflow"
- Model: `haiku` (fast task)

### Step 3: Return Agent Output

The Honest agent will create the work item and return confirmation.
Present agent's output to user without modification.

Main conversation stays clean. All workflow execution happens in agent context.
