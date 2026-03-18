# Sage Specialist Instructions: /cdd:scope

Draft a scope plan for a large body of work. No work item folders are created here — this produces a single plan document for human review.

**Efficiency:** Scan project once. Produce a lean, editable plan file.

## Input

- `brief`: User-provided description of the workload
- `domain`: Pre-detected domain (from command step)
- `max_sequence`: Current max XXXX in _cdd/ (from command step)

## Steps

### 1. Analyze the Brief

Parse the brief to identify:
- Core problem or initiative
- Distinct areas of work (each becomes a work item candidate)
- Implied dependencies between areas
- Natural phase groupings (foundation → feature → polish, or similar)

**Item count heuristics:**
- 2-4 items: Small epic or scoped migration
- 5-8 items: Standard sprint or medium greenfield
- 9-10 items: Large greenfield (suggest splitting if >10)

If brief implies >10 distinct areas, note: "This scope is large. Consider breaking into 2 separate /cdd:scope calls."

### 2. Scan Project Structure

Scan once, use everywhere.
Note primary language and framework.

**Existing source code** — list top-level directories and key files. Note modules that are already built and relate to the brief — these inform item type (extending existing = refactor or feature, replacing = refactor, net-new = feature) and help avoid duplicating work.

**Existing _cdd/ work items** — read titles from any active CONTEXT.md files (`status: draft` or `in-progress`). Note their scope to avoid overlap with new items.

**No existing code or _cdd/ items** — project is greenfield. Start sequence at 0001, default all types to feature.

Use findings to:
- Set item type accurately (refactor if touching existing code, feature if net-new)
- Name items to match existing module/folder conventions in the project
- Note in item purpose if it extends or replaces something already built
- Skip items the brief implies but that are already covered by active _cdd/ work

### 3. Draft Work Items

For each identified area of work, define:

| Field | Rules |
|-------|-------|
| **#** | Sequential row number (not folder sequence) |
| **Folder Name** | `XXXX-kebab-case-name` starting from max_sequence+1 |
| **Type** | feature\|bug\|refactor\|spike\|epic — infer from area description |
| **Purpose** | One sentence: what this item delivers |
| **Depends On** | Row numbers this item genuinely blocks on. Default: `-` |

**Dependency rules:**
- Only mark a dependency if the item cannot realistically start without the other
- Auth/foundation items typically have no dependencies
- Feature items often depend on foundation
- Admin/ops items typically depend on core features
- Do not chain everything — keep dependencies sparse

**Type detection:**
- New capability → feature
- Fixing something broken → bug
- Improving existing structure → refactor
- Research/unknown outcome → spike
- Multi-month initiative → epic

### 4. Group into Phases

Derive 2-4 phases from the dependency structure:
- Phase 1: Items with no dependencies (foundation, infra, auth)
- Phase 2: Items that depend only on Phase 1
- Phase 3+: Items with deeper dependency chains

Keep phase names descriptive but brief: "Foundation", "Core Features", "Operations", "Polish"

If all items are independent (no dependencies), write `Phase Grouping: none — all items can start in parallel.` instead of listing phases.

### 5. Save Scope Plan

Generate slug: take the first 2-3 meaningful words from the brief, lowercase, spaces→hyphens, drop filler words (a, the, to, for, with). Example: "migrate monolith to microservices: user service, order service" → `migrate-monolith`. Example: "greenfield SaaS: auth, billing, API" → `greenfield-saas`.

File path: `_cdd/scope/YYYY-MM-DD-[slug].md`

Create `_cdd/scope/` directory if it doesn't exist.

Read template: `_cdd/.meta/templates/SCOPE_PLAN.md`

Populate template:
- `scope_id`: `YYYY-MM-DD-[slug]`
- `brief`: user-provided description, written into the YAML frontmatter using a YAML-safe representation (e.g., quoted string or block scalar) so arbitrary characters and newlines remain valid
- `created`: today's date (YYYY-MM-DD)
- `status`: `draft`
- Title: inferred from brief (title case, concise)
- Brief section: 1-2 sentences expanding on the problem/initiative
- Work items table: all rows
- Phase grouping: if applicable
- Review checklist: fill in "current max in _cdd/: XXXX" with actual value

### 6. Output

Return for display in the main conversation:

```
Scope plan drafted: _cdd/scope/[filename].md

| # | Folder Name          | Type    | Purpose                        | Depends On |
|---|----------------------|---------|--------------------------------|------------|
| 1 | XXXX-[name]          | feature | [purpose]                      | -          |
| 2 | XXXX-[name]          | feature | [purpose]                      | #1         |
...

Phase 1: [Name] — #1, #2
Phase 2: [Name] — #3, #4

Review the plan at _cdd/scope/[filename].md
Edit as needed, then start your first work item:

  /cdd:start [first-item-name] (scoped)
```

If no existing source code or _cdd/ items were found: note "No existing code detected — sequence starts at 0001."

## Design Interview (before drafting)

Before producing any output, run a structured interview to resolve ambiguity in the brief.

**Goal:** Reach shared understanding of what is being built before committing to a work item breakdown. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one.

**If a question can be answered by exploring the codebase, explore the codebase instead of asking.**

### Interview protocol

Ask one question at a time. Do not dump a list. Each answer may inform or close the next question — adapt.

Probe until these dimensions are resolved:

1. **Outcome** — What does "done" look like in concrete terms? (User-facing change? API contract? Infrastructure state?)
2. **Boundaries** — What is explicitly out of scope? What existing systems must not be touched?
3. **Constraints** — Hard deadlines, tech stack locks, performance requirements, team/solo context?
4. **Dependencies** — Anything that must exist before this work can start? External APIs, third-party services, pending work items?
5. **Risk areas** — Where is the most uncertainty? What is most likely to block?

Stop interviewing when you have enough to produce a non-ambiguous scope plan. Do not over-interview simple briefs — if the brief is already specific, ask at most 1-2 clarifying questions before proceeding.

### Design principle

The interview front-loads cost to reduce total cost. Ambiguous scope produces bad work item breakdowns, which produce bad loop agent output, which requires retries and human intervention. One good question now is worth avoiding three broken tasks later.

## Execution Rules

Autonomous after interview. Infer remaining defaults from brief and project scan.

If the brief clearly describes a single work item (one feature, no distinct areas of work or phases): abort scope planning and respond with a short message redirecting the user to `/cdd:start` using that brief as the first work item.
If the brief is ambiguous (could be 1 item or multiple): produce the scope plan anyway, but include a note: "If this is a single feature, use /cdd:start instead."

Errors:
- No brief → abort, show usage
- _cdd/scope/ can't be created → abort with message
- Template not found → create plan file without template (use inline structure)
