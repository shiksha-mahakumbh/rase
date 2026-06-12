# Visitor Analytics Race Condition Audit

**Date:** 2026-05-29  
**Role:** Senior Backend Engineer  
**Issue:** Prisma P2002 on `visitor_sessions.session_id`

---

## Symptom

```
prisma:error
Invalid `prisma.visitorSession.create()` invocation:
Unique constraint failed on the fields: (`session_id`)
code: P2002
```

Observed in dev server logs on `POST /api/visitors` while analytics and page tracker fire in parallel.

---

## Exact Code Path

```
Client (VisitorPageTracker / FooterVisitorCounter)
  → POST /api/visitors
    → src/app/api/visitors/route.ts:63
      → recordVisitorHit()
        → src/server/services/visitor-analytics.service.ts:trackVisit()
          → [BEFORE FIX] findUnique(sessionId)
          → [BEFORE FIX] visitorSession.create()  ← P2002 here
```

Parallel path also exists via `POST /api/v2/analytics/track` (returns 200 independently).

### Route handler (`src/app/api/visitors/route.ts`)

- Builds `sessionId` from request body or falls back to `anon-${getClientIp}`
- Calls `recordVisitorHit()` when `shouldTrackAnalytics(path)` is true
- Catches all errors and returns HTTP 200 with degraded fallback stats (errors logged but not surfaced to client)

### Service (`src/server/services/visitor-analytics.service.ts`)

**Before fix:** check-then-act pattern:

1. `findUnique({ where: { sessionId } })`
2. If null → `create()` with nested device, location, traffic, pageView
3. If exists → `update()` + separate `pageView.create()`

---

## Prisma Schema

```prisma
model VisitorSession {
  sessionId String @unique @map("session_id")
  ...
  @@map("visitor_sessions")
}
```

Unique index on `session_id` enforces one row per browser session. Concurrent inserts for the same ID violate the constraint.

---

## Root Cause

Classic **TOCTOU race** (time-of-check to time-of-use):

| Step | Request A | Request B |
|------|-----------|-----------|
| 1 | `findUnique` → null | `findUnique` → null |
| 2 | `create()` → success | `create()` → **P2002** |

**Triggers:**

- React Strict Mode double-mount in development
- Parallel requests on page load (footer counter + page tracker + analytics v2)
- Multiple tabs sharing session cookie
- Serverless cold starts with concurrent warm requests

---

## Environment Impact

| Environment | Affected? | Notes |
|-------------|-----------|-------|
| **Development** | **Yes** | Strict Mode + verbose Prisma logging makes this visible |
| **Production** | **Yes** | Same race; route catches error → degraded stats, noisy logs |
| **Build** | No | Static generation does not hit runtime API |

Production impact is **non-fatal** (API returns 200) but causes:

- Inflated error rates in logs/monitoring
- Occasional missed page-view increments when create fails before recovery
- Incorrect visitor counts during concurrent first-hit windows

---

## Impact Assessment

| Area | Severity | Detail |
|------|----------|--------|
| Data integrity | Medium | Duplicate session rows prevented by DB; failed creates lose a hit |
| User experience | Low | Counter still returns fallback JSON |
| Security | None | No auth/PII exposure |
| Launch blocker | Low | Does not block cutover; should fix before prod deploy |

---

## Remediation Direction

Preferred fix order per engineering review:

1. **`upsert()`** — atomic INSERT … ON CONFLICT at database level ✅ selected
2. Transaction with serializable isolation — heavier, unnecessary
3. P2002 catch-and-retry — works but treats symptom not cause

---

*Audit complete — remediation in `VISITOR_ANALYTICS_FIX_REPORT.md`.*
