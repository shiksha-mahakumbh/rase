# Vercel Environment Verification

**Date:** 2026-06-10  
**Project:** `dhe-projects/rase-co-in`  
**Method:** `npx vercel env ls` (existence + scope only; values not read)

---

## Summary

| Environment | Required 10/10 | Verdict |
|-------------|:--------------:|---------|
| Production | 7/10 | **CONDITIONAL GO** |
| Preview | 3/10 | **NO GO** |
| Development | 6/10 | **CONDITIONAL GO** |

---

## Required variables matrix

| Variable | Production | Preview | Development |
|----------|:----------:|:-------:|:-----------:|
| `ADMIN_OPS_SECRET` | ✅ | ❌ | ✅ |
| `ADMIN_SESSION_SECRET` | ✅ | ❌ | ✅ |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | ❌ | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ❌ | ✅ |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ Key exists; live ineffective | ❌ | ⚠️ Key exists |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ❌ | ❌ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ❌ | ❌ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | ❌ |
| `DATABASE_URL` | ❌ | ❌ | ❌ |
| `DIRECT_URL` | ❌ | ❌ | ❌ |

---

## Naming consistency — `DATABASE_URL` / `DIRECT_URL`

| Prisma expects | Vercel has | Mapped? |
|----------------|------------|:-------:|
| `DATABASE_URL` | `POSTGRES_PRISMA_URL` (Prod, Preview, Dev) | ❌ No explicit alias |
| `DIRECT_URL` | `POSTGRES_URL_NON_POOLING` (Prod, Preview, Dev) | ❌ No explicit alias |

**Risk:** Prisma schema (`prisma/schema.prisma`) requires `env("DATABASE_URL")` and `env("DIRECT_URL")`. Vercel may auto-map via Supabase integration — not confirmed in build logs.

---

## Production — full inventory from `vercel env ls`

### Security + site ✅

- `ADMIN_OPS_SECRET`, `ADMIN_SESSION_SECRET`, `REGISTRATION_LOOKUP_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`

### Supabase ✅

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`, etc.

### Other ✅

- `FIREBASE_SERVICE_ACCOUNT_JSON`, `RECAPTCHA_*`, `RAZORPAY_KEY_*`

### Flagged issues ⚠️

| Issue | Evidence |
|-------|----------|
| `NEXT_PUBLIC_SITE_URL` not effective on live | Sitemap/canonical still `rase.co.in` |
| Env vars added ~1h ago, no redeploy | Live security still fails |
| `DATABASE_URL`/`DIRECT_URL` missing by name | Alias gap |

---

## Preview — scope

**Present:** `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_PASSWORD`, `FIREBASE_SERVICE_ACCOUNT_JSON`

**Missing (all required security + Supabase + site vars):** Everything else in required list.

**Verdict: Preview NOT READY**

---

## Development — scope

**Present:** All 4 security secrets, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, `FIREBASE_SERVICE_ACCOUNT_JSON`, `POSTGRES_*` (4 vars)

**Missing:** `DATABASE_URL`, `DIRECT_URL`, all Supabase public/service keys

---

## Domain / placeholder flags

| Check | Result |
|-------|--------|
| Localhost URLs in Vercel | Not verified (values encrypted) |
| Live site uses localhost | ❌ No — uses `rase.co.in` fallback |
| `NEXT_PUBLIC_SITE_URL` domain mismatch | Live SEO ≠ `.com` traffic host |

---

## Remediation (manual)

1. `DATABASE_URL` = copy `POSTGRES_PRISMA_URL` → Production, Preview, Development
2. `DIRECT_URL` = copy `POSTGRES_URL_NON_POOLING` → all environments
3. `NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com` → all environments
4. Copy security + Supabase vars to Preview
5. `npx vercel --prod`

**No env changes made.**
