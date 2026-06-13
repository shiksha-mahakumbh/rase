# Post-Deploy Verification Report

**Date:** 2026-06-13  
**Production URL:** https://www.shikshamahakumbh.com  
**Probe timestamp (UTC):** 2026-06-13T05:48:46Z

---

## Executive Summary

| Question | Answer |
|----------|--------|
| **Which commit is deployed?** | **Inferred `0dd6736`** (build `2026-06-12T17:00:09Z`). Vercel deployment `dpl_FZMihrmetbpUJfEHZKamsiizjMvq` — **does not include remediation**. |
| **Is production current?** | **No** — `origin/main` is **`8c138e4`**, which is **1 commit ahead** of the last production build and contains all remediation fixes. |
| **Are all three endpoints fixed?** | **No** — all three fail on live production. |
| **Readiness score** | **79/100** (code ready on `main`; production still broken) |
| **GO / NO GO** | **NO GO** |

---

## 1. Deployed Commit Determination

### Vercel production (live alias)

| Field | Value |
|-------|-------|
| Deployment ID | `dpl_FZMihrmetbpUJfEHZKamsiizjMvq` |
| URL | `https://rase-co-87o889e5v-dhe-projects.vercel.app` |
| Aliases | `www.shikshamahakumbh.com`, `www.rase.co.in`, … |
| Status | ● Ready (production) |
| Age at audit | ~13 hours |
| Build started | `2026-06-12T17:00:09Z` |

Vercel CLI does not expose `githubCommitSha` in inspect output. Commit inferred from build timestamp vs git history:

| Commit | Time (UTC) | Contains remediation? | Built? |
|--------|------------|----------------------|--------|
| `0dd6736` | 2026-06-12 16:03 | No | **Likely yes** (latest before build) |
| `00dbe12` | 2026-06-12 18:09 | No | No (after build) |
| `8c138e4` | 2026-06-12 19:16 | **Yes** | **No** (after build) |

**Deployed commit (inferred):** `0dd6736d4f68115ffcf882ea34671a1a8d4e0710`  
**Message:** Add final pre-launch verification reports for repository, storage RLS, and Vercel env

---

## 2. Git Comparison

| Ref | SHA | Remediation in tree? | Sync |
|-----|-----|---------------------|------|
| `HEAD` / `main` | `8c138e40ed2010896785f4a96d088113caafb284` | **Yes** | — |
| `origin/main` | `8c138e40ed2010896785f4a96d088113caafb284` | **Yes** | ✅ Same as HEAD |
| Vercel production (inferred) | `0dd6736…` | **No** | ❌ **2+ commits behind** |

### Remediation landed in `8c138e4`

Commit `8c138e4` ("Updated notice board", 2026-06-13 00:46 IST) includes:

- `src/server/lib/registration-types.ts` — `Bal Shodh Patrika`, `Cultural Program` in TYPE_MAP
- `src/app/api/admin/gateway/[...path]/route.ts` — `hasAdminCredentials`, `unauthorizedResponse`
- `src/server/lib/admin-request-auth.ts` — explicit 401 when no Bearer token
- Plus: firebase export removal, tests, go-live docs

```text
git diff 00dbe12 8c138e4 --stat
 36 files changed, 1535 insertions(+), 278 deletions(-)
```

### Working tree

Only unrelated local change: `M src/app/component/Footer.tsx` (not deployed).

---

## 3. Is Production Running Latest Code?

**No.**

| Check | Result |
|-------|--------|
| `origin/main` pushed? | ✅ `8c138e4` on GitHub |
| New Vercel production deploy after `8c138e4`? | ❌ Latest deploy still `dpl_FZMihr…` from 13h ago |
| Live API behavior matches `8c138e4`? | ❌ Matches pre-remediation code |
| Supabase / platform health | ✅ `/api/v2/health` → database connected |

**Missing step:** Production redeploy from `main` (`8c138e4`). Push alone did not trigger a new production build (or build failed/was not promoted).

---

## 4. Live Endpoint Verification

**Base:** `https://www.shikshamahakumbh.com`  
**Method:** POST submit without captcha (type-gate probe); GET admin gateway without auth

| Test | Expected | Actual | Pass |
|------|----------|--------|------|
| `POST /api/registration/submit` — `Bal Shodh Patrika` | **403** Security verification failed | **400** Invalid registration type | ❌ |
| `POST /api/registration/submit` — `Cultural Program` | **403** Security verification failed | **400** Invalid registration type | ❌ |
| `GET /api/admin/gateway/registrations` | **401** JSON `{ error, code }` | **500** empty body | ❌ |

### Raw evidence

```json
{"type":"Bal Shodh Patrika","status":400,"error":"Invalid registration type","pass":false}
{"type":"Cultural Program","status":400,"error":"Invalid registration type","pass":false}
{"endpoint":"GET /api/admin/gateway/registrations","status":500,"body":"","pass":false}
```

**0/3 endpoints pass.**

---

## 5. Readiness Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code on `main` | 92 | Remediation committed in `8c138e4` |
| Production parity | 35 | Deploy stale; fixes not live |
| Category coverage (live) | 45 | Bal Shodh / Cultural still 400 |
| Security (live gateway) | 70 | v2 admin 401 OK; gateway still 500 |
| Platform health | 88 | Supabase connected |
| **Overall** | **79/100** | Unchanged from pre-deploy audit — deploy gap not closed |

---

## 6. GO / NO GO

### **NO GO**

Remediation is **committed and pushed** to `origin/main` (`8c138e4`) but **not deployed** to production. Users hitting `www.shikshamahakumbh.com` still get pre-fix behavior.

---

## 7. Required Action

Trigger a new **production** deployment from `main`:

```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase"

# Option A — Vercel CLI
npx vercel --prod

# Option B — Vercel Dashboard
# Deployments → Redeploy latest `main` commit 8c138e4 → Production
```

After deploy completes (~5 min), re-run verification:

```powershell
node scripts/_registration-e2e-audit.mjs
node scripts/test-registration-types.mjs
```

**Pass criteria:**

| Endpoint | Expected |
|----------|----------|
| Bal Shodh Patrika submit | 403 (not 400) |
| Cultural Program submit | 403 (not 400) |
| Admin gateway GET | 401 JSON |

---

## Appendix — Key SHAs

| Label | SHA |
|-------|-----|
| `origin/main` (latest, with fixes) | `8c138e40ed2010896785f4a96d088113caafb284` |
| Inferred production deploy | `0dd6736d4f68115ffcf882ea34671a1a8d4e0710` |
| Vercel deployment | `dpl_FZMihrmetbpUJfEHZKamsiizjMvq` |

---

*Verification-only. No deploy performed during this audit.*
