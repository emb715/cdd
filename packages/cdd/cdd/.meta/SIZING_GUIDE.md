# CDD Template Mode Sizing Guide

> **Purpose:** Help you choose the right template mode for your work
> **Quick Answer:** When in doubt, use **solo-dev** mode (the default)

---

## Template Modes Overview

CDD provides three template modes, each optimized for different scenarios:

| Mode | Best For | Files Created | Typical Size |
|------|----------|---------------|--------------|
| **solo-dev** (DEFAULT) | Single developer, any work size | DECISIONS.md, IMPLEMENTATION_PLAN.md, SESSION_NOTES.md | 50-100 lines each |
| **minimal** | Small collaborative work, low risk | Same + more detail | 100-200 lines each |
| **comprehensive** | Complex work, high risk, multiple stakeholders | All + PROBLEM_BRIEF, TECHNICAL_RFC, RISK_REGISTER, VALIDATION_PLAN | 200-700 lines each |

---

## Decision Matrix

### Use **solo-dev** Mode When:

✅ **Team Size:** You're working alone
✅ **Duration:** Any (works for both quick fixes and long projects)
✅ **Risk:** Low to medium
✅ **Stakeholders:** Just you
✅ **Documentation Needs:** Minimal overhead, maximum speed

**Characteristics:**
- Fastest to start
- Least documentation overhead
- Essential context only
- Perfect for solo developers who want context preservation without bureaucracy

**Examples:**
- Personal projects of any size
- Solo freelance work
- Individual features in larger projects
- Bug fixes (any complexity)
- Refactoring tasks
- Spikes and research work

---

### Use **minimal** Mode When:

✅ **Team Size:** 2-5 people collaborating
✅ **Duration:** < 5 days / < 10 tasks
✅ **Risk:** Low to medium
✅ **Stakeholders:** Team members only
✅ **Documentation Needs:** Enough for handoffs and reviews

**Characteristics:**
- Structured for collaboration
- Includes testing requirements
- Tracks decisions with rationale
- Supports basic risk tracking
- Good for team coordination

**Examples:**
- Small team features
- Bug fixes requiring coordination
- Minor API changes
- UI component additions
- Database migration tasks
- Integration work with clear scope

---

### Use **comprehensive** Mode When:

✅ **Team Size:** Multiple teams or external stakeholders
✅ **Duration:** > 10 days / > 20 tasks
✅ **Risk:** High (security, data, compliance, performance-critical)
✅ **Stakeholders:** Product, engineering, QA, operations, external partners
✅ **Documentation Needs:** Full traceability and accountability

**Characteristics:**
- Separation of concerns (modular artifacts)
- Formal decision tracking (RFC)
- Comprehensive risk management
- Detailed validation planning
- Full evidence chain

**Examples:**
- Platform redesigns
- Security-critical features (auth, payments)
- Data migration projects
- Public API launches
- Compliance-related work
- Cross-team epics
- Architecture changes affecting multiple systems

---

## Quick Selection Tool

Answer these questions:

**Q1: Are you working alone?**
- Yes → **solo-dev** (unless high risk)
- No → Continue

**Q2: Is this high risk? (security, data loss, revenue impact)**
- Yes → **comprehensive**
- No → Continue

**Q3: How long will this take?**
- < 5 days → **minimal**
- > 10 days → **comprehensive**
- 5-10 days → Continue

**Q4: How many people need to understand this work?**
- Just your team (< 5 people) → **minimal**
- Multiple teams or external stakeholders → **comprehensive**

---

## Mode Comparison by Scenario

### Scenario: Adding a New API Endpoint

| Context | Recommended Mode | Why |
|---------|-----------------|-----|
| Internal tool, solo dev | solo-dev | Fast, you own it |
| Team project, standard CRUD | minimal | Team needs context, low risk |
| Public API, authentication required | comprehensive | High risk, needs formal review |

### Scenario: Bug Fix

| Context | Recommended Mode | Why |
|---------|-----------------|-----|
| UI typo or styling issue | solo-dev | Quick fix, low risk |
| Logic bug affecting users | minimal | Needs testing plan, team review |
| Security vulnerability | comprehensive | High risk, needs formal tracking |

### Scenario: Database Change

| Context | Recommended Mode | Why |
|---------|-----------------|-----|
| Adding non-critical column | minimal | Low risk, needs migration tracking |
| Changing core schema | comprehensive | High risk, affects multiple systems |
| Data migration (large dataset) | comprehensive | Risk of data loss, needs validation |

### Scenario: Refactoring

| Context | Recommended Mode | Why |
|---------|-----------------|-----|
| Single file cleanup | solo-dev | Small scope, you understand it |
| Module restructuring | minimal | Team needs to understand changes |
| Architecture change | comprehensive | Affects multiple teams, high complexity |

---

## Switching Modes Mid-Project

**Can you switch modes?** Yes, but plan for it.

### Upgrading Mode (solo-dev → minimal → comprehensive)

**When to upgrade:**
- Scope expanded
- Risk increased
- More stakeholders involved
- Compliance/audit requirements emerged

**How to upgrade:**
1. Copy existing files to appropriate template folder
2. Fill in additional sections
3. Update `template_mode` in frontmatter
4. Create missing artifacts (if going to comprehensive)

### Downgrading Mode (comprehensive → minimal → solo-dev)

**When to downgrade:**
- Scope reduced
- Team size decreased
- Risk lowered
- Removing unnecessary overhead

**How to downgrade:**
1. Extract essentials from detailed artifacts
2. Copy to simpler template
3. Update `template_mode` in frontmatter
4. Archive (don't delete) detailed artifacts

---

## Common Mistakes

### ❌ Using comprehensive for Everything
**Problem:** Massive overhead, team burnout, documentation becomes noise
**Fix:** Use solo-dev or minimal for 80% of work, comprehensive for the 20% that truly needs it

### ❌ Using solo-dev for High-Risk Work
**Problem:** Missing critical context, inadequate validation, security/compliance gaps
**Fix:** If there's risk of data loss, security breach, or revenue impact → comprehensive

### ❌ Using minimal When Working Alone
**Problem:** Wasting time on coordination overhead you don't need
**Fix:** Use solo-dev unless you need to hand off to someone else

### ❌ Choosing Mode Based on "Importance"
**Problem:** "Important" work gets comprehensive, everything else gets solo-dev
**Fix:** Choose based on **risk, stakeholders, and collaboration needs**, not subjective importance

---

## FAQ

**Q: I'm a solo developer. Should I always use solo-dev?**
A: Almost always yes, unless the work is high-risk (security, data, payments). Then use comprehensive for the formal validation requirements.

**Q: Our team is 3 people. Always use minimal?**
A: Use solo-dev for individual tasks, minimal for collaborative work, comprehensive for high-risk team projects.

**Q: What if I'm not sure about the risk level?**
A: Ask: "If this breaks, what's the worst outcome?" If the answer includes data loss, security breach, or revenue impact → high risk → comprehensive.

**Q: Can I mix modes in the same project?**
A: Yes! Use comprehensive for the main epic, minimal for feature sub-tasks, solo-dev for individual bug fixes.

**Q: Is minimal just "solo-dev with more fields"?**
A: Essentially yes. Minimal adds collaboration features: assignee tracking, formal testing requirements, risk sections, and structured decision rationale.

**Q: When does a spike need comprehensive mode?**
A: Rarely. Spikes are usually solo-dev or minimal. Only use comprehensive if the spike is evaluating a high-risk architectural change affecting multiple teams.

---

## Default Behavior

**When you run `/cdd:create-work`:**
- Default mode: **solo-dev**
- Override: `/cdd:create-work --mode=minimal|comprehensive`

**The system assumes:**
- You're working alone (solo-dev)
- You'll upgrade if needed
- Minimum viable documentation is better than no documentation

**This matches the 80/20 rule:**
- 80% of work: solo-dev or minimal
- 20% of work: comprehensive

---

## Summary

**Default to solo-dev.** It works for most scenarios.

**Upgrade to minimal** when you need team collaboration and structured testing.

**Upgrade to comprehensive** when risk is high, stakeholders are many, or compliance matters.

**Remember:** The goal is useful context, not perfect documentation. Choose the mode that helps you work effectively, not the one that looks most "professional."
