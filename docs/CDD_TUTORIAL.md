# Context-Driven Development (CDD) Tutorial

## Why CDD?

Every AI coding session starts the same way: you paste context, explain what you're building, clarify decisions you already made. By the third session, you're re-explaining your database schema. By the tenth, the AI suggests changes that contradict decisions from two weeks ago.

**The problem:** AI tools have no memory. Every session is amnesia.

**CDD's solution:** Documentation as infrastructure. You build a queryable knowledge base while you work. Future sessions start with context already loaded.

### When to Use CDD

**Use it when:**
- Project will span multiple sessions (>3 sessions)
- Multiple people will work on the codebase
- You need to track architectural decisions over time
- Context complexity exceeds what fits in a single prompt

**Skip it when:**
- Single-session throwaway scripts
- Project scope is under 100 lines
- You're prototyping and will rewrite from scratch

### Alternatives

- **Conventional docs:** Great for stable projects, slower to update, not AI-optimized
- **ADRs only:** Good for decisions, lacks implementation tracking
- **Project wikis:** Better for reference material, worse for active development workflow

---

## Quick Start Installation

### Install CDD Core

```bash
cd your-project-root
npx @emb715/cdd init
```

This creates:
```
cdd/
├── .meta/
│   ├── SIZING_GUIDE.md
│   └── templates/
├── decisions/
├── planning/
├── sessions/
└── summaries/
```

### Verify Slash Commands

In Claude Code, type `/cdd:` and you should see autocomplete for:
- `/cdd:create-work` - Start new work item
- `/cdd:plan-work` - Create implementation plan
- `/cdd:save-session` - Save session notes
- `/cdd:complete-work` - Mark work item complete with evidence
- `/cdd:list-work` - View all work items and status

### Choose Your Template Mode

Three modes based on project size. See `cdd/.meta/SIZING_GUIDE.md` for full guide.

**solo-dev** (default): 3 files per work item
- For: 1-2 developers, <20 work items
- Files: DECISIONS.md, IMPLEMENTATION_PLAN.md, SESSION_NOTES.md

**minimal**: 2 files per work item
- For: Single developer, <10 work items
- Files: DECISIONS.md, IMPLEMENTATION_PLAN.md
- Skips: SESSION_NOTES.md

**comprehensive**: 5 files per work item
- For: Teams of 3+, >50 work items
- Files: All solo-dev files + IMPLEMENTATION_SUMMARY.md + ARCHITECTURE.md

**Set mode:**
```bash
npx @emb715/cdd config --template-mode minimal
```

---

## Adding RAG (Optional Enhancement)

### When to Add RAG

**Threshold:** 10+ work items or 50+ documentation files

**Benefits:**
- Query your project's history: "How did we handle rate limiting?"
- Auto-inject relevant context into planning
- Find decisions made 6 months ago in seconds

**Without RAG:** You rely on manual search and memory. Fine for small projects.

### Installation

```bash
# Add RAG components
npx @emb715/cdd add rag

# Create Python virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initial indexing
python scripts/index_docs.py
```

### Minimal Configuration

Create `.env`:
```bash
RAG_MODE=local
CDD_WORKSPACE_PATH=/absolute/path/to/your/project
EMBEDDING_MODEL=all-MiniLM-L6-v2
```

**Optional AI answers:**
```bash
ENABLE_AI_ANSWERS=true
OPENAI_API_KEY=your-key-here  # Any OpenAI-compatible API (Fuelix.ai recommended)
```

### Privacy Model

**Local indexing/search:**
- Documents never leave your machine
- ChromaDB runs locally
- Sentence-transformers runs locally
- Cost: $0

**Optional cloud AI answers:**
- Only query results sent to OpenAI-compatible API provider
- Original documents stay local
- You control when to use --ai flag
- Cost: ~$0.0006 per query (varies by provider)

### Cost Breakdown

```
Local search only:           $0
AI-powered answer (simple):  $0.0003
AI-powered answer (complex): $0.0006
Monthly budget limit:        $10 (configurable)
```

---

## Core Concepts

### The 4 Core Documents

Every work item gets these files (in solo-dev mode):

1. **DECISIONS.md** - Why we're building this
   - Business requirements
   - Technical constraints
   - Architectural choices
   - Non-functional requirements

2. **IMPLEMENTATION_PLAN.md** - How we'll build it
   - File structure
   - Component breakdown
   - Testing strategy
   - Deployment steps

3. **SESSION_NOTES.md** - What happened during work
   - Timestamp-based entries
   - Problems encountered
   - Solutions applied
   - Deviations from plan

4. **IMPLEMENTATION_SUMMARY.md** - What we actually built (comprehensive mode only)
   - Generated at completion
   - Evidence of completion
   - Differences from plan
   - Lessons learned

### Work Item Lifecycle

```
draft → in-progress → review → complete → archived
  ↓         ↓           ↓          ↓         ↓
DECISIONS  PLAN      SESSION   SUMMARY   /archive/
```

**draft:** DECISIONS.md exists, no plan yet
**in-progress:** PLAN exists, actively working
**review:** Implementation done, awaiting validation
**complete:** Evidence provided, summary generated
**archived:** Moved to `/archive/<work-item-id>/`

### Evidence-Based Completion

When you run `/cdd:complete-work`, you provide evidence. Valid evidence:

✅ **Good evidence:**
- Screenshots of working UI
- Test output showing passes
- API response examples
- Deployment URLs
- Error logs showing fixed bugs
- Diff outputs of changes

❌ **Bad evidence:**
- "I tested it and it works"
- "The code looks good"
- "Trust me"

**Why strict?** Future sessions need proof, not promises. Evidence prevents revisiting solved problems.

### Human-AI Collaboration Boundaries

**Human decides:**
- Whether work is complete
- What evidence is sufficient
- When to deviate from plan
- Which template mode to use

**AI assists:**
- Generates initial drafts
- Suggests file structures
- Formats documentation
- Indexes for search

**Neither owns sole authority:** Human provides judgment, AI provides memory and structure.

---

## Complete Mock Session: Fernet Branca Inflation Tracker

### Project Overview

**Goal:** Track Fernet Branca prices over time in Argentina to visualize inflation.

**Stack:**
- Backend: Convex (real-time database, serverless functions)
- Frontend: React with Recharts for visualization
- Data: Products and price snapshots over time

### Step 1: Create Work Item

```bash
/cdd:create-work
```

**AI Interview:**
```
AI: What are you building?
You: Price tracking app for Fernet Branca in Argentina

AI: What's the business goal?
You: Visualize inflation by tracking one product over time

AI: What's your tech stack?
You: Convex backend, React frontend

AI: Any constraints?
You: Need to support historical price data, mobile-responsive UI

AI: Data model requirements?
You: Products table, price snapshots with timestamp and location
```

**Generated:** `cdd/decisions/001-fernet-inflation-tracker.md`

```markdown
# Work Item: Fernet Branca Inflation Tracker

**Status:** draft
**Created:** 2024-01-15
**ID:** 001

## Business Requirements

Track and visualize Fernet Branca prices in Argentina over time to demonstrate inflation impact on consumer goods.

**User stories:**
- As a user, I want to see historical price data for Fernet Branca
- As a user, I want to add new price observations with date and location
- As a user, I want to see a chart showing price trends over time

## Technical Constraints

- Backend: Convex (serverless, real-time)
- Frontend: React
- Must work on mobile browsers
- Historical data goes back 12 months minimum

## Architectural Decisions

**Database schema (Convex):**
```typescript
// products table
{
  name: string,
  category: string,
  brand: string,
  standard_size: string  // e.g., "750ml"
}

// price_snapshots table
{
  product_id: Id<"products">,
  price_ars: number,
  observed_date: number,  // timestamp
  location_city: string,
  location_store: string,
  observer_notes?: string
}
```

**Frontend components:**
- PriceEntryForm: Add new observations
- PriceChart: Recharts line chart
- HistoricalTable: Recent price data

**Data flow:**
1. User submits price observation
2. Convex mutation validates and stores
3. Convex query subscribes component to updates
4. Chart re-renders with new data

## Non-Functional Requirements

- Response time: <2s for chart render
- Mobile: Responsive down to 360px width
- Data retention: Indefinite
- No authentication required (public data)
```

### Step 2: Plan Implementation

```bash
/cdd:plan-work 001
```

**Generated:** `cdd/planning/001-fernet-inflation-tracker.md`

```markdown
# Implementation Plan: Fernet Branca Inflation Tracker

**Work Item:** 001
**Created:** 2024-01-15

## File Structure

```
convex/
├── schema.ts          # Define tables
├── products.ts        # Product CRUD
└── priceSnapshots.ts  # Price snapshot CRUD

src/
├── components/
│   ├── PriceEntryForm.tsx
│   ├── PriceChart.tsx
│   └── HistoricalTable.tsx
├── App.tsx
└── main.tsx

package.json           # Add recharts dependency
```

## Implementation Steps

### Phase 1: Backend Setup

1. Define Convex schema
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    category: v.string(),
    brand: v.string(),
    standard_size: v.string(),
  }),

  price_snapshots: defineTable({
    product_id: v.id("products"),
    price_ars: v.number(),
    observed_date: v.number(),
    location_city: v.string(),
    location_store: v.string(),
    observer_notes: v.optional(v.string()),
  }).index("by_product", ["product_id"]),
});
```

2. Create product mutations/queries
3. Create price snapshot mutations/queries

### Phase 2: Frontend Components

1. **PriceEntryForm.tsx**
   - Form fields: price, date, city, store, notes
   - Validation: price > 0, date not future
   - Submit via Convex mutation

2. **PriceChart.tsx**
   - Use Recharts LineChart
   - X-axis: Date
   - Y-axis: Price in ARS
   - Subscribe to price snapshots via Convex query

3. **HistoricalTable.tsx**
   - Show last 10 observations
   - Columns: Date, Price, Location
   - Sort by date descending

### Phase 3: Integration

1. Wire components in App.tsx
2. Add seed data for testing
3. Test responsive layout

## Testing Strategy

**Manual testing:**
- Add price observation → verify appears in chart
- Add multiple observations → verify chronological sorting
- Resize browser → verify mobile layout

**Data validation:**
- Submit negative price → should reject
- Submit future date → should reject
- Submit incomplete form → should show errors

## Deployment Steps

1. Push to Convex: `npx convex deploy`
2. Deploy frontend: `npm run build && npx convex deploy --preview-url`
3. Verify deployed app loads and connects to Convex

## Success Criteria

- [ ] Can add price observations via form
- [ ] Chart displays price trend over time
- [ ] Historical table shows recent entries
- [ ] Works on mobile (iPhone SE viewport)
- [ ] Convex backend deployed and accessible
```

### Step 3: Implementation Session 1

```bash
/cdd:save-session 001
```

**Session 1 entry in** `cdd/sessions/001-fernet-inflation-tracker.md`:

```markdown
# Session Notes: Fernet Branca Inflation Tracker

**Work Item:** 001

---

## Session 2024-01-15 14:23

**Duration:** 2h 15m
**Focus:** Backend schema and queries

### Work Completed

Set up Convex schema and basic CRUD operations.

**Files created:**
- `convex/schema.ts` - Defined products and price_snapshots tables
- `convex/products.ts` - CRUD for products
- `convex/priceSnapshots.ts` - Add/query price snapshots

**Key code:**

```typescript
// convex/priceSnapshots.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    product_id: v.id("products"),
    price_ars: v.number(),
    observed_date: v.number(),
    location_city: v.string(),
    location_store: v.string(),
    observer_notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validation
    if (args.price_ars <= 0) {
      throw new Error("Price must be positive");
    }
    if (args.observed_date > Date.now()) {
      throw new Error("Cannot add future observations");
    }

    return await ctx.db.insert("price_snapshots", args);
  },
});

export const getByProduct = query({
  args: { product_id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("price_snapshots")
      .withIndex("by_product", (q) => q.eq("product_id", args.product_id))
      .collect();
  },
});
```

### Problems Encountered

**Problem 1:** Convex schema migration error
```
Error: Cannot add index to existing table
```

**Solution:** Deleted local Convex dev deployment, ran `npx convex dev` fresh. Schema applied cleanly.

**Problem 2:** Date handling confusion
Initially used string dates, realized Convex doesn't support Date objects. Switched to Unix timestamps (numbers).

### Deviations from Plan

None yet. Backend matches plan exactly.

### Next Session

- Build PriceEntryForm component
- Add Recharts dependency
- Create seed data for testing
```

### Step 4: Query RAG During Implementation

```bash
/cdd:query "recharts time series best practices"
```

**Output:**
```
🔍 Local Search Results:

No direct CDD documentation found on Recharts.

💡 Tip: Use --ai flag for external knowledge:
/cdd:query "recharts time series best practices" --ai
```

```bash
/cdd:query "recharts time series best practices" --ai
```

**AI Answer (cost: $0.0004):**
```
Based on React time-series visualization patterns:

1. **Data formatting:** Convert timestamps to Date objects for XAxis
2. **Responsive sizing:** Use ResponsiveContainer wrapper
3. **Tooltips:** Include custom formatter for ARS currency
4. **Performance:** For >1000 points, enable `isAnimationActive={false}`

Example structure:
```typescript
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={priceData}>
    <XAxis
      dataKey="observed_date"
      tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
    />
    <YAxis
      label={{ value: 'Price (ARS)', angle: -90 }}
    />
    <Tooltip
      labelFormatter={(ts) => new Date(ts).toLocaleString()}
      formatter={(value) => `$${value} ARS`}
    />
    <Line type="monotone" dataKey="price_ars" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>
```
```

### Step 5: Implementation Session 2

```bash
/cdd:save-session 001
```

**Session 2 entry:**

```markdown
## Session 2024-01-16 10:05

**Duration:** 1h 45m
**Focus:** Frontend components

### Work Completed

Built all three React components.

**Files created:**
- `src/components/PriceEntryForm.tsx`
- `src/components/PriceChart.tsx`
- `src/components/HistoricalTable.tsx`

**Dependencies added:**
```json
{
  "recharts": "^2.10.3",
  "convex": "^1.8.0"
}
```

**PriceChart implementation:**

```typescript
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PriceChart({ productId }: { productId: Id<"products"> }) {
  const snapshots = useQuery(api.priceSnapshots.getByProduct, { product_id: productId });

  if (!snapshots) return <div>Loading...</div>;

  const chartData = snapshots
    .map(s => ({
      date: s.observed_date,
      price: s.price_ars,
    }))
    .sort((a, b) => a.date - b.date);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="date"
          tickFormatter={(ts) => new Date(ts).toLocaleDateString('es-AR')}
        />
        <YAxis label={{ value: 'Precio (ARS)', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          labelFormatter={(ts) => new Date(ts).toLocaleString('es-AR')}
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Precio']}
        />
        <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### Problems Encountered

**Problem 1:** TypeScript error on Id type
```
Type 'string' is not assignable to type 'Id<"products">'
```

**Solution:** Import Id type from Convex:
```typescript
import { Id } from "convex/_generated/dataModel";
```

**Problem 2:** Chart not rendering

Console showed: `Uncaught Error: <ResponsiveContainer /> requires width or height`

**Solution:** Parent div needed explicit height:
```css
.chart-container {
  height: 400px;
}
```

### Deviations from Plan

Added currency formatting with `toFixed(2)` for peso display. Plan didn't specify, but UX benefit is clear.

### Next Session

- Test on mobile viewports
- Add seed data
- Deploy to Convex production
```

### Step 6: Complete Work Item

```bash
/cdd:complete-work 001
```

**AI prompts:**
```
AI: Provide evidence that work is complete.

You: [Paste screenshot of working app]
Screenshot shows:
- Form with all fields
- Chart displaying 5 price points trending upward
- Table showing recent entries
- Mobile view at 375px width

AI: Any differences from the original plan?

You: Added currency formatting (toFixed(2)) not in original plan.
Added seed data script not originally planned.

AI: What did you learn?

You: Convex schema migrations require clean dev environment.
Recharts ResponsiveContainer needs explicit parent height.
Date formatting for Argentina locale requires 'es-AR'.
```

**Generated:** `cdd/summaries/001-fernet-inflation-tracker.md`

```markdown
# Implementation Summary: Fernet Branca Inflation Tracker

**Work Item:** 001
**Status:** complete
**Completed:** 2024-01-16
**Total Time:** 4h 0m

## What Was Built

Full-stack price tracking application for Fernet Branca in Argentina.

**Backend:**
- Convex schema with products and price_snapshots tables
- CRUD operations for products
- Add/query operations for price snapshots
- Validation: positive prices, no future dates

**Frontend:**
- PriceEntryForm: Add new price observations
- PriceChart: Recharts line chart with time series
- HistoricalTable: Recent 10 observations
- Responsive layout (mobile-tested)

**Deployment:**
- Convex backend deployed to production
- Frontend deployed via Convex hosting
- Live URL: https://fernet-tracker.convex.site

## Evidence of Completion

![Working application screenshot](./evidence/001-screenshot.png)

**Manual testing results:**
```
✅ Add price observation → appears in chart
✅ Add multiple observations → chronological sorting correct
✅ Negative price submission → error shown
✅ Future date submission → error shown
✅ Mobile viewport (375px) → layout responsive
✅ Chart loads in <2s with 20 data points
```

## Differences from Plan

**Additions:**
1. Currency formatting with `toFixed(2)` for ARS display
2. Seed data script: `convex/seedData.ts`
3. Argentina locale for date formatting ('es-AR')

**Rationale:** UX improvements. Currency formatting makes prices readable. Seed data speeds up testing. Locale formatting matches target audience.

**No removals or major deviations.**

## Lessons Learned

**Technical:**
- Convex schema changes require clean dev environment (delete `.convex/` folder)
- Recharts ResponsiveContainer parent must have explicit height
- Convex doesn't support Date objects, use Unix timestamps
- Index definitions must be included in initial schema, hard to add later

**Process:**
- RAG query for Recharts patterns saved 30min of documentation reading
- Session notes helped resume work next day without context loss
- Evidence requirement caught missing mobile testing
```

**Work item archived to:** `cdd/archive/001-fernet-inflation-tracker/`

---

## Working with RAG

### Query Syntax

**Basic search:**
```bash
/cdd:query "authentication patterns"
```

Returns: Local document matches ranked by relevance.

**AI-powered answers:**
```bash
/cdd:query "authentication patterns" --ai
```

Returns: Synthesized answer using local context + external knowledge.

### Example Queries

**Finding past decisions:**
```bash
/cdd:query "why did we choose PostgreSQL over MongoDB"
```

**Locating implementation patterns:**
```bash
/cdd:query "error handling in API routes"
```

**Understanding architecture:**
```bash
/cdd:query "how does the caching layer work" --ai
```

### RAG-Enhanced Planning

When running `/cdd:plan-work`, RAG auto-injects relevant context:

```bash
/cdd:plan-work 015
```

RAG searches for:
- Similar past work items
- Related architectural decisions
- Common patterns in your codebase

Injected into planning prompt invisibly. Result: Plans reference past solutions.

### Cost Tracking

Check usage:
```bash
python scripts/rag_query.py --usage
```

Output:
```
RAG Usage Report
================
Queries this month: 47
AI-powered queries: 12
Total cost: $0.0072
Budget remaining: $9.9928
```

Set custom budget in `.env`:
```bash
RAG_MONTHLY_BUDGET=5.00  # $5/month limit
```

When limit hit, AI answers disabled automatically. Local search continues working.

---

## Best Practices

### Writing Good Evidence

**Bad:**
```
Evidence: I tested the login flow and it works fine.
```

**Good:**
```
Evidence: Login flow test results

1. Screenshot: Login form with validation errors
   [login-validation.png]

2. Test output:
   ✓ Valid credentials → dashboard redirect
   ✓ Invalid password → error message shown
   ✓ Empty fields → validation errors displayed
   ✓ Session persists after refresh

3. Deployed URL: https://app.example.com/login
   Test account: test@example.com / TestPass123
```

**Why good?** Future you can verify claims. Screenshots prove UI works. Test output shows edge cases covered. Deployment URL enables manual verification.

### Choosing Template Modes

**Use minimal when:**
- Solo developer
- <10 work items total
- Short project lifespan (<3 months)
- Simple architecture (single service)

**Use solo-dev (default) when:**
- 1-2 developers
- 10-50 work items
- Need session continuity across days
- Moderate complexity (multiple services)

**Use comprehensive when:**
- Team of 3+
- >50 work items
- Long-term maintenance (>6 months)
- Complex architecture (microservices, multiple databases)
- Regulatory compliance requires audit trails

**Switching modes:**
```bash
npx @emb715/cdd config --template-mode comprehensive
```

Applies to new work items only. Existing items unchanged.

### Team Collaboration Patterns

**Async handoffs:**

Developer A ends session:
```bash
/cdd:save-session 042
```

Session notes include:
```markdown
### Blocking Issues
- Payment gateway integration waiting for API keys from DevOps
- Stuck on CORS error, see logs in session_notes.md line 145

### Next Steps for Next Developer
- Once API keys arrive, add to .env.production
- Investigate CORS: might be Nginx config issue
```

Developer B starts next day:
```bash
/cdd:query "CORS issues in recent sessions" --ai
```

Gets context immediately, continues work.

**Parallel work:**

Use work item IDs to prevent conflicts:
- Developer A: `/cdd:create-work` → ID 043 (Auth refactor)
- Developer B: `/cdd:create-work` → ID 044 (New dashboard widget)

Separate DECISIONS, PLAN, SESSION files. No merge conflicts.

**Code review integration:**

Reviewer runs:
```bash
/cdd:query "work item 043 implementation summary"
```

Gets complete context:
- Original requirements (DECISIONS.md)
- Planned approach (IMPLEMENTATION_PLAN.md)
- Deviations during implementation (SESSION_NOTES.md)
- Final evidence (IMPLEMENTATION_SUMMARY.md)

Reviews code with full context, catches divergence from requirements.

### When to Archive vs Delete

**Archive when:**
- Work completed successfully
- Might reference implementation later
- Decisions inform future work
- Regulatory/compliance retention

**Delete when:**
- Work item was mistake (wrong requirements)
- Superseded by different approach before completion
- Prototype/spike that won't inform future work

**Archive:**
```bash
/cdd:complete-work 025
# Automatically moves to cdd/archive/025-work-item-name/
```

**Delete:**
```bash
rm -rf cdd/decisions/025-*.md
rm -rf cdd/planning/025-*.md
rm -rf cdd/sessions/025-*.md
```

Then re-index RAG:
```bash
python scripts/index_docs.py
```

Archived work remains searchable via RAG. Deleted work is gone permanently.

---

## Appendix: Command Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `/cdd:create-work` | Start new work item | `/cdd:create-work` |
| `/cdd:plan-work` | Generate implementation plan | `/cdd:plan-work 042` |
| `/cdd:save-session` | Save session notes | `/cdd:save-session 042` |
| `/cdd:complete-work` | Mark complete with evidence | `/cdd:complete-work 042` |
| `/cdd:list-work` | Show all work items | `/cdd:list-work` |
| `/cdd:query` | Search documentation | `/cdd:query "auth patterns"` |
| `/cdd:query --ai` | AI-powered answer | `/cdd:query "CORS fix" --ai` |

**Installation commands:**
```bash
npx @emb715/cdd init                    # Install CDD core
npx @emb715/cdd add rag                 # Add RAG capability
npx @emb715/cdd config --template-mode  # Change template mode
python scripts/index_docs.py            # Reindex RAG
```

**File locations:**
```
cdd/
├── decisions/        # DECISIONS.md files (requirement docs)
├── planning/         # IMPLEMENTATION_PLAN.md files
├── sessions/         # SESSION_NOTES.md files
├── summaries/        # IMPLEMENTATION_SUMMARY.md files (comprehensive mode)
└── archive/          # Completed work items
```

**RAG files:**
```
.chroma/              # Vector database (local)
scripts/
├── index_docs.py     # Indexing script
└── rag_query.py      # Query script
requirements.txt      # Python dependencies
.env                  # RAG configuration
```

---

## Next Steps

1. **Start your first work item:** Run `/cdd:create-work` in Claude Code
2. **Install RAG when you hit 10 work items:** `npx @emb715/cdd add rag`
3. **Adjust template mode as team grows:** `npx @emb715/cdd config --template-mode comprehensive`
4. **Read sizing guide for detailed mode comparison:** `cdd/.meta/SIZING_GUIDE.md`

**Feedback and discussions:** https://github.com/emb715/cdd/discussions