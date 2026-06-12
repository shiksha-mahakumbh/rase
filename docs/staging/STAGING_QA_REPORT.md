# Staging QA Report

**Date:** June 2026  
**Sprint:** Staging Deployment Validation  
**Scope:** Phase A → C + P0 Security Remediation

---

## Stage summary

| Stage | Name | Result |
|------:|------|--------|
| 1 | Environment Validation | ❌ FAIL (8/21 vars missing) |
| 2 | Database Validation | ❌ FAIL (DB unreachable) |
| 3 | Seed Validation | ❌ FAIL (DB unreachable) |
| 4 | Security Validation | ⚠️ PARTIAL (code 9/9, runtime blocked) |
| 5 | Admin Validation | ⚠️ PARTIAL (code complete, CRUD untested) |
| 6 | Public Site Validation | ⚠️ PARTIAL (routes ready, content untested) |
| 7 | Registration Validation | ⚠️ PARTIAL (Firebase intact, E2E untested) |

---

## What passed

| Area | Evidence |
|------|----------|
| TypeScript compile | `npx tsc --noEmit` ✅ |
| Prisma schema | `npx prisma validate` ✅ |
| P0 security code | `staging-security-check.mjs` 9/9 ✅ |
| 7 migrations in repo | All Phase A–C present ✅ |
| 4 seed scripts | Present and valid ✅ |
| 20 CMS admin modules | Routes + APIs verified ✅ |
| 11 public CMS routes | Loaders + fallbacks verified ✅ |
| Firebase registration path | `REGISTRATION_BACKEND=firebase` ✅ |
| Firestore strict rules (repo) | Anonymous read/write denied ✅ |

---

## What failed

| Area | Blocker |
|------|---------|
| Environment | 8 missing vars (security secrets, Supabase, webhook, site URL) |
| Database | PostgreSQL at `127.0.0.1:54322` not running |
| Migrations | `prisma migrate deploy` → P1001 |
| Seeds | All 4 scripts failed — same DB error |
| Runtime smoke tests | No staging server deployed in this sprint |
| Firebase rules deploy | Not executed against staging project |
| Supabase RLS | Not applied |

---

## Validation scripts added

| Script | Purpose |
|--------|---------|
| `scripts/staging-env-check.mjs` | Env presence audit |
| `scripts/staging-security-check.mjs` | P0 crypto + source checks |
| `scripts/staging-db-check.mjs` | Migration + table + seed counts |

---

## QA score

| Category | Score |
|----------|------:|
| Code readiness | **92%** |
| Environment readiness | **62%** |
| Data readiness | **0%** (DB down) |
| Runtime validation | **0%** (not executed) |
| **Overall staging QA** | **38%** |

---

## Required before staging sign-off

1. Configure all 8 missing environment variables on staging host
2. Start/connect staging PostgreSQL (Supabase staging project)
3. `npm run db:migrate:deploy`
4. Run all 4 seed scripts with `--publish`
5. Deploy code to staging Vercel
6. `firebase deploy --only firestore:rules,storage` on staging Firebase
7. Execute manual smoke tests (admin CRUD, public pages, registration E2E)
8. Re-run `staging-db-check.mjs` and confirm seed counts > 0
