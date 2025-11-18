# CDD-RAG: Retrieval-Augmented Generation for Context-Driven Development

> **Transform your CDD workspace into a searchable knowledge base with AI-powered context retrieval**

**Status:** Pre-release (active development)
**Author:** EMB (Ezequiel M. Benitez) @emb715
**License:** MIT

---

## What is CDD-RAG?

CDD-RAG is a **template-based extension** for Context-Driven Development that adds:

🔍 **Semantic Search** - Find relevant decisions, patterns, and solutions across all work items
🤖 **AI-Powered Answers** - Get contextual answers from your CDD documentation
📚 **Knowledge Discovery** - Discover how similar problems were solved before
🔗 **Smart Integration** - Enhances existing CDD commands with relevant context
💰 **Cost-Effective** - Local indexing + optional cloud AI (~$0.0006/query)
🔒 **Privacy-First** - All data stays local, cloud only for optional AI answers

---

## Quick Overview

### The Problem

Both AI assistants and humans face the same challenge with CDD projects:

- ❌ **Limited Context**: Can't remember every decision made months ago
- ❌ **Manual Search**: Have to grep through files to find relevant patterns
- ❌ **Lost Knowledge**: Valuable decisions buried in completed work items
- ❌ **Inconsistency**: Hard to maintain consistency across many work items

### The Solution

CDD-RAG creates a **living knowledge base** that:

- ✅ Indexes all your CDD documentation automatically
- ✅ Searches semantically (finds meaning, not just keywords)
- ✅ Returns relevant chunks with citations
- ✅ Enhances AI responses with past context
- ✅ Works 100% offline for search (AI answers optional)

---

## Installation

### Prerequisites

- Python 3.9+
- Existing CDD project
- 2GB free disk space

### Step 1: Copy Template to Your Project

```bash
# From your CDD project root
cp -r path/to/packages/rag/cdd/.rag ./cdd/.rag
```

This creates:
```
your-project/
└── cdd/
    └── .rag/              # RAG extension (like .meta)
        ├── core/          # RAG implementation
        ├── hooks/         # CDD integration hooks
        ├── docs/          # Documentation
        ├── config.yaml    # Configuration
        └── requirements.txt
```

### Step 2: Copy Slash Command

```bash
# Copy the /cdd:query command
cp path/to/packages/rag/.claude/commands/cdd:query.md ./.claude/commands/
```

### Step 3: Install Dependencies

```bash
cd cdd/.rag
pip install -r requirements.txt
```

**Installed**:
- `chromadb` - Local vector database
- `sentence-transformers` - Local embeddings
- `openai` - OpenAI-compatible client (works with OpenAI, Fuelix AI, etc.)
- Other utilities

### Step 4: Configure (Optional)

```bash
# Copy example config
cp .env.example .env

# Edit if using AI features
nano .env
# Add: OPENAI_API_KEY=your_key_here
```

### Step 5: Initial Index

```bash
# Index your CDD workspace
python -m core.cli index
```

**Done!** RAG is now integrated with your CDD project.

---

## Usage

### Basic Search (No API Key Needed)

```bash
# Search across all CDD docs
/cdd:query "authentication patterns"

# With filters
/cdd:query "database migrations" --type feature --status completed

# Limit results
/cdd:query "testing strategies" --limit 10
```

**Result**:
```
📊 Found 5 results:

1. cdd/0001-user-auth/DECISIONS.md (score: 0.94)
   Work ID: 0001 | Type: feature | Status: completed

   Technical Decision: JWT Authentication
   We chose JWT-based authentication...

2. cdd/0005-api-security/DECISIONS.md (score: 0.87)
   ...
```

### AI-Powered Answers (Requires API Key)

```bash
# Get AI answer with citations
/cdd:query "How did we implement authentication?" --ai
```

**Result**:
```
🤖 AI Answer:

Based on your CDD documentation:

1. **JWT Tokens** (Work Item 0001)
   - Stateless authentication
   - 24-hour expiration
   - Refresh tokens in Redis

2. **Middleware Protection** (Work Item 0005)
   - Centralized validation
   - Auto user attachment

Sources:
- cdd/0001-user-auth/DECISIONS.md
- cdd/0005-api-security/SESSION_NOTES.md

📊 Cost: $0.0006
```

### Optional Integration with CDD Commands

CDD-RAG can be integrated with existing CDD commands through optional hooks.

**Currently supported (manual setup required):**
- `/cdd:complete-work` - Auto-index completed work items
- `/cdd:query` - Semantic search across all work

**Planned for future releases:**
- `/cdd:create-work` - Suggest similar work items
- `/cdd:plan-work` - Inject relevant context
- `/cdd:list-work` - Similarity filtering

See `docs/CDD_INTEGRATION.md` (coming soon) for integration setup.

---

## How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│     CDD Workspace (Your Docs)           │
│                                          │
│  • DECISIONS.md files                   │
│  • SESSION_NOTES.md files               │
│  • IMPLEMENTATION_PLAN.md files         │
│  • etc.                                  │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│     RAG Indexing (100% Local)           │
│                                          │
│  1. Parse markdown + extract metadata   │
│  2. Chunk into semantic pieces          │
│  3. Generate embeddings (local model)   │
│  4. Store in ChromaDB (local SQLite)    │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│     Query Processing                     │
│                                          │
│  User: /cdd:query "auth patterns"       │
│  1. Embed query (local, fast)           │
│  2. Search vectors (similarity)         │
│  3. Return top K results                │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│     Optional: AI Enhancement            │
│                                          │
│  1. Assemble context from results       │
│  2. Send to OpenAI-compatible API       │
│  3. Generate answer with citations      │
│  4. Track cost (~$0.0006/query)         │
└─────────────────────────────────────────┘
```

### What Gets Indexed

- All markdown files in `cdd/` workspace
- Frontmatter metadata (work ID, type, status, priority)
- Section structure (preserves context)
- Git metadata (author, commit, date)

### What Doesn't Get Indexed

- Template files in `cdd/.meta/templates/`
- Hidden files and directories
- Files matching exclude patterns (.env, secrets, etc.)

---

## Integration Levels

Choose your level of automation:

### Level 1: Manual Queries
- You manually run `/cdd:query` when needed
- Simple, full control
- Best for: Trying RAG, occasional use

### Level 2: Semi-Automated (Recommended)
- Use `/cdd:query` command regularly
- Auto-index on work completion
- Best for: Regular use, balanced approach

### Level 3: Full Automation
- Smart auto-enhancement of all commands
- Auto-indexing on completion
- Auto-suggest similar work items
- Best for: Power users, large projects

**Configure in**: `cdd/.rag/config.yaml`

---

## Configuration

### Basic Config (`cdd/.rag/config.yaml`)

```yaml
# RAG Mode: local, hybrid, or cloud
mode: hybrid

# Smart Enhancement
smart_enhancement:
  enabled: true
  enhance_create_work: true
  enhance_plan_work: true
  enhance_complete_work: true  # Just for auto-indexing

# Auto-Indexing
auto_index:
  on_complete: true
  async: true
  notify: true

# Query Defaults
query:
  default_results: 5
  min_similarity: 0.3
  enable_reranking: true

# Cost Management
cost:
  enable_tracking: true
  monthly_budget: 10.00
  warning_threshold: 0.01
```

### LLM Configuration (`.env`)

```bash
# OpenAI-compatible API (optional, for AI answers - works with OpenAI, Fuelix AI, etc.)
OPENAI_API_KEY=your_key_here
OPENAI_DEFAULT_MODEL=gpt-4o-mini

# Or use local LLM
USE_LOCAL_LLM=true
LOCAL_MODEL=llama3
```

---

## Documentation

Full documentation in `cdd/.rag/docs/`:

- **CDD_INTEGRATION.md** - Complete integration guide
- **INTEGRATION_PATTERNS.md** - Common workflows
- **CONFIGURATION.md** - All config options
- **TROUBLESHOOTING.md** - Common issues & solutions

---

## Performance & Cost

### Indexing
- 100 files: ~30 seconds (first run)
- 100 files: ~5 seconds (re-index)
- **Cost**: $0 (100% local)

### Search
- Query time: ~50-100ms
- **Cost**: $0 (100% local, offline)

### AI Answers (Optional)
| Model | Time | Cost/Query |
|-------|------|------------|
| GPT-4o-mini | ~1s | ~$0.0006 |
| Claude-3-Haiku | ~1.5s | ~$0.0011 |
| Llama-3-8B | ~1s | ~$0.0003 |

### Storage
- 100 work items: ~10 MB
- 1,000 work items: ~100 MB

---

## Requirements

**System**:
- Python 3.9+
- 2GB RAM (for embeddings)
- 2GB free disk space

**Optional** (for AI answers):
- OpenAI-compatible API key (OpenAI, Fuelix AI, etc.)
- OR Ollama installed for local LLM

---

## FAQ

### Do I need an API key?
No! Search works 100% offline. API key only needed for AI-generated answers.

### How much does it cost?
- **Search**: Free (local)
- **AI answers**: ~$0.0006 per query (GPT-4o-mini)
- **Monthly** (moderate use): <$0.50

### Is my data private?
Yes! Indexing is 100% local. Only queries (if using AI) go to cloud.

### Can I use this offline?
Yes! Search works 100% offline. AI answers need internet.

### How do I update the index?
Auto-updates when you complete work items, or run: `python -m core.cli index`

### Can I remove RAG later?
Yes! Just delete `cdd/.rag/` folder and the `/cdd:query` command. CDD continues to work normally.

---

## Troubleshooting

### "No results found"
- Run `python -m core.cli stats` to check if indexed
- Try broader search terms
- Lower `min_similarity` in config.yaml

### "Command not found"
- Verify `.claude/commands/cdd:query.md` exists
- Check command file has correct format

### "Import errors"
- Re-run: `pip install -r cdd/.rag/requirements.txt`
- Verify Python 3.9+

**More**: See `cdd/.rag/docs/TROUBLESHOOTING.md`

---

## Support

- **Documentation**: `cdd/.rag/docs/`
- **Discussions**: [GitHub Discussions](link-to-repo)

---

## License

MIT License - Same as CDD methodology

---

## Acknowledgments

- **CDD Methodology** by EMB
- **ChromaDB** for local vector database
- **Sentence-Transformers** for embeddings
- **OpenAI-compatible APIs** (OpenAI, Fuelix AI, etc.) for multi-model access

---

**Transform your CDD workspace into an intelligent, searchable knowledge base!** 🚀
