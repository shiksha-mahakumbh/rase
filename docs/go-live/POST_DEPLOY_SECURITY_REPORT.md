# Post-Deploy Security Report

**Date:** 2026-06-12  
**Deployment:** `dpl_FZMihrmetbpUJfEHZKamsiizjMvq`  
**Probe time:** 2026-06-12T17:05:47Z  
**Method:** Live HTTP probes + `npm run test:security`

---

## Summary

| Gate | Result |
|------|--------|
| Registration lookup without credentials | ✅ **401** |
| PII exposure (email/phone) without auth | ✅ **None** |
| Razorpay webhook unsigned POST | ✅ **401** |
| Automated security tests (local) | ✅ **15/15 PASS** |
| Storage RLS (`storage.objects`) | ❌ **0/8 policies** |
| Admin middleware / legacy cookie | ✅ Source + unit tests PASS |

**Security posture (application layer): PASS**  
**Security posture (storage infra layer): FAIL — pending SQL Editor**

---

## Live HTTP Probes

### Registration API — P0 gate

| Host | Request | Status | Body snippet |
|------|---------|--------|--------------|
| `www.shikshamahakumbh.com` | `GET /api/registration/SMK2026-000001` | **401** | `Email or confirmation token required` |
| `www.rase.co.in` | Same | **401** | Same |

**PII check:** `hasEmail: false`, `hasPhone: false` on both hosts.

**Prior state (pre-cutover):** HTTP **200** with email and contactNumber exposed — **remediated**.

---

### Razorpay Webhook

| Host | Request | Status | Body |
|------|---------|--------|------|
| `www.shikshamahakumbh.com` | `POST /api/payments/razorpay-webhook` `{}` | **401** | `Invalid signature` |
| `www.rase.co.in` | Same | **401** | Same |

**Interpretation:**

- Route is live and HMAC verification is **active** (`RAZORPAY_WEBHOOK_SECRET` configured — not 503).
- Unsigned payloads correctly rejected.
- **Not tested:** Valid Razorpay-signed test event (requires Razorpay Dashboard operator action).

**Expected production URL:** `https://www.shikshamahakumbh.com/api/payments/razorpay-webhook`

---

## Automated Security Tests (Local)

```bash
npm run test:security
```

| Suite | Passed | Failed |
|-------|--------|--------|
| `staging-security-check.mjs` | 9 | 0 |
| `test-registration-lookup-security.mjs` | 6 | 0 |
| **Total** | **15** | **0** |

Key assertions:

- `registration_get_requires_auth` — PASS
- `route_returns_401_without_credentials` — PASS (source)
- `pii_stripped_from_summary` — PASS
- `src_no_firebase_runtime` — PASS
- Admin legacy cookie `=1` rejected — PASS

---

## Infrastructure Security — Storage RLS

| Check | Expected | Actual |
|-------|----------|--------|
| `storage.buckets` | 8 | **8** ✅ |
| `pg_policies` schema `public` | 55 | **55** ✅ |
| `pg_policies` schema `storage` | **8** | **0** ❌ |

**Risk while storage policies missing:**

- Service role (Next.js API) bypasses RLS — uploads via API still work.
- Direct Supabase client storage access relies on default-deny with RLS enabled but **no explicit policies** — lower confidence for anon/authenticated direct object access patterns.

**Remediation:** Run `supabase/policies/storage-production.sql` in Supabase SQL Editor.

---

## SEO / Domain Security Adjacent Checks

No security regression from domain misconfiguration observed:

- `robots.txt` disallows `/admin`, `/api/`, sensitive data paths
- Canonical and sitemap use `https://www.shikshamahakumbh.com`

---

## Monitoring Recommendations (48h)

1. Alert if `GET /api/registration/*` returns 200 without `token` or `email` query param
2. Monitor Razorpay webhook 4xx/5xx ratio
3. Watch Supabase connection errors in Vercel function logs
4. Re-probe storage policy count after SQL Editor apply

---

## Probe Reproduction

```bash
node scripts/_post-deploy-probes.mjs
node scripts/_seo-probe.mjs
npm run test:security
```

---

*Post-deploy security verification — 2026-06-12. No credentials used in live probes.*
