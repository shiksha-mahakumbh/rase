# Environment Validation — Staging

**Date:** June 2026  
**Script:** `node scripts/staging-env-check.mjs`  
**Result:** **FAIL** — 13/21 passed, 8 missing

---

## Summary

| Group | Passed | Failed |
|-------|-------:|-------:|
| Security | 0 | 3 |
| Database | 2 | 0 |
| Supabase | 0 | 3 |
| Firebase | 1 | 0 |
| SMTP | 5 | 0 |
| Razorpay | 2 | 1 |
| Site | 0 | 1 |
| Registration | 3 | 0 |

---

## Detailed results

| Variable | Required | Status | Notes |
|----------|----------|--------|-------|
| `ADMIN_SESSION_SECRET` | ✅ | ❌ MISSING | Falls back to `ADMIN_OPS_SECRET` if set |
| `REGISTRATION_LOOKUP_SECRET` | ✅ | ❌ MISSING | Falls back to `REGISTRATION_EMAIL_SECRET` → `ADMIN_OPS_SECRET` |
| `ADMIN_OPS_SECRET` | ✅ | ❌ MISSING | **Blocks admin gateway + session signing** |
| `DATABASE_URL` | ✅ | ✅ PRESENT | Points to `127.0.0.1:54322` (local Supabase) |
| `DIRECT_URL` | ✅ | ✅ PRESENT | |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ❌ MISSING | CMS/storage client calls |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ❌ MISSING | |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ MISSING | Server-side CMS operations |
| Firebase credentials | ✅ | ✅ PRESENT | Via `FIREBASE_SERVICE_ACCOUNT_JSON` |
| `SMTP_HOST` | ✅ | ✅ PRESENT | |
| `SMTP_PORT` | ✅ | ✅ PRESENT | |
| `SMTP_USER` | ✅ | ✅ PRESENT | |
| `SMTP_PASS` | ✅ | ✅ PRESENT | |
| `SMTP_FROM` | ✅ | ✅ PRESENT | |
| `RAZORPAY_KEY_ID` | ✅ | ✅ PRESENT | |
| `RAZORPAY_KEY_SECRET` | ✅ | ✅ PRESENT | |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ❌ MISSING | Webhook returns 503 in production without it |
| `NEXT_PUBLIC_SITE_URL` | ✅ | ❌ MISSING | Canonical URLs, sitemap base |
| `REGISTRATION_BACKEND` | ✅ | ✅ PRESENT | Value: `firebase` (correct) |
| `RECAPTCHA_SECRET_KEY` | ✅ | ✅ PRESENT | |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | ✅ | ✅ PRESENT | |

---

## Staging action items

```bash
# Add to staging .env / Vercel Preview environment:
ADMIN_OPS_SECRET=<high-entropy-secret>
ADMIN_SESSION_SECRET=<distinct-secret>
REGISTRATION_LOOKUP_SECRET=<distinct-secret>
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role>
RAZORPAY_WEBHOOK_SECRET=<webhook-secret>
NEXT_PUBLIC_SITE_URL=https://<staging-domain>
```

---

## Verdict

| Check | Result |
|-------|--------|
| Local `.env` sufficient for staging | ❌ NO |
| Firebase registration path | ✅ Ready |
| CMS database path | ⚠️ URL set but **DB server not running** |
| P0 security secrets | ❌ Not configured |

**Stage 1: FAIL** — configure missing variables before staging deploy.
