# Cutover Readiness Report

**Date:** 2026-05-29  
**Auditor role:** Principal Release Engineer  
**Scope:** Full pre-production cutover audit (read-only except conditional Supabase SQL)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Production score** | **68 / 100** |
| **Decision** | **NO GO** |
| **GO threshold** | ≥ 85/100 |
| **Est. hours to launch** | **8–12 hours** (operator + approval gates) |

Source remediation (8 phases) is complete and build-verified locally. Supabase storage buckets and public-schema RLS were applied during this audit. Production runtime remains on a stale Firebase-era deploy with live PII exposure.

---

## Git & Deployment Drift

### Remediation commits (8/8 present on `main`)

| Commit | Phase |
|--------|-------|
| `d758002` | Phase 1 — Firebase Exit / drift reconciliation |
| `e262f7e` | Phase 2 — Supabase schema + SQL artifacts |
| `0c53245` | Phase 3 — Storage deployment |
| `31c3a6f` | Phase 4 — RLS policies |
| `3358ced` | Phase 5 — Domain alignment (source) |
| `9b0fbe5` | Phase 6 — Security gate tests |
| `82ef0a6` | Phase 7 — Vercel checklist |
| `469381e` | Phase 8 — Cutover runbook + GO/NO GO |

**HEAD:** `469381e` (local, not pushed per constraints)

### Uncommitted changes (cutover audit session)

| Path | Status |
|------|--------|
| `supabase/policies/registrations.sql` | Modified — `awards_registrations` → `award_registrations` (RLS deploy fix) |
| `scripts/deploy-supabase-production.mjs` | Modified — DIRECT_URL + dollar-quote handling |
| `scripts/apply-deploy-production.mjs` | New — `prisma db execute` deploy helper |
| `scripts/_cutover-audit-db.mjs` | New — temporary audit script |

**Drift vs remote:** `735 files` changed vs `origin/main` (Firebase Exit + remediation not pushed).

### Production deploy drift

| Item | Local HEAD | Live production |
|------|------------|-----------------|
| Deploy age | Unpushed commits | ~3 days (2026-06-09 build artifacts in sitemap) |
| Registration API | 401 without credentials (source) | **HTTP 200 + email/phone exposed** |
| Canonical domain | `www.shikshamahakumbh.com` (source fallbacks) | **`www.rase.co.in`** in sitemap/robots |
| Backend | Supabase/Prisma | Firebase (live registration data) |

---

## Build Verification

| Command | Result |
|---------|--------|
| `npx prisma validate` | ✅ Pass |
| `npx prisma migrate status` | ✅ 7/7 applied, up to date |
| `npx prisma generate` | ✅ Pass |
| `npx tsc --noEmit` | ✅ Pass (exit 0) |
| `npm run build` | ✅ **303 static pages**, exit 0 |
| `npm run test:security` | ✅ **15/15 PASS** |

**Non-fatal:** Prisma SEO UUID warnings during static generation (`seoMetadata` legacy IDs).

---

## Supabase Cutover Status

| Item | Status |
|------|--------|
| Prisma migrations | ✅ 7/7 applied |
| RBAC roles | ✅ 4 |
| Permissions | ✅ 18 |
| Registration counter | ✅ SMK2026, `lastNumber=1` |
| Registrations in DB | ❌ 0 (Firebase not imported) |
| Storage buckets | ✅ **8/8** (applied via `001_storage_buckets.sql` + DIRECT_URL) |
| RLS policies (`public`) | ✅ **55** |
| RLS policies (`storage.objects`) | ❌ Blocked — `must be owner of table objects` |

---

## Vercel Readiness

See `VERCEL_ENV_VERIFICATION.md`. Summary: required secrets present except **`DATABASE_URL`** and **`DIRECT_URL`** by exact Prisma names; legacy `FIREBASE_SERVICE_ACCOUNT_JSON` still set.

---

## Remaining P0 Blockers

1. **Production not redeployed** — live still Firebase-era build
2. **Live registration PII leak** — `GET /api/registration/SMK2026-000001` → 200 with email/phone
3. **Vercel `DATABASE_URL` / `DIRECT_URL`** — missing by name (aliases exist)
4. **`NEXT_PUBLIC_SITE_URL`** — live SEO still `rase.co.in`
5. **Firebase data not migrated** — 0 rows in Supabase; import not approved
6. **`git push` not executed** — 8 commits + cutover fixes unpushed
7. **`storage.objects` RLS** — requires Supabase SQL Editor (postgres ownership)

---

## Safe Tasks Completed This Audit

- Applied `supabase/sql/001_storage_buckets.sql` via `prisma db execute` + DIRECT_URL
- Applied public-schema RLS (8 policy files, 55 policies)
- Fixed `award_registrations` table name typo blocking RLS deploy
- Did **not** run production Firebase import, deploy, or push

---

## Report Index

| Report | Path |
|--------|------|
| Storage + RLS | `STORAGE_RLS_VERIFICATION.md` |
| Domain / canonical | `DOMAIN_CANONICAL_AUDIT.md` |
| Security gate | `SECURITY_GATE_VERIFICATION.md` |
| Supabase status | `SUPABASE_DEPLOYMENT_STATUS.md` |
| Vercel env | `VERCEL_ENV_VERIFICATION.md` |
| Data migration | `DATA_MIGRATION_READINESS.md` |
| Authorization | `FINAL_PRODUCTION_AUTHORIZATION.md` |

---

*Evidence: git log, build output, DB queries (DIRECT_URL), Vercel CLI, live HTTP probes — 2026-05-29.*
