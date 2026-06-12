# Remediation Deployment Gap Analysis

**Date:** 2026-05-29  
**Auditor mode:** Independent git + Vercel + live endpoint verification  
**Production URL:** https://www.shikshamahakumbh.com

---

## Executive Answers

| Question | Answer |
|----------|--------|
| **Are the fixes only local?** | **Yes** — they exist only as **uncommitted working-tree changes**. No git commit contains them. |
| **Are they pushed to GitHub?** | **No** — `origin/main` is at `00dbe12`, which does **not** include remediation. |
| **Are they deployed to Vercel?** | **No** — production still returns pre-remediation behavior (400 / 500). |
| **What exact step is missing?** | **Commit → push → production deploy** (all three). |
| **GO or NO GO?** | **NO GO** |

---

## 1. Remediation Commit Search

Searched all branches for commits mentioning remediation, TYPE_MAP, Bal Shodh, or gateway auth fixes:

```text
git log --oneline --all --grep="remediation" -i   → (no results)
git log --oneline --all --grep="TYPE_MAP" -i      → (no results)
git log --oneline --all --grep="Bal Shodh" -i     → (no results)
git log --oneline --all --grep="gateway" -i       → (no results)
```

**Conclusion:** There is **no remediation commit** in local or remote history. Fixes were implemented in a prior session but **never committed**.

---

## 2. Git State Evidence

### Branch sync

```text
## main...origin/main
```

| Ref | SHA | Message | Contains remediation? |
|-----|-----|---------|----------------------|
| `HEAD` / `main` | `00dbe1259cdefd6d39e1c5f8110bc3968e3ccc5d` | Updated notice board | **No** |
| `origin/main` | `00dbe1259cdefd6d39e1c5f8110bc3968e3ccc5d` | Updated notice board | **No** |
| Working tree | (uncommitted) | — | **Yes** (3 core files) |

### Recent `main` log

```text
00dbe12 2026-06-12 23:39:04 +0530  Updated notice board
0dd6736 2026-06-12 21:33:48 +0530  Add final pre-launch verification reports for repository, storage RLS, and Vercel env
a0e2c08 2026-06-12 17:58:14 +0530  Fix visitor analytics session race condition
b09497e 2026-06-12 13:04:28 +0530  Updated notice board
3e6acb9 2026-06-12 12:50:58 +0530  Cutover signoff: storage verification, migration plan, ready signoff
```

### Uncommitted remediation files (core fixes)

| File | Status | Role |
|------|--------|------|
| `src/server/lib/registration-types.ts` | Modified (uncommitted) | TYPE_MAP + SUPPORTED_V2_TYPES |
| `src/server/lib/admin-request-auth.ts` | Modified (uncommitted) | Early 401 when no Bearer token |
| `src/app/api/admin/gateway/[...path]/route.ts` | Modified (uncommitted) | `hasAdminCredentials` + 401 JSON |

Additional uncommitted remediation-adjacent changes (UI cleanup, firebase export removal, tests) are also **not committed**.

---

## 3. TYPE_MAP — Committed vs Local vs Production

### At `00dbe12` / `origin/main` / production (no Bal Shodh / Cultural Program)

`SUPPORTED_V2_TYPES` ends at `"Organiser"` — **no** `"Bal Shodh Patrika"` or `"Cultural Program"`.

`TYPE_MAP` ends at:

```typescript
Organiser: "Legacy_Other",
};
```

### At local working tree (uncommitted — HAS fixes)

```typescript
// SUPPORTED_V2_TYPES
"Bal Shodh Patrika",
"Cultural Program",

// TYPE_MAP
"Bal Shodh Patrika": "Legacy_Other",
"Cultural Program": "Legacy_Other",
```

**File:** `src/server/lib/registration-types.ts` (working tree lines 29–30, 52–53)

---

## 4. Admin Gateway Auth — Committed vs Local

### At `00dbe12` / production

- No `hasAdminCredentials()`
- No `unauthorizedResponse()`
- GET handler calls `proxyToV2Admin` directly; unauthenticated requests can surface **500** empty body

### At local working tree (uncommitted — HAS fixes)

- `hasAdminCredentials()` checks HMAC cookie or Bearer token
- `unauthorizedResponse()` returns `{ error: "Unauthorized", code: "UNAUTHORIZED" }` with **401**
- All HTTP methods route through `handleGateway()` with early 401 guard

**Files:**

- `src/app/api/admin/gateway/[...path]/route.ts`
- `src/server/lib/admin-request-auth.ts` (+5 lines: explicit 401 when no token after cookie check)

---

## 5. Vercel Production Deployment

| Field | Value |
|-------|-------|
| Deployment ID | `dpl_FZMihrmetbpUJfEHZKamsiizjMvq` |
| URL | `https://rase-co-87o889e5v-dhe-projects.vercel.app` |
| Aliases | `www.shikshamahakumbh.com`, `www.rase.co.in`, … |
| Status | ● Ready (production) |
| Build started | `2026-06-12T17:00:09Z` (22:30 IST) |
| Build duration | ~5 minutes |

### Deployed commit SHA (inferred)

Vercel build logs do not expose `meta.githubCommitSha` in CLI JSON output. Timeline analysis:

| Event | UTC | IST |
|-------|-----|-----|
| Vercel build start | 17:00 | 22:30 |
| `0dd6736` committed | 16:03 | 21:33 |
| `00dbe12` committed | 18:09 | 23:39 |

**Inferred deployed commit:** `0dd6736d4f68115ffcf882ea34671a1a8d4e0710` (latest on `main` at build time).

**Confirmed:** `00dbe12` was committed **after** this deployment and has **not** triggered a newer production deploy (only one production deployment visible in `vercel ls` at audit time).

**Confirmed:** Neither `0dd6736` nor `00dbe12` contains remediation fixes.

### Diff: deployed commit → current HEAD (`00dbe12`)

`00dbe12` is one commit ahead of inferred deploy (`0dd6736`). That diff is **notice-board / docs only** — not remediation.

### Diff: deployed commit → local working tree (includes remediation)

Core remediation diff stat:

```text
 src/server/lib/registration-types.ts         |  4 +++
 src/server/lib/admin-request-auth.ts         |  5 +++
 src/app/api/admin/gateway/[...path]/route.ts | 75 +++++++++++++---------------
 4 files changed, 44 insertions(+), 42 deletions(-)
```

Full working-tree diff vs `HEAD`: **30 files**, +49 / −278 lines (includes firebase export deletion, UI cleanup, docs, tests).

---

## 6. Live Production Re-Test (2026-06-12T18:57:52Z)

| Endpoint | Payload / method | Expected (post-fix) | Actual (now) | Result |
|----------|------------------|---------------------|--------------|--------|
| `/api/registration/submit` | `type: "Bal Shodh Patrika"` | **403** captcha | **400** `Invalid registration type` | **FAIL** |
| `/api/registration/submit` | `type: "Cultural Program"` | **403** captcha | **400** `Invalid registration type` | **FAIL** |
| `/api/admin/gateway/registrations` | GET, no auth | **401** JSON | **500** empty body | **FAIL** |

### Raw probe output

```json
{"endpoint":"POST /api/registration/submit","type":"Bal Shodh Patrika","status":400,"body":{"error":"Invalid registration type"}}
{"endpoint":"POST /api/registration/submit","type":"Cultural Program","status":400,"body":{"error":"Invalid registration type"}}
{"endpoint":"GET /api/admin/gateway/registrations","status":500,"body":""}
```

Production behavior matches **`00dbe12` / `0dd6736` codebase**, not local working tree.

---

## 7. Gap Diagram

```text
[Remediation code written]
        │
        ▼
   ┌─────────────┐
   │ Working tree │  ✅ HAS fixes (uncommitted)
   └─────────────┘
        │  ❌ git commit MISSING
        ▼
   ┌─────────────┐
   │  main HEAD   │  00dbe12 — NO fixes
   │ origin/main  │
   └─────────────┘
        │  ❌ deploy for 00dbe12 MISSING (00dbe12 never built)
        ▼
   ┌─────────────┐
   │   Vercel     │  dpl_FZMihr… (~0dd6736) — NO fixes
   │  production  │
   └─────────────┘
        │
        ▼
   Live endpoints FAIL (400 / 500)
```

---

## 8. Exact Commands Required

Run from repository root: `c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase`

### Step 1 — Commit remediation (required)

```powershell
cd "c:\Users\LENOVO\OneDrive\Desktop\rase.co.in\rase"

git add `
  src/server/lib/registration-types.ts `
  src/server/lib/admin-request-auth.ts `
  "src/app/api/admin/gateway/[...path]/route.ts" `
  package.json `
  scripts/test-registration-types.mjs `
  .gitignore `
  src/components/home/HeroSection.tsx `
  src/app/component/Vibhag/academic/AcademicCouncilUI.tsx `
  src/app/component/Vibhag/academic/pages/CulturalPage.tsx `
  src/app/component/Vibhag/academic/pages/OlympiadPage.tsx `
  src/components/admin/AdminRegistrationCategories.tsx

git add -u exports/firebase/

git commit -m "$(cat <<'EOF'
Fix registration TYPE_MAP and admin gateway 401 for launch remediation.

Add Bal Shodh Patrika and Cultural Program to TYPE_MAP, return 401 JSON
from admin gateway when unauthenticated, remove firebase PII exports from
tracking, and add registration-type test coverage.
EOF
)"
```

### Step 2 — Push to GitHub (required)

```powershell
git push origin main
```

### Step 3 — Deploy to Vercel production (required if auto-deploy does not trigger)

If Git integration auto-deploys on push to `main`, wait for Vercel build (~5 min). Otherwise:

```powershell
npx vercel --prod
```

Monitor:

```powershell
npx vercel ls
npx vercel inspect www.shikshamahakumbh.com
```

### Step 4 — Post-deploy verification (required)

```powershell
node scripts/test-registration-types.mjs
node scripts/_registration-e2e-audit.mjs
```

Or manual checks:

```powershell
node --input-type=module -e "
const B='https://www.shikshamahakumbh.com';
for (const t of ['Bal Shodh Patrika','Cultural Program']) {
  const r=await fetch(B+'/api/registration/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({registrationType:t,data:{fullName:'Test',email:'t@example.com'}})});
  console.log(t, r.status, await r.text());
}
const g=await fetch(B+'/api/admin/gateway/registrations');
console.log('gateway', g.status, await g.text());
"
```

**Pass criteria:**

| Check | Expected |
|-------|----------|
| Bal Shodh Patrika submit | **403** (not 400) |
| Cultural Program submit | **403** (not 400) |
| Admin gateway | **401** `{"error":"Unauthorized","code":"UNAUTHORIZED"}` (not 500) |

---

## 9. Pass / Fail Matrix

| Layer | TYPE_MAP fix | Gateway 401 fix | Evidence |
|-------|--------------|-----------------|----------|
| Local working tree | ✅ | ✅ | `git diff HEAD` |
| Local `main` commit | ❌ | ❌ | `00dbe12` file contents |
| `origin/main` | ❌ | ❌ | Same SHA as local main |
| Vercel production | ❌ | ❌ | Live 400 / 500 responses |
| Remediation git commit | ❌ | ❌ | No matching commit in log |

---

## 10. GO / NO GO

### **NO GO**

Registration Launch Remediation is **implemented locally but not shipped**. Production continues to reject Bal Shodh Patrika and Cultural Program registrations and returns **500** on unauthenticated admin gateway access.

### Minimum path to GO

1. Commit remediation changes  
2. Push to `origin/main`  
3. Confirm new Vercel production deployment  
4. Re-run live probes — all three endpoints must pass expected statuses  

Until Step 4 passes on https://www.shikshamahakumbh.com, **do not authorize full public launch** for those registration categories.

---

## Appendix — Key SHAs

| Label | SHA |
|-------|-----|
| Local / origin `main` | `00dbe1259cdefd6d39e1c5f8110bc3968e3ccc5d` |
| Inferred Vercel production | `0dd6736d4f68115ffcf882ea34671a1a8d4e0710` |
| Remediation commit | **Does not exist** |
| Vercel deployment | `dpl_FZMihrmetbpUJfEHZKamsiizjMvq` |

---

*Audit-only. No commit, push, or deploy performed during this analysis.*
