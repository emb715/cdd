# CDD Agents

CDD includes specialized AI agents for different workflows. Agents handle autonomous execution while you focus on decisions.

---

## Workflow Agents (Used by Commands)

### cdd-honest

Direct executor used internally by most CDD commands and by `/cdd:loop` for task implementation and fix agents.

**Used by:** `/cdd:start`, `/cdd:log`, `/cdd:done`, `/cdd:loop`

**Behavior:**
- Direct and ruthlessly honest — no pleasantries, no ceremony
- Autonomous execution
- Pre-configured git read permissions

You don't invoke this directly — CDD commands use it automatically.

---

### cdd-victor-reid

Rigorous code reviewer. Spawned by `/cdd:loop` after all tasks complete. Evaluates implementation against `Done when:` criteria in `CONTEXT.md`. Classifies issues as BLOCKING or NON_BLOCKING.

**Used by:** `/cdd:loop` (REVIEW protocol)

**Behavior:**
- Treats every implementation as failing until it demonstrably satisfies acceptance criteria
- Demands testable evidence, not working-at-a-glance code
- Default stance: skeptical. Approval must be earned.

You don't invoke this directly — `/cdd:loop` spawns it automatically after execution.

---

## Direct-Use Agents (Manual Invocation)

### cdd-sage (Meta-Agent)

Adaptive expert that auto-selects operating mode based on your interaction patterns.

**Usage:** `/cdd-sage`

**When to use:**
- General work where you want adaptive expertise
- You're unsure which variant fits

**Behavior:**
- Detects context from file types and conversation (3-5 interactions)
- Silently switches between Specialist, Balanced, or Mentor mode
- Adapts to domain (DevOps, Frontend, Blockchain, ML, etc.)
- No announcements — just demonstrates expertise

**Mode selection:**
- **Specialist mode**: edge cases, optimization, advanced patterns
- **Balanced mode**: "implement X", "fix Y" (default)
- **Mentor mode**: "why", "how does this work", "explain"

---

### cdd-sage-specialist

Deep domain expert for advanced technical work.

**Usage:** `/cdd-sage-specialist`

**When to use:**
- Edge cases and failure modes
- Performance optimization
- Architecture decisions
- Security considerations
- Tradeoff analysis

**Behavior:**
- Goes deep into advanced patterns
- Cites RFCs, standards, and specific patterns
- Explains WHY patterns exist
- Points out anti-patterns immediately
- Discusses failure modes and mitigations

**Example domains:**
- DevOps: IaC state management, blue-green vs canary deployments
- Frontend: Virtual DOM reconciliation, code splitting strategies
- Blockchain: Gas optimization, reentrancy guards, MEV
- Backend: Connection pooling, caching strategies, distributed systems

---

### cdd-sage-balanced

Honest Agent efficiency with domain expertise. Recommended default for general development.

**Usage:** `/cdd-sage-balanced`

**When to use:**
- Getting work done efficiently
- Domain-aware help without deep dives
- General development tasks

**Behavior:**
- Direct and ruthlessly efficient
- Uses domain-specific terminology naturally
- Applies relevant conventions and patterns
- Concise, actionable responses
- No explanations unless you ask "why"

**Example domains:**
- DevOps: Terraform/K8s terminology, 12-factor references
- Frontend: React/Vue patterns, accessibility/performance
- Blockchain: Gas optimization language, security patterns

---

### cdd-sage-mentor

Teaching-focused expert that explains principles and reasoning.

**Usage:** `/cdd-sage-mentor`

**When to use:**
- Learning new concepts
- Understanding "why" something works
- Building mental models
- Exploring alternatives

**Behavior:**
- Explains WHY, not just HOW
- Builds first-principles understanding
- Provides context on when/why things matter
- Uses analogies when helpful
- Direct but not terse

**Structure:**
1. Answer your question directly
2. Explain reasoning/principles
3. Provide context on when/why it matters
4. Mention alternatives if relevant

---

## Quick Selection Guide

| Need | Agent | Why |
|------|-------|-----|
| Work item tracking | Use CDD commands | `/cdd:start`, `/cdd:log`, `/cdd:done`, `/cdd:loop` |
| General dev work | `cdd-sage-balanced` | Efficient + domain aware |
| Deep technical | `cdd-sage-specialist` | Architecture, optimization, edge cases |
| Learning | `cdd-sage-mentor` | Understand principles |
| Adaptive | `cdd-sage` | Auto-selects mode based on context |

---

## Common Behavior Across Sage Agents

**Silent role detection:**
- Analyzes file types (`.tf` → DevOps, `.sol` → Blockchain, `.tsx` → Frontend, etc.)
- Observes conversation patterns and project structure
- Adopts expert role after 3-5 interactions — no announcements

**Fluid domain switching:**
- Context shifts (frontend → backend) → expertise shifts immediately, no announcement

**Honest Agent foundation:**
- Direct and ruthlessly honest
- No pleasantries or emotional cushioning
- Challenges wrong assumptions
- Skeptical, questioning approach
- Prioritizes accuracy and efficiency

**Context window efficiency:**
- Minimal tokens, maximum value
- Progressive disclosure: start minimal, expand if needed

---

## Examples

**Specialist for architecture:**
```
/cdd-sage-specialist
"Should I use WebSockets or Server-Sent Events?"

→ WebSockets if bidirectional needed. SSE for server→client only.
  Tradeoffs: SSE simpler (HTTP), auto-reconnect, better browser support.
  WebSockets: lower latency, true bidirectional, requires connection management.
  Failure modes: SSE fails behind some proxies. WebSockets needs heartbeat logic.
```

**Mentor for learning:**
```
/cdd-sage-mentor
"Why do we need virtual DOM?"

→ Direct DOM manipulation is slow — browser reflows on every change.
  Virtual DOM batches changes in memory, then applies minimal diffs.
  This matters for apps with frequent UI updates (dashboards, live feeds).
  Alternative: Fine-grained reactivity (Svelte, Solid) — no VDOM, compile-time optimization.
```
