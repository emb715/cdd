# Context Stewardship Guide

> **Purpose:** Keep your CDD context fresh, accurate, and valuable over time.

Context is infrastructure. Like code, it requires maintenance. This guide defines when and how to review your work item context to prevent rot and maintain quality.

## Core Principle

**Context loses value when it drifts from reality.**

Good stewardship means:
- **Invariants stay true** - Problem definition, core goals don't change without deliberate decision
- **Variants stay current** - Implementation details, files, decisions reflect actual state
- **Staleness is visible** - You can quickly spot outdated context

---

## Review Cadence

### When Starting a Session
**Time:** 2-3 minutes
**Focus:** Orient yourself

**Checklist:**
- [ ] Read DECISIONS.md frontmatter - still accurate?
- [ ] Review last SESSION_NOTES.md entry - where did I leave off?
- [ ] Check IMPLEMENTATION_PLAN.md - what's next?
- [ ] Verify status still matches reality

**Red Flags:**
- Status says "in-progress" but you haven't touched it in weeks
- Context files listed don't exist anymore
- Dependencies resolved but still marked as blockers

### During Implementation (Major Decision Points)
**Time:** 5 minutes
**Focus:** Capture decision context

**Checklist:**
- [ ] Does this decision contradict DECISIONS.md? Update it.
- [ ] New risks or constraints discovered? Document them.
- [ ] Architecture changed? Update Technical Considerations section.
- [ ] New files created not in original plan? Add to context_files.

**Triggers:**
- Chose between 2+ technical approaches
- Discovered requirement missing from DECISIONS.md
- Hit unexpected constraint or limitation
- Changed API design or data model

### End of Session (Always)
**Time:** 5-10 minutes
**Focus:** Preserve context for future you

**Use `/cdd:save-session`** - it will prompt you for:
- What you completed
- Decisions made
- Problems encountered
- What's next

**Additional Stewardship:**
- [ ] Update DECISIONS.md if requirements changed
- [ ] Mark completed tasks in IMPLEMENTATION_PLAN.md
- [ ] Update status if it changed (draft → in-progress)

### Weekly Review (For Active Work)
**Time:** 10 minutes per work item
**Focus:** Validate alignment

**Checklist:**
- [ ] Goals in DECISIONS.md still valid?
- [ ] Context files still relevant?
- [ ] Dependencies/blockers current?
- [ ] Progress matching estimates?
- [ ] Any assumptions invalidated?

**Questions to Ask:**
- Would a new team member understand this context?
- Does DECISIONS.md reflect actual implementation?
- Are there undocumented decisions in code but not docs?

### Before Completion
**Time:** 15 minutes
**Focus:** Final validation

**Use `/cdd:complete-work`** - but first:
- [ ] All functional requirements (FR-X) actually met?
- [ ] Success metrics validated with evidence?
- [ ] All decisions documented (no tribal knowledge)?
- [ ] SESSION_NOTES.md tells coherent story?

**Evidence Required:**
- Test results (screenshots, logs, CI output)
- Links to deployed features
- Validation of acceptance criteria

---

## Spotting Stale Context

### Staleness Indicators

🚨 **Critical (Fix Immediately):**
- Status doesn't match reality (says "in-progress", actually abandoned)
- Context files reference non-existent files
- Dependencies list resolved blockers
- Functional requirements conflict with implementation

⚠️ **Warning (Review This Week):**
- Last session > 2 weeks ago
- Implementation diverged from DECISIONS.md approach
- New patterns in codebase not reflected in hints
- Open questions answered but not updated

💡 **Good to Update (When Convenient):**
- Minor implementation details outdated
- Better examples found for patterns
- Learned something that would help future implementer

### Quick Health Check (2 minutes)

Run through these questions:

1. **Recency:** When was context last updated? (check `updated:` in frontmatter)
2. **Alignment:** Does DECISIONS.md match SESSION_NOTES.md recent entries?
3. **Completeness:** Any TODOs or [TBD] markers still unfilled?
4. **Accuracy:** Random sample 3 file paths - do they exist?

**If 2+ indicators fail:** Schedule 30 min context refresh session.

---

## Maintenance Operations

### Refreshing Stale Context

**When:** Context is 2+ weeks old, or before resuming paused work

**Process:**
1. **Read chronologically:** DECISIONS → PLAN → last SESSION_NOTES
2. **Verify reality:**
   - Run project, does it match expectations?
   - Check files listed - do they exist and serve stated purpose?
   - Review decisions - still valid?
3. **Update drift:**
   - Fix incorrect file paths
   - Update status
   - Document what changed and why
4. **Validate:** Would you be able to continue work from this context?

### Migrating Decisions to DECISIONS.md

**When:** You made important decision during implementation not yet documented

**Process:**
1. Add new "Decision" section in DECISIONS.md
2. Include:
   - Context: Why this decision was needed
   - Options considered
   - Decision made
   - Rationale
   - Trade-offs accepted
3. Reference in SESSION_NOTES.md: "See DECISIONS.md Decision: [title]"

### Archiving Completed Work

**When:** Work marked complete and deployed

**Process:**
1. Ensure IMPLEMENTATION_SUMMARY.md exists (via `/cdd:complete-work`)
2. Update DECISIONS.md:
   - `status: complete`
   - `completed: YYYY-MM-DD`
3. Do NOT delete work items - they're valuable reference
4. Consider linking in README or project docs

---

## Ownership & Roles

> **Note:** In comprehensive mode with modular artifacts, each file has a designated owner role. This prevents the "tragedy of the commons" where shared responsibility = no responsibility.

### Per-Artifact Ownership (CDD)

Each artifact has a primary steward based on its voice and purpose:

| Artifact | Primary Owner Role | Responsibility | Update Frequency |
|----------|---------------------|----------------|------------------|
| **PROBLEM_BRIEF.md** | Product Owner / Stakeholder | Maintain problem, goals, success criteria | When requirements change |
| **TECHNICAL_RFC.md** | Lead Engineer / Architect | Keep technical approach current | When architecture changes |
| **RISK_REGISTER.md** | Entire Team (shared) | Report risks, blockers, assumptions | Daily (blockers), Weekly (risks) |
| **VALIDATION_PLAN.md** | QA Lead / Developer | Define and track testing strategy | Before completion, when tests fail |
| **IMPLEMENTATION_PLAN.md** | Implementing Developer | Track task progress | After each session |
| **SESSION_NOTES.md** | Implementing Developer | Document session progress | After each session |

**Key Insight:** Even solo developers benefit from "hat switching" - knowing which role you're playing when updating each artifact keeps context focused.

---

### Solo Developer (Wearing All Hats)

**You play every role, but with clear boundaries:**

#### As Product Owner (PROBLEM_BRIEF.md)
- **Create:** Define problem, value, success criteria
- **Steward:** Update when user needs change or scope adjusts
- **Decay Signal:** Success criteria conflict with implementation direction
- **Review Cadence:** Weekly during active work, at milestones

#### As Lead Engineer (TECHNICAL_RFC.md)
- **Create:** Design architecture, choose technologies, document decisions
- **Steward:** Update when technical approach changes
- **Decay Signal:** Implementation diverges from documented approach
- **Review Cadence:** When making major technical decisions

#### As Team Member (RISK_REGISTER.md)
- **Create:** Identify initial risks, dependencies, assumptions
- **Steward:** Update as risks emerge, blockers occur, assumptions validated
- **Decay Signal:** Active blockers not updated daily, risks outdated
- **Review Cadence:** Daily if blockers exist, weekly otherwise

#### As QA Lead (VALIDATION_PLAN.md)
- **Create:** Define test strategy, evidence requirements
- **Steward:** Add tests as implemented, collect evidence
- **Decay Signal:** Tests don't match current implementation
- **Review Cadence:** Before completion, when tests fail

#### As Implementer (IMPLEMENTATION_PLAN.md, SESSION_NOTES.md)
- **Create:** Generate plan, start session log
- **Steward:** Mark tasks complete, document sessions
- **Decay Signal:** Plan diverges from actual work, sessions not logged
- **Review Cadence:** After each work session

**Key Responsibility:**
Don't let "future you" down. Write context that will make sense in 6 months. Know which "hat" you're wearing when updating each artifact.

---

### Team Setting

**CDD enables clear role assignment:**

#### Recommended Team Structure

**Per Work Item:**
- **Product Owner** → Owns PROBLEM_BRIEF.md
  - Validates: Problem still relevant, goals aligned with business
  - Approves: Scope changes, success criteria adjustments

- **Tech Lead / Senior Developer** → Owns TECHNICAL_RFC.md
  - Validates: Architecture sound, patterns followed
  - Approves: Major technical decisions, technology changes

- **Implementing Developer(s)** → Own IMPLEMENTATION_PLAN.md, SESSION_NOTES.md
  - Validates: Tasks reflect actual work
  - Approves: Implementation approach within RFC constraints

- **All Team Members** → Contribute to RISK_REGISTER.md
  - Validates: Risks current, blockers reported immediately
  - Approves: Mitigation strategies, assumption validation

- **QA Lead / Tester** → Owns VALIDATION_PLAN.md
  - Validates: Test coverage adequate, evidence collected
  - Approves: Completion (all validation passed)

#### Handoff Protocol

**When work changes hands:**

1. **Context Review** (New owner reads)
   - PROBLEM_BRIEF.md → Understand the "why"
   - TECHNICAL_RFC.md → Understand the "how"
   - RISK_REGISTER.md → Know current risks/blockers
   - Last 2-3 SESSION_NOTES.md entries → Where we left off

2. **Handoff Session** (Old → New owner, 30 min)
   - Walk through open questions in RISK_REGISTER.md
   - Clarify any technical decisions in TECHNICAL_RFC.md
   - Review next tasks in IMPLEMENTATION_PLAN.md

3. **Ownership Transfer** (Document in artifacts)
   - Update artifact headers with new owner name
   - Add SESSION_NOTES entry: "Picked up from [previous owner] - reviewed context, ready to proceed"
   - Add handoff note to RISK_REGISTER.md if any assumptions need validation

4. **Validation** (First week)
   - New owner updates each artifact at least once (proves understanding)
   - Old owner available for questions
   - Team validates context still accurate

---

### Artifact-Specific Decay Signals

Know when each artifact needs urgent attention:

#### PROBLEM_BRIEF.md
🚨 **Critical Decay:**
- Success criteria no longer align with implementation
- Problem statement doesn't match what you're building
- Stakeholders question the value proposition

⚠️ **Warning Decay:**
- User stories don't reflect actual user needs
- Non-goals are being implemented anyway
- Last updated > 2 weeks ago during active work

#### TECHNICAL_RFC.md
🚨 **Critical Decay:**
- Implementation uses different architecture than documented
- API design doesn't match actual endpoints
- Key decisions contradict current code

⚠️ **Warning Decay:**
- Library versions outdated (security implications)
- Performance requirements not measured
- Patterns reference non-existent files

#### RISK_REGISTER.md
🚨 **Critical Decay:**
- Active blockers not updated daily
- Dependencies list resolved items as blockers
- Assumptions invalidated but not marked

⚠️ **Warning Decay:**
- Risk mitigation strategies not executed
- Last updated > 1 week ago
- Constraints changed but not reflected

#### VALIDATION_PLAN.md
🚨 **Critical Decay:**
- Tests passing but don't validate success criteria
- Evidence requirements not defined before completion
- Critical bugs marked as "can defer"

⚠️ **Warning Decay:**
- Test plan doesn't match current implementation
- Coverage below target with no justification
- Manual test scenarios never executed

---

### Review Cadence by Artifact

**Daily (if blockers exist):**
- RISK_REGISTER.md → Update blocker status

**After Each Session:**
- SESSION_NOTES.md → Document progress
- IMPLEMENTATION_PLAN.md → Mark tasks complete
- RISK_REGISTER.md → Add new risks discovered

**Weekly (during active work):**
- PROBLEM_BRIEF.md → Validate goals still aligned
- TECHNICAL_RFC.md → Check implementation matches design
- RISK_REGISTER.md → Full risk review
- VALIDATION_PLAN.md → Update test progress

**Before Major Milestones:**
- All artifacts → Comprehensive review
- Cross-check consistency across artifacts
- Ensure no contradictions

**Before Completion:**
- VALIDATION_PLAN.md → All evidence collected
- PROBLEM_BRIEF.md → All success criteria met
- TECHNICAL_RFC.md → Implementation matches design
- RISK_REGISTER.md → All critical risks mitigated

---

## Integration with Workflow

> **Note:** CDD now uses template modes. `/cdd:create-work` defaults to solo-dev mode but supports `--mode=minimal` or `--mode=comprehensive` flags. See `cdd/.meta/SIZING_GUIDE.md` for guidance.

### Create Work (`/cdd:create-work`)

**Stewardship starts here:**

**solo-dev mode (DEFAULT):**
- Creates: DECISIONS.md (minimal), IMPLEMENTATION_PLAN.md, SESSION_NOTES.md
- Best for: Solo developers, any work size

**minimal mode (`--mode=minimal`):**
- Creates: DECISIONS.md (structured), IMPLEMENTATION_PLAN.md, SESSION_NOTES.md
- Best for: Small teams, collaborative work

**comprehensive mode (`--mode=comprehensive`):**
- Creates: All modular artifacts automatically
- Best for: Complex work, high risk, multiple stakeholders

**Initial Context Capture (comprehensive mode only):**

**Initial Context Capture:**
1. **PROBLEM_BRIEF.md** - Define problem, solution, success criteria
   - Be thorough on "why" and "what value"
   - Success criteria should be measurable
   - Non-goals prevent scope creep

2. **TECHNICAL_RFC.md** - High-level technical approach
   - Can mark as "TBD - will detail during /cdd:plan-work"
   - Capture known tech stack and constraints
   - Document any early architecture decisions

3. **RISK_REGISTER.md** - Known risks, dependencies, assumptions
   - List obvious blockers and dependencies
   - Document assumptions that need validation
   - Add constraints upfront

4. **VALIDATION_PLAN.md** - Testing strategy outline
   - Map success criteria to validation methods
   - Can be minimal initially, expand during implementation

**Key:** Better to have 4 focused, partially-complete artifacts than 1 exhaustive monolith.

---

### Plan Work (`/cdd:plan-work`)

**First major validation point:**

**Stewardship Actions:**
1. **Review PROBLEM_BRIEF.md**
   - Does the plan address all success criteria?
   - Are goals realistic given constraints?

2. **Expand TECHNICAL_RFC.md**
   - Document architecture decisions made during planning
   - Add API design, data models, file structure
   - Reference codebase patterns to follow

3. **Update RISK_REGISTER.md**
   - Add technical risks discovered during planning
   - Update dependencies (are all items available?)
   - Document assumptions about codebase

4. **Expand VALIDATION_PLAN.md**
   - Define unit/integration/E2E test strategy
   - Map each success criterion to validation method
   - Plan evidence collection approach

**Cross-Check:** Do all 4 artifacts tell a consistent story?

---

### During Implementation (Daily/Session)

**Continuous stewardship:**

**After Each Code Change:**
- Ask: "Did this invalidate any assumptions?" → Update RISK_REGISTER.md
- Ask: "Did I make a decision worth documenting?" → Add to TECHNICAL_RFC.md
- Ask: "Did requirements shift?" → Update PROBLEM_BRIEF.md

**After Each Session (`/cdd:save-session`):**
1. **SESSION_NOTES.md** - Document what you did
   - Tasks completed
   - Decisions made (link to TECHNICAL_RFC.md)
   - Risks discovered (link to RISK_REGISTER.md)
   - What's next

2. **IMPLEMENTATION_PLAN.md** - Mark tasks complete
   - Check off completed tasks
   - Add new tasks if discovered

3. **RISK_REGISTER.md** - Update risks/blockers
   - Mark risks as mitigated or occurred
   - Update blocker status (daily if active blockers)
   - Validate/invalidate assumptions as you learn

4. **VALIDATION_PLAN.md** - Track test progress
   - Mark tests as written/passing
   - Collect evidence as you complete success criteria

**Stewardship Habit:** Spend 5-10 min after each session updating artifacts. Prevents massive catch-up later.

---

### Before Completion (`/cdd:complete-work`)

**Final stewardship and validation:**

**Pre-Completion Checklist:**

1. **PROBLEM_BRIEF.md Review**
   - [ ] All success criteria met?
   - [ ] Can prove each criterion with evidence?
   - [ ] Value proposition actually delivered?

2. **TECHNICAL_RFC.md Review**
   - [ ] Implementation matches documented design?
   - [ ] Deviations documented with rationale?
   - [ ] Patterns actually followed?

3. **RISK_REGISTER.md Review**
   - [ ] All critical risks mitigated or accepted?
   - [ ] All blockers resolved?
   - [ ] All assumptions validated?
   - [ ] Dependencies status accurate?

4. **VALIDATION_PLAN.md Review**
   - [ ] All planned tests written and passing?
   - [ ] Evidence collected for each success criterion?
   - [ ] No critical bugs open?
   - [ ] Manual testing completed?

5. **SESSION_NOTES.md Review**
   - [ ] Tells coherent story of the work?
   - [ ] Key decisions linked to TECHNICAL_RFC.md?
   - [ ] Could someone understand what happened?

**If any checklist fails:** Work is NOT complete. Address gaps before marking done.

**After `/cdd:complete-work` succeeds:**
- IMPLEMENTATION_SUMMARY.md created
- All 4 artifacts represent final state
- Evidence linked and verifiable
- Follow-up work identified and tracked

---

### Artifact Update Triggers

Know when to update each artifact during implementation:

#### Update PROBLEM_BRIEF.md when:
- ✏️ Stakeholder changes requirements
- ✏️ Success criteria need adjustment (scope change)
- ✏️ User needs better understood (e.g., user research findings)
- ✏️ Non-goals shift to goals or vice versa

#### Update TECHNICAL_RFC.md when:
- ✏️ Major technical decision made
- ✏️ Architecture changes (different approach needed)
- ✏️ API design adjusted
- ✏️ Performance issues require different tech choice
- ✏️ Implementation reveals better pattern

#### Update RISK_REGISTER.md when:
- ✏️ New risk discovered
- ✏️ Risk materializes (becomes reality)
- ✏️ Blocker introduced or resolved
- ✏️ Assumption validated or invalidated
- ✏️ Dependency status changes

#### Update VALIDATION_PLAN.md when:
- ✏️ Tests written or passing
- ✏️ Evidence collected
- ✏️ Test strategy changes (e.g., add E2E tests)
- ✏️ Bugs found that require new regression tests

---

## Anti-Patterns to Avoid

> **Note:** With modular artifacts, new anti-patterns emerge. Stay vigilant!

❌ **"I'll update docs later"**
- **Problem:** Later never comes. Context goes stale.
- **Solution:** Update artifacts immediately when things change. 5 min now saves 2 hours later.

❌ **Copy-paste without customization**
- **Problem:** Templates are starting points, not fill-in-the-blank forms.
- **Solution:** Delete sections that don't apply. Expand sections that need detail. Customize!

❌ **Documenting everything exhaustively**
- **Problem:** Too much detail → no one reads it → context rot.
- **Solution:** Focus on decisions, rationale, non-obvious context. Code shows "what", docs show "why".

❌ **Never revisiting context artifacts**
- **Problem:** Implementation diverges from documented approach, context becomes fiction.
- **Solution:** Review artifacts weekly during active work. Update when reality diverges.

❌ **Skipping validation before completion**
- **Problem:** Claiming done without proof. Future you wastes time re-validating.
- **Solution:** If you can't prove success criteria met (with evidence), work isn't complete.

❌ **Updating only one artifact (comprehensive mode)**
- **Problem:** TECHNICAL_RFC.md updated, but PROBLEM_BRIEF.md still has old success criteria → inconsistency.
- **Solution:** When changing scope/approach in comprehensive mode, update ALL affected artifacts to maintain consistency.

❌ **Forgetting to switch "hats" (comprehensive mode)**
- **Problem:** Update PROBLEM_BRIEF.md with technical details (wrong voice for artifact).
- **Solution:** Know which role you're playing. Product hat → PROBLEM_BRIEF. Engineer hat → TECHNICAL_RFC.

❌ **Mixing template modes**
- **Problem:** Start with solo-dev, manually add some modular artifacts, now it's unclear which mode you're in.
- **Solution:** Pick one mode and stick with it. If upgrading to comprehensive, update `template_mode` in frontmatter and create ALL modular artifacts.

❌ **Ignoring RISK_REGISTER.md until completion**
- **Problem:** Risks not tracked → surprises at the end → delays.
- **Solution:** Update RISK_REGISTER.md whenever risks discovered (not just at start/end).

❌ **Collecting evidence after claiming completion**
- **Problem:** "I'll add test results later" → never happens → can't verify claims.
- **Solution:** Collect evidence as you validate. Screenshots, test logs, deployment URLs - gather in real-time.

---

## Context Quality Checklist

Use this before marking work complete:

### Accuracy
- [ ] All file paths still valid
- [ ] All decisions reflect actual choices made
- [ ] Status and dates current
- [ ] Dependencies/blockers reflect reality

### Completeness
- [ ] Problem clearly stated
- [ ] Solution approach documented
- [ ] Key decisions with rationale captured
- [ ] Success criteria validated with evidence

### Clarity
- [ ] New team member could understand context
- [ ] Decisions include "why", not just "what"
- [ ] Session notes tell coherent story
- [ ] Technical jargon explained or obvious from context

### Utility
- [ ] Future implementer would find this helpful
- [ ] Patterns/pitfalls documented for reuse
- [ ] Context files actually useful (not just listed)
- [ ] Follow-up work identified

---

## Remember

**Good context compounds over time.**

Each well-stewarded work item:
- Makes the next work item easier
- Builds institutional knowledge
- Helps AI assistants help you better
- Reduces cognitive load when context switching

**Poor context is worse than no context.**

Stale, inaccurate context:
- Wastes time (reading wrong information)
- Causes errors (following outdated decisions)
- Erodes trust (in the whole CDD system)

---

**Stewardship is not overhead - it's insurance against context loss.**

Spend 10 minutes maintaining context now, save 2 hours re-learning it later.

---
