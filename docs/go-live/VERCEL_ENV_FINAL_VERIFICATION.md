# Vercel Environment Final Verification

**Date:** 2026-05-29  
**Project:** `dhe-projects/rase-co-in`  
**Method:** `npx vercel env ls production` + live HTTP probes

---

## Required Variables

| Variable | Present (by name) | Signoff |
|----------|:-----------------:|---------|
| `DATABASE_URL` | ❌ | **FAIL** — use `POSTGRES_PRISMA_URL` value |
| `DIRECT_URL` | ❌ | **FAIL** — use `POSTGRES_URL_NON_POOLING` value |
| `NEXT_PUBLIC_SITE_URL` | ✅ | **UNVERIFIED value** — live SEO uses `rase.co.in` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Present |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Present |

**Score:** 3/5 by name; 2 missing Prisma aliases; SITE_URL value incorrect on live.

---

## Supporting Variables (present)

| Variable | Status |
|----------|--------|
| `POSTGRES_PRISMA_URL` | ✅ Production + Preview |
| `POSTGRES_URL_NON_POOLING` | ✅ Production + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ |
| `ADMIN_OPS_SECRET` | ✅ |
| `ADMIN_SESSION_SECRET` | ✅ |
| `REGISTRATION_LOOKUP_SECRET` | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ |

---

## Legacy (remove post-migration)

| Variable | Environments |
|----------|--------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development |

---

## Required Mappings (operator action)

| Add / update | Copy from / set to |
|--------------|-------------------|
| `DATABASE_URL` | Value of `POSTGRES_PRISMA_URL` |
| `DIRECT_URL` | Value of `POSTGRES_URL_NON_POOLING` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.shikshamahakumbh.com` |

```bash
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
npx vercel env ls production
```

---

## Live Validation (value proxy)

Encrypted env values are not readable from CLI. Live production behavior used as proxy:

| Probe | Result | Expected post-fix |
|-------|--------|-------------------|
| `GET /api/registration/SMK2026-000001` | **HTTP 200** + PII | **401** |
| `sitemap.xml` first URL | `https://www.rase.co.in` | `https://www.shikshamahakumbh.com` |
| Production deploy age | **~3 days** (pre-remediation) | New deploy from `a0e2c08` |

```bash
npx vercel ls --prod
# Latest: ~3 days old — NOT from current HEAD
```

---

## Signoff

| Gate | Result |
|------|--------|
| DATABASE_URL | ❌ Missing |
| DIRECT_URL | ❌ Missing |
| NEXT_PUBLIC_SITE_URL (name) | ✅ Present |
| NEXT_PUBLIC_SITE_URL (value) | ❌ Wrong on live |
| NEXT_PUBLIC_SUPABASE_URL | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ |
| Production deploy current | ❌ Stale |

**Vercel environment verification: NO GO**

---

*Evidence: `npx vercel env ls production`, live HTTP probes — 2026-05-29.*
