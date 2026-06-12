# Executive Go-Live Report

**Date:** May 2026  
**Platform:** Shiksha Mahakumbh (rase.co.in)  
**Audit type:** Final pre-production deep audit (read-only)  
**Prepared for:** Leadership approval before production deployment

---

## Can Shiksha Mahakumbh launch today?

# NO

The platform is **not ready for public production launch today**. The marketing site, CMS infrastructure, and registration flows are substantially complete after Phases A–C, but **three critical security vulnerabilities** and **unpublished production infrastructure** block a responsible go-live for an international education summit serving universities, government bodies, NGOs, researchers, teachers, students, and media organizations.

---

## Launch decision matrix

| Criterion | Status | Blocks launch? |
|-----------|--------|----------------|
| Public website functional | ✅ Yes | No |
| CMS admin operational (22 modules) | ✅ Yes | No |
| TypeScript / Prisma valid | ✅ Yes | No |
| Registration + Razorpay flows | ✅ Functional (Firebase) | No |
| Critical security issues | ❌ **3 found** | **YES** |
| Production DB migration applied | ❌ Not deployed | **YES** |
| CMS content published | ❌ Seeds not run on prod | **YES** |
| Firebase rules verified | ❌ Uncertain which ruleset deployed | **YES** |
| Supabase RLS applied | ❌ Manual policies not confirmed | Recommended |
| SEO / hreflang complete | ⚠️ 86/100 | No (soft) |
| Hindi global reach | ⚠️ 64/100 | No (soft) |

---

## Exact blockers (must fix before launch)

### Blocker 1 — Registration PII exposure (CRITICAL)

**What:** `GET /api/registration/[registrationId]` and `GET /api/v2/registration/[id]` return full participant PII (email, phone, institution, payment data, uploaded files) without authentication.

**Why it blocks launch:** Registration IDs follow predictable pattern `SMK2026-\d{6}` (~1 million enumerable). An attacker can harvest thousands of registrant records. This violates data protection expectations for an international summit with government and university participants.

**Fix:** Require authentication or email+ID verification; return minimal public fields only.  
**Effort:** 1 day  
**Owner:** Backend engineer

---

### Blocker 2 — Forgeable admin session cookie (CRITICAL)

**What:** Legacy data viewer pages (`*datadekh*`, `/schooldata`, `/AllData`, etc.) are protected only by client-set cookie `smk_admin_session=1` with no cryptographic signature.

**Why it blocks launch:** Anyone can set this cookie in browser DevTools and access Firebase registration export viewers containing bulk PII.

**Fix:** Enforce Firebase Auth in middleware for these routes, or retire pages and route through authenticated admin API.  
**Effort:** 1 day  
**Owner:** Full-stack engineer

---

### Blocker 3 — Firebase security rules uncertainty (CRITICAL)

**What:** Repository contains two Firestore rule sets. The `production-backup` version allows unauthenticated registration writes and catch-all admin access.

**Why it blocks launch:** If production Firebase project uses backup rules, client-side `addDoc` paths may allow unauthorized data writes.

**Fix:** Verify deployed rules in Firebase Console match strict `firebase/firestore.rules`; deploy if not.  
**Effort:** 4 hours  
**Owner:** DevOps / Firebase admin

---

### Blocker 4 — Production database not migrated (HIGH)

**What:** Phase C migration (`20250701_phase_c_organizational_cms`) and CMS seed content exist in repo but are not applied to production per project mandate.

**Why it blocks launch:** Organizational CMS (committees, speakers, partners, events, media center) will fall back to hardcoded legacy content on production.

**Fix:** Run `prisma migrate deploy` on production Supabase; run seed scripts with `--publish`.  
**Effort:** 1 day (including smoke test)  
**Owner:** DBA / DevOps

---

## Recommended improvements (do not block launch but strongly advised)

### Security (P1 — first week post-blocker-fix)

| Item | Risk |
|------|------|
| Lock down `/api/v2/registration/upload` (unauthenticated multi-bucket) | Storage abuse, malware hosting |
| Use distinct `ADMIN_OPS_SECRET` (not shared with email secret) | Admin API compromise |
| Apply Supabase RLS + storage policies in dashboard | Service role bypasses all RLS today |
| Set `REGISTRATION_EMAIL_REQUIRE_SECRET=true` | Email spam |
| Add distributed rate limiting (Upstash/Vercel KV) | In-memory limits ineffective on Vercel |
| Reduce Firebase signed URL TTL from 10 years | Long-lived document exposure |
| Add CSP header | XSS mitigation |
| Extend `verify-env.mjs` for all production vars | Deployment misconfiguration |

### SEO (P1 — first week)

| Item | Impact |
|------|--------|
| 301 `/keynotespeakers` → `/speakers` | Eliminate duplicate indexable content |
| Full metadata on `/events` hub | Social sharing + crawl quality |
| Add `/speakers`, `/partners`, `/hi/*` to sitemap | Discovery |
| noindex orphan form routes | Index pollution |
| Proper 1200×630 OG image | Social preview quality |

### Content (P1 — first week)

| Item | Impact |
|------|--------|
| Publish CMS seeds (S2 + Phase C) | Replace hardcoded fallbacks |
| Bulk-import 5 committee + 9 press legacy slugs | Admin manageability |
| Wire contact page to Settings CMS | Editable contact info |
| Consolidate `/glimpses` with media center | Duplicate content |

### Performance (P2 — second week)

| Item | Impact |
|------|--------|
| Cache-Control on public v2 GET APIs | TTFB reduction |
| Supabase in `images.remotePatterns` | Image optimization |
| LazySection on PublicPageShell routes | Bundle size |

### Global reach (P2 — weeks 2–4)

| Item | Impact |
|------|--------|
| Pass locale from i18n into CMS loaders | Hindi content actually renders |
| Extend hreflang beyond 4 pairs | International SEO |
| Fix `/hi/ContactUs` URL casing | Crawler consistency |
| Per-locale `html lang` attribute | Screen reader + SEO |

---

## What is ready today

| Area | Assessment |
|------|------------|
| **CMS platform** | 22 admin modules; Phase C organizational CMS complete |
| **Public marketing site** | ~150 routes with metadata; rich JSON-LD on key pages |
| **Registration** | Firebase flow functional; Razorpay integrated; reCAPTCHA in production |
| **Admin CMS auth** | Firebase → gateway → ops secret — strong pattern |
| **Accessibility baseline** | Skip link, landmarks, modal patterns, WCAG-oriented modern pages |
| **Mobile baseline** | Responsive layouts, 44px public CTAs, drawer navigation |
| **Documentation** | Comprehensive platform docs including this audit suite |
| **Fallback strategy** | CMS-first with hardcoded fallback ensures zero downtime during content migration |

---

## Platform scores (current)

| Pillar | Score |
|--------|------:|
| Production Readiness | 78 |
| SEO | 86 |
| Accessibility | 82 |
| Mobile | 84 |
| Security | 68 |
| Performance | 78 |
| Global Reach | 64 |
| Admin Manageability | 92% |
| **Overall** | **79** |

---

## Path to launch

```
Today ──────────────────────────────────────────────────────────► Launch-ready
         │                    │                    │
         P0 blockers          P1 hardening        Soft launch
         (3–4 days)           (2–3 weeks)         (optional)
         
         • PII API fix        • Upload lockdown   • Hindi content
         • Cookie fix         • RLS deploy        • Knowledge graph
         • Firebase rules     • SEO cleanup       • Proceedings CMS
         • DB migrate+seed    • Performance cache  (Phase D)
```

**Estimated time to launch-ready:** **3–4 days** for minimum viable launch (P0 only)  
**Estimated time to confident launch:** **2–3 weeks** (P0 + P1)  
**Estimated time to target scores (94+ overall):** **6–8 weeks**

---

## Recommendation

1. **Do not deploy to production today.**
2. Fix 3 critical security blockers immediately (3–4 days).
3. Apply database migration and publish CMS content on staging.
4. Run full smoke test on staging: registration, payment, admin CMS, public routes.
5. Conduct staging Lighthouse audit on top 10 routes.
6. Deploy to production with rollback plan documented in `FINAL_DEPLOYMENT_AUDIT.md`.
7. Schedule P1 improvements for first post-launch sprint.
8. **Do not start Phase D** until post-launch stabilization (2–4 weeks).

---

## Approval requested

This audit is complete. No code was changed. Awaiting leadership approval to:

- [ ] Authorize P0 security remediation sprint
- [ ] Authorize staging deployment + migration + seed
- [ ] Set target launch date after P0 completion
- [ ] Defer Phase D until post-launch stabilization

**STOP — Audit complete. Awaiting approval.**
