# Vercel Environment Audit

**Date:** 2026-06-10  
**Project:** `dhe-projects/rase-co-in`  
**Method:** `npx vercel env ls` (no secret values read)

---

## Summary

| Environment | Required 10/10 | Verdict |
|-------------|:--------------:|---------|
| **Production** | 7/10 | **CONDITIONAL** |
| **Preview** | 3/10 | **NOT READY** |
| **Development** | 6/10 | **CONDITIONAL** |

---

## Required variables checklist

| Variable | Production | Preview | Development |
|----------|:----------:|:-------:|:-----------:|
| `NEXT_PUBLIC_SITE_URL` | ⚠️ Key exists; live shows `rase.co.in` fallback | ❌ Missing | ⚠️ Key exists |
| `DATABASE_URL` | ❌ Missing | ❌ Missing | ❌ Missing |
| `DIRECT_URL` | ❌ Missing | ❌ Missing | ❌ Missing |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ❌ | ❌ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ❌ | ❌ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | ❌ |
| `ADMIN_OPS_SECRET` | ✅ | ❌ | ✅ |
| `ADMIN_SESSION_SECRET` | ✅ | ❌ | ✅ |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | ❌ | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ❌ | ✅ |

**Alias vars present (not in required list but relevant):**

| Variable | Production | Preview | Development |
|----------|:----------:|:-------:|:-----------:|
| `POSTGRES_URL` | ✅ | ✅ | ✅ |
| `POSTGRES_PRISMA_URL` | ✅ | ✅ | ✅ |
| `POSTGRES_URL_NON_POOLING` | ✅ | ✅ | ✅ |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | ✅ | ✅ | ✅ |

---

## Production — detail

### Present ✅

- `ADMIN_OPS_SECRET`, `ADMIN_SESSION_SECRET`, `REGISTRATION_LOOKUP_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL` (key listed)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_*` (6 vars), `FIREBASE_SERVICE_ACCOUNT_JSON`
- `RECAPTCHA_*`, `RAZORPAY_KEY_*`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### Missing / flagged ⚠️

| Issue | Severity | Evidence |
|-------|----------|----------|
| `DATABASE_URL` not defined | **P1** | Prisma schema requires `env("DATABASE_URL")` |
| `DIRECT_URL` not defined | **P1** | Prisma schema requires `env("DIRECT_URL")` |
| `NEXT_PUBLIC_SITE_URL` ineffective | **P0** | Live sitemap/canonical use `rase.co.in` (empty or stale deploy) |
| Env updated without redeploy | **P0** | Security vars added ~1h ago; live still pre-fix |

### Placeholder / localhost check

| Check | Result |
|-------|--------|
| Localhost in Vercel vars | Cannot verify without value inspection; live DB works via Supabase integration |
| `NEXT_PUBLIC_SITE_URL` = localhost | Live site not localhost — shows `rase.co.in` fallback |

---

## Preview — detail

### Present ✅

`POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_PASSWORD`, `FIREBASE_SERVICE_ACCOUNT_JSON`

### Missing ❌ (all P0 for staging QA)

`NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `DIRECT_URL`, all Supabase public/service keys, all 4 security secrets, `RAZORPAY_WEBHOOK_SECRET`, `RECAPTCHA_*`, `RAZORPAY_KEY_*`

---

## Development — detail

### Present ✅

Security secrets (4), `FIREBASE_SERVICE_ACCOUNT_JSON`, `POSTGRES_*` (4 vars), `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`

### Missing ❌

`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

## Domain mismatches

| Source | Domain | Issue |
|--------|--------|-------|
| Local `.env` | `shikshamahakumbh.org` | Not recommended canonical |
| Live production SEO | `www.rase.co.in` | Fallback from empty/unset `NEXT_PUBLIC_SITE_URL` |
| Recommended | `www.shikshamahakumbh.com` | Not configured anywhere effectively |

---

## Security concerns

| # | Concern | Severity |
|---|---------|----------|
| 1 | Preview has zero security secrets | **P0** |
| 2 | Production env changes not deployed | **P0** |
| 3 | `DATABASE_URL`/`DIRECT_URL` naming gap | **P1** |
| 4 | `SUPABASE_SERVICE_ROLE_KEY` only on Production | **P1** (Preview cannot test storage) |

---

## Remediation (manual — not applied)

```bash
# Production
npx vercel env add DATABASE_URL production
# Value: copy from POSTGRES_PRISMA_URL in dashboard

npx vercel env add DIRECT_URL production
# Value: copy from POSTGRES_URL_NON_POOLING

npx vercel env add NEXT_PUBLIC_SITE_URL production
# Value: https://www.shikshamahakumbh.com

# Preview — copy all Production security + Supabase vars via Dashboard

# Redeploy
npx vercel --prod
```

**No environment variables were changed in this audit.**
