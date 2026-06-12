# Vercel Production Checklist

**Date:** 2026-06-12  
**Project:** `dhe-projects/rase-co-in`  
**Evidence:** `npx vercel env ls`

---

## Required Variables — Production

| Variable | Present | Correct value / action |
|----------|:-------:|------------------------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Set to `https://www.shikshamahakumbh.com` |
| `DATABASE_URL` | ❌ | Copy from `POSTGRES_PRISMA_URL` |
| `DIRECT_URL` | ❌ | Copy from `POSTGRES_URL_NON_POOLING` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key |
| `ADMIN_OPS_SECRET` | ✅ | Strong random secret |
| `ADMIN_SESSION_SECRET` | ✅ | Strong random secret |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | Strong random secret |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | From Razorpay dashboard |

### Also present (supporting)

- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` (aliases)

### Legacy — remove post-migration

| Variable | Environments |
|----------|--------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development |

---

## Preview Environment

Missing all required vars except Postgres aliases. Sync before PR smoke tests.

---

## Deployment Order

1. Add `DATABASE_URL` = value of `POSTGRES_PRISMA_URL`
2. Add `DIRECT_URL` = value of `POSTGRES_URL_NON_POOLING`
3. Update `NEXT_PUBLIC_SITE_URL` = `https://www.shikshamahakumbh.com`
4. Redeploy production (env changes require redeploy)
5. Remove `FIREBASE_SERVICE_ACCOUNT_JSON` after migration verified
6. Sync Preview env for staging validation

---

## CLI Commands

```bash
npx vercel env ls
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
# Update NEXT_PUBLIC_SITE_URL via dashboard or:
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
```

---

## Post-Env Verification

```bash
npx vercel env ls | findstr DATABASE_URL
npx vercel env ls | findstr DIRECT_URL
npx vercel env ls | findstr SITE_URL
```

---

*Encrypted values not readable from CLI; live SEO used as proxy for incorrect SITE_URL.*
