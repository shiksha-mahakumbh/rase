# Vercel Environment Gap Analysis

**Date:** 2026-06-11  
**Project:** `dhe-projects/rase-co-in`  
**Method:** `npx vercel env ls` (existence + scope; values encrypted)

---

## Summary

| Environment | Status |
|-------------|--------|
| Production | **WARNING** |
| Preview | **FAIL** |
| Development | **WARNING** |

---

## Required variables — Production

| Variable | Present | Scope | Status | Notes |
|----------|:-------:|-------|--------|-------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Production | **WARNING** | Key added 15h ago; live SEO still `rase.co.in` — no redeploy |
| `DATABASE_URL` | ❌ | — | **FAIL** | Only `POSTGRES_PRISMA_URL` alias exists |
| `DIRECT_URL` | ❌ | — | **FAIL** | Only `POSTGRES_URL_NON_POOLING` alias exists |
| `ADMIN_OPS_SECRET` | ✅ | Production | **PASS** | Added 15h ago |
| `ADMIN_SESSION_SECRET` | ✅ | Production | **PASS** | Added 15h ago |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | Production | **PASS** | Added 15h ago |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Production | **PASS** | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Production | **PASS** | |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Production | **PASS** | |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | Production | **PASS** | Added 15h ago |

### Production aliases present

| Variable | Environments |
|----------|--------------|
| `POSTGRES_URL` | Production, Preview |
| `POSTGRES_PRISMA_URL` | Production, Preview |
| `POSTGRES_URL_NON_POOLING` | Production, Preview |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development |

---

## Required variables — Preview

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

---

## Required variables — Development

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

## Naming consistency

| Prisma requires | Vercel provides | Mapped? | Status |
|-----------------|-----------------|:-------:|--------|
| `DATABASE_URL` | `POSTGRES_PRISMA_URL` | ❌ | **FAIL** |
| `DIRECT_URL` | `POSTGRES_URL_NON_POOLING` | ❌ | **FAIL** |

---

## Critical gap: env without redeploy

Security secrets and `NEXT_PUBLIC_SITE_URL` were added to Vercel **~15 hours before this audit**, but:

- Live `GET /api/registration/SMK2026-000001` still returns **200 + PII**
- Live sitemap still **`rase.co.in`**
- Live `/api/v2/health` still **404**

**Conclusion:** Environment updates alone are insufficient without `npx vercel --prod`.

---

## Remediation (manual)

```bash
# Dashboard: map aliases
DATABASE_URL = <value of POSTGRES_PRISMA_URL>
DIRECT_URL = <value of POSTGRES_URL_NON_POOLING>

# All environments
NEXT_PUBLIC_SITE_URL=https://www.shikshamahakumbh.com

# Copy security + Supabase vars to Preview
```

**No env changes made in this audit.**
