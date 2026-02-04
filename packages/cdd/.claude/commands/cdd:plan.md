---
description: Launch multi-agent research to help you plan decisions with parallel consultation
author: EMB (Ezequiel M. Benitez) @emb715
version: 2.0.0
---

# /cdd:plan - AI-Assisted Decision Planning (v2)

Multi-agent parallel research for hard technical decisions.

**Human decides. AI researches, analyzes, suggests.**

Launches 4+ specialized agents to research options, analyze codebase context, compare trade-offs, and provide evidence-based recommendation. Final decision is always human-made with documented rationale.

## Usage

```bash
/cdd:plan [topic/question]
/cdd:plan "Should we use REST or GraphQL?"
/cdd:plan "PostgreSQL vs MongoDB for user data"
/cdd:plan --options="A,B,C" [topic]
```

## Process

### Step 1: Parse Decision Topic

Extract options from user input.

Recognized patterns:
- "Should we use X or Y?" - Binary choice
- "X vs Y for Z" - Binary choice with context
- "Best approach for X" - Open-ended (ask for options)
- "Choose between X, Y, Z" - Multi-option

If unclear, ask user to specify options.

### Step 2: Identify Decision Context

Auto-detect active work item from conversation or CONTEXT.md.

Ask user for brief context (optional, 1-2 sentences each):
1. Why is this decision needed now?
2. Any constraints (time, budget, team)?
3. What's the impact if we choose wrong?

### Step 3: Launch Parallel Agents

Use Task tool to spawn agents simultaneously.

Agent roles:

1. **Advocate Agent A** - Research and advocate for Option A (pros, cons, use cases, examples)
2. **Advocate Agent B** - Research and advocate for Option B (pros, cons, use cases, examples)
3. **Codebase Context Agent** - Analyze current patterns, dependencies, migration complexity, team familiarity
4. **Analysis Agent** - Wait for 1-3, compare objectively, provide AI suggestion (not final decision)

For 3+ options, spawn additional advocate agents.

### Step 4: Agent Execution

Agents execute in parallel. Estimated time: 2-3 minutes (longer for 3+ options).

Agent prompts:

#### Advocate Agent Template:
```markdown
You are an expert advocate for [OPTION_NAME].

Your goal: Research and present the strongest case for choosing [OPTION_NAME].

Decision topic: [TOPIC]
Context: [USER_PROVIDED_CONTEXT]

Research and provide:
1. **Core Benefits** - What makes this option strong?
2. **Ideal Use Cases** - When does this shine?
3. **Drawbacks** - Be honest about limitations
4. **Complexity** - Implementation difficulty (Low/Medium/High)
5. **Risk Assessment** - What could go wrong?
6. **Examples** - Real-world success stories
7. **Recommendation** - When to choose this option

Be thorough but concise. Focus on facts and trade-offs, not hype.
```

#### Codebase Context Agent Template:
```markdown
You are a codebase analyzer helping inform a technical decision.

Decision topic: [TOPIC]
Options: [OPTIONS_LIST]
Work item: [WORK_ITEM_PATH]

Analyze the current codebase:

1. **Search for related patterns:**
   - Use Grep to find existing implementations
   - Check for related dependencies in package.json
   - Look for similar decisions in other files

2. **Assess current state:**
   - What patterns exist that relate to this decision?
   - What libraries/frameworks are already in use?
   - What would migration complexity be?

3. **Team context:**
   - Based on code style, what is team familiar with?
   - What patterns are established?

4. **Constraints:**
   - Dependencies that limit options?
   - Performance requirements?
   - Compatibility needs?

Provide concrete findings with file paths and examples.
```

#### Analysis Agent Template:
```markdown
You are a decision analysis agent. Your role: Compare options objectively to help the human make an informed decision.

Decision topic: [TOPIC]
Options: [OPTIONS_LIST]

Input from agents:
---
[Agent 1 Output: Option A Analysis]
[Agent 2 Output: Option B Analysis]
[Agent 3 Output: Codebase Context]
---

Your task:

1. **Compare trade-offs objectively**
   - What does each option optimize for?
   - What does each sacrifice?
   - Present side-by-side comparison

2. **Apply context analysis**
   - Given codebase constraints, what are the implications?
   - Given timeline/team, what are the practical considerations?
   - Identify compatibility with current patterns

3. **Provide AI suggestion (NOT final decision)**
   - Suggest which option seems most appropriate based on evidence
   - Explain rationale (2-3 key reasons)
   - State confidence level (High/Medium/Low)
   - List trade-offs being accepted
   - **CLEARLY STATE:** "This is my suggestion based on analysis. The human will make the final decision."

4. **Implementation guidance (for any option)**
   - What to do first if Option A is chosen
   - What to do first if Option B is chosen
   - What to watch out for in each case

DO NOT make a final recommendation or decision.
DO provide objective comparison to help human decide.
```

### Step 5: Collect Agent Results

Wait for all agents to complete. Parse outputs:
- Key findings from each advocate
- Codebase analysis
- AI analysis and suggestion

### Step 6: Human Decision Capture

Present findings summary:
- Option A: Strengths, drawbacks
- Option B: Strengths, drawbacks
- Codebase context: Key findings
- AI suggestion: Option, confidence (High/Medium/Low), rationale, trade-offs
- Reminder: "This is my suggestion based on analysis. You make the final decision."

Prompt for decision:
- A) Accept AI suggestion
- B) Choose different option
- C) Need more research

Capture:
- User's chosen option
- AI suggestion (for comparison)
- Human rationale
- Decision maker: Human (AI-assisted)

### Step 7: Generate Decision Document

Create: `decisions/YYYY-MM-DD-[topic-kebab-case].md`

Use template: `cdd/.meta/templates/v2/decisions/DECISION_TEMPLATE.md`

Populate:
- Context (user-provided)
- Option A (Agent 1 findings)
- Option B (Agent 2 findings)
- Codebase Context (Agent 3 findings)
- AI Analysis (Agent 4 analysis and suggestion)
- Final Decision (human's decision with rationale)

### Step 8: Update CONTEXT.md

Add reference in Decisions section with summary and link to full analysis.

### Step 9: Present Results

Show summary:
- Agents consulted (count)
- Decision maker: Human
- File saved location
- Human decision with rationale
- AI suggestion (accepted/overridden)
- Key supporting evidence
- Trade-offs accepted
- Implementation next steps
- Link to full analysis

## Example

**Input:**
```
/cdd:plan Should we use PostgreSQL or MongoDB for user preferences?
```

**Process:**
1. Detect options: PostgreSQL, MongoDB
2. Ask for brief context
3. Launch 4 agents in parallel (~2 min)
4. Present findings summary with AI suggestion (e.g., PostgreSQL - High confidence)
5. User chooses A (accept), B (different), or C (more research)
6. Capture human rationale
7. Save to `decisions/2024-01-15-postgres-vs-mongo.md`
8. Update CONTEXT.md with reference

## Confidence Levels

- High: Clear winner, strong evidence, low risk
- Medium: Close call, depends on priorities, some risk
- Low: Unclear, need more research, high uncertainty

## Tools & Files

Tools used: Task (spawn agents), Grep (codebase analysis), Read, Write, Edit

Files created: `cdd/XXXX-work-name/decisions/YYYY-MM-DD-topic.md`
Files updated: `cdd/XXXX-work-name/CONTEXT.md`

Timing: Binary (2 min), Multi-option 3+ (3-4 min), Open research (5 min)

Use for hard decisions. For simple choices, just decide and document in CONTEXT.md directly.
