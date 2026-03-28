---
description: Extract gotchas from the current session into _cdd/gotchas/ for future loop injection
author: EMB (Ezequiel M. Benitez) @emb715
version: 1.0.0
---

# /cdd:catch

## Usage

```
/cdd:catch           # Scan session and save all qualifying gotchas
/cdd:catch --list    # Show all saved gotchas
```

## Process

On invocation:
1. Parse flags: `--list`
2. If `--list`: read all `_cdd/gotchas/*.md` frontmatter, output table, stop
3. Otherwise: spawn agent to extract and write gotchas

## Agent (extract mode)

Spawn Task, subagent=cdd-honest:

```
Execute /cdd:catch for this session.

Follow _cdd/.meta/instructions/catch.md exactly.
Scan the full conversation history for qualifying gotchas.
Write new entries to _cdd/gotchas/ using _cdd/.meta/templates/GOTCHA_TEMPLATE.md.
No questions. No user input needed.
```

## Agent (list mode)

Spawn Task, subagent=cdd-honest:

```
List all gotchas in _cdd/gotchas/.
Read each *.md file's frontmatter (id, severity, tags, created, times_avoided).
Output as a table: id | severity | tags | created | times_avoided
```

## Example

```
/cdd:catch
```

Output:
```
Gotchas captured:
- _cdd/gotchas/convex-optional-vs-null.md (critical)
- _cdd/gotchas/clerk-tokencache-cleartoken.md (critical)

Skipped (already exists):
- convex-compound-index-leading-field
```
