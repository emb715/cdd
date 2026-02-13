---
description: Mark work item complete with optional summary
author: EMB (Ezequiel M. Benitez) @emb715
version: 1.0.0
---

# /cdd:done - Complete Work Item (v1.0 - Honest Agent)

## Usage

```bash
/cdd:done
/cdd:done [work-id]
/cdd:done --summary  # Generate IMPLEMENTATION_SUMMARY.md
/cdd:done --skip-log  # Don't add final session
```

## Process

### Step 1: Parse User Input

Extract work ID and flags if provided.

### Step 2: Launch Honest Agent

Use Task tool to spawn Honest agent:

**Agent prompt:**
```markdown
Execute CDD completion workflow autonomously.

User Input: [WORK_ID_AND_FLAGS]
Instructions: Read and follow cdd/.meta/instructions/done.md

The instruction file contains:
- Work item auto-detection strategies
- Completion verification (task counting)
- Final session log generation
- CONTEXT.md status update (completed date)
- Optional IMPLEMENTATION_SUMMARY.md generation
- Output format

Execute the full workflow autonomously. Do NOT ask user questions.
Trust user's decision to mark as done (even if tasks incomplete).
Generate summary if --summary flag present.
Return clean completion confirmation.
```

**Task configuration:**
- Subagent type: `cdd-honest`
- Description: "Execute CDD completion workflow"
- Model: `haiku` (fast task)

### Step 3: Return Agent Output

The Honest agent will:
- Auto-detect work item
- Verify completion state (note incomplete tasks)
- Add final session entry (unless --skip-log)
- Update CONTEXT.md status to completed
- Generate IMPLEMENTATION_SUMMARY.md (if --summary)
- Return completion confirmation with stats

Present agent's output to user without modification.

Main conversation stays clean. All completion operations happen in agent context.
