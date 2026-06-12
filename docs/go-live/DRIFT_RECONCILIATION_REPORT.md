# Phase 1 — Drift Reconciliation Report

**Date:** 2026-05-29  
**Production deploy:** `dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` (2026-06-09 17:14:46 IST)  
**Git HEAD:** `5eea41b` — 2026-06-10 — "Updated notice board" (Firebase-era)  
**Verdict:** ❌ **Severe drift** — 151 modified/deleted + 90+ untracked files not deployed

---

## 1. Three-Way Comparison

| Layer | State | Backend |
|-------|-------|---------|
| **Production (live)** | Deploy 2026-06-09 | Firebase-era; open registration lookup |
| **Git HEAD** | `5eea41b` | Firebase Admin SDK registration |
| **Local working tree** | +151 files vs HEAD | Supabase/Prisma Firebase Exit complete |

---

## 2. Firebase Exit Files — Verified Present (Local)

| Category | Status | Path examples |
|----------|--------|---------------|
| Firebase removed | ✅ | `firebase.ts` deleted, `src/lib/firebase/*` deleted |
| Supabase auth | ✅ | `src/lib/supabase/`, `src/server/lib/supabase-admin-auth.ts` |
| Prisma services | ✅ | `src/server/services/registration.service.ts`, `payment.service.ts`, `storage.service.ts` |
| Security | ✅ | `src/lib/security/registration-lookup.ts`, `admin-session.ts` |
| Migration scripts | ✅ | `scripts/firebase-export.mjs`, `firebase-import-supabase.mjs` |
| API routes | ✅ | `src/app/api/v2/**`, registration routes updated |
| Middleware HMAC | ✅ | `src/middleware.ts` |

---

## 3. Security Remediation Files — Verified Present (Local)

| File | Control |
|------|---------|
| `src/app/api/registration/[registrationId]/route.ts` | 401 without token/email |
| `src/lib/security/registration-lookup.ts` | HMAC lookup tokens |
| `src/lib/security/admin-session.ts` | HMAC admin session |
| `src/middleware.ts` | Legacy cookie `=1` rejected |
| `scripts/staging-security-check.mjs` | 9/9 automated checks |

**Live production:** Registration lookup returns **HTTP 200 + PII** — security fixes **not deployed**.

---

## 4. Live vs Repository Route Drift

| Route | Local | Live (2026-05-29) |
|-------|-------|-------------------|
| `GET /api/registration/[id]` | 401 without auth | **200 + PII** |
| `GET /api/v2/health` | Exists | **404** |
| `POST /api/v2/registration/upload` | Exists | **404** |
| `POST /api/payments/razorpay-webhook` | HMAC | **401** unsigned ✅ |

---

## 5. Commit Plan

### Modified (sample — 151 total)

- `package.json`, `package-lock.json` — Firebase packages removed
- `src/app/api/registration/**` — Supabase paths
- `src/app/api/payments/razorpay-webhook/route.ts` — Prisma webhook
- `src/middleware.ts` — HMAC admin session
- 80+ datadekh/form pages — legacy submit migration

### Deleted (28)

- `firebase.ts`
- `src/lib/firebase.ts`, `src/lib/firebase-admin.ts`, `src/lib/firebase/**`
- `src/lib/firestore/**`
- `src/lib/saveRegistration.server.ts`
- `src/app/api/health/firebase-admin/route.ts`
- `src/app/firebase.ts`
- Committee/press page duplicates (replaced by `[slug]` / LegacyEdition pattern)

### Added (90+ untracked)

- `prisma/` — schema + 7 migrations
- `src/server/` — services, db, lib
- `src/app/api/v2/` — 60+ API routes
- `src/app/api/admin/` — admin session routes
- `supabase/` — policies, config, seed
- `scripts/firebase-export.mjs`, `firebase-import-supabase.mjs`
- `scripts/staging-security-check.mjs`
- `docs/firebase-exit/`, `docs/go-live/`

### Excluded from commit

- `.env` (secrets)
- `.agents/` (optional tooling)

---

## 6. Phase 1 Action

Commit entire Firebase Exit working tree to eliminate repository ↔ production drift at source level. Deploy remains Phase 8.

---

*Evidence: `git status`, `git diff --stat HEAD`, `npx vercel inspect`, live curl probes (P1 audit).*
