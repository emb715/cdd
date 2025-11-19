---
description: Mark work item as complete and generate implementation summary
author: EMB (Ezequiel M. Benitez) @emb715
---

# Complete Work Item and Generate Summary

You are tasked with marking a work item as complete and generating a comprehensive IMPLEMENTATION_SUMMARY.md that captures the entire journey from requirements to deployment.

## Critical Rules - READ FIRST

1. **DO NOT** start new work
2. **MUST** verify work is actually complete before proceeding
3. **MUST** analyze all session notes and decisions
4. **MUST** generate comprehensive IMPLEMENTATION_SUMMARY.md
5. **MUST** update status in DECISIONS.md to "complete"
6. **SHOULD** suggest related or follow-up work items

## Process

### Step 1: Identify Work Item

User specifies work item:
- Work ID: `/cdd:complete-work 0001`
- Folder path: `/cdd:complete-work cdd/0001-user-auth`
- Fuzzy name: `/cdd:complete-work user auth`

Use same flexible matching as `/cdd:plan-work`.

### Step 2: Validate Completion Readiness

> **Note:** Validation depth adapts to `template_mode` from DECISIONS.md frontmatter.

**Read `template_mode` from DECISIONS.md frontmatter:**

**For solo-dev mode (basic completion check):**
- [ ] DECISIONS.md success criteria met?
- [ ] Does it work? (quick manual test)
- [ ] Next steps identified (if any)?
- Create simple IMPLEMENTATION_SUMMARY.md

**For minimal mode (standard completion validation):**
- [ ] All functional requirements met?
- [ ] Success criteria validated?
- [ ] Basic evidence collected (test results)?
- [ ] Blockers resolved?
- Create standard IMPLEMENTATION_SUMMARY.md

**For comprehensive mode (full completion validation):**
Check ALL artifacts below for consistency and completeness:

**Check 1: Verify all required files exist**

Required for comprehensive mode:
- ✅ DECISIONS.md
- ✅ PROBLEM_BRIEF.md
- ✅ TECHNICAL_RFC.md
- ✅ RISK_REGISTER.md
- ✅ VALIDATION_PLAN.md
- ✅ IMPLEMENTATION_PLAN.md
- ✅ SESSION_NOTES.md

---

**Check 2: PROBLEM_BRIEF.md Validation** (comprehensive mode only)
- [ ] All success criteria from PROBLEM_BRIEF.md met?
- [ ] Evidence provided for each "Must Have" criterion?
- [ ] Non-goals still respected (no scope creep)?
- [ ] Value proposition actually delivered?

**For each success criterion, ask:**
```
SC-1: Users can save theme preferences
Evidence type: (Unit test / Integration test / Manual test / Screenshot / Other)
Evidence location: (File path, URL, description)

If NO evidence: BLOCK completion or mark as "completed without validation"
```

---

**Check 3: TECHNICAL_RFC.md Validation**

If TECHNICAL_RFC.md exists:
- [ ] Implementation matches documented architecture?
- [ ] All API endpoints from RFC implemented?
- [ ] Data model implemented as designed?
- [ ] Performance requirements from RFC met?
- [ ] Security considerations addressed?

**Ask user:**
```
Did implementation diverge from TECHNICAL_RFC.md?
- If yes: "Let's document the changes before completion."
- If major changes: "Should we bump TECHNICAL_RFC version to reflect final state?"
```

---

**Check 4: RISK_REGISTER.md Validation**

If RISK_REGISTER.md exists:
- [ ] All active blockers resolved?
- [ ] All critical risks mitigated or accepted?
- [ ] All assumptions validated?
- [ ] All dependencies delivered?

**Block completion if:**
- ❌ Active blockers still exist
- ❌ Critical risks not mitigated
- ❌ Unvalidated assumptions that affect core functionality

**Ask user:**
```
🚨 Active Items in RISK_REGISTER.md:

Blockers: 1 active
- B-1: Database migration approval pending

Critical Risks: 0 unmitigated

Unvalidated Assumptions: 2
- A-1: Users accept localStorage (untested)
- A-2: Real-time sync not needed (unconfirmed)

Actions:
A) Resolve blockers and validate assumptions before completing
B) Accept risks and document in summary
C) Defer to follow-up work item (create XXXX)

Choose: ___
```

---

**Check 5: VALIDATION_PLAN.md Validation**

If VALIDATION_PLAN.md exists:
- [ ] All planned tests written and passing?
- [ ] Evidence collected for each success criterion?
- [ ] No critical bugs open?
- [ ] Manual testing completed?
- [ ] Security testing done?
- [ ] Performance testing done?

**Validate against completion criteria:**
```
📊 VALIDATION_PLAN.md Completion Check:

Success Criteria Validation Matrix:
✅ SC-1: Theme preferences saved - Evidence: Unit test passing
⚠️  SC-2: Preferences persist - Evidence: MISSING
❌ SC-3: Mobile responsive - Evidence: NOT TESTED

Test Execution:
✅ Unit Tests: 42/42 passing (100%)
✅ Integration Tests: 12/12 passing (100%)
⚠️  E2E Tests: 2/3 passing (1 failing)
❌ Manual Tests: 0/5 completed

Completion Criteria (from VALIDATION_PLAN):
[ ] All must-have success criteria validated ← FAIL (SC-2, SC-3)
[ ] All unit tests passing ← PASS
[ ] Critical path E2E tested ← FAIL (1 failing)
[ ] Zero critical bugs ← PASS
[x] Evidence collected ← PARTIAL

❌ CANNOT COMPLETE - Validation gaps exist.

Required actions:
1. Collect evidence for SC-2 (preferences persist)
2. Test SC-3 (mobile) or move to follow-up work
3. Fix failing E2E test or document as known issue
4. Complete manual testing or justify skip

Proceed anyway? (NOT RECOMMENDED)
```

---

**Check 6: Implementation Plan (All Versions)**

**Process:**
1. Read IMPLEMENTATION_PLAN.md from work item directory
2. Parse task status (checkboxes or status emojis)
3. Calculate completion statistics
4. Validate against SESSION_NOTES.md progress
5. Handle incomplete tasks

**Parsing Logic:**

**v1.0 Format (Checkboxes):**
```markdown
- [ ] Task 1.1: Create database migration
- [X] Task 1.2: Update Prisma schema
```
Parse: `- [X]` = completed, `- [ ]` = not completed

**v2.0 Format (Status Emojis):**
```markdown
#### Task 1.1: Create database migration
**Status:** ⬜ Not Started

#### Task 1.2: Update Prisma schema
**Status:** ✅ Completed
```
Parse: `**Status:** ✅ Completed` = completed
       `**Status:** 🔄 In Progress` = in progress
       `**Status:** ⬜ Not Started` = not started

**Count tasks:**
- Total: All tasks found in IMPLEMENTATION_PLAN.md
- Completed: Tasks marked ✅ (or [X] in v1.0)
- In Progress: Tasks marked 🔄 (v2.0 only)
- Not Started: Tasks marked ⬜ (v2.0 only) or [ ] (v1.0)

---

**Example Output (v2.0 with Status Emojis):**

```
📋 Implementation Plan Status:

Total Tasks: 45
✅ Completed: 42/45 (93%)
🔄 In Progress: 2/45 (4%)
⬜ Not Started: 1/45 (2%)

📊 Progress by Phase:
Phase 1: ████████████ 100% (12/12 tasks)
Phase 2: ████████████ 100% (18/18 tasks)
Phase 3: ████████░░░░  75% (9/12 tasks)
Phase 4: ░░░░░░░░░░░░   0% (0/3 tasks)

Uncompleted Tasks:
🔄 Task 3.10: Add loading states to forms (in progress)
🔄 Task 3.11: E2E test for complete flow (in progress)
⬜ Task 4.1: Update API documentation (not started)

⚠️  CANNOT COMPLETE - Tasks still in progress or not started.

Options:
A) Complete remaining tasks now (recommended)
B) Move in-progress tasks to follow-up work item (create new work)
C) Move not-started tasks to "won't do" with justification
D) Proceed anyway (not recommended - document incomplete items in summary)

Choose: ___
```

---

**Validation Rules:**

**Block completion if:**
- ❌ Any task is 🔄 In Progress (work not finished)
  - Message: "Tasks still in progress. Finish or move to follow-up work."

**Warn but allow completion if:**
- ⚠️  Any task is ⬜ Not Started (can be deferred)
  - Message: "Not started tasks detected. Options: defer to follow-up or mark as 'won't do'."

**Allow completion if:**
- ✅ All tasks are ✅ Completed (100%)
  - Message: "All tasks complete. Ready to proceed."

---

**Cross-Validation with SESSION_NOTES.md:**

Read latest session entry from SESSION_NOTES.md and compare progress:

```
📊 Progress Validation:

IMPLEMENTATION_PLAN.md: 42/45 tasks complete (93%)
SESSION_NOTES.md (latest): 42/45 tasks complete (93%)

✅ Progress matches - consistent state
```

**If mismatch detected:**
```
⚠️  Progress Mismatch Detected:

IMPLEMENTATION_PLAN.md: 42/45 tasks complete (93%)
SESSION_NOTES.md (latest): 40/45 tasks complete (89%)

Possible causes:
- IMPLEMENTATION_PLAN.md updated manually without /cdd:save-session
- SESSION_NOTES.md outdated (last session: 2 days ago)

Action: Run /cdd:save-session before /cdd:complete-work to sync progress.
```

---

**Handling Incomplete Tasks:**

**Option A: Complete Remaining Tasks**
```
You chose: A) Complete remaining tasks

Recommended workflow:
1. Work on Task 3.10 (Add loading states to forms)
2. Work on Task 3.11 (E2E test for complete flow)
3. Work on Task 4.1 (Update API documentation)
4. Run /cdd:save-session to update progress
5. Re-run /cdd:complete-work when all tasks done

Status: ❌ Completion blocked. Resume when tasks complete.
```

**Option B: Move to Follow-Up Work**
```
You chose: B) Move to follow-up work item

Creating follow-up work item:

Title: "User Preferences - Phase 2 Enhancements"
Type: feature
Tasks deferred:
- Task 3.10: Add loading states to forms
- Task 3.11: E2E test for complete flow
- Task 4.1: Update API documentation

Would you like me to create this work item now? (y/n)
(Run: /cdd:create-work "User Preferences - Phase 2 Enhancements")

Status: ✅ Proceeding with completion (tasks deferred to new work)
```

**Option C: Mark as "Won't Do"**
```
You chose: C) Mark as "won't do"

For each not-started task, provide justification:

Task 4.1: Update API documentation
Reason: (e.g., "API is internal only, docs not needed for this release")

Justifications will be documented in IMPLEMENTATION_SUMMARY.md.

Status: ✅ Proceeding with completion (tasks marked won't do)
```

**Option D: Proceed Anyway (Not Recommended)**
```
You chose: D) Proceed anyway

⚠️  Warning: Marking work complete with incomplete tasks is not recommended.

This will:
- Mark work status as "complete" despite incomplete tasks
- Document incomplete items in IMPLEMENTATION_SUMMARY.md
- Create confusion for future maintainers

Are you sure? (y/n)

If yes:
Status: ⚠️  Proceeding (incomplete items documented)
```

---

**Example: All Tasks Complete (Happy Path)**

```
📋 Implementation Plan Status:

Total Tasks: 45
✅ Completed: 45/45 (100%)
🔄 In Progress: 0/45 (0%)
⬜ Not Started: 0/45 (0%)

📊 Progress by Phase:
Phase 1: ████████████ 100% (12/12 tasks)
Phase 2: ████████████ 100% (18/18 tasks)
Phase 3: ████████████ 100% (12/12 tasks)
Phase 4: ████████████ 100% (3/3 tasks)

✅ All tasks complete!

Progress matches SESSION_NOTES.md ✅

Ready to proceed with completion.
```

---

---

**Check 7: Cross-Artifact Consistency ()**

If using v2.0, validate consistency across artifacts:
- [ ] Success criteria in PROBLEM_BRIEF match validation in VALIDATION_PLAN?
- [ ] Risks in RISK_REGISTER addressed in TECHNICAL_RFC or VALIDATION_PLAN?
- [ ] Technical approach in RFC matches what was implemented?
- [ ] No contradictions between artifacts?

**Ask AI to cross-check:**
```
🔍 Cross-Artifact Consistency Check:

PROBLEM_BRIEF.md says: "Must support mobile devices" (SC-3)
VALIDATION_PLAN.md says: "Mobile testing - Not tested"
TECHNICAL_RFC.md says: "Mobile-first responsive design"
SESSION_NOTES.md says: "Decided to defer mobile to Phase 2"

⚠️  INCONSISTENCY DETECTED

Action required:
- Update PROBLEM_BRIEF to move mobile to "Phase 2" or "Nice-to-have"
- OR complete mobile testing now
- Ensure all artifacts tell same story

Artifacts consistent? ___
```

**Enhanced Validation Dialog with Evidence:**

```
🔍 Validating completion for work 0001-user-authentication-system...

📊 Success Criteria Evidence Check:
✅ "Users can log in with email/password"
   Evidence: ✓ Unit tests passing (12/12)
   Evidence: ✓ Manual test checklist completed

⚠️  "OAuth flow works with Google"
   Evidence: ❌ NO EVIDENCE PROVIDED
   → Question: "Can you provide evidence this was tested?"

📋 Functional Requirements: 8 total
✅ FR-1: Email/password - Validated via unit tests
⚠️  FR-2: OAuth with Google - ⚠️ NEEDS EVIDENCE
✅ FR-3: Protected routes - Validated manually
✅ FR-4: Session management - Integration test passing
✅ FR-5: Password reset - E2E test passing
✅ FR-6: Email verification - Manual testing
⚠️  FR-7: Two-factor auth - Partially implemented
❌ FR-8: Remember me - Not implemented

📊 Implementation Plan: 45 tasks
✅ Completed: 42 tasks (93%)
⚠️  In Progress: 2 tasks (4%)
❌ Not Started: 1 task (2%)

⚠️  EVIDENCE GAPS DETECTED

Options:
A) Provide evidence now (screenshots, test results, etc.)
B) Cancel and complete validation first
C) Mark incomplete items as "deferred to work item [XXXX]"
D) ⚠️ Complete WITHOUT evidence (not recommended - low-quality context)
```

**STRONGLY RECOMMEND blocking completion if evidence missing for must-have criteria.**
**If user insists on completing without evidence, document the gap in summary.**

### Step 3: Analyze Work Item History

Thoroughly analyze all documentation:

**From DECISIONS.md:**
- Requirements (functional and non-functional)
- User stories and goals
- Technical decisions made
- Patterns followed
- Dependencies
- Success metrics

**From IMPLEMENTATION_PLAN.md:**
- All tasks (completed and skipped)
- Files created and modified
- Implementation approach
- Estimated vs. actual effort

**From SESSION_NOTES.md:**
- All session entries
- Total sessions and time
- Key decisions made during implementation
- Challenges encountered and solutions
- Learnings and insights
- Status transitions
- Testing progress

**From Git/Filesystem** (if available):
- Actual files changed (git diff)
- Lines added/removed
- Final test coverage
- Deployment status

### Step 4: Calculate Statistics

Gather comprehensive statistics:

**Time & Effort:**
- Total sessions: Count from SESSION_NOTES.md
- Total time: Sum from all sessions
- Average session length
- Longest/shortest sessions
- Time per phase (if tracked)

**Code Changes:**
- Files created: Count and list
- Files modified: Count and list
- Files deleted: Count and list (if any)
- Lines of code added/removed (if available)

**Testing:**
- Total tests written
- Test pass rate
- Coverage percentage (if available)
- Types of tests (unit, integration, e2e)

**Progress:**
- Start date: From DECISIONS.md created date
- End date: Current date
- Duration: Days between start and end
- Status transitions: From SESSION_NOTES.md

### Step 5: Extract Key Information

**Key Decisions:**
- From DECISIONS.md technical decisions section
- From SESSION_NOTES.md decisions made in sessions
- Create consolidated list with rationale

**Challenges & Solutions:**
- Extract all issues from SESSION_NOTES.md
- Identify patterns (recurring issues)
- Document solutions and prevention strategies

**Learnings:**
- Extract from SESSION_NOTES.md learnings sections
- Identify what worked well
- Identify what could be improved
- Create actionable lessons for future work

**Business Impact:**
- From DECISIONS.md goals and success metrics
- User-facing changes
- Technical improvements
- Value delivered

### Step 6: Generate IMPLEMENTATION_SUMMARY.md

Create comprehensive summary using template:

```markdown
# Implementation Summary: [Work Title]

> **Work ID:** XXXX
> **Completed:** YYYY-MM-DD
> **Status:** ✅ Complete
> **Duration:** X sessions over X days (XX.X total hours)

---

## 📋 Overview

### What Was Built
[2-3 paragraph summary of the feature/fix/improvement]

### Business Value
[Value delivered to users or business]

### Technical Approach
[High-level technical approach]

---

## 🎯 Requirements Fulfilled

### Functional Requirements
- [X] **FR-1:** [Requirement] - ✅ Implemented
- [X] **FR-2:** [Requirement] - ✅ Implemented
- [ ] **FR-X:** [Requirement] - ⚠️ Partially (explanation)
- [ ] **FR-Y:** [Requirement] - ❌ Deferred to [Work ID]

### Success Metrics
- [X] Metric 1: [Target] - **Achieved:** [Result]

---

## 💡 Key Decisions Made

[List all major decisions with rationale and impact]

---

## 🏗️ Implementation Details

### Architecture
[Architecture/design pattern used]

### Technology Stack
[Technologies, libraries, tools used]

---

## 📁 Files Changed

### Files Created (XX files)
[Comprehensive list with line counts and purposes]

### Files Modified (XX files)
[List with changes made]

### Total Changes
- **Lines Added:** +XXXX
- **Lines Removed:** -XXX
- **Net Change:** +XXX lines

---

## 🚧 Challenges & Solutions

[All challenges encountered with solutions and learnings]

---

## 🧪 Testing Summary

### Test Coverage
[Comprehensive testing information]

### Key Test Scenarios
[Important test cases]

---

## 🔄 Integration Points

### APIs, Database Changes, External Services
[All integration information]

---

## 📊 Performance Impact

[Performance metrics and optimizations]

---

## 🔒 Security Considerations

[Security measures and reviews]

---

## 📚 Documentation

[Links to all related documentation]

---

## 🚀 Deployment

### Deployment Date & Method
[Deployment information]

### Post-Deployment Verification
[Verification steps]

---

## 💭 Retrospective

### What Went Well ✅
[Successes]

### What Could Be Improved 🔄
[Areas for improvement]

### Lessons Learned 📖
[Actionable lessons]

### Technical Debt Created
[Debt items with impact assessment]

---

## 🔗 Related Work

### Dependencies, Enabled Work, Follow-Up Items
[All relationships to other work]

---

## 📈 Business Impact

[User impact, metrics to monitor, success criteria]

---

## 📄 Quick Reference

**Work ID:** XXXX
**Type:** [type]
**Duration:** X days, XX hours
**Files Changed:** XX created, XX modified
**Tests Added:** XX
**Status:** ✅ Complete

---

**Summary Generated:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
```

### Step 7: Update Work Item Status

1. **Update DECISIONS.md:**
   - Change status from "in-progress" to "complete"
   - Update `updated` date
   - Add `completed` date field

2. **Add final session to SESSION_NOTES.md** (if not already done):
   ```markdown
   ## Session YYYY-MM-DD HH:MM - COMPLETION
   **Duration:** 0.5 hours
   **Status Change:** in-progress → complete

   ### ✅ Completion Tasks
   - Final testing verification
   - Documentation review
   - Deployment to production
   - Implementation summary generated

   ### 📊 Final Statistics
   - Total sessions: X
   - Total time: XX hours
   - Tasks completed: XX/XX (100%)
   - All requirements met

   ### 🎉 Work Complete!
   This work item is now complete and deployed.
   See IMPLEMENTATION_SUMMARY.md for full retrospective.
   ```

### Step 8: Suggest Follow-Up Work

Based on analysis, suggest:

**Deferred Requirements:**
- Any FR-X marked as deferred
- Create new work item suggestions

**Technical Debt:**
- Items identified in retrospective
- Create refactor work item suggestions

**Enhancements:**
- Ideas from "Future Enhancements" section
- Create feature work item suggestions

**Related Work:**
- Work items this enables
- Logical next steps

**Example Suggestions:**

```
🎯 Suggested Follow-Up Work:

Based on this implementation, consider creating:

1. **Feature:** Two-Factor Authentication (FR-7 deferred)
   - Command: `/cdd:create-work two-factor authentication for user accounts`
   - Priority: High
   - Depends on: This work (0001)

2. **Feature:** Remember Me Functionality (FR-8 deferred)
   - Command: `/cdd:create-work remember me login feature`
   - Priority: Medium
   - Depends on: This work (0001)

3. **Refactor:** Optimize auth token validation (Technical debt)
   - Command: `/cdd:create-work refactor auth token validation performance`
   - Priority: Medium
   - Reason: Current implementation could be more efficient

4. **Feature:** User Profile Management (Enabled by this work)
   - Command: `/cdd:create-work user profile editing and preferences`
   - Priority: High
   - Unlocked by: User authentication system
```

### Step 9: Optional - Index with RAG

**If `cdd/.rag/` directory exists:**

Check for RAG installation and automatically index the completed work item:

```bash
# Check if RAG is installed
if [ -d "cdd/.rag" ]; then
  echo ""
  echo "🔍 Indexing completed work with RAG..."

  # Index the work item (Python must be available)
  if command -v python3 &> /dev/null; then
    cd cdd/.rag
    python3 -m core.cli index --work-id {work-id} 2>&1
    INDEX_RESULT=$?
    cd ../..

    if [ $INDEX_RESULT -eq 0 ]; then
      echo "✓ Work item indexed and searchable via /cdd:query"
    else
      echo "⚠️  Indexing encountered an error, but work completion proceeded"
      echo "   You can manually re-index: cd cdd/.rag && python3 -m core.cli index --work-id {work-id}"
    fi
  else
    echo "⚠️  Python not found, skipping RAG indexing"
    echo "   Install manually: cd cdd/.rag && python3 -m core.cli index --work-id {work-id}"
  fi
fi
```

**If RAG not installed:**
- Skip silently (no error, no mention)
- Don't show any RAG-related output

**Important:**
- This is OPTIONAL - never block completion if RAG fails
- If indexing errors occur, log warning but continue
- User can manually re-index later via `/cdd:query reindex`
- Work completion always proceeds regardless of RAG status

---

### Step 10: Confirm Completion

Provide comprehensive completion summary:

```
🎉 Work Completed Successfully!

📁 Work: 0001-user-authentication-system
✅ Status: Complete
📅 Completed: 2024-01-20
⏱️  Duration: 5 sessions over 6 days (10.5 hours total)

## Implementation Summary:
📄 Document: cdd/0001-user-authentication-system/IMPLEMENTATION_SUMMARY.md
📊 Requirements: 6/8 met (75%) - 2 deferred to future work
📈 Progress: 42/45 tasks completed (93%)
🧪 Testing: 23 tests, 94% coverage, all passing
📁 Files: 12 created, 8 modified

## Key Achievements:
✅ Full authentication system with email/password and OAuth
✅ Protected route middleware implemented
✅ Session management with secure cookies
✅ Comprehensive test coverage
✅ Production deployment successful

## Outcomes:
📊 User Impact: 100% of users can now authenticate securely
⚡ Performance: Average login time 250ms (target: <500ms)
🔒 Security: All security requirements met, passed review

## Technical Debt Created:
⚠️  1 medium priority item (auth token caching)
   - Tracked for future refactor work

## What's Next:
Consider creating these follow-up work items:
1. Two-factor authentication (deferred FR-7)
2. Remember me functionality (deferred FR-8)
3. User profile management (enabled by this work)

Use /cdd:create-work to start any of these!

📍 Full retrospective and details in IMPLEMENTATION_SUMMARY.md
```

## Examples

### Example 1: Complete Feature

**User:** `/cdd:complete-work 0001`

**AI:**
```
🔍 Checking completion readiness for 0001-user-authentication-system...

[Validates requirements and tasks]
[Asks for confirmation]

User confirms: "Yes, mark as complete"

[Analyzes full history]
[Generates IMPLEMENTATION_SUMMARY.md]
[Updates DECISIONS.md status]
[Adds completion session]
[Suggests follow-up work]

🎉 Work completed successfully!
[Comprehensive summary...]
```

### Example 2: Complete with Warnings

**User:** `/cdd:complete-work 0002`

**AI:**
```
⚠️  Warning: Not all requirements complete

Requirements: 4/5 met (1 deferred)
Tasks: 38/42 complete (4 skipped)

This is okay if:
- Requirements were intentionally descoped
- Tasks are no longer needed
- Work is deferred to another work item

Mark as complete anyway? (y/n)
```

**User:** `y - FR-5 moved to work 0003`

**AI:**
```
✅ Understood. Marking as complete.

[Proceeds with completion]
[Notes deferral in summary]
[Suggests 0003 as follow-up]
```

### Example 3: Complete Bug Fix

**User:** `/cdd:complete-work bugs/0001`

**AI:**
```
🐛 Completing bug fix: 0001-login-timeout

[Analyzes bug-specific information]
[Verifies fix implementation]
[Checks regression tests]
[Generates bug-focused summary]

✅ Bug fixed and verified!

Fix Summary:
- Root cause: Session timeout not being refreshed
- Solution: Added timeout refresh on user activity
- Regression test: Added to prevent future occurrence
- Deployment: Hotfix deployed to production
- Verification: No timeout reports in 3 days

Bug is now closed. ✅
```

## Special Handling

### Incomplete Work

If work is genuinely incomplete:

```
❌ This work item appears incomplete.

Recommendations:
1. Finish remaining tasks
2. Use /cdd:save-session to track final work
3. Then use /cdd:complete-work when truly done

Or, if descoping:
1. Update DECISIONS.md non-goals
2. Document why work was descoped
3. Create new work item for deferred items
4. Then mark this as complete
```

### No SESSION_NOTES.md

If work has no session notes:

```
⚠️  No session notes found.

Cannot generate meaningful implementation summary without session history.

Please:
1. Add at least one session note describing the work
2. Use /cdd:save-session to document what was done
3. Then retry /cdd:complete-work

Or create manual summary in IMPLEMENTATION_SUMMARY.md
```

## Integration with Other Commands

### Typical Workflow:

```
1. /cdd:create-work [description]      ← Create work item
2. /cdd:plan-work [id]                 ← Generate tasks
3. [Work and /cdd:save-session]        ← Implementation
4. /cdd:save-session [id]              ← Document sessions
5. /cdd:complete-work [id]             ← Mark complete ✅
```

### After Completion:

```
Work 0001 complete! ✅

Ready to start follow-up work?

  /cdd:create-work two-factor authentication
  /cdd:create-work user profile management

Or review all work:

  /cdd:list-work --status=complete
```

## Remember

- **DO** validate completion readiness
- **DO** generate comprehensive summary
- **DO** suggest follow-up work
- **DO** celebrate completion! 🎉
- **DO NOT** mark incomplete work as complete without user confirmation
- **DO NOT** skip analysis - summaries should be thorough
