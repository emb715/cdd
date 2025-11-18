# Problem Brief: [Work Title]

> **Voice:** Product Owner / Stakeholder
> **Purpose:** Define WHAT needs to be built and WHY it matters
> **Audience:** Anyone needing to understand the business value and user impact
> **Part of:** CDD Modular Artifacts (PROBLEM_BRIEF.md)

---

**Work ID:** XXXX
**Type:** feature | bug | refactor | spike | epic
**Priority:** critical | high | medium | low
**Status:** draft | in-progress | review | complete

**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Owner:** [Your Name]

---

## 🎯 Problem Statement

> **What problem are we solving? Why does it matter?**

[Describe the problem clearly and concisely. Focus on the pain point or opportunity, not the solution. 2-4 sentences.]

**Example:**
> Users currently cannot save their preferences between sessions, forcing them to reconfigure settings every time they log in. This creates friction and leads to support requests. We've received 50+ complaints in the last month about this issue.

---

## 💡 Proposed Solution

> **How are we planning to solve it at a high level?**

[Describe the solution approach conceptually. Focus on "what" not "how" (implementation details go in TECHNICAL_RFC.md). 2-4 sentences.]

**Example:**
> Implement a user preferences system that persists settings to the database and loads them automatically on login. Provide a settings page where users can customize their experience and save their choices.

---

## 📊 Value Proposition

> **What value does this deliver? Who benefits?**

### Users Benefit

- **User Segment 1 (e.g., "Power Users"):**
  - Benefit: [Specific improvement to their experience]

- **User Segment 2 (e.g., "New Users"):**
  - Benefit: [Specific improvement to their experience]

### Business Benefits

- **Metric 1:** [Expected impact - e.g., "Reduce support tickets by 30%"]
- **Metric 2:** [Expected impact - e.g., "Increase user retention"]
- **Metric 3:** [Expected impact - e.g., "Enable feature X that was previously blocked"]

---

## 🎭 User Stories

> **Who needs this? What do they want to do? Why?**

### Story 1: [Title]

**As a** [type of user]
**I want to** [perform some action]
**So that** [I get some benefit]

**Acceptance Criteria:**
- [ ] User can [specific testable behavior]
- [ ] User sees [specific UI feedback]
- [ ] System does [specific backend behavior]

---

### Story 2: [Title]

**As a** [type of user]
**I want to** [perform some action]
**So that** [I get some benefit]

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

---

<!-- Add more user stories as needed -->

---

## ✅ Success Criteria

> **How will we know this work succeeded?**

### Must Have (Required for Completion)

- [ ] **SC-1:** [Specific, measurable criterion]
  - **Validation Method:** [How to verify - e.g., "Unit test", "Manual test", "User acceptance"]

- [ ] **SC-2:** [Specific, measurable criterion]
  - **Validation Method:** [How to verify]

- [ ] **SC-3:** [Specific, measurable criterion]
  - **Validation Method:** [How to verify]

### Nice to Have (Can Defer)

- [ ] [Nice-to-have feature 1]
- [ ] [Nice-to-have feature 2]

### Definition of Done

Work is complete when:
- ✅ All "Must Have" success criteria validated
- ✅ Evidence provided in VALIDATION_PLAN.md
- ✅ User stories demonstrate working functionality
- ✅ No critical bugs or blockers remaining

---

## 🚫 Non-Goals (Explicit Scope Boundaries)

> **What are we explicitly NOT doing? Why?**

This helps prevent scope creep and sets clear expectations.

- **Non-goal 1:** [What we're not doing]
  - **Rationale:** [Why not - e.g., "Out of MVP scope", "Different user segment", "Future phase"]

- **Non-goal 2:** [What we're not doing]
  - **Rationale:** [Why not]

---

## 📈 Impact & Metrics

> **How will we measure success after deployment?**

### Leading Metrics (What to track during implementation)

- **Metric:** [What to measure]
  - **Target:** [Specific goal]
  - **Measurement:** [How to collect]

### Lagging Metrics (What to track after deployment)

- **Metric:** [What to measure - e.g., "Support tickets about settings"]
  - **Baseline:** [Current state]
  - **Target:** [Goal after deployment]
  - **Timeline:** [When to measure - e.g., "30 days post-launch"]

---

## 🗺️ User Journey (Optional - for UX-heavy work)

> **How does the user experience this feature end-to-end?**

### Current State (Before)

1. User logs in
2. User manually configures settings
3. User logs out
4. **Pain Point:** Settings lost
5. User logs in again
6. User frustrated, reconfigures settings

### Desired State (After)

1. User logs in
2. Settings automatically loaded
3. User works with their preferences
4. (Optional) User changes a setting
5. Setting auto-saved or user clicks "Save"
6. Settings persist across sessions

---

## 🔗 Related Work & Context

> **How does this fit into the larger picture?**

### Dependencies (Blockers)

- **Depends on:** [Work ID - Title] - **Status:** [complete | in-progress]
  - **Why:** [How this blocks current work]

### Blocks Other Work

- **Blocks:** [Work ID - Title]
  - **Why:** [How this enables that work]

### Related Work

- **Related to:** [Work ID - Title]
  - **Relationship:** [How they connect - e.g., "Same epic", "Shares component"]

### Follow-Up Work (Identified Future Items)

- **Follow-up:** [Potential future work item]
  - **Reason:** [Why it's deferred - e.g., "Phase 2 feature", "Nice-to-have"]

---

## 🧭 Context-Engineering: Invariants vs. Variants

> **What stays constant vs. what can change?**

### Invariants (Should NOT Change Without Deliberate Decision)

These are the core constraints that define the problem:

- **User need:** [The fundamental problem being solved]
- **Success criteria:** [Must-have outcomes]
- **Target users:** [Who this serves]
- **Core value proposition:** [Why this matters]

**If these change, the work item should be re-evaluated or split.**

### Variants (Can Change During Implementation)

These details may evolve as we learn:

- **Specific UI design** (how we present it)
- **Implementation approach** (which library, pattern, etc.)
- **Nice-to-have features** (can be deferred)
- **Exact metrics targets** (can be refined with data)

**These can be adjusted without invalidating the work item.**

---

## 📝 Stewardship & Maintenance

### Ownership

- **Primary Owner:** [Name/Role] - Responsible for keeping this artifact current
- **Stakeholders:** [Names/Roles] - Should be consulted for changes
- **Reviewer:** [Name/Role] - Validates accuracy before major updates

### Review Cadence

- **During Implementation:** Review when requirements change or new user needs discovered
- **At Milestones:** Validate assumptions still hold
- **Before Completion:** Ensure success criteria still align with original problem

### Update Triggers

Update this artifact when:
- ✏️ **User needs change** - New pain points discovered
- ✏️ **Success criteria adjusted** - Based on feasibility or new information
- ✏️ **Scope changes** - Non-goals become goals or vice versa
- ✏️ **Dependencies change** - Blockers resolved or new blockers discovered

### Decay Signals (When This Needs Refresh)

⚠️ **Review immediately if:**
- Problem statement no longer matches implementation direction
- Success criteria conflict with current approach
- User stories don't reflect actual requirements
- Non-goals are being implemented anyway

---

## 📌 Notes & Assumptions

### Key Assumptions

1. **Assumption:** [What we're assuming is true]
   - **Validation:** [How to verify - e.g., "User research", "Data analysis"]
   - **Risk if wrong:** [Impact if assumption is invalid]

2. **Assumption:** [What we're assuming is true]
   - **Validation:** [How to verify]
   - **Risk if wrong:** [Impact]

### Open Questions

Questions that may affect this problem brief:

- [ ] **Q:** [Question needing answer]
  - **Blocker:** Yes | No
  - **Who can answer:** [Person/team/data source]

- [ ] **Q:** [Question needing answer]
  - **Blocker:** Yes | No

### Constraints

Known limitations that constrain the solution:

- **Constraint:** [Limitation - e.g., "Must work on mobile", "Budget limit $X"]
  - **Impact:** [How this affects the solution]

---

## 🔄 Version History

| Version | Date | Author | Change Summary |
|---------|------|--------|----------------|
| 1.0 | YYYY-MM-DD | [Name] | Initial problem brief created |
| 1.1 | YYYY-MM-DD | [Name] | Updated success criteria based on [reason] |

---

## 📚 Cross-References

**Related Artifacts for This Work Item:**
- **Technical Details:** See `TECHNICAL_RFC.md` for implementation approach
- **Risks & Blockers:** See `RISK_REGISTER.md` for constraints and mitigations
- **Validation:** See `VALIDATION_PLAN.md` for testing strategy and evidence
- **Implementation:** See `IMPLEMENTATION_PLAN.md` for task breakdown
- **Progress:** See `SESSION_NOTES.md` for session-by-session updates

---

**Part of:** CDD Modular Artifacts (PROBLEM_BRIEF.md)
**Template Mode:** comprehensive
