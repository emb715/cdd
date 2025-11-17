---
version: 1.0
description: Create a new work item with complete documentation structure
author: EMB (Ezequiel M. Benitez) @emb715

# Work Item Configuration
default_folder: "cdd"
default_type: "feature"
auto_detect_author: true
auto_increment_sequence: true

# Work item types and their folder structure
work_types:
  feature:
    path: "{{folder}}/{{sequence}}-{{name}}"
    description: "New feature or enhancement"
  bug:
    path: "{{folder}}/bugs/{{sequence}}-{{name}}"
    description: "Bug fix or issue resolution"
  refactor:
    path: "{{folder}}/refactor/{{sequence}}-{{name}}"
    description: "Code refactoring or technical improvement"
  spike:
    path: "{{folder}}/spikes/{{sequence}}-{{name}}"
    description: "Research, exploration, or proof-of-concept"
  epic:
    path: "{{folder}}/epics/{{sequence}}-{{name}}"
    description: "Large initiative spanning multiple features"

# Template files to create
template_files:
  - DECISIONS.md
  - IMPLEMENTATION_PLAN.md
  - SESSION_NOTES.md
  # IMPLEMENTATION_SUMMARY.md is created by /complete-work
---

# Creating a New Work Item

You are tasked with creating a new work item in the CDD (Context-Driven Development) system. This creates a self-contained folder with all necessary documentation for planning and tracking work.

## Critical Rules - READ FIRST

1. **DO NOT** start implementing code
2. **MUST** ask user to select work type first
3. **MUST** ask clarifying questions before generating documentation
4. **MUST** create complete folder structure with all template files
5. **MUST** auto-increment sequence number based on existing work items
6. **MUST** provide clear next steps after creation

## Process

### Step 1: Receive Initial Request

The user has provided a brief description of work to be done.

**Example inputs:**
- `/create-work user authentication system`
- `/create-work fix login timeout issue`
- `/create-work refactor database layer`

### Step 2: Select Work Type

**Ask the user which type of work item to create:**

```
What type of work item would you like to create?

A) 🎨 Feature - New feature or enhancement
B) 🐛 Bug - Bug fix or issue resolution
C) 🔧 Refactor - Code refactoring or technical improvement
D) 🔬 Spike - Research, exploration, or proof-of-concept
E) 🎯 Epic - Large initiative spanning multiple features

Please respond with A, B, C, D, or E.
```

### Step 3: Determine Sequence Number

1. Check the target directory for existing work items
2. Find the highest sequence number
3. Increment by 1 for the new work item

**Examples:**
- If `cdd/0001-user-auth/` exists, next is `0002`
- If `cdd/bugs/0003-timeout/` exists, next bug is `0004`
- Each subdirectory (features, bugs, refactor, spikes, epics) has independent numbering

### Step 4: Generate Work Folder Name

Convert user's description to kebab-case for folder name:

**Examples:**
- "User Authentication System" → `0001-user-authentication-system`
- "Fix Login Timeout" → `bugs/0001-fix-login-timeout`
- "Refactor Database Layer" → `refactor/0001-refactor-database-layer`

### Step 5: Ask Clarifying Questions

Based on work type, ask targeted questions to gather necessary information.

#### For FEATURES:

```
Great! Let's create a feature work item. I need some information:

1. Problem & Solution
   - What problem does this solve for users?
   - How will this feature solve it?

2. Target Users
   A) End users
   B) Administrators
   C) Developers
   D) Other (please specify)

3. Core Functionality
   - What are the key actions users should be able to perform?
   - Any specific user stories? (e.g., "As a user, I want to...")

4. Success Criteria
   - How will we know this feature is successful?
   - What metrics matter?

5. Scope
   - Any specific things this should NOT do? (non-goals)

6. Design/UI
   A) Follow existing design system
   B) New custom design needed
   C) Minimal/functional UI is fine
   D) Design mockups available (provide link)

7. Context
   - Are there existing files/components this should reference?
   - Any patterns or approaches to follow?

8. Priority
   A) Critical - Urgent, high impact
   B) High - Important, should be done soon
   C) Medium - Nice to have, normal priority
   D) Low - Enhancement, low urgency
```

#### For BUGS:

```
Let's document this bug fix. I need some information:

1. Bug Description
   - What is the current incorrect behavior?
   - What should happen instead?

2. Reproduction Steps
   - How can this bug be reproduced?
   - Consistently reproducible or intermittent?

3. Impact/Severity
   A) Critical - System broken, blocking users
   B) High - Major feature broken, workaround exists
   C) Medium - Annoyance, low impact
   D) Low - Minor issue, cosmetic

4. Affected Users
   - Who experiences this bug?
   - How many users affected? (estimate)

5. Root Cause
   - Do you know what's causing this? (if yes, describe)
   - Which files/components are involved?

6. Context
   - When did this start happening?
   - Recent changes that might be related?

7. Priority
   A) Critical - Fix immediately
   B) High - Fix within days
   C) Medium - Fix within week
   D) Low - Fix when convenient
```

#### For REFACTORS:

```
Let's plan this refactoring. I need some information:

1. Refactoring Goal
   - What are you trying to improve?
   - Performance? Maintainability? Scalability? Readability?

2. Current Pain Points
   - What makes the current code problematic?
   - What triggered the need for this refactor?

3. Scope
   - Which files/modules are in scope?
   - Any files that should NOT be changed?

4. Breaking Changes
   A) No breaking changes allowed
   B) Breaking changes OK if documented
   C) Major version bump acceptable

5. Success Metrics
   - How will you measure improvement?
   - What tests prove success?

6. Priority
   A) High - Technical debt blocking progress
   B) Medium - Should be done, not urgent
   C) Low - Nice to have cleanup
```

#### For SPIKES:

```
Let's define this research spike. I need some information:

1. Research Question
   - What question are you trying to answer?
   - What are you exploring?

2. Context
   - Why is this research needed now?
   - What decision depends on this?

3. Expected Deliverable
   A) Written report with findings
   B) Proof-of-concept code
   C) Architecture proposal
   D) Decision document with options
   E) Other (please specify)

4. Time Box
   - How much time should be allocated?
   - What's the deadline?

5. Success Criteria
   - What would make this spike successful?
   - What should you know by the end?

6. Priority
   A) High - Blocking other work
   B) Medium - Needed soon
   C) Low - Exploratory
```

#### For EPICS:

```
Let's create an epic. I need some information:

1. Epic Vision
   - What is the overarching goal?
   - What's the big picture?

2. User Value
   - What major user need does this address?
   - What's the business impact?

3. Known Sub-Features
   - What features do you already know will be part of this?
   - Can you list 3-5 major components?

4. Dependencies
   - What external factors affect this epic?
   - What must be in place first?

5. Timeline
   - What's the target timeline?
   - Any key milestones?

6. Priority
   A) Critical - Strategic priority
   B) High - Important initiative
   C) Medium - Planned work
   D) Low - Future consideration
```

### Step 6: Create Work Item Folder Structure

Based on collected information:

1. **Create the work folder:**
   ```
   cdd/XXXX-work-name/
   ```

2. **Copy and populate DECISIONS.md:**
   - Use template from `cdd/.meta/templates/DECISIONS_TEMPLATE.md`
   - Fill in frontmatter with gathered information
   - Populate sections based on user's answers
   - Auto-detect author from git config if enabled

3. **Create IMPLEMENTATION_PLAN.md:**
   - Copy template from `cdd/.meta/templates/IMPLEMENTATION_PLAN_TEMPLATE.md`
   - Leave empty/minimal - will be populated by `/plan-work`
   - Add note: "Run `/plan-work XXXX` to generate implementation plan"

4. **Create SESSION_NOTES.md:**
   - Copy template from `cdd/.meta/templates/SESSION_NOTES_TEMPLATE.md`
   - Set initial metadata (work ID, created date, status)
   - Ready for first session

### Step 7: Populate DECISIONS.md

Generate comprehensive DECISIONS.md based on work type and user answers:

**Key Sections to Populate:**

1. **YAML Frontmatter:**
   - `id`: Sequence number
   - `title`: Work title from user input
   - `type`: Selected work type
   - `status`: "draft"
   - `priority`: From user answers
   - `created`: Current date
   - `updated`: Current date
   - `author`: From git config or ask user
   - `tags`: Generate from user's description
   - `context_files`: From user answers (if provided)
   - `patterns_to_follow`: From user answers (if provided)
   - `dependencies`: From user answers (if provided)

2. **Problem Section:**
   - Write based on user's problem description
   - Make it clear and concise

3. **Solution Section:**
   - Write based on user's solution description
   - High-level approach

4. **Goals:**
   - Extract from user's success criteria
   - Make them specific and measurable

5. **User Stories** (for features):
   - Use user-provided stories
   - Or generate from functionality description

6. **Functional Requirements:**
   - Create numbered requirements (FR-1, FR-2, etc.)
   - Based on user's core functionality description
   - Make them specific and testable

7. **Non-Goals:**
   - Use user-provided non-goals
   - Or infer from scope discussion

8. **Design Considerations:**
   - Based on UI/design answers
   - Link to mockups if provided

9. **Technical Considerations:**
   - Based on context and patterns provided
   - List known technologies or approaches

10. **Implementation Hints for AI:**
    - Reference context files provided
    - List patterns to follow
    - Suggest implementation approach

11. **Success Metrics:**
    - From user's success criteria
    - Make them measurable

12. **Testing Requirements:**
    - Generate based on work type
    - Features: unit + integration + e2e
    - Bugs: regression tests
    - Refactors: existing tests must pass

### Step 8: Confirm Creation

After creating the work item, provide a clear summary:

```
✅ Work item created successfully!

📁 Location: cdd/XXXX-work-name/
🆔 Work ID: XXXX
📝 Type: [Feature/Bug/Refactor/Spike/Epic]
⭐ Priority: [Priority level]

📄 Files Created:
  ✓ DECISIONS.md - Requirements and decisions documented
  ✓ IMPLEMENTATION_PLAN.md - Ready for task generation
  ✓ SESSION_NOTES.md - Ready for session tracking

🎯 Next Steps:
1. Review DECISIONS.md and refine if needed
2. Run `/plan-work XXXX` to generate implementation tasks
3. Start working and use `/save-session XXXX` to track progress

💡 Quick Commands:
  /plan-work XXXX        - Generate implementation plan
  /save-session XXXX     - Save session progress
  /list-work             - View all work items
  /show-work XXXX        - View this work item details
```

## Examples

### Example 1: Creating a Feature

**User:** `/create-work user authentication system`

**AI Response:**
```
What type of work item would you like to create?

A) 🎨 Feature - New feature or enhancement
B) 🐛 Bug - Bug fix or issue resolution
C) 🔧 Refactor - Code refactoring or technical improvement
D) 🔬 Spike - Research, exploration, or proof-of-concept
E) 🎯 Epic - Large initiative spanning multiple features

Please respond with A, B, C, D, or E.
```

**User:** `A`

**AI:** [Asks feature-specific questions]

**User:** [Provides answers]

**AI:** [Creates work item]
```
✅ Work item created successfully!

📁 Location: cdd/0001-user-authentication-system/
🆔 Work ID: 0001
📝 Type: Feature
⭐ Priority: High

📄 Files Created:
  ✓ DECISIONS.md - User auth requirements documented
  ✓ IMPLEMENTATION_PLAN.md - Ready for task generation
  ✓ SESSION_NOTES.md - Ready for session tracking

🎯 Next Steps:
1. Review DECISIONS.md and refine if needed
2. Run `/plan-work 0001` to generate implementation tasks
3. Start working and use `/save-session 0001` to track progress
```

### Example 2: Creating a Bug Fix

**User:** `/create-work login timeout after 5 minutes`

**AI:** [Asks to select type]

**User:** `B` (Bug)

**AI:** [Asks bug-specific questions]

**User:** [Provides answers]

**AI:** [Creates work item in bugs/ subfolder]

## Special Handling

### Auto-Detection Features

1. **Author Detection:**
   - Try `git config user.name` first
   - Fall back to asking user if git config unavailable

2. **Context File Detection:**
   - If user mentions specific files, add to `context_files.primary`
   - If user mentions patterns, add to `patterns_to_follow`

3. **Tag Generation:**
   - Extract keywords from description
   - Add work type as tag
   - Add domain tags (auth, ui, api, etc.) if mentioned

### Validation

Before creating files:
- ✅ Ensure sequence number doesn't already exist
- ✅ Validate folder name (no special characters, spaces)
- ✅ Confirm templates exist in `.meta/templates/`
- ✅ Verify target directory is writable

### Error Handling

If creation fails:
- Provide clear error message
- Suggest resolution
- Do not leave partial work item (clean up if needed)

## Target Audience

This command is designed for:
- **Solo developers** starting new work
- **Team members** creating work items
- **AI assistants** helping structure work

The output should be:
- Clear and actionable
- Self-explanatory
- Ready to use immediately

## Remember

- **DO NOT** start implementing code - only create documentation
- **DO** make documentation comprehensive but focused
- **DO** provide clear next steps
- **DO** keep the process quick (target: 10-15 minutes total)
- **DO** make it easy to get started with the work

---

**Command Version:** 1.0
**Release Date:** 2025-10-29
**Author:** EMB (Ezequiel M. Benitez) @emb715
**Part of:** CDD v1.0 Methodology
