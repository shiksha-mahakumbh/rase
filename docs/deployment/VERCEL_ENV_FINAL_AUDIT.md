# Vercel Environment Final Audit

**Date:** 2026-06-10  
**Project:** `dhe-projects/rase-co-in`  
**Method:** `npx vercel env ls` + targeted `vercel env pull` (production keys only, file deleted after audit)

---

## Summary

| Environment | Required vars present | Critical gaps | Verdict |
|-------------|---------------------|---------------|---------|
| **Production** | 7/10 explicit | `DATABASE_URL`, `DIRECT_URL`, empty `NEXT_PUBLIC_SITE_URL` | **CONDITIONAL** |
| **Preview** | 3/10 | All security secrets, Supabase public keys | **NOT READY** |
| **Development** | 6/10 | Supabase public keys, explicit DB URLs | **CONDITIONAL** |

---

## Required variables checklist

| Variable | Production | Preview | Development |
|----------|:----------:|:-------:|:-----------:|
| `DATABASE_URL` | ❌ Missing | ❌ Missing | ❌ Missing |
| `DIRECT_URL` | ❌ Missing | ❌ Missing | ❌ Missing |
| `POSTGRES_PRISMA_URL` | ✅ | ✅ | ✅ |
| `POSTGRES_URL_NON_POOLING` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ❌ | ❌ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ❌ | ❌ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | ❌ |
| `ADMIN_OPS_SECRET` | ✅ | ❌ | ✅ |
| `ADMIN_SESSION_SECRET` | ✅ | ❌ | ✅ |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | ❌ | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ❌ | ✅ |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ **EMPTY** | ❌ | ⚠️ Set but value unknown |

**Source:** `npx vercel env ls` output 2026-06-10

---

## Production environment

### Present ✅

| Variable | Environments | Notes |
|----------|--------------|-------|
| `ADMIN_OPS_SECRET` | Production, Development | Added ~46m before audit |
| `ADMIN_SESSION_SECRET` | Production, Development | |
| `REGISTRATION_LOOKUP_SECRET` | Production, Development | |
| `RAZORPAY_WEBHOOK_SECRET` | Production, Development | |
| `NEXT_PUBLIC_SITE_URL` | Production, Development | **Key exists; value is empty string on Production** |
| `NEXT_PUBLIC_SUPABASE_URL` | Production | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | |
| `POSTGRES_URL` | Production, Preview | Supabase integration |
| `POSTGRES_PRISMA_URL` | Production, Preview | Pooled connection |
| `POSTGRES_URL_NON_POOLING` | Production, Preview | Direct connection |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development | |
| `RECAPTCHA_*` | Production | |
| `RAZORPAY_KEY_*` | Production | Live keys |

### Missing / incorrect ⚠️

| Issue | Risk | Remediation |
|-------|------|-------------|
| `DATABASE_URL` not mapped | Prisma expects `env("DATABASE_URL")` in schema | Map `DATABASE_URL` = `POSTGRES_PRISMA_URL` |
| `DIRECT_URL` not mapped | `prisma migrate deploy` needs direct URL | Map `DIRECT_URL` = `POSTGRES_URL_NON_POOLING` |
| `NEXT_PUBLIC_SITE_URL` empty | Falls back to `rase.co.in` — **verified on live site** | Set `https://www.shikshamahakumbh.com` |
| Env changed without redeploy | Live site still shows 2026-06-09 sitemap | `npx vercel --prod` after env fix |

### Naming mismatches

| Vercel has | Code expects | Status |
|------------|--------------|--------|
| `POSTGRES_PRISMA_URL` | `DATABASE_URL` | Alias needed |
| `POSTGRES_URL_NON_POOLING` | `DIRECT_URL` | Alias needed |
| `SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Both present on Production ✅ |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Non-standard Supabase naming | Present; verify SDK usage |

---

## Preview environment

### Present ✅

| Variable | Notes |
|----------|-------|
| `POSTGRES_URL` | DB connection |
| `POSTGRES_PRISMA_URL` | Pooled |
| `POSTGRES_URL_NON_POOLING` | Direct |
| `POSTGRES_PASSWORD` | |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | |

### Missing ❌

| Variable | Impact |
|----------|--------|
| `ADMIN_OPS_SECRET` | Admin CMS API fails |
| `ADMIN_SESSION_SECRET` | Admin session signing fails |
| `REGISTRATION_LOOKUP_SECRET` | Registration lookup tokens fail |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook tests fail |
| `NEXT_PUBLIC_SITE_URL` | Wrong/missing canonical |
| `NEXT_PUBLIC_SUPABASE_URL` | Client Supabase broken |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client Supabase broken |
| `SUPABASE_SERVICE_ROLE_KEY` | Server storage broken |
| `RECAPTCHA_*` | Registration bot protection |
| `RAZORPAY_KEY_*` | Payment tests |
| `DATABASE_URL` / `DIRECT_URL` | Prisma alias gap |

**Verdict: Preview NOT READY for staging QA**

---

## Development environment

### Present ✅

Security secrets, `FIREBASE_SERVICE_ACCOUNT_JSON`, `POSTGRES_*` (4 vars)

### Missing ❌

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, explicit `DATABASE_URL`/`DIRECT_URL`

---

## Security concerns

| # | Concern | Severity |
|---|---------|----------|
| 1 | `NEXT_PUBLIC_SITE_URL` empty → unintended `rase.co.in` canonical on Production | **P0** |
| 2 | Preview lacks all P0 security secrets | **P0** |
| 3 | `SUPABASE_SERVICE_ROLE_KEY` only on Production — correct scope, but Preview cannot test storage | **P1** |
| 4 | Live production not redeployed after recent secret injection | **P0** |
| 5 | `vercel env pull` exposes full secrets locally — delete immediately after audit | **P1** |
| 6 | No `DATABASE_URL` alias — build on Vercel may rely on Supabase integration auto-mapping (unverified) | **P1** |

---

## Recommended actions (manual)

```bash
# 1. Set canonical (all environments)
npx vercel env add NEXT_PUBLIC_SITE_URL production
# Value: https://www.shikshamahakumbh.com

# 2. Map Prisma URLs (Production + Preview)
npx vercel env add DATABASE_URL production
# Value: copy from POSTGRES_PRISMA_URL

npx vercel env add DIRECT_URL production
# Value: copy from POSTGRES_URL_NON_POOLING

# 3. Copy security vars to Preview (Dashboard recommended — CLI requires branch)
# ADMIN_OPS_SECRET, ADMIN_SESSION_SECRET, REGISTRATION_LOOKUP_SECRET,
# RAZORPAY_WEBHOOK_SECRET, NEXT_PUBLIC_SITE_URL

# 4. Redeploy
npx vercel --prod
```

---

## Local environment (reference)

`node scripts/staging-env-check.mjs` → **21/21 PASS** (2026-06-10)

Local has all required vars including `DATABASE_URL`, `DIRECT_URL`, and `NEXT_PUBLIC_SITE_URL=https://shikshamahakumbh.org` (differs from recommended `.com`).
