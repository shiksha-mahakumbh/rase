# Final Firebase Exit Audit (Phase F7)

**Date:** 2026-06-11  
**Role:** Principal Architect — Firebase Exit Program  
**Constraint:** Audit + build validation only — no deployment, no production migration

---

# Verdict: FIREBASE EXIT NOT COMPLETE

# Exit Score: 38 / 100

---

## Build validation (2026-06-11)

| Command | Exit code | Result |
|---------|:---------:|--------|
| `npx prisma validate` | 0 | Schema valid |
| `npx prisma generate` | 0 | Client generated |
| `npx tsc --noEmit` | 0 | No type errors |
| `npm run build` | 0 | **Build succeeds** (Next.js 15) |

**Build passes with Firebase still installed** — removal not yet attempted.

---

## Runtime dependency check

```bash
rg -i "firebase|firestore|firebase-admin" src/
```

| Metric | Current | Target |
|--------|--------:|-------:|
| Files with Firebase references | **74** | **0** |
| npm packages `firebase`, `firebase-admin` | **Installed** | **Removed** |
| Default `REGISTRATION_BACKEND` | **firebase** | **supabase** |
| Razorpay webhook data layer | **Firestore** | **Prisma** |
| Admin auth provider | **Firebase Google** | **Supabase Auth** |
| Registration uploads | **Firebase Storage** | **Supabase Storage** |
| Security rules | **Firebase Rules** | **Supabase RLS** |

---

## Functional verification matrix

| Capability | Firebase path | Supabase path | Works today? |
|------------|---------------|---------------|:------------:|
| **Registrations submit** | `saveRegistration.server.ts` | `registration.service.ts` | ⚠️ Dual — default Firebase |
| **Registration lookup** | Firestore query | Prisma query | ⚠️ Dual — env switch |
| **Registration security (401)** | Source PASS | Source PASS | ✅ (code ready) |
| **Uploads** | `/api/registration/upload` | `/api/v2/registration/upload` | ⚠️ Firebase default |
| **Admin login** | Firebase Google OAuth | Not implemented | ❌ Firebase only |
| **Admin session cookie** | HMAC (provider-agnostic) | Same | ✅ |
| **Razorpay webhook** | `payments.server.ts` | `payment.service.ts` | ❌ Firestore wired |
| **CMS media** | N/A | Supabase Storage | ✅ |
| **Visitor analytics** | Firestore (optional) | `visitor-analytics.service.ts` | ⚠️ Partial |
| **v2 health** | Reports `backend: firebase` | DB check via Prisma | ⚠️ Env dependent |

---

## Category scores

| Category | Score | Status | Notes |
|----------|------:|--------|-------|
| **Schema readiness** | 90/100 | **GO** | Prisma models complete; migration fields exist |
| **Supabase services** | 70/100 | **PARTIAL** | registration, storage, payment services exist |
| **Auth migration** | 10/100 | **NO GO** | Firebase Auth still sole provider |
| **Registration cutover** | 25/100 | **NO GO** | Default backend = firebase; 50+ legacy forms |
| **Storage cutover** | 30/100 | **NO GO** | Firebase upload route active |
| **RLS deployment** | 20/100 | **NO GO** | Policies in repo; not deployed |
| **Data migration** | 0/100 | **NOT STARTED** | Runbook only |
| **Firebase removal** | 0/100 | **NOT STARTED** | 74 files still reference Firebase |
| **Build** | 95/100 | **GO** | All checks pass |
| **Documentation** | 100/100 | **GO** | F0-F7 docs complete |

**Weighted exit score: 38/100**

---

## Success criteria checklist

| Criterion | Required | Met? |
|-----------|----------|:----:|
| Platform runs on Supabase Postgres | Yes | ⚠️ Partial (CMS yes, registrations no) |
| Supabase Auth for admin | Yes | ❌ |
| Supabase Storage for uploads | Yes | ⚠️ Partial |
| No `firebase` npm dependency | Yes | ❌ |
| `rg firebase src/` → zero runtime deps | Yes | ❌ (74 files) |
| Registrations work end-to-end | Yes | ⚠️ Firebase path only in prod |
| Uploads work | Yes | ⚠️ Firebase default |
| Admin login works | Yes | ✅ (via Firebase) |
| Razorpay works | Yes | ✅ (via Firestore) |
| Registration lookup security (401) | Yes | ✅ (source; prod stale deploy) |

**Cannot sign off Firebase exit.**

---

## What is already built (accelerators)

| Asset | Location |
|-------|----------|
| Full Prisma registration schema | `prisma/schema.prisma` L484-719 |
| Supabase registration service | `src/server/services/registration.service.ts` |
| Backend switch (firebase/supabase/dual) | `src/server/backend/index.ts` |
| Supabase storage service | `src/server/services/storage.service.ts` |
| Supabase payment service | `src/server/services/payment.service.ts` |
| v2 API routes (85 endpoints) | `src/app/api/v2/**` |
| RLS policy SQL drafts | `supabase/policies/*.sql` |
| RBAC seed | `scripts/supabase/seed-rbac.mjs` |
| HMAC admin session (Firebase-independent) | `src/middleware.ts` |

**Estimated effort to complete exit:** 2-3 weeks engineering + 1 week data migration validation.

---

## Recommended execution order

```
Week 1: F1 (Supabase Auth) + F4 (deploy RLS to staging)
Week 2: F2 (flip registration backend) + F3 (storage) on staging
Week 3: F5 (data migration dry-run + staging import)
Week 4: F5 (production migration) + F6 (remove Firebase) + F7 (re-validate)
```

---

## Post-exit validation commands

```bash
# Must all pass after F6
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build
node scripts/staging-security-check.mjs   # update for Supabase
rg -i "firebase|firestore|firebase-admin" src/  # → 0 files

# Smoke tests
curl -s -o /dev/null -w "%{http_code}" https://staging.../api/registration/SMK2026-000001  # 401
curl -s https://staging.../api/v2/health  # 200, backend: supabase
```

---

## Reports delivered

| Phase | Document |
|-------|----------|
| F0 | `FIREBASE_USAGE_AUDIT.md` |
| F1 | `SUPABASE_AUTH_MIGRATION.md` |
| F2 | `REGISTRATION_MIGRATION.md` |
| F3 | `STORAGE_MIGRATION.md` |
| F4 | `RLS_SECURITY_AUDIT.md` |
| F5 | `DATA_MIGRATION_RUNBOOK.md` |
| F6 | `FIREBASE_REMOVAL_REPORT.md` |
| F7 | `FINAL_FIREBASE_EXIT_AUDIT.md` (this file) |

---

## Final recommendation

| Question | Answer |
|----------|--------|
| **Firebase exit complete?** | **NO** |
| **Safe to remove Firebase now?** | **NO** — production data and flows depend on it |
| **Schema ready?** | **YES** — Prisma models sufficient |
| **Next critical step** | F1 Supabase Auth + F2 flip `REGISTRATION_BACKEND` on staging |
| **Production migration?** | **NOT STARTED** (per mandate) |

---

**STOP — No code changes, no deployment, no production migration, no data deletion.**
