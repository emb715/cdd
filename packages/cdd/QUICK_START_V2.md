# CDD v2.0 Quick Start Guide

> **Get started in 2 minutes. Zero ceremony.**

## Installation (30 seconds)

```bash
npm install -g @emb715/cdd
cd your-project/
npx @emb715/cdd init
```

✅ Done! You now have:
- `cdd/` folder (work items go here)
- `.claude/commands/` (AI commands)
- `cdd/.meta/templates/v2/` (templates)

---

## The 4-Command Workflow

### 1. Start Work (`/cdd:start`)

```bash
/cdd:start add user authentication
```

**What happens:**
- Creates `cdd/0001-add-user-authentication/`
- Creates `CONTEXT.md` (problem, solution, tasks)
- Creates `SESSIONS.md` (empty, ready)
- Takes 30 seconds

**Output:**
```
✅ Work item created!
📁 cdd/0001-add-user-authentication/
```

---

### 2. Code & Log (`/cdd:log`)

```bash
# You code for a while...
# (create files, modify code, etc.)

# Then log:
/cdd:log
```

**What happens:**
- Auto-detects work item from git changes
- Matches changed files to tasks
- Marks tasks complete
- Appends to SESSIONS.md
- Takes 10 seconds

**Output:**
```
✅ Session logged!
⏱️  1.5h
✅ Completed: 2 tasks
```

---

### 3. Make Decisions (`/cdd:plan`)

```bash
/cdd:plan Should we use PostgreSQL or MongoDB?
```

**What happens:**
- Spawns 4 AI agents in parallel:
  - PostgreSQL advocate
  - MongoDB advocate
  - Codebase analyzer
  - Analysis agent
- Researches for 2-3 minutes
- Presents findings + AI suggestion
- **You make final decision**
- Saves decision with your rationale

**Output:**
```
🤖 AI SUGGESTION: PostgreSQL
Confidence: 🟢 High

Supporting Evidence:
1. You already use Postgres
2. JSONB handles key-value
3. Team familiar with SQL

💭 What's your decision? (A/B/C)
> You choose: A

✅ YOUR DECISION: PostgreSQL
```

---

### 4. Finish (`/cdd:done`)

```bash
/cdd:done
```

**What happens:**
- Marks status as complete
- Adds final session log
- Optional: generates summary

**Output:**
```
✅ Work completed!
🏁 Status: complete
⏱️  5 sessions, ~12h
```

---

## File Structure

```
your-project/
├── cdd/
│   ├── 0001-user-auth/
│   │   ├── CONTEXT.md          # Single source of truth
│   │   ├── SESSIONS.md         # Session log
│   │   └── decisions/          # Multi-agent decisions (optional)
│   │       └── 2024-01-15-db-choice.md
│   └── 0002-dark-mode/
│       ├── CONTEXT.md
│       └── SESSIONS.md
├── .claude/
│   └── commands/
│       ├── cdd:start.md        # The 4 commands
│       ├── cdd:log.md
│       ├── cdd:plan.md
│       └── cdd:done.md
└── cdd/.meta/
    └── templates/v2/           # Templates
```

---

## CONTEXT.md Anatomy

The heart of v2 - everything in one file:

```markdown
---
id: 0001
title: User Authentication
type: feature
status: in-progress
created: 2024-01-15
updated: 2024-01-16
---

# User Authentication

## 🎯 Why (Problem)
[2-3 sentences: what problem are you solving?]

## 💡 Solution
[2-3 sentences: how will you solve it?]

## ✅ Tasks

<details open>
<summary><strong>Phase 1: Foundation</strong> (2/3 complete)</summary>

- [x] Setup OAuth providers
      **Files:** `lib/auth/oauth.ts`
      **Done when:** Config file exists, tests pass

- [x] Create JWT service
      **Files:** `lib/auth/jwt.ts`, `lib/auth/jwt.test.ts`
      **Done when:** Service implemented, tests passing

- [ ] Add session middleware
      **Files:** `lib/middleware/auth.ts`
      **Done when:** Middleware integrated, routes protected

</details>

## 🧠 Context for AI

**Patterns to follow:**
- Use existing `TokenService` pattern

**Key files:**
- `lib/auth/` - Auth utilities

## 📝 Decisions

<details>
<summary><strong>2024-01-15: OAuth vs Custom Auth</strong></summary>

**Decision:** OAuth2

**Rationale:** Better security, users prefer it

**See full analysis:** [decisions/2024-01-15-auth-strategy.md](decisions/2024-01-15-auth-strategy.md)

</details>
```

**Key features:**
- ✅ Single file (no jumping around)
- ✅ Progressive disclosure (collapse/expand sections)
- ✅ Task hints (files → auto-detection)
- ✅ AI-friendly (clear context)

---

## Real Examples (Copy These!)

### Example 1: Bug Fix Flow

**Problem:** Login times out after 5 minutes

```bash
# Start
/cdd:start fix login timeout after 5 minutes

# Work...
# (You investigate, find session expiry bug, fix it)

# Log
/cdd:log
# AI: "Detected: auth.config.ts modified. Mark 'Fix session timeout' complete? (y)"
# You: y

# Done
/cdd:done
```

**SESSIONS.md entry created:**
```markdown
## 2024-01-15 10:30 (1h)

Completed:
- Fix session timeout configuration

Issue:
- Session expiry set to 5min (should be 30min)

Fix:
- Updated auth.config.ts SESSION_TIMEOUT to 1800

Next:
- Monitor production logs
```

---

### Example 2: Feature with Hard Decision

**Problem:** Need caching layer, unsure which technology

```bash
# Start
/cdd:start implement caching layer

# Hit decision point
/cdd:plan Redis vs Memcached vs in-memory cache

# AI launches agents (2 min)...
# 🤖 AI SUGGESTION: Redis (Confidence: 🟢 High)
#    Evidence: You already use Redis for sessions, team knows it
# 💭 Your decision? (A/B/C)

# You: A (accept)

# AI: "✅ YOUR DECISION: Redis. Saved to decisions/2024-01-15-caching.md"

# Code based on decision...
# (Implement Redis cache)

# Log
/cdd:log

# Done
/cdd:done --summary
```

**Decision artifact saved:**
```
cdd/0003-caching-layer/
├── CONTEXT.md
├── SESSIONS.md
└── decisions/
    └── 2024-01-15-caching-strategy.md
```

---

### Task Auto-Detection Example

**CONTEXT.md:**
```markdown
## ✅ Tasks

- [ ] Setup OAuth provider
      **Files:** `lib/auth/oauth.ts`
- [ ] Add login UI
      **Files:** `components/Login.tsx`, `components/Login.test.tsx`
```

**You work and create:**
```
lib/auth/oauth.ts (new)
lib/auth/providers/google.ts (new)
components/Login.tsx (new)
components/Login.test.tsx (new)
```

**You run:**
```bash
/cdd:log
```

**AI detects:**
```
Auto-detected completions:
✅ Setup OAuth provider
   → lib/auth/oauth.ts created

✅ Add login UI
   → components/Login.tsx created
   → components/Login.test.tsx created

Mark both complete? (y/n)
```

**Smart matching:**
- Exact: `lib/auth/oauth.ts` = `lib/auth/oauth.ts`
- Related: Test file created alongside source = both complete
- Glob: `lib/auth/providers/*.ts` matches any file in that folder

---

## Common Workflows

### Workflow 1: Simple Feature

```bash
# Create
/cdd:start add dark mode toggle

# Code...
# (implement dark mode)

# Log
/cdd:log

# Done
/cdd:done
```

**Time:** 1 session, no decisions needed

---

### Workflow 2: Complex Feature with Decisions

```bash
# Create
/cdd:start implement caching layer

# Research decision
/cdd:plan "Redis vs Memcached vs in-memory"

# Code based on decision
# (implement chosen approach)

# Log progress
/cdd:log

# Make another decision
/cdd:plan "Caching strategy: write-through vs write-back"

# Code more
# Log more

# Done
/cdd:done --summary
```

**Time:** Multiple sessions, 2+ decisions

---

### Workflow 3: Bug Fix

```bash
# Create
/cdd:start fix login timeout after 5 minutes

# Investigate
# (find root cause)

# Code fix
# (implement solution)

# Log
/cdd:log

# Done
/cdd:done
```

**Time:** 1-2 sessions

---

## Advanced Tips

### Enable Metrics (Optional)

```bash
/cdd:start my-feature --track-metrics
```

Metrics tracked in CONTEXT.md frontmatter:
```yaml
metrics:
  sessions: 3
  hours: 5.5
  tasks_completed: 8
  tasks_planned: 12
```

View metrics:
```bash
node cdd/.meta/metrics/scripts/collect-metrics-v2.js
```

### Task Auto-Detection

Add file hints to tasks:
```markdown
- [ ] Implement OAuth
      **Files:** `lib/auth/oauth.ts`, `lib/auth/providers/*.ts`
```

When `/cdd:log` runs, it matches git changes to these files and auto-marks complete.

### Decision Reuse

Reference past decisions:
```markdown
**See previous:** [decisions/2024-01-10-similar-topic.md](decisions/2024-01-10-similar-topic.md)
```

### Multiple Work Items in Parallel

```bash
# Work on feature 1
/cdd:start feature A
# ... code ...
/cdd:log

# Switch to feature 2
/cdd:start feature B
# ... code ...
/cdd:log

# Both tracked separately
```

---

## Command Flags

### `/cdd:start` flags

```bash
/cdd:start [description]                    # Basic
/cdd:start [description] --type=bug         # Override type
/cdd:start [description] --track-metrics    # Enable metrics
```

### `/cdd:log` flags

```bash
/cdd:log                    # Auto-detect
/cdd:log 0001               # Specific work item
/cdd:log --force            # Skip confirmations
```

### `/cdd:plan` flags

```bash
/cdd:plan [topic]                         # Binary or open-ended
/cdd:plan --options="A,B,C" [topic]       # Multi-option
```

### `/cdd:done` flags

```bash
/cdd:done                   # Simple completion
/cdd:done --summary         # Generate IMPLEMENTATION_SUMMARY.md
/cdd:done --skip-log        # Don't add final session
```

---

## ⏱️ Time Budget Reference

| Task | Time | When |
|------|------|------|
| Create work item | 30 sec | Once per feature/bug |
| Log session | 10 sec | After each work session |
| Make simple decision | 0 sec | Just decide and document |
| Multi-agent decision | 2-5 min | Hard technical choices |
| Mark complete | 30 sec | When all tasks done |
| Generate summary | 1 min | Optional at completion |

**Rule of thumb:**
- Use `/cdd:plan` when: "I'm not sure which is better, need research"
- Just decide when: "I know what to do, just documenting it"

---

## Troubleshooting

### "Work item not found"

**Problem:** `/cdd:log` can't find work item

**Solution:**
```bash
# Specify explicitly
/cdd:log 0001

# Or check folder name
ls cdd/
```

### "No file changes detected"

**Problem:** You worked but git shows no changes

**Solution:**
```bash
# Check git status
git status

# Or specify work manually
/cdd:log 0001
# Then describe what you did
```

### "Agent failed to complete"

**Problem:** Multi-agent decision had errors

**Solution:**
- Retry: `/cdd:plan [topic]` again
- Or simplify: Research manually, document in CONTEXT.md

---

## Anti-Patterns: What NOT to Do

### ❌ Don't: Log every 5 minutes
**Problem:** Noisy sessions log, overhead
**Instead:** Log every 30-60 minutes or at natural breakpoints

### ❌ Don't: Use /cdd:plan for simple choices
**Problem:** Wastes 2-5 minutes on obvious decisions
**Instead:** Just decide and add to CONTEXT.md Decisions section manually

### ❌ Don't: Skip file hints in tasks
**Problem:** Auto-detection can't match tasks
**Instead:** Add `**Files:**` hints for auto-completion

### ❌ Don't: Create work items for 5-minute changes
**Problem:** Overhead > work
**Instead:** Use CDD for features/bugs taking >30 minutes

### ❌ Don't: Enable metrics for every work item
**Problem:** Frontmatter pollution, slows logging
**Instead:** Only use `--track-metrics` when you need data

### ✅ Do: Keep CONTEXT.md focused
**Why:** Long context = slower AI comprehension
**How:** Use `<details>` for optional sections, keep Problem/Solution concise

---

## Cheat Sheet

### Starting work
```bash
/cdd:start add dark mode toggle
/cdd:start fix login bug --type=bug
/cdd:start refactor API layer --track-metrics
```

### Logging progress
```bash
/cdd:log                    # Auto-detect everything
/cdd:log 0001               # Specific work item
/cdd:log --force            # Skip confirmations
```

### Making decisions
```bash
/cdd:plan Should we use REST or GraphQL?
/cdd:plan "Best auth strategy" --options="OAuth,Custom,Magic Link"
```

### Finishing
```bash
/cdd:done                   # Simple
/cdd:done --summary         # With documentation
```

### File hints for auto-detection
```markdown
- [ ] Task name
      **Files:** `path/to/file.ts`
      **Done when:** Tests passing
```

---

## Next Steps

1. ✅ **Install:** `npx @emb715/cdd init`
2. ✅ **Create:** `/cdd:start your-first-feature`
3. ✅ **Code:** Build something!
4. ✅ **Log:** `/cdd:log`
5. ✅ **Read:** [README-v2.md](README-v2.md) for deep dive

---

## Getting Help

- **Docs:** [README.md](README.md)
- **Examples:** `cdd/0000-example/`
- **Templates:** `cdd/.meta/templates/v2/`
- **Issues:** https://github.com/emb715/cdd/issues

---

**Happy building! 🚀**

*CDD v2.0 - Zero ceremony, maximum flow*
