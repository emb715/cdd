# Validation Plan: [Work Title]

> **Voice:** QA Lead / Quality Assurance
> **Purpose:** Define HOW we'll prove it works correctly
> **Audience:** Testers, reviewers, and anyone validating completion
> **Part of:** CDD Modular Artifacts (VALIDATION_PLAN.md)

---

**Work ID:** XXXX
**Last Updated:** YYYY-MM-DD
**Test Coverage Target:** [e.g., 80% for new code]

---

## 🎯 Validation Goals

> **What are we trying to prove?**

This validation plan ensures:
- ✅ All functional requirements from PROBLEM_BRIEF.md are met
- ✅ Technical implementation from TECHNICAL_RFC.md works correctly
- ✅ No critical bugs or security vulnerabilities
- ✅ Performance meets requirements
- ✅ User experience matches expectations

**Success Criteria Reference:** See PROBLEM_BRIEF.md for must-have criteria that must pass validation.

---

## 📋 Success Criteria Validation Matrix

> **Mapping success criteria to validation methods**

| Criterion ID | Success Criterion | Validation Method | Evidence Required | Status |
|--------------|-------------------|-------------------|-------------------|--------|
| SC-1 | [From PROBLEM_BRIEF.md] | Unit Test / Integration Test / Manual | [Specific evidence] | ⬜ Not Started / 🟡 In Progress / ✅ Passed / ❌ Failed |
| SC-2 | [From PROBLEM_BRIEF.md] | Manual Test / User Acceptance | [Specific evidence] | Status |
| SC-3 | [From PROBLEM_BRIEF.md] | Automated Test / Performance | [Specific evidence] | Status |

---

### SC-1: [Success Criterion Title]

**Criterion:** [From PROBLEM_BRIEF.md]

**Example:**
> Users can save their theme preference and see it applied immediately without page reload.

**Validation Method:** Automated E2E Test + Manual Testing

**Test Steps:**
1. User logs in to application
2. User navigates to settings page
3. User changes theme from "Light" to "Dark"
4. User clicks "Save"
5. **Expected:** Theme applies immediately (no reload)
6. User refreshes page
7. **Expected:** Dark theme persists

**Evidence Required:**
- [ ] E2E test passing (Playwright test result)
- [ ] Screenshot showing dark theme applied
- [ ] Video recording of theme change flow
- [ ] No console errors logged

**Acceptance Criteria:**
- ✅ Theme changes within 500ms of save
- ✅ No page reload required
- ✅ Preference persists across sessions
- ✅ Works on Chrome, Firefox, Safari

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed
**Last Tested:** YYYY-MM-DD
**Tested By:** [Name]

**If Failed:**
- **Issues Found:** [Description of failures]
- **Blocker:** Yes | No
- **Fix Required:** [What needs to be fixed]

---

### SC-2: [Another Success Criterion]

[Follow same structure as SC-1]

---

## 🧪 Test Strategy

### Test Pyramid

```
         ┌─────────────┐
         │   Manual    │  ← Small number, high value
         │  E2E Tests  │
         └─────────────┘
              ▲
         ┌─────────────────┐
         │  Integration    │  ← Moderate number
         │     Tests       │
         └─────────────────┘
              ▲
         ┌───────────────────────┐
         │    Unit Tests         │  ← Large number, fast
         └───────────────────────┘
```

**Our Approach:**
- **Unit Tests:** 70% of tests - Fast, isolated, test logic
- **Integration Tests:** 20% of tests - Test component interaction
- **E2E Tests:** 10% of tests - Critical user paths only
- **Manual Tests:** Exploratory, edge cases, UX validation

---

## ✅ Unit Tests

> **Test individual functions, components, and modules in isolation**

### Testing Framework

- **Framework:** [e.g., Jest, Vitest, PyTest]
- **Location:** `__tests__/` or `*.test.ts` files
- **Coverage Tool:** [e.g., Jest Coverage, Coverage.py]
- **Target Coverage:** [e.g., 80% lines, 90% branches for new code]

### Unit Test Plan

#### Component: [Component/Module Name]

**File:** `src/services/preferences/PreferencesService.ts`

**Tests to Write:**

1. **Test:** `getUserPreferences() returns preferences for valid user`
   - **Setup:** Mock repository with sample preference data
   - **Execute:** Call `getUserPreferences(userId)`
   - **Assert:** Returns correct UserPreferences object

2. **Test:** `getUserPreferences() throws error for invalid user ID`
   - **Setup:** Mock repository to return null
   - **Execute:** Call `getUserPreferences('invalid-id')`
   - **Assert:** Throws UserNotFoundError

3. **Test:** `updatePreferences() validates theme values`
   - **Setup:** Call with invalid theme value
   - **Execute:** `updatePreferences(userId, { theme: 'invalid' })`
   - **Assert:** Throws ValidationError with appropriate message

4. **Test:** `updatePreferences() updates only provided fields`
   - **Setup:** Existing preferences with theme='light', language='en'
   - **Execute:** `updatePreferences(userId, { theme: 'dark' })`
   - **Assert:** Theme updated, language unchanged

<!-- Add more tests as needed -->

**Total Unit Tests Planned:** [Count]

---

#### Component: [Another Component]

[Follow same structure]

---

### Unit Test Checklist

- [ ] All public methods have tests
- [ ] Edge cases covered (null, undefined, empty, invalid inputs)
- [ ] Error conditions tested
- [ ] Happy path tested
- [ ] Boundary conditions tested
- [ ] Coverage target met (run `npm test -- --coverage`)

---

## 🔗 Integration Tests

> **Test how components work together**

### Integration Test Scope

**What We're Testing:**
- API routes + Service layer + Database
- Form components + State management + API calls
- Authentication + Protected routes
- End-to-end data flow

### Integration Test Plan

#### Integration Test 1: Preference API Full Flow

**File:** `__tests__/api/preferences/route.test.ts`

**Scenario:** User fetches and updates preferences via API

**Setup:**
- Test database with seed data
- Authenticated test user
- Mock session

**Test Steps:**
1. GET `/api/preferences` with valid auth token
2. **Assert:** Returns 200 with current preferences
3. PATCH `/api/preferences` with theme='dark'
4. **Assert:** Returns 200 with updated preferences
5. GET `/api/preferences` again
6. **Assert:** Returns 200 with theme='dark' persisted

**Teardown:**
- Clean up test database

**Expected Results:**
- All requests return correct status codes
- Data persists correctly
- No side effects on other users' data

---

#### Integration Test 2: [Another Integration Scenario]

[Follow same structure]

---

### Integration Test Checklist

- [ ] API endpoints tested end-to-end
- [ ] Database operations verified
- [ ] Authentication/authorization tested
- [ ] Error responses validated (400, 401, 500)
- [ ] Data integrity maintained across requests

**Total Integration Tests Planned:** [Count]

---

## 🌐 End-to-End (E2E) Tests

> **Test critical user journeys through the UI**

### E2E Testing Framework

- **Framework:** [e.g., Playwright, Cypress, Selenium]
- **Location:** `e2e/` or `tests/e2e/`
- **Target:** Critical user paths only (not exhaustive)

### E2E Test Plan

#### E2E Test 1: Complete Preference Change Flow

**User Story:** User changes theme and language preferences

**Preconditions:**
- User logged in
- Preferences page exists
- Default preferences: theme='light', language='en'

**Test Steps:**

1. **Navigate** to settings page (`/settings`)
   - **Verify:** Settings page loads
   - **Verify:** Current theme shows "Light"

2. **Change** theme dropdown to "Dark"
   - **Verify:** Dropdown shows "Dark" selected

3. **Change** language dropdown to "Spanish"
   - **Verify:** Dropdown shows "Spanish" selected

4. **Click** "Save Settings" button
   - **Verify:** Loading state shows briefly
   - **Verify:** Success message appears
   - **Verify:** Theme changes to dark immediately

5. **Refresh** page
   - **Verify:** Theme still dark
   - **Verify:** Language still Spanish

6. **Navigate** away and back to settings
   - **Verify:** Preferences persisted

**Expected Results:**
- All UI elements functional
- Changes applied immediately
- Changes persisted across sessions
- No errors in console
- No visual glitches

**Evidence:**
- [ ] Test passes in CI/CD
- [ ] Screen recording attached
- [ ] Screenshot of final state

---

#### E2E Test 2: [Another Critical Path]

[Follow same structure]

---

### E2E Test Checklist

- [ ] Happy path tested for each user story
- [ ] Tests run in CI/CD pipeline
- [ ] Tests pass on target browsers (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness tested (if applicable)
- [ ] No flaky tests (tests pass consistently)

**Total E2E Tests Planned:** [Count]

---

## 👨‍💻 Manual Testing

> **Exploratory testing, edge cases, and user experience validation**

### Manual Test Plan

#### Manual Test Session 1: User Experience Flow

**Focus Area:** Overall user experience and edge cases

**Test Scenarios:**

1. **Scenario:** User with no saved preferences (new user)
   - **Action:** Log in for first time, navigate to settings
   - **Expected:** Default preferences shown
   - **Verify:** No errors, reasonable defaults

2. **Scenario:** User changes preference while another tab open
   - **Action:** Open settings in two tabs, change in one
   - **Expected:** Other tab updates or shows warning
   - **Verify:** No data loss or conflicts

3. **Scenario:** User with slow network connection
   - **Action:** Throttle network to 3G, attempt to save
   - **Expected:** Loading state shows, success on completion
   - **Verify:** Timeout handling works

4. **Scenario:** User spams save button
   - **Action:** Click "Save Settings" rapidly 10 times
   - **Expected:** Debounced or queued requests, no errors
   - **Verify:** Data integrity maintained

5. **Scenario:** User tries invalid preference values (manual API call)
   - **Action:** Use Postman to send invalid data
   - **Expected:** 400 Bad Request with clear error message
   - **Verify:** No server crash, validation works

**Evidence to Collect:**
- [ ] Notes on each scenario
- [ ] Screenshots of edge cases
- [ ] Any bugs found logged in issue tracker

---

#### Manual Test Session 2: Cross-Browser Testing

**Browsers to Test:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**What to Validate:**
- UI renders correctly
- Dropdowns and inputs functional
- Save button works
- No console errors

**Evidence:**
- [ ] Checklist above completed
- [ ] Screenshots from each browser (if issues found)

---

#### Manual Test Session 3: Accessibility (a11y)

**Focus:** Keyboard navigation, screen readers, WCAG compliance

**Tests:**
1. **Keyboard Navigation**
   - [ ] Can tab through all form fields
   - [ ] Can use arrow keys in dropdowns
   - [ ] Can submit form with Enter key
   - [ ] Focus indicators visible

2. **Screen Reader (NVDA/VoiceOver)**
   - [ ] Form labels read correctly
   - [ ] Error messages announced
   - [ ] Success messages announced
   - [ ] Button purposes clear

3. **Color Contrast**
   - [ ] Text meets WCAG AA standards (4.5:1 ratio)
   - [ ] Interactive elements clearly visible

**Tools:**
- Lighthouse accessibility audit
- axe DevTools
- Manual screen reader testing

**Evidence:**
- [ ] Lighthouse score ≥ 90
- [ ] No critical axe violations

---

### Manual Testing Checklist

- [ ] All manual test sessions completed
- [ ] Bugs found logged and prioritized
- [ ] Edge cases documented
- [ ] User experience validated
- [ ] Accessibility validated
- [ ] Cross-browser compatibility confirmed

---

## 🔒 Security Testing

> **Validate security requirements and identify vulnerabilities**

### Security Test Plan

1. **Authentication Testing**
   - [ ] Unauthenticated users cannot access `/api/preferences`
   - [ ] Invalid tokens rejected with 401
   - [ ] Expired tokens rejected

2. **Authorization Testing**
   - [ ] Users can only access their own preferences
   - [ ] User A cannot modify User B's preferences
   - [ ] Admin privileges not required (if not admin-only feature)

3. **Input Validation**
   - [ ] SQL injection attempts blocked (test with `'; DROP TABLE users;--`)
   - [ ] XSS attempts sanitized (test with `<script>alert('xss')</script>`)
   - [ ] Oversized payloads rejected (test with 1MB JSON)

4. **Data Protection**
   - [ ] No sensitive data in logs
   - [ ] Preferences encrypted in transit (HTTPS)
   - [ ] No PII exposed in error messages

**Security Tools:**
- OWASP ZAP scan
- npm audit / dependency vulnerability scan
- Manual penetration testing (if applicable)

**Evidence:**
- [ ] Security scan results attached
- [ ] No critical vulnerabilities found
- [ ] Any medium/low findings documented with mitigation plan

---

## ⚡ Performance Testing

> **Validate performance requirements from TECHNICAL_RFC.md**

### Performance Requirements

| Metric | Target | Measurement Method | Status |
|--------|--------|-------------------|--------|
| API Response Time (GET) | < 200ms (p95) | Lighthouse / APM | ⬜ Not Tested |
| API Response Time (PATCH) | < 500ms (p95) | Lighthouse / APM | ⬜ Not Tested |
| Page Load Time | < 2s (p95) | Lighthouse | ⬜ Not Tested |
| Database Query Time | < 50ms | Query logging | ⬜ Not Tested |

### Performance Test Plan

1. **Lighthouse Audit**
   - [ ] Run Lighthouse on settings page
   - [ ] Performance score ≥ 90
   - [ ] No performance warnings

2. **Load Testing (If Applicable)**
   - [ ] Simulate 100 concurrent users
   - [ ] API response times within targets
   - [ ] No errors under load

3. **Database Performance**
   - [ ] Enable query logging
   - [ ] Verify indexes being used
   - [ ] No slow queries (> 100ms)

**Evidence:**
- [ ] Lighthouse report attached
- [ ] Load test results (if performed)
- [ ] Database query performance logs

---

## 🧹 Code Quality Checks

> **Ensure code maintainability and standards**

### Static Analysis

- [ ] Linter passes (ESLint / Pylint)
- [ ] Type checker passes (TypeScript / mypy)
- [ ] Formatter applied (Prettier / Black)
- [ ] No console.log or debug statements left in code
- [ ] No commented-out code blocks

### Code Review Checklist

- [ ] Code follows project conventions (see TECHNICAL_RFC.md patterns)
- [ ] Functions have clear names and single responsibilities
- [ ] Complex logic has comments explaining "why"
- [ ] No duplicate code (DRY principle)
- [ ] Error handling implemented for all failure modes
- [ ] No hardcoded values (use constants/config)

**Evidence:**
- [ ] CI/CD pipeline passes all checks
- [ ] Code review approval from [Reviewer Name]

---

## 📦 Deployment Validation

> **Ensure safe deployment to production**

### Pre-Deployment Checklist

**Environment Configuration:**
- [ ] Environment variables documented in `.env.example`
- [ ] Secrets stored securely (not in code)
- [ ] Database migrations tested on staging
- [ ] Rollback plan documented

**Deployment Readiness:**
- [ ] All tests passing in CI/CD
- [ ] Staging deployment successful
- [ ] Smoke tests passed on staging
- [ ] Performance acceptable on staging
- [ ] No breaking changes to existing features

### Post-Deployment Validation

**Immediately After Deploy:**
- [ ] Health check endpoint returns 200
- [ ] Can access settings page without errors
- [ ] Can save preferences successfully
- [ ] No errors in application logs
- [ ] No spike in error rates (monitoring dashboard)

**Within 24 Hours:**
- [ ] Monitor error rates (target: < 0.1%)
- [ ] Monitor API response times (within targets)
- [ ] Check for unexpected support tickets
- [ ] Review user feedback (if any)

**Evidence:**
- [ ] Deployment checklist completed
- [ ] Monitoring screenshots showing stable metrics
- [ ] No rollback required

---

## 📊 Test Results Summary

> **Aggregate view of all validation efforts**

### Test Execution Status

| Test Type | Planned | Executed | Passed | Failed | Blocked | Coverage |
|-----------|---------|----------|--------|--------|---------|----------|
| Unit Tests | [Count] | [Count] | [Count] | [Count] | [Count] | [%] |
| Integration Tests | [Count] | [Count] | [Count] | [Count] | [Count] | [%] |
| E2E Tests | [Count] | [Count] | [Count] | [Count] | [Count] | N/A |
| Manual Tests | [Count] | [Count] | [Count] | [Count] | [Count] | N/A |

**Overall Test Pass Rate:** [XX]% (Target: ≥ 95%)

### Defects Found

| ID | Severity | Description | Status | Fixed In |
|----|----------|-------------|--------|----------|
| BUG-1 | 🔴 Critical | [Description] | Open / Fixed | Commit / N/A |
| BUG-2 | 🟡 Medium | [Description] | Fixed | [Commit hash] |

**Critical Bugs:** [Count] (MUST be 0 before completion)
**Medium Bugs:** [Count] (should be addressed or documented)
**Low Bugs:** [Count] (can defer to backlog)

---

## ✅ Completion Criteria

> **Work is NOT complete until all of these are checked**

### Must-Have (Blocking Completion)

- [ ] All success criteria from PROBLEM_BRIEF.md validated
- [ ] All unit tests written and passing (≥ 80% coverage)
- [ ] All integration tests written and passing
- [ ] Critical user paths tested end-to-end
- [ ] **Zero critical bugs** open
- [ ] Security validation passed
- [ ] Performance requirements met
- [ ] Code review approved
- [ ] Staging deployment successful
- [ ] Documentation updated (README, API docs)

### Should-Have (Strongly Recommended)

- [ ] Manual test sessions completed
- [ ] Cross-browser testing done
- [ ] Accessibility validated (Lighthouse ≥ 90)
- [ ] Medium bugs addressed or accepted
- [ ] Production deployment successful

### Nice-to-Have (Can Defer)

- [ ] Load testing performed (if low traffic expected, can skip)
- [ ] Additional edge cases explored
- [ ] Low priority bugs fixed

---

## 🔄 Regression Testing (For Future Updates)

> **Tests to run when making changes to this feature later**

**Critical Regression Suite:**
1. Test: User can save and load preferences
2. Test: Theme changes apply immediately
3. Test: Preferences persist across sessions

**Run these tests:**
- Before any code changes to preferences feature
- After changes, before merging PR
- During each deployment (CI/CD automation)

---

## 📝 Stewardship & Maintenance

### Ownership

- **QA Owner:** [Name] - Responsible for test execution and validation
- **Reviewers:** [Names] - Validate test coverage and evidence
- **Approver:** [Name] - Final sign-off on completion

### Update Triggers

Update this validation plan when:
- ✏️ **New success criteria added** - Add corresponding validation
- ✏️ **Feature changes** - Update affected tests
- ✏️ **Bugs found in production** - Add regression tests
- ✏️ **Test failures** - Document and track to resolution

---

## 📚 Cross-References

**Related Artifacts for This Work Item:**
- **Success Criteria:** See `PROBLEM_BRIEF.md` for what we're validating
- **Technical Details:** See `TECHNICAL_RFC.md` for implementation to test
- **Risks:** See `RISK_REGISTER.md` for testing-related risks
- **Implementation:** See `IMPLEMENTATION_PLAN.md` for task-test mapping
- **Evidence Collection:** Link test results in `SESSION_NOTES.md` and `IMPLEMENTATION_SUMMARY.md`

---

**Part of:** CDD Modular Artifacts (VALIDATION_PLAN.md)
**Template Mode:** comprehensive

---

## Quick Start Guide

**Never written a validation plan before? Start here:**

1. **List success criteria** from PROBLEM_BRIEF.md
2. **For each criterion**, decide: Unit test? Integration test? Manual test?
3. **Write tests** as you implement (not after!)
4. **Collect evidence** as tests pass
5. **Before completion**, verify all checkboxes in Completion Criteria section

**Remember:** Testing isn't overhead—it's how you prove it works! 🎯
