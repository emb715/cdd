# Risk Register: [Work Title]

> **Voice:** Cross-Functional Safety Net
> **Purpose:** Track risks, assumptions, dependencies, and blockers
> **Audience:** Everyone involved in the work - this is a shared responsibility
> **Part of:** CDD Modular Artifacts (RISK_REGISTER.md)

---

**Work ID:** XXXX
**Last Updated:** YYYY-MM-DD
**Status:** active | mitigated | closed

---

## 🎯 Purpose of This Register

This artifact tracks:
- **Risks** - Things that could go wrong
- **Assumptions** - Things we believe to be true (but might not be)
- **Dependencies** - Things we're waiting on or relying on
- **Blockers** - Things currently preventing progress
- **Constraints** - Known limitations we must work within

**Key Principle:** Update this LIVE during implementation, not just at the start. Risks evolve!

---

## 🚨 Active Risks

> **Definition:** Potential problems that haven't happened yet but could impact success

### Risk Matrix

| ID | Risk | Probability | Impact | Severity | Owner | Status |
|----|------|-------------|---------|----------|-------|--------|
| R-1 | [Risk description] | High/Med/Low | High/Med/Low | 🔴 Critical | [Name] | Active |
| R-2 | [Risk description] | High/Med/Low | High/Med/Low | 🟡 Medium | [Name] | Mitigating |
| R-3 | [Risk description] | High/Med/Low | High/Med/Low | 🟢 Low | [Name] | Accepted |

**Severity Calculation:**
- 🔴 **Critical** = High Probability + High Impact (address immediately)
- 🟠 **High** = High Probability + Medium Impact, or Medium + High
- 🟡 **Medium** = Medium + Medium, or Low + High
- 🟢 **Low** = Low Probability or Low Impact

---

### R-1: [Risk Title]

**Description:**
[What could go wrong? Be specific about the scenario.]

**Example:**
> Third-party authentication API (OAuth provider) could become unavailable during implementation, blocking testing and deployment.

**Probability:** High | Medium | Low
**Impact:** High | Medium | Low
**Severity:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

**Indicators (Early Warning Signs):**
- [Signal 1 that this risk is materializing]
- [Signal 2 that this risk is materializing]

**Example:**
> - API response times degrading
> - Provider status page shows incidents
> - Timeout errors in logs

**Mitigation Strategy:**
[What are we doing to reduce probability or impact?]

**Example:**
> - Use provider's sandbox environment for testing
> - Build fallback authentication method (local dev mode)
> - Monitor provider status page daily
> - Document workarounds in SESSION_NOTES.md

**Contingency Plan (If Risk Occurs):**
[What will we do if this actually happens?]

**Example:**
> 1. Switch to fallback local authentication for testing
> 2. Communicate delay to stakeholders
> 3. Continue with non-auth related work
> 4. Re-evaluate provider choice if downtime exceeds 48 hours

**Owner:** [Name] - Responsible for monitoring and executing mitigation
**Status:** Active | Mitigating | Occurred | Mitigated | Accepted

**Last Reviewed:** YYYY-MM-DD

---

### R-2: [Another Risk]

[Follow same structure as R-1]

---

<!-- Add more risks as needed: R-3, R-4, etc. -->

---

## 🤔 Assumptions

> **Definition:** Things we believe to be true but haven't verified (and might be wrong)

| ID | Assumption | Validation Method | Risk if Wrong | Status |
|----|------------|-------------------|---------------|--------|
| A-1 | [What we assume] | [How to verify] | [Impact if invalid] | ✅ Validated / ⚠️ Unverified |
| A-2 | [What we assume] | [How to verify] | [Impact if invalid] | ✅ Validated / ⚠️ Unverified |

---

### A-1: [Assumption Title]

**Assumption:**
[What are we assuming is true?]

**Example:**
> Users will accept storing preferences in browser localStorage (not just server-side).

**Basis:**
[Why do we think this is true? Any supporting evidence?]

**Example:**
> Similar pattern used successfully in other parts of the application. No user complaints about localStorage usage in past features.

**Validation Method:**
[How can we test if this assumption is actually true?]

**Example:**
> - Review analytics data on localStorage usage from other features
> - Ask 5-10 beta users for feedback
> - Monitor support tickets after launch

**Risk if Wrong:**
[What's the impact if this assumption is invalid?]

**Example:**
> - May need to redesign to server-only storage
> - Could require additional API endpoints
> - 2-3 days of rework estimated

**Validation Timeline:**
When do we need to verify this?

**Example:**
> Before Phase 3 (UI implementation) - need to know by Day 5

**Status:** ✅ Validated | ⚠️ Unverified | ❌ Invalidated
**Last Checked:** YYYY-MM-DD

---

### A-2: [Another Assumption]

[Follow same structure as A-1]

---

## 🔗 Dependencies

> **Definition:** Things we rely on or are waiting for (from others or external)

### Internal Dependencies (Within Our Team/Project)

| ID | Dependency | Type | Needed By | Status | Blocker? |
|----|------------|------|-----------|--------|----------|
| D-1 | [What we need] | Work Item / Feature / Resource | Date/Phase | 🟢 Complete / 🟡 In Progress / 🔴 Blocked | Yes/No |
| D-2 | [What we need] | Work Item / Feature / Resource | Date/Phase | Status | Yes/No |

---

#### D-1: [Internal Dependency Title]

**What We Need:**
[Specific deliverable or condition we're waiting for]

**Example:**
> Work item 0015 (User Authentication API) must be complete and deployed to staging.

**Why We Need It:**
[How this blocks our work]

**Example:**
> Our preferences API requires authenticated user sessions to function. Can't test or deploy without auth system in place.

**Needed By:** [Date or Phase]
**Example:** Before Phase 3 (API implementation)

**Current Status:** 🟢 Complete | 🟡 In Progress | 🔴 Blocked | ⏸️ Paused
**Owner (Who Provides):** [Name/Team]
**Last Updated:** YYYY-MM-DD

**Is This a Blocker?** Yes | No
**If Yes, Blocking:** [Which phase/task]

**Workaround (If Available):**
[Can we proceed without this? How?]

**Example:**
> Can use mock auth tokens for local development. Blocks staging deployment only.

---

### External Dependencies (Outside Our Control)

| ID | Dependency | Provider | Needed By | Status | Blocker? |
|----|------------|----------|-----------|--------|----------|
| E-1 | [What we need] | [Who provides it] | Date/Phase | Status | Yes/No |

---

#### E-1: [External Dependency Title]

**What We Need:**
[Specific external deliverable or service]

**Example:**
> AWS S3 bucket created with proper IAM permissions for file uploads.

**Provider:** [Team/Vendor/Service]
**Example:** DevOps team

**Why We Need It:**
[How this blocks our work]

**Example:**
> Preference avatars will be stored in S3. Can't test file upload functionality without bucket access.

**Request Status:**
- [ ] Not requested yet
- [ ] Requested (Date: YYYY-MM-DD)
- [ ] In progress
- [ ] Delivered
- [ ] Verified working

**Needed By:** [Date or Phase]
**Point of Contact:** [Name/Email]
**Last Updated:** YYYY-MM-DD

**Is This a Blocker?** Yes | No

**Escalation Plan (If Delayed):**
[What do we do if this doesn't arrive on time?]

---

## 🚧 Active Blockers

> **Definition:** Issues currently preventing progress RIGHT NOW

| ID | Blocker | Impact | Blocked Since | Resolution ETA | Owner |
|----|---------|--------|---------------|----------------|-------|
| B-1 | [What's blocking us] | [Which tasks] | YYYY-MM-DD | Date/Unknown | [Name] |

**⚠️ If you have active blockers, update this section DAILY**

---

### B-1: [Blocker Title]

**What's Blocked:**
[Specifically what can't proceed]

**Example:**
> Cannot deploy to staging environment - deployment pipeline failing.

**Why It's Blocked:**
[Root cause or blocker description]

**Example:**
> Environment variables not configured on staging server. DevOps team backlog is 2 weeks deep.

**Impact:**
- **Tasks Affected:** [List specific tasks from IMPLEMENTATION_PLAN.md]
- **People Affected:** [Who's waiting?]
- **Timeline Impact:** [How much delay if not resolved?]

**Example:**
> - Tasks 4.1-4.3 (Integration testing) cannot start
> - Blocking 1 developer full-time
> - Each day of delay pushes completion by 1 day

**Blocked Since:** YYYY-MM-DD
**Resolution ETA:** YYYY-MM-DD | Unknown

**Actions Taken:**
- [x] [Action 1 - Date]
- [ ] [Action 2 - In progress]
- [ ] [Action 3 - Planned]

**Example:**
- [x] Contacted DevOps team via Slack - 2024-10-29
- [x] Escalated to manager - 2024-10-30
- [ ] Follow up with alternative solution (local staging)

**Owner:** [Name] - Responsible for driving resolution

**Workaround (If Available):**
[Can we make progress in another way?]

**Example:**
> Set up local environment to mimic staging for testing. Not ideal but unblocks development.

**Resolution Plan:**
[How will this be resolved?]

**Status:** 🔴 Blocked | 🟡 In Progress | 🟢 Resolved

---

## 🎯 Constraints

> **Definition:** Known limitations we must work within (not risks, but realities)

### Technical Constraints

- **Constraint 1:** [Limitation]
  - **Impact:** [How this affects our approach]
  - **Workaround:** [How we're accommodating this]

**Example:**
- **Database:** Must use PostgreSQL (existing infrastructure)
  - **Impact:** Can't use MongoDB-specific features we considered
  - **Workaround:** Use PostgreSQL JSONB for flexible schema

---

### Resource Constraints

- **Constraint:** [Limitation]
  - **Impact:** [Effect on timeline/scope]
  - **Mitigation:** [How we're managing]

**Example:**
- **Time:** Must launch by end of Q4 (hard deadline)
  - **Impact:** Can't implement "nice-to-have" features in MVP
  - **Mitigation:** Prioritized must-haves, deferred rest to Phase 2

---

### Business Constraints

- **Constraint:** [Limitation]
  - **Impact:** [Effect on approach]

**Example:**
- **Budget:** $0 for new third-party services
  - **Impact:** Must use existing tools only
  - **Workaround:** Build in-house instead of using SaaS solution

---

### Compliance/Security Constraints

- **Constraint:** [Requirement]
  - **Impact:** [How this shapes design]

**Example:**
- **GDPR:** Must allow users to delete all their data
  - **Impact:** Need "delete account" functionality
  - **Design:** Preferences must cascade delete with user account

---

## 🔄 Risk Status Summary

### By Severity

- 🔴 **Critical Risks:** [Count] active
- 🟠 **High Risks:** [Count] active
- 🟡 **Medium Risks:** [Count] active
- 🟢 **Low Risks:** [Count] active (may accept without mitigation)

### By Status

- **Active (Monitoring):** [Count]
- **Mitigating (Working on it):** [Count]
- **Occurred (Happened):** [Count]
- **Mitigated (Resolved):** [Count]
- **Accepted (Living with it):** [Count]

### Overall Risk Level

**Current Assessment:** 🔴 High | 🟡 Medium | 🟢 Low

**Rationale:**
[Why this overall assessment? What's driving it?]

**Recommendation:**
[Should we proceed? Pause? Escalate?]

---

## 🧭 Context-Engineering: Invariants vs. Variants

### Invariants (Unchangeable Constraints)

These are hard boundaries we cannot negotiate:

- **Technical:** [e.g., "Must use PostgreSQL"]
- **Business:** [e.g., "Hard deadline: 2024-12-31"]
- **Compliance:** [e.g., "GDPR compliance required"]
- **Resource:** [e.g., "Solo developer - no team available"]

**These define the problem space. If these change, re-evaluate the work item.**

### Variants (Flexible Risks/Assumptions)

These may change as we learn:

- **Risk probabilities** (update as we get more information)
- **Mitigation strategies** (adjust based on effectiveness)
- **Assumptions** (validate and update)
- **Workarounds** (discover better alternatives)

**These are living, evolving assessments.**

---

## 📝 Stewardship & Maintenance

### Ownership

- **Risk Owner (Overall):** [Name] - Ensures this register stays current
- **Individual Risk Owners:** Assigned per risk in table above
- **Everyone's Responsibility:** Report new risks/blockers immediately

### Update Cadence

- **Daily:** Update active blockers (if any)
- **After Each Session:** Review if new risks/assumptions emerged
- **Weekly:** Full register review, update statuses
- **Before Major Milestones:** Comprehensive risk assessment

### Update Triggers

Update this register when:
- ✏️ **New risk discovered** - Add to register immediately
- ✏️ **Risk materializes** - Move to "Occurred", activate contingency plan
- ✏️ **Assumption invalidated** - Update status, assess impact
- ✏️ **Blocker introduced** - Add to Active Blockers section
- ✏️ **Dependency status changes** - Update dependency status

### Integration with Other Artifacts

- **SESSION_NOTES.md:** Link risk updates to session entries
- **PROBLEM_BRIEF.md:** If assumptions invalidate problem, update brief
- **TECHNICAL_RFC.md:** If risks force technical changes, update RFC
- **VALIDATION_PLAN.md:** If risks affect testing, update validation plan

---

## 📊 Risk Review Checklist

Use this before major milestones or weekly reviews:

- [ ] All active risks reviewed and statuses current?
- [ ] Any new risks emerged this week?
- [ ] Mitigation strategies working as expected?
- [ ] Any assumptions need validation now?
- [ ] Dependencies on track or need follow-up?
- [ ] Active blockers being addressed with urgency?
- [ ] Overall risk level acceptable to proceed?

---

## 📌 Notes & Lessons Learned

### What's Working Well

- [Positive note about risk management]

**Example:**
> Weekly risk reviews caught dependency issue early, allowing us to start workaround before it became blocking.

### What to Improve

- [Area for improvement in risk tracking]

**Example:**
> Need to validate assumptions earlier in the process. Waiting until Phase 3 to check localStorage assumption was too late.

### For Future Work Items

- [Lesson learned to apply next time]

**Example:**
> Always check DevOps availability before planning deployment-dependent tasks. Avoid surprises.

---

## 🔄 Closed Risks (Archive)

### Risks No Longer Active

| ID | Risk | Resolution | Closed Date |
|----|------|------------|-------------|
| R-X | [Past risk] | [How resolved] | YYYY-MM-DD |

**Example:**
| R-99 | OAuth API downtime | Provider stability improved, no incidents in 30 days | 2024-10-15 |

---

## 📚 Cross-References

**Related Artifacts for This Work Item:**
- **Problem & Value:** See `PROBLEM_BRIEF.md` for assumptions about user needs
- **Technical Approach:** See `TECHNICAL_RFC.md` for technical constraints and decisions
- **Validation:** See `VALIDATION_PLAN.md` for testing-related risks
- **Implementation:** See `IMPLEMENTATION_PLAN.md` for task dependencies
- **Progress:** See `SESSION_NOTES.md` for risk updates during sessions

---

**Part of:** CDD Modular Artifacts (RISK_REGISTER.md)
**Template Mode:** comprehensive

---

## Quick Start Guide

**New to this template? Start here:**

1. **Day 1:** List obvious risks, assumptions, dependencies
2. **Daily:** Update if blockers emerge or risks materialize
3. **Weekly:** Review all risks, update statuses, validate assumptions
4. **Before Completion:** Ensure all critical risks mitigated or accepted

**Keep it living!** This isn't write-once documentation - it's your safety net.
