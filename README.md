# Context-Driven Development (CDD) v1.0 by EMB

> Simplified, developer-friendly context infrastructure for AI-assisted development

**Author:** EMB (Ezequiel M. Benitez) @emb715
**Version:** 1.0
**Release Date:** October 29, 2025
**License:** MIT

## 🎓 What is CDD?

Context-Driven Development is a methodology where **structured, persistent documentation serves as the foundation for development**—not an afterthought. It treats context as infrastructure, enabling both humans and AI to work effectively across sessions and time.

**Core Principle:** Externalize context into documents that create a single source of truth for requirements, decisions, and progress.

## 🚀 Quick Start

### 1. Create a Work Item
```bash
/create-work user authentication system
```

This creates a self-contained folder with all documentation:
```
cdd/0001-user-authentication-system/
├── DECISIONS.md              # Requirements & decisions
├── IMPLEMENTATION_PLAN.md    # Tasks & roadmap
└── SESSION_NOTES.md          # Session tracking log
```

### 2. Generate Implementation Plan
```bash
/plan-work 0001
```

Analyzes your codebase and generates actionable tasks based on your project's patterns.

### 3. Work & Track Progress
```bash
# After each work session
/save-session 0001
```

Appends session notes to track progress, decisions, and learnings.

### 4. Complete Work
```bash
/complete-work 0001
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
│       ├── QUICK_REFERENCE.md              # Command cheat sheet
│       └── templates/                      # Document templates
│           ├── DECISIONS_TEMPLATE.md
│           ├── IMPLEMENTATION_PLAN_TEMPLATE.md
│           ├── SESSION_NOTES_TEMPLATE.md
│           └── IMPLEMENTATION_SUMMARY_TEMPLATE.md
│
└── .claude/
    └── commands/                           # Slash commands
        ├── create-work.md                  # /create-work
        ├── plan-work.md                    # /plan-work
        ├── save-session.md                 # /save-session
        ├── complete-work.md                # /complete-work
        └── list-work.md                    # /list-work
```

## 📋 Available Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `/create-work` | Create new work item with full documentation | `/create-work user profile management` |
| `/plan-work` | Generate implementation plan from decisions | `/plan-work 0001` |
| `/save-session` | Save session progress and decisions | `/save-session 0001` |
| `/complete-work` | Mark work complete and generate summary | `/complete-work 0001` |
| `/list-work` | View all work items with filtering | `/list-work --status=in-progress` |

### Command Details

#### `/create-work [description]`
Creates a new work item with complete folder structure.

**Features:**
- Interactive questions to gather requirements
- Supports Features, Bugs, Refactors, Spikes, and Epics
- Auto-increments work IDs
- Generates initial documentation from templates

**Example:**
```
/create-work user authentication with OAuth

→ Asks clarifying questions
→ Creates cdd/0001-user-authentication-with-oauth/
→ Populates DECISIONS.md with requirements
→ Ready for /plan-work
```

#### `/plan-work [work-id]`
Generates detailed implementation plan by analyzing codebase.

**Features:**
- Reads DECISIONS.md requirements
- Analyzes context files from your project
- Generates parent tasks → waits for approval → generates sub-tasks
- References existing patterns and files
- Saves to IMPLEMENTATION_PLAN.md

**Example:**
```
/plan-work 0001

→ Analyzes requirements
→ Reviews codebase patterns
→ Generates 6 phases with 42 tasks
→ Saves implementation plan
```

#### `/save-session [work-id]`
Appends session notes to SESSION_NOTES.md.

**Features:**
- Auto-detects work item from conversation
- Analyzes files changed, decisions made, progress
- Appends to running log (doesn't create separate files)
- Updates work status if changed
- Suggests next tasks

**Example:**
```
/save-session 0001

→ Analyzes session activity
→ Appends to SESSION_NOTES.md
→ Updates DECISIONS.md status
→ Suggests next steps
```

#### `/complete-work [work-id]`
Marks work as complete and generates comprehensive summary.

**Features:**
- Validates all requirements met
- Analyzes full work history
- Generates IMPLEMENTATION_SUMMARY.md
- Updates status to "complete"
- Suggests follow-up work

**Example:**
```
/complete-work 0001

→ Validates completion
→ Generates summary from all sessions
→ Marks as complete
→ Suggests related work
```

#### `/list-work [filters]`
Lists all work items with optional filtering.

**Features:**
- View all work items in table format
- Filter by status, type, or priority
- Show summary statistics
- Suggest actions based on state

**Example:**
```
/list-work --status=in-progress --priority=high

→ Shows filtered table
→ Displays statistics
→ Suggests next actions
```

## 🎯 Typical Workflow

### Starting New Work

```
1. Create work item
   /create-work user notification system

2. Answer clarifying questions
   → Problem, solution, requirements, etc.

3. Review generated DECISIONS.md
   → Refine if needed

4. Generate implementation plan
   /plan-work 0001

5. Review tasks and start working!
```

### During Implementation

```
1. Work on tasks from IMPLEMENTATION_PLAN.md

2. After each session, record progress
   /save-session 0001

3. Continue until all tasks complete

4. Mark as complete
   /complete-work 0001
```

### Daily Workflow

```
Morning:
  /list-work --status=in-progress
  → See what's active
  → Continue work

End of Day:
  /save-session [work-id]
  → Log progress and decisions
  → Clear mind for tomorrow

Weekly:
  /list-work --dashboard
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

**When to Update:** After each work session (via `/save-session`)

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

**When to Update:** Auto-generated by `/complete-work`, rarely updated after

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

### For Solo Developers

✅ **Never forget context** - Pick up where you left off months later
✅ **Clear direction** - Know exactly what to work on next
✅ **Learning trail** - Build institutional knowledge over time
✅ **Better AI help** - AI understands your project deeply

### For Teams

✅ **Onboarding** - New developers get up to speed quickly
✅ **Knowledge preservation** - No tribal knowledge loss
✅ **Context switching** - Anyone can pick up any work item
✅ **Code review** - Reviewers understand the "why"

### For AI Assistants

✅ **Persistent context** - AI remembers across all sessions
✅ **Pattern awareness** - AI follows your project's conventions
✅ **Relevant suggestions** - AI provides contextually appropriate help
✅ **Continuity** - AI picks up where last session ended

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
/list-work                      # All work items
/list-work --status=draft       # Only drafts
/list-work --type=bug           # Only bugs
/list-work --priority=high      # Only high priority
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

## 🤝 Philosophy

CDD is built on several core principles:

1. **Context is Precious** - Don't let knowledge evaporate
2. **Documentation is Infrastructure** - Treat it like code
3. **AI Amplifies Good Practices** - AI makes good engineering easier
4. **Knowledge Should Compound** - Each project makes the next easier
5. **Future You is a Teammate** - Write for them

## ❓ FAQs

**Q: Won't this slow me down?**

A: No. You spend 15 minutes upfront (create + plan) and save 30+ minutes every session from not losing context.

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
   /create-work [describe what you want to build]
   ```

2. **Generate a plan:**
   ```
   /plan-work [work-id]
   ```

3. **Start working and tracking:**
   ```
   [implement]
   /save-session [work-id]
   ```

4. **Complete and celebrate:**
   ```
   /complete-work [work-id]
   ```

That's it! You're now doing Context-Driven Development.

---

## 📜 About

**CDD Version:** 1.0
**Release Date:** October 29, 2025
**Author:** EMB (Ezequiel M. Benitez) @emb715
**License:** MIT
**Built with:** Claude Code

### Contributing

CDD is open source! Contributions, feedback, and suggestions are welcome.
- Share your workflows
- Improve templates
- Report issues
- Create examples

### License

MIT License - see LICENSE file

Copyright (c) 2025 Ezequiel M. Benitez (EMB)

### Acknowledgments

Built with Claude Code and inspired by the need for better context management in AI-assisted development.

---

**Questions or feedback?** Open an issue or reach out to @emb715
