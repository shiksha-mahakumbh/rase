# Vercel Environment Verification

**Date:** 2026-05-29  
**Project:** `dhe-projects/rase-co-in`  
**Command:** `npx vercel env ls` (Production)

---

## Required Variables Checklist

| Variable | Present | Notes |
|----------|:-------:|-------|
| `DATABASE_URL` | ❌ | **Missing by exact name** — use `POSTGRES_PRISMA_URL` value |
| `DIRECT_URL` | ❌ | **Missing by exact name** — use `POSTGRES_URL_NON_POOLING` value |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Encrypted — live SEO suggests wrong value (`rase.co.in`) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Also `SUPABASE_URL` present |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Also `SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Present |
| `ADMIN_OPS_SECRET` | ✅ | Present |
| `ADMIN_SESSION_SECRET` | ✅ | Present |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | Present |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | Present |

**Score:** 8/10 required vars present by name; 2 Prisma aliases missing; SITE_URL value unverified (live proxy indicates incorrect).

---

## Supporting Variables (present)

- `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_URL`, `POSTGRES_*`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `SUPABASE_JWT_SECRET`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`

---

## Legacy — Remove Post-Cutover

| Variable | Environments |
|----------|--------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development |

Still present 3 days after remediation. Remove after Firebase import verified and production stable on Supabase.

---

## Preview Environment

Incomplete — missing most app secrets except Postgres aliases. Sync before PR smoke tests per `VERCEL_PRODUCTION_CHECKLIST.md`.

---

## Required Operator Actions

```bash
# 1. Add Prisma-named aliases (copy from existing Postgres vars)
vercel env add DATABASE_URL production
# Value = POSTGRES_PRISMA_URL

vercel env add DIRECT_URL production
# Value = POSTGRES_URL_NON_POOLING

# 2. Update canonical site URL
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# Value = https://www.shikshamahakumbh.com

# 3. Redeploy
npx vercel --prod
```

---

## Production Deploy Status

Latest production deployments: ~3 days old (`npx vercel ls --prod`). No deploy from remediated HEAD.

---

## Verdict

| Gate | Result |
|------|--------|
| Secrets present | ⚠️ Partial — aliases exist, names wrong |
| SITE_URL correct | ❌ Live evidence contradicts |
| Legacy Firebase | ❌ Still configured |
| Redeploy | ❌ Not done |

**Vercel readiness: NO GO**

---

*CLI output captured 2026-05-29; encrypted values not readable.*
