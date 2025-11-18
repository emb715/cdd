# CDD Metrics Scripts

This directory contains utilities for collecting and aggregating metrics from CDD work items.

## Scripts

### `collect-metrics.js`

Scans all `DECISIONS.md` files in the `cdd/` directory and aggregates metrics into summary files.

**Usage:**

```bash
# Run from project root
node cdd/.meta/metrics/scripts/collect-metrics.js

# Or specify custom CDD directory
node cdd/.meta/metrics/scripts/collect-metrics.js /path/to/cdd
```

**Outputs:**

- `cdd/.meta/metrics-summary.json` - Machine-readable JSON summary
- `cdd/.meta/metrics-summary.md` - Human-readable Markdown report

**Metrics Collected:**

- Total work items, sessions, hours
- Context reacquisition time per session
- Task completion rates
- Per-work-item breakdown with derived metrics

### `lib/frontmatter.js`

Utility library for reading, parsing, and updating YAML frontmatter in Markdown files.

**Usage:**

```bash
# Display all frontmatter as JSON
node cdd/.meta/metrics/scripts/lib/frontmatter.js path/to/file.md

# Get specific field
node cdd/.meta/metrics/scripts/lib/frontmatter.js path/to/file.md --get field_name

# Set field value
node cdd/.meta/metrics/scripts/lib/frontmatter.js path/to/file.md --set field_name value
```

**API:**

```javascript
const {
  parseFrontmatter,
  readFrontmatter,
  updateFrontmatter,
  getFrontmatter,
  findDecisionsFiles
} = require('./lib/frontmatter');

// Read frontmatter from file
const { frontmatter, body } = readFrontmatter('path/to/file.md');

// Update frontmatter
updateFrontmatter('path/to/file.md', { 
  total_sessions: 5,
  status: 'in-progress' 
});

// Find all DECISIONS.md files
const files = findDecisionsFiles('./cdd');
```

## Integration with CDD Workflow

These scripts support the Phase 02 Metrics initiative by:

1. **Automating Data Collection**: No manual JSON editing required
2. **Dashboard Updates**: `/cdd:list-work` can consume `metrics-summary.json`
3. **Evidence-Based Claims**: Documentation can reference real aggregated data
4. **Session Tracking**: `/cdd:save-session` can use `updateFrontmatter()` to persist metrics

## Requirements

- Node.js >= 18.0.0
- No external dependencies (uses only Node.js built-in modules)
