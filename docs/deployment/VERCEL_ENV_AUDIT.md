# Vercel Environment Audit

**Date:** June 2026  
**Project:** `dhe-projects/rase-co-in`  
**CLI user:** `internsdhe`

---

## Summary

| Environment | Core vars | Supabase vars | Security vars | Gap severity |
|-------------|-----------|---------------|---------------|--------------|
| **Production** | Partial | Present | Present (5/5 new) | **MEDIUM** |
| **Preview** | Partial | Partial (POSTGRES_*) | **MISSING** | **HIGH** |
| **Development** | Partial | Missing | Present (5/5 new) | **MEDIUM** |

Local env check: **21/21 PASS** (`staging-env-check.mjs`)

---

## Required variables — status on Vercel

| Variable | Code usage | Production | Preview | Development |
|----------|------------|------------|---------|-------------|
| `ADMIN_OPS_SECRET` | Admin gateway, CMS API | ✅ | ❌ | ✅ |
| `ADMIN_SESSION_SECRET` | Signed session cookie | ✅ | ❌ | ✅ |
| `REGISTRATION_LOOKUP_SECRET` | Post-registration lookup | ✅ | ❌ | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Sitemap, OG, canonical | ✅ (`.org`) | ❌ | ✅ (`.org`) |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook HMAC | ✅ | ❌ | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client | ✅ | ❌ | ❌ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client | ✅ | ❌ | ❌ |
| `SUPABASE_SERVICE_ROLE_KEY` | Storage, admin client | ✅ | ❌ | ❌ |
| `DATABASE_URL` | Prisma (as `POSTGRES_PRISMA_URL`?) | ⚠️ See note | ✅ `POSTGRES_*` | ✅ `POSTGRES_*` |
| `DIRECT_URL` | Migrations | ⚠️ See note | ✅ `POSTGRES_URL_NON_POOLING` | ✅ |

### DATABASE_URL naming note

Vercel Supabase integration exposes:
- `POSTGRES_PRISMA_URL` (pooler)
- `POSTGRES_URL_NON_POOLING` (direct)

**Prisma expects `DATABASE_URL` and `DIRECT_URL`.** Production has `POSTGRES_*` vars but may lack explicit `DATABASE_URL` unless mapped in build or env alias.

**Action:** Verify Production has `DATABASE_URL` + `DIRECT_URL` OR `vercel-build` maps `POSTGRES_PRISMA_URL` → `DATABASE_URL`.

---

## Present on Vercel (full list)

| Variable | Environments |
|----------|--------------|
| `ADMIN_OPS_SECRET` | Production, Development |
| `ADMIN_SESSION_SECRET` | Production, Development |
| `REGISTRATION_LOOKUP_SECRET` | Production, Development |
| `NEXT_PUBLIC_SITE_URL` | Production, Development |
| `RAZORPAY_WEBHOOK_SECRET` | Production, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Production |
| `SUPABASE_*` (6 legacy names) | Production |
| `POSTGRES_*` (5 vars) | Production, Preview, Development |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development |
| `RECAPTCHA_*` | Production |
| `RAZORPAY_KEY_*` | Production |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Production |

---

## Missing variables

### Production gaps

| Variable | Risk |
|----------|------|
| Explicit `DATABASE_URL` / `DIRECT_URL` | Prisma may not connect if only `POSTGRES_*` names exist |
| `RECAPTCHA_*` on Development | Local dev only — low |
| Security vars on Preview | Preview deploys lack admin/lookup secrets |

### Preview gaps (critical)

All 5 newly configured secrets **missing on Preview**:
- `ADMIN_OPS_SECRET`
- `ADMIN_SESSION_SECRET`
- `REGISTRATION_LOOKUP_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `RAZORPAY_WEBHOOK_SECRET`

Plus: Supabase public/service keys not on Preview.

**Fix:** Vercel Dashboard → Environment Variables → Add each for **Preview → All Previews**.

---

## Unused / duplicate variables

| Variable | Status |
|----------|--------|
| `SUPABASE_URL` | Duplicate of `NEXT_PUBLIC_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | Duplicate of `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `SUPABASE_PUBLISHABLE_KEY` | New-format key; code uses `NEXT_PUBLIC_*` |
| `SUPABASE_SECRET_KEY` | New-format; code uses `SUPABASE_SERVICE_ROLE_KEY` |
| `SUPABASE_JWT_SECRET` | Not referenced in app code |
| `POSTGRES_USER/HOST/DATABASE` | Vercel integration artifacts; Prisma uses connection strings |

**Recommendation:** Consolidate to canonical names; remove duplicates after migration.

---

## Dangerous variables

| Variable | Risk | Mitigation |
|----------|------|------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS | Server-only; never `NEXT_PUBLIC_` |
| `ADMIN_OPS_SECRET` | Full CMS API access | Server-only |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Full Firebase admin | Server-only; rotate if exposed |
| `RAZORPAY_KEY_SECRET` | Payment refunds | Server-only |
| Live Razorpay keys on Production | Real money | Expected for prod; use test keys on Preview |

---

## `vercel.json` audit

```json
{ "framework": "nextjs" }
```

| Setting | Status |
|---------|--------|
| `postinstall` / `prisma generate` | ✅ Added to `package.json` (this audit) |
| `buildCommand` with migrate | ❌ Not configured |
| Node version pin | ❌ Not in `vercel.json` |

---

## Recommendations

1. Add all 5 security + site vars to **Preview (All Previews)**
2. Add `DATABASE_URL` + `DIRECT_URL` to Production (or document `POSTGRES_*` mapping)
3. Align `NEXT_PUBLIC_SITE_URL` to canonical domain (see `DOMAIN_MISMATCH_AUDIT.md`)
4. Run `npx vercel env pull .env.vercel` to verify Production values
5. Redeploy after env changes
