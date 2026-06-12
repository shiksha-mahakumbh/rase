# Analytics Audit — Post B.7 Platform Review

**Date:** May 2026  
**Current analytics score:** 88/100 (post visitor-counter fix)

---

## Analytics systems (dual stack)

| System | Purpose | Storage | Admin UI |
|--------|---------|---------|----------|
| **Supabase visitor analytics** | Page views, sessions, geo, top pages | `visitor_*` tables | `/admin/cms/analytics` |
| **Firebase + GTM funnel** | Registration, brochure, search | localStorage + dataLayer | `/admin` growth panel |
| **Audit logs** | CMS admin mutations | `audit_logs` | API only |

---

## Page view tracking matrix

| Page / area | `VisitorPageTracker` | Footer counter POST | Score |
|-------------|---------------------|---------------------|------:|
| Homepage `/` | ✅ | ✅ | 95 |
| Noticeboard | ✅ | ✅ | 95 |
| Downloads | ✅ | ✅ | 95 |
| Registration | ✅ | ✅ | 90 |
| Contact | ✅ | ✅ | 85 |
| Feedback | ✅ | ✅ | 85 |
| Press articles | ✅ | ✅ | 85 |
| Committees | ✅ | ✅ | 85 |
| Knowledge graph | ✅ | ✅ | 85 |
| Admin `/admin/*` | ⚠️ Tracked (noise) | ⚠️ | 60 |
| Datadekh (noindex) | ⚠️ Tracked | ⚠️ | 50 |

**Gap:** Exclude `/admin/*` and `/datadekh/*` from `VisitorPageTracker` to reduce noise in top pages.

---

## Event tracking matrix

| Event | Trigger | GTM/gtag | Supabase `visitor_events` | Admin visible |
|-------|---------|----------|---------------------------|---------------|
| `registration_started` | RegistrationHub | ✅ consent-gated | ❌ | Firebase admin + local funnel |
| `registration_completed` | useRegistrationSubmit | ✅ | ❌ | Firebase admin |
| `brochure_download` | `BrochureDownloadLink` | ✅ | ❌ | Admin growth panel (local) |
| `knowledge_hub_view` | ContentHubClient | ✅ | ❌ | local funnel only |
| `global_search` | GlobalSearch | ✅ | ❌ | local funnel only |
| `accommodation_requested` | Registration | ✅ | ❌ | local funnel |
| Contact form submit | — | ❌ | ❌ | API stores message |
| Feedback submit | — | ❌ | ❌ | API stores feedback |
| CMS download click | Downloads page | ❌ | ❌ | Download count in CMS only |
| Admin CMS save | — | ❌ | ✅ audit_logs | Audit API |

---

## API endpoints verified

| Endpoint | Method | Rate limit | Status |
|----------|--------|------------|--------|
| `/api/v2/analytics/track` | POST | 120/min/IP | ✅ Working |
| `/api/v2/analytics/stats` | GET | — | ✅ Public stats |
| `/api/visitors` | GET/POST | — | ✅ Fixed (no CDN cache) |
| `/api/v2/admin/analytics/dashboard` | GET | Admin | ✅ Widgets + charts |
| `/api/v2/admin/analytics/pages` | GET | Admin | ✅ Top pages |
| `/api/v2/admin/analytics/visitors` | GET | Admin | ✅ Visitor list |

---

## Visitor counter fix verification

| Check | Status |
|-------|--------|
| Session created on first visit | ✅ `trackVisit` creates `visitor_session` |
| Page view stored | ✅ `visitor_page_views` insert |
| Daily rollup increments | ✅ Fixed RC-1 + RC-2 |
| Active users (15 min window) | ✅ `ACTIVE_WINDOW_MS` query |
| Display total = legacy + unique | ✅ `LEGACY_VISITOR_OFFSET` |
| Dashboard updates | ✅ `invalidateStatsCache()` on track |
| Degraded mode UI | ✅ Footer shows warning when `source=fallback` |

**Deploy requirement:** `DATABASE_URL` + migration `20250622_phase_b5_analytics` must be applied or counter falls back to 94,567 legacy total.

---

## Gaps & recommendations

### High

1. **Bridge funnel events to Supabase** — call `trackEvent` server-side from registration/brochure handlers
2. **Exclude admin routes** from `VisitorPageTracker`
3. **Download click events** — fire `visitor_events` on CMS download button click

### Medium

4. Contact/feedback submit events (no PII in payload)
5. Gateway audit logging (who changed what CMS content)
6. Real-time active users widget refresh interval

### Low

7. Export analytics CSV from admin UI
8. UTM campaign report tab

---

## Analytics score breakdown

| Pillar | Score |
|--------|------:|
| Page view coverage | 92 |
| Visitor counter accuracy | 90 (post-fix; deploy-dependent) |
| Event funnel coverage | 75 |
| Admin dashboard | 90 |
| Cross-system integration | 70 |
| **Overall** | **88** |
