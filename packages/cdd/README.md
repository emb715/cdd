# CDD Methodology

> Context-Driven Development (CDD) methodology template with Claude commands

## Overview

This package provides a shareable template for initializing Context-Driven Development (CDD) workflow in your projects. It includes:

- **CDD folder structure** - Example work items and metadata organization
- **Claude commands** - Slash commands for AI-assisted development workflow

Looking for the **why** behind these artefacts? See the methodology overview in [What is CDD](../../README.md#what-is-cdd) and the full set of influences in [Inspiration & Resources](../../README.md#inspiration--resources).

## What's Included

### 📁 CDD Folder Structure

The `cdd/` folder contains:
- `.meta/` - Methodology metadata and templates
- Work item folders (e.g., `0001-phase-02-metrics-dashboard/`)
- Example of how to organize context-driven work

### 🤖 Claude Commands

The `.claude/commands/` folder includes:
- `cdd:create-work.md` → `/cdd:create-work` - Create new work items
- `cdd:plan-work.md` → `/cdd:plan-work` - Generate implementation plans from decisions
- `cdd:save-session.md` → `/cdd:save-session` - Document session progress
- `cdd:complete-work.md` → `/cdd:complete-work` - Mark work items complete with summaries
- `cdd:list-work.md` → `/cdd:list-work` - List and filter work items

### 📊 Metrics System

The `.meta/metrics/` folder provides automated productivity tracking:

**Purpose:** Quantify the impact of CDD on session efficiency and track evidence-based development metrics.

**What's Tracked:**
- Context reacquisition time (minutes spent recreating context at session start)
- Session duration (total work session length)
- Task completion rate (completed vs. planned tasks)
- Evidence items (artefacts attached per requirement)

**How It Works:**

1. **Session saves capture metrics** - When you run `/cdd:save-session`, frontmatter in `DECISIONS.md` is automatically updated with session data
2. **Scripts aggregate data** - Run `node cdd/.meta/metrics/scripts/collect-metrics.js` to generate summaries from all work items
3. **Dashboards consume summaries** - The `/cdd:list-work` command and CLI tools read from `metrics-summary.json` for accurate, pre-calculated statistics

**Files:**
- `metrics/README.md` - Full methodology, data templates, and automation guide
- `metrics/AI_AUTOMATION_GUIDE.md` - When AI should run metrics scripts
- `metrics/WORKFLOW_EXAMPLE.md` - Step-by-step example of metrics capture
- `metrics/scripts/collect-metrics.js` - Aggregates metrics from all work items
- `metrics/scripts/lib/frontmatter.js` - Programmatic frontmatter management
- `metrics-summary.json` - Auto-generated dashboard data (empty skeleton in template)

**AI Automation:**
The AI assistant automatically runs metrics collection after each `/cdd:save-session` to keep dashboards up-to-date.

**Evidence-Based Claims:**
CDD tracks real productivity data so efficiency claims stay grounded in measurement rather than assumptions. See `metrics/README.md` for current findings.

## Usage

### Option 1: Automated Installation (Recommended)

Use the installer package to automatically copy the template files:

```bash
npx @cdd/installer
```

This will:
- Copy the `cdd/` folder structure to your project
- Copy the `.claude/` commands (with confirmation if it already exists)
- Set up the CDD methodology in your current directory

### Option 2: Manual Copy

Copy the template files manually from this repository:

```bash
# From the context-as-infra repository root
cp -r packages/cdd/cdd ./cdd
cp -r packages/cdd/.claude ./

# Or if you've cloned just the template folder
cp -r cdd/cdd ./cdd
cp -r cdd/.claude ./
```

### After Installation

1. **Initialize your first work item**:
   - Use `/cdd:create-work` or manually create folders following the pattern
   - Follow the CDD workflow documented in the main README

2. **Customize for your needs**:
   - Adjust the `.meta/` templates
   - Modify Claude commands as needed
   - Add project-specific workflows

### With AI Assistants

When asking an AI to initialize CDD in your project, you can say:

```
Install the CDD methodology template using npx @cdd/installer
```

Or for manual installation:

```
Copy the CDD template from packages/cdd/ to set up
the workflow with cdd/ folder and .claude/commands/
```

## Directory Structure

```
cdd/
├── cdd/                                # Work items and metadata
│   ├── .meta/                         # Methodology templates and system files
│   │   ├── metrics/                   # Metrics system
│   │   │   ├── README.md             # Full metrics methodology
│   │   │   ├── AI_AUTOMATION_GUIDE.md # When AI runs metrics scripts
│   │   │   ├── WORKFLOW_EXAMPLE.md    # Step-by-step metrics example
│   │   │   └── scripts/              # Automation scripts
│   │   │       ├── collect-metrics.js
│   │   │       ├── lib/frontmatter.js
│   │   │       └── README.md
│   │   ├── metrics-summary.json       # Auto-generated metrics dashboard
│   │   └── templates/                 # Document templates
│   └── NNNN-work-item/                # Example work items
└── .claude/                           # Claude commands
    └── commands/                      # Slash commands
        ├── cdd:create-work.md
        ├── cdd:plan-work.md
        ├── cdd:save-session.md
        ├── cdd:complete-work.md
        └── cdd:list-work.md
```

---

## 🔌 Optional Extensions

CDD can be enhanced with optional extensions:

### CDD-RAG: Searchable Knowledge Base

Transform your CDD workspace into a searchable knowledge base with semantic search.

**Features:**
- 🔍 Semantic search across all work items
- 🤖 AI-powered answers from your documentation (optional)
- 📚 Discover similar solutions from past work
- 💰 Cost-effective (~$0.0006/query with AI)
- 🔒 Privacy-first (local indexing, optional cloud AI)

**Install:**
```bash
npx @emb715/cdd add rag
```

**Learn more:** [packages/cdd-rag/README.md](../cdd-rag/README.md)

---

## Integration

This template is designed to work with:
- **@cdd/installer** - Automated installation tool
- **@cdd/cli** - CLI tools for managing CDD work items
- Claude Code / Claude Desktop
- Any AI assistant that supports custom commands

## Learn More

- [Main CDD Documentation](../../README.md)
- [CDD CLI Tools](../cli/README.md)
- [CDD Installer](../cdd-installer/README.md)

## License

MIT
