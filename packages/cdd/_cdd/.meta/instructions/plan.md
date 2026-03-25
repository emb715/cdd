# Honest Agent Instructions: CDD Planner

Pressure-test and enrich a newly created work item. No questions, no confirmation prompts.

## Input

- `work_item`: Path to `_cdd/XXXX-work-name/CONTEXT.md`

## Goal

Produce a CONTEXT.md where:
- Every task has a real file path (not a placeholder)
- Every done-when is testable (not vague)
- The Solution section is filled in
- STATUS.md reflects any task changes

## Steps

### 1. Read the Work Item

Read `CONTEXT.md`. Extract: title, type, purpose, tasks (all phases).

### 2. Scan the Codebase

Based on the title and purpose, identify relevant files. Use Glob and Grep to:
- Find files related to the feature/bug area
- Find existing patterns (tests, components, services) to reference
- Identify entry points affected by this work

Cap at 10 files. Prefer specificity over breadth.

### 3. Pressure-Test Each Task

For each task in Phase 1 (and Phase 2 if present):

**Files field:**
- If empty or placeholder: find the real file(s) from Step 2. Write exact paths.
- If already filled: verify the file exists. If it doesn't, correct it.

**Done-when field:**
- Flag as weak if: under 10 words, contains "works", "is done", "complete", or has no observable condition.
- Rewrite weak done-when to be: specific, observable, and testable.
  - feature → "X returns Y when Z" or "User can do X without Y happening"
  - bug → "The error no longer occurs when [exact condition]"
  - refactor → "[structural property] verified by [test or lint rule]"
  - spike → "Decision documented in decisions/ with tradeoffs for at least 2 options"

Do not add tasks. Only strengthen existing ones.

### 4. Fill Solution Section

Read current "Solution" section. If it's a placeholder or empty, write 2-3 sentences:
- What approach will be used (based on codebase scan)
- Which existing patterns/files will be leveraged
- What will NOT be changed (scope boundary)

If already filled by the human: leave it as-is.

### 5. Update Context for AI

Under "Key files", list the top 3-5 files found in Step 2 with one-line descriptions.
Under "Patterns to follow", note any existing conventions found (naming, test structure, etc.).

Do not overwrite existing human-written notes. Append below them.

### 6. Write Back

Overwrite `CONTEXT.md` with the enriched version. Preserve all frontmatter and human-written content exactly — only fill/replace placeholders and weak done-when fields.

Update STATUS.md if task count or descriptions changed:
- Recalculate `phase_progress`
- Update `active_task` and `next_pending` if they changed

### 7. Output

```
Planned.

Tasks: X (Phase 1) [+ Y (Phase 2)]
Files mapped: X/X tasks have file paths
Done-when rewritten: X tasks strengthened
```

No other output.

## Execution Rules

Execute autonomously. No questions, no blocks.

Errors: Missing CONTEXT.md → abort with path. No relevant files found → leave Files field with best guess from title. All done-when already strong → report 0 rewritten.
