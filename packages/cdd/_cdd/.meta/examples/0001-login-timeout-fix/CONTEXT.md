---
id: 0001
title: Fix Login Timeout on Mobile
type: bug
status: complete
created: 2024-02-10
updated: 2024-02-13
---

# Fix Login Timeout on Mobile

## Original Prompt

`/cdd:start fix login timeout bug on mobile`

**Refined after investigation:** Users getting logged out after 5 minutes, mobile browsers only. Root cause: token refresh failing when tab backgrounded on iOS.

## Why (Problem)

Users reporting forced logouts after ~5 minutes on mobile browsers (iOS Safari, Chrome). Desktop works fine. Issue started after v2.3 deployment.

**Impact:** Support tickets up 40%, user frustration high, affecting mobile conversion.

## Solution

**Phase 1:** Quick fix - increase timeout 5min → 30min
**Phase 2:** Proper fix - heartbeat ping to detect activity + handle background state
**Phase 3:** Add monitoring to catch future issues

## Tasks

### Phase 1: Investigation (2/2 complete)

- [x] **Task 1.1:** Reproduce on iOS Safari
      **Files:** N/A (manual testing)
      **Done when:** Consistent repro with steps documented

- [x] **Task 1.2:** Analyze token refresh code
      **Files:** `src/auth/tokenRefresh.ts`
      **Done when:** Root cause identified (iOS backgrounding)

### Phase 2: Quick Fix (1/1 complete)

- [x] **Task 2.1:** Increase session timeout
      **Files:** `src/auth/config.ts`, `tests/auth/session.test.ts`
      **Done when:** Timeout = 30min, tests passing, deployed

### Phase 3: Proper Solution (3/3 complete)

- [x] **Task 3.1:** Implement heartbeat service
      **Files:** `src/auth/HeartbeatService.ts`, `src/auth/hooks/useHeartbeat.ts`
      **Done when:** Ping every 60s, keeps session alive

- [x] **Task 3.2:** Add background state detection
      **Files:** `src/utils/visibilityState.ts`
      **Done when:** Detects tab backgrounded, pauses refresh

- [x] **Task 3.3:** Add monitoring
      **Files:** `src/monitoring/authMetrics.ts`
      **Done when:** Track refresh failures by browser/OS

## Context for AI

**Patterns to follow:**
- Auth services in `src/auth/`
- React hooks in `src/auth/hooks/`
- Use `AuthContext` for global state
- Follow existing token refresh pattern

**Key files:**
- `src/auth/tokenRefresh.ts` - Token refresh logic (modified)
- `src/auth/config.ts` - Session timeout config (modified)
- `src/auth/HeartbeatService.ts` - New service (created)
- `src/utils/visibilityState.ts` - Browser API wrapper (created)

**Constraints:**
- Security policy: max token lifetime = 30min (can't extend)
- Performance budget: < 1KB/min network overhead
- Must work on iOS Safari, Chrome mobile, Android

**Notes:**
- iOS tabs pause JS timers when backgrounded
- Token refresh uses 15-second timer (gets paused)
- Heartbeat uses Page Visibility API (works when backgrounded)

## Decisions

### 2024-02-11: Heartbeat vs Long-lived Tokens

**Decision:** Implement heartbeat ping (60s interval)

**Your Rationale:**
- Long-lived tokens violate security policy (30min max)
- Heartbeat detects actual user activity (better than arbitrary timeout)
- Works around iOS timer suspension

**AI Suggested:** Long-lived refresh tokens (rejected due to security policy)

**Trade-offs:**
- Extra network calls: +1 request/min (acceptable, <100 bytes)
- Battery impact: minimal (60s interval, idle network)
- Complexity: new service (worth it for reliability)

**Alternatives considered:**
- Option A: 4-hour tokens → Rejected (security policy violation)
- Option B: LocalStorage fallback → Rejected (doesn't solve iOS issue)
- Option C: WebSocket keepalive → Rejected (overkill, high overhead)

**See full analysis:** [decisions/2024-02-11-session-strategy.md](decisions/2024-02-11-session-strategy.md)

### 2024-02-12: Heartbeat Interval (30s vs 60s)

**Decision:** 60-second interval

**Your Rationale:**
- 30min timeout / 60s interval = 30 pings max (acceptable overhead)
- Battery impact minimal at 60s
- User tolerance: can handle up to 60s delay on wake

**AI Suggested:** 30s for more responsive wake (we chose 60s for battery life)

**Trade-offs:**
- More responsive: 30s detects activity faster
- Better battery: 60s reduces pings by 50%
- **Choice:** Battery life matters more on mobile
