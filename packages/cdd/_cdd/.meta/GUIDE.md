# CDD User Guide - Zero Ceremony

> **Purpose:** Understand CDD methodology, best practices, and context stewardship
> **Audience:** Developers using CDD day-to-day
> **Quick Start:** See [QUICK_START.md](../../QUICK_START.md) for installation and first steps

---

## Core Principles

### 1. Speed Over Perfection

**CDD way:** Start in 30 seconds, capture context as you work.

**Why it matters:**
- Context quality comes from iteration, not upfront planning
- Starting fast keeps you in flow state
- Progressive disclosure: add detail when it's actually needed

**Example:**
```bash
# 30 seconds to start
/cdd:start fix login timeout bug

# AI creates minimal structure, you start coding
# Refine CONTEXT.md as you discover root cause
```

---

### 2. Zero Ceremony

**No mandatory tracking:**
- Session logs? Optional (but recommended)
- Status updates? Only if you want them
- Documentation? Only what helps future you

**What this means in practice:**
- `/cdd:log` is there when you need it, skip when you don't
- No fields you "must" fill out
- No automated nagging or reminders
- Context serves you, not the other way around

---

### 3. Humans Decide, AI Assists

**The problem:** AI makes decisions without research, humans rubber-stamp them.
**CDD solution:** AI researches in parallel, humans make informed decisions.

**Embodied in `/cdd:decide`:** 4 agents research in parallel (advocates, codebase analyzer, objective comparison). You get findings from all angles. You make the call.

---

## The Workflow

### Create Work Item (`/cdd:start`)

**What it creates:**
```
_cdd/XXXX-work-name/
├── CONTEXT.md      # Progressive template (expand as needed)
└── SESSIONS.md     # Session log (append as you work)
```

**CONTEXT.md structure:**
- **Original Prompt** - What you asked for (iterate on this!)
- **Why (Problem)** - 2-3 sentences
- **Solution** - High-level approach
- **Tasks** - Grouped in phases (collapsible)
- **Context for AI** - Patterns, key files, constraints
- **Decisions** - Major choices (collapsible)

**Best practices:**
- Start minimal, expand as you learn
- Use collapsible sections (`<details>`) for optional detail
- Problem/solution first, tasks can wait
- Don't overthink it - 30 seconds to start

---

### Log Progress (`/cdd:log`)

**What it does:**
1. Detects changed files (via git)
2. Matches files to tasks in CONTEXT.md
3. Suggests task completions
4. Appends session entry to SESSIONS.md

**Best practices:**
- Run at end of session (habit formation)
- Let AI auto-detect tasks when possible
- Add notes for non-obvious decisions
- Use "Next:" to resume faster

---

### Make Decisions (`/cdd:decide`)

**When to use:**
- Choosing between 2+ technical approaches
- Architecture decisions (REST vs GraphQL, SQL vs NoSQL)
- Library/framework selection
- Performance vs complexity trade-offs

**What you get:** `_cdd/XXXX-work-name/decisions/YYYY-MM-DD-topic.md` with problem statement, options researched, codebase analysis, recommendation, and trade-off matrix.

**Best practices:**
- Use for non-trivial decisions (not "what to name this variable")
- Let agents research while you code something else
- Document YOUR final decision in CONTEXT.md Decisions section
- Link to full analysis: `See decisions/2024-02-13-rest-vs-graphql.md`

---

### Complete Work (`/cdd:done`)

**What it does:**
1. Checks all tasks marked complete
2. Prompts for final session entry
3. Updates status to "complete"
4. Optionally generates summary

**Best practices:**
- Mark complete only when truly done
- Don't skip final session log
- Archive or link to deployment
- Identify follow-up work (if any)

---

## Context Stewardship

### Why Context Quality Matters

**Good context:**
- Future you resumes in < 5 minutes after 2 weeks away
- AI suggestions align with your codebase patterns
- Decisions documented, not forgotten
- Handoffs seamless (for teams)

**Poor context:**
- Wastes time re-learning what you already knew
- AI suggests patterns you don't use
- Repeat mistakes because you forgot why you chose X
- Handoffs require meetings to explain "what's actually going on"

---

### When to Update CONTEXT.md

Update immediately when:
- ✏️ Requirements change (problem or solution shifts)
- ✏️ Major decision made (architecture, library choice)
- ✏️ Discovered something non-obvious (gotcha, constraint)
- ✏️ Tasks need adjustment (discovered new sub-tasks)

Don't update for:
- ❌ Minor implementation details (code shows this)
- ❌ Every tiny decision (decision fatigue)
- ❌ Things that won't help future you

**Rule of thumb:** If you'd want to know this when resuming after 2 weeks, document it.

---

### Progressive Disclosure in Practice

Start minimal (problem + solution in 2-3 sentences). Expand as you learn:
- Narrow the problem as root cause is discovered
- Evolve solution from hypothesis to approach
- Add decisions with rationale when made (collapsed by default)

**Rule of thumb:** If you'd want to know this after 2 weeks away, document it now.

---

### Task Management

**Use phases for organization:** Open current phase, collapse completed ones.

- Add `**Files:**` hints for auto-detection by `/cdd:log`
- Add `**Done when:**` for clear completion criteria
- Update as you discover new tasks mid-work

See `_cdd/.meta/templates/CONTEXT.md` for the full task structure.

---

## Working with Teams

### Handoff Protocol

**When transferring work:**

1. **Update CONTEXT.md** (5 min)
   - Ensure problem/solution current
   - Mark completed tasks
   - Document any blockers

2. **Add handoff session** (SESSIONS.md): note what's complete, current state, and blockers for the new owner.

3. **Quick sync** (10 min)
   - Walk through CONTEXT.md
   - Show what's in progress
   - Answer questions

**New owner:**
- Read CONTEXT.md (understand why)
- Read last 2-3 SESSIONS.md entries (understand where we are)
- Add your own session entry (confirms understanding)

---

### Collaboration Tips

**For small teams (2-5 people):**
- One CONTEXT.md per work item (not per person)
- Each person adds their own session entries
- Use `/cdd:decide` for decisions affecting multiple people
- Brief syncs when sessions overlap

**For solo developers:**
- CONTEXT.md is for "future you" (treat like a team member)
- Session logs help resume after context switching
- Decisions document your reasoning (prevent flip-flopping)

---

## Anti-Patterns to Avoid

### ❌ "I'll document it later"
**Problem:** Later never comes, context lost
**Fix:** Update CONTEXT.md in the moment (30 seconds)

### ❌ Documenting everything exhaustively
**Problem:** Too much detail, no one reads it
**Fix:** Focus on "why" and decisions, code shows "what"

### ❌ Copy-paste without customization
**Problem:** Generic context doesn't help
**Fix:** Delete sections you don't need, expand what matters

### ❌ Skipping session logs
**Problem:** Can't remember what you did yesterday
**Fix:** Make `/cdd:log` end-of-session habit (1 min)

### ❌ Using AI as decision-maker
**Problem:** AI doesn't understand your constraints
**Fix:** Use `/cdd:decide` for research, YOU make the call

### ❌ Over-planning before starting
**Problem:** Wastes time, plan changes anyway
**Fix:** Start in 30 sec, refine as you learn

---

## FAQ

**Q: When should I use `/cdd:decide`?**
A: When you have 2+ valid options and research would help. Not for trivial choices.

**Q: Do I have to log every session?**
A: No, but it's highly recommended. Helps you and helps AI understand your workflow.

**Q: Can I use CDD for bugs?**
A: Yes! `/cdd:start fix login timeout` works great. Use type=bug in frontmatter.

**Q: How do I archive completed work?**
A: Keep it in `_cdd/`. It's valuable reference. If you must, move to `_cdd/.archive/YYYY/`.

**Q: What if my work item grows too big?**
A: Split it! Create new work items, link them in CONTEXT.md. Epics = multiple work items.

**Q: Should I commit CONTEXT.md to git?**
A: Yes! It's part of your codebase. Session logs too (shows work history).

**Q: Can I customize templates?**
A: Yes, edit `_cdd/.meta/templates/CONTEXT.md` in your project. Don't edit the package files.

**Q: Does this work outside Claude Code?**
A: CDD is methodology-first. Commands are for Claude Code, but principles apply anywhere.

---

## Getting Help

**Resources:**
- [Quick Start](../../QUICK_START.md) - Installation and first steps
- [README](../../README.md) - Philosophy and overview
- [GitHub Discussion](https://github.com/emb715/_cdd/discussions) - Discussions and questions
