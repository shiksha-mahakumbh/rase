# Final Vercel Readiness

**Date:** June 2026  
**Project:** `dhe-projects/rase-co-in`  
**CLI account:** `internsdhe`  
**Linked:** ✅ (`.vercel/project.json` present)

---

## Readiness summary

| Environment | Score | Verdict |
|-------------|------:|---------|
| **Production** | 72/100 | **CONDITIONAL** — core secrets present; DB naming + domain gap |
| **Preview** | 35/100 | **NOT READY** — security + Supabase vars missing |
| **Development** | 68/100 | **CONDITIONAL** — secrets present; no Supabase public keys |

**Overall Vercel readiness: CONDITIONAL GO (Production deploy possible with caveats)**

---

## Production environment

### Present ✅

| Variable | Purpose |
|----------|---------|
| `ADMIN_OPS_SECRET` | CMS API gateway |
| `ADMIN_SESSION_SECRET` | Signed admin cookie |
| `REGISTRATION_LOOKUP_SECRET` | Post-registration lookup |
| `NEXT_PUBLIC_SITE_URL` | Canonical (currently `.org` — see domain doc) |
| `RAZORPAY_WEBHOOK_SECRET` | Payment webhook HMAC |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Server storage |
| `POSTGRES_*` (6 vars) | DB connection via integration |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Registration backend |
| `RECAPTCHA_*` | Bot protection |
| `RAZORPAY_KEY_*` | Live payments |

### Missing / unclear ⚠️

| Variable | Risk |
|----------|------|
| `DATABASE_URL` (explicit) | Prisma reads `DATABASE_URL` — may need alias from `POSTGRES_PRISMA_URL` |
| `DIRECT_URL` (explicit) | Migrations need direct connection |
| Security vars on **Preview** | Preview deploys fail admin CMS tests |

### Dangerous (expected) 🔒

- `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_OPS_SECRET`, `FIREBASE_SERVICE_ACCOUNT_JSON`, `RAZORPAY_KEY_SECRET` — all server-only ✅

---

## Preview environment

### Present ✅

| Variable | Environments |
|----------|--------------|
| `POSTGRES_URL` | Preview |
| `POSTGRES_PRISMA_URL` | Preview |
| `POSTGRES_URL_NON_POOLING` | Preview |
| `POSTGRES_PASSWORD` | Preview |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Preview |

### Missing ❌ (blocking Preview QA)

| Variable |
|----------|
| `ADMIN_OPS_SECRET` |
| `ADMIN_SESSION_SECRET` |
| `REGISTRATION_LOOKUP_SECRET` |
| `NEXT_PUBLIC_SITE_URL` |
| `RAZORPAY_WEBHOOK_SECRET` |
| `NEXT_PUBLIC_SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` |
| `RECAPTCHA_*` |
| `RAZORPAY_KEY_*` |

**CLI note:** Vercel CLI v54 requires branch selection for Preview vars; Dashboard → "All Previews" is fastest fix.

---

## Development environment

### Present ✅

| Variable |
|----------|
| All 5 security/site vars (added today) |
| `POSTGRES_*` (4 vars) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` |

### Missing ❌

| Variable |
|----------|
| `NEXT_PUBLIC_SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` |
| `RECAPTCHA_*` |
| `RAZORPAY_KEY_*` |

---

## Build configuration

| Setting | Status |
|---------|--------|
| `vercel.json` | `{ "framework": "nextjs" }` only |
| `postinstall: prisma generate` | ✅ Added to `package.json` |
| `build` command | Default `next build` |
| Node version pin | ❌ Not set |
| Build-time DB for SSG | Required — `POSTGRES_PRISMA_URL` must be available at build |

### Recommended Vercel build env mapping

If `DATABASE_URL` is absent on Production, add:

```
DATABASE_URL = $POSTGRES_PRISMA_URL
DIRECT_URL = $POSTGRES_URL_NON_POOLING
```

Or set explicitly to Supabase pooler/direct URLs (same as local `.env`).

---

## Unused / duplicate variables on Vercel

| Variable | Recommendation |
|----------|----------------|
| `SUPABASE_URL` | Alias of `NEXT_PUBLIC_SUPABASE_URL` — consolidate |
| `SUPABASE_ANON_KEY` | Duplicate — remove after confirming app uses `NEXT_PUBLIC_*` |
| `SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` | New-format keys — map or remove |
| `SUPABASE_JWT_SECRET` | Not used in app code |

---

## Pre-deploy Vercel checklist

```
[ ] Map DATABASE_URL + DIRECT_URL on Production
[ ] Set NEXT_PUBLIC_SITE_URL=https://shikshamahakumbh.com (canonical decision)
[ ] Add 5 security vars + Supabase vars to Preview (All Previews)
[ ] Confirm shikshamahakumbh.com assigned to Production domain
[ ] npx vercel env pull .env.vercel.production --environment=production
[ ] npx vercel --prod (after checklist complete)
```

---

## Verdict

| Question | Answer |
|----------|--------|
| Production deployable today? | **CONDITIONAL** — with DB URL mapping + domain fix |
| Preview deployable for QA? | **NO** — env gaps |
| Auto-deploy recommended? | **NO** |
