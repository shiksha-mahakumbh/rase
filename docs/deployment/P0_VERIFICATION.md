# P0 Verification Report

**Date:** 2026-06-11  
**Role:** Principal Release Manager + Production Deployment Engineer  
**Method:** Fresh re-verification — live HTTP probes, Vercel CLI, local scripts, source inspection  
**Prior reports:** Used as context only; all blockers re-tested

**Recommended canonical:** `https://www.shikshamahakumbh.com`

---

## Executive summary

| P0 Blocker | Status | Gate for GO |
|------------|--------|-------------|
| 1. Registration security (runtime) | **FAIL** | 401 on anonymous lookup |
| 2. Domain alignment (live SEO) | **FAIL** | Sitemap/canonical/robots on `.com` |
| 3. Firebase deployment | **FAIL** | Console-verified strict rules |
| 4. Vercel environment | **WARNING** | All required vars on all envs |
| 5. CMS seed status | **WARNING** | `notices > 0`, `downloads > 0` |

**Overall P0 verdict: NO GO** — 3 of 5 blockers fail; 2 warnings remain.

---

## 1. Registration security

### Source — PASS

| Control | File | Lines | Verified |
|---------|------|-------|:--------:|
| No token/email → 401 | `src/app/api/registration/[registrationId]/route.ts` | 51-56 | ✅ |
| Rate limit 10/min | `[registrationId]/route.ts` | 34-44 | ✅ |
| PII stripped from summary | `src/lib/security/registration-lookup.ts` | 78-87, 99-108 | ✅ |
| `email` / `contactNumber` excluded | `registration-lookup.ts` | 78-87 | ✅ |
| Admin HMAC session | `src/lib/security/admin-session.ts` | — | ✅ |
| Legacy cookie rejected | `src/middleware.ts` | 42-43 | ✅ |
| Automated source tests | `scripts/staging-security-check.mjs` | — | **9/9 PASS** (2026-06-11T10:03Z) |

### Production runtime — FAIL

**Probe (2026-06-11T10:03Z):**

```http
GET https://www.shikshamahakumbh.com/api/registration/SMK2026-000001
(no token, no email)
```

| Field | Expected | Actual |
|-------|----------|--------|
| HTTP status | **401** | **200** |
| `email` in body | absent | **present** (`release-verify+20260609@rase.co.in`) |
| `contactNumber` in body | absent | **present** (`9999999999999`) |

**Response snippet:**

```json
{"registrationId":"SMK2026-000001","registrationType":"Conclave","fullName":"Release Verify",
 "institution":"RASE QA","email":"release-verify+20260609@rase.co.in",
 "contactNumber":"9999999999","paymentStatus":"Not Required",...}
```

**Smoking gun:** Live response includes fields absent from `PublicRegistrationSummary` (L78-87). Production bundle predates P0 remediation.

**Alternate route check:**

| Route | Status | Notes |
|-------|--------|-------|
| `/api/v2/registration/SMK2026-000001` | **404** | v2 not deployed |
| `/api/v2/health` | **404** | v2 not deployed |

**P0-1 verdict: FAIL**

---

## 2. Domain alignment

### Traffic vs SEO

| Layer | Domain | Status |
|-------|--------|--------|
| HTTP traffic host | `www.shikshamahakumbh.com` | ✅ Serves 200 |
| Live sitemap `<loc>` | `https://www.rase.co.in` | ❌ |
| Live `robots.txt` Sitemap | `https://www.rase.co.in/sitemap.xml` | ❌ |
| Live homepage canonical | `https://www.rase.co.in` | ❌ |
| Live `og:url` | `https://www.rase.co.in` | ❌ |
| Live JSON-LD Organization `url` | `https://www.rase.co.in` | ❌ |

**Cause:** `NEXT_PUBLIC_SITE_URL` ineffective on live deploy → fallback in `src/config/site.ts` L2 and `src/app/layout.tsx` L28.

**Local env (gitignored, existence confirmed via prior audits):**

| File | Value | Align? |
|------|-------|:------:|
| `.env` L37 | `https://shikshamahakumbh.org` | ❌ |
| `.env.local` L21 | `https://shikshamahakumbh.org` | ❌ |
| `.env.example` L5 | `https://www.rase.co.in` | ❌ |

**P0-2 verdict: FAIL**

---

## 3. Firebase deployment status

### Source rules — PASS

| Rule | File | Lines | Anonymous |
|------|------|-------|-----------|
| `registrations` create denied | `firebase/firestore.rules` | 24 | **DENIED** |
| `registrations` read denied | `firebase/firestore.rules` | 25 | **DENIED** (admin only) |
| `registrations` write denied | `firebase/firestore.rules` | 25 | **DENIED** |
| Storage `registrations/**` write denied | `firebase/storage.rules` | 10-12 | **DENIED** |
| Catch-all anonymous denied | both rules files | 47-49 / 15-17 | **DENIED** |
| Backup rules excluded | `firebase.json` | 3, 7 | ✅ |

### Production deployment — UNVERIFIED

| Check | Result |
|-------|--------|
| Firebase Console rules match repo | **Not confirmed** |
| `firebase deploy --only firestore:rules,storage` executed | **Not confirmed** |
| Automated `firestore_rules_deny_create` test | **PASS** (source only) |

**Classification:** `UNVERIFIED_FIREBASE_DEPLOYMENT`

**P0-3 verdict: FAIL** (cannot approve GO without Console proof)

---

## 4. Vercel environment status

**Project:** `dhe-projects/rase-co-in`  
**Method:** `npx vercel env ls` (2026-06-11)

### Production

| Variable | Present | Status | Notes |
|----------|:-------:|--------|-------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | **WARNING** | Key exists (16h ago); live SEO unchanged — no redeploy |
| `DATABASE_URL` | ❌ | **FAIL** | Only `POSTGRES_PRISMA_URL` alias |
| `DIRECT_URL` | ❌ | **FAIL** | Only `POSTGRES_URL_NON_POOLING` alias |
| `ADMIN_OPS_SECRET` | ✅ | **PASS** | |
| `ADMIN_SESSION_SECRET` | ✅ | **PASS** | |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | **PASS** | |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | **PASS** | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | **PASS** | |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **PASS** | |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | **PASS** | |

### Preview — FAIL

Missing: all security secrets, Supabase public keys, `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `DIRECT_URL`, `RAZORPAY_WEBHOOK_SECRET`.

Present only: `POSTGRES_*` (3), `POSTGRES_PASSWORD`, `FIREBASE_SERVICE_ACCOUNT_JSON`.

### Development — WARNING

Security secrets present; missing `DATABASE_URL`, `DIRECT_URL`, Supabase public keys.

**Last production deploy:** ~2 days ago (`npx vercel ls`) — predates env var updates (~16h ago).

**P0-4 verdict: WARNING** (Production partial; Preview FAIL)

---

## 5. CMS seed status

**Method:** `node scripts/staging-db-check.mjs` (2026-06-11T10:03Z)

| Check | Result |
|-------|--------|
| DB connected | ✅ |
| Migrations applied | **7/7** |
| Tables present | **15/15** |
| `homepage` seed rows | 2 |
| `notices` | **0** |
| `downloads` | **0** |
| `committees` | 2 |
| `speakers` | 2 |
| `partners` | 3 |
| `events` | 2 |

**Required before GO:** `npm run seed:cms` (+ publish scripts per `PRODUCTION_REMEDIATION_PLAN.md`).

**P0-5 verdict: WARNING** (schema ready; content gaps on notices/downloads)

---

## P0 blocker summary

| # | Blocker | Status | Evidence |
|---|---------|--------|----------|
| 1 | Live PII exposure | **FAIL** | GET registration → 200 + email/phone |
| 2 | Domain/SEO split | **FAIL** | Live sitemap/canonical = `rase.co.in` |
| 3 | Firebase unverified | **FAIL** | No Console deploy proof |
| 4 | Env incomplete | **WARNING** | Preview FAIL; `DATABASE_URL` alias gap |
| 5 | CMS seeds partial | **WARNING** | notices=0, downloads=0 |

---

## GO gate checklist

| Criterion | Required | Met? |
|-----------|----------|:----:|
| Production registration lookup returns 401 | Yes | ❌ |
| Firebase rules verified deployed | Yes | ❌ |
| Canonical domain is `.com` on live SEO | Yes | ❌ |
| Environment complete (all envs) | Yes | ❌ |
| CMS notices/downloads seeded | Yes | ❌ |
| Source security controls | Yes | ✅ |
| Build passes | Yes | ✅ (prisma validate + tsc — 2026-06-11) |

**Cannot approve GO.**

---

**STOP — No deploy, commit, push, or production changes made in this verification.**
