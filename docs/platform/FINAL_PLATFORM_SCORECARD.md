# Final Platform Scorecard

**Date:** May 2026  
**Audit type:** Pre-production deep audit (read-only)  
**Phase:** Post Phase C — no new features

---

## Score summary

| Pillar | Current | Target | Max achievable | Gap |
|--------|--------:|-------:|---------------:|----:|
| **Production Readiness** | **78** | 94 | **96** | −16 |
| **SEO** | **86** | 97 | **96** | −11 |
| **Accessibility** | **82** | 95 | **96** | −13 |
| **Mobile** | **84** | 95 | **96** | −11 |
| **Security** | **68** | No critical | **93** | −25 |
| **Performance** | **78** | 95 | **95** | −17 |
| **Global Reach** | **64** | 95 | **93** | −31 |
| **Admin Manageability** | **92%** | 99% | **97%** | −7% |

### Weighted overall platform score: **79 / 100**

*Weights: Security 18%, Admin 15%, SEO 12%, Performance 10%, Accessibility 10%, Mobile 10%, Global Reach 10%, Production 15%*

---

## Pillar detail

### Production Readiness — 78 / 100

| Strength | Weakness |
|----------|----------|
| TypeScript compiles; Prisma valid | 3 critical security blockers |
| 22 CMS admin modules operational | CMS content not published to production |
| Fallback strategy on all CMS routes | Pending DB migration |
| Registration flow functional (Firebase) | `verify-env` incomplete |
| Comprehensive documentation | No staging smoke test evidence |

**Max achievable: 96** (after security fixes + content publish + migration)

---

### SEO — 86 / 100

| Strength | Weakness |
|----------|----------|
| ~150 routes with metadata | `/keynotespeakers` duplicate |
| Rich JSON-LD on home, pillars, CMS entities | `/events` hub weak meta |
| Sitemap + CMS merge | `/speakers`, `/partners` missing from sitemap |
| BreadcrumbList widespread | 6 routes with no metadata |
| CMS SEO admin engine | hreflang on 4 paths only |

**Max achievable: 96** (Phase D not required for 96)

---

### Accessibility — 82 / 100

| Strength | Weakness |
|----------|----------|
| Skip link, landmarks, reduced motion global | AdminButton 36px (below 44px) |
| Modal dialog pattern | Marquees without reduced motion |
| FAQ accordion ARIA | Feedback form error association |
| Modern pages keyboard accessible | Legacy registration forms inconsistent |

**Max achievable: 96**

---

### Mobile — 84 / 100

| Strength | Weakness |
|----------|----------|
| NavBar drawer, responsive grids | Admin CMS tables scroll-only on mobile |
| Dual table/card layouts (registration) | Proceedings tables overflow |
| LazySection anti-CLS | Partner marquee touch targets |
| 44px on public CTAs | Global overflow-x hidden clipping |

**Max achievable: 96**

---

### Security — 68 / 100

| Strength | Weakness |
|----------|----------|
| Admin gateway + Firebase auth | **PII enumeration via registration ID** |
| Ops secret server-only | **Forgeable admin session cookie** |
| All v2 admin routes guarded | **Firebase rules uncertainty** |
| Razorpay webhook HMAC | Unauthenticated multi-bucket upload |
| Audit logging on CMS mutations | In-memory rate limits on Vercel |

**Max achievable: 93** (after P0/P1 fixes; 95+ needs CSP + distributed rate limits)

---

### Performance — 78 / 100

| Strength | Weakness |
|----------|----------|
| Homepage dynamic imports + LazySection | PublicPageShell eager NavBar on 49+ routes |
| RSC on CMS pages | No API Cache-Control on most v2 GETs |
| next/image on modern pages | Supabase not in remotePatterns |
| ISR on noticeboard/downloads | Registration client-heavy bundles |

**Max achievable: 95**

---

### Global Reach — 64 / 100

| Strength | Weakness |
|----------|----------|
| CMS ContentLocale on all organizational entities | Only 4 Hindi URL pairs |
| hi.json scaffold | 95%+ routes English-only |
| Language switcher (en/hi) | `html lang` fixed en-IN |
| Seed scripts with hi content | Loaders default to en locale |

**Max achievable: 93** (full knowledge-graph hi translation is Phase D scope)

---

### Admin Manageability — 92%

| Strength | Weakness |
|----------|----------|
| 22 CMS modules | 47 hardcoded marketing routes |
| Phase C organizational CMS complete | Knowledge graph (27 routes) |
| Fallback pattern preserves uptime | Proceedings, past editions hardcoded |
| EntityRevision + audit on mutations | Contact not wired to Settings |

**Max achievable: 97%** (99% requires Phase D pillars + proceedings)

---

## Remaining work

| # | Work item | Pillar | Priority | Est. time |
|---|-----------|--------|----------|-----------|
| 1 | Auth-protect registration lookup APIs | Security | **P0** | 1 day |
| 2 | Fix forgeable cookie on data viewer pages | Security | **P0** | 1 day |
| 3 | Deploy strict Firebase rules | Security | **P0** | 4h |
| 4 | Run Prisma migration + publish CMS seeds | Production | **P0** | 1 day |
| 5 | Lock down registration upload route | Security | P1 | 2 days |
| 6 | Apply Supabase RLS + storage policies | Security | P1 | 2 days |
| 7 | 301 `/keynotespeakers` → `/speakers` | SEO | P1 | 2h |
| 8 | Fix `/events` hub metadata | SEO | P1 | 1h |
| 9 | Extend sitemap (speakers, partners, hi) | SEO | P1 | 2h |
| 10 | Distributed rate limiting | Security/Perf | P1 | 2 days |
| 11 | API Cache-Control headers | Performance | P1 | 4h |
| 12 | Wire contact to Settings CMS | Admin | P1 | 2h |
| 13 | Bulk-import committee/press legacy | Admin/Content | P1 | 1 week |
| 14 | Locale-aware CMS loaders | Global | P2 | 3 days |
| 15 | AdminButton 44px + focus-visible | A11y/Mobile | P2 | 1 day |
| 16 | Marquee reduced motion | A11y | P2 | 2h |
| 17 | Past editions → Events CMS | Admin | P2 | 1 week |
| 18 | Extend verify-env | DevOps | P2 | 4h |
| 19 | Knowledge graph CMS (Phase D) | Admin | P3 | 2–3 weeks |
| 20 | Proceedings CMS (Phase D) | Admin | P3 | 1 week |

**Total P0 effort:** ~3–4 days  
**Total P0+P1 effort:** ~2–3 weeks  
**Total to max achievable scores:** ~6–8 weeks

---

## Priority ranking

| Rank | Action | Impact | Blocks launch |
|------|--------|--------|---------------|
| 1 | Fix registration PII exposure (C1) | Security | **YES** |
| 2 | Fix forgeable cookie (C2) | Security | **YES** |
| 3 | Deploy strict Firebase rules (C3) | Security | **YES** |
| 4 | Migration + CMS content publish | Production | **YES** |
| 5 | Upload route hardening (H3) | Security | Recommended |
| 6 | Supabase RLS deploy (H5) | Security | Recommended |
| 7 | SEO duplicate route cleanup | SEO | No |
| 8 | Performance caching | Performance | No |
| 9 | Hindi locale wiring | Global reach | No |
| 10 | Knowledge graph CMS | Admin | No (Phase D) |

---

## Score trajectory

| Milestone | Overall | Security | SEO | Global |
|-----------|--------:|---------:|----:|-------:|
| Current (post Phase C) | 79 | 68 | 86 | 64 |
| After P0 fixes | 86 | 85 | 86 | 64 |
| After P0+P1 (2–3 weeks) | 91 | 90 | 93 | 72 |
| Max achievable (6–8 weeks) | 94 | 93 | 96 | 93 |
| With Phase D | 96+ | 93 | 96 | 95 |
