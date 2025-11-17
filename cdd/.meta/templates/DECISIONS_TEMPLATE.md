---
id: XXXX
title: [Work Title]
type: feature|bug|refactor|spike|epic
status: draft
priority: critical|high|medium|low
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: [Author Name]
tags: "comma, separated, tags"

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
  # - "Match naming: use{Feature}Hook for custom hooks"

files_to_create: []
  # Estimated list of new files
files_to_modify: []
  # Estimated list of files needing changes
---

# [Work Title]

## Problem
> What problem are we solving? What pain point exists?

[Describe the problem clearly. Include context about why this matters now.]

## Solution
> How are we solving it? What's the high-level approach?

[Describe the solution at a conceptual level. Focus on the "what" not the "how".]

## Goals
> What specific, measurable objectives are we trying to achieve?

- Goal 1: [Specific, measurable outcome]
- Goal 2: [Specific, measurable outcome]
- Goal 3: [Specific, measurable outcome]

## User Stories
> Who will use this and what will they do?

**As a** [type of user]
**I want to** [perform some action]
**So that** [I get some benefit]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Functional Requirements

**FR-1:** [Specific requirement]
- Details: [Additional context]
- Validation: [How to verify it works]

**FR-2:** [Specific requirement]
- Details: [Additional context]
- Validation: [How to verify it works]

**FR-3:** [Specific requirement]
- Details: [Additional context]
- Validation: [How to verify it works]

## Non-Goals (Out of Scope)
> What are we explicitly NOT doing in this work?

- Non-goal 1: [What we're not doing and why]
- Non-goal 2: [What we're not doing and why]
- Non-goal 3: [What we're not doing and why]

## Design Considerations
> UI/UX requirements, visual design, user experience

### UI/UX Requirements
- [Requirement or guideline]
- [Requirement or guideline]

### Design References
- Link to mockups: [URL if available]
- Design system: [Which components/patterns to use]
- Accessibility: [Any specific a11y requirements]

### User Experience Flow
1. User does X
2. System responds with Y
3. User sees Z

## Technical Considerations

### Technology Stack
- **Languages:** [List]
- **Frameworks:** [List]
- **Libraries:** [List]
- **Tools:** [List]

### Architecture
- [Architectural approach or pattern]
- [How this fits into existing system]

### Data Model
- [Key entities and relationships]
- [Schema changes needed]

### API Design
- [Endpoints needed]
- [Request/response formats]

### Security Considerations
- [Authentication/authorization requirements]
- [Data protection needs]
- [Potential vulnerabilities to address]

### Performance Requirements
- [Response time requirements]
- [Scalability considerations]
- [Resource constraints]

## Technical Decisions

### Decision: [Decision Title]

**Context:**
[Why does this decision need to be made?]

**Options Considered:**

**Option A:** [Description]
- **Pros:**
  - Pro 1
  - Pro 2
- **Cons:**
  - Con 1
  - Con 2

**Option B:** [Description]
- **Pros:**
  - Pro 1
  - Pro 2
- **Cons:**
  - Con 1
  - Con 2

**Decision:** [Chosen option]

**Rationale:** [Why this option was selected over others]

**Trade-offs:** [What we're accepting with this choice]

**Revisit Conditions:** [When should we reconsider this decision?]

---

### Decision: [Another Decision Title]

[Same structure as above...]

## Implementation Hints for AI

> Specific guidance for AI assistants implementing this work

### Patterns to Follow
- **Pattern 1:** [Specific file/code reference]
  - Example: "Use the authentication flow in `auth/provider.ts` lines 45-78"
- **Pattern 2:** [Specific approach]
  - Example: "All API calls should use the `useQuery` hook from `lib/hooks/useQuery.ts`"

### Key Files to Reference
- `path/to/file1.ts` - [Why this file is important, what to learn from it]
- `path/to/file2.tsx` - [Why this file is important, what to learn from it]

### Suggested Implementation Approach
1. **Phase 1:** [What to do first]
   - Why this order matters
2. **Phase 2:** [What to do second]
   - Dependencies on Phase 1
3. **Phase 3:** [What to do third]
   - Final integration steps

### Common Pitfalls to Avoid
- ❌ **Pitfall 1:** [What not to do]
  - ✅ **Instead:** [What to do instead]
- ❌ **Pitfall 2:** [What not to do]
  - ✅ **Instead:** [What to do instead]

### Edge Cases to Handle
- Edge case 1: [Scenario and how to handle]
- Edge case 2: [Scenario and how to handle]

## Success Metrics
> How will we measure if this work is successful?

### User-Facing Metrics
- Metric 1: [Specific, measurable outcome]
- Metric 2: [Specific, measurable outcome]

### Technical Metrics
- Metric 1: [Specific, measurable outcome]
- Metric 2: [Specific, measurable outcome]

### Definition of Done
- [ ] All functional requirements implemented
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] Deployed to staging
- [ ] QA testing complete
- [ ] Deployed to production
- [ ] Success metrics validated

## Testing Requirements

### Unit Tests
- [ ] Test case 1: [Description]
- [ ] Test case 2: [Description]
- [ ] Test case 3: [Description]

### Integration Tests
- [ ] Test workflow 1: [Description]
- [ ] Test workflow 2: [Description]

### End-to-End Tests
- [ ] User journey 1: [Description]
- [ ] User journey 2: [Description]

### Performance Tests
- [ ] Load test: [Criteria]
- [ ] Stress test: [Criteria]

### Manual Testing
- [ ] Manual test scenario 1
- [ ] Manual test scenario 2

## Open Questions
> Anything that still needs clarification or decision

- [ ] Question 1: [What needs to be answered]
- [ ] Question 2: [What needs to be answered]
- [ ] Question 3: [What needs to be answered]

## Related Work
> Links to related work items, dependencies, or follow-up work

### Dependencies
- Depends on: [Work ID - Title]
- Blocks: [Work ID - Title]

### Related Work Items
- Related to: [Work ID - Title]
- Follow-up: [Work ID - Title]

### External Resources
- [Resource Name](URL) - Description
- [Resource Name](URL) - Description

## Timeline & Milestones
> Estimated timeline and key milestones

**Estimated Effort:** [X hours/days/weeks]

**Key Milestones:**
1. [Milestone 1] - [Target date]
2. [Milestone 2] - [Target date]
3. [Milestone 3] - [Target date]

**Target Completion:** [Date]

---

**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Status:** draft → in-progress → complete
