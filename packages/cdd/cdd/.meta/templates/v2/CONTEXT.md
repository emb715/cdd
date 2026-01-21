---
id: XXXX
title: [Work Title]
type: feature|bug|refactor|spike|epic
status: draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# [Work Title]

## 🎯 Why (Problem)

> What problem are you solving? Keep it concise (2-3 sentences).

[Describe the problem this work addresses]

## 💡 Solution

> How will you solve it? High-level approach only.

[Describe your solution approach in 2-3 sentences]

## ✅ Tasks

> Progressive disclosure: Expand sections as you work through them

<details open>
<summary><strong>Phase 1: [Phase Name]</strong> (0/X complete)</summary>

- [ ] **Task 1.1:** Description
      **Files:** `path/to/file.ts`, `path/to/test.ts`
      **Done when:** Specific completion criteria

- [ ] **Task 1.2:** Description
      **Files:** `path/to/file.ts`
      **Done when:** Specific completion criteria

</details>

<details>
<summary><strong>Phase 2: [Phase Name]</strong> (0/X complete)</summary>

- [ ] **Task 2.1:** Description
      **Files:** `path/to/file.ts`
      **Done when:** Specific completion criteria

</details>

**Quick Add Tasks:**
- [ ] Additional task (no file hints needed)

## 🧠 Context for AI

> Help the AI help you - what should it know?

**Patterns to follow:**
- [List existing patterns, components, or utilities to reference]

**Key files:**
- `path/to/file.ts` - Purpose/description
- `path/to/another.ts` - Purpose/description

**Constraints:**
- [Technical constraints, limitations, or requirements]

**Notes:**
- [Any other context that would help during implementation]

## 📝 Decisions

> Major technical/architectural decisions - collapsed by default

<details>
<summary><strong>YYYY-MM-DD: [Decision Title]</strong></summary>

**Decision:** What YOU decided

**Your Rationale:** Why you chose this

**AI Suggested:** What AI recommended (accepted/overrode)

**Trade-offs:** What you're giving up

**Alternatives considered:**
- Option A: Why not chosen
- Option B: Why not chosen

**See full analysis:** [decisions/YYYY-MM-DD-topic.md](decisions/YYYY-MM-DD-topic.md) *(if multi-agent planning)*

</details>

---

**Quick Commands:**
- `/cdd:log` - Save session progress
- `/cdd:plan [topic]` - Launch multi-agent decision planning (AI researches, you decide)
- `/cdd:done` - Mark work complete
