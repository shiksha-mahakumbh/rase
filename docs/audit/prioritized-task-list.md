# Prioritized Task List — Audit Findings

**Total findings:** 47  
**Legend:** Effort = S/M/L | Deps = dependency IDs

---

## P0 — Critical (6 tasks)

| # | Audit ID | Task | Category | Effort | Deps | Blockers |
|---|----------|------|----------|--------|------|----------|
| P0-1 | 6.1, 7.1, 11.1 | Add payment/fee/PAN verification to `/api/v2/registration/submit` | Security | M | — | — |
| P0-2 | 6.2 | Server-side bucket mapping on `/api/v2/registration/upload` | Security | S | — | — |
| P0-3 | 6.3a | Install DOMPurify; create `sanitize-html.ts` + `SafeHtml` | Security | M | — | npm install |
| P0-4 | 6.3b | Apply SafeHtml to all CMS content components | Security | M | P0-3 | — |
| P0-5 | 6.3c | Add Content-Security-Policy header in `next.config.js` | Security | M | P0-4 | Preview test Razorpay/GTM |
| P0-6 | 5.1 | Performance baseline (document + defer heavy LCP work to P1) | Performance | L | P0-1..5 | Full LCP fix is multi-sprint |

---

## P1 — High (14 tasks)

| # | Audit ID | Task | Category | Effort | Deps |
|---|----------|------|----------|--------|------|
| P1-1 | 4.1 | Emit hreflang on introduction, registration, locale contact | SEO | S | — |
| P1-2 | 4.2 | Fix homepage SEO score (single canonical title/description) | SEO | M | — |
| P1-3 | 3.1 | Dynamic `html lang` per locale | Accessibility | S | — |
| P1-4 | 3.2 | `#main-content` on all page shells | Accessibility | S | — |
| P1-5 | 8.1 | Gate first-party visitor analytics behind consent | Infrastructure | M | P1-14 |
| P1-6 | 8.2 | Google Consent Mode v2; gate AdSense | Infrastructure | M | P1-14 |
| P1-7 | 14.1 | Update privacy policy (analytics, retention, processors) | Content | M | Legal review |
| P1-8 | 1.4 | Newsletter consent checkbox + unsubscribe flow | Content | M | P1-7 |
| P1-9 | 6.4 | ADMIN_OPS_SECRET rotation policy + session-only admin API | Security | M | P0-1 |
| P1-10 | 6.5 | Configure Upstash Redis for distributed rate limits | Security | S | — |
| P1-11 | 6.7 | npm audit fix (42 vulnerabilities) | Security | M | — |
| P1-12 | 9.1 | Wire Sentry (`@sentry/nextjs`) | Infrastructure | M | — |
| P1-13 | 13.1 | GitHub Actions CI (lint, typecheck, test, build) | Infrastructure | M | — |
| P1-14 | 5.1, 5.2 | Performance sprint: OptimizedImage, script deferral, cache | Performance | L | P0 complete |

---

## P2 — Medium (18 tasks)

| # | Audit ID | Task | Category | Effort |
|---|----------|------|----------|--------|
| P2-1 | 1.1 | Hindi body content OR remove Hindi from sitemap | Content | L |
| P2-2 | 1.2 | Create public `/faq` page | Content | M |
| P2-3 | 2.1 | Add `loading.tsx` for top CMS routes | UX | M |
| P2-4 | 2.2 | Replace legacy NavBar on error.tsx | UX | S |
| P2-5 | 2.3 | Server-side footer CMS data (no client fetch) | UX | M |
| P2-6 | 3.3 | Marquee pause button | Accessibility | S |
| P2-7 | 3.4 | Visible labels on footer contact form | Accessibility | S |
| P2-8 | 4.3 | OG locale `hi_IN` for Hindi pages | SEO | S |
| P2-9 | 4.4 | Sitemap `lastModified` from CMS; fix hash URLs | SEO | M |
| P2-10 | 6.6 | Enforce reCAPTCHA hostname rejection; email resend secret | Security | S |
| P2-11 | 6.8 | Participant dashboard requires lookup token | Security | S |
| P2-12 | 7.2 | reCAPTCHA on feedback form | UX | S |
| P2-13 | 8.3 | Visitor analytics retention cron (>12 months) | Infrastructure | M |
| P2-14 | 10.1 | Automated backup restore drill script | Infrastructure | M |
| P2-15 | 12.2 | Consolidate Hindi routing to single `[locale]` pattern | Infrastructure | M |
| P2-16 | 14.2 | Cookie preference center (withdraw consent) | Content | M |
| P2-17 | 15.2 | Share + calendar CTAs on registration success | UX | S |
| P2-18 | 5.4 | CI typecheck/lint (remove SKIP_NEXT_STATIC_CHECKS in CI) | Infrastructure | S |

---

## P3 — Low (15 tasks)

| # | Audit ID | Task | Category | Effort |
|---|----------|------|----------|--------|
| P3-1 | 1.3 | Remove orphan `metadata.tsx` | Content | S |
| P3-2 | 1.5 | Social share on registration success | Content | S |
| P3-3 | 1.6 | Remove or noindex unused fr/es/ar locales | Content | S |
| P3-4 | 2.4 | Cookie banner timing on homepage | UX | S |
| P3-5 | 2.5 | Nav dropdown `<button>` semantics | UX | S |
| P3-6 | 3.5 | Fix Topics duplicate h1; admin 44px targets | Accessibility | S |
| P3-7 | 4.5 | Standardize OG images to 1200×630 | SEO | S |
| P3-8 | 4.6 | Consolidate contact JSON-LD blocks | SEO | S |
| P3-9 | 5.3 | Dynamic import admin recharts | Performance | S |
| P3-10 | 5.5 | DynamicFooter on not-found.tsx | Performance | S |
| P3-11 | 6.9 | Virus scan hook; remove Feedback eval() | Security | M |
| P3-12 | 8.4 | Server-sync funnel milestones | Infrastructure | M |
| P3-13 | 9.3 | Alert on audit log write failure | Infrastructure | M |
| P3-14 | 11.2 | Slug-based SEO API endpoint | Infrastructure | S |
| P3-15 | 16.1–16.3 | Entity directories, knowledge graph export, ScholarlyArticle schema | SEO | L |

---

## Dependency & Blocker Summary

### Critical path
```
P0-1 → P0-2 → P0-3 → P0-4 → P0-5 → (deploy) → P1-14 (performance)
```

### External blockers
| Blocker | Affects | Resolution |
|---------|---------|------------|
| Legal review | P1-7, P1-8, P1-5 disclosure | Schedule DHE legal counsel |
| Upstash credentials | P1-10 | Add env vars in Vercel |
| Hindi translation content | P2-1 | Content team or route removal |
| Lighthouse 95 target | P1-14 | Multi-sprint; not achievable in P0 alone |

### Parallelizable (after P0)
- P1-1, P1-3, P1-4 (SEO/a11y quick wins)
- P1-11 (npm audit)
- P1-13 (CI workflow)

---

## Sprint Assignment

| Sprint | Tasks | Duration |
|--------|-------|----------|
| **Current (P0)** | P0-1 through P0-5 | 1 week |
| **Sprint 2 (P1)** | P1-1 through P1-13 | 2 weeks |
| **Sprint 3 (P1 perf)** | P1-14 | 2 weeks |
| **Sprint 4–5 (P2)** | P2-1 through P2-18 | 4 weeks |
| **Sprint 6+ (P3)** | P3-* as capacity allows | Ongoing |

---

*Last updated: 29 May 2026*
