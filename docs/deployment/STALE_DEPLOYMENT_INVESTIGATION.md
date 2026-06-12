# Stale Deployment Investigation

**Date:** 2026-06-11  
**Incident:** `GET /api/registration/SMK2026-000001` returns **200 + PII** on production  
**Expected (current source):** **401** without token/email  
**Project:** `dhe-projects/rase-co-in`

---

## Classification

# Primary cause: **STALE_PRODUCTION_DEPLOYMENT**

| Hypothesis | Verdict | Confidence |
|------------|---------|:----------:|
| A) Stale deployment (old bundle) | **CONFIRMED** | High |
| B) Alternate route serving request | **RULED OUT** | High |
| C) Wrong Vercel project | **RULED OUT** | Medium |
| D) Wrong branch / failed deployment | **CONTRIBUTING** | Medium |
| E) Environment mismatch without redeploy | **CONTRIBUTING** | High |
| F) Route mismatch (different handler) | **RULED OUT** | High |

---

## Evidence matrix

| # | Test | Result | Implication |
|---|------|--------|-------------|
| 1 | Live GET registration (no auth) | **HTTP 200** + `email`, `contactNumber` | Pre-P0 handler active |
| 2 | Source `[registrationId]/route.ts` L51-56 | Returns 401 without credential | Current code is secure |
| 3 | `toPublicRegistrationSummary` L78-87 | Excludes `email`, `contactNumber` | Live shape ≠ current code |
| 4 | GET `/api/v2/registration/SMK2026-000001` | **404** | v2 routes not in live bundle |
| 5 | GET `/api/v2/health` | **404** | Newer build not deployed |
| 6 | GET `/api/payments/razorpay-webhook` | **405** GET / **401** POST | Legacy route exists; webhook code partially present |
| 7 | Live sitemap | `https://www.rase.co.in` | `NEXT_PUBLIC_SITE_URL` not baked in |
| 8 | Vercel env ls | Secrets added ~16h ago | Env updated post-deploy |
| 9 | `npx vercel ls` | Last Production deploy ~**2 days** ago | No deploy since env change |
| 10 | `staging-security-check.mjs` | **9/9 PASS** | Source repo is correct |
| 11 | Test data `createdAt` | `2026-06-09T12:31:07.278Z` | Consistent with prior audit session |

---

## Live probe evidence (2026-06-11T10:03Z)

### Registration lookup

```http
GET https://www.shikshamahakumbh.com/api/registration/SMK2026-000001
```

```
HTTP 200
{"registrationId":"SMK2026-000001","registrationType":"Conclave","fullName":"Release Verify",
 "institution":"RASE QA","email":"release-verify+20260609@rase.co.in",
 "contactNumber":"9999999999","paymentStatus":"Not Required",
 "accommodationRequired":"No","accommodationStatus":"Not Required",
 "createdAt":"2026-06-09T12:31:07.278Z"}
```

### Supporting endpoint probes

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/v2/registration/SMK2026-000001` | GET | **404** |
| `/api/v2/health` | GET | **404** |
| `/api/payments/razorpay-webhook` | GET | **405** |
| `/api/payments/razorpay-webhook` | POST (no signature) | **401** |

### SEO staleness

| Surface | Live value |
|---------|------------|
| Sitemap `<loc>` | `https://www.rase.co.in` |
| `robots.txt` | `Sitemap: https://www.rase.co.in/sitemap.xml` |
| Canonical | `https://www.rase.co.in` |
| `og:url` | `https://www.rase.co.in` |

---

## Source vs production comparison

### Current source (`src/app/api/registration/[registrationId]/route.ts`)

```typescript
// L51-56
const email = await resolveVerifiedEmail(registrationId, request);
if (!email) {
  return NextResponse.json(
    { error: "Email or confirmation token required" },
    { status: 401 }
  );
}
```

### Current source response shape (`registration-lookup.ts` L78-87)

`PublicRegistrationSummary` — fields: `registrationId`, `registrationType`, `fullName`, `institution`, `paymentStatus`, `accommodationRequired`, `accommodationStatus`, `createdAt`.

**No `email`. No `contactNumber`.**

### Production response

Includes `email` and `contactNumber` — proves execution of **pre-remediation** handler.

---

## Hypothesis analysis

### A) Stale deployment — CONFIRMED

Production serves a build artifact from **before P0 security remediation** (~2026-06-09 or earlier). Indicators:

1. Missing v2 API surface (404 on health + v2 registration)
2. Pre-P0 JSON response schema
3. SEO still on `rase.co.in` fallback despite env key existence
4. Last Vercel production deploy ~2 days ago; env vars updated ~16h ago without redeploy

### B) Alternate route — RULED OUT

| Route | Live | Notes |
|-------|------|-------|
| `/api/registration/[registrationId]` | **200** (vulnerable) | App Router path matches probe URL |
| `/api/v2/registration/[id]` | **404** | Not deployed |

The probed URL maps to `[registrationId]/route.ts` in App Router. No shadow route serves this path on live.

### C) Wrong Vercel project — RULED OUT

- `npx vercel env ls` → `dhe-projects/rase-co-in`
- Live host `www.shikshamahakumbh.com` serves Shiksha Mahakumbh content
- Test registration `SMK2026-000001` exists on live (audit test data)
- Deployment URLs under `rase-co-*.vercel.app` in same project

### D) Wrong branch / failed deployment — CONTRIBUTING

`vercel ls` shows multiple Ready Production deployments (~2-3 days old). No deployment in last 16h despite env changes. Possible scenarios:

- Env updated in Dashboard without triggering redeploy
- Deploys from branch missing P0 commits (less likely — source on disk has fixes)
- Manual promotion of older deployment (unverified)

**Most likely:** env updated, **no `vercel --prod` invoked**.

### E) Environment mismatch — CONTRIBUTING

| Fact | Implication |
|------|-------------|
| Security secrets added ~16h ago | Would not fix 200 without code redeploy |
| `NEXT_PUBLIC_SITE_URL` added ~16h ago | Requires rebuild to affect sitemap/canonical |
| Current 401 check is **before** secret lookup (L51-56) | Old code lacks check entirely |

Env updates alone cannot explain wrong response shape — **stale code is required**.

### F) Route mismatch — RULED OUT

Single App Router handler at `src/app/api/registration/[registrationId]/route.ts`. No Pages Router duplicate found. v2 is separate path (404 on prod).

---

## Root cause statement

Production Vercel deployment is serving a **stale JavaScript bundle** that:

1. Does not require token/email on registration GET
2. Returns full registration record including PII (`email`, `contactNumber`)
3. Does not include `/api/v2/*` routes from current repository
4. Was built with empty/wrong `NEXT_PUBLIC_SITE_URL` → `rase.co.in` SEO fallback

**Contributing factor:** Vercel environment variables were updated without a subsequent production deployment.

---

## Required fix

```bash
# 1. Confirm Vercel env (see ENVIRONMENT_READINESS_REPORT.md)
# 2. Local gate
npm run build
node scripts/staging-security-check.mjs   # 9/9 PASS

# 3. Deploy
npx vercel --prod

# 4. Verify gate
curl.exe --max-time 30 -s -o NUL -w "%{http_code}" \
  "https://www.shikshamahakumbh.com/api/registration/SMK2026-000001"
# MUST print: 401
```

---

## Investigation conclusion

| Item | Finding |
|------|---------|
| Is production code current? | **NO** |
| Is source code current? | **YES** |
| Is this a config-only fix? | **NO** — requires redeploy |
| Earliest remediation | ~3h ops (per `PRODUCTION_REMEDIATION_PLAN.md`) |

**No deployment executed in this investigation.**
