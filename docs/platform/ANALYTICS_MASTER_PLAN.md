# Analytics Master Plan — Phase S

**Date:** May 2026  
**Current analytics score:** 90/100  
**Target:** 95+/100  
**Status:** Roadmap only — no implementation

---

## Current analytics architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PUBLIC WEBSITE                           │
├─────────────────────────────────────────────────────────────┤
│  VisitorPageTracker → POST /api/v2/analytics/track          │
│  FooterVisitorCounter → POST/GET /api/visitors              │
│  trackEvent() → dataLayer + gtag + localStorage funnel      │
│  TrafficSourceCapture → sessionStorage UTM                  │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
       ┌───────▼────────┐         ┌───────▼────────┐
       │  Supabase      │         │  GTM / gtag    │
       │  visitor_*     │         │  (consent)     │
       └───────┬────────┘         └────────────────┘
               │
       ┌───────▼────────┐
       │  /admin/cms/   │
       │  analytics     │
       └────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Firebase /admin — registration funnel (separate stack)      │
└─────────────────────────────────────────────────────────────┘
```

---

## Verification status (post B.7 fix)

| Check | Status | Notes |
|-------|--------|-------|
| Visitor tracking fires | ✅ | `VisitorPageTracker` global |
| Session created | ✅ | `visitor_sessions` insert |
| Page view stored | ✅ | `visitor_page_views` insert |
| Daily visitors rollup | ✅ | RC-1/RC-2 fixed |
| Active users (15 min) | ✅ | `ACTIVE_WINDOW_MS` query |
| Display total (legacy + unique) | ✅ | `LEGACY_VISITOR_OFFSET` |
| Dashboard widgets update | ✅ | `getAnalyticsDashboard()` |
| Footer counter updates | ✅ | Degraded mode when DB down |
| Top pages report | ✅ | Admin analytics pages API |
| Source attribution | ✅ | `traffic_sources` table |
| UTM tracking | ✅ | Parsed in `trackVisit` |
| Campaign tracking | ⚠️ | Stored but no campaign report UI |

**Deploy requirement:** `DATABASE_URL` + migration `20250622_phase_b5_analytics` for live prod.

---

## Dual-stack gap analysis

| Event | Supabase `visitor_events` | GTM/gtag | Admin visible |
|-------|--------------------------|----------|---------------|
| Page view | ✅ | ❌ | ✅ dashboard |
| `registration_started` | ❌ | ✅ consent | Firebase admin + local funnel |
| `registration_completed` | ❌ | ✅ | Firebase admin |
| `brochure_download` | ❌ | ✅ | Admin growth panel (local) |
| `knowledge_hub_view` | ❌ | ✅ | local funnel only |
| `global_search` | ❌ | ✅ | local funnel only |
| Contact submit | ❌ | ❌ | API only |
| Feedback submit | ❌ | ❌ | API only |
| CMS download click | ❌ | ❌ | `downloadCount` in CMS |
| Admin CMS save | ❌ | ❌ | `audit_logs` only |

**Primary gap:** GTM funnel events and Supabase analytics are **not integrated**.

---

## Page tracking matrix

| Page | Page views | Events | Issues |
|------|-----------|--------|--------|
| Homepage | ✅ | brochure via link | — |
| Noticeboard | ✅ | — | — |
| Downloads | ✅ | — | No download click event |
| Registration | ✅ | started/completed | Not in Supabase |
| Contact | ✅ | — | No submit event |
| Feedback | ✅ | — | No submit event |
| Press | ✅ | — | — |
| Admin routes | ⚠️ tracked | — | Noise in top pages |
| Datadekh | ⚠️ tracked | — | Should exclude |

---

## Google Analytics / GTM plan

### Current state

- `AnalyticsLoader` loads gtag when cookie consent = accepted
- `trackEvent()` pushes to `dataLayer` + calls `gtag('event', ...)`
- Consent gate: `smk_cookie_consent === 'accepted'`
- Local funnel tallies in `localStorage` for admin growth panel

### S1 recommendations

| # | Task | Purpose |
|---|------|---------|
| 1 | Verify GTM container ID in production env | Live GA4 data |
| 2 | Map all `ANALYTICS_EVENTS` to GA4 custom events | Funnel visibility |
| 3 | Add `page_view` GA4 event alongside Supabase track | Cross-validation |
| 4 | Consent mode v2 for GDPR-ready | Future EU delegates |
| 5 | Exclude `/admin/*` from GA4 via GTM trigger | Clean data |

### GA4 event mapping

| SMK event | GA4 event | Parameters |
|-----------|-----------|------------|
| `registration_started` | `begin_checkout` | `registration_type` |
| `registration_completed` | `purchase` | `registration_type` (no revenue change) |
| `brochure_download` | `file_download` | `file_name`, `source` |
| `knowledge_hub_view` | `view_item_list` | `item_list_name` |
| `global_search` | `search` | `search_term` |

---

## Google Search Console plan

| # | Task | Priority |
|---|------|----------|
| 1 | Verify domain property for `rase.co.in` | High |
| 2 | Submit sitemap after hreflang S1 | High |
| 3 | Monitor Core Web Vitals report | Medium |
| 4 | Fix hreflang errors after Hindi launch | High |
| 5 | Review coverage for 32 legacy stub URLs | Medium |

---

## GTM integration architecture (target)

```
VisitorPageTracker
  → Supabase track (primary, always on)
  → GTM dataLayer page_view (consent-gated)

trackEvent()
  → Supabase visitor_events (new bridge)
  → GTM dataLayer custom event (consent-gated)

FooterVisitorCounter
  → Supabase only (no GTM)
```

---

## Supabase analytics enhancements

### S1 — Data quality

| # | Task |
|---|------|
| 1 | Exclude `/admin/*` and `/datadekh/*` from tracker |
| 2 | Bot filtering review (already implemented) |
| 3 | Degraded mode monitoring alert when `source=fallback` |

### S2 — Event bridge

| # | Task |
|---|------|
| 1 | POST `/api/v2/analytics/event` for client events |
| 2 | Bridge `trackEvent()` to Supabase `visitor_events` |
| 3 | Download click tracking on downloads page |
| 4 | Contact/feedback submit events (no PII) |

### S3 — Reporting

| # | Task |
|---|------|
| 1 | Campaign report tab (UTM breakdown) |
| 2 | Country widget in analytics dashboard |
| 3 | Export CSV from admin analytics |
| 4 | Real-time active users refresh (30s polling) |
| 5 | Retention policy (archive > 12 months data) |

---

## Admin actions tracking

| Action | Current | Target |
|--------|---------|--------|
| CMS content save | `audit_logs` | Visible in audit UI |
| Notice publish | `audit_logs` | ✅ |
| Settings change | `audit_logs` | ✅ |
| Gateway proxy calls | ❌ | Log operator email + path |
| Registration status change | Firebase | Keep Firebase audit |

---

## Unified analytics dashboard vision

| Tab | Data source |
|-----|-------------|
| **Visitors** | Supabase (current) |
| **Pages** | Supabase top pages |
| **Campaigns** | Supabase UTM + GA4 |
| **Registrations** | Firebase (link to /admin) |
| **Downloads** | CMS downloadCount + events |
| **Funnel** | Supabase events + GA4 |
| **Geo** | Supabase visitor_locations |

---

## Score projection

| Milestone | Analytics score |
|-----------|----------------|
| Current | 90 |
| After S1 (exclude admin, GTM verify) | 92 |
| After S2 (event bridge) | 94 |
| After S3 (reporting + GSC) | 96 |

---

## Implementation priority

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | Exclude admin/datadekh from tracker | 0.5 day | High |
| 2 | Verify GTM/GA4 production config | 0.5 day | High |
| 3 | Bridge trackEvent → Supabase | 2 days | High |
| 4 | Download click events | 1 day | Medium |
| 5 | Campaign report tab | 2 days | Medium |
| 6 | Audit log admin UI | 2 days | Medium |
| 7 | GSC setup + sitemap submit | 1 day | High |
| 8 | CSV export analytics | 1 day | Low |
