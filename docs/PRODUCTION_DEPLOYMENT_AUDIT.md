# Production Deployment Audit — Route Resolution

**Date:** 29 May 2026  
**Symptom:** `GET /api/health`, `/sitemap.xml`, `/robots.txt` return **HTTP 200** with **HTML** (`<!DOCTYPE html>…`) instead of JSON, XML, and robots text.  
**Verified by:** `node scripts/validate-go-live.mjs` and `curl.exe` against `https://www.rase.co.in`

---

## Problem

Production probes expected:

| Path | Expected | Observed |
|------|----------|----------|
| `/api/health` | `{ "status": "ok", … }` | Full Next.js/HTML document |
| `/sitemap.xml` | XML `<urlset>` | HTML document |
| `/robots.txt` | `User-agent:` rules | HTML document |

Lighthouse SEO audit **“robots.txt is not valid”** on all key URLs (Phase 7 baseline) — consistent with HTML being served at `/robots.txt`.

---

## Trace: how routes are implemented in the repo

### 1. Next.js App Router (correct implementation)

| Route | File | Mechanism |
|-------|------|-----------|
| `/api/health` | `src/app/api/health/route.ts` | Route Handler `GET` → `NextResponse.json({ status: "ok" })` |
| `/sitemap.xml` | `src/app/sitemap.ts` | `MetadataRoute.Sitemap` |
| `/robots.txt` | `src/app/robots.ts` | `MetadataRoute.Robots` |

`next.config.js` has **no** `output: "export"` — app is a **server** deployment, not static-only.

### 2. Middleware (`src/middleware.ts`)

Matcher:

```67:69:src/middleware.ts
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
```

- Paths starting with **`api`** are **excluded** → `/api/health` does **not** run `next-intl` middleware.
- Paths containing a **dot** (`.*\\..*`) are **excluded** → `/sitemap.xml` and `/robots.txt` do **not** run intl middleware.

**Conclusion:** Middleware is **not** the cause of HTML responses for these three paths.

### 3. `firebase.json`

**Not present** in the repository. Production is not using Firebase Hosting config from this repo for the main site.

### 4. `vercel.json` — **root cause (confirmed)**

**Before fix**, the repo contained:

```1:18:vercel.json
{
    "version": 2,
    "builds": [
      {
        "src": "next.config.js",  
        "use": "@vercel/next"
      }
    ],
    "routes": [
      {
        "handle": "filesystem"
      },
      {
        "src": "/(.*)",
        "dest": "/"
      }
    ]
  }
```

**Resolution order on Vercel with legacy `routes`:**

1. `handle: filesystem` — serve static files from build output if they exist as **files**.
2. Catch-all `src: /(.*)` → `dest: /` — **rewrite every unmatched request to `/`** (homepage).

Next.js **Route Handlers** and **metadata routes** (`sitemap.xml`, `robots.txt`) are **not** static files on disk; they are served by the **Node server**. They fail step 1 and are caught by step 2, which returns the **HTML for `/`**.

That exactly matches observed behavior: status 200, body is the homepage HTML shell.

### 5. Redirects / rewrites in `next.config.js`

Only `headers()` for security headers — **no** rewrites that would cause this issue.

---

## Root cause

**Legacy Vercel `routes` catch-all** in `vercel.json` rewriting all non-filesystem requests to `/`, overriding Next.js native routing for API and metadata endpoints.

This is **not** a missing implementation in the app; the handlers exist and work when the platform routes requests to Next.js correctly.

---

## Fix (applied in Phase 8)

Replaced `vercel.json` with framework-only config (no `builds`, no `routes`):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs"
}
```

Alternatively, **delete `vercel.json` entirely** — Vercel auto-detects Next.js from `package.json`.

**Do not reintroduce** `"dest": "/"` catch-all routes on a Next.js App Router project.

---

## Verification steps

### After redeploy

```bash
node scripts/validate-go-live.mjs
node scripts/production-smoke-test.mjs
```

Expected:

- `health` → JSON with `"status":"ok"`
- `sitemap` → XML containing `<urlset`
- `robots` → lines starting with `User-agent:`

### Manual

```bash
curl.exe -sS https://www.rase.co.in/api/health
curl.exe -sS https://www.rase.co.in/robots.txt | more
curl.exe -sS https://www.rase.co.in/sitemap.xml | more
```

### Vercel dashboard

- Project → **Deployments** → latest production deployment from branch with fixed `vercel.json`
- **Functions** tab should list `/api/health` after deploy

---

## Related

- `docs/GO_LIVE_VALIDATION_REPORT.md`
- `docs/SMOKE_TEST_PLAYBOOK.md`
- `scripts/validate-go-live.mjs`
