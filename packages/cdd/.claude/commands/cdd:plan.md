---
description: Launch multi-agent research to help you plan decisions with parallel consultation
author: EMB (Ezequiel M. Benitez) @emb715
version: 2.0.0
---

# /cdd:plan - AI-Assisted Decision Planning (v2)

> **Philosophy:** Hard decisions deserve thorough research. AI agents research in parallel, analyze trade-offs objectively, and help YOU make informed decisions.

## Core Principle: Humans Decide, AI Assists

This command embodies CDD's core philosophy:

**AI's Role:**
- Research options thoroughly
- Analyze codebase patterns
- Compare trade-offs objectively
- Suggest an option (as informed opinion, not directive)

**Human's Role:**
- Make the final decision
- Provide reasoning and context
- Override AI if human knowledge differs
- Own the decision

**Documentation's Role:**
- Capture the decision process
- Preserve human rationale
- Enable future review

This aligns with the three-phase workflow:
- **PRDs:** Human defines WHAT and WHY
- **Tasks:** Human approves HOW
- **Sessions:** Human documents what happened
- **Planning:** Human decides, AI researches

## What This Does

✅ Launches 4+ AI agents in parallel to analyze a decision
✅ Each agent has a specific role (advocates, analyzer, synthesizer)
✅ Generates comprehensive decision document
✅ Saves artifact in `decisions/` folder
✅ References decision in CONTEXT.md automatically
✅ Provides evidence-based recommendation

## What This Does NOT Do

❌ No manual research (agents do the work)
❌ No shallow analysis (deep dive by design)
❌ No single perspective (multiple angles)

## Usage

```bash
/cdd:decide [topic/question]
/cdd:decide "Should we use REST or GraphQL?"
/cdd:decide "PostgreSQL vs MongoDB for user data"
/cdd:decide --options="A,B,C" [topic]
```

## Process

### Step 1: Parse Decision Topic

**Extract decision from user input:**

**Patterns recognized:**
- "Should we use X or Y?" → Binary choice (X vs Y)
- "X vs Y for Z" → Binary choice with context
- "Best approach for X" → Open-ended research
- "Choose between X, Y, Z" → Multi-option

**Examples:**
- "REST or GraphQL?" → Options: [REST, GraphQL]
- "PostgreSQL vs MongoDB" → Options: [PostgreSQL, MongoDB]
- "Auth strategy" → Open-ended (will ask for options)

**If options unclear:**
```
🤔 I need to understand the options.

What are you deciding between?
Example: "OAuth vs Custom Auth vs Passwordless"

Your options:
```

### Step 2: Identify Decision Context

**Auto-detect work item (if logged):**
- Check conversation for active work item
- Look for recent CONTEXT.md references
- Ask if unclear

**Quick context gathering:**
```
📋 Decision: [Topic]

Quick context (helps agents give better advice):
1. Why is this decision needed now?
2. Any constraints (time, budget, team)?
3. What's the impact if we choose wrong?

(1-2 sentences each, or skip with Enter)
```

### Step 3: Launch Parallel Agents

**Use Task tool to spawn agents simultaneously:**

#### Agent Roles:

**1. Advocate Agent A** (for Option A)
```
Role: Research and advocate for [Option A]
Task: Find all the reasons why [Option A] is the best choice
Output: Pros, cons, use cases, examples, recommendations
```

**2. Advocate Agent B** (for Option B)
```
Role: Research and advocate for [Option B]
Task: Find all the reasons why [Option B] is the best choice
Output: Pros, cons, use cases, examples, recommendations
```

**3. Codebase Context Agent**
```
Role: Analyze current codebase patterns and constraints
Task:
- Search for existing patterns related to decision
- Check dependencies and libraries
- Evaluate migration complexity
- Assess team familiarity
Output: Current state, patterns, dependencies, constraints
```

**4. Analysis Agent**
```
Role: Compare all findings objectively (does NOT make final decision)
Task:
- Wait for Agents 1-3 to complete
- Analyze trade-offs objectively
- Consider context and constraints
- Present comparison with AI suggestion
Output: Objective comparison + AI suggestion (NOT final decision)
```

**If 3+ options:** Spawn additional advocate agents

### Step 4: Agent Execution

**Parallel execution:**
```
🤖 Launching multi-agent decision analysis...

[Agent 1: REST Advocate] 🔄 Researching REST benefits...
[Agent 2: GraphQL Advocate] 🔄 Researching GraphQL benefits...
[Agent 3: Codebase Context] 🔄 Analyzing current API patterns...
[Agent 4: Analysis] ⏸️  Waiting for input agents...

⏱️  Estimated time: 2-3 minutes
```

**Agent prompts:**

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

**Wait for all agents to complete:**
```
✅ [Agent 1: REST Advocate] Complete
✅ [Agent 2: GraphQL Advocate] Complete
✅ [Agent 3: Codebase Context] Complete
✅ [Agent 4: Analysis] Complete

📊 Analyzing results...
```

**Parse agent outputs:**
- Extract key findings from each advocate
- Extract codebase analysis
- Extract AI analysis and suggestion

### Step 6: Human Decision Capture

**Present findings to human:**

```
📊 Multi-agent analysis complete!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 **FINDINGS SUMMARY:**

**Option A: [OPTION_A_NAME]**
✅ Strengths: [Key strengths from Agent 1]
⚠️  Drawbacks: [Key drawbacks from Agent 1]

**Option B: [OPTION_B_NAME]**
✅ Strengths: [Key strengths from Agent 2]
⚠️  Drawbacks: [Key drawbacks from Agent 2]

**Codebase Context:**
📁 [Key findings from Agent 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 **AI SUGGESTION:** [SUGGESTED_OPTION]

**Confidence:** 🟢/🟡/🔴 [High/Medium/Low]

**Rationale:**
1. [Reason 1]
2. [Reason 2]
3. [Reason 3]

**Trade-offs accepted:**
- [Trade-off 1]
- [Trade-off 2]

⚠️  This is my suggestion based on analysis. You make the final decision.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Prompt human for decision:**

```
💭 What's your decision?

Options:
A) Accept AI suggestion: [SUGGESTED_OPTION]
B) Choose different option: [OTHER_OPTIONS]
C) Need more research (specify what)

Your choice (A/B/C):
```

**If user chooses A (Accept):**
```
✅ Decision: [SUGGESTED_OPTION] (AI suggestion accepted)

Why did you choose this? (optional context):
> [User provides reasoning or presses Enter]
```

**If user chooses B (Different option):**
```
✅ Decision: [USER_CHOSEN_OPTION]

Why did you choose this instead? (helps document your reasoning):
> [User explains their rationale]
```

**If user chooses C (More research):**
```
🔄 What additional research is needed?
> [User specifies]

[Spawn additional agents or provide more context]
```

**Capture final decision:**
- **Decision:** [User's chosen option]
- **AI Suggestion Was:** [What AI suggested]
- **Human Rationale:** [Why human chose this]
- **Decision Maker:** Human (AI-assisted)

### Step 7: Generate Decision Document

**Create decision artifact:**

Filename: `decisions/YYYY-MM-DD-[topic-kebab-case].md`

Example: `decisions/2024-01-15-rest-vs-graphql.md`

**Use template from:**
`cdd/.meta/templates/v2/decisions/DECISION_TEMPLATE.md`

**Populate sections:**
- Context → User-provided context
- Option A → Agent 1 findings
- Option B → Agent 2 findings
- Codebase Context → Agent 3 findings
- AI Analysis → Agent 4 analysis and suggestion
- Final Decision → Human's decision with rationale

### Step 8: Update CONTEXT.md

**Add reference in Decisions section:**

```markdown
## 📝 Decisions

<details>
<summary><strong>2024-01-15: REST vs GraphQL for API</strong></summary>

**Decision:** REST

**Rationale:** Better fit for team expertise, simpler caching, existing tooling

**Trade-offs:** More endpoints to maintain, potential over/under-fetching

**See full analysis:** [decisions/2024-01-15-rest-vs-graphql.md](decisions/2024-01-15-rest-vs-graphql.md)

</details>
```

### Step 9: Present Results

**Show summary to user:**

```
✅ Decision documented!

🤖 Consulted: 4 specialist agents
👤 Decision made by: You
📄 Saved to: decisions/2024-01-15-rest-vs-graphql.md
📝 Referenced in: CONTEXT.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 **YOUR DECISION: REST**

**Your Rationale:**
"Better fit for our team's expertise and existing tooling. While GraphQL has appeal, the learning curve and migration complexity outweigh the benefits for our current use case."

**AI Suggested:** REST (you accepted the suggestion)

**Key Supporting Evidence:**
1. Team has strong REST experience (evidence in existing APIs)
2. Simpler caching strategy with existing tools
3. Lower learning curve for new developers
4. Swagger docs already in place

**Trade-offs You Accepted:**
- More endpoints to maintain vs. single GraphQL endpoint
- Potential over/under-fetching vs. precise queries
- Less flexible for evolving client needs

**Implementation Next Steps:**
- Build RESTful API with standard patterns
- Use existing Express.js setup
- Document with Swagger (already configured)
- Plan for versioning (e.g., /v1/, /v2/)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 Read full analysis with all agent findings:
   decisions/2024-01-15-rest-vs-graphql.md

💬 Want to revisit this decision? Just ask.
```

## Examples

### Example 1: Binary Choice

**Input:**
```
/cdd:plan Should we use PostgreSQL or MongoDB for user preferences?
```

**AI:**
```
🤖 Launching multi-agent decision analysis...

Decision: PostgreSQL vs MongoDB
Work Item: 0001-user-preferences

Quick context (optional):
1. Why is this decision needed now?
```

**User:** `Need to choose before implementing data layer. Preferences are mostly key-value but might get complex.`

**AI:**
```
🤖 Launching 4 agents in parallel...

[Agent 1: PostgreSQL Advocate] 🔄 Researching...
[Agent 2: MongoDB Advocate] 🔄 Researching...
[Agent 3: Codebase Context] 🔄 Analyzing current db setup...
[Agent 4: Analysis] ⏸️  Waiting...

⏱️  ~2 minutes...

[2 minutes later]

✅ Analysis complete!

🤖 AI SUGGESTION: PostgreSQL
Confidence: 🟢 High

Key Reasons:
1. You already use Postgres for users table (Agent 3 found schema.prisma)
2. JSONB handles key-value flexibility
3. Strong typing prevents data quality issues
4. Team familiar with SQL (migrations in repo)

Trade-offs:
- Slightly more complex for pure key-value
- MongoDB might be faster for document writes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💭 What's your decision?
A) Accept AI suggestion: PostgreSQL
B) Choose different: MongoDB
C) Need more research

Your choice: A

✅ Decision: PostgreSQL (AI suggestion accepted)

Why did you choose this? (optional):
> "Makes sense to stick with what we already use. JSONB solves flexibility."

📄 Decision saved: decisions/2024-01-15-postgres-vs-mongo.md
```

### Example 2: Multi-Option

**Input:**
```
/cdd:plan Choose auth strategy --options="OAuth,Custom,Passwordless"
```

**AI:**
```
🤖 Launching 5 agents (3 advocates + codebase + analysis)...

[Agent 1: OAuth Advocate] 🔄
[Agent 2: Custom Auth Advocate] 🔄
[Agent 3: Passwordless Advocate] 🔄
[Agent 4: Codebase Context] 🔄
[Agent 5: Analysis] ⏸️

⏱️  ~3 minutes (more options = more research)...

[3 minutes later]

✅ Analysis complete!

🤖 AI SUGGESTION: OAuth (Google + GitHub)
Confidence: 🟡 Medium

Key Reasons:
1. Reduces security liability (no password storage)
2. Users prefer existing accounts (UX win)
3. Industry standard, well-supported libraries

Trade-offs:
- Dependency on external providers
- More complex initial setup
- Requires internet connection

⚠️  Medium confidence because:
- Passwordless is compelling for UX
- Custom auth gives full control
- Decision depends on user base (revisit if internal tool)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💭 What's your decision?
A) Accept: OAuth
B) Choose: Custom or Passwordless
C) More research

Your choice: B (Passwordless)

Why Passwordless instead?
> "Our user base is tech-savvy. Passwordless provides better UX without third-party dependencies. We can always add OAuth later."

✅ Decision: Passwordless (overrode AI suggestion)

📄 Decision saved: decisions/2024-01-15-auth-strategy.md
```

### Example 3: Open-Ended Research

**Input:**
```
/cdd:plan Best caching strategy for our API
```

**AI:**
```
🤔 I need to understand the options.

What caching approaches are you considering?
(Or type "research" for me to suggest options)
```

**User:** `research`

**AI:**
```
🔄 Researching caching strategies...

[Agent: Caching Research] Analyzing...

Found common strategies:
1. Redis (in-memory cache)
2. CDN caching (edge caching)
3. Application-level (in-process)
4. Database query cache

Should I analyze all 4? (y) or specify subset? (e.g., "Redis,CDN")
```

**User:** `y`

**AI:**
```
🤖 Launching 6 agents (4 advocates + codebase + analysis)...

[Parallel analysis of all 4 options]

✅ Analysis complete!

🤖 AI SUGGESTION: Redis + CDN (hybrid approach)

[Analysis summary with human decision dialogue...]

✅ Your Decision: Redis + CDN (hybrid approach)
```

## Advanced Features

### Codebase-Aware Recommendations

**Agent 3 uses actual code analysis:**

```bash
# Searches codebase
grep -r "database" src/
grep -r "import.*postgres" src/
cat package.json  # Check deps

# Findings inform recommendation
```

**Example output:**
```
Codebase Context Agent found:
- Existing Postgres connection in src/db/
- Prisma ORM already configured
- No MongoDB dependencies
- Team has 12 Postgres migrations

→ Strong preference for Postgres due to existing investment
```

### Confidence Levels

**High (🟢):** Clear winner, strong evidence, low risk
**Medium (🟡):** Close call, depends on priorities, some risk
**Low (🔴):** Unclear, need more research, high uncertainty

### Review Triggers

**Decision document includes:**
```markdown
## 🔄 Review Triggers

Revisit this decision if:
- [ ] User base grows 10x (scale considerations)
- [ ] Team adds GraphQL experience
- [ ] Performance becomes critical (< 100ms requirement)

Last reviewed: 2024-01-15
```

## Error Handling

**If no options provided:**
```
❌ Please specify what you're deciding between.

Examples:
- /cdd:decide "REST or GraphQL?"
- /cdd:decide "PostgreSQL vs MongoDB"
- /cdd:decide --options="A,B,C" [topic]
```

**If agents fail:**
```
⚠️  Agent 2 (GraphQL Advocate) failed to complete.

Proceeding with remaining agents...
Recommendation will note reduced confidence.
```

**If no work item active:**
```
💡 No active work item detected.

Decision will be saved to:
  decisions/2024-01-15-[topic].md

Want to associate with a work item? (y/n)
```

## Implementation Notes

**Total length target:** ~300 lines

**Key innovation:**
- Multi-agent parallel execution (new capability)
- Codebase-aware analysis (searches actual code)
- Synthesized recommendation (not just data dump)

**Tools used:**
- Task tool (spawn parallel agents)
- Grep tool (codebase analysis by Agent 3)
- Read tool (read existing files for context)
- Write tool (save decision document)
- Edit tool (update CONTEXT.md)

**Timing:**
- Binary choice: ~2 minutes
- Multi-option (3+): ~3-4 minutes
- Open research: ~5 minutes

**Files created:**
- `cdd/XXXX-work-name/decisions/YYYY-MM-DD-topic.md`

**Files updated:**
- `cdd/XXXX-work-name/CONTEXT.md` (adds reference)

---

**Remember:** Use this for hard decisions. The multi-agent analysis is powerful but takes time. For simple choices, just decide and document in CONTEXT.md directly.
