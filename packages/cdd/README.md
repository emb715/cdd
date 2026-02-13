# CDD - Context-Driven Development

> **Productivity-first AI workflow. Zero ceremony, maximum focus.**

## What is CDD?

CDD (Context-Driven Development) is a methodology for working with AI assistants that keeps you in flow state. **No interviews, no boilerplate, no context pollution.**

### Core Philosophy

**CDD is built on three principles:**

1. **Speed over perfection** - Start working in 30 seconds, refine as you go
2. **AI-native decisions** - Let multiple agents research in parallel, you make the call
3. **Zero ceremony** - No mandatory tracking, no overhead, just work

---

## Quick Start

### Installation

```bash
# Install
npm install -g @emb715/cdd

# Initialize in your project
npx @emb715/cdd init
```

### Your First Work Item (30 seconds)

```bash
# In Claude Code (or any AI assistant with Claude)
/cdd:start add user authentication with OAuth

# AI creates:
# cdd/0001-add-user-authentication-with-oauth/
#   ├── CONTEXT.md   (problem, solution, tasks)
#   └── SESSIONS.md  (empty, ready to log)

# You start coding...
```

### Log Your Progress (10 seconds)

```bash
# After working for a while
/cdd:log

# AI auto-detects:
# - What files changed
# - What tasks completed
# - How long you worked
# Logs it in 10 seconds, zero questions
```

### Make Hard Decisions (AI does the work)

```bash
# When you hit a decision point
/cdd:decide Should we use REST or GraphQL?

# AI spawns 4 agents in parallel:
# - REST advocate (researches pros/cons)
# - GraphQL advocate (researches pros/cons)
# - Codebase analyzer (checks your patterns)
# - Analysis agent (objective comparison + suggestion)

# 2 minutes later, you get findings + AI suggestion
# You make the final decision
```

### Finish and Ship

```bash
/cdd:done

# Marks complete, logs final session, optional summary
```

---

## The Workflow

### File Structure

```
project/
├── cdd/                           # Your work items
│   ├── 0001-user-authentication/
│   │   ├── CONTEXT.md             # Problem + Solution + Tasks + Decisions
│   │   ├── SESSIONS.md            # Simple session log
│   │   └── decisions/             # Multi-agent decision artifacts (optional)
│   │       └── 2024-01-15-auth-strategy.md
│   └── 0002-dark-mode-toggle/
│       ├── CONTEXT.md
│       └── SESSIONS.md
├── .claude/                       # AI commands
│   └── commands/
│       ├── cdd:start.md           # Create work item
│       ├── cdd:log.md             # Log session
│       ├── cdd:decide.md          # Multi-agent decision planning
│       └── cdd:done.md            # Mark complete
└── cdd/.meta/                     # Templates and tools
    └── templates/                 # Progressive templates
```

### CONTEXT.md - The Heart of CDD

**One file, progressive disclosure:**

```markdown
---
id: 0001
title: User Authentication
type: feature
status: in-progress
created: 2024-01-15
updated: 2024-01-16
---

# User Authentication

## 🎯 Why (Problem)
Users need secure login. No auth system exists.

## 💡 Solution
OAuth2 (Google, GitHub) + JWT sessions.

## ✅ Tasks

<details open>
<summary><strong>Phase 1: Foundation</strong> (2/3 complete)</summary>

- [x] Setup OAuth providers
      **Files:** `lib/auth/oauth.ts`
- [x] Create JWT service
      **Files:** `lib/auth/jwt.ts`
- [ ] Add session middleware
      **Files:** `lib/middleware/auth.ts`

</details>

## 🧠 Context for AI

**Patterns to follow:**
- Use existing `TokenService` pattern from `lib/auth/`

**Key files:**
- `lib/auth/` - Auth utilities
- `config/auth.config.ts` - OAuth credentials

## 📝 Decisions

<details>
<summary><strong>2024-01-15: OAuth vs Custom Auth</strong></summary>

**Decision:** OAuth2

**Rationale:** Better security, users prefer existing accounts

**See full analysis:** [decisions/2024-01-15-auth-strategy.md](decisions/2024-01-15-auth-strategy.md)

</details>
```

**Why this is better:**
- ✅ Single file to read (no jumping between multiple docs)
- ✅ Progressive disclosure (collapse what you don't need)
- ✅ Tasks have file hints (AI can auto-detect completion)
- ✅ Decisions collapsed by default (low noise)

---

## The Killer Feature: Multi-Agent Decisions

### How It Works

When you need to make a hard decision, instead of researching yourself:

```bash
/cdd:decide PostgreSQL vs MongoDB for user preferences
```

**Behind the scenes (2-3 minutes):**

1. **Agent 1: PostgreSQL Advocate**
   - Researches PostgreSQL benefits
   - Finds use cases, examples
   - Identifies drawbacks

2. **Agent 2: MongoDB Advocate**
   - Researches MongoDB benefits
   - Finds use cases, examples
   - Identifies drawbacks

3. **Agent 3: Codebase Context**
   - Greps your actual code
   - Checks existing patterns
   - Evaluates migration complexity

4. **Agent 4: Analysis Agent**
   - Compares all findings objectively
   - Considers your constraints
   - Provides suggestion (NOT final decision)

**You get:**
```
🤖 AI SUGGESTION: PostgreSQL
Confidence: 🟢 High

Key Supporting Evidence:
1. You already use Postgres (found in schema.prisma)
2. JSONB handles key-value flexibility
3. Team familiar with SQL

Trade-offs:
- MongoDB might be faster for writes
- Postgres requires more schema planning

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💭 What's your decision?
A) Accept AI suggestion: PostgreSQL
B) Choose different: MongoDB
C) Need more research

> You choose: A

✅ YOUR DECISION: PostgreSQL
Your rationale: "Matches our existing stack, makes sense."

📄 Full analysis: decisions/2024-01-15-postgres-vs-mongo.md
```

**This is revolutionary** because:
- ✅ Multiple perspectives in parallel
- ✅ Codebase-aware (analyzes your actual code)
- ✅ Evidence-based (not gut feel)
- ✅ Human-in-the-loop (YOU decide, AI assists)
- ✅ Traceable (full artifact with your rationale)

---

## Available Agents

CDD includes specialized AI agents for different workflows:

- **Workflow agents** (`cdd-honest`) - Used internally by `/cdd:start`, `/cdd:log`, `/cdd:done` commands
- **Expert agents** (`cdd-sage` family) - Invoke directly for specialized development work

See [AGENTS.md](AGENTS.md) for complete guide.

**Quick usage:**
- `/cdd-sage` - Adaptive expert (auto-selects mode based on your interaction)
- `/cdd-sage-specialist` - Deep technical work (architecture, optimization, edge cases)
- `/cdd-sage-balanced` - Efficient development with domain expertise (recommended default)
- `/cdd-sage-mentor` - Learning mode (explains WHY, builds mental models)

---

## How It Works Under the Hood

### Auto-Detection Intelligence

**Type Detection (from /cdd:start):**

When you run `/cdd:start add user authentication`, CDD scans for keywords:

| You Say | CDD Detects | Reason |
|---------|-------------|--------|
| "fix login timeout" | bug | Keyword: "fix" |
| "add dark mode" | feature | Keyword: "add" |
| "refactor auth layer" | refactor | Keyword: "refactor" |
| "research caching options" | spike | Keyword: "research" |
| "initiative X" | epic | Keyword: "initiative" |

If ambiguous, it asks. If still unclear, defaults to "feature".

**Work Item Detection (from /cdd:log):**

CDD uses 3 strategies in order:

1. **Git diff analysis** - Matches changed files to `cdd/XXXX-*/` folders
2. **Conversation history** - Looks for CONTEXT.md reads, work item IDs mentioned
3. **Ask user** - Shows list if uncertain

**File-to-Task Matching:**

```markdown
Task in CONTEXT.md:
- [ ] Setup OAuth
      **Files:** `lib/auth/oauth.ts`

You create: lib/auth/oauth.ts

CDD auto-marks task complete ✅
```

Supports:
- **Exact match:** `lib/auth/oauth.ts` = `lib/auth/oauth.ts`
- **Glob patterns:** `lib/auth/providers/*.ts` matches `lib/auth/providers/google.ts`
- **Partial match:** Creating test files alongside source files suggests both are done

### Multi-Agent Architecture

CDD uses specialized agents for different workflows:
- **Honest Agent** (`cdd-honest`) - Used by `/cdd:start`, `/cdd:log`, `/cdd:done` for autonomous workflow execution
- **Sage Agents** (`cdd-sage-*`) - Used by `/cdd:decide` for domain-aware decision research

**Architecture:**
```
User → /cdd:start → Wrapper → Honest Agent → Autonomous Execution → Clean Output
                        ↓
              Instruction Template
              - Direct, imperative
              - No ceremony
              - Efficiency hints
              - Pattern learning
```

**Benefits:**
- **Main conversation stays clean** - Wrappers are 60-80% smaller
- **Consistent execution** - All commands use agent-based architecture
- **Autonomous behavior** - No user prompts, full auto-detection
- **Cross-command intelligence** - Agents read SESSIONS.md for context, learn patterns
- **Smart defaults** - Type detection from project history, duration estimation from prior sessions
- **Pre-configured permissions** - cdd-honest agent includes git read permissions, no prompts for status/diff/log operations

**Agent Flow (Decision Planning):**

```
┌─────────────────────────────────────────────┐
│         Human asks decision question         │
└───────────────┬─────────────────────────────┘
                │
        ┌───────┴────────┐
        │  Parse Options  │
        └───────┬────────┘
                │
    ┌───────────┼───────────┬──────────────┐
    │           │           │              │
┌───▼──┐    ┌──▼───┐   ┌───▼───┐    ┌────▼────┐
│Agent │    │Agent │   │Agent  │    │ Analysis│
│  A   │    │  B   │   │Codebase│    │ Agent  │
│Advo- │    │Advo- │   │Context│    │ (waits) │
│cate  │    │cate  │   │       │    │         │
└───┬──┘    └──┬───┘   └───┬───┘    └────┬────┘
    │          │           │              │
    └──────────┴───────────┴──────────────┘
                   │
            ┌──────▼──────┐
            │  Objective  │
            │  Analysis + │
            │  Suggestion │
            └──────┬──────┘
                   │
            ┌──────▼──────┐
            │   Human     │
            │  Decides    │
            └─────────────┘
```

**Timing:**
- Binary decision (2 options): ~2 minutes
- Multi-option (3-5 options): ~3-4 minutes
- Open research: ~5 minutes

**When agents disagree:**
- Analysis Agent presents both perspectives
- Lowers confidence rating
- Highlights key trade-offs
- You decide based on your context

### Smart Features Explained

**Duration Estimation:**

CDD estimates session length from conversation timestamps:
- First tool use → Last tool use
- Fallback: Ask for quick estimate if unclear
- Granularity: 0.5h increments

**Progressive Task Tracking:**

Phases auto-update completion counts:
```markdown
<summary><strong>Phase 1</strong> (2/5 complete)</summary>
```
- Counts checked tasks within `<details>` block
- Updates on each `/cdd:log`

**Codebase-Aware Decisions:**

Agent 3 uses actual grep/glob on your code to find:
- Existing patterns (searches imports, similar implementations)
- Dependencies (checks package.json)
- Migration complexity (counts affected files)

---

## Commands Reference

### `/cdd:start [description]`

Create a new work item.

**Flags:**
- `--type=[feature|bug|refactor|spike|epic]` - Override auto-detection

**Examples:**
```bash
/cdd:start fix login timeout
/cdd:start add dark mode toggle
/cdd:start refactor database layer
```

**What it does:**
1. Auto-detects type from keywords
2. Auto-increments sequence number
3. Creates CONTEXT.md (preserves your original prompt) + SESSIONS.md
4. Done in 30 seconds

---

### `/cdd:log`

Log your session progress.

**Flags:**
- `--force` - Skip confirmations

**Examples:**
```bash
/cdd:log                # Auto-detect everything
/cdd:log 0001           # Specific work item
```

**What it does:**
1. Git diff to see file changes
2. Matches files to tasks
3. Auto-marks completed tasks
4. Appends to SESSIONS.md
5. Done in 10 seconds

---

### `/cdd:decide [topic]`

Launch multi-agent decision planning (AI researches, you decide).

**Flags:**
- `--options="A,B,C"` - Specify options explicitly

**Examples:**
```bash
/cdd:decide Should we use REST or GraphQL?
/cdd:decide PostgreSQL vs MongoDB for user data
/cdd:decide "Best auth strategy" --options="OAuth,Custom,Passwordless"
```

**What it does:**
1. Parses decision topic
2. Launches 4+ agents in parallel (advocates, codebase analyzer, analysis agent)
3. Presents findings and AI suggestion
4. **You make the final decision**
5. Saves decision artifact with your rationale
6. References in CONTEXT.md

---

### `/cdd:done`

Mark work item complete.

**Flags:**
- `--summary` - Generate IMPLEMENTATION_SUMMARY.md
- `--skip-log` - Don't add final session

**Examples:**
```bash
/cdd:done               # Simple completion
/cdd:done --summary     # With summary doc
```

**What it does:**
1. Verifies task completion
2. Adds final session log
3. Updates status to complete
4. Optional summary generation

---

## Command Boundaries: What They Do and Don't Do

### /cdd:start

**Does:**
- ✅ Create folder structure (CONTEXT.md + SESSIONS.md)
- ✅ Auto-detect work item type from keywords
- ✅ Generate unique sequence number
- ✅ Initialize templates

**Does NOT:**
- ❌ Create any application code
- ❌ Modify git repository
- ❌ Ask 10+ questions
- ❌ Force a specific template structure

**Takes:** 30 seconds | **When to use:** Starting any new work item

---

### /cdd:log

**Does:**
- ✅ Detect changed files via git diff
- ✅ Match files to tasks in CONTEXT.md
- ✅ Auto-mark completed tasks
- ✅ Estimate session duration from conversation
- ✅ Append entry to SESSIONS.md

**Does NOT:**
- ❌ Create git commits
- ❌ Push changes to remote
- ❌ Modify application code
- ❌ Delete or archive files
- ❌ Change task definitions

**Takes:** 10 seconds | **When to use:** After each coding session (30min+)

---

### /cdd:decide

**Does:**
- ✅ Launch 4+ AI agents in parallel
- ✅ Research options objectively
- ✅ Analyze your codebase patterns
- ✅ Present evidence-based suggestion
- ✅ Capture YOUR decision + rationale
- ✅ Save full decision artifact

**Does NOT:**
- ❌ Make the final decision (you do)
- ❌ Execute code changes
- ❌ Modify CONTEXT.md tasks
- ❌ Guarantee perfect recommendations
- ❌ Replace human judgment

**Takes:** 2-5 minutes | **When to use:** Hard technical choices with 2+ valid options

---

### /cdd:done

**Does:**
- ✅ Verify task completion
- ✅ Add final session log
- ✅ Mark status as complete
- ✅ Optionally generate summary document

**Does NOT:**
- ❌ Create git commits or PRs
- ❌ Delete work item files
- ❌ Validate that code works
- ❌ Run tests
- ❌ Deploy anything

**Takes:** 30 seconds | **When to use:** All tasks complete, ready to ship

---

## Philosophy Deep Dive

### The Template Philosophy

**Design principles:**

Start minimal:
```markdown
## 🎯 Why
Problem statement

## 💡 Solution
High-level approach

## ✅ Tasks
- [ ] Task 1
```

**Expand as needed:**
```markdown
## ✅ Tasks

<details open>
<summary><strong>Phase 1</strong></summary>

- [ ] Task with file hints
      **Files:** `path/to/file.ts`
      **Done when:** Specific criteria

</details>

## 📝 Decisions

<details>
<summary><strong>Decision Title</strong></summary>

Full decision details (collapsed by default)

</details>
```

**Benefits:**
- ✅ Scan quickly (collapsed sections)
- ✅ Expand when needed (click `<details>`)
- ✅ Low context pollution
- ✅ Works for any complexity

---

## Advanced Usage

### Custom Templates

Don't like the default CONTEXT.md format? Use your own:

```bash
/cdd:start my-feature --template=path/to/my-template.md
```

### Bulk Operations

Create multiple work items from a list:

```bash
# In a script
for item in "fix bug A" "add feature B" "refactor C"; do
  /cdd:start "$item"
done
```

### Decision Libraries

Build a decision database:

```bash
cdd/
└── .meta/
    └── decisions-library/
        ├── database-choices.md
        ├── auth-strategies.md
        └── caching-approaches.md
```

Reference in new decisions:
```markdown
See previous analysis: [.meta/decisions-library/database-choices.md]
```

---

## FAQ

### Is CDD suitable for teams?

**Yes**, but:
- Best for small teams (2-5 people)
- Self-organizing teams
- Teams that value speed over process

For large teams or compliance-heavy environments, you may need additional tooling.

### Can I still use CDD-RAG?

Yes! The RAG extension searches across CONTEXT.md and decision files.

---

## Contributing

CDD is open source and MIT licensed.

**How to contribute:**
1. Fork the repo
2. Try CDD on your projects
3. Report issues or suggest improvements
4. Submit PRs with bug fixes or enhancements

**Areas we'd love help:**
- Templates for other domains (mobile, ML, devops)
- IDE integrations
- Multi-agent decision improvements
- Documentation and examples

---

## License

MIT License - see LICENSE file

---

## Links

- **GitHub:** https://github.com/emb715/cdd
- **Issues:** https://github.com/emb715/cdd/issues
- **Discussions:** https://github.com/emb715/cdd/discussions

---

**Built with ❤️ by developers who hate ceremony.**

*CDD - Zero ceremony, maximum flow.*
