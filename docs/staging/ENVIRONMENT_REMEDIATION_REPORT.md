# Environment Remediation Report

**Date:** June 2026  
**Audit script:** `node scripts/staging-env-check.mjs`  
**Rule:** Values never exposed — presence only.

---

## Summary

| Status | Count |
|--------|------:|
| Present | 13 |
| Missing (blocking) | 8 |
| Pass rate | 62% |

**Verdict:** Environment is **not staging-ready**. Eight variables must be set before deploy.

---

## Required variables — audit results

### Security (0/3 dedicated — BLOCKER)

| Variable | Present | Fallback | Impact if missing |
|----------|---------|----------|-------------------|
| `ADMIN_OPS_SECRET` | ❌ | None | Admin gateway rejects all CMS API calls; session signing fails |
| `ADMIN_SESSION_SECRET` | ❌ | Falls back to `ADMIN_OPS_SECRET` | Signed HttpOnly cookie cannot be created |
| `REGISTRATION_LOOKUP_SECRET` | ❌ | Falls back to `REGISTRATION_EMAIL_SECRET` → `ADMIN_OPS_SECRET` | Lookup tokens throw at runtime if no fallback set |

### Supabase (0/3 — BLOCKER for CMS)

| Variable | Present | Impact |
|----------|---------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ | `getSupabaseAdmin()` throws; media upload fails |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ | Client Supabase calls fail |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | Server storage/CMS file operations fail |

### Site & payments (0/2 — BLOCKER / HIGH)

| Variable | Present | Impact |
|----------|---------|--------|
| `NEXT_PUBLIC_SITE_URL` | ❌ | Wrong canonical URLs, sitemap base, OG URLs |
| `RAZORPAY_WEBHOOK_SECRET` | ❌ | Webhook returns 503 in production; payments not confirmed server-side |

---

## Present variables (confirmed)

| Group | Variables |
|-------|-----------|
| Database | `DATABASE_URL`, `DIRECT_URL` |
| Firebase | `FIREBASE_SERVICE_ACCOUNT_JSON` (valid JSON structure) |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` |
| Razorpay | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| Registration | `REGISTRATION_BACKEND` (= `firebase`), `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` |

---

## Vercel configuration locations

Set all variables in **Vercel Dashboard → Project → Settings → Environment Variables**.

| Scope | Variables |
|-------|-----------|
| **Production** | All vars below |
| **Preview (staging)** | Same set with staging Supabase + test Razorpay keys |
| **Development** | Local `.env.local` only — never commit |

### Variable placement guide

| Variable | Vercel type | Notes |
|----------|-------------|-------|
| `ADMIN_OPS_SECRET` | Encrypted, Server only | Generate 32+ byte random string |
| `ADMIN_SESSION_SECRET` | Encrypted, Server only | **Distinct** from `ADMIN_OPS_SECRET` |
| `REGISTRATION_LOOKUP_SECRET` | Encrypted, Server only | **Distinct** from above |
| `DATABASE_URL` | Encrypted, Server only | Pooler URL port **6543** + `?pgbouncer=true` |
| `DIRECT_URL` | Encrypted, Server only | Direct URL port **5432** (migrations) |
| `NEXT_PUBLIC_SUPABASE_URL` | Plain, All environments | Public — safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Plain, All environments | Public — RLS-protected |
| `SUPABASE_SERVICE_ROLE_KEY` | Encrypted, **Production + Preview only** | Never expose to client |
| `NEXT_PUBLIC_SITE_URL` | Plain, All environments | `https://staging.rase.co.in` or preview URL |
| `RAZORPAY_WEBHOOK_SECRET` | Encrypted, Server only | From Razorpay dashboard |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Encrypted, Server only | Single-line JSON |
| `REGISTRATION_BACKEND` | Encrypted, Server only | Must remain `firebase` |

---

## Local vs staging configuration gap

| File | Purpose | Status |
|------|---------|--------|
| `.env` | Base local config | Present — tuned for **local Supabase CLI** |
| `.env.local` | Local overrides | Present |
| `.env.example` | Firebase-focused template | Missing Supabase + P0 secrets |
| `.env.supabase.example` | Supabase template | **Not merged** into active `.env` |

**Root issue:** Local `.env` has database URLs but not Supabase API keys or P0 security secrets. Staging Vercel project needs the **cloud** template from `.env.supabase.example` plus security secrets.

---

## Remediation commands (ops — no secrets in repo)

```bash
# 1. Generate secrets (run locally, paste into Vercel)
openssl rand -base64 32   # ADMIN_OPS_SECRET
openssl rand -base64 32   # ADMIN_SESSION_SECRET
openssl rand -base64 32   # REGISTRATION_LOOKUP_SECRET

# 2. From Supabase Dashboard → Settings → API:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
#    SUPABASE_SERVICE_ROLE_KEY

# 3. From Supabase Dashboard → Settings → Database:
#    DATABASE_URL (pooler, port 6543)
#    DIRECT_URL (direct, port 5432)

# 4. Re-validate
node scripts/staging-env-check.mjs
```

---

## Deployment impact matrix

| Missing var | Build | Runtime CMS | Runtime registration | Admin login |
|-------------|-------|-------------|---------------------|-------------|
| `ADMIN_OPS_SECRET` | ✅ May build | ❌ All CMS APIs 401 | ✅ Firebase OK | ❌ Gateway fails |
| Supabase trio | ✅ May build | ❌ DB/media errors | ✅ Unaffected | ⚠️ Partial |
| `NEXT_PUBLIC_SITE_URL` | ✅ | ⚠️ Wrong SEO | ✅ | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ✅ | ⚠️ Payments unverified | ✅ |

---

## Remediation status

**NOT COMPLETE** — 8 variables must be configured on staging host before approval.
