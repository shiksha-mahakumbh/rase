# Repository Release Status

**Date:** 2026-05-29  
**Branch:** `main`  
**HEAD:** `469381e`

---

## Summary

| Check | Status |
|-------|--------|
| Working tree clean | ❌ Uncommitted changes present |
| Remediation commits | ✅ 8/8 on local `main` |
| Pushed to remote | ❌ **8 commits ahead** of `origin/main` |
| Prisma migrations | ✅ 7/7 applied locally |
| Release branch health | ⚠️ `main` only; no release tag |

---

## Git Status

### Unpushed commits (8)

```
469381e Phase 8: production cutover runbook and final GO/NO GO reassessment
82ef0a6 Phase 7: Vercel production environment checklist
9b0fbe5 Phase 6: security release gate tests and report
3358ced Phase 5: align canonical domain to www.shikshamahakumbh.com in source
31c3a6f Phase 4: production RLS hardening policies and audit report
0c53245 Phase 3: storage deployment report and bucket SQL documentation
e262f7e Phase 2: Supabase schema verification and production SQL artifacts
d758002 Phase 1: eliminate deployment drift — commit Firebase Exit to source
```

**Tracking:** `main` → `[origin/main: ahead 8]`

### Uncommitted changes

| Path | Type | Notes |
|------|------|-------|
| `supabase/policies/registrations.sql` | Modified | `award_registrations` table name fix (RLS deploy) |
| `scripts/deploy-supabase-production.mjs` | Modified | DIRECT_URL + dollar-quote handling |
| `scripts/apply-deploy-production.mjs` | Untracked | `prisma db execute` deploy helper |
| `docs/go-live/CUTOVER_READINESS_REPORT.md` | Untracked | Prior audit pack |
| `docs/go-live/DOMAIN_CANONICAL_AUDIT.md` | Untracked | Prior audit pack |
| `docs/go-live/FINAL_PRODUCTION_AUTHORIZATION.md` | Untracked | Prior audit pack |
| `docs/go-live/SECURITY_GATE_VERIFICATION.md` | Untracked | Prior audit pack |
| `docs/go-live/STORAGE_RLS_VERIFICATION.md` | Untracked | Prior audit pack |
| `docs/go-live/SUPABASE_DEPLOYMENT_STATUS.md` | Untracked | Prior audit pack |
| `docs/go-live/VERCEL_ENV_VERIFICATION.md` | Untracked | Prior audit pack |
| `docs/go-live/DATA_MIGRATION_READINESS.md` | Modified | Prior audit pack |

**Pre-launch action:** Commit cutover fixes + go-live report pack before push.

---

## Migration History

```
npx prisma migrate status
→ 7 migrations found
→ Database schema is up to date
```

| Migration | Status |
|-----------|--------|
| `20250609_init` | Applied |
| `20250610_phase3` | Applied |
| `20250621_phase_b_cms` | Applied |
| `20250622_phase_b5_analytics` | Applied |
| `20250620_phase35_cms_foundation` | Applied |
| `20250629_phase_s2_foundation` | Applied |
| `20250701_phase_c_organizational_cms` | Applied |

---

## Build & Test (local)

| Gate | Result |
|------|--------|
| `npm run build` | ✅ 303 static pages |
| `npm run test:security` | ✅ 15/15 PASS |
| `npx tsc --noEmit` | ✅ Pass |

---

## Deployment Drift

| Artifact | Local | Remote production |
|----------|-------|-------------------|
| Source | Remediated HEAD + uncommitted | 2026-06-09 deploy (`dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt`) |
| Registration API | 401 without auth (source) | 200 + PII (live) |
| Canonical domain | `www.shikshamahakumbh.com` (source) | `www.rase.co.in` (live) |

---

## Verdict

**Repository release status: NOT READY TO PUSH**

Source remediation is complete in git history but launch package requires one commit bundling RLS fix, deploy helper, and go-live documentation before `git push origin main`.

---

*Evidence: `git status`, `git log`, `npx prisma migrate status` — 2026-05-29.*
