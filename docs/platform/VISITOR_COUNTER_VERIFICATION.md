# Visitor Counter Verification — Phase S

**Date:** May 2026  
**Status:** Code verified · Live deploy requires `DATABASE_URL` + migration

---

## Architecture

```
VisitorPageTracker → POST /api/v2/analytics/track → trackVisit()
FooterVisitorCounter → POST /api/visitors → recordVisitorHit() → trackVisit(countAsVisit:true)
GET /api/visitors → getPublicVisitorStats()
GET /api/v2/analytics/stats → getPublicVisitorStats()
Admin dashboard → getAnalyticsDashboard()
```

---

## Verification checklist

| Check | Code status | Live deploy |
|-------|-------------|-------------|
| Session created on visit | ✅ `visitor_sessions` insert | Requires DB |
| Page view stored | ✅ `visitor_page_views` insert | Requires DB |
| Daily rollup increments | ✅ RC-1/RC-2 fixed | Requires DB |
| Active users (5 min window) | ✅ `ACTIVE_WINDOW_MS` | Requires DB |
| Display total = legacy + unique | ✅ `LEGACY_VISITOR_OFFSET` | Requires DB |
| Duplicate session protection | ✅ `sessionId` unique | ✅ |
| Bot exclusion | ✅ `isBotUserAgent()` 14 patterns | ✅ |
| Admin pages excluded | ✅ **Phase S fix** | ✅ |
| Datadekh excluded | ✅ **Phase S fix** | ✅ |
| CDN cache stale counts | ✅ `no-store` on GET | ✅ |
| Degraded mode UI | ✅ Footer warning | ✅ |
| Rate limit on track | ✅ 120/min/IP | ✅ |

---

## Phase S fixes applied

### 1. Client exclusion (`shouldTrackAnalytics`)

**File:** `src/lib/analytics/track-path.ts`

Excluded prefixes: `/admin`, `/api/`, `/AllData`  
Excluded segments: `datadekh`, `noticeboarddata`, `DelegateForm`

Applied in:
- `VisitorPageTracker.tsx`
- `FooterVisitorCounter.tsx` (skips count POST)

### 2. Server exclusion (defense in depth)

- `POST /api/v2/analytics/track` — returns `{ tracked: false, reason: "excluded_path" }`
- `POST /api/visitors` — skips `recordVisitorHit` for excluded paths

### 3. Prior fixes (B.7 audit)

| Fix | File |
|-----|------|
| Rollup zero-trap | `visitor-analytics.service.ts` |
| Existing-session rollup | `visitor-analytics.service.ts` |
| no-store cache | `api/visitors/route.ts` GET |
| Degraded UI | `FooterVisitorCounter.tsx` |

---

## Data flow verification

### New visitor (public page)

1. `VisitorPageTracker` fires → creates session, page view (`countAsVisit: false`)
2. `FooterVisitorCounter` POST → increments rollup if `isNewVisitorToday` (`countAsVisit: true`)
3. GET stats → `daily`, `displayTotal`, `activeUsers` from Supabase

### Returning visitor same day

1. Tracker updates session `lastActiveAt`, adds page view
2. Footer POST → no duplicate daily rollup (same `visitorId` today)
3. `countedRef` prevents duplicate footer POST per page load

### Admin page visit

1. Tracker returns early — **no DB write**
2. Footer skips count POST — **no rollup bump**
3. Top pages report no longer polluted

### Bot visit

1. `isBotUserAgent()` → `{ tracked: false, reason: "bot_filtered" }`
2. `botFiltered` incremented on daily rollup only

### DB unavailable

1. Service returns `source: "fallback"`, `displayTotal: 94567`
2. Footer shows amber warning "Live counts temporarily unavailable"

---

## Tables verified

| Table | Purpose | Write path |
|-------|---------|------------|
| `visitor_sessions` | Session tracking | `trackVisit` |
| `visitor_page_views` | Per-page views | `trackVisit` |
| `visitor_analytics` | Daily rollup | `upsertDailyRollup` |
| `visitor_devices` | UA parsing | New session |
| `visitor_locations` | Geo headers | New session |
| `traffic_sources` | UTM/referrer | New session |
| `visitor_events` | Custom events | `trackEvent` (partial) |

---

## Deploy verification steps

```bash
# 1. Apply migration
npx prisma migrate deploy

# 2. Verify health
curl https://www.rase.co.in/api/v2/health

# 3. Trigger visit
curl -X POST https://www.rase.co.in/api/visitors \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-1","visitorId":"visitor-1","path":"/"}'

# 4. Check stats (source must be "supabase" not "fallback")
curl https://www.rase.co.in/api/visitors

# 5. Verify admin excluded
curl -X POST https://www.rase.co.in/api/v2/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-2","visitorId":"visitor-2","path":"/admin/cms"}'
# Expected: { "tracked": false, "reason": "excluded_path" }
```

---

## Remaining recommendations (S2)

1. Bridge GTM `trackEvent()` to `visitor_events`
2. Download click tracking on downloads page
3. Campaign report tab in admin analytics
4. Retention policy for analytics tables > 12 months
