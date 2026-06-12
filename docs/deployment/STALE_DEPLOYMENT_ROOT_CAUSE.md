# Stale Deployment Root Cause Analysis

**Date:** 2026-06-11  
**Incident:** `GET /api/registration/SMK2026-000001` returns 200 + PII on production  
**Expected (current source):** 401 without token/email

---

## Classification result

# Primary cause: **A) STALE_PRODUCTION_DEPLOYMENT**

Secondary factor: **D) ENV_MISMATCH** (secrets added to Vercel without redeploy)

**Ruled out:** **B) Alternate route** (for this URL)  
**Ruled out as primary:** **C) Legacy deployment** (same as A — old bundle)

---

## Evidence matrix

| Hypothesis | Test | Result | Verdict |
|------------|------|--------|---------|
| **A) Stale deployment** | Compare live response vs source | Live ≠ source | **CONFIRMED** |
| **B) Alternate route** | Probe `/api/v2/registration/SMK2026-000001` | **404** on prod | **RULED OUT** |
| **C) Legacy deployment** | Response shape analysis | Pre-P0 response shape | **CONFIRMED** (subset of A) |
| **D) Env mismatch** | Vercel secrets added 15h ago, no redeploy | Env present, behavior unchanged | **CONTRIBUTING** |

---

## Live probe (2026-06-11)

### Request
```
GET https://www.shikshamahakumbh.com/api/registration/SMK2026-000001
(no token, no email)
```

### Actual response
```
HTTP 200
{"registrationId":"SMK2026-000001","registrationType":"Conclave","fullName":"Release Verify",
 "institution":"RASE QA","email":"release-verify+20260609@rase.co.in",
 "contactNumber":"9999999999","paymentStatus":"Not Required",...}
```

### Expected (current source)

**File:** `src/app/api/registration/[registrationId]/route.ts`

| Control | Line | Behavior |
|---------|------|----------|
| No email/token → 401 | **51-56** | `"Email or confirmation token required"` |
| Summary-only response | **86-97** | `toPublicRegistrationSummary()` |

**File:** `src/lib/security/registration-lookup.ts`

| Field | In `PublicRegistrationSummary`? | Line |
|-------|:-----------------------------:|------|
| `email` | **NO** | 78-87 |
| `contactNumber` | **NO** | 78-87 |

**Smoking gun:** Live response includes `email` and `contactNumber` — fields **absent** from current summary type. Production bundle predates P0 remediation.

---

## Alternate route analysis (B)

| Route | Source auth? | Live probe | Conclusion |
|-------|:------------:|------------|------------|
| `/api/registration/[registrationId]` | ✅ L51-56 | **200** (vulnerable) | Hit by probe — old handler |
| `/api/v2/registration/[id]` | ✅ L29-34 | **404** | Not deployed to production |
| `/api/registration/lookup` (POST) | ✅ requires body email | Not probed | Requires POST + email |

**B ruled out:** The probed URL maps to `[registrationId]/route.ts` in App Router. V2 route does not exist on live deploy (404).

---

## Legacy deployment indicators (C)

| Indicator | Evidence |
|-----------|----------|
| Pre-P0 response schema | `email`, `contactNumber` in JSON |
| Missing v2 routes | `/api/v2/health` → 404; `/api/v2/registration/...` → 404 |
| Stale SEO | Sitemap `https://www.rase.co.in`; env vars updated but output unchanged |
| CreatedAt timestamp | `2026-06-09T12:31:07.278Z` — test data from prior audit session |

---

## Environment mismatch (D)

| Fact | Implication |
|------|-------------|
| `ADMIN_*` + `REGISTRATION_LOOKUP_SECRET` added to Vercel ~15h ago | Env layer updated |
| Live behavior unchanged | **No `vercel --prod` since env change** |
| Current code returns 401 **before** secret lookup needed (L51-56) | Env alone cannot explain 200 — old code lacks check |

**D is contributing** (deploy not triggered) but **not root cause** of wrong response shape.

---

## Root cause statement

Production Vercel deployment is serving a **build artifact from before P0 security remediation**. The repository contains correct controls; the live edge/runtime executes an older JavaScript bundle that:

1. Does not require token/email on registration GET
2. Returns full registration record including `email` and `contactNumber`
3. Does not include newer routes (`/api/v2/*`)

---

## Required fix

```bash
# After Vercel env confirmed
npx vercel --prod

# Verify
curl -s -o /dev/null -w "%{http_code}" \
  https://www.shikshamahakumbh.com/api/registration/SMK2026-000001
# MUST return 401
```

**No deployment executed in this audit.**
