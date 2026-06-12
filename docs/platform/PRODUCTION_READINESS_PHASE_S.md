# Production Readiness — Phase S Baseline

**Date:** May 2026  
**Phase:** S (Stabilization & Global Readiness) — planning only  
**Registration:** `REGISTRATION_BACKEND=firebase` (unchanged)  
**Deployment:** Paused per Phase S mandate

---

## Score summary

| Pillar | Current | S-Target | Gap | Priority |
|--------|--------:|---------:|----:|----------|
| **SEO** | 88 | 95 | −7 | High |
| **Accessibility** | 92 | 95 | −3 | Medium |
| **Mobile** | 91 | 95 | −4 | Medium |
| **Security** | 88 | 92 | −4 | Medium |
| **Performance** | 89 | 93 | −4 | Medium |
| **Analytics** | 90 | 95 | −5 | High |
| **Global Reach** | 58 | 80 | −22 | Critical |
| **Admin Manageability** | 78 | 90 | −12 | Critical |
| **Platform content** | 72 | 90 | −18 | Critical |
| **Overall** | **84** | **92** | **−8** | — |

---

## Overall score

### Current: **84 / 100** (Grade B+)

| Pillar | Weight | Score | Weighted |
|--------|-------:|------:|---------:|
| SEO | 12% | 88 | 10.56 |
| Accessibility | 10% | 92 | 9.20 |
| Performance | 10% | 89 | 8.90 |
| Mobile | 10% | 91 | 9.10 |
| Security | 12% | 88 | 10.56 |
| Admin manageability | 18% | 78 | 14.04 |
| Analytics | 13% | 90 | 11.70 |
| Global reach | 8% | 58 | 4.64 |
| Platform content | 7% | 72 | 5.04 |
| **Total** | 100% | — | **83.74 → 84** |

### S-Target: **92 / 100** (Grade A-)

| Pillar | Weight | Target | Weighted |
|--------|-------:|-------:|---------:|
| SEO | 12% | 95 | 11.40 |
| Accessibility | 10% | 95 | 9.50 |
| Performance | 10% | 93 | 9.30 |
| Mobile | 10% | 95 | 9.50 |
| Security | 12% | 92 | 11.04 |
| Admin manageability | 18% | 90 | 16.20 |
| Analytics | 13% | 95 | 12.35 |
| Global reach | 8% | 80 | 6.40 |
| Platform content | 7% | 90 | 6.30 |
| **Total** | 100% | — | **91.99 → 92** |

### Estimated final (post S4 + Phase C): **96 / 100** (Grade A)

---

## Gap analysis by pillar

### SEO (−7)

| Gap | Fix | Phase |
|-----|-----|-------|
| Only homepage has CMS metadata | generateMetadata for noticeboard/downloads | S1 |
| ~60% routes missing BreadcrumbList | PublicPageShell JSON-LD | S1 |
| No WebSite/SearchAction | Root layout | S1 |
| Press/committee missing Person/Article schema | Content migration | S2–S3 |
| No hreflang | en/hi pairs | S1 |

### Accessibility (−3)

| Gap | Fix | Phase |
|-----|-----|-------|
| Modal focus trap | ClientChrome | S1 |
| Nav CTA touch target | NavBar | S1 |
| Committee alt text | Committee migration | S3 |
| Form error linking | Feedback page | S2 |

### Mobile (−4)

| Gap | Fix | Phase |
|-----|-----|-------|
| ~40 legacy `<img>` | next/image migration | S1–S3 |
| Press client bundles | CMS migration | S2 |
| proceeding2 bundle | CMS migration | S3 |
| INP on registration | Touch target audit | S2 |

### Security (−4)

| Gap | Fix | Phase |
|-----|-----|-------|
| RLS not verified in prod | Policy apply checklist | S1 deploy |
| Upload MIME partial | Whitelist extension | S1 |
| Admin routes in analytics | Tracker exclude | S1 |
| Feedback no captcha | reCAPTCHA | S2 |

### Performance (−4)

| Gap | Fix | Phase |
|-----|-----|-------|
| Legacy images | next/image | S1–S3 |
| Client press pages | RSC migration | S2 |
| No homepage revalidate | ISR 60s | S2 |
| proceeding2 bundle | CMS page | S3 |

### Analytics (−5)

| Gap | Fix | Phase |
|-----|-----|-------|
| GTM/Supabase split | Event bridge | S2 |
| Admin noise in top pages | Tracker exclude | S1 |
| No campaign report | Dashboard tab | S3 |
| Download click events | Downloads page | S2 |
| GSC not configured | Setup + sitemap | S1 |

### Global Reach (−22) — largest gap

| Gap | Fix | Phase |
|-----|-----|-------|
| Hindi homepage no CMS | CmsProvider + seed | S1 |
| 4 locale routes only | Expand locale routes | S2 |
| No hreflang | en-IN/hi-IN tags | S1 |
| Admin English only | Locale tabs | S1 |
| No Hindi content seed | seed:cms-hi | S1 |

### Admin Manageability (−12)

| Gap | Fix | Phase |
|-----|-----|-------|
| 55% hardcoded routes | CMS migration tiers 1–8 | S1–S4 |
| APIs without UI | Contact, feedback, committees, events | S1–S3 |
| JSON editors | Structured form components | S2 |
| No pages create UI | Admin pages create | S1 |

---

## Implementation priority matrix

### P0 — Before any deployment

| # | Task | Pillar | Effort |
|---|------|--------|--------|
| 1 | Apply analytics migration + DATABASE_URL | Analytics | Deploy |
| 2 | Visitor counter live verification | Analytics | 1 day |
| 3 | RLS policy verification checklist | Security | 1 day |

### P1 — S1 Quick wins (weeks 1–2)

| # | Task | Pillar | Effort |
|---|------|--------|--------|
| 1 | `/[locale]` CmsProvider + Hindi seed | Global, Admin | 2 days |
| 2 | BreadcrumbList on PublicPageShell | SEO | 2 days |
| 3 | CMS SEO metadata noticeboard/downloads | SEO | 1 day |
| 4 | Exclude admin from tracker | Analytics | 0.5 day |
| 5 | Modal focus trap | A11y | 1 day |
| 6 | Nav CTA touch target | Mobile, A11y | 0.5 day |
| 7 | Legal pages → CMS (5) | Admin | 3 days |
| 8 | Pages create UI | Admin | 2 days |
| 9 | Contact/feedback inbox UI | Admin | 3 days |
| 10 | hreflang en/hi homepage | SEO, Global | 1 day |

### P2 — S2 Content migration (weeks 3–8)

| # | Task | Pillar | Effort |
|---|------|--------|--------|
| 1 | Press articles → CMS (9) | Admin, SEO, Mobile | 8 days |
| 2 | Gallery + media center wire | Admin | 5 days |
| 3 | FAQ module | Admin | 3 days |
| 4 | Event bridge analytics | Analytics | 2 days |
| 5 | SEO embed in entity editors | SEO, Admin | 3 days |
| 6 | Department pages → CMS (5) | Admin | 5 days |
| 7 | Top 10 img → next/image | Mobile, Perf | 2 days |

### P3 — S3 Phase C modules (weeks 7–12)

| # | Task | Pillar | Effort |
|---|------|--------|--------|
| 1 | Committees admin UI | Admin | 8 days |
| 2 | Events admin UI | Admin | 5 days |
| 3 | Speakers API + admin | Admin | 5 days |
| 4 | Person/Event JSON-LD | SEO | 3 days |
| 5 | Hindi content expansion | Global | 5 days |

### P4 — S4 Knowledge & proceedings (weeks 12–18)

| # | Task | Pillar | Effort |
|---|------|--------|--------|
| 1 | Proceedings → CMS/downloads | Admin, Perf | 8 days |
| 2 | Knowledge graph → pages (28) | Admin | 15 days |
| 3 | Future locale enum extension | Global | 2 days |

---

## Phase S success criteria

| # | Criterion | Target |
|---|-----------|--------|
| 1 | Overall production score | ≥ 92/100 |
| 2 | Admin manageability | ≥ 90/100 |
| 3 | Global reach | ≥ 80/100 |
| 4 | SEO score | ≥ 95/100 |
| 5 | Visitor counter verified live | ✅ |
| 6 | Hindi homepage functional | ✅ |
| 7 | Zero hardcoded press articles | ✅ |
| 8 | Firebase registration untouched | ✅ |
| 9 | Manual staging QA sign-off | ✅ |
| 10 | Phase C approval received | ✅ |

---

## Related documents

| Task | Document |
|------|----------|
| 1 Re-audit public | [REAUDIT_PUBLIC_SITE.md](./REAUDIT_PUBLIC_SITE.md) |
| 1 Re-audit admin | [REAUDIT_ADMIN_PLATFORM.md](./REAUDIT_ADMIN_PLATFORM.md) |
| 1 Re-audit backend | [REAUDIT_BACKEND.md](./REAUDIT_BACKEND.md) |
| 2 Admin 90% plan | [ADMIN_MANAGEABILITY_90_PLAN.md](./ADMIN_MANAGEABILITY_90_PLAN.md) |
| 3 SEO 95 plan | [SEO_95_PLAN.md](./SEO_95_PLAN.md) |
| 4 Global reach | [GLOBAL_REACH_PLAN.md](./GLOBAL_REACH_PLAN.md) |
| 5 Mobile 95 | [MOBILE_95_PLAN.md](./MOBILE_95_PLAN.md) |
| 6 Accessibility 95 | [ACCESSIBILITY_95_PLAN.md](./ACCESSIBILITY_95_PLAN.md) |
| 7 Analytics | [ANALYTICS_MASTER_PLAN.md](./ANALYTICS_MASTER_PLAN.md) |
| 8 CMS expansion | [CMS_EXPANSION_FINAL.md](./CMS_EXPANSION_FINAL.md) |

**Status: PHASE S PLANNING COMPLETE — AWAITING APPROVAL**
