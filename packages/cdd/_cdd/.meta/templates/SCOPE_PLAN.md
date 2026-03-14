---
scope_id: YYYY-MM-DD-[slug]
brief: [original user input]
created: YYYY-MM-DD
status: draft
---

# Scope: [Title]

## Brief

[1-2 sentences describing the initiative or problem being scoped]

## Proposed Work Items

| # | Folder Name | Type | Purpose | Depends On |
|---|-------------|------|---------|------------|
| 1 | XXXX-[name] | feature | [one sentence] | - |
| 2 | XXXX-[name] | feature | [one sentence] | #1 |

## Phase Grouping

Phase 1: [Name] — #1, #2
Phase 2: [Name] — #3, #4

<!-- If all items are independent: write "none — all items can start in parallel." and remove the phase lines above -->

## Review Checklist

- [ ] Scope covers the full problem
- [ ] No obvious missing items
- [ ] Dependencies make sense
- [ ] Types are correct (feature/bug/refactor/spike/epic)
- [ ] Sequence numbers are correct (current max in _cdd/: XXXX)

---

> Edit freely. When ready, start your first work item:
> `/cdd:start [item-name] (scoped)`
