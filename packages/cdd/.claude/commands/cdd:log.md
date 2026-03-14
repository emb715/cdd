---
description: Save session progress with zero-ceremony auto-detection
author: EMB (Ezequiel M. Benitez) @emb715
version: 1.0.0
---

# /cdd:log - Save Session (v1.0 - Honest Agent)

## Usage

```bash
/cdd:log
/cdd:log [work-id]
```

## Process

### Step 1: Parse User Input

Extract work ID and flags if provided.

### Step 2: Launch Honest Agent

Use Task tool to spawn Honest agent:

**Agent prompt:**
```markdown
Execute CDD session logging workflow autonomously.

User Input: [WORK_ID_AND_FLAGS]
Instructions: Read and follow _cdd/.meta/instructions/log.md

The instruction file contains:
- Work item auto-detection strategies (git, conversation, latest)
- File change detection and categorization
- File-to-task matching logic (exact, glob, partial)
- Session duration estimation
- Session entry generation
- CONTEXT.md update rules (task completion)
- SESSIONS.md append logic
- Output format

Execute the full workflow autonomously. Do NOT ask user questions.
Auto-detect work item, changes, and completions.
Return clean summary as specified in instructions.
```

**Task configuration:**
- Subagent type: `cdd-honest`
- Description: "Execute CDD session logging"
- Model: `haiku` (fast task)

### Step 3: Return Agent Output

The Honest agent will:
- Auto-detect work item from git changes or conversation
- Detect file changes and match to tasks
- Mark completed tasks in CONTEXT.md
- Generate and append session entry to SESSIONS.md
- Return concise progress summary

Present agent's output to user without modification.

Main conversation stays clean. All detection and file operations happen in agent context.
