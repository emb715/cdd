---
description: Query your CDD knowledge base using semantic search and optional AI-powered answers
tags: [rag, search, query, knowledge-base, context, ai]
---

# CDD:Query - Knowledge Base Query Command

> **Search your CDD workspace semantically and get AI-powered answers from your documentation**

This command provides access to the RAG (Retrieval-Augmented Generation) system integrated with your CDD workspace. It enables semantic search across all work items, decisions, and documentation, with optional AI-powered answer generation.

---

## Prerequisites

Before using this command, ensure:

1. ✅ **RAG is installed**: `.rag/` folder exists in your `cdd/` directory
2. ✅ **Dependencies installed**: Run `pip install -r cdd/.rag/requirements.txt`
3. ✅ **Workspace indexed**: Run `python -m cdd.rag.core.cli index` at least once
4. ⭕ **API key configured** (optional, only for AI answers): `OPENAI_API_KEY` in `cdd/.rag/.env`

**Check RAG status**:
```bash
# Verify RAG is ready
python -m cdd.rag.core.cli stats
```

---

## Command Syntax

```bash
/cdd:query "<search query or question>" [--ai] [--type TYPE] [--status STATUS] [--mode MODE] [--artifact TYPE] [--domain DOMAIN] [--limit N]
```

### Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `query` | ✅ Yes | Search terms or question to ask | `"authentication patterns"` |
| `--ai` | ❌ No | Generate AI answer (requires API key) | `--ai` |
| `--type` | ❌ No | Filter by work item type | `--type feature` |
| `--status` | ❌ No | Filter by work item status | `--status completed` |
| `--mode` | ❌ No | Filter by template mode | `--mode comprehensive` |
| `--artifact` | ❌ No | Filter by artifact type (comprehensive mode) | `--artifact TECHNICAL_RFC` |
| `--domain` | ❌ No | Filter by artifact domain | `--domain engineering` |
| `--limit` | ❌ No | Max number of results (default: 5) | `--limit 10` |

### Valid Type Values
- `feature`
- `bug`
- `refactor`
- `docs`
- `chore`
- `spike`

### Valid Status Values
- `draft`
- `in_progress`
- `completed`
- `archived`

### Valid Template Mode Values
- `solo-dev` - Minimal documentation mode (default for most work)
- `minimal` - Collaborative work mode with basic structure
- `comprehensive` - Full modular artifacts mode for complex work

### Valid Artifact Type Values (Comprehensive Mode)
- `PROBLEM_BRIEF` - Product requirements and success criteria
- `TECHNICAL_RFC` - Technical design documents
- `RISK_REGISTER` - Risk identification and mitigation
- `VALIDATION_PLAN` - Testing and validation strategies
- `DECISIONS` - General decisions (all modes)
- `IMPLEMENTATION_PLAN` - Implementation task breakdown
- `SESSION_NOTES` - Session progress tracking
- `IMPLEMENTATION_SUMMARY` - Post-completion summaries

### Valid Artifact Domain Values
- `product` - Product-focused artifacts (PROBLEM_BRIEF, PRD)
- `engineering` - Technical artifacts (TECHNICAL_RFC, IMPLEMENTATION_PLAN)
- `risk` - Risk management artifacts (RISK_REGISTER)
- `qa` - Quality assurance artifacts (VALIDATION_PLAN)
- `progress` - Session and progress tracking (SESSION_NOTES, IMPLEMENTATION_SUMMARY)
- `general` - General decision documents
- `meta` - Templates and system documentation

---

## Usage Examples

### Example 1: Basic Search
```bash
/cdd:query "authentication patterns"
```

**What happens**:
1. Embeds your query using local model
2. Searches ChromaDB for similar content
3. Returns top 5 most relevant chunks
4. Shows sources with similarity scores

**Output**:
```
🔍 Search Results for: "authentication patterns"
📊 Searched 147 chunks in 52ms

Found 5 results:

1. cdd/0001-user-auth/DECISIONS.md (score: 0.94)
   Work ID: 0001 | Type: feature | Status: completed

   Technical Decision: JWT Authentication
   We chose JWT-based authentication for stateless API access...

2. cdd/0005-api-security/DECISIONS.md (score: 0.87)
   Work ID: 0005 | Type: feature | Status: completed

   Authentication Middleware
   Centralized auth middleware validates all protected endpoints...

3. cdd/0012-oauth-integration/SESSION_NOTES.md (score: 0.81)
   Work ID: 0012 | Type: feature | Status: in_progress

   OAuth 2.0 Implementation
   Adding OAuth support for third-party authentication...

[2 more results...]
```

### Example 2: AI-Powered Answer
```bash
/cdd:query "How did we implement authentication?" --ai
```

**What happens**:
1. Searches for relevant context (as above)
2. Assembles context from top results
3. Sends query + context to OpenAI-compatible API
4. Returns AI-generated answer with citations
5. Tracks and displays cost

**Output**:
```
🔍 Searching knowledge base...
📊 Found 5 relevant chunks

🤖 Generating AI answer with GPT-4o-mini...

💡 Answer:

Based on your CDD documentation, you implemented authentication using:

1. **JWT-Based Authentication** (Work Item 0001)
   - Stateless token approach
   - 24-hour expiration with refresh tokens
   - Stored refresh tokens in Redis for revocation

2. **Centralized Middleware** (Work Item 0005)
   - Express.js middleware validates all protected routes
   - Automatically attaches user object to request
   - Handles token expiration and refresh

3. **OAuth Integration** (Work Item 0012 - In Progress)
   - Adding OAuth 2.0 for third-party providers
   - Supporting Google and GitHub initially

Key Technical Decisions:
- Chose JWT over sessions for API scalability
- Used RS256 algorithm for public key verification
- Implemented rate limiting on auth endpoints

📚 Sources:
- cdd/0001-user-auth/DECISIONS.md
- cdd/0005-api-security/DECISIONS.md
- cdd/0012-oauth-integration/SESSION_NOTES.md

📊 Cost: $0.0006 | Tokens: 1,234 (input: 892, output: 342)
```

### Example 3: Filtered Search
```bash
/cdd:query "database migrations" --type feature --status completed
```

**What happens**:
1. Searches only work items with type=feature AND status=completed
2. Returns matching results

**Output**:
```
🔍 Search Results for: "database migrations"
🎯 Filters: type=feature, status=completed
📊 Searched 89 chunks in 48ms (58 filtered out)

Found 3 results:

1. cdd/0003-database-setup/DECISIONS.md (score: 0.91)
   Work ID: 0003 | Type: feature | Status: completed

   Migration Strategy
   Using Knex.js for database migrations...

[2 more results...]
```

### Example 4: Filter by Template Mode
```bash
/cdd:query "architecture patterns" --mode comprehensive
```

**What happens**:
1. Searches only work items using comprehensive template mode
2. Returns results from complex work with full modular artifacts

**Output**:
```
🔍 Search Results for: "architecture patterns"
🎯 Filters: template_mode=comprehensive
📊 Searched 42 chunks in 45ms (105 filtered out)

Found 4 results:

1. cdd/0008-platform-redesign/TECHNICAL_RFC.md (score: 0.93)
   Work ID: 0008 | Type: epic | Mode: comprehensive

   System Architecture
   Microservices architecture with event-driven communication...

2. cdd/0008-platform-redesign/PROBLEM_BRIEF.md (score: 0.88)
   Work ID: 0008 | Type: epic | Mode: comprehensive

   Technical Requirements
   High availability, horizontal scalability...

[2 more results...]
```

**Use cases**:
- Finding detailed technical designs: `--mode comprehensive`
- Quick solutions for solo work: `--mode solo-dev`
- Team collaboration patterns: `--mode minimal`

### Example 5: Combined Filters
```bash
/cdd:query "testing strategies" --mode minimal --type feature --status completed
```

**What happens**:
1. Searches only completed features using minimal template mode
2. Perfect for finding proven testing approaches from collaborative work

### Example 6: Limit Results
```bash
/cdd:query "error handling" --limit 10
```

**What happens**:
1. Returns up to 10 results instead of default 5

### Example 7: Broad Discovery
```bash
/cdd:query "testing strategies" --limit 15
```

**Use case**: Discovering all testing approaches across the project

### Example 8: Filter by Artifact Type (Comprehensive Mode)
```bash
/cdd:query "API design decisions" --artifact TECHNICAL_RFC
```

**What happens**:
1. Searches only TECHNICAL_RFC documents
2. Returns technical design content from comprehensive mode work

**Output**:
```
🔍 Search Results for: "API design decisions"
🎯 Filters: artifact_type=TECHNICAL_RFC
📊 Searched 28 chunks in 42ms (119 filtered out)

Found 3 results:

1. cdd/0008-platform-redesign/TECHNICAL_RFC.md (score: 0.95)
   Work ID: 0008 | Type: epic | Artifact: TECHNICAL_RFC

   API Architecture
   RESTful API with GraphQL gateway for complex queries...

2. cdd/0014-payment-integration/TECHNICAL_RFC.md (score: 0.89)
   Work ID: 0014 | Type: feature | Artifact: TECHNICAL_RFC

   Payment API Design
   Stripe integration with webhook handling...

[1 more result...]
```

**Use cases**:
- Find technical designs: `--artifact TECHNICAL_RFC`
- Find success criteria: `--artifact PROBLEM_BRIEF`
- Find known risks: `--artifact RISK_REGISTER`
- Find test plans: `--artifact VALIDATION_PLAN`

### Example 9: Filter by Artifact Domain
```bash
/cdd:query "user requirements" --domain product
```

**What happens**:
1. Searches only product-focused artifacts (PROBLEM_BRIEF, PRD)
2. Returns product/business-oriented content

**Use cases**:
- Product requirements: `--domain product`
- Technical implementations: `--domain engineering`
- Risk assessments: `--domain risk`
- Testing strategies: `--domain qa`
- Progress tracking: `--domain progress`

### Example 10: Combined Artifact Filters
```bash
/cdd:query "performance requirements" --mode comprehensive --domain engineering --type epic
```

**What happens**:
1. Searches only comprehensive mode epics in engineering domain
2. Perfect for finding architectural decisions

### Example 11: Specific Question with Context
```bash
/cdd:query "What's our approach to error logging and monitoring?" --ai
```

**Use case**: Getting comprehensive answer combining multiple decisions

---

## How It Works

### Search Process (100% Local)

```
Your Query
    ↓
1. Embed query (local model: all-MiniLM-L6-v2)
    ↓
2. Search ChromaDB (cosine similarity)
    ↓
3. Apply filters (type, status)
    ↓
4. Rank by score (optional re-ranking)
    ↓
5. Return top K results
    ↓
Display with sources
```

**Performance**: ~50-100ms
**Cost**: $0 (100% local, works offline)

### AI Answer Process (Optional Cloud)

```
Your Question
    ↓
1. Search for relevant chunks (as above)
    ↓
2. Extract top N chunks (default: 5)
    ↓
3. Assemble context (max 3000 tokens)
    ↓
4. Format prompt with citations
    ↓
5. Send to OpenAI-compatible API
    ↓
6. Parse response
    ↓
7. Calculate cost
    ↓
Display answer + sources + cost
```

**Performance**: ~1-2 seconds
**Cost**: ~$0.0006 per query (GPT-4o-mini)

---

## Best Practices

### When to Use Search (No --ai)
✅ Finding specific work items quickly
✅ Browsing similar implementations
✅ Checking if topic was addressed
✅ Working offline
✅ Minimizing costs

### When to Use AI Answers (--ai)
✅ Complex questions requiring synthesis
✅ Understanding relationships between decisions
✅ Onboarding new team members
✅ Generating summaries
✅ When you want natural language answers

### Query Formulation Tips

**For Search**:
```bash
# ✅ Good: Specific terms
/cdd:query "JWT authentication middleware"

# ✅ Good: Technical concepts
/cdd:query "database connection pooling"

# ❌ Less effective: Too broad
/cdd:query "backend"

# ❌ Less effective: Too narrow
/cdd:query "line 42 of auth.js"
```

**For AI Answers**:
```bash
# ✅ Good: Natural questions
/cdd:query "How do we handle database transactions?" --ai

# ✅ Good: Synthesis questions
/cdd:query "What are our testing patterns?" --ai

# ✅ Good: Comparison questions
/cdd:query "How did our error handling evolve?" --ai

# ❌ Less effective: Simple lookups
/cdd:query "What is work item 0001?" --ai  # Just search instead
```

---

## Configuration

Default behavior is controlled by `cdd/.rag/config.yaml`:

```yaml
# Search defaults
query:
  default_results: 5          # How many results to return
  min_similarity: 0.3         # Filter out low-relevance results
  enable_reranking: true      # Re-rank for better relevance
  max_context_tokens: 3000    # Max context for AI answers

# LLM for AI answers
llm:
  default_model: "gpt-4o-mini"
  temperature: 0.7

# Cost management
cost:
  enable_tracking: true
  warning_threshold: 0.01     # Warn if single query > $0.01
  monthly_budget: 10.00       # USD
```

**Customize**:
```bash
# Edit config
nano cdd/.rag/config.yaml

# Changes take effect immediately (no restart needed)
```

---

## Error Handling

### "No RAG system found"
```
❌ Error: RAG system not found
💡 Hint: Run these commands to set up RAG:
  1. cp -r packages/rag/cdd/.rag ./cdd/.rag
  2. cd cdd/.rag && pip install -r requirements.txt
  3. python -m cdd.rag.core.cli index
```

**Fix**: Install RAG following `cdd/.rag/SETUP.md`

### "Index is empty"
```
❌ Error: No documents in index
💡 Hint: Index your workspace:
  python -m cdd.rag.core.cli index
```

**Fix**: Run initial indexing

### "No results found"
```
🔍 Search Results for: "your query"
📊 Searched 147 chunks in 52ms

ℹ️  No results found

💡 Suggestions:
  • Try broader search terms
  • Lower similarity threshold in config.yaml
  • Check if topic is documented
  • Verify workspace is indexed
```

**Fix**:
1. Try broader terms
2. Edit `cdd/.rag/config.yaml`: `min_similarity: 0.2` (was 0.3)
3. Re-index: `python -m cdd.rag.core.cli index`

### "API key not configured"
```
❌ Error: Cannot use --ai flag without API key
💡 Hint: Add OPENAI_API_KEY to cdd/.rag/.env
  Or use search without --ai flag
```

**Fix**:
```bash
cd cdd/.rag
echo "OPENAI_API_KEY=your_key_here" >> .env
```

### "Monthly budget exceeded"
```
⚠️  Warning: Monthly budget exceeded ($10.00)
🔄 Auto-switching to cheaper model: llama-3-8b

Query will proceed with cost-effective model.
```

**Fix**: Budget protection working as intended. To adjust:
```yaml
# cdd/.rag/config.yaml
cost:
  monthly_budget: 20.00  # Increase limit
```

---

## Privacy & Security

### What Stays Local
✅ All CDD documents
✅ All embeddings (vectors)
✅ All search operations
✅ ChromaDB vector database
✅ Your queries (when not using --ai)

### What Goes to Cloud (Only with --ai)
⚠️ Your question
⚠️ Retrieved context chunks (top 5 by default)
⚠️ Model's response

### Data Protection
```yaml
# Configured in cdd/.rag/config.yaml
exclude_patterns:
  - "**/.env*"              # Never index secrets
  - "**/secrets/**"
  - "**/credentials.json"
  - "**/*_secret.*"
  - "**/*.key"
  - "**/*.pem"

sanitize_content: true      # Remove potential credentials
```

**100% Offline Mode**:
```bash
# Search works completely offline
/cdd:query "your search"

# AI answers require internet
/cdd:query "your question" --ai  # Needs connection
```

---

## Performance Tips

### Faster Searches
1. **Use filters** - Reduce search space
   ```bash
   /cdd:query "migrations" --status completed
   ```

2. **Limit results** - Reduce processing
   ```bash
   /cdd:query "patterns" --limit 3
   ```

3. **Enable caching** - Reuse frequent queries
   ```yaml
   # config.yaml
   performance:
     enable_cache: true
     cache_size: 100
   ```

### Cost Optimization
1. **Use search when possible** - $0 vs $0.0006
2. **Choose cheaper models**:
   ```yaml
   # config.yaml
   llm:
     default_model: "llama-3-8b"  # $0.0003 vs $0.0006
   ```
3. **Set budget limits**:
   ```yaml
   cost:
     monthly_budget: 5.00
     auto_switch_cheap: true
   ```

### Keep Index Fresh
```bash
# Auto-index on completion (recommended)
# Enabled in config.yaml:
auto_index:
  on_complete: true

# Or manual update
python -m cdd.rag.core.cli update  # Incremental
```

---

## Integration with Other Commands

RAG automatically enhances these CDD commands when `.rag/` exists:

### /cdd:create-work (Enhanced)
**Before creating new work item**, RAG searches for similar existing items:
```
📋 Similar Work Items:
1. cdd/0007-similar-feature (score: 0.89)
2. cdd/0012-related-work (score: 0.82)

Would you like to review these first?
```

### /cdd:plan-work (Enhanced)
**During planning**, RAG injects relevant patterns:
```
📚 Relevant Context:
- Work 0002: Used MVC pattern with Express.js
- Work 0005: Similar API endpoint structure

I'll reference these patterns in the plan.
```

### /cdd:complete-work (Enhanced)
**After completion**, RAG auto-indexes:
```
✅ Work item 0015 marked as complete!

🔍 RAG Update:
  ✓ Work item indexed
  ✓ 8 new chunks added
  ✓ Now searchable via /cdd:query
```

**Configure in** `cdd/.rag/config.yaml`:
```yaml
smart_enhancement:
  enabled: true
  enhance_create_work: true
  enhance_plan_work: true
  enhance_complete_work: true
```

---

## Troubleshooting

### Slow First Query
**Normal**: First query downloads embedding model (~80MB)
**Subsequent queries**: Fast (model cached)

### Inconsistent Results
**Check**: Similarity threshold might be too low
**Fix**: Increase `min_similarity` in config.yaml

### Out-of-Date Results
**Check**: Index might be stale
**Fix**: Run `python -m cdd.rag.core.cli update`

### High API Costs
**Check**: Using expensive model or too many AI queries
**Fix**:
1. Use search without --ai when possible
2. Switch to cheaper model in config.yaml
3. Enable budget limits

---

## Advanced Usage

### CLI Access (Direct)
```bash
# Search directly
python -m cdd.rag.core.cli search "your query"

# AI answer directly
python -m cdd.rag.core.cli ask "your question"

# With options
python -m cdd.rag.core.cli search "migrations" --type feature --limit 10

# Show statistics
python -m cdd.rag.core.cli stats

# Update index
python -m cdd.rag.core.cli update
```

### Programmatic Access
```python
# From CDD command hooks
from cdd.rag.core.query_engine import QueryEngine

engine = QueryEngine()
results = engine.search("authentication", limit=5)

for result in results:
    print(f"{result.source}: {result.score}")
    print(result.content)
```

---

## Examples by Use Case

### Onboarding New Developer
```bash
/cdd:query "What's our tech stack?" --ai
/cdd:query "How do we handle testing?" --ai
/cdd:query "What's our deployment process?" --ai
```

### Maintaining Consistency
```bash
/cdd:query "error handling patterns"
/cdd:query "API response formats"
/cdd:query "database migration strategy"
```

### Finding Similar Work
```bash
/cdd:query "user profile features" --status completed
/cdd:query "authentication implementations" --type feature
```

### Understanding Evolution
```bash
/cdd:query "How has our auth approach changed?" --ai
/cdd:query "What patterns emerged for state management?" --ai
```

---

## Cost Reference

| Operation | Time | Cost | Offline? |
|-----------|------|------|----------|
| Search (basic) | ~50-100ms | $0 | ✅ Yes |
| Search (with filters) | ~50-100ms | $0 | ✅ Yes |
| AI Answer (GPT-4o-mini) | ~1-2s | ~$0.0006 | ❌ No |
| AI Answer (Claude-3-Haiku) | ~1-2s | ~$0.0011 | ❌ No |
| AI Answer (Llama-3-8B) | ~1-2s | ~$0.0003 | ❌ No |
| Indexing (100 files) | ~30s | $0 | ✅ Yes |
| Index update | ~5s | $0 | ✅ Yes |

**Monthly estimates** (moderate use):
- 200 searches: $0
- 50 AI answers: ~$0.03 (GPT-4o-mini)
- Total: **< $0.50/month**

---

## Support

- **Setup**: See `cdd/.rag/SETUP.md`
- **Configuration**: See `cdd/.rag/docs/CONFIGURATION.md`
- **Integration**: See `cdd/.rag/docs/CDD_INTEGRATION.md`
- **Troubleshooting**: See `cdd/.rag/docs/TROUBLESHOOTING.md`

---

## Command Implementation

This command is implemented by calling the RAG query engine:

```python
# From slash command processor
from cdd.rag.core.query_engine import QueryEngine
from cdd.rag.core.llm_client import LLMClient

def execute_query_command(query: str, use_ai: bool = False, **filters):
    """Execute /cdd:query command"""
    engine = QueryEngine()

    # Search
    results = engine.search(query, **filters)

    if not results:
        return format_no_results(query)

    if use_ai:
        # AI answer
        llm = LLMClient()
        answer = llm.answer(query, results)
        return format_ai_response(query, results, answer)
    else:
        # Search results only
        return format_search_results(query, results)
```

---

**This command transforms your CDD workspace into an intelligent, searchable knowledge base!** 🚀

**Quick Start**:
1. Verify RAG is installed: `ls cdd/.rag`
2. Check index: `python -m cdd.rag.core.cli stats`
3. Try it: `/cdd:query "your topic"`

**Next**: Explore with different queries and discover patterns in your project!
