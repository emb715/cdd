# Context-Driven Development (CDD) by EMB

> Simplified, developer-friendly context infrastructure for AI-assisted development

[![npm version](https://badge.fury.io/js/@emb715%2Fcdd.svg)](https://www.npmjs.com/package/@emb715/cdd)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Author:** EMB (Ezequiel M. Benitez) @emb715
**License:** MIT

## 🎓 What is CDD?

Context-Driven Development is a methodology where **structured, persistent documentation serves as the foundation for development**—not an afterthought. It treats context as infrastructure, enabling both humans and AI to work effectively across sessions and time.

**Core Principle:** Externalize context into documents that create a single source of truth for requirements, decisions, and progress.

### How It Actually Works (The Human-AI Collaboration)

CDD is **not** magic automation. It's a **collaborative workflow** where:

- **You provide** the requirements, codebase knowledge, and decisions
- **AI assists** by structuring your input, generating plans, and asking validation questions
- **You validate** every output, correct errors, and maintain ownership

**Automation level:**
- ✅ **Automated**: Template generation, file creation, formatting, documentation structure
- 🤝 **Collaborative**: Planning tasks (you describe, AI structures), tracking progress (you report, AI documents)
- 👤 **Manual**: All decision-making, code implementation, requirement validation, evidence collection

**Key principle:** CDD helps you **remember** context better, not **replace** your judgment.

---

## 📐 Template Modes: Right-Sized Documentation

CDD provides **three template modes** to match your work complexity:

| Mode | Best For | Overhead | Files Created |
|------|----------|----------|---------------|
| **solo-dev** ⭐ DEFAULT | Solo developers, any size work | Minimal | 3 files (~150 lines total) |
| **minimal** | Small teams, < 5 days | Light | 3 files (~600 lines total) |
| **comprehensive** | Complex/high-risk, multi-team | Full | 8 files (~3500 lines total) |

**Default behavior:** CDD uses `solo-dev` mode automatically—minimal overhead, essential context only.

**When to use other modes:**
- Use `--mode=minimal` for collaborative work with testing requirements
- Use `--mode=comprehensive` for high-risk work needing formal validation

See [SIZING_GUIDE.md](packages/cdd/cdd/.meta/SIZING_GUIDE.md) for detailed guidance.

---

## 🚀 Installation

### Quick Start

```bash
# Initialize CDD in your project
npx @emb715/cdd init

# (Optional) Add RAG extension for semantic search
npx @emb715/cdd add rag
```

That's it! You now have:
- `cdd/` - Methodology templates and documentation
- `.claude/commands/` - Slash commands for Claude Code
- `cdd/.rag/` - RAG extension (if added)

### Verify Installation

Open your project in Claude Code and type:
- `/cdd:create-work` - Should autocomplete
- `/cdd:list-work` - Should autocomplete
- `/cdd:query` - Should autocomplete (if RAG added)

### Manual Installation (Alternative)

If you prefer manual setup:

```bash
# Clone repository
git clone https://github.com/emb715/cdd.git

# Copy files to your project
cp -r cdd/packages/cdd/cdd ~/your-project/cdd
cp -r cdd/packages/cdd/.claude ~/your-project/.claude

# (Optional) Add RAG
cp -r cdd/packages/cdd-rag/cdd/.rag ~/your-project/cdd/.rag
cp cdd/packages/cdd-rag/.claude/commands/cdd:query.md ~/your-project/.claude/commands/
```

### RAG Setup (Python Required)

After running `npx @emb715/cdd add rag`:

```bash
# Option 1: Automated setup (recommended)
cd cdd/.rag
chmod +x quick_start.sh
./quick_start.sh

# Option 2: Manual setup
cd cdd/.rag
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

See `cdd/.rag/README.md` for full RAG documentation.

---

## 🎯 Quick Start Workflow

### 1. Create a Work Item
```bash
/cdd:create-work user authentication system
```

This creates a self-contained folder with minimal documentation:
```
cdd/0001-user-authentication-system/
├── DECISIONS.md              # Requirements & decisions (50-80 lines)
├── IMPLEMENTATION_PLAN.md    # Tasks & roadmap (generated)
└── SESSION_NOTES.md          # Session tracking log
```

**Note:** Uses solo-dev mode by default. Add `--mode=minimal` or `--mode=comprehensive` to override.

### 2. Generate Implementation Plan
```bash
/cdd:plan-work 0001
```

Interviews you about your codebase and generates actionable tasks based on your project's patterns (you provide context, AI structures it into a plan).

### 3. Work & Track Progress
```bash
# After each work session
/cdd:save-session 0001
```

AI automatically detects file changes and suggests task completions:
```
🔍 Based on file changes, I detected:
✓ Task 1.3: Add user_preferences table
  - Created: prisma/migrations/20241030_add_preferences.sql
  - Modified: prisma/schema.prisma

Mark as complete? (y/n/edit)
```

Appends session notes to track progress, decisions, and learnings.

### 4. Complete Work
```bash
/cdd:complete-work 0001
```

Generates comprehensive summary and marks work as complete.

## 📁 Project Structure

```
your-project/
├── cdd/                                    # CDD workspace (visible)
│   ├── 0001-user-authentication/           # Feature work items
│   │   ├── DECISIONS.md                    # Requirements, decisions, context
│   │   ├── IMPLEMENTATION_PLAN.md          # Detailed task breakdown
│   │   ├── SESSION_NOTES.md                # Running session log
│   │   └── IMPLEMENTATION_SUMMARY.md       # Post-completion summary
│   │
│   ├── 0002-dark-mode-toggle/
│   │   └── [same structure]
│   │
│   ├── bugs/                               # Bug fixes
│   │   └── 0001-login-timeout/
│   │       └── [same structure]
│   │
│   ├── refactor/                           # Refactoring work
│   │   └── 0001-database-optimization/
│   │       └── [same structure]
│   │
│   ├── spikes/                             # Research & exploration
│   │   └── 0001-graphql-evaluation/
│   │       └── [same structure]
│   │
│   ├── epics/                              # Large initiatives
│   │   └── 0001-v2-platform-redesign/
│   │       └── [same structure]
│   │
│   └── .meta/                              # System documentation
│       ├── README.md                       # Full CDD guide
│       ├── SIZING_GUIDE.md                 # Template mode selection guide
│       ├── QUICK_REFERENCE.md              # Command cheat sheet
│       ├── metrics/                        # Metrics system (optional)
│       │   ├── README.md                   # Full metrics methodology
│       │   ├── AI_AUTOMATION_GUIDE.md      # When AI runs metrics scripts
│       │   └── scripts/                    # Optional automation scripts
│       │       ├── collect-metrics.js
│       │       └── lib/frontmatter.js
│       ├── metrics-summary.json            # Auto-generated metrics dashboard
│       └── templates/                      # Document templates by mode
│           ├── solo-dev/                   # DEFAULT - Minimal templates
│           │   ├── DECISIONS.md
│           │   ├── IMPLEMENTATION_PLAN.md
│           │   ├── SESSION_NOTES.md
│           │   └── IMPLEMENTATION_SUMMARY.md
│           ├── minimal/                    # Collaborative work
│           │   └── [same 4 files, more detailed]
│           └── comprehensive/              # Complex work
│               ├── DECISIONS.md
│               ├── PROBLEM_BRIEF.md
│               ├── TECHNICAL_RFC.md
│               ├── RISK_REGISTER.md
│               ├── VALIDATION_PLAN.md
│               ├── IMPLEMENTATION_PLAN.md
│               ├── SESSION_NOTES.md
│               └── IMPLEMENTATION_SUMMARY.md
│
└── .claude/
    └── commands/                           # Slash commands
        ├── cdd:create-work.md              # /cdd:create-work
        ├── cdd:plan-work.md                # /cdd:plan-work
        ├── cdd:save-session.md             # /cdd:save-session
        ├── cdd:complete-work.md            # /cdd:complete-work
        └── cdd:list-work.md                # /cdd:list-work
```

## 🖥️ CLI Tool

CDD includes an interactive command-line tool for managing work items and browsing documentation:

```bash
cd cli
npm install
npm start
```

**Features:**
- 📋 **Interactive work browser** - View, filter, and manage work items
- 📊 **Live statistics** - Track progress, sessions, and metrics
- 📖 **Documentation viewer** - Navigate README with search and sections
- ✏️ **Quick edits** - Update status, priority, and metadata
- 🔍 **Advanced filtering** - Find work by status, type, priority

See `cli/README.md` for full documentation.

## 📋 Available Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `/cdd:create-work` | Create new work item with full documentation | `/cdd:create-work user profile management` |
| `/cdd:plan-work` | Generate implementation plan from decisions | `/cdd:plan-work 0001` |
| `/cdd:save-session` | Save session progress and decisions | `/cdd:save-session 0001` |
| `/cdd:complete-work` | Mark work complete and generate summary | `/cdd:complete-work 0001` |
| `/cdd:list-work` | View all work items with filtering | `/cdd:list-work --status=in-progress` |

### Command Details

#### `/cdd:create-work [description]`
Creates a new work item with complete folder structure.

**Features:**
- Interactive questions to gather requirements
- Supports Features, Bugs, Refactors, Spikes, and Epics
- Auto-increments work IDs
- Generates initial documentation from templates

**Example:**
```
/cdd:create-work user authentication with OAuth

→ Asks clarifying questions
→ Creates cdd/0001-user-authentication-with-oauth/
→ Populates DECISIONS.md with requirements
→ Ready for /cdd:plan-work
```

#### `/cdd:plan-work [work-id]`
Collaboratively generates detailed implementation plan through structured questions.

**Features:**
- Reads DECISIONS.md requirements
- **Interviews you** about your codebase structure and patterns
- Reads context files **you specify** in DECISIONS.md
- Generates parent tasks → waits for approval → generates sub-tasks
- References existing patterns from files **you point to**
- Saves to IMPLEMENTATION_PLAN.md

**What it DOES:**
- ✅ Reads your DECISIONS.md
- ✅ Asks you questions about tech stack, architecture, file organization
- ✅ Reads files you listed in `context_files` (with your permission)
- ✅ Creates structured implementation plan based on your answers

**What it DOES NOT do:**
- ❌ Does NOT scan your codebase automatically
- ❌ Does NOT detect patterns on its own
- ❌ Does NOT analyze files without asking first

**Example:**
```
/cdd:plan-work 0001

→ Reads requirements from DECISIONS.md
→ Asks: "What tech stack are you using?"
→ Asks: "Should I read the context files you listed?"
→ Generates parent tasks based on your answers
→ Waits for your "Go" confirmation
→ Generates detailed sub-tasks
→ Saves implementation plan
```

#### `/cdd:save-session [work-id]`
Captures session progress with validation checks and context stewardship.

**Features:**
- Auto-detects work item from conversation
- Reviews files changed, decisions made, progress
- **Asks validation questions** (assumptions changed? new risks? verification needed?)
- Enforces context quality through feedback loops
- Appends to running log (doesn't create separate files)
- Updates work status if changed
- Suggests next tasks

**Validation Questions (Context Engineering):**
- Did any assumptions change that contradict DECISIONS.md?
- Were new risks or blockers discovered?
- Does anything need verification before continuing?
- Quick sanity check - still solving the original problem?

**Example:**
```
/cdd:save-session 0001

→ Reviews session activity
→ Asks: "Did you discover anything that contradicts DECISIONS.md?"
→ Asks: "Any new risks discovered?"
→ Asks: "Anything need verification before next session?"
→ Appends session entry to SESSION_NOTES.md
→ Updates DECISIONS.md status if changed
→ Suggests next tasks
```

#### `/cdd:complete-work [work-id]`
Validates completion with **evidence requirements** and generates comprehensive summary.

**Features:**
- **Validates with EVIDENCE** - asks for proof of success criteria
- Checks all functional requirements met with validation method
- Analyzes full work history
- **Blocks completion** if evidence missing for must-have criteria
- Generates IMPLEMENTATION_SUMMARY.md with evidence links
- Updates status to "complete"
- Suggests follow-up work

**Evidence Requirements (Context Engineering):**
- Test results (unit, integration, e2e)
- Screenshots or demo links
- Manual testing checklists
- Performance metrics
- Deployed URLs

**Example:**
```
/cdd:complete-work 0001

→ Checks success criteria
→ Asks: "Can you provide evidence for 'Users can log in'?"
→ User: "Unit tests passing, screenshot in /evidence folder"
→ Validates all requirements have evidence
→ ⚠️ Blocks if evidence gaps found
→ Generates summary with evidence links
→ Marks as complete
→ Suggests related work
```

#### `/cdd:list-work [filters]`
Lists all work items with optional filtering.

**Features:**
- View all work items in table format
- Filter by status, type, or priority
- Show summary statistics
- Suggest actions based on state

**Example:**
```
/cdd:list-work --status=in-progress --priority=high

→ Shows filtered table
→ Displays statistics
→ Suggests next actions
```

## 🎯 Typical Workflow

### Starting New Work

```
1. Create work item
   /cdd:create-work user notification system

2. Answer clarifying questions
   → Problem, solution, requirements, etc.

3. Review generated DECISIONS.md
   → Refine if needed

4. Generate implementation plan
   /cdd:plan-work 0001

5. Review tasks and start working!
```

### During Implementation

```
1. Work on tasks from IMPLEMENTATION_PLAN.md

2. After each session, record progress
   /cdd:save-session 0001

3. Continue until all tasks complete

4. Mark as complete
   /cdd:complete-work 0001
```

### Daily Workflow

```
Morning:
  /cdd:list-work --status=in-progress
  → See what's active
  → Continue work

End of Day:
  /cdd:save-session [work-id]
  → Log progress and decisions
  → Clear mind for tomorrow

Weekly:
  /cdd:list-work --dashboard
  → Review overall progress
  → Plan next week's priorities
```

## 📚 Documentation Files Explained

### DECISIONS.md
**Purpose:** Single source of truth for requirements and decisions

**Contains:**
- YAML frontmatter with metadata
- Problem definition
- Solution approach
- Functional requirements (FR-1, FR-2, etc.)
- Technical decisions with rationale
- Success criteria
- Testing requirements

**When to Read:** Before starting work, when making decisions

**When to Update:** When requirements change or new decisions are made

---

### IMPLEMENTATION_PLAN.md
**Purpose:** Step-by-step roadmap for implementation

**Contains:**
- Context from DECISIONS.md
- Files to create/modify
- Phased task breakdown
- Specific file references
- Pattern guidance

**When to Read:** During implementation, to know what to do next

**When to Update:** Usually auto-generated, manual updates if tasks change

---

### SESSION_NOTES.md
**Purpose:** Running log of all work sessions

**Contains:**
- Session-by-session chronological log
- Work completed each session
- Decisions made (with rationale)
- Issues encountered and solutions
- Progress tracking
- Next session priorities

**When to Read:** Before starting new session, to recall context

**When to Update:** After each work session (via `/cdd:save-session`)

---

### IMPLEMENTATION_SUMMARY.md
**Purpose:** Post-completion retrospective and reference

**Contains:**
- Overview of what was built
- All requirements fulfilled
- Key decisions recap
- Challenges and solutions
- Testing summary
- Deployment information
- Retrospective (what worked, what didn't)
- Related/follow-up work

**When to Read:** After completion, or when understanding past work

**When to Update:** Auto-generated by `/cdd:complete-work`, rarely updated after

## 🎨 Work Item Types

### Features 🎨
**Use for:** New features or enhancements

**Location:** `cdd/XXXX-feature-name/`

**Focus:**
- User value and business need
- UI/UX requirements
- User stories and flows
- Acceptance criteria

**Example:** User authentication, dark mode toggle, profile management

---

### Bugs 🐛
**Use for:** Bug fixes and issue resolution

**Location:** `cdd/bugs/XXXX-bug-name/`

**Focus:**
- Bug description and reproduction
- Root cause analysis
- Fix requirements
- Regression testing

**Example:** Login timeout, broken image upload, memory leak

---

### Refactors 🔧
**Use for:** Code improvements and technical debt

**Location:** `cdd/refactor/XXXX-refactor-name/`

**Focus:**
- Current pain points
- Code quality improvements
- Performance optimization
- Maintainability

**Example:** Database query optimization, component restructuring

---

### Spikes 🔬
**Use for:** Research, exploration, proof-of-concept

**Location:** `cdd/spikes/XXXX-spike-name/`

**Focus:**
- Research questions
- Options to evaluate
- Deliverables (report, POC, decision)
- Time-boxing

**Example:** GraphQL vs REST evaluation, new framework assessment

---

### Epics 🎯
**Use for:** Large initiatives spanning multiple features

**Location:** `cdd/epics/XXXX-epic-name/`

**Focus:**
- Overall vision
- Sub-features breakdown
- Timeline and milestones
- Strategic alignment

**Example:** V2 platform redesign, mobile app launch

## ✨ Key Benefits

> **Note on Evidence:** CDD is actively collecting metrics to validate these benefits. See FAQ below and `cdd/.meta/metrics/README.md` for latest data. Claims below reflect design intent and early observations from solo developer usage.

### For Solo Developers

✅ **Never forget context** - 💭 *Hypothesis:* Pick up where you left off months later (being measured: context recovery time)
✅ **Clear direction** - ✅ *Validated:* Implementation plans provide clear next steps (observed in practice)
✅ **Auto-track progress** - ✅ *Validated:* AI detects file changes and marks tasks complete (~50% less manual tracking)
✅ **Learning trail** - 💭 *Hypothesis:* Build institutional knowledge over time (requires longitudinal study)
✅ **Better AI help** - ✅ *Validated:* Structured context improves AI responses (observed qualitatively)

### For Small Teams (2-5 people)

⚠️ **Limited team testing** - Designed for solo use, but shows promise for small collaborative teams

**What works:**
✅ **Knowledge sharing** - DECISIONS.md provides clear context for all team members
✅ **Async handoffs** - SESSION_NOTES enables seamless work continuation across team members
✅ **Onboarding** - New developers can read work items to understand project history and decisions
✅ **Code review context** - Reviewers understand the "why" behind changes

**What's missing:**
⚠️ **Assignment tracking** - No built-in "who's working on what" system
⚠️ **Approval workflows** - No formal review/approval process for work completion
⚠️ **Multi-user tooling** - Basic Git merge conflicts may occur on simultaneous edits
⚠️ **Team communication** - No integrated discussion or comment system

**Recommendation for teams:**
💡 Pair CDD with informal coordination (Slack/Discord + Git) and establish team conventions for work assignment and handoffs

### For AI Assistants

✅ **Persistent context** - ✅ *Validated:* Files persist across sessions (core feature)
✅ **Pattern awareness** - ✅ *Validated:* Context files enable pattern reference (observed in /cdd:plan-work)
✅ **Relevant suggestions** - 💭 *Hypothesis:* AI provides contextually appropriate help (subjective)
✅ **Continuity** - ✅ *Validated:* SESSION_NOTES enables session continuity (observed in practice)

## 🌟 Why CDD?

### The Problem
- Context is lost between sessions
- Requirements scattered across chat history
- AI assistants restart from zero each time
- Decisions fade from memory
- Hard to resume work after breaks

### The Solution
CDD treats documentation as infrastructure. Every piece of work has:
- **Clear requirements** - What needs to be built and why
- **Implementation roadmap** - Step-by-step tasks
- **Progress history** - Session-by-session narrative
- **Decision record** - Why choices were made

### The Result
- **For You:** Never lose your place, resume instantly
- **For AI:** Perfect context every session
- **For Teams:** Easy onboarding, knowledge preservation
- **For Future:** Clear history of what was built and why

## 🔍 Finding Work Items

### By List Command
```bash
/cdd:list-work                      # All work items
/cdd:list-work --status=draft       # Only drafts
/cdd:list-work --type=bug           # Only bugs
/cdd:list-work --priority=high      # Only high priority
```

### By Folder
```bash
ls cdd/                         # List features
ls cdd/bugs/                    # List bugs
ls cdd/refactor/                # List refactors
```

### By Search
```bash
grep -r "authentication" cdd/   # Find work mentioning "authentication"
```

## 💡 Best Practices

### When Creating Work

1. **Be specific in descriptions** - "User auth with OAuth" not "auth"
2. **Answer questions thoughtfully** - AI generates better docs with good input
3. **Review generated docs** - Refine DECISIONS.md before planning
4. **List context files** - Help AI understand your codebase

### During Implementation

1. **Follow the plan** - Trust the implementation plan phases
2. **Save sessions regularly** - Don't wait until work is complete
3. **Document decisions** - Especially ones that aren't obvious
4. **Update blockers** - Flag issues as they come up

### When Completing Work

1. **Verify requirements** - Ensure all FR-X are actually met
2. **Review sessions** - SESSION_NOTES.md should tell the story
3. **Create follow-up work** - Don't lose deferred items
4. **Celebrate!** - Completion is an achievement 🎉

## 🛠️ Customization

### Templates

Customize templates in `cdd/.meta/templates/`:
- `DECISIONS_TEMPLATE.md` - Requirements structure
- `IMPLEMENTATION_PLAN_TEMPLATE.md` - Task format
- `SESSION_NOTES_TEMPLATE.md` - Session entry format
- `IMPLEMENTATION_SUMMARY_TEMPLATE.md` - Summary structure

### Commands

Customize slash commands in `.claude/commands/`:
- Edit frontmatter configuration (paths, defaults)
- Adjust question templates
- Modify output formats

## 📖 Learning More

- **Full Guide:** `cdd/.meta/README.md` - Complete CDD methodology
- **Quick Reference:** `cdd/.meta/QUICK_REFERENCE.md` - Command cheat sheet
- **Examples:** `cdd/.meta/examples/` - Sample work items
- **Learning Path:** `/learning/context-driven-development/` - CDD tutorials

## 📊 Metrics & Evidence Tracking

CDD includes an automated metrics system to quantify productivity impact and keep efficiency claims evidence-based.

### What Gets Tracked

**Session Metrics:**
- **Context reacquisition time** - Minutes spent recreating context at session start
- **Session duration** - Total work session length
- **Task completion rate** - Completed vs. planned tasks
- **Evidence items** - Artefacts attached per requirement (tests, screenshots, deployments)

### How It Works

1. **Capture** - `/cdd:save-session` updates frontmatter in `DECISIONS.md` with session data
2. **Aggregate** - Script automatically runs to generate `metrics-summary.json` from all work items
3. **Display** - `/cdd:list-work` and CLI tools read pre-calculated statistics

### Files & Scripts

- **`cdd/.meta/metrics/README.md`** - Full methodology and data templates
- **`cdd/.meta/metrics/scripts/collect-metrics.js`** - Aggregates metrics from all work items
- **`cdd/.meta/metrics-summary.json`** - Auto-generated dashboard data

### AI Automation

The AI assistant automatically runs metrics collection after each `/cdd:save-session` to keep dashboards current.

### Current Findings

See `cdd/.meta/metrics/README.md` for latest data. All productivity claims in this README are flagged as either validated through measurement or pending instrumentation.

## 🤝 Philosophy

CDD is built on several core principles:

1. **Context is Precious** - Don't let knowledge evaporate
2. **Documentation is Infrastructure** - Treat it like code
3. **AI Amplifies Good Practices** - AI makes good engineering easier
4. **Knowledge Should Compound** - Each project makes the next easier
5. **Future You is a Teammate** - Write for them

## ❓ FAQs

**Q: Won't this slow me down?**

A: Instrumentation is underway to answer that with real data. Early pilots suggest the up-front planning time is small compared to the context reacquisition we log in `cdd/.meta/metrics/README.md`. Check that file for the latest measurements before quoting specific numbers.

**Q: What if I'm working on a small feature?**

A: Scale it down! Use minimal DECISIONS.md (2 paragraphs), quick IMPLEMENTATION_PLAN.md (5-10 tasks), brief SESSION_NOTES.md.

**Q: Do I need all four documents?**

A: DECISIONS.md and SESSION_NOTES.md are essential. IMPLEMENTATION_PLAN.md is highly recommended. IMPLEMENTATION_SUMMARY.md is optional (but valuable).

**Q: Can I customize the structure?**

A: Yes! Edit templates in `cdd/.meta/templates/`. Adjust to your needs.

**Q: What if I forget to save sessions?**

A: Document what you remember when you remember. Better late than never. But real-time is most accurate.

**Q: Can I use this for personal projects?**

A: Absolutely! Solo developers benefit enormously. Your future self will thank you.

## 🚀 Get Started

Ready to try CDD?

1. **Create your first work item:**
   ```
   /cdd:create-work [describe what you want to build]
   ```

2. **Generate a plan:**
   ```
   /cdd:plan-work [work-id]
   ```

3. **Start working and tracking:**
   ```
   [implement]
   /cdd:save-session [work-id]
   ```

4. **Complete and celebrate:**
   ```
   /cdd:complete-work [work-id]
   ```

That's it! You're now doing Context-Driven Development.

---

## 📜 About

**Status:** Pre-release (active development)
**Maintained by:** EMB (Ezequiel M. Benitez) @emb715
**License:** MIT
**Built with:** Claude Code

**Latest Updates (November 2024):**
- Template mode system (solo-dev, minimal, comprehensive)
- Simplified workflow (3 states instead of 4)
- Optional metrics scripts (zero dependencies for basic usage)
- Command namespace consolidation

### What This Is

This is my personal implementation and synthesis of context engineering principles for AI-assisted development. It's an opinionated workflow that combines existing methodologies and adapts them for solo developers and small collaborative teams working with AI assistants like Claude.

I built this to solve my own context management problems, drawing heavily from established practices in software engineering, knowledge management, and emerging AI collaboration patterns.

### Inspiration & Resources

This methodology stands on the shoulders of giants. Key influences and resources:

**Context Engineering & AI Collaboration:**
- [Anthropic: Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) - Core principles for structuring context
- [Anthropic's 4Ds Framework](https://docs.anthropic.com/) - Decide, Describe, Delegate, Document
- [davidkimai/Context-Engineering](https://github.com/davidkimai/Context-Engineering) - Practical context engineering patterns

**Structured Specification Approaches:**
- [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) - Specification-driven development
- [github/spec-kit](https://github.com/github/spec-kit) - GitHub's specification toolkit
- [snarktank/ai-dev-tasks](https://github.com/snarktank/ai-dev-tasks) - AI-friendly task breakdowns

**Foundational Concepts:**
- **Architecture Decision Records (ADRs)** - Documenting technical decisions with context
- **Documentation-as-Code** - Treating documentation as a first-class artifact
- **Context as Infrastructure** - Making context persistent and queryable
- **Engineering RFCs** - Structured proposal and decision-making processes
- **Knowledge Management Systems** - Zettelkasten, personal wikis, second brain concepts

**Personal Experience:**
- Real-world frustrations with context loss in professional work
- Trial and error with various AI collaboration patterns
- Lessons from managing complex projects across multiple sessions
- Community discussions, YouTube tutorials, and various blog posts on AI-assisted development

### Contributing

This is a work in progress! Contributions, feedback, and suggestions are welcome:
- Share your own workflows and adaptations
- Improve templates and documentation
- Report issues or rough edges
- Create examples from your projects
- Suggest new patterns or optimizations

### License

MIT License - see [LICENSE](LICENSE) file for full terms.

Feel free to use, modify, and adapt this for your own needs.

---

**Questions or feedback?** Open a new discussion or reach out to @emb715
