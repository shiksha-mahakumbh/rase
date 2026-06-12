# Vercel Deployment Report

**Date:** June 2026  
**Current `vercel.json`:** `{ "framework": "nextjs" }` only

---

## Build configuration audit

| Setting | Current | Recommendation |
|---------|---------|----------------|
| Framework | `nextjs` | ✅ Correct |
| Build command | Default `next build` | Add explicit `prisma generate` |
| Install command | Default `npm install` | ✅ |
| Output directory | Default `.next` | ✅ |
| Node version | Not pinned | Pin **20.x** in `engines` or Vercel settings |
| `postinstall` | **Missing** | Add `prisma generate` |

### Recommended `package.json` addition

```json
"scripts": {
  "postinstall": "prisma generate",
  "vercel-build": "prisma generate && prisma migrate deploy && next build"
}
```

**Note:** `migrate deploy` in build is optional — prefer running migrations as a **pre-deploy step** or Vercel build command to avoid race conditions. Minimum: `prisma generate` in `postinstall`.

---

## Required Vercel environment variables

### Server-only (encrypted)

```
ADMIN_OPS_SECRET
ADMIN_SESSION_SECRET
REGISTRATION_LOOKUP_SECRET
DATABASE_URL
DIRECT_URL
SUPABASE_SERVICE_ROLE_KEY
FIREBASE_SERVICE_ACCOUNT_JSON
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
RECAPTCHA_SECRET_KEY
SMTP_HOST
SMTP_USER
SMTP_PASS
REGISTRATION_BACKEND=firebase
```

### Public (client-safe)

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_RECAPTCHA_SITE_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID
NEXT_PUBLIC_FIREBASE_API_KEY (optional — inline fallback exists)
```

---

## Build flow

```
npm install
  → postinstall: prisma generate    # REQUIRED — @prisma/client needs generation
next build
  → TypeScript compile
  → Server components + API routes bundled
  → No DB connection required at build time (unless SSG pages query DB)
```

**Current risk:** Without `postinstall`, Vercel build may fail on `@prisma/client` if client not pre-generated.

---

## Prisma on Vercel

| Concern | Mitigation |
|---------|------------|
| Serverless connection pooling | Use Supabase pooler URL (port 6543, `pgbouncer=true`) |
| Migration timing | Run `migrate deploy` before or during deploy — not after traffic |
| `directUrl` for migrations | Use port 5432 URL in `DIRECT_URL` only |
| Cold start DB errors | Ensure `DATABASE_URL` set on Preview + Production |

---

## Supabase on Vercel

| Component | Env vars needed |
|-----------|-----------------|
| Prisma CMS queries | `DATABASE_URL` |
| File storage uploads | `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` |
| Client (if any) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

`isSupabaseConfigured()` returns false until all three DB/Supabase vars set.

---

## Post-deploy verification

```bash
# 1. Health
curl https://<staging>/api/v2/health

# 2. Public CMS API
curl https://<staging>/api/v2/notices
curl https://<staging>/api/v2/speakers

# 3. Security
curl https://<staging>/api/registration/SMK2026-000001
# Expect: 401

# 4. SEO
curl https://<staging>/sitemap.xml
curl https://<staging>/robots.txt

# 5. Admin (browser)
# Login → verify /admin/cms loads → create test notice
```

---

## Preview vs Production

| Setting | Preview (staging) | Production |
|---------|-------------------|------------|
| Supabase project | Staging project | Production project |
| Razorpay keys | Test mode | Live mode |
| `NEXT_PUBLIC_SITE_URL` | Preview URL or staging domain | `https://www.rase.co.in` |
| Firebase project | Can share or use staging | Production project |
| Secrets | Unique per environment | Unique per environment |

**Never share `SUPABASE_SERVICE_ROLE_KEY` or `ADMIN_OPS_SECRET` between team members in chat.**

---

## Deployment blockers for Vercel

| Blocker | Severity |
|---------|----------|
| 8 missing env vars | P0 |
| No `postinstall` prisma generate | P1 |
| `DATABASE_URL` points to localhost in Vercel | P0 (must use cloud URL) |
| Migrations not run | P0 |
| Seeds not run | P1 |

---

## Verdict

| Item | Ready? |
|------|--------|
| Next.js build config | ⚠️ Needs `postinstall` |
| Env vars on Vercel | ❌ Not configured |
| Prisma client generation | ⚠️ Manual only today |
| Staging deploy | ❌ BLOCKED |
