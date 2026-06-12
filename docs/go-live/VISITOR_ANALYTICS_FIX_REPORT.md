# Visitor Analytics Fix Report

**Date:** 2026-05-29  
**Fix:** Replace check-then-create with atomic `visitorSession.upsert()`

---

## Summary

Resolved P2002 duplicate `session_id` errors in visitor analytics by replacing the `findUnique` + `create` pattern with PostgreSQL-native upsert semantics via Prisma.

---

## Before / After Behavior

### Before

```
findUnique(sessionId)
  → if null: create()           ← race: two creates → P2002
  → if exists: update() + pageView.create()
```

- Concurrent first hits threw P2002
- Route caught error → HTTP 200 degraded response
- Prisma error logged on every race

### After

```
findUnique(sessionId)           ← used only for rollup metadata (isReturning, isNewVisitorToday)
upsert(sessionId)
  → create: full session + device + location + traffic (pageViewCount: 1)
  → update: increment pageViewCount, update lastPath/lastActiveAt
pageView.create()               ← always (one row per hit)
rollup if isNewVisitorToday
```

- Concurrent first hits: one INSERT, rest ON CONFLICT UPDATE — **no P2002**
- Same API response shape
- Analytics semantics preserved

---

## Files Changed

| File | Change |
|------|--------|
| `src/server/services/visitor-analytics.service.ts` | Upsert refactor in `trackVisit()` |
| `scripts/test-visitor-analytics-race.mjs` | New test suite (10 cases) |
| `package.json` | Added `test`, `test:visitor-analytics` scripts |
| `docs/go-live/VISITOR_ANALYTICS_RACE_CONDITION_AUDIT.md` | Root cause audit |
| `docs/go-live/VISITOR_ANALYTICS_FIX_REPORT.md` | This report |

**No schema changes.** **No API contract changes.**

---

## Validation Evidence

### Tests — 25/25 PASS

```bash
npm run test
```

| Suite | Pass | Fail |
|-------|------|------|
| `test:security` | 15 | 0 |
| `test:visitor-analytics` | 10 | 0 |

Visitor analytics test cases:

| Test | Result |
|------|--------|
| Source uses `upsert` | PASS |
| No naked `create` in trackVisit | PASS |
| No P2002 fallback needed | PASS |
| Page view always created | PASS |
| Route delegates correctly | PASS |
| Single request simulation | PASS |
| 20 concurrent requests simulation | PASS |
| Existing session simulation | PASS |
| **8 concurrent DB upserts** | PASS — 0 P2002 |
| **Single DB session row** | PASS |

### TypeScript

```bash
npx tsc --noEmit
→ exit 0
```

### Build

```bash
npm run build
→ 303 static pages, exit 0
```

---

## Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Regression in visitor counts | Low | Upsert preserves increment semantics; pageView always created |
| Double page views on create | Low | Removed nested pageView from create; single explicit create after upsert |
| Rollup over-count on race | Low | Unchanged from prior behavior (isNewVisitorToday logic same) |
| Production deploy required | **Yes** | Fix is server-side only; stale deploy still has old code |

---

## Deployment Required?

**Yes** — this fix must be included in the next Vercel production deploy (`npx vercel --prod`) to take effect on live traffic.

Does **not** require:

- Database migration
- Supabase SQL changes
- Vercel env changes
- Firebase import

Can ship independently of cutover sequence but should be included in the same deploy bundle as remediation commits.

---

## Residual Risks

1. **Daily rollup race** — `upsertDailyRollup` uses separate read/write; concurrent first-of-day hits could theoretically over-count (pre-existing, out of scope)
2. **Bot filter path** — unchanged; not affected by this fix
3. **Stale production** — live site still on pre-fix build until redeploy

---

*Fix validated 2026-05-29 — ready for dedicated commit.*
