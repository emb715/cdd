# CDD Test Fixtures

This directory contains sample CDD work items for testing RAG indexing and search functionality.

## Structure

```
test/fixtures/sample-work-items/
├── 0001-solo-dev-example/
│   └── DECISIONS.md
├── 0002-minimal-example/
│   └── DECISIONS.md
└── 0003-comprehensive-example/
    ├── PROBLEM_BRIEF.md
    ├── TECHNICAL_RFC.md
    ├── RISK_REGISTER.md
    ├── VALIDATION_PLAN.md
    └── DECISIONS.md
```

## Work Items

### 0001: Solo-Dev Example
**Template Mode:** `solo-dev`
**Type:** feature
**Topic:** User Authentication API

Simple work item showing solo-dev mode with minimal documentation:
- Single DECISIONS.md file
- Quick context and implementation notes
- Manual testing approach

### 0002: Minimal Example
**Template Mode:** `minimal`
**Type:** feature
**Topic:** Database Migration System

Collaborative work showing minimal mode structure:
- Requirements documented
- Decision rationale explained
- Team collaboration notes
- Testing strategy included

### 0003: Comprehensive Example
**Template Mode:** `comprehensive`
**Type:** epic
**Topic:** Payment Processing Integration

Complex work showing full comprehensive mode with modular artifacts:

1. **PROBLEM_BRIEF.md** - Product requirements
   - Success criteria
   - User personas
   - Constraints and assumptions
   - Stakeholder approval

2. **TECHNICAL_RFC.md** - Technical design
   - Architecture diagrams
   - API specifications
   - Database schema
   - Security considerations

3. **RISK_REGISTER.md** - Risk management
   - 7 identified risks
   - Mitigation strategies
   - Risk tracking
   - Weekly review process

4. **VALIDATION_PLAN.md** - Testing strategy
   - Unit, integration, E2E tests
   - Security testing
   - Load testing
   - UAT plan

5. **DECISIONS.md** - Key decisions
   - 6 major technical decisions
   - Rationale for each
   - Trade-offs documented
   - Deferred decisions

## Using Test Fixtures

### For Manual Testing

Copy to a test CDD workspace:

```bash
# Create test workspace
mkdir -p ~/cdd-test/cdd
cd ~/cdd-test

# Copy fixtures
cp -r test/fixtures/sample-work-items/* cdd/

# Index with RAG
cd cdd/.rag
source venv/bin/activate
cd ../..
python -m cdd.rag.core.cli index
```

### For Automated Testing

The test scripts automatically use these fixtures:

```bash
# Run automated tests
npm run test:local
```

### For Template Mode Testing

Test that RAG correctly filters by template mode:

```bash
# Search only solo-dev work
python -m cdd.rag.core.cli search "authentication" --mode solo-dev
# Should return: 0001

# Search only comprehensive work
python -m cdd.rag.core.cli search "payment" --mode comprehensive
# Should return: 0003

# Search minimal mode work
python -m cdd.rag.core.cli search "migration" --mode minimal
# Should return: 0002
```

### For Artifact Type Testing

Test that RAG correctly filters by artifact type:

```bash
# Search TECHNICAL_RFC documents
python -m cdd.rag.core.cli search "API design" --artifact TECHNICAL_RFC
# Should return: 0003/TECHNICAL_RFC.md

# Search PROBLEM_BRIEF documents
python -m cdd.rag.core.cli search "success criteria" --artifact PROBLEM_BRIEF
# Should return: 0003/PROBLEM_BRIEF.md

# Search RISK_REGISTER documents
python -m cdd.rag.core.cli search "security risk" --artifact RISK_REGISTER
# Should return: 0003/RISK_REGISTER.md
```

### For Domain Testing

Test that RAG correctly classifies and filters by domain:

```bash
# Product domain (PROBLEM_BRIEF)
python -m cdd.rag.core.cli search "requirements" --domain product

# Engineering domain (TECHNICAL_RFC, IMPLEMENTATION_PLAN)
python -m cdd.rag.core.cli search "architecture" --domain engineering

# Risk domain (RISK_REGISTER)
python -m cdd.rag.core.cli search "mitigation" --domain risk

# QA domain (VALIDATION_PLAN)
python -m cdd.rag.core.cli search "testing" --domain qa
```

### For Combined Filter Testing

Test multiple filters together:

```bash
# Comprehensive mode + engineering domain
python -m cdd.rag.core.cli search "API" --mode comprehensive --domain engineering

# Feature type + completed status
python -m cdd.rag.core.cli search "system" --type feature --status completed

# All filters combined
python -m cdd.rag.core.cli search "payment" \
  --mode comprehensive \
  --type epic \
  --domain engineering \
  --artifact TECHNICAL_RFC
```

## Expected Search Results

### By Work Item

| Search Term | Expected Results |
|-------------|------------------|
| "authentication" | 0001 (solo-dev) |
| "migration" | 0002 (minimal) |
| "payment" | 0003 (comprehensive) |
| "JWT" | 0001 |
| "Knex" | 0002 |
| "Stripe" | 0003 |

### By Template Mode

| Mode | Work Items |
|------|------------|
| solo-dev | 0001 |
| minimal | 0002 |
| comprehensive | 0003 |

### By Artifact Type

| Artifact | Files |
|----------|-------|
| DECISIONS | All work items (3 files) |
| PROBLEM_BRIEF | 0003 only |
| TECHNICAL_RFC | 0003 only |
| RISK_REGISTER | 0003 only |
| VALIDATION_PLAN | 0003 only |

### By Domain

| Domain | Files |
|--------|-------|
| product | 0003/PROBLEM_BRIEF.md |
| engineering | 0003/TECHNICAL_RFC.md |
| risk | 0003/RISK_REGISTER.md |
| qa | 0003/VALIDATION_PLAN.md |
| general | All DECISIONS.md files |

## Updating Fixtures

When updating test fixtures:

1. Maintain frontmatter consistency
2. Keep template_mode accurate
3. Update this README if adding new fixtures
4. Re-index after changes:
   ```bash
   python -m cdd.rag.core.cli index
   ```

## Fixture Quality Checklist

- [ ] Frontmatter includes all required fields (id, title, type, template_mode, etc.)
- [ ] Content is realistic and meaningful
- [ ] Template mode matches file structure
- [ ] Tags are relevant
- [ ] Dates are consistent
- [ ] No sensitive data (API keys, real emails, etc.)
- [ ] Markdown formatting is correct
- [ ] File names match CDD conventions

---

**Last Updated:** 2024-11-XX
**Owner:** Test Infrastructure Team
