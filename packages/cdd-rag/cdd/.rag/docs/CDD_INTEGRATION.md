# RAG-CDD Integration Guide

> **Complete guide to integrating RAG with Context-Driven Development**

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Integration Levels](#integration-levels)
3. [Command-by-Command Integration](#command-by-command-integration)
4. [Smart Auto-Enhancement](#smart-auto-enhancement)
5. [Configuration](#configuration)
6. [Common Workflows](#common-workflows)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Install RAG-CDD (5 minutes)

```bash
# 1. Navigate to RAG-CDD
cd path/to/project/cdd/.rag

# 2. Install dependencies
pip install -r requirements.txt

# 3. Index your CDD workspace
python poc.py index

# 4. Test it!
python poc.py search "authentication"
```

### Try Your First RAG Query

```bash
# Search for past decisions
python poc.py search "how did we handle database migrations"

# Ask AI (requires OPENAI_API_KEY)
python poc.py ask "What patterns do we use for error handling?"

# View stats
python poc.py stats
```

**That's it!** RAG is now working with your CDD workspace.

---

## Integration Levels

Choose the level that fits your workflow:

### Level 1: Manual (Basic)

**What**: You manually run RAG queries when needed

**How**:
```bash
# During work, manually search
python poc.py search "relevant topic"

# Copy results and use in your workflow
/cdd:plan-work 0001
# [You paste RAG results into conversation]
```

**Pros**: Simple, full control, no setup
**Cons**: Manual step, easy to forget

**Best for**: Trying RAG, occasional use

---

### Level 2: Slash Command (Semi-Automated)

**What**: Use `/cdd:query-rag` command directly in CDD workflow

**How**:
```bash
# New slash command available
/cdd:query-rag "how did we implement auth?"

# Returns formatted results automatically
# AI can use these results in responses
```

**Pros**: Integrated into workflow, formatted nicely
**Cons**: Still manual invocation

**Best for**: Regular use, team collaboration

**Setup**: See [/cdd:query-rag Command](#cddquery-rag-command) below

---

### Level 3: Smart Auto-Enhancement (Recommended)

**What**: RAG automatically enhances AI responses when relevant

**How**:
```bash
# Just use CDD commands normally
/cdd:plan-work 0005

# AI automatically:
# 1. Detects this is a planning task
# 2. Searches for similar work
# 3. Injects relevant context
# 4. References past decisions naturally
```

**Pros**: Zero extra effort, always has context
**Cons**: Requires setup, slight latency

**Best for**: Power users, teams with many work items

**Setup**: See [Smart Auto-Enhancement](#smart-auto-enhancement) below

---

### Level 4: Fully Automated

**What**: Complete automation - indexing, searching, enhancing

**How**:
- Auto-index when completing work items
- Auto-enhance all relevant commands
- Auto-suggest similar work items
- Auto-detect patterns and inconsistencies

**Pros**: Maximum benefit, zero manual work
**Cons**: Most complex setup

**Best for**: Mature CDD projects, large teams

**Setup**: See [Full Automation Setup](#full-automation-setup) below

---

## Command-by-Command Integration

### `/cdd:query-rag` (New Command)

**Purpose**: Direct RAG queries from CDD workflow

#### Basic Usage

```bash
# Simple search
/cdd:query-rag "authentication patterns"

# With filters
/cdd:query-rag "database migrations" --type feature --status completed

# Get AI answer
/cdd:query-rag "How should I handle errors?" --ai

# Limit results
/cdd:query-rag "testing strategies" --limit 10
```

#### Expected Output

```
📊 RAG Query: "authentication patterns"

Found 8 results:

1. cdd/0001-user-auth/DECISIONS.md (score: 0.94)
   Work ID: 0001 | Type: feature | Status: completed

   Technical Decision: JWT Authentication

   We chose JWT-based authentication for its stateless
   architecture and scalability across microservices...

   [Read more: cdd/0001-user-auth/DECISIONS.md]

2. cdd/0005-api-security/DECISIONS.md (score: 0.87)
   Work ID: 0005 | Type: feature | Status: completed

   Authentication Middleware

   Implemented centralized auth middleware that validates
   JWT tokens on all protected routes...

   [Read more: cdd/0005-api-security/DECISIONS.md]

...

💡 Tip: Use results to inform your current work item
```

#### With AI Answer

```bash
/cdd:query-rag "How did we implement authentication?" --ai
```

```
📊 RAG Query: "How did we implement authentication?"

🤖 AI Answer (GPT-4o-mini):

Based on your CDD documentation, you implemented authentication using:

1. **JWT Tokens** (Work Item 0001)
   - Stateless authentication
   - 24-hour token expiration
   - Refresh tokens in Redis

2. **Middleware Protection** (Work Item 0005)
   - Centralized validation
   - Automatic user attachment to requests
   - Error handling for invalid tokens

3. **Security Measures** (Work Item 0001, TD-3)
   - HS256 signing algorithm
   - Secret rotation capability
   - Rate limiting on auth endpoints

Sources:
- cdd/0001-user-auth/DECISIONS.md (TD-1, TD-3)
- cdd/0005-api-security/SESSION_NOTES.md

📊 Cost: $0.0006
```

#### Command Specification

For full spec, see `../../.claude/commands/cdd:query-rag.md`

---

### `/cdd:create-work` (Enhanced)

**Enhancement**: Find similar work before creating new item

#### How It Works

```bash
/cdd:create-work user profile management
```

**Behind the scenes**:
1. RAG searches for "user profile management"
2. Finds similar work items
3. AI presents options

**AI Response**:
```
I found similar work items in your CDD workspace:

📋 Similar Work:
1. cdd/0002-user-settings (score: 0.89)
   - Implemented user preferences storage
   - Similar scope to profile management

2. cdd/0007-account-management (score: 0.82)
   - Account update functionality
   - May have reusable patterns

Would you like to:
A) Create new work item (unique requirements)
B) Review similar items first
C) Extend existing item (0002 or 0007)

Please respond with A, B, or C.
```

#### Benefits
- Avoid duplicate work
- Discover reusable patterns
- Reference existing decisions
- Maintain consistency

#### Configuration

```bash
# .env
RAG_ENHANCE_CREATE_WORK=true        # Enable enhancement
RAG_SIMILARITY_THRESHOLD=0.75       # Min similarity to show
RAG_MAX_SIMILAR_ITEMS=3             # How many to show
```

---

### `/cdd:plan-work` (Enhanced)

**Enhancement**: Auto-inject relevant context from past work

#### How It Works

```bash
/cdd:plan-work 0005
```

**Behind the scenes**:
1. AI reads DECISIONS.md for work item 0005
2. Extracts key concepts (e.g., "API endpoints", "authentication")
3. RAG searches for similar implementations
4. AI injects relevant context into planning

**AI Response** (with RAG context):
```
I'll help create an implementation plan for work item 0005.

📚 Relevant Context from Past Work:

Based on similar work items, I found these patterns:

**From work item 0002 (API Endpoints)**:
- Used Express router pattern
- Middleware for validation
- Response formatting utility

**From work item 0003 (Auth Integration)**:
- JWT middleware on protected routes
- Error handling with custom classes
- Request logging

I'll use these proven approaches in the plan.

Now, before I create the plan, let me understand your codebase:

1. **Tech Stack:** You're using Express.js, right?
...
```

#### Benefits
- Leverage proven patterns automatically
- Reduce planning questions (AI already has context)
- Ensure consistency with past work
- Reference specific decisions with citations

#### Configuration

```bash
# .env
RAG_ENHANCE_PLAN_WORK=true          # Enable enhancement
RAG_PLAN_CONTEXT_CHUNKS=5           # How many past chunks to inject
RAG_PLAN_MIN_SCORE=0.7              # Min relevance score
RAG_PLAN_AUTO_CITE=true             # Auto-add source citations
```

---

### `/cdd:complete-work` (Enhanced)

**Enhancement**: Auto-index completed work into RAG

#### How It Works

```bash
/cdd:complete-work 0005
```

**Behind the scenes**:
1. AI generates IMPLEMENTATION_SUMMARY.md as usual
2. After successful completion:
   ```bash
   # Auto-runs:
   python poc.py index --work-id 0005
   ```
3. New work immediately searchable

**AI Response**:
```
✅ Work item 0005 marked as complete!

📄 Files Created:
  ✓ IMPLEMENTATION_SUMMARY.md

📊 Summary:
  • Completed in 3 sessions
  • All success criteria met
  • 12 unit tests added
  • API endpoints fully documented

🔍 RAG Update:
  ✓ Work item indexed
  ✓ 8 new chunks added to knowledge base
  ✓ Now searchable via /cdd:query-rag

Next Steps:
  • Review IMPLEMENTATION_SUMMARY.md
  • Close related issues
  • Plan follow-up work if needed
```

#### Benefits
- Zero-effort knowledge capture
- Immediate searchability
- Automatic knowledge base growth
- No manual indexing needed

#### Configuration

```bash
# .env
RAG_AUTO_INDEX_ON_COMPLETE=true     # Enable auto-indexing
RAG_INDEX_SUMMARY_ONLY=false        # Index all docs, not just summary
RAG_INDEX_ASYNC=true                # Don't block completion
```

---

### `/cdd:save-session` (Optional Enhancement)

**Enhancement**: Optionally search for related sessions

#### How It Works

```bash
/cdd:save-session 0005
```

**Optional behavior**:
```
💡 Related Sessions:

I found similar debugging sessions:

1. Work Item 0003, Session 4 (score: 0.85)
   - Similar database timeout issue
   - Resolved by connection pooling

Would you like to reference this in session notes? (y/n)
```

#### Configuration

```bash
# .env
RAG_ENHANCE_SAVE_SESSION=false      # Disabled by default (optional)
```

---

## Smart Auto-Enhancement

### How It Works

RAG automatically enhances AI responses when it detects relevant context is needed.

### Enhancement Logic

#### When to Enhance (Adaptive)

```python
# Pseudo-code for when RAG auto-enhances
def should_enhance(command, context):
    if command == "cdd:plan-work":
        return True  # Always helpful during planning

    elif command == "cdd:create-work":
        return True  # Avoid duplicates

    elif "how did we" in user_question.lower():
        return True  # User asking about past

    elif "what patterns" in user_question.lower():
        return True  # User wants patterns

    elif command == "cdd:save-session":
        return False  # Not helpful during logging

    elif is_simple_edit(context):
        return False  # Don't slow down simple edits

    else:
        return False  # Default: don't enhance
```

#### What Gets Enhanced

**Context Injection**:
```
# AI's internal prompt becomes:

System: You are a CDD assistant...

Relevant Context from RAG:
---
[Top 3-5 relevant chunks from past work]
---

User: [Original question/command]
```

**Visible to User**:
```
AI: Based on your past work (cdd/0002-api-endpoints), I see you...
```

### Configuration

#### Enable Smart Enhancement

```bash
# .env
RAG_SMART_ENHANCEMENT=true

# Which commands to enhance
RAG_ENHANCE_CREATE_WORK=true
RAG_ENHANCE_PLAN_WORK=true
RAG_ENHANCE_COMPLETE_WORK=true  # Just for indexing
RAG_ENHANCE_SAVE_SESSION=false  # Usually not helpful

# Enhancement parameters
RAG_AUTO_ENHANCE_MIN_SCORE=0.7  # Min similarity
RAG_AUTO_ENHANCE_MAX_CHUNKS=5   # Max context chunks
RAG_AUTO_ENHANCE_CITE_SOURCES=true  # Show sources
```

#### Per-Command Override

```bash
# Disable for specific command
/cdd:plan-work 0005 --no-rag

# Force enable for specific command
/cdd:create-work new-feature --with-rag
```

### Example: Enhanced Planning Session

**Without RAG**:
```
User: /cdd:plan-work 0008

AI: I'll help create an implementation plan.

Before I create the plan, I need to understand your codebase:
1. Tech Stack: What framework are you using?
2. Architecture: What patterns do you follow?
...
[Many questions]
```

**With RAG Smart Enhancement**:
```
User: /cdd:plan-work 0008

AI: I'll help create an implementation plan for work item 0008.

📚 Relevant Context from Past Work:

I found similar work in your codebase:
- Work Item 0002: Used Express.js with MVC pattern
- Work Item 0005: Similar API endpoint structure
- Work Item 0007: Database migration approach

Based on these patterns, I can see you're using:
- Express.js framework
- MVC architecture
- Prisma ORM for database
- Jest for testing

I'll use these proven approaches. Just a few quick questions:

1. Does this work item follow the same patterns as 0002/0005?
2. Any new dependencies or different approach needed?
...
[Fewer, more targeted questions]
```

**Time saved**: ~5-10 minutes per planning session

---

## Configuration

### Complete .env Configuration

```bash
# ============================================================================
# RAG-CDD INTEGRATION CONFIGURATION
# ============================================================================

# ------------------------
# Core RAG Settings
# ------------------------
RAG_MODE=hybrid                      # local, hybrid, or cloud
OPENAI_API_KEY=your_key_here        # For AI answers (OpenAI, Fuelix AI, etc.)
OPENAI_DEFAULT_MODEL=gpt-4o-mini    # Default model

# ------------------------
# Smart Auto-Enhancement
# ------------------------
RAG_SMART_ENHANCEMENT=true           # Master switch

# Per-command enhancement
RAG_ENHANCE_CREATE_WORK=true         # Search for similar work
RAG_ENHANCE_PLAN_WORK=true           # Inject relevant context
RAG_ENHANCE_COMPLETE_WORK=true       # Auto-index completed work
RAG_ENHANCE_SAVE_SESSION=false       # Usually not needed

# Enhancement parameters
RAG_AUTO_ENHANCE_MIN_SCORE=0.7       # Min similarity to inject
RAG_AUTO_ENHANCE_MAX_CHUNKS=5        # Max context chunks
RAG_AUTO_ENHANCE_CITE_SOURCES=true   # Show source references
RAG_AUTO_ENHANCE_VERBOSE=false       # Show what RAG is doing

# ------------------------
# Auto-Indexing
# ------------------------
RAG_AUTO_INDEX_ON_COMPLETE=true      # Index when completing work
RAG_INDEX_SUMMARY_ONLY=false         # Index all docs vs just summary
RAG_INDEX_ASYNC=true                 # Don't block completion
RAG_INDEX_NOTIFY=true                # Notify when indexing complete

# ------------------------
# Query Defaults
# ------------------------
RAG_DEFAULT_RESULTS=5                # Default number of results
RAG_MIN_SIMILARITY=0.3               # Filter low-relevance results
RAG_ENABLE_RERANKING=true            # Re-rank for better relevance

# ------------------------
# Cost Management
# ------------------------
RAG_ENABLE_COST_TRACKING=true        # Track API costs
RAG_COST_WARNING_THRESHOLD=0.01      # Warn if query > $0.01
RAG_MONTHLY_BUDGET=10.00             # Monthly spending limit
RAG_AUTO_SWITCH_TO_CHEAP_MODEL=true  # Use cheaper model if over budget

# ------------------------
# CDD-Specific
# ------------------------
RAG_CDD_WORKSPACE=../../cdd          # Path to CDD workspace
RAG_INDEX_TEMPLATES=false            # Don't index template files
RAG_INDEX_EXAMPLES=false             # Don't index example work items
RAG_PRIORITIZE_COMPLETED=true        # Rank completed work higher
```

### Configuration by Use Case

#### Minimal (Just Search)
```bash
RAG_MODE=local
RAG_SMART_ENHANCEMENT=false
RAG_AUTO_INDEX_ON_COMPLETE=false
# Just manual search, no automation
```

#### Recommended (Balanced)
```bash
RAG_MODE=hybrid
RAG_SMART_ENHANCEMENT=true
RAG_ENHANCE_CREATE_WORK=true
RAG_ENHANCE_PLAN_WORK=true
RAG_AUTO_INDEX_ON_COMPLETE=true
# Smart enhancement + auto-indexing
```

#### Power User (Full Automation)
```bash
RAG_MODE=hybrid
RAG_SMART_ENHANCEMENT=true
RAG_ENHANCE_CREATE_WORK=true
RAG_ENHANCE_PLAN_WORK=true
RAG_ENHANCE_COMPLETE_WORK=true
RAG_AUTO_INDEX_ON_COMPLETE=true
RAG_AUTO_ENHANCE_VERBOSE=true
# Everything enabled, see what's happening
```

---

## Common Workflows

### Workflow 1: Starting New Work

**With RAG Integration**:

```bash
# 1. Check for similar work
/cdd:query-rag "user profile management" --type feature

# 2. Review results, decide to create new work
/cdd:create-work user profile management
# [RAG auto-shows similar items, you confirm new is needed]

# 3. Plan with context
/cdd:plan-work 0009
# [RAG auto-injects patterns from similar work items]

# 4. Implement...

# 5. Complete and auto-index
/cdd:complete-work 0009
# [RAG auto-indexes, immediately searchable]
```

**Time saved**: 10-15 minutes (avoided duplicate investigation, had patterns ready)

---

### Workflow 2: Continuing Existing Work

```bash
# 1. Query for relevant decisions
/cdd:query-rag "work item 0007 database decisions"

# 2. Resume work with context
/cdd:save-session 0007
# Document progress with RAG results referenced
```

---

### Workflow 3: Onboarding New Developer

```bash
# New dev asks: "How do we handle authentication?"
/cdd:query-rag "authentication implementation" --ai

# Get comprehensive answer with citations
# New dev can read referenced work items for details
```

---

### Workflow 4: Debugging Similar Issue

```bash
# Hit a bug: "Database timeout in production"
/cdd:query-rag "database timeout production" --ai

# RAG finds:
# - Work Item 0012: Solved similar timeout with connection pooling
# - Session notes from debugging session with solution

# Apply same fix, document in current work item
```

---

## Full Automation Setup

For complete hands-free RAG integration:

### Step 1: Install Integration Hooks

```bash
# Copy integration hooks
cp examples/integration_hooks.py ~/.config/claude/cdd_rag_hooks.py

# Add to Claude Code config
# (See CONFIGURATION.md for details)
```

### Step 2: Configure Auto-Enhancement

```bash
# .env - Enable everything
RAG_SMART_ENHANCEMENT=true
RAG_ENHANCE_CREATE_WORK=true
RAG_ENHANCE_PLAN_WORK=true
RAG_AUTO_INDEX_ON_COMPLETE=true
```

### Step 3: Test

```bash
# Should work automatically
/cdd:create-work test-feature
# [See RAG enhancement happening]

/cdd:plan-work [new-work-id]
# [See relevant context injected]

/cdd:complete-work [new-work-id]
# [See auto-indexing confirmation]
```

---

## Troubleshooting

### "RAG not finding relevant results"

**Check**:
1. Is workspace indexed? Run `python poc.py stats`
2. Try broader query terms
3. Lower similarity threshold: `RAG_MIN_SIMILARITY=0.2`
4. Re-index: `python poc.py index`

### "Auto-enhancement not working"

**Check**:
1. Is it enabled? `RAG_SMART_ENHANCEMENT=true`
2. Is command-specific flag on? `RAG_ENHANCE_PLAN_WORK=true`
3. Check logs: `RAG_AUTO_ENHANCE_VERBOSE=true`
4. Try manual query first to verify RAG works

### "Auto-indexing failed"

**Check**:
1. Is POC accessible? Try `python poc.py stats`
2. Check permissions on `.chroma_poc` directory
3. Verify work item path is correct
4. Run manually: `python poc.py index --work-id XXXX`

### "Too slow / too expensive"

**Solutions**:
1. Reduce chunks: `RAG_AUTO_ENHANCE_MAX_CHUNKS=3`
2. Use cheaper model: `OPENAI_DEFAULT_MODEL=llama-3-8b`
3. Disable auto-enhancement for some commands
4. Use search-only (no AI): Just use `/cdd:query-rag` without `--ai`

---

## Next Steps

1. **Start Simple**: Level 1 (Manual) or Level 2 (Slash Command)
2. **Test Thoroughly**: Try all commands, see what helps
3. **Gradually Automate**: Add Level 3 (Smart Enhancement) if beneficial
4. **Customize**: Adjust config based on your workflow
5. **Share Feedback**: What works? What doesn't?

**For more**:
- Integration Patterns: See `INTEGRATION_PATTERNS.md`
- Detailed Config: See `CONFIGURATION.md`
- Command Specs: See `SLASH_COMMANDS.md`
- Examples: See `examples/` directory

---

**The RAG-CDD integration makes your CDD workspace a living knowledge base that grows with every work item!** 🚀
