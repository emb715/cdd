# Context Lifecycle Management

> **Purpose:** Advanced guide for managing context artifacts over time (archiving, ownership transfer)
> **Audience:** Teams using comprehensive mode or managing long-lived work items
> **Note:** This is OPTIONAL advanced material. Solo-dev and minimal modes don't need this.

---

## Overview

Context artifacts have a **lifecycle** just like code:
- Created → Evolve → Stabilize → Archive/Complete
- Ownership can transfer (for teams)
- Completed work provides historical reference

**Core Principle:** Context is infrastructure. Treat it with the same discipline as code.

---

## Artifact Versioning (Optional - Comprehensive Mode)

> **Note:** Template versions have been removed from CDD. This section describes optional practices for tracking changes within modular artifacts in comprehensive mode.

### Change Tracking for Modular Artifacts

If using comprehensive mode with modular artifacts, you may optionally track significant changes:

**Format:** `artifact_version: X.Y.Z`

- **MAJOR (X):** Fundamental change that invalidates prior understanding
  - Example: Problem statement completely redefined
  - Example: Architecture changed from monolith to microservices

- **MINOR (Y):** Significant addition or refinement
  - Example: New success criterion added
  - Example: Additional API endpoint designed
  - Example: New risk identified

- **PATCH (Z):** Small corrections, clarifications, updates
  - Example: Fix typo in requirement
  - Example: Update library version number
  - Example: Clarify existing decision rationale

### Change Tracking Examples (Optional)

**Option 1: Version History Table (comprehensive mode)**

```markdown
## PROBLEM_BRIEF.md Change History

| Date | Author | Change Summary |
|------|--------|----------------|
| 2024-10-15 | John | Initial problem brief |
| 2024-10-18 | John | Added SC-4 (mobile support) - scope expansion |
| 1.1.1 | 2024-10-20 | Jane | Clarified user segment definition |
| 2.0.0 | 2024-10-25 | John | Pivoted from preferences to personalization (major change) |
```

### When to Increment Version

#### Increment MAJOR when:
- Problem statement changes fundamentally
- Architecture completely redesigned
- Success criteria no longer relevant (replaced)
- Work pivots to solve different problem

**Action Required:** Review ALL artifacts for consistency after MAJOR version bump.

---

#### Increment MINOR when:
- New success criterion added (scope expansion)
- New API endpoint added
- New risk or dependency identified
- Testing strategy expanded (e.g., add E2E tests)
- Significant decision added to TECHNICAL_RFC.md

**Action Required:** Update related artifacts (e.g., new success criterion → update VALIDATION_PLAN.md).

---

#### Increment PATCH when:
- Typo fixed
- Clarification added (doesn't change meaning)
- Library version updated
- Formatting improved
- Minor rewording for clarity

**Action Required:** None beyond the artifact being changed.

---

### Version Metadata Format

**In artifact frontmatter:**

```yaml
---
Work ID: 0023
Artifact Version: 1.2.0
Last Updated: 2024-10-30
Last Updated By: Jane Doe
---
```

**In artifact footer:**

```markdown
## Version History

| Version | Date | Author | Change Summary |
|---------|------|--------|----------------|
| 1.0.0 | 2024-10-15 | John | Initial creation |
| 1.1.0 | 2024-10-18 | John | Added mobile requirement |
| 1.2.0 | 2024-10-25 | Jane | Updated API design for performance |
```

---

## Work Item Lifecycle States

### State Progression

```
  Created
     ↓
  ┌──────┐
  │draft │ ← Requirements captured, not yet planned
  └───┬──┘
      │ Transition: /cdd:plan-work completed
      ↓
┌──────────────┐
│ in-progress  │ ← Active implementation
└──────┬───────┘
       │ Transition: All tasks complete + tests pass
       ↓
  ┌────────┐
  │ review │ ← Implementation done, validation pending
  └────┬───┘
       │ Transition: Evidence provided + success criteria met
       ↓
  ┌──────────┐
  │ complete │ ← Validated and deployed
  └─────┬────┘
        │ After 30 days stable
        ↓
  ┌─────────┐
  │archived │ ← Historical reference only
  └─────────┘
```

### State Definitions & Lifecycle Actions

#### draft
**Duration:** Hours to days
**Artifacts Required:** PROBLEM_BRIEF.md (minimum)
**Lifecycle Actions:**
- Create initial artifacts
- Gather requirements
- Identify dependencies and risks
- **Archive if:** Work cancelled before planning (mark status: `cancelled-draft`)

---

#### in-progress
**Duration:** Days to weeks
**Artifacts Required:**
- **solo-dev/minimal**: DECISIONS.md, IMPLEMENTATION_PLAN.md, SESSION_NOTES.md
- **comprehensive**: + PROBLEM_BRIEF, TECHNICAL_RFC, RISK_REGISTER, VALIDATION_PLAN

**Lifecycle Actions:**
- Update artifacts as you learn
- Track progress in SESSION_NOTES.md
- **Pause if:** Work blocked for > 2 weeks (mark status: `paused`, document blocker)

---

#### complete
**Duration:** N/A (terminal state)
**Artifacts Required:** All above + IMPLEMENTATION_SUMMARY.md
**Lifecycle Actions:**
- Final artifact review for consistency
- Validate all versions reflect final state
- Collect all evidence in VALIDATION_PLAN.md
- **Return to in-progress if:** Validation fails or gaps found

---

#### complete
**Duration:** Indefinite (until archived)
**Artifacts Required:** All artifacts + IMPLEMENTATION_SUMMARY.md
**Lifecycle Actions:**
- Mark `status: complete` in all artifact headers
- Add `completed: YYYY-MM-DD` to metadata
- Link to deployment or release
- Track post-deployment issues (update RISK_REGISTER.md if bugs found)
- **Archive after:** 30-60 days stable (no changes, no issues)

---

#### archived
**Duration:** Permanent (historical reference)
**Artifacts Required:** All artifacts frozen
**Lifecycle Actions:**
- Move to `cdd/.archive/YYYY/XXXX-work-name/` (optional organizational structure)
- Add `archived: YYYY-MM-DD` to metadata
- Mark all artifacts read-only (Git permissions or naming convention)
- **Un-archive if:** Work needs to be resumed or referenced for new work

---

## Archival Procedures

### When to Archive

Archive a work item when:
- ✅ Status is `complete`
- ✅ 30+ days since completion with no changes
- ✅ No open follow-up work items
- ✅ Deployment stable (no bugs or issues reported)

**Don't archive if:**
- ❌ Follow-up work planned
- ❌ Recent bugs or issues discovered
- ❌ Frequently referenced by team

---

### How to Archive

#### Option 1: Directory-Based Archival

**Move to archive directory:**

```bash
# Create archive directory (if doesn't exist)
mkdir -p cdd/.archive/2024/

# Move completed work item
mv cdd/0023-user-preferences cdd/.archive/2024/0023-user-preferences

# Update any references in active work items
grep -r "0023-user-preferences" cdd/ --exclude-dir=.archive
```

**Pros:** Clear separation, easy to browse by year
**Cons:** Breaks relative paths, requires updates to references

---

#### Option 2: Status-Based Archival

**Keep in place, mark as archived:**

```yaml
# In PROBLEM_BRIEF.md (and all other artifacts)
---
Work ID: 0023
Status: archived
Archived Date: 2024-11-30
Archived By: Jane Doe
---
```

**Add ARCHIVED.md file:**

```bash
cd cdd/0023-user-preferences
echo "# ARCHIVED

This work item was archived on 2024-11-30.

**Reason:** Completed, stable for 30 days, no follow-up work.

**References:** See cdd/.meta/ARCHIVED_INDEX.md for all archived items.

**To unarchive:** Change status back to 'complete' and document reason.
" > ARCHIVED.md
```

**Pros:** No file moves, paths stay valid
**Cons:** Archived items mixed with active items

---

#### Option 3: Git Tag-Based Archival

**Tag the final state:**

```bash
cd cdd/0023-user-preferences

# Create annotated tag
git tag -a "archive/0023" -m "Archive work item 0023 (User Preferences)

Completed: 2024-10-30
Archived: 2024-11-30
Status: complete
Deployment: Production, stable for 30 days
"

# Push tag
git push origin archive/0023
```

**Then either:**
- Move to `.archive/` directory
- Or keep in place with `archived` status

**Pros:** Git history preserves exact state, can checkout tag to see final version
**Cons:** Requires Git knowledge

---

### Recommended Approach

**For Solo Developers:**
- Use **Option 2** (status-based, keep in place)
- Add `ARCHIVED.md` file
- Update status in all artifacts
- Create `cdd/.meta/ARCHIVED_INDEX.md` listing all archived items

**For Teams:**
- Use **Option 1** (directory-based) + **Option 3** (Git tags)
- Move to `.archive/YYYY/` directory
- Tag final state in Git
- Update cross-references in active work

---

## Ownership Transfer

### When Ownership Changes

Ownership transfers happen when:
- Developer leaves team
- Work item handed off mid-implementation
- Different person takes over maintenance
- Solo dev returning after long break (transfer to "future you")

---

### Handoff Protocol

#### 1. Pre-Handoff Preparation (Old Owner)

**Update all artifacts to current state:**
- [ ] All artifacts reflect latest reality
- [ ] No pending updates in your head (document everything)
- [ ] RISK_REGISTER.md current (all blockers documented)
- [ ] SESSION_NOTES.md has recent entry explaining current state

**Create handoff summary:**

```markdown
# Handoff Summary for Work Item 0023

**From:** John Doe
**To:** Jane Smith
**Date:** 2024-10-30
**Status:** in-progress (Phase 3 of 5)

## Current State
- Completed: Phases 1-2 (Setup, Core Logic)
- In Progress: Phase 3 (UI Implementation)
- Blocked on: DevOps approval for database migration (see RISK_REGISTER.md B-1)

## What's Next
- Task 3.2: Complete settings form UI
- Task 3.3: Wire up state management
- See IMPLEMENTATION_PLAN.md for full task list

## Key Context
- Using Prisma for database (see TECHNICAL_RFC.md)
- Theme preferences stored in JSONB (decision in TECHNICAL_RFC.md §5)
- Mobile support deferred to Phase 2 (see PROBLEM_BRIEF.md non-goals)

## Open Questions
- Should we support real-time preference sync? (see RISK_REGISTER.md A-2)

## Files to Review (Priority Order)
1. PROBLEM_BRIEF.md - Understand the "why"
2. RISK_REGISTER.md - Know current blockers
3. Last 3 SESSION_NOTES.md entries - Recent progress
4. TECHNICAL_RFC.md - Technical approach
5. IMPLEMENTATION_PLAN.md - Tasks and status

## Contact
I'm available via Slack for questions through Nov 15.
```

Save as `cdd/0023-user-preferences/HANDOFF_2024-10-30.md`

---

#### 2. Handoff Meeting (30-60 min)

**Agenda:**
1. **Context Review** (15 min)
   - Walk through handoff summary
   - New owner asks clarifying questions

2. **Artifact Walkthrough** (20 min)
   - Quick review of each artifact
   - Highlight recent changes and decisions
   - Point out key sections in TECHNICAL_RFC.md

3. **Active Issues** (10 min)
   - Review RISK_REGISTER.md blockers
   - Discuss mitigation strategies
   - Identify what new owner should prioritize

4. **Next Steps** (5 min)
   - Agree on transition plan
   - Set check-in schedule (if needed)

---

#### 3. Ownership Transfer Documentation (New Owner)

**Update artifact metadata:**

```yaml
# In all artifact headers
---
Work ID: 0023
Owner: Jane Smith (transferred from John Doe on 2024-10-30)
---
```

**Add SESSION_NOTES entry:**

```markdown
## Session 2024-10-30 - Ownership Transfer

**New Owner:** Jane Smith
**Previous Owner:** John Doe

### Handoff Summary
- Reviewed all artifacts with John
- Understood current blocker (DB migration approval)
- Clear on next tasks (Phase 3 UI implementation)

### Questions Asked & Answered
- Q: Why JSONB for extensibility?
  - A: Future flexibility without schema changes (see TECHNICAL_RFC.md Decision 1)

- Q: What's the real-time sync decision timeline?
  - A: Need to validate assumption A-2 before Phase 4

### Action Items
- [ ] Read TECHNICAL_RFC.md in detail (full understanding)
- [ ] Follow up with DevOps on DB migration (unblock B-1)
- [ ] Review existing UI components to match patterns

**Status:** Ready to proceed, no immediate blockers for my work.
```

---

#### 4. Validation Period (First Week)

**New owner should:**
- [ ] Update at least one artifact (proves understanding)
- [ ] Complete at least one task from IMPLEMENTATION_PLAN.md
- [ ] Ask questions early (old owner still available)
- [ ] Add daily SESSION_NOTES entries

**Old owner should:**
- [ ] Be available for questions (Slack, email)
- [ ] Review new owner's first artifact updates
- [ ] Confirm new owner understands critical decisions

---

### "Future You" Handoff (Solo Developer)

**When pausing work for > 1 week:**

Write a handoff note to yourself:

```markdown
## Handoff to Future Me (2024-10-30)

**Pausing work on:** 0023 - User Preferences
**Duration:** ~2 weeks (vacation)
**Resume by:** 2024-11-15

### Where I Left Off
- Just finished Phase 2 (Core Logic)
- Next: Phase 3 (UI Implementation)
- Blocker: Waiting for DB migration approval (should be resolved by Nov 15)

### What to Review When Resuming
1. RISK_REGISTER.md - Check if blocker B-1 resolved
2. Last SESSION_NOTES entry (today) - Fresh in mind now
3. IMPLEMENTATION_PLAN.md Phase 3 - Next tasks

### Context I Might Forget
- Theme preference uses JSONB, not separate columns (see TECHNICAL_RFC.md)
- Mobile support deferred (don't implement it!)
- Real-time sync still undecided (assumption A-2 not validated yet)

### Quick Resume Plan
1. Check blocker status
2. Read last 2 SESSION_NOTES entries
3. Start Task 3.1 (UI mockup review)

**Past me → Future me:** You got this! The context is all here. 🚀
```

---

## Deprecation & Superseding

### When Context Becomes Obsolete

Sometimes work items are superseded by newer work:

**Scenarios:**
- Work item 0025 replaces approach from 0023
- Feature redesigned, old implementation no longer relevant
- Work cancelled/abandoned

---

### Deprecation Process

#### 1. Mark as Deprecated

**Update all artifact headers:**

```yaml
---
Work ID: 0023
Status: deprecated
Deprecated Date: 2024-11-01
Superseded By: 0025-preferences-v2
Reason: Approach replaced by v2 design
---
```

**Add DEPRECATED.md:**

```markdown
# DEPRECATED

This work item has been deprecated.

**Date:** 2024-11-01
**Superseded By:** Work Item 0025 (Preferences V2)
**Reason:** Original approach had performance issues. V2 uses different architecture.

**Do Not Use:** Do not implement or reference this design.
**Historical Value:** Kept for reference - shows what was tried and why it didn't work.

See `cdd/0025-preferences-v2/` for current approach.
```

---

#### 2. Update Cross-References

**Find and update references:**

```bash
# Find all references to deprecated work
grep -r "0023" cdd/ --exclude-dir=.git

# Update each reference with deprecation note
# Example in another work item:
# ~~0023-user-preferences~~ (deprecated, see 0025-preferences-v2)
```

---

#### 3. Preserve Learnings

**Extract lessons learned:**

In `cdd/0025-preferences-v2/PROBLEM_BRIEF.md`:

```markdown
## Lessons from Previous Attempt (Work 0023)

**What we tried:** JSONB column for all preferences
**Why it failed:** Query performance degraded with large JSON objects
**What we learned:** Separate columns for frequent queries, JSONB for rare settings
**How this informs current approach:** Hybrid model (see TECHNICAL_RFC.md)
```

---

## Git Workflow for Context

### Branching Strategy

**Option 1: Context Changes in Feature Branches**

```bash
# Create feature branch for work item
git checkout -b feature/0023-user-preferences

# Commit context artifacts along with code
git add cdd/0023-user-preferences/
git commit -m "Add PROBLEM_BRIEF and TECHNICAL_RFC for user preferences"

# Later: commit code + context updates together
git commit -m "Implement preferences API + update TECHNICAL_RFC with final design"
```

**Pros:** Context and code evolve together
**Cons:** Context changes might conflict during merges

---

**Option 2: Separate Context Commits**

```bash
# Commit context separate from code
git add cdd/0023-user-preferences/PROBLEM_BRIEF.md
git commit -m "docs(0023): Add problem brief for user preferences"

git add cdd/0023-user-preferences/TECHNICAL_RFC.md
git commit -m "docs(0023): Document API design and architecture"

# Later: Code commits separate
git add src/services/preferences/
git commit -m "feat(0023): Implement preferences service"
```

**Pros:** Clear separation, easier to review context changes
**Cons:** More commits

---

### Commit Message Conventions

**For context artifacts:**

```
docs(WORK_ID): Brief description

Examples:
docs(0023): Add PROBLEM_BRIEF for user preferences
docs(0023): Update TECHNICAL_RFC with final API design
docs(0023): Mark work complete with evidence in VALIDATION_PLAN
docs(0023): Archive work item after 30 days stable
```

**For major context changes:**

```
docs(0023)!: BREAKING: Pivot to personalization approach

PROBLEM_BRIEF.md updated - fundamental change in problem statement.
All artifacts updated for consistency.

See PROBLEM_BRIEF.md change history for rationale.
```

---

### Code Review for Context

**Reviewers should check:**
- [ ] Context artifacts consistent with code changes
- [ ] Major decisions documented (DECISIONS.md or TECHNICAL_RFC.md)
- [ ] Risks updated if new issues found
- [ ] Evidence collected if features validated
- [ ] SESSION_NOTES.md updated

**PR Template Example:**

```markdown
## Code Changes
[Describe code changes]

## Context Changes (if using comprehensive mode)
- [ ] TECHNICAL_RFC.md updated (if architecture/design changed)
- [ ] RISK_REGISTER.md updated (if risks/blockers discovered)
- [ ] VALIDATION_PLAN.md updated (if tests added/passing)
- [ ] SESSION_NOTES.md entry added (progress documented)

## Artifact Updates (all modes)
- DECISIONS.md: Updated with new API endpoint decision
- SESSION_NOTES.md: Session 3 added
```

---

## Lifecycle Best Practices

### 1. Update Context as You Learn
- Don't wait to increment versions
- Small, frequent version bumps > infrequent large bumps
- Version history tells a story

### 2. Document Why, Not Just What
- Version change notes should explain WHY change happened
- "Updated API design" ❌ → "Updated API design for better performance (reduced payload size)" ✅

### 3. Consistency Across Artifacts
- Major version bump in one artifact often requires updates in others
- Use checklists to catch cascading updates

### 4. Archive Thoughtfully
- Not everything needs archiving immediately
- Keep frequently-referenced work accessible
- Archive when truly done (30+ days stable)

### 5. Handoff is a Process, Not an Event
- Budget time for proper handoff (30-60 min meeting + review time)
- Documentation alone isn't enough - synchronous conversation critical
- Validation period ensures successful transfer

---

## Summary

**Key Takeaways:**

1. **Version artifacts** using semantic versioning (MAJOR.MINOR.PATCH)
2. **Track lifecycle** through states (draft → in-progress → review → complete → archived)
3. **Archive deliberately** after 30+ days stable
4. **Transfer ownership** with structured handoff (summary + meeting + validation)
5. **Deprecate gracefully** when work is superseded (mark clearly, preserve learnings)
6. **Use Git** to track context evolution alongside code

**Remember:** Context is infrastructure. Maintain it with the same discipline as your codebase.

---

**Created:** 2024-10-30
**Author:** EMB (Ezequiel M. Benitez) @emb715
