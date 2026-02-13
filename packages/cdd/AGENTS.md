# CDD Agents

CDD includes specialized AI agents for different workflows. Agents handle autonomous execution while you focus on decisions.

## Workflow Agents (Used by Commands)

### cdd-honest

Direct agent without the BS. Used internally by most CDD commands.

**Used by:**
- `/cdd:start` - Create work items
- `/cdd:log` - Log session progress
- `/cdd:done` - Complete work items

**Not used by:**
- `/cdd:decide` - Decision command uses domain-aware Sage agents instead for specialized research

**Behavior:**
- Direct and ruthlessly honest
- No pleasantries or ceremony
- Autonomous execution
- Pre-configured git read permissions

**You don't invoke this directly** - CDD commands use it automatically.

## Direct-Use Agents (Manual Invocation)

### cdd-sage (Meta-Agent)

Adaptive expert that auto-selects operating mode based on your interaction patterns.

**Usage:** `/cdd-sage`

**When to use:**
- General work where you want adaptive expertise
- Let the agent choose depth based on your signals
- You're unsure which variant to use

**Behavior:**
- Detects context from file types and conversation (3-5 interactions)
- Silently switches between Specialist, Balanced, or Mentor mode
- Adapts to domain (DevOps, Frontend, Blockchain, ML, etc.)
- No announcements, just demonstrates expertise

**Mode selection:**
- **Specialist mode**: You ask about edge cases, optimization, or advanced patterns
- **Balanced mode**: You want to "implement X" or "fix Y" (default)
- **Mentor mode**: You ask "why", "how does this work", "explain"

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

### cdd-sage-balanced

Honest Agent efficiency with domain expertise.

**Usage:** `/cdd-sage-balanced`

**When to use:**
- Getting work done efficiently (recommended default)
- You want domain-aware help without deep dives
- General development tasks

**Behavior:**
- Direct and ruthlessly efficient (like cdd-honest)
- Uses domain-specific terminology naturally
- Applies relevant conventions and patterns
- Concise, actionable responses
- No explanations unless you ask "why"

**Example domains:**
- DevOps: Uses Terraform/K8s terminology, references 12-factor
- Frontend: React/Vue patterns, accessibility/performance
- Blockchain: Gas optimization language, security patterns

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
- Direct but not terse (unlike cdd-honest)

**Structure:**
1. Answer your question directly
2. Explain reasoning/principles
3. Provide context on when/why it matters
4. Mention alternatives if relevant

## Quick Selection Guide

| Need | Agent | Why |
|------|-------|-----|
| Work item tracking | Use CDD commands | `/cdd:start`, `/cdd:log`, `/cdd:done` |
| General dev work | `cdd-sage-balanced` | Efficient + domain aware |
| Deep technical | `cdd-sage-specialist` | Architecture, optimization |
| Learning | `cdd-sage-mentor` | Understand principles |
| Adaptive | `cdd-sage` | Auto-selects mode based on context |

## Common Agent Behavior

All Sage agents share these characteristics:

**Silent role detection:**
- Analyze file types (`.tf` → DevOps, `.sol` → Blockchain, `.tsx` → Frontend, etc.)
- Observe conversation patterns
- Review project structure
- Adopt expert role after 3-5 interactions
- No announcements, just demonstrate expertise

**Fluid domain switching:**
- If context shifts (e.g., frontend → backend), adapt immediately
- No announcements needed

**Honest Agent foundation:**
- Direct and ruthlessly honest
- No pleasantries or emotional cushioning
- Challenge wrong assumptions
- Prioritize accuracy and efficiency
- Skeptical, questioning approach

**Context window efficiency:**
- Minimal tokens, maximum value
- Progressive disclosure (start minimal, expand if needed)
- Never repeat what you already know

## Supported Domains

- DevOps/Infrastructure
- Frontend (React, Vue, Svelte)
- Blockchain/Smart Contracts
- Backend/API
- ML/Data Science
- Systems Programming (Rust, Go)
- Enterprise/JVM

## Examples

**Using meta-agent for adaptive work:**
```
You: "I need to optimize this React component"
[After 3 interactions, cdd-sage silently enters Balanced mode]
cdd-sage: [Uses React terminology, suggests useMemo, keeps it brief]
```

**Using specialist for architecture:**
```
You: "/cdd-sage-specialist"
You: "Should I use WebSockets or Server-Sent Events?"
cdd-sage-specialist: WebSockets if bidirectional needed. SSE for server→client only.
Tradeoffs: SSE simpler (HTTP), auto-reconnect, better browser support.
WebSockets: lower latency, true bidirectional, requires connection management.
Failure modes: SSE fails behind some proxies. WebSockets needs heartbeat logic.
```

**Using mentor for learning:**
```
You: "/cdd-sage-mentor"
You: "Why do we need virtual DOM?"
cdd-sage-mentor: Direct manipulation of real DOM is slow - browser reflows on every change.
Virtual DOM solves this by batching changes in memory first, then applying minimal updates.
This matters for apps with frequent UI updates (think dashboards, live feeds).
Alternative: Fine-grained reactivity (Svelte, Solid) - no VDOM, compile-time optimization.
```
