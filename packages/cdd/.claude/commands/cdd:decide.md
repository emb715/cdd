---
description: Launch multi-agent research to help you plan decisions with parallel consultation
author: EMB (Ezequiel M. Benitez) @emb715
version: 1.0.0
---

# /cdd:decide - AI-Assisted Decision Planning (v1.0 - Sage Integration)

## Usage

```bash
/cdd:decide [topic/question]
/cdd:decide "Should we use REST or GraphQL?"
/cdd:decide "PostgreSQL vs MongoDB for user data"
/cdd:decide --options="A,B,C" [topic]
```

## Process

**Note:** This command uses domain-aware Sage agents for specialized research (not cdd-honest). Human decides, AI researches.

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

### Step 2.5: Detect Domain & Complexity

**Part A: Domain Detection**

Use Glob tool to scan project files for domain patterns:

| Pattern | Domain |
|---------|--------|
| `.tf`, `*.hcl`, `Dockerfile`, `docker-compose.yml` | DevOps/Infrastructure |
| `.tsx`, `*.jsx`, `*.vue`, `*.svelte` | Frontend |
| `.sol`, `*.cairo` | Blockchain/Smart Contracts |
| `.py` + ML indicators (`requirements.txt`, ML libs) | ML/Data Science |
| `.rs`, `*.go` | Systems Programming |
| `.java`, `*.kt` | Enterprise/JVM |

Detect primary domain from file counts. If mixed or unclear, note as "General" domain.

**Part B: Complexity Detection**

Parse decision topic for keywords to determine advocate depth:

**Specialist keywords** (use `cdd-sage-specialist` for advocates):
- architecture, optimize, scale, performance, security
- pattern, tradeoff, best practice, enterprise, production

**Balanced keywords** (use `cdd-sage-balanced` for advocates):
- simple, quick, small, "should I", "what about"

**Default:** If uncertain, use `cdd-sage-balanced` (efficient, still domain-aware)

**Agent Selection:**
- **Advocate A/B**: Specialist if complexity keywords detected, else Balanced
- **Codebase Context**: Always Balanced (efficient analysis)
- **Analysis**: Always Specialist (deep tradeoff comparison)

### Step 3: Launch Parallel Sage Agents

Spawn 4 specialized Sage agents in parallel using Task tool:

**1. Advocate Agent A (Option A):**
- **Agent**: `cdd-sage-specialist` or `cdd-sage-balanced` (based on complexity from Step 2.5)
- **Prompt**: "You are advocating for [Option A]. Research pros, cons, use cases, and examples. Domain context: [detected domain from Step 2.5]. Be thorough but balanced - present honest trade-offs, not just positives. Focus on domain-specific considerations."
- **Output**: Strengths, drawbacks, use cases, domain-specific considerations

**2. Advocate Agent B (Option B):**
- **Agent**: Same selection as Advocate A
- **Prompt**: Same structure as Advocate A, but advocating for Option B
- **Output**: Same structure as Advocate A

**3. Codebase Context Agent:**
- **Agent**: Always `cdd-sage-balanced`
- **Prompt**: "Analyze codebase for patterns, dependencies, and migration complexity. Domain: [detected domain]. Focus on: existing patterns that align with options, architectural fit, implementation effort estimate."
- **Output**: Existing patterns, dependencies, migration complexity

**4. Analysis Agent:**
- **Agent**: Always `cdd-sage-specialist`
- **Prompt**: "Compare [Option A] vs [Option B] objectively. Domain: [detected domain]. Provide AI suggestion with confidence level (High/Medium/Low), rationale, and trade-offs. Consider: technical fit, maintainability, team expertise, scalability. Remember: human decides, you assist."
- **Output**: Comparison table, AI suggestion with confidence, key trade-offs

**Execution:** Parallel (single message with 4 Task tool calls). Estimated time: 2-3 min (binary), 3-4 min (3+ options).

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

Populate frontmatter:
- `decision_id`: filename without extension (e.g., `2024-01-16-rest-vs-graphql`)
- `work_id`: active work item folder name (e.g., `0001-user-auth`)
- `topic`: decision topic as entered by user
- `decided`: today's date (YYYY-MM-DD)
- `status`: `decided` (or `revisit_later` / `deferred` if user chose those)

Populate body:
- Context, Options analysis, Codebase findings, AI suggestion, Human decision with rationale

Update `CONTEXT.md` Decisions section with summary and link.

### Step 7: Return Summary

Show:
- Sage agents consulted (list: Advocate A, Advocate B, Codebase Context, Analysis)
- Detected domain and complexity level
- Decision maker: Human
- File location
- Human decision + rationale
- AI suggestion (accepted/overridden)
- Trade-offs, Next steps

## Key Principles

- **Human decides, AI researches** - Final decision always human-made
- **Domain-aware advocates** - Sage agents adapt to project type (DevOps, Frontend, Blockchain, etc.)
- **Multi-agent research** - Parallel specialized agents for speed and depth
- **Evidence-based** - Codebase context + external research
- **Documented rationale** - Decision file preserves reasoning

## Tools & Timing

Tools: Task (spawn agents), Grep (codebase analysis), Read, Write, Edit

Files created: `decisions/YYYY-MM-DD-topic.md`
Files updated: `CONTEXT.md`

Timing: 2-3 min (binary), 3-4 min (3+ options), 5 min (open research)

Use for hard decisions. For simple choices, decide and document in CONTEXT.md directly.
