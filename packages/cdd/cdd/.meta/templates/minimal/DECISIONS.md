---
id: XXXX
title: [Work Title]
type: feature|bug|refactor|spike|epic
status: draft
priority: critical|high|medium|low
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: [Author Name]
assignee: [Assignee Name]
tags: "comma, separated, tags"
template_mode: minimal

# Context for AI Implementation
context_files:
  primary: []
    # - path/to/critical/file.ts - Why it's critical
  reference: []
    # - path/to/reference/file.ts - What pattern to follow

dependencies:
  internal: []
    # - "0001-dependency-work must be complete"
  external: []
    # - "API credentials from DevOps team"

patterns_to_follow: []
  # - "Follow authentication pattern in auth/provider.ts"
  # - "Use shadcn/ui components for all UI"

# Metrics (optional - updated automatically by /cdd:save-session)
sessions_count: 0
total_hours: 0
context_reacquisition_minutes: 0
planned_tasks_total: 0
completed_tasks_total: 0
---

# [Work Title]

## Problem
> What problem are we solving? Why does it matter?

[Describe the problem clearly. Include:
- Current pain points or issues
- Who is affected
- Impact if not resolved]

## Solution
> How will we solve it? What's the approach?

[Describe the solution approach. Include:
- High-level technical approach
- Key components or changes
- Why this approach over alternatives]

## Functional Requirements

### Must Have (P0)
- [ ] **FR-1**: [Specific requirement] - [Why it's required]
- [ ] **FR-2**: [Specific requirement] - [Why it's required]
- [ ] **FR-3**: [Specific requirement] - [Why it's required]

### Should Have (P1)
- [ ] **FR-4**: [Specific requirement] - [Why it's important]
- [ ] **FR-5**: [Specific requirement] - [Why it's important]

### Could Have (P2)
- [ ] **FR-6**: [Nice-to-have requirement] - [Why it's beneficial]

## Technical Decisions

### Decision 1: [Decision Title]
**Context:** [Why this decision was needed]

**Options Considered:**
- Option A: [Pros/cons]
- Option B: [Pros/cons]

**Chosen:** Option A

**Rationale:** [Why this was chosen]

---

### Decision 2: [Decision Title]
**Context:** [Why this decision was needed]

**Chosen:** [The decision]

**Rationale:** [Why]

---

## Success Criteria
> How do we know this work is complete and successful?

- [ ] **SC-1**: [Measurable criterion with validation method]
- [ ] **SC-2**: [Measurable criterion with validation method]
- [ ] **SC-3**: [Measurable criterion with validation method]

## Testing Requirements

### Unit Tests
- [ ] [What needs unit test coverage]
- [ ] [What needs unit test coverage]

### Integration Tests
- [ ] [What integration scenarios to test]
- [ ] [What integration scenarios to test]

### Manual Testing
- [ ] [What to test manually]
- [ ] [What to test manually]

## Constraints & Assumptions

### Constraints
- [Technical or business constraint]
- [Technical or business constraint]

### Assumptions
- [Assumption being made] - [Needs validation: yes/no]
- [Assumption being made] - [Needs validation: yes/no]

## Risks & Blockers

### Current Risks
- **Risk**: [Description] - [Mitigation strategy]

### Current Blockers
- [ ] **Blocker**: [Description] - [Owner/action needed]

## Out of Scope
> What are we explicitly NOT doing?

- [Out of scope item and why]
- [Out of scope item and why]

---

**Files Expected to Change:**
- Create: `[list of files to create]`
- Modify: `[list of files to modify]`

**Review Checkpoints:**
- [ ] After implementation plan created
- [ ] After core functionality complete
- [ ] Before marking complete
