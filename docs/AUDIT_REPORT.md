# Shiksha Mahakumbh — Master Audit Report

**Date:** 2026  
**Stack:** Next.js 15.0.7 · TypeScript · Tailwind · Firebase · Firestore · Storage  
**Scale target:** 100,000+ registrations  

## Executive Summary

| Dimension | Score | Status |
|-----------|------:|--------|
| Architecture | 42/100 | Dual registration stacks |
| Security | 28/100 | **Critical** — open `*datadekh*` routes |
| New registration (`/registration`) | 68/100 | Production-capable with rules |
| SEO | 55/100 | Partial meta; no sitemap/robots (fixed in this pass) |
| Performance | 48/100 | Large bundles, full collection reads in admin |
| Mobile | 62/100 | Home redesigned; tables remain on legacy pages |
| **Overall readiness** | **47/100** | Not launch-ready at scale without P1 security |

---

## Phase 1 — Project Audit

### Current Structure (abbreviated)

```
src/app/          → 107 routes, ~120 legacy components
src/components/   → 11 files (new registration + admin)
src/lib/          → registration pipeline, admin auth
src/types/        → registration.ts
```

### Problems Found

1. **40+ Firestore collections** — legacy + new (`Regestration*` typos, duplicate SM24)
2. **16 legacy registration components** still active via `/abstract`, project forms
3. **12 pages call missing `/api/sendMail`**
4. **No `middleware.ts`** — no route protection
5. **No `firestore.rules` in repo**
6. **`firebase1.ts` dead** — second project
7. **Unused deps:** express, sequelize, bcrypt, jwt, react-router-dom
8. **29 files >500 lines** — `AcademicCouncil24.tsx` = 2592 lines
9. **Admin `getDocs` entire collection** — O(n) reads
10. **Hardcoded Firebase keys** in source

### Recommended Structure

See `src/constants/`, `src/config/`, `src/services/` (foundation added). Full migration to `modules/` is Phase 2–3 months.

### Migration Plan

| Week | Action |
|------|--------|
| 1 | Security rules + middleware + protect datadekh |
| 2 | Admin pagination + email service + env Firebase |
| 3–4 | ETL legacy → `registrations` |
| 5–8 | UI/UX + SEO + i18n foundation |
| 9–12 | Certificates, payments webhook, reviewer roles |

---

## Phase 3–17 Summary

Detailed in prior audit conversation. Key implementations in this codebase pass:

- `src/middleware.ts` — protect sensitive data routes
- `src/app/robots.ts`, `sitemap.ts`
- Legal pages (AdSense)
- `CookieConsent`
- Security headers in `next.config.js`
- Admin pagination helper
- Email API optional secret
- `firebase/firestore.rules` template

---

## Master Action Plan

### P1 Critical
1. Deploy Firestore/Storage rules from `firebase/`
2. Rotate SMTP + restrict admin emails server-side
3. Remove public access to `*datadekh*`
4. Enable Firebase env vars in Vercel

### P2 High
5. Paginate admin (implemented helper)
6. Razorpay webhooks
7. reCAPTCHA on `/registration`
8. Firebase Admin for API routes

### P3 Medium
9. next-intl (5 languages)
10. Certificate + QR verify portal
11. Split monolith components

### P4 Low
12. Remove unused npm packages
13. Full folder restructure per enterprise tree

---

## Errors Fixed (Phase 16 — this pass)

| Issue | Fix |
|-------|-----|
| No robots/sitemap | Added `robots.ts`, `sitemap.ts` |
| No legal pages | Added privacy, terms, disclaimer, refund |
| Open data export routes | Middleware → `/admin` |
| Dead microphone code | Removed from layout |
| Admin full scan | `fetchRegistrationsPage` with limit |
| Email API open | Optional `REGISTRATION_EMAIL_SECRET` |

---

*Generated as living document — update after each sprint.*
