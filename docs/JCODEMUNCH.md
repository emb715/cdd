# jcodemunch-mcp + CDD

> **Official repo:** https://github.com/jgravelle/jcodemunch-mcp

jcodemunch-mcp is an MCP server that indexes your codebase using tree-sitter AST parsing and exposes structured retrieval tools directly in your Claude Code session. It claims up to 99% token reduction compared to reading full files — on a 338-file repo, symbol search returned 1,449 tokens vs 7,500+ for a full file read.

---

## Requirements

- **Python 3.10+** and **pip**
- **Claude Code** with MCP support
- A git repository to index

---

## Installation

Follow **Official repo:** https://github.com/jgravelle/jcodemunch-mcp

Then index your project at the start of a session:

```
Ask Claude: "index this repo with jcodemunch"
```

The index persists across tool calls within a session. Re-index when you make significant file changes.

---

## Core Features

### Token-Efficient Code Retrieval

Instead of loading full files, jcodemunch retrieves only the symbols (functions, classes, methods) you need. Each response includes a `_meta` envelope with `timing_ms`, `tokens_saved`, and `cost_avoided`.

### Supported Languages (15+)

Python, JavaScript, TypeScript, TSX, Go, Rust, Java, PHP, Dart, C#, C, C++, Swift, Elixir, Ruby, and more.

### Index Options

- **Local folder:** `index_folder` — index any directory on disk
- **GitHub repo:** `index_repo` — index directly from a GitHub URL (owner/repo)
- **Incremental:** Re-indexing only processes changed files by default

---

## Available Tools (in-session)

Once installed, these tools are available to Claude automatically:

| Tool | Purpose |
|------|---------|
| `index_folder` | Index a local directory |
| `index_repo` | Index a GitHub repository by URL |
| `list_repos` | List all indexed repositories |
| `get_repo_outline` | High-level overview: directories, language breakdown, symbol counts |
| `get_file_tree` | Browse indexed repository structure |
| `get_file_outline` | List all symbols (functions, classes, methods) in a file |
| `get_file_content` | Get cached source for a file, optionally sliced to a line range |
| `get_symbol` | Get full source of a specific symbol |
| `get_symbols` | Get full source of multiple symbols in one call |
| `search_symbols` | Find functions, classes, methods by name or description |
| `search_text` | Full-text search across indexed files (supports regex) |
| `invalidate_cache` | Delete index for a repo and force full re-index |

---

## How CDD Uses It

### `/cdd:decide` — Codebase Context Agent

`/cdd:decide` launches 4 parallel Sage agents, one of which is the **Codebase Context Agent**. Without jcodemunch, this agent uses basic file-pattern grep to find existing implementations. With jcodemunch installed and indexed, the agent uses:

- `search_symbols` — find existing functions, classes, and methods related to the decision
- `search_text` — find string literals, config values, and comments related to the decision
- `get_file_outline` — list all symbols in key files to understand current patterns
- `get_symbol` / `get_symbols` — fetch full implementation context for identified symbols

Result: The codebase analysis in your decision artifact reflects actual code structure, not just file names — leading to more accurate migration complexity estimates and better-aligned recommendations.

### `/cdd:log` — Task Auto-Matching

`/cdd:log` matches changed files to tasks in `CONTEXT.md` using file hints. With jcodemunch available, Claude can use `search_symbols` and `get_file_outline` to understand semantic relationships between changed files and task descriptions — catching task completions even when file paths change during refactors.

---

## When to Add It

Add jcodemunch when:
- Your project has **20+ source files**
- `/cdd:decide`'s codebase analysis feels shallow or generic
- `/cdd:log` misses task matches after refactors or file renames

For small projects, Claude's built-in Grep is sufficient.

---

## Official Docs

Full documentation, advanced configuration: https://github.com/jgravelle/jcodemunch-mcp
[USER GUIDE](https://github.com/jgravelle/jcodemunch-mcp/blob/main/USER_GUIDE.md)
