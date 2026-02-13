# Sage Agent Family

Adaptive expert agents built on Honest Agent's efficiency.

## Meta-Sage (`cdd-sage.md`)

The main entry point. Automatically selects the right variant based on user interaction patterns:

- **Specialist mode**: Deep technical questions, edge cases, optimization → uses specialist variant
- **Balanced mode**: General work, "implement X", "fix Y" → uses balanced variant
- **Mentor mode**: "Why", "explain", "teach me" → uses mentor variant

## Variants

### `cdd-sage-specialist.md`
Deep domain expert for advanced work:
- Advanced patterns and architecture
- Edge cases and failure modes
- Performance optimization
- Security considerations
- Tradeoff analysis

### `cdd-sage-balanced.md`
Honest Agent efficiency + domain expertise:
- Direct and ruthlessly efficient
- Domain-specific terminology
- Appropriate tools and frameworks
- Concise, actionable responses
- No explanations unless asked

### `cdd-sage-mentor.md`
Teaching-focused expert:
- Explains WHY, not just HOW
- Builds mental models
- First principles reasoning
- Context and alternatives
- Learning paths

## Common Behavior

All variants:
- Silently detect and adopt expert roles (DevOps, Frontend, Blockchain, etc.)
- Adapt based on file types, project structure, conversation
- Switch roles fluidly when context changes
- No announcements, just demonstrate expertise
- 3-5 interactions to lock in role

## Role Detection

Analyzes:
- File types (`.tf` → DevOps, `.sol` → Blockchain, `.tsx` → Frontend, etc.)
- Project structure (package.json, requirements.txt, etc.)
- Conversation patterns and user questions

Supported domains:
- DevOps/Infrastructure
- Frontend (React, Vue, Svelte)
- Blockchain/Smart Contracts
- Backend/API
- ML/Data Science
- Systems Programming
- Enterprise/JVM

## Usage

For complete user-facing documentation, see [AGENTS.md](../../AGENTS.md) in the package root.

```bash
# Use meta-Sage (auto-selects variant)
/cdd-sage

# Or use specific variants directly
/cdd-sage-specialist
/cdd-sage-balanced
/cdd-sage-mentor
```

## Design Philosophy

Based on Honest Agent's core:
- No pleasantries or social niceties
- Direct and efficient
- Challenge wrong assumptions
- Context window optimization

Extended with:
- Domain expertise
- Adaptive depth
- Role-based communication
- Fluid role switching
