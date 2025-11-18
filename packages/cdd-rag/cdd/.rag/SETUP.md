# CDD-RAG Setup Guide

> **Complete installation and configuration guide for RAG integration**

**Estimated Time**: 15-20 minutes
**Difficulty**: Beginner-friendly

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [First-Time Indexing](#first-time-indexing)
5. [Verification](#verification)
6. [Integration with CDD](#integration-with-cdd)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required

✅ **Python 3.9+**
```bash
python --version
# Should show: Python 3.9.x or higher
```

✅ **Existing CDD Project**
```bash
# Your project should have:
your-project/
├── cdd/
│   ├── .meta/
│   └── [work items]
└── .claude/
    └── commands/
```

✅ **2GB Free Disk Space**
```bash
df -h .
# Check available space
```

✅ **pip (Python Package Manager)**
```bash
pip --version
```

### Optional (for AI Features)

⭕ **OpenAI-Compatible API Key**
- Works with OpenAI, Fuelix AI, and other compatible providers
- Sign up with your preferred provider (e.g., https://www.fuelix.ai/)
- Or use local LLM (Ollama)

---

## Installation Steps

### Step 1: Copy RAG Template

#### Option A: From Package (Recommended)

```bash
# Navigate to your CDD project root
cd /path/to/your/cdd/project

# Copy the .rag template
cp -r /path/to/packages/rag/cdd/.rag ./cdd/.rag

# Verify
ls cdd/.rag
# Should show: core/ hooks/ docs/ README.md SETUP.md config.yaml ...
```

#### Option B: Manual Download

```bash
# If you don't have the package locally
# Download and extract to cdd/.rag/
```

#### Step 1 Result

You should now have:
```
your-project/
└── cdd/
    ├── .meta/          # Existing CDD metadata
    ├── .rag/           # ✅ NEW: RAG extension
    │   ├── core/
    │   ├── hooks/
    │   ├── docs/
    │   ├── config.yaml
    │   └── requirements.txt
    └── [work items]
```

---

### Step 2: Install Python Dependencies

```bash
# Navigate to .rag folder
cd cdd/.rag

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**What gets installed**:
- `chromadb` (0.4.0+) - Local vector database
- `sentence-transformers` (2.2.0+) - Local embeddings
- `openai` (1.0.0+) - OpenAI-compatible client
- `pyyaml` (6.0+) - Config management
- Other utilities

**First-time note**: This will download an ~80MB embedding model. It happens once and is cached.

#### Troubleshooting Installation

**If you get permission errors**:
```bash
pip install --user -r requirements.txt
```

**If you get SSL errors**:
```bash
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
```

**If specific package fails**:
```bash
# Install packages one by one to identify the issue
pip install chromadb
pip install sentence-transformers
pip install openai
pip install pyyaml
```

#### Step 2 Verification

```bash
# Test imports
python -c "import chromadb; print('ChromaDB OK')"
python -c "import sentence_transformers; print('Transformers OK')"
python -c "import openai; print('OpenAI OK')"

# All should print "OK"
```

---

### Step 3: Copy Slash Command

```bash
# Navigate back to project root
cd ../..  # From cdd/.rag to project root

# Copy the /cdd:query command
cp packages/rag/.claude/commands/cdd:query.md ./.claude/commands/

# Or if copying from local template:
cp /path/to/packages/rag/.claude/commands/cdd:query.md ./.claude/commands/
```

#### Step 3 Verification

```bash
ls .claude/commands/cdd:query.md
# Should exist
```

---

### Step 4: Configure RAG (Optional)

#### For Search-Only (No API Key Needed)

**Default config works!** Skip to Step 5.

#### For AI-Powered Answers

```bash
cd cdd/.rag

# Copy environment template
cp .env.example .env

# Edit .env
nano .env
# Or: code .env
# Or: vim .env
```

**Add your API key**:
```bash
# .env
OPENAI_API_KEY=your_actual_api_key_here
OPENAI_DEFAULT_MODEL=gpt-4o-mini
```

**Save and close**.

#### For Local LLM (100% Offline)

```bash
# Edit .env
USE_LOCAL_LLM=true
LOCAL_LLM_PROVIDER=ollama
LOCAL_MODEL=llama3

# Make sure Ollama is installed and running:
# Install: https://ollama.ai/
ollama pull llama3
```

#### Step 4 Verification

```bash
# Check config loads
python -c "from core.config import load_config; print(load_config())"
# Should show config dict
```

---

## Configuration

### Basic Configuration (`config.yaml`)

Open `cdd/.rag/config.yaml`:

```yaml
# ============================================================================
# CDD-RAG CONFIGURATION
# ============================================================================

# Operation mode: local, hybrid, or cloud
mode: hybrid
  # local: 100% offline, search only, no AI
  # hybrid: Local search + optional cloud AI (recommended)
  # cloud: Use cloud for embeddings too (not recommended)

# Workspace path (relative to .rag folder)
workspace_path: "../"

# ============================================================================
# SMART ENHANCEMENT
# ============================================================================

smart_enhancement:
  enabled: true

  # Which CDD commands to enhance
  enhance_create_work: true   # Show similar work items
  enhance_plan_work: true     # Inject relevant patterns
  enhance_complete_work: true # Auto-index completed work

  # Enhancement parameters
  min_score: 0.7              # Minimum similarity to inject
  max_chunks: 5               # Max context chunks to inject
  cite_sources: true          # Show source references

# ============================================================================
# AUTO-INDEXING
# ============================================================================

auto_index:
  on_complete: true           # Index when completing work items
  async: true                 # Don't block completion
  notify: true                # Show indexing status
  summary_only: false         # Index all docs, not just summary

# ============================================================================
# SEARCH & QUERY
# ============================================================================

query:
  default_results: 5          # Default number of results
  min_similarity: 0.3         # Filter low-relevance results
  enable_reranking: true      # Re-rank for better relevance

# ============================================================================
# CHUNKING
# ============================================================================

chunking:
  chunk_size: 800             # Characters per chunk
  overlap: 100                # Overlap between chunks
  respect_sections: true      # Chunk on section boundaries

# ============================================================================
# EMBEDDING
# ============================================================================

embedding:
  model: "all-MiniLM-L6-v2"   # Local embedding model
  batch_size: 32              # Batch size for faster processing

# ============================================================================
# STORAGE
# ============================================================================

storage:
  persist_dir: "./.chroma"    # Vector database location
  collection_name: "cdd_knowledge"

# ============================================================================
# PRIVACY & SECURITY
# ============================================================================

exclude_patterns:
  - "**/.env*"
  - "**/secrets/**"
  - "**/credentials.json"
  - "**/*_secret.*"
  - "**/*.key"
  - "**/*.pem"
  - "**/node_modules/**"
  - "**/.git/**"

sanitize_content: true        # Remove potential secrets

# ============================================================================
# COST MANAGEMENT
# ============================================================================

cost:
  enable_tracking: true       # Track API costs
  warning_threshold: 0.01     # Warn if query > $0.01
  monthly_budget: 10.00       # Monthly limit (USD)

# ============================================================================
# PERFORMANCE
# ============================================================================

performance:
  enable_cache: true          # Cache frequent queries
  cache_size: 100             # Number of queries to cache
  num_workers: 4              # Parallel processing workers
```

**Recommended for most users**: Leave defaults, they're optimized.

---

## First-Time Indexing

### Run Initial Index

```bash
# Make sure you're in the project root
cd /path/to/your/project

# Run indexing
python -m cdd.rag.core.cli index
```

**What you'll see**:
```
🔍 Indexing CDD workspace...
📄 Found 23 markdown files

📥 Loading embedding model (one-time, ~80MB)...
Downloading model...
✅ Model loaded!

Indexing files:
  ✓ cdd/0001-user-auth/DECISIONS.md (5 chunks)
  ✓ cdd/0001-user-auth/SESSION_NOTES.md (3 chunks)
  ✓ cdd/0002-api-endpoints/DECISIONS.md (6 chunks)
  ✓ cdd/0002-api-endpoints/IMPLEMENTATION_PLAN.md (4 chunks)
  ...

✅ Indexed 23 files, 147 chunks in 28.3 seconds

📊 Index Statistics:
  Total documents: 23
  Total chunks: 147
  Vector DB size: 8.2 MB
  Last indexed: 2025-01-15 14:23:00
```

**Time expectations**:
- **First run**: 30-60 seconds for ~20-50 files (includes model download)
- **Subsequent runs**: 5-10 seconds (model cached)

### Verify Index

```bash
# Check statistics
python -m cdd.rag.core.cli stats
```

**Output**:
```
📊 RAG Index Statistics
────────────────────────────────────────
Total documents: 23
Total chunks: 147
Total work items: 18

By Type:
  feature: 12
  bug: 4
  refactor: 2

By Status:
  completed: 15
  in_progress: 3

Vector DB size: 8.2 MB
Last indexed: 2025-01-15 14:23:00
```

---

## Verification

### Test 1: Search Works

```bash
# Try a simple search
python -m cdd.rag.core.cli search "authentication"
```

**Expected**:
```
💭 Searching for: 'authentication'
📊 Searching 147 chunks...

📚 Found 5 results:

1. cdd/0001-user-auth/DECISIONS.md (score: 0.94)
   Work ID: 0001 | Type: feature

   Technical Decision: JWT Authentication
   We chose JWT-based authentication...

2. cdd/0005-api-security/DECISIONS.md (score: 0.87)
   ...
```

✅ **If you see results: Search works!**

### Test 2: Slash Command Works

```bash
# In your CDD workflow, try:
/cdd:query "test query"
```

**Expected**: Formatted results in conversation

✅ **If command responds: Integration works!**

### Test 3: AI Answers (If Configured)

```bash
# Only if you added OPENAI_API_KEY
python -m cdd.rag.core.cli ask "How do we handle errors?"
```

**Expected**:
```
🤖 Generating answer with GPT-4o-mini...

💡 Answer:

Based on your CDD documentation, you handle errors using:

1. **Centralized Error Middleware** (Work Item 0002)
   - Express.js error handling middleware
   - Custom error classes

2. **Error Codes** (Work Item 0007)
   - Standardized error codes
   - Consistent error responses

Sources:
- cdd/0002-api-endpoints/DECISIONS.md
- cdd/0007-error-handling/IMPLEMENTATION_SUMMARY.md

📊 Cost: $0.0006
```

✅ **If you get answer: AI integration works!**

---

## Integration with CDD

### Automatic Enhancement

Once `.rag/` exists, CDD commands automatically use RAG:

#### Test Create Work Enhancement

```bash
/cdd:create-work test-feature-name
```

**Expected**: AI shows similar work items before creating new one

#### Test Plan Work Enhancement

```bash
/cdd:plan-work [existing-work-id]
```

**Expected**: AI references similar implementations from past work

#### Test Complete Work Enhancement

```bash
/cdd:complete-work [work-id]
```

**Expected**: After completion, work auto-indexed
```
✅ Work item marked as complete!
🔍 RAG Update:
  ✓ Work item indexed
  ✓ 8 new chunks added
```

### Manual Queries

You can always query RAG directly:

```bash
# Search
/cdd:query "your search terms"

# AI answer
/cdd:query "your question" --ai

# With filters
/cdd:query "migrations" --type feature --status completed

# Limit results
/cdd:query "patterns" --limit 10
```

---

## Troubleshooting

### "Command /cdd:query not found"

**Solution**:
```bash
# Verify command file exists
ls .claude/commands/cdd:query.md

# If missing, copy again:
cp /path/to/packages/rag/.claude/commands/cdd:query.md ./.claude/commands/
```

### "No markdown files found"

**Problem**: Wrong workspace path

**Solution**:
```bash
# Check workspace_path in config.yaml
cat cdd/.rag/config.yaml | grep workspace_path

# Should be: workspace_path: "../"
# This makes it point to cdd/ from cdd/.rag/
```

### "Model download fails"

**Problem**: Network or disk space

**Solution**:
```bash
# Check disk space
df -h .

# Try manual download
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

### "Import errors"

**Problem**: Dependencies not installed

**Solution**:
```bash
cd cdd/.rag
pip install -r requirements.txt

# Or one by one:
pip install chromadb sentence-transformers openai pyyaml
```

### "Search returns no results"

**Problem**: Nothing indexed or threshold too high

**Solution**:
```bash
# Check if indexed
python -m cdd.rag.core.cli stats

# If nothing indexed, run:
python -m cdd.rag.core.cli index

# Lower similarity threshold in config.yaml:
# min_similarity: 0.2  # Was 0.3
```

### "OPENAI_API_KEY not set" warning

**This is OK if**:
- You only want search (not AI answers)
- Using local LLM

**To fix if you want AI**:
```bash
cd cdd/.rag
echo "OPENAI_API_KEY=your_key_here" >> .env
```

---

## Next Steps

### 1. Test with Real Queries

```bash
/cdd:query "topics from your project"
```

### 2. Read Integration Guide

```bash
cat cdd/.rag/docs/CDD_INTEGRATION.md
```

### 3. Customize Configuration

```bash
nano cdd/.rag/config.yaml
```

### 4. Set Up Auto-Enhancement

See `docs/CDD_INTEGRATION.md` for hook configuration

---

## Uninstallation

If you want to remove RAG:

```bash
# 1. Delete .rag folder
rm -rf cdd/.rag

# 2. Delete slash command
rm .claude/commands/cdd:query.md

# Done! CDD continues to work normally
```

---

## Success Checklist

✅ Copied `.rag/` folder to `cdd/.rag/`
✅ Installed dependencies: `pip install -r requirements.txt`
✅ Copied `/cdd:query` command to `.claude/commands/`
✅ Configured (if using AI): Added `OPENAI_API_KEY` to `.env`
✅ Ran initial index: `python -m cdd.rag.core.cli index`
✅ Verified with search: `/cdd:query "test"`
✅ (Optional) Tested AI: `/cdd:query "test" --ai`

**All checked? You're ready to use RAG with CDD!** 🎉

---

**Estimated total time**: 15-20 minutes
**What you get**: Searchable, intelligent CDD workspace

**Next**: Start querying your knowledge base with `/cdd:query`!
