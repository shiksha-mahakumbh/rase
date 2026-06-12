# Security Runtime Verification

**Date:** 2026-06-10  
**Method:** Live HTTP probes against `https://www.shikshamahakumbh.com`  
**Classification:** **STALE_PRODUCTION_DEPLOYMENT**

---

## Primary probe — registration lookup

### Request

```
GET https://www.shikshamahakumbh.com/api/registration/SMK2026-000001
(no token, no email query parameter)
Timestamp: 2026-06-10T19:00Z (approx)
```

### Expected (per current source code)

| Field | Value |
|-------|-------|
| HTTP status | **401** |
| Body | `{"error":"Email or confirmation token required"}` |

**Source:** `src/app/api/registration/[registrationId]/route.ts:51-56`

### Actual (live production)

| Field | Value |
|-------|-------|
| HTTP status | **200** |
| Body (truncated) | `{"registrationId":"SMK2026-000001","registrationType":"Conclave","fullName":"Release Verify","institution":"RASE QA","email":"release-verify+20260609@rase.co.in","contactNumber":"9999999999","paymentStatus":"Not Required",...}` |

### Classification: **STALE_PRODUCTION_DEPLOYMENT**

| Indicator | Evidence |
|-----------|----------|
| Status 200 without auth | Violates current source L51-56 |
| Response includes `email` | Current `toPublicRegistrationSummary` **excludes** email (L78-87) |
| Response includes `contactNumber` | **Not in** current summary type at all |
| `/api/v2/health` returns 404 | Route exists in repo; not in live deploy |
| Sitemap `lastmod` | 2026-06-09 (predates recent env/security work) |

**Conclusion:** Production is running code **older than** the P0 security remediation in the repository.

---

## PASS / FAIL matrix (runtime)

| Control | Expected | Live | Verdict |
|---------|----------|------|---------|
| Anonymous registration lookup blocked | 401 | 200 + PII | **FAIL** |
| Summary excludes email/phone | Yes | No (email + contactNumber returned) | **FAIL** |
| `/api/v2/health` available | 200 JSON | 404 HTML | **FAIL** (stale) |
| Razorpay webhook route exists | Not 404 | GET → 405 | **PASS** (route mounted) |
| Admin session (live) | Signed cookie required | Not probed (no credentials) | UNVERIFIED |
| Legacy cookie `smk_admin_session=1` | Rejected | Not probed | UNVERIFIED |

---

## Additional live probes

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/payments/razorpay-webhook` | GET | **405** | Route exists; POST not probed (mutation blocked) |
| `/api/v2/health` | GET | **404** | Not in current production deployment |
| `/` | GET | **200** | Site serves; canonical = `rase.co.in` |

---

## Risk assessment

| Risk | Severity |
|------|----------|
| Unauthenticated PII exposure on live URL | **P0 CRITICAL** |
| Production code ≠ repository code | **P0 CRITICAL** |
| Security env vars added but not deployed | **P0** |

---

## Required remediation (manual — not executed)

```bash
# After Vercel env confirmed
npx vercel --prod

# Verify
curl -s -o /dev/null -w "%{http_code}" \
  https://www.shikshamahakumbh.com/api/registration/SMK2026-000001
# MUST return 401
```

---

## Verdict

**SECURITY RUNTIME: FAIL** — classified as **STALE_PRODUCTION_DEPLOYMENT**.

**No deployment performed.**
