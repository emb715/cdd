---
description: Launch multi-agent research to help you plan decisions with parallel consultation
author: EMB (Ezequiel M. Benitez) @emb715
version: 2.1.0
---

# /cdd:plan - AI-Assisted Decision Planning (v2.1 - Multi-Agent)

## Usage

```bash
/cdd:plan [topic/question]
/cdd:plan "Should we use REST or GraphQL?"
/cdd:plan "PostgreSQL vs MongoDB for user data"
/cdd:plan --options="A,B,C" [topic]
```

## Process

**Note:** This command uses multi-agent architecture (not Honest agent). Human decides, AI researches.

### Step 1: Parse Decision Topic

Extract topic and options from user input.

Recognized patterns:
- "X or Y?" → Binary choice
- "X vs Y for Z" → Binary with context
- "Best approach for X" → Ask for options
- "X, Y, Z" → Multi-option

If unclear, ask user to specify options.

### Step 2: Gather Context

Auto-detect active work item.

Ask user (optional, 1-2 sentences each):
1. Why is this decision needed now?
2. Any constraints (time, budget, team)?
3. Impact if wrong choice?

### Step 3: Launch Parallel Agents

Use Task tool to spawn 4+ specialized agents simultaneously:

1. **Advocate Agent A** - Research Option A (pros, cons, use cases, examples)
2. **Advocate Agent B** - Research Option B (pros, cons, use cases, examples)
3. **Codebase Context Agent** - Analyze patterns, dependencies, migration complexity
4. **Analysis Agent** - Compare objectively, provide AI suggestion (NOT final decision)

**Agent prompts:** See detailed templates in original v2.0 implementation or codebase analysis patterns.

**Execution:** Parallel. Estimated time: 2-3 min (binary), 3-4 min (3+ options).

### Step 4: Collect Results

Wait for all agents. Parse:
- Key findings from each advocate
- Codebase analysis
- AI analysis and suggestion (with confidence: High/Medium/Low)

### Step 5: Human Decision

Present findings summary:
- Option A/B: Strengths, drawbacks
- Codebase context
- AI suggestion with rationale and trade-offs
- Reminder: "AI suggests, human decides"

Prompt user:
- A) Accept AI suggestion
- B) Choose different option
- C) Need more research

Capture:
- User's chosen option
- AI suggestion (for comparison)
- Human rationale
- Decision maker: Human (AI-assisted)

### Step 6: Document Decision

Create `decisions/YYYY-MM-DD-[topic].md` using template.

Populate:
- Context, Options analysis, Codebase findings, AI suggestion, Human decision with rationale

Update `CONTEXT.md` Decisions section with summary and link.

### Step 7: Return Summary

Show:
- Agents consulted (count)
- Decision maker: Human
- File location
- Human decision + rationale
- AI suggestion (accepted/overridden)
- Trade-offs, Next steps

## Key Principles

- **Human decides, AI researches** - Final decision always human-made
- **Multi-agent research** - Parallel specialized agents for speed and depth
- **Evidence-based** - Codebase context + external research
- **Documented rationale** - Decision file preserves reasoning

## Tools & Timing

Tools: Task (spawn agents), Grep (codebase analysis), Read, Write, Edit

Files created: `decisions/YYYY-MM-DD-topic.md`
Files updated: `CONTEXT.md`

Timing: 2-3 min (binary), 3-4 min (3+ options), 5 min (open research)

Use for hard decisions. For simple choices, decide and document in CONTEXT.md directly.
