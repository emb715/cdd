# CDD Examples - Zero Ceremony

> **Purpose:** Real-world examples showing CDD methodology in practice
> **Audience:** New users learning CDD workflow

---

## Available Examples

### [0001-login-timeout-fix](0001-login-timeout-fix/)

**Type:** Bug fix (production issue)
**Complexity:** Medium (investigation + implementation)
**Duration:** 3 days (spread over 4 calendar days)

**What it demonstrates:**
- ✅ Progressive disclosure (started minimal, expanded as learned)
- ✅ Multiple decisions documented with `/cdd:decide`
- ✅ Session logs showing thought process
- ✅ Task phases (investigation → quick fix → proper solution)
- ✅ Trade-off analysis (heartbeat interval 30s vs 60s)

**Key takeaways:**
- Problem statement evolved as root cause discovered
- Quick fix deployed first, proper solution followed
- Decisions captured with rationale, not just "what"
- Sessions show debugging journey, not just results

**Files to study:**
- `CONTEXT.md` - See how problem/solution evolved
- `SESSIONS.md` - Notice debugging breadcrumbs
- `decisions/2024-02-11-session-strategy.md` - Multi-agent decision output

---

## Using These Examples

### For New Users

**Start here:**
1. Read `0001-login-timeout-fix/CONTEXT.md` top to bottom
2. Notice the progressive disclosure (collapsed sections)
3. Read `SESSIONS.md` to see the timeline
4. Check `decisions/` to see how `/cdd:decide` works

**What to look for:**
- How minimal the initial problem statement was
- How it expanded as investigation progressed
- How decisions link back to CONTEXT.md
- How sessions build context incrementally

### For Experienced Users

**Study patterns:**
- Task organization (phases with clear goals)
- Decision documentation (why, not just what)
- Context for AI (patterns, files, constraints)
- Trade-off clarity (what you're giving up)

**Adapt to your context:**
- Copy structure that fits your workflow
- Ignore sections that don't apply
- Add sections that help your team

---

## Example Philosophy

These examples follow the **zero ceremony** approach:

**Not perfect, but real:**
- Shows actual work progression, not idealized workflow
- Includes false starts and course corrections
- Documents what actually happened, not what "should have"

**Minimal but complete:**
- Only essential detail (no exhaustive documentation)
- Focuses on decisions and non-obvious context
- Trusts code to show implementation details

**Human-centric:**
- Written for future humans, not compliance
- Explains "why" before "what"
- Captures thought process, not just outcomes

---

## Questions?

**Need help understanding examples?**
- Open [GitHub Discussion](https://github.com/emb715/cdd/discussions)
