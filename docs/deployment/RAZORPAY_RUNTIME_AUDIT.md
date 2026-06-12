# Razorpay Runtime Audit

**Date:** 2026-06-10  
**Method:** Source review + `vercel env ls` + live HTTP probe

---

## Summary

| Check | Result |
|-------|--------|
| Webhook route in source | ✅ PASS |
| `RAZORPAY_WEBHOOK_SECRET` referenced | ✅ PASS |
| HMAC signature validation | ✅ PASS |
| Secret on Vercel Production | ✅ PASS |
| Live route mounted | ✅ PASS (GET → 405) |
| Webhook URL matches canonical | ❌ **FAIL** |
| Live POST E2E | Not executed (mutation blocked) |

**Verdict: CONDITIONAL GO**

---

## Webhook route — source

**File:** `src/app/api/payments/razorpay-webhook/route.ts`

| Control | Line(s) | Pass? |
|---------|---------|:-----:|
| `POST` handler | 10 | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` env | 21 | ✅ |
| Missing secret → 503 in production | 23-24 | ✅ |
| `x-razorpay-signature` header | 29 | ✅ |
| HMAC-SHA256 verify | 32-35 | ✅ |
| Invalid signature → 401 | 37-38 | ✅ |
| Rate limit 100/min/IP | 12-18 | ✅ |

**Business logic (`processRazorpayWebhookEvent`) not modified.**

---

## Environment wiring

| Variable | Vercel Production | Vercel Preview | Local |
|----------|:-----------------:|:--------------:|:-----:|
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ❌ | ✅ |
| `RAZORPAY_KEY_ID` | ✅ | ❌ | ✅ |
| `RAZORPAY_KEY_SECRET` | ✅ | ❌ | ✅ |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ | ❌ | ✅ |

---

## Live HTTP probe

```
GET https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
→ 405 Method Not Allowed
```

| Interpretation | Meaning |
|----------------|---------|
| 405 (not 404) | Route exists in live deployment |
| POST not probed | Safety policy — no mutation to production webhook |

---

## Domain consistency

| Component | Domain | Match canonical? |
|-----------|--------|:----------------:|
| Production HTTP host | `www.shikshamahakumbh.com` | — |
| Recommended webhook URL | `https://www.shikshamahakumbh.com/api/payments/razorpay-webhook` | ✅ |
| Documented stakeholder webhook | `shikshamahakumbh.com` (apex) | ⚠️ Apex 308→www |
| `NEXT_PUBLIC_SITE_URL` local | `shikshamahakumbh.org` | ❌ |
| Live SEO canonical | `www.rase.co.in` | ❌ |

**Webhook URL must be updated in Razorpay Dashboard to `www.shikshamahakumbh.com` after canonical env fix.**

---

## Verdict

| Category | Score | Status |
|----------|------:|--------|
| Code | 95/100 | PASS |
| Env (Production) | 80/100 | PASS |
| Domain alignment | 25/100 | FAIL |
| Live E2E | 0/100 | UNVERIFIED |
| **Overall** | **62/100** | **CONDITIONAL GO** |

**No Razorpay changes made.**
