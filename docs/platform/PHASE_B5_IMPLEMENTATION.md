# Phase B.5 — Visitor Analytics & Global Platform Audit

**Status:** Implemented  
**Date:** June 2026  
**Rule:** `REGISTRATION_BACKEND=firebase` · No registration changes · Phase C paused

---

## B.5A — Visitor Analytics Engine

### Database models (6 tables + rollup)

| Table | Purpose |
|-------|---------|
| `visitor_sessions` | Session tracking, returning visitors, bot flag |
| `visitor_page_views` | Path, category, UTM, referrer, duration |
| `visitor_events` | Custom events (downloads, notice views) |
| `visitor_devices` | Device type, browser, OS, screen |
| `visitor_locations` | Country, state, city (Vercel geo headers) |
| `traffic_sources` | Source, medium, campaign, referrer domain |
| `visitor_analytics` | Daily rollup (unique, returning, bot filtered) |

### Tracked metrics

- Total visitors (unique `visitor_id` + legacy offset 94,567)
- Unique visitors (per day/week/month/year)
- Returning visitors
- Daily / weekly / monthly / yearly aggregates
- Page views by category: homepage, registration, conclave, event, download, noticeboard, media, committee, press

### Service

`src/server/services/visitor-analytics.service.ts`

| Function | Purpose |
|----------|---------|
| `trackVisit()` | Record session + page view |
| `trackEvent()` | Custom content events |
| `getPublicVisitorStats()` | Counter display (30s cache) |
| `getAnalyticsDashboard()` | 10 admin widgets + charts |
| `getVisitorMetrics()` | Period aggregates |
| `getTopPages()` | Page analytics |
| `getTrafficSources()` | Source breakdown |
| `getDeviceBreakdown()` | Device analytics |
| `getRegistrationConversionRate()` | Funnel metric |

### Bot filtering

`src/server/lib/visitor-analytics-utils.ts` — 15+ bot UA patterns filtered; bots not counted in metrics.

---

## B.5B — Live Dashboard APIs

| Endpoint | Auth | Returns |
|----------|------|---------|
| `GET /api/v2/admin/analytics/dashboard` | Admin | 10 widgets + charts + operations stats |
| `GET /api/v2/admin/analytics/visitors?period=day` | Admin | Metrics + chart + category breakdown |
| `GET /api/v2/admin/analytics/pages` | Admin | Top pages, downloads, notices, traffic, devices, conversion |

### Dashboard widgets

1. Total visitors (`displayTotal`)
2. Active visitors (5-min window)
3. Visitors today
4. Visitors this month
5. Top pages
6. Top downloads
7. Most viewed notices
8. Registration conversion rate
9. Traffic sources
10. Device breakdown

### Charts

`day` · `week` · `month` · `year` — via `getAnalyticsChartData()`

---

## B.5H — Visitor Counter Fix

### Before (broken)

- Firestore-only via `visitors.server.ts`
- Production fallback: static 94,567 (Firestore unreachable)
- Double POST+GET per page load, no session dedup
- Prisma `visitor_analytics` unused

### After (Supabase)

| Component | Change |
|-----------|--------|
| `/api/visitors` | Routes to Supabase analytics service |
| `FooterVisitorCounter.tsx` | Session dedup, 3 metrics, fallback display |
| `VisitorPageTracker.tsx` | Page view tracking on route change |
| `ClientChrome.tsx` | Mounts page tracker |
| `visitor-ids.ts` | Persistent visitorId + sessionId |

### Public APIs

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/visitors` | Record visit (backward compatible) |
| GET | `/api/visitors` | Daily + total + active counts |
| POST | `/api/v2/analytics/track` | Full page view tracking |
| GET | `/api/v2/analytics/stats` | Public stats JSON |

### Display

- **Daily Visitors** — unique today
- **Total Visitors** — all-time unique + legacy offset
- **Active Now** — sessions active in last 5 minutes

---

## Global audits (B.5C–G)

| Report | Path |
|--------|------|
| SEO Global Audit | `docs/platform/SEO_GLOBAL_AUDIT.md` (62/100) |
| Mobile Global Audit | `docs/platform/MOBILE_GLOBAL_AUDIT.md` (71/100) |
| Accessibility Global Audit | `docs/platform/ACCESSIBILITY_GLOBAL_AUDIT.md` (68/100) |
| Admin Content Gap Report | `docs/platform/ADMIN_CONTENT_GAP_REPORT.md` (22/100) |
| CMS Expansion Master Plan | `docs/platform/CMS_EXPANSION_MASTER_PLAN.md` |
| Production Readiness Score | `docs/platform/PRODUCTION_READINESS_SCORE.md` (58/100) |

---

## Migration

```
prisma/migrations/20250622_phase_b5_analytics/migration.sql
```

```bash
npm run db:migrate:deploy
npm run db:generate
```

RLS: `supabase/policies/analytics.sql`

---

## What is NOT changed

- Firebase registration (`REGISTRATION_BACKEND=firebase`)
- Payment flow
- MultiTrack / Abstract / Paper backends
- Phase C modules (Committee, Events, Speakers, Partners, Media Center)

---

## Staging checklist

- [ ] Apply migration `20250622_phase_b5_analytics`
- [ ] Apply RLS `analytics.sql`
- [ ] Verify footer shows 3 counter metrics
- [ ] Verify `/api/v2/analytics/track` on page navigation
- [ ] Test admin dashboard: `GET /api/v2/admin/analytics/dashboard`
- [ ] Confirm bot UA filtered (curl test returns `bot_filtered`)
- [ ] Approve Phase B.6 (frontend wiring) or Phase C

---

## Next phase recommendation

**Phase B.6 — Frontend Wiring Sprint** (see `PRODUCTION_READINESS_SCORE.md`)

Wire existing v2 APIs to public pages before building Committee/Events/Media Center backends.
