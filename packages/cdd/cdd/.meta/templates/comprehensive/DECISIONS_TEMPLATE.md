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
template_mode: comprehensive

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

files_to_create: []
  # Estimated list of new files (update as you discover more)
files_to_modify: []
  # Estimated list of files needing changes (update as you discover more)

# Modular Artifacts
modular_artifacts:
  problem_brief: PROBLEM_BRIEF.md
  technical_rfc: TECHNICAL_RFC.md
  risk_register: RISK_REGISTER.md
  validation_plan: VALIDATION_PLAN.md
---

# [Work Title]

> **Review Cadence:** See [Context Stewardship Guide](../.meta/CONTEXT_STEWARDSHIP.md) for maintenance schedule

---

## 📋 CORE BRIEF (Always Required)

> **Context Engineering Note:** These are INVARIANTS - they define what doesn't change about this work.

### Problem
> What problem are we solving? Why does it matter?

[Describe the problem clearly and concisely. 2-4 sentences.]

### Solution
> How are we solving it at a high level?

[Describe the solution approach conceptually. 2-4 sentences. Focus on "what" not "how".]

### Goals
> What specific, measurable outcomes are we aiming for?

1. **Goal 1:** [Specific, measurable outcome]
2. **Goal 2:** [Specific, measurable outcome]
3. **Goal 3:** [Specific, measurable outcome]

### Success Criteria
> How will we know this work succeeded?

**Must Have (Required):**
- [ ] Criterion 1 - [How to verify]
- [ ] Criterion 2 - [How to verify]
- [ ] Criterion 3 - [How to verify]

**Evidence Required at Completion:**
- [ ] Test results (unit, integration, e2e)
- [ ] Manual testing verification
- [ ] [Other evidence specific to this work]

---

## 🎯 FUNCTIONAL REQUIREMENTS (Always Required)

> **Context Engineering Note:** Core requirements are INVARIANTS. Details may be VARIANTS.

**FR-1:** [Requirement title]
- **Details:** [What exactly must be built]
- **Validation:** [How to verify it works]

**FR-2:** [Requirement title]
- **Details:** [What exactly must be built]
- **Validation:** [How to verify it works]

**FR-3:** [Requirement title]
- **Details:** [What exactly must be built]
- **Validation:** [How to verify it works]

<!-- Add more as needed: FR-4, FR-5, etc. -->

### Non-Goals (Out of Scope)
> What are we explicitly NOT doing?

- **Non-goal 1:** [What we're not doing and why]
- **Non-goal 2:** [What we're not doing and why]

---

## 📈 EXPAND AS NEEDED

> **Progressive Detail Guidance:**
> - Start with Core Brief + Functional Requirements
> - Add sections below as complexity demands
> - Mark sections "TBD" if unknown during creation
> - Update during implementation when decisions are made

---

### 👤 User Stories (For features with UI/UX)

<details>
<summary>📖 <strong>Expand when:</strong> Building user-facing features, need to define user flows</summary>

**As a** [type of user]
**I want to** [perform some action]
**So that** [I get some benefit]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

<!-- Copy pattern for multiple user stories -->

</details>

---

### 🎨 Design Considerations (For features with UI)

<details>
<summary>📖 <strong>Expand when:</strong> Building UI components, need design guidance</summary>

#### UI/UX Requirements
- [Requirement or guideline]
- [Requirement or guideline]

#### Design References
- **Mockups:** [URL or "None - follow existing patterns"]
- **Design System:** [Which components to use - e.g., "shadcn/ui"]
- **Accessibility:** [Specific a11y requirements or "Follow WCAG 2.1 AA"]

#### User Experience Flow
1. User does X
2. System responds with Y
3. User sees Z

</details>

---

### 🔧 Technical Considerations (Expand as complexity increases)

<details>
<summary>📖 <strong>Expand when:</strong> Architecture decisions needed, performance critical, security sensitive</summary>

#### Technology Stack
- **Languages:** [List or "See package.json"]
- **Frameworks:** [List or "Current stack"]
- **Key Libraries:** [New dependencies or "None new"]

#### Architecture
- [How this fits into existing system]
- [Architectural pattern if applicable - MVC, microservices, etc.]

#### Data Model (if applicable)
- [Key entities and relationships]
- [Schema changes needed]

#### API Design (if applicable)
```
POST /api/endpoint
Request: { ... }
Response: { ... }
```

#### Security Considerations
- [ ] Authentication/authorization requirements
- [ ] Data protection/encryption needs
- [ ] Potential vulnerabilities to address

#### Performance Requirements
- Response time: [e.g., "< 200ms" or "Not critical"]
- Scalability: [e.g., "Handle 1000 concurrent users" or "Low traffic expected"]
- Resource constraints: [e.g., "Mobile-friendly" or "None"]

</details>

---

### 💡 Technical Decisions (Document major decisions as they're made)

<details>
<summary>📖 <strong>Expand when:</strong> Choosing between 2+ approaches, making non-obvious tradeoffs</summary>

#### Decision: [Decision Title]

**Context:**
[Why does this decision need to be made? What's the situation?]

**Options Considered:**

**Option A:** [Description]
- ✅ **Pros:** Pro 1, Pro 2
- ❌ **Cons:** Con 1, Con 2

**Option B:** [Description]
- ✅ **Pros:** Pro 1, Pro 2
- ❌ **Cons:** Con 1, Con 2

**Decision:** ✅ Option [A/B] chosen

**Rationale:**
[Why this option was selected. Be specific about the deciding factors.]

**Trade-offs Accepted:**
[What we're giving up with this choice - be honest]

**Revisit Conditions:**
[Under what circumstances should we reconsider? e.g., "If user load exceeds 10k/day"]

---

<!-- Copy pattern for additional decisions -->

</details>

---

### 🤖 Implementation Hints for AI (Help AI assistants implement effectively)

<details>
<summary>📖 <strong>Expand when:</strong> Complex codebase, specific patterns must be followed, known pitfalls</summary>

#### Patterns to Follow
- **Pattern 1:** Reference specific file/code
  - Example: "Use authentication flow in `auth/provider.ts` lines 45-78"
- **Pattern 2:** Describe approach
  - Example: "All API calls use `useQuery` hook from `lib/hooks/`"

#### Key Files to Reference
- `path/to/file1.ts` - [Why important, what to learn from it]
- `path/to/file2.tsx` - [Why important, what to learn from it]

#### Suggested Implementation Phases
1. **Phase 1:** [What to do first - why this order matters]
2. **Phase 2:** [What to do second - dependencies on Phase 1]
3. **Phase 3:** [Final integration steps]

#### Common Pitfalls to Avoid
- ❌ **Pitfall 1:** [What not to do]
  - ✅ **Instead:** [What to do instead]
- ❌ **Pitfall 2:** [What not to do]
  - ✅ **Instead:** [What to do instead]

#### Edge Cases to Handle
- **Edge case 1:** [Scenario] → [How to handle]
- **Edge case 2:** [Scenario] → [How to handle]

</details>

---

### 🧪 Testing Requirements (Define test strategy)

<details>
<summary>📖 <strong>Expand when:</strong> Complex testing needed, multiple test types required</summary>

#### Unit Tests
- [ ] Test case 1: [Description]
- [ ] Test case 2: [Description]
- [ ] Test case 3: [Description]

#### Integration Tests
- [ ] Test workflow 1: [Description]
- [ ] Test workflow 2: [Description]

#### End-to-End Tests
- [ ] User journey 1: [Description]
- [ ] User journey 2: [Description]

#### Manual Testing Checklist
- [ ] Scenario 1
- [ ] Scenario 2

**Minimum Coverage Required:** [e.g., "80% for new code" or "Critical paths only"]

</details>

---

### ❓ Open Questions (Track unknowns)

<details>
<summary>📖 <strong>Expand when:</strong> Uncertainties exist, research needed, waiting for decisions</summary>

- [ ] **Question 1:** [What needs answering] - **Blocker:** Yes/No
- [ ] **Question 2:** [What needs answering] - **Blocker:** Yes/No
- [ ] **Question 3:** [What needs answering] - **Blocker:** Yes/No

**Resolution Process:**
- Blocking questions: Resolve before starting implementation
- Non-blocking questions: Can resolve during implementation

</details>

---

### 🔗 Related Work (Link dependencies and follow-up)

<details>
<summary>📖 <strong>Expand when:</strong> Work has dependencies, part of larger initiative, generates follow-up work</summary>

#### Dependencies
- **Depends on:** [Work ID - Title] - Status: [complete/in-progress/blocked]
- **Blocks:** [Work ID - Title]

#### Related Work Items
- **Related to:** [Work ID - Title] - [How they relate]
- **Follow-up:** [Work ID - Title or "Create after completion"]

#### External Resources
- [Resource Name](URL) - [How it helps]
- [Resource Name](URL) - [How it helps]

</details>

---

### 📅 Timeline & Milestones (For epics or time-sensitive work)

<details>
<summary>📖 <strong>Expand when:</strong> Epics, deadlines exist, phased rollout planned</summary>

**Estimated Effort:** [X hours/days/weeks]

**Key Milestones:**
1. [Milestone 1] - [Target date] - [Definition of done]
2. [Milestone 2] - [Target date] - [Definition of done]
3. [Milestone 3] - [Target date] - [Definition of done]

**Target Completion:** [Date or "No hard deadline"]

**Risks to Timeline:**
- [Risk 1 that could delay work]
- [Risk 2 that could delay work]

</details>

---

## 📝 Maintenance Notes

**Context Stewardship:**
- ✅ **Created:** YYYY-MM-DD - Initial context captured
- 🔄 **Last Reviewed:** YYYY-MM-DD - See [Stewardship Guide](../.meta/CONTEXT_STEWARDSHIP.md)
- 📊 **Status History:** draft → [track transitions]

**Update Triggers:** (When to update this document)
- ✏️ **Major decision made** → Add to Technical Decisions section
- 🔀 **Requirements changed** → Update Functional Requirements
- 🚧 **Discovered blocker** → Add to Open Questions or Dependencies
- 📂 **Files created/modified** → Update frontmatter lists

---

**Template Mode:** comprehensive
**Part of:** CDD Methodology (DECISIONS.md)
