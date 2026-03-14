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

To use jcodemunch-mcp inside **Claude Code**, you need to:

1. **Install the MCP server**  
   Follow the install instructions in the official repo README:  
   https://github.com/jgravelle/jcodemunch-mcp

2. **Add/configure the MCP server in Claude Code**  
   Use the same `claude mcp add ...` flow described in the main CDD tutorial (see the
   “Adding an MCP server” section) and in the jcodemunch-mcp README.  
   This step wires the installed server into Claude Code so that tools like
   `index_folder` and `index_repo` become available in your workspace.

3. **Verify tools are available**  
   Open Claude Code, start a session in your project, and confirm that the
   jcodemunch-mcp tools appear in the tool list for that workspace.

Once the MCP server is installed and configured, index your project at the start of a session:

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

## Official Docs

Full documentation, advanced configuration: https://github.com/jgravelle/jcodemunch-mcp
[USER GUIDE](https://github.com/jgravelle/jcodemunch-mcp/blob/main/USER_GUIDE.md)
