# Environment Readiness Report

**Date:** 2026-06-11  
**Project:** `dhe-projects/rase-co-in`  
**Method:** `npx vercel env ls`, local `scripts/staging-env-check.mjs`, `scripts/staging-db-url-audit.mjs`  
**Values:** Encrypted on Vercel — presence and scope only

---

## Summary by environment

| Environment | Verdict | Blockers |
|-------------|---------|----------|
| **Production** | **WARNING** | `DATABASE_URL`/`DIRECT_URL` alias gap; env not effective without redeploy |
| **Preview** | **FAIL** | Missing all security + Supabase + site URL vars |
| **Development** | **WARNING** | Missing DB URL aliases + Supabase public keys |
| **Local (`.env`)** | **PASS** | 21/21 keys per `docs/staging/env-check-result.json` |

---

## Required variables — checklist

### Production

| Variable | Required | Present | Status | Notes |
|----------|:--------:|:-------:|--------|-------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | ✅ | **WARNING** | Added ~16h ago; live SEO still `rase.co.in` |
| `DATABASE_URL` | ✅ | ❌ | **FAIL** | Use `POSTGRES_PRISMA_URL` value |
| `DIRECT_URL` | ✅ | ❌ | **FAIL** | Use `POSTGRES_URL_NON_POOLING` value |
| `ADMIN_OPS_SECRET` | ✅ | ✅ | **PASS** | Production + Development |
| `ADMIN_SESSION_SECRET` | ✅ | ✅ | **PASS** | Production + Development |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | ✅ | **PASS** | Production + Development |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | **PASS** | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | **PASS** | |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | **PASS** | |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ✅ | **PASS** | Production + Development |

**Production aliases available (not mapped to Prisma names):**

| Vercel name | Scope |
|-------------|-------|
| `POSTGRES_URL` | Production, Preview |
| `POSTGRES_PRISMA_URL` | Production, Preview |
| `POSTGRES_URL_NON_POOLING` | Production, Preview |
| `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE` | Production (+ Preview for password) |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY` | Production (duplicates) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development |

### Preview

| Variable | Present | Status |
|----------|:-------:|--------|
| `NEXT_PUBLIC_SITE_URL` | ❌ | **FAIL** |
| `DATABASE_URL` | ❌ | **FAIL** |
| `DIRECT_URL` | ❌ | **FAIL** |
| `ADMIN_OPS_SECRET` | ❌ | **FAIL** |
| `ADMIN_SESSION_SECRET` | ❌ | **FAIL** |
| `REGISTRATION_LOOKUP_SECRET` | ❌ | **FAIL** |
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ | **FAIL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ | **FAIL** |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | **FAIL** |
| `RAZORPAY_WEBHOOK_SECRET` | ❌ | **FAIL** |

**Preview present:** `POSTGRES_*` (3), `POSTGRES_PASSWORD`, `FIREBASE_SERVICE_ACCOUNT_JSON` only.

**Preview verdict: FAIL**

### Development

| Variable | Present | Status |
|----------|:-------:|--------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | **PASS** |
| `DATABASE_URL` | ❌ | **FAIL** |
| `DIRECT_URL` | ❌ | **FAIL** |
| `ADMIN_OPS_SECRET` | ✅ | **PASS** |
| `ADMIN_SESSION_SECRET` | ✅ | **PASS** |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | **PASS** |
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ | **FAIL** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ | **FAIL** |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | **FAIL** |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | **PASS** |

**Development verdict: WARNING**

---

## Prisma naming gap

| Prisma expects | Vercel provides | Mapped? | Status |
|----------------|-----------------|:-------:|--------|
| `DATABASE_URL` | `POSTGRES_PRISMA_URL` | ❌ | **FAIL** |
| `DIRECT_URL` | `POSTGRES_URL_NON_POOLING` | ❌ | **FAIL** |

**Impact:** `/api/v2/health` on current deploy returns 404; on new deploy without mapping, health would report `database: "not_configured"`.

---

## Env vs live behavior gap

Security secrets and `NEXT_PUBLIC_SITE_URL` were added to Vercel **~16 hours before this audit**, but live behavior is unchanged:

| Signal | Expected after env update | Live (2026-06-11) |
|--------|---------------------------|-------------------|
| Registration GET | 401 | **200 + PII** |
| Sitemap domain | `.com` (if value set) | **`rase.co.in`** |
| `/api/v2/health` | 200 | **404** |

**Conclusion:** `NEXT_PUBLIC_*` vars require rebuild; security code requires redeploy. Env alone is insufficient.

**Last production deployment:** ~2 days ago per `npx vercel ls`.

---

## Local environment — PASS

`node scripts/staging-env-check.mjs` (cached `docs/staging/env-check-result.json`, 2026-06-10):

- **21/21** keys present including `DATABASE_URL`, `DIRECT_URL`, all security secrets, Supabase, Razorpay, Firebase.

**Note:** Local `NEXT_PUBLIC_SITE_URL` = `shikshamahakumbh.org` (per prior audits) — misaligned with recommended `.com`.

---

## Remediation commands (manual — not executed)

```bash
# Vercel Dashboard → Project rase-co-in → Settings → Environment Variables

# 1. Map Prisma (all environments: Production, Preview, Development)
DATABASE_URL     = <copy value from POSTGRES_PRISMA_URL>
DIRECT_URL       = <copy value from POSTGRES_URL_NON_POOLING>

# 2. Canonical (all environments)
NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com

# 3. Copy from Production → Preview:
ADMIN_OPS_SECRET, ADMIN_SESSION_SECRET, REGISTRATION_LOOKUP_SECRET,
RAZORPAY_WEBHOOK_SECRET, NEXT_PUBLIC_SUPABASE_URL,
NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
RECAPTCHA_SECRET_KEY, NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID

# 4. Redeploy
npx vercel --prod
```

---

## Readiness verdict

| Category | Status |
|----------|--------|
| Production secrets | **PASS** (presence) |
| Production DB URL naming | **FAIL** |
| Production env effectiveness | **FAIL** (no redeploy) |
| Preview completeness | **FAIL** |
| Development completeness | **WARNING** |
| Local dev env | **PASS** |

**Overall environment readiness: WARNING / FAIL** — blocks GO until Preview fixed, aliases mapped, and production redeployed.

**No environment changes made in this audit.**
