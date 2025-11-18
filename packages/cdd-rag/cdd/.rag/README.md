# CDD RAG Template

> **This folder contains the RAG (Retrieval-Augmented Generation) extension for your CDD project**

**Status**: Template - Copy this folder into your CDD project

---

## What is This?

This `.rag/` folder is a **template** for adding semantic search and AI-powered context retrieval to your CDD workspace. It mirrors the structure of `.meta/` and follows the same CDD principles.

When copied into your project, it enables:
- 🔍 Semantic search across all work items
- 🤖 AI-powered answers from your documentation
- 📚 Discovery of past decisions and patterns
- 🔗 Smart enhancement of existing CDD commands

---

## Installation

### Quick Install (Copy & Configure)

```bash
# 1. Copy this folder to your CDD project
cp -r /path/to/packages/rag/cdd/.rag /your/project/cdd/.rag

# 2. Install dependencies
cd /your/project/cdd/.rag
pip install -r requirements.txt

# 3. Configure (optional - for AI features)
cp .env.example .env
# Edit .env to add OPENAI_API_KEY if using AI

# 4. Index your workspace
python -m core.cli index

# Done! RAG is ready to use
```

**Detailed instructions**: See `SETUP.md`

---

## Folder Structure

```
.rag/
├── README.md                # This file
├── SETUP.md                 # Detailed setup instructions
├── config.yaml              # RAG configuration
├── requirements.txt         # Python dependencies
├── .env.example             # Environment template
│
├── core/                    # RAG implementation
│   ├── __init__.py
│   ├── cli.py               # Command-line interface
│   ├── embedder.py          # Local embedding generation
│   ├── vector_store.py      # ChromaDB wrapper
│   ├── query_engine.py      # Search & retrieval
│   ├── llm_client.py        # OpenAI-compatible API client
│   ├── models.py            # Data models
│   └── config.py            # Configuration management
│
├── hooks/                   # CDD integration hooks
│   ├── __init__.py
│   ├── indexer.py           # Auto-indexing logic
│   ├── enhancer.py          # Smart auto-enhancement
│   └── utils.py             # Helper functions
│
└── docs/                    # Documentation
    ├── CDD_INTEGRATION.md   # Integration guide
```

---

## How It Works

### 1. Indexing (One-Time Setup)

```bash
python -m core.cli index
```

**What happens**:
- Scans all markdown files in `cdd/` workspace
- Extracts frontmatter metadata (work ID, type, status, etc.)
- Chunks documents intelligently (preserves structure)
- Generates embeddings locally (no API calls)
- Stores in ChromaDB (local SQLite database)

**Time**: ~30 seconds for 100 work items
**Cost**: $0 (100% local)

### 2. Searching

```bash
# Via slash command (recommended)
/cdd:query "authentication patterns"

# Or directly
python -m core.cli search "authentication patterns"
```

**What happens**:
- Embeds your query (local, fast)
- Searches vector database (cosine similarity)
- Returns top K most relevant chunks
- Shows sources with scores

**Time**: <100ms
**Cost**: $0 (100% local, works offline)

### 3. AI Answers (Optional)

```bash
/cdd:query "How did we implement auth?" --ai
```

**What happens**:
- Retrieves relevant chunks (as above)
- Assembles context from search results
- Sends to OpenAI-compatible API with your question
- Returns AI-generated answer with citations
- Tracks cost

**Time**: ~1 second
**Cost**: ~$0.0006 per query (GPT-4o-mini)

### 4. Smart Enhancement (Automatic)

When `.rag/` folder exists, CDD commands automatically use RAG:

**Example - `/cdd:plan-work`**:
```bash
/cdd:plan-work 0008
```

**Behind the scenes**:
1. CDD command detects `.rag/` folder
2. Calls `hooks/enhancer.py`
3. RAG searches for similar implementations
4. Injects relevant context into AI prompt
5. AI uses context naturally in response

**You see**:
```
📚 Relevant Context from Past Work:
- Work Item 0002: Used Express.js with MVC pattern
- Work Item 0005: Similar API endpoint structure

I'll use these proven approaches in the plan...
```

---

## Configuration

### Basic Config (`config.yaml`)

```yaml
# RAG operation mode
mode: hybrid  # local, hybrid, or cloud

# Smart enhancement
smart_enhancement:
  enabled: true
  enhance_create_work: true
  enhance_plan_work: true
  enhance_complete_work: true  # Auto-indexing

# Auto-indexing
auto_index:
  on_complete: true
  async: true

# Search defaults
query:
  default_results: 5
  min_similarity: 0.3
```

### Environment Config (`.env`)

```bash
# Optional - only for AI features
OPENAI_API_KEY=your_key_here
OPENAI_DEFAULT_MODEL=gpt-4o-mini

# Or use local LLM
USE_LOCAL_LLM=false
LOCAL_MODEL=llama3
```

---

## Usage Examples

### Example 1: Find Similar Work

```bash
/cdd:query "user profile management"
```

Returns work items about profiles, users, accounts with relevance scores.

### Example 2: Learn from Past

```bash
/cdd:query "How do we handle database migrations?" --ai
```

Gets AI answer based on your documented migration approaches.

### Example 3: Check Consistency

```bash
/cdd:query "error handling patterns"
```

Discovers all error handling approaches used, helps maintain consistency.

### Example 4: Onboard New Developer

```bash
/cdd:query "What's our testing strategy?" --ai
```

New team member gets instant overview with citations to read more.

---

## Integration with CDD Commands

### Automatic Enhancement

When `.rag/` exists, these commands are enhanced:

| Command | Enhancement |
|---------|-------------|
| `/cdd:create-work` | Shows similar existing work items |
| `/cdd:plan-work` | Injects relevant implementation patterns |
| `/cdd:complete-work` | Auto-indexes completed work |
| `/cdd:query` | New command for direct RAG queries |

### Manual Queries

You can always query RAG manually:

```bash
# Search only
/cdd:query "your search"

# With AI answer
/cdd:query "your question" --ai

# With filters
/cdd:query "migrations" --type feature --status completed

# Limit results
/cdd:query "patterns" --limit 10
```

---

## Updating the Index

### Automatic (Recommended)

If `auto_index.on_complete: true` in `config.yaml`:
- Index automatically updates when you run `/cdd:complete-work`
- No manual action needed

### Manual

```bash
# Re-index everything
python -m core.cli index

# Incremental update (only changed files)
python -m core.cli update

# Index specific work item
python -m core.cli index --work-id 0008
```

---

## Performance

### Indexing
- **100 work items**: ~30 seconds (first run)
- **100 work items**: ~5 seconds (re-index)
- **Storage**: ~10 MB per 100 items

### Search
- **Query time**: <100ms
- **Works offline**: Yes
- **Cost**: $0

### AI Answers
- **Query time**: ~1 second
- **Cost**: ~$0.0006 (GPT-4o-mini)
- **Monthly (100 queries)**: ~$0.06

---

## Privacy & Security

### What Stays Local
✅ All your CDD documents
✅ All embeddings (vectors)
✅ All search operations
✅ Vector database (ChromaDB)
✅ Configuration

### What Goes to Cloud (Optional)
⚠️ Only when using `--ai` flag:
- Your question
- Retrieved context (relevant chunks only)
- Nothing else

### Data Protection
- Exclude patterns prevent indexing secrets
- Content sanitization removes potential credentials
- Can operate 100% offline (no AI features)

---

## Troubleshooting

### "No results found"

**Check**:
```bash
# Is anything indexed?
python -m core.cli stats

# Try broader search
/cdd:query "broader terms"

# Lower similarity threshold
# Edit config.yaml: min_similarity: 0.2
```

### "Module not found"

**Fix**:
```bash
# Re-install dependencies
cd cdd/.rag
pip install -r requirements.txt
```

### "Slow indexing"

**Normal**: First run downloads embedding model (~80MB)
**Subsequent runs**: Fast (model cached)

---

## Customization

### Add Custom Exclude Patterns

Edit `config.yaml`:
```yaml
exclude_patterns:
  - "**/.env*"
  - "**/secrets/**"
  - "**/your_custom_pattern/**"
```

### Change Embedding Model

Edit `config.yaml`:
```yaml
embedding:
  model: "all-mpnet-base-v2"  # Better quality, slower
```

### Adjust Chunk Size

Edit `config.yaml`:
```yaml
chunking:
  chunk_size: 1000  # Larger = more context
  overlap: 150      # More overlap = better context preservation
```

---

## Removal

To remove RAG from your project:

```bash
# 1. Delete .rag folder
rm -rf cdd/.rag

# 2. Delete slash command
rm .claude/commands/cdd:query.md

# Done! CDD continues to work normally
```

**No breaking changes** - CDD commands will work as before.

---

**This template makes your CDD workspace searchable and intelligent!** 🚀

**Next**: See `SETUP.md` for detailed installation instructions.
