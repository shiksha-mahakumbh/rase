# Vercel Production Signoff

**Date:** 2026-05-29  
**Project:** `dhe-projects/rase-co-in`  
**Production deploy:** `dpl_4LbmLW5RKASduH6dWXoHnrFuNLtt` (~3 days old)

---

## Required Production Variables

| Variable | Present | Signoff |
|----------|:-------:|---------|
| `DATABASE_URL` | ❌ | Copy from `POSTGRES_PRISMA_URL` |
| `DIRECT_URL` | ❌ | Copy from `POSTGRES_URL_NON_POOLING` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Value unverified — live SEO uses `rase.co.in` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Also `SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Also `SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | |
| `ADMIN_OPS_SECRET` | ✅ | |
| `ADMIN_SESSION_SECRET` | ✅ | |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | |

**Score:** 8/10 by name; 2 Prisma aliases missing; SITE_URL value incorrect on live.

---

## Supporting Variables (Production)

Present: `POSTGRES_*`, `RAZORPAY_*`, `RECAPTCHA_*`, `SUPABASE_JWT_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`

---

## Legacy — Remove Post-Cutover

| Variable | Environments |
|----------|--------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development |

---

## Preview Environment Parity — ❌ FAIL

| Variable | Preview |
|----------|---------|
| `POSTGRES_URL` | ✅ |
| `POSTGRES_PRISMA_URL` | ✅ |
| `POSTGRES_URL_NON_POOLING` | ✅ |
| `POSTGRES_PASSWORD` | ✅ |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | ✅ (legacy) |
| All app secrets (Supabase, admin, Razorpay, SITE_URL) | ❌ **Missing** |

Preview cannot run smoke tests without full env sync.

---

## Required Pre-Launch Commands

```bash
# Add Prisma-named aliases (values from existing POSTGRES_* vars)
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production

# Fix canonical URL
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# → https://www.shikshamahakumbh.com

# Sync Preview (repeat all Production secrets)
vercel env pull .env.preview --environment=preview

# Verify
npx vercel env ls production
npx vercel env ls preview
```

---

## Deploy Status

| Check | Status |
|-------|--------|
| Latest prod deploy age | ~3 days (pre-remediation) |
| Deploy from remediated HEAD | ❌ Not done |
| Alias | `https://www.rase.co.in` |

---

## Signoff

| Gate | Result |
|------|--------|
| Production secrets (by name) | ❌ **NOT APPROVED** |
| Preview parity | ❌ **NOT APPROVED** |
| Production deploy current | ❌ **NOT APPROVED** |

**Vercel production signoff: NO GO**

---

*Evidence: `npx vercel env ls production|preview`, `npx vercel ls --prod` — 2026-05-29.*
