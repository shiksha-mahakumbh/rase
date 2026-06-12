# Production Readiness Score — Shiksha Mahakumbh 6.0

**Date:** June 2026 (Phase B.5 complete)  
**Production:** https://www.rase.co.in  
**Migration status:** Paused · `REGISTRATION_BACKEND=firebase`

---

## Overall score: **58/100**

| Pillar | Weight | Score | Weighted |
|--------|-------:|------:|---------:|
| Backend & CMS APIs | 20% | 78/100 | 15.6 |
| Frontend CMS wiring | 20% | 15/100 | 3.0 |
| SEO & discoverability | 15% | 62/100 | 9.3 |
| Mobile performance | 15% | 71/100 | 10.7 |
| Accessibility | 10% | 68/100 | 6.8 |
| Analytics & observability | 10% | 72/100 | 7.2 |
| Security & registration | 10% | 85/100 | 8.5 |
| **Total** | 100% | — | **58.1** |

**Grade: D+** — Strong backend foundation; frontend integration and content migration remain the primary blockers.

---

## Pillar details

### 1. Backend & CMS APIs — 78/100 ✅

| Item | Status |
|------|--------|
| Prisma schema (58 models) | ✅ |
| Phase A CMS (pages, SEO, media) | ✅ |
| Phase B content modules | ✅ |
| Phase B.5 analytics | ✅ |
| v2 admin APIs (80+ routes) | ✅ |
| RLS policies | ✅ Written, staging apply pending |
| Storage buckets | ⚠️ Requires Supabase provisioning |
| SMTP / Razorpay | ⚠️ Not verified on staging |

### 2. Frontend CMS wiring — 15/100 ❌

| Item | Status |
|------|--------|
| Homepage CMS consumption | ❌ |
| Noticeboard v2 API | ❌ |
| Downloads public page | ❌ |
| Settings/nav from API | ❌ |
| SEO from `seo_metadata` | ❌ |
| Visitor counter Supabase | ✅ Phase B.5 |
| Page view tracking | ✅ Phase B.5 |

### 3. SEO — 62/100 ⚠️

See [SEO_GLOBAL_AUDIT.md](./SEO_GLOBAL_AUDIT.md)

### 4. Mobile — 71/100 ⚠️

See [MOBILE_GLOBAL_AUDIT.md](./MOBILE_GLOBAL_AUDIT.md)

### 5. Accessibility — 68/100 ⚠️

See [ACCESSIBILITY_GLOBAL_AUDIT.md](./ACCESSIBILITY_GLOBAL_AUDIT.md)

### 6. Analytics — 72/100 ⚠️

| Item | Status |
|------|--------|
| Visitor intelligence tables | ✅ |
| Bot filtering | ✅ |
| Unique visitor counting | ✅ |
| Public counter (Supabase) | ✅ |
| Page view tracking | ✅ |
| Admin dashboard API | ✅ |
| Admin dashboard UI | ❌ |
| GA/GTM (consent-gated) | ✅ Separate |
| Registration funnel analytics | ⚠️ Partial |

### 7. Security & registration — 85/100 ✅

| Item | Status |
|------|--------|
| Firebase registration active | ✅ Unchanged |
| Rate limiting on APIs | ✅ |
| Admin secret guard | ✅ |
| RBAC schema | ✅ |
| No Firebase cutover | ✅ Per policy |

---

## Firebase cutover blockers

| Blocker | Status |
|---------|--------|
| Supabase backend operational | ⚠️ Staging pending |
| Notice Board migrated (frontend) | ❌ |
| Homepage CMS migrated (frontend) | ❌ |
| Downloads migrated (frontend) | ❌ |
| Committee data migrated | ❌ |
| Media Center migrated | ❌ |
| Admin dashboard migrated | ❌ |
| Storage buckets operational | ⚠️ |
| SMTP operational | ⚠️ |
| Razorpay operational | ⚠️ |
| Dual-write verification | ❌ |
| Visitor counter migrated | ✅ Phase B.5 |

**Cutover readiness: 1/12 items complete**

---

## Staging deployment checklist

- [ ] Apply migrations: `20250620_phase35`, `20250621_phase_b`, `20250622_phase_b5`
- [ ] Apply RLS: `cms.sql`, `phase_b.sql`, `analytics.sql`
- [ ] Provision Storage buckets: `media`, `downloads`
- [ ] Smoke-test `/api/visitors` (Supabase counts)
- [ ] Smoke-test `/api/v2/analytics/track`
- [ ] Smoke-test `/api/v2/admin/analytics/dashboard`
- [ ] Verify visitor counter on footer (3 metrics)
- [ ] Seed homepage + notices for wiring test

---

## Recommended next phase

### **Phase B.6 — Frontend Wiring Sprint** (not Phase C)

**Rationale:** Backend APIs for 10+ CMS modules exist but ~85% of public pages still read hardcoded/Firebase data. Wiring delivers user-visible value and resolves dual-source conflicts before adding Committee/Events complexity.

**Scope:**
1. Wire `/noticeboard` + homepage notice widget → `/api/v2/notices`
2. Wire homepage sections → `/api/v2/homepage`
3. Create `/downloads` page → `/api/v2/downloads`
4. Wire `NavBar` + footer → `/api/v2/menus` + `/api/v2/settings`
5. Wire `generateMetadata` on key routes → `/api/v2/seo`
6. Build admin analytics dashboard UI → `/api/v2/admin/analytics/dashboard`

**Do NOT start until approved:** Committee, Speakers, Partners, Events, Media Center (Phase C/D).

---

## Score trajectory

| Milestone | Projected score |
|-----------|----------------:|
| Current (B.5) | 58 |
| After B.6 frontend wiring | 72 |
| After Phase C backend | 78 |
| After Phase C UI + migration | 85 |
| After Firebase cutover | 92 |
