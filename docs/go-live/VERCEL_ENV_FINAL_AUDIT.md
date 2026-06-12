# G3 — Vercel Environment Validation (Final)

**Audit date:** 2026-05-29  
**Project:** `dhe-projects/rase-co-in`  
**Command:** `npx vercel env ls`  
**Verdict:** ⚠️ **Production PARTIAL** | ❌ **Preview FAIL** | ⚠️ **Development PARTIAL**

Encrypted values — actual URL/key contents are **UNKNOWN** from CLI.

---

## Required Variables Checklist

| Variable | Required for |
|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server admin |
| `DATABASE_URL` | Prisma pooled |
| `DIRECT_URL` | Prisma migrations/direct |
| `ADMIN_OPS_SECRET` | Admin ops |
| `ADMIN_SESSION_SECRET` | HMAC admin session |
| `REGISTRATION_LOOKUP_SECRET` | Lookup tokens |
| `NEXT_PUBLIC_SITE_URL` | Canonical / OG |
| `RAZORPAY_KEY_ID` | Payments |
| `RAZORPAY_KEY_SECRET` | Payments |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook HMAC |
| `RECAPTCHA_SECRET_KEY` | Form protection |

---

## Production

### Present (by exact name or functional alias)

| Variable | Status | Notes |
|----------|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | |
| `POSTGRES_PRISMA_URL` | ✅ | **Alias** — likely maps to `DATABASE_URL` value |
| `POSTGRES_URL_NON_POOLING` | ✅ | **Alias** — likely maps to `DIRECT_URL` value |
| `POSTGRES_URL`, `POSTGRES_*` | ✅ | Supabase integration vars |
| `ADMIN_OPS_SECRET` | ✅ | |
| `ADMIN_SESSION_SECRET` | ✅ | |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Value **UNKNOWN** (encrypted) |
| `RAZORPAY_KEY_ID` | ✅ | |
| `RAZORPAY_KEY_SECRET` | ✅ | |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | |
| `RECAPTCHA_SECRET_KEY` | ✅ | |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | ✅ | Extra (not in required list) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ | Extra (not in required list) |

### Missing (exact names)

| Variable | Status | Risk |
|----------|--------|------|
| `DATABASE_URL` | ❌ **MISSING** | Prisma schema reads `env("DATABASE_URL")` — **build/runtime may fail or skip DB** unless manually aliased outside Vercel UI |
| `DIRECT_URL` | ❌ **MISSING** | Same for migrations/deploy hooks |

### Should remove post-migration

| Variable | Environments |
|----------|--------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production, Preview, Development |

---

## Preview

### Present

| Variable |
|----------|
| `POSTGRES_URL` |
| `POSTGRES_PRISMA_URL` |
| `POSTGRES_URL_NON_POOLING` |
| `POSTGRES_PASSWORD` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` |

### Missing

| Variable |
|----------|
| `NEXT_PUBLIC_SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` |
| `DATABASE_URL` |
| `DIRECT_URL` |
| `ADMIN_OPS_SECRET` |
| `ADMIN_SESSION_SECRET` |
| `REGISTRATION_LOOKUP_SECRET` |
| `NEXT_PUBLIC_SITE_URL` |
| `RAZORPAY_KEY_ID` |
| `RAZORPAY_KEY_SECRET` |
| `RAZORPAY_WEBHOOK_SECRET` |
| `RECAPTCHA_SECRET_KEY` |

❌ **Preview deployments cannot exercise Supabase auth, payments, admin, or reCAPTCHA without env sync.**

---

## Development (Vercel)

### Present

| Variable |
|----------|
| `ADMIN_OPS_SECRET` |
| `ADMIN_SESSION_SECRET` |
| `REGISTRATION_LOOKUP_SECRET` |
| `NEXT_PUBLIC_SITE_URL` |
| `RAZORPAY_WEBHOOK_SECRET` |
| `POSTGRES_URL` |
| `POSTGRES_PRISMA_URL` |
| `POSTGRES_URL_NON_POOLING` |
| `POSTGRES_PASSWORD` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` |

### Missing

| Variable |
|----------|
| `NEXT_PUBLIC_SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` |
| `DATABASE_URL` |
| `DIRECT_URL` |
| `RAZORPAY_KEY_ID` |
| `RAZORPAY_KEY_SECRET` |
| `RECAPTCHA_SECRET_KEY` |

⚠️ Local `.env` may supply Supabase vars for `next dev`; Vercel Development env is **incomplete** for cloud dev sessions.

---

## Prisma Name Gap (Critical)

`prisma/schema.prisma`:
```prisma
url       = env("DATABASE_URL")
directUrl = env("DIRECT_URL")
```

Vercel Supabase integration provides `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING`, **not** the Prisma-expected names.

**Recommended pre-deploy action (no auto-execution):**
```bash
# Copy values — do not commit
vercel env add DATABASE_URL production    # value = POSTGRES_PRISMA_URL
vercel env add DIRECT_URL production      # value = POSTGRES_URL_NON_POOLING
```

Repeat for Preview if preview smoke tests are required.

---

## G3 Summary

| Environment | Score | Blocker |
|-------------|-------|---------|
| Production | ~12/14 required | `DATABASE_URL` / `DIRECT_URL` name gap; `NEXT_PUBLIC_SITE_URL` value unverified |
| Preview | ~2/14 | Nearly all secrets missing |
| Development | ~6/14 | Supabase + Razorpay + reCAPTCHA missing on Vercel |

---

*Evidence from `npx vercel env ls` only. No env values modified.*
