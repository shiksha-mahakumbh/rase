# Visitor Counter — Root Cause Analysis & Fix

**Date:** May 2026  
**Status:** Fixed in code · Requires `DATABASE_URL` + Phase B.5 migration on deploy

---

## Symptoms reported

- Daily visitors stuck at **0**
- Total visitors frozen at **94,567** (legacy offset)
- Active users showing **0**
- Admin analytics dashboard may show data while footer does not

---

## Architecture (current)

```
FooterVisitorCounter → POST/GET /api/visitors → visitor-analytics.service.ts → Prisma/Supabase
VisitorPageTracker   → POST /api/v2/analytics/track → same service
```

**Firebase is NOT used** for the public counter. `visitors.server.ts` is dead code.

---

## Root causes identified

### RC-1: Rollup zero-trap (HIGH) — **FIXED**

**File:** `visitor-analytics.service.ts` → `getPublicVisitorStats()`

```typescript
// Before (bug):
daily: rollup?.uniqueCount ?? uniqueToday

// After (fix):
daily: Math.max(rollup?.uniqueCount ?? 0, uniqueToday)
```

Bot traffic creates a `visitor_analytics` row with `uniqueCount: 0`. The `??` operator only falls back when rollup is null — not when it is zero. Real sessions existed but daily displayed 0.

### RC-2: Race between tracker and footer (HIGH) — **FIXED**

**Sequence:**
1. `VisitorPageTracker` fires first with `countAsVisit: false` → creates session, **no rollup bump**
2. `FooterVisitorCounter` POST with `countAsVisit: true` → session exists → **no rollup bump** (only new-session branch incremented)

**Fix:** Added rollup increment in the **existing-session** branch when `countAsVisit !== false && isNewVisitorToday`.

### RC-3: Silent DB failure (HIGH) — **MITIGATED**

When Prisma fails (missing `DATABASE_URL`, unapplied migrations), service returns:

```json
{ "daily": 0, "displayTotal": 94567, "source": "fallback" }
```

HTTP 200 — UI showed legacy total with zero daily/active.

**Fix:** `FooterVisitorCounter` now detects `source: "fallback"` / `degraded` and shows warning.

**Ops required:** Apply migration `20250622_phase_b5_analytics`, set `DATABASE_URL`.

### RC-4: Stale CDN cache (MEDIUM) — **FIXED**

`GET /api/visitors` used `Cache-Control: public, s-maxage=30`.

**Fix:** Changed to `private, no-store, max-age=0`.

### RC-5: Misleading env var (LOW)

`VISITOR_COUNTER_USE_FIRESTORE` in `.env.example` has no effect. Counter uses Supabase/Prisma only.

---

## Fixes applied

| File | Change |
|------|--------|
| `visitor-analytics.service.ts` | `Math.max` daily; rollup on existing-session visit |
| `api/visitors/route.ts` | No-store cache headers |
| `FooterVisitorCounter.tsx` | Degraded detection, `useRef` for visit dedup, `aria-live` |

---

## Verification checklist

1. `GET /api/v2/health` → `database: "connected"`
2. `POST /api/visitors` with body `{ sessionId, visitorId, path }` → `source: "supabase"`
3. `GET /api/visitors` → `daily >= 1` after human visit
4. Footer shows updated daily/total/active (not 94,567-only fallback)
5. `/admin/cms/analytics` dashboard widgets update after traffic

---

## Data model reference

| Table | Purpose |
|-------|---------|
| `visitor_sessions` | Unique visitors + active window |
| `visitor_page_views` | Per-page views |
| `visitor_analytics` | Daily rollup (`uniqueCount`) |
| `visitor_events` | Custom events |
| `visitor_devices` | Device breakdown |
| `visitor_locations` | Geo (Vercel headers) |
| `traffic_sources` | UTM / referrer |

`LEGACY_VISITOR_OFFSET = 94,567` added to `totalUnique` for display continuity.
