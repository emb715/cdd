# /cdd:catch — Agent Instructions

## Purpose

Scan the current conversation session and extract non-obvious gotchas into `_cdd/gotchas/`. No user input needed. No questions asked. Write what's worth capturing, skip the rest.

## What qualifies as a gotcha

Capture it if:
- An agent made a mistake that required a fix or review cycle
- A behavior was silent or counter-intuitive (no error, wrong result)
- A reviewer flagged a BLOCKING issue
- A corrected approach was meaningfully different from the first attempt
- The mistake could easily recur on any future work item

Do NOT capture:
- One-off typos or trivial mistakes
- Framework basics that are in the docs
- Things that only apply to this specific work item's business logic

## Process

1. Scan the full conversation for qualifying moments
2. For each candidate:
   a. Generate a slug: kebab-case, 3-5 words, descriptive (e.g. `convex-optional-vs-null`)
   b. Check if `_cdd/gotchas/[slug].md` already exists — if yes, skip (no overwrite)
   c. Classify severity:
      - `blocking` — caused or would cause a BLOCKING review issue
      - `critical` — silent data corruption, auth/security failure, broken pipeline
      - `gotcha` — non-obvious pattern, surprising behavior, easy to miss
   d. Infer tags from the tech surface (e.g. `convex`, `auth`, `ci-cd`, `expo`)
3. Write all new entries in one pass using GOTCHA_TEMPLATE.md format
4. Output: list of files written, or "No new gotchas found"

## File format

Read `_cdd/.meta/templates/GOTCHA_TEMPLATE.md` for the canonical format.

Key rules:
- **Rule** must start with Always, Never, or Check
- **Why** is one sentence — the root cause, not a symptom
- **Bad/Good** examples: include only if the distinction is code-level and non-obvious
- Omit Bad/Good if the rule is purely conceptual or config-level

## Output

After writing:
```
Gotchas captured:
- _cdd/gotchas/[slug].md ([severity])
- ...

Skipped (already exists):
- [slug]
```

If nothing qualifies: `No new gotchas found.`
