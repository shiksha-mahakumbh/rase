# Razorpay Production Audit

**Date:** 2026-06-10  
**Method:** Code review + Vercel env ls + domain cross-check

---

## Summary

| Check | Result |
|-------|--------|
| Webhook route exists | ✅ PASS |
| Signature verification (HMAC-SHA256) | ✅ PASS |
| `RAZORPAY_WEBHOOK_SECRET` referenced | ✅ PASS |
| Secret on Vercel Production | ✅ PASS |
| Domain consistency | ❌ **FAIL** |
| Live E2E webhook test | ❌ Not executed |

---

## Webhook route

**File:** `src/app/api/payments/razorpay-webhook/route.ts`

| Requirement | Implementation | Pass? |
|-------------|----------------|:-----:|
| Route exists | `POST` handler | ✅ |
| Secret env var | `process.env.RAZORPAY_WEBHOOK_SECRET` L21 | ✅ |
| Missing secret in production | Returns **503** L23–24 | ✅ |
| Signature header | `x-razorpay-signature` L29 | ✅ |
| HMAC verification | `crypto.createHmac("sha256", secret)` L32–35 | ✅ |
| Invalid signature | **401** L37–38 | ✅ |
| Rate limit | 100/min/IP L12–18 | ✅ |
| Business logic | `processRazorpayWebhookEvent()` — **not modified** | ✅ |

---

## Environment configuration

| Variable | Local | Vercel Production | Vercel Preview |
|----------|:-----:|:-----------------:|:--------------:|
| `RAZORPAY_KEY_ID` | ✅ | ✅ | ❌ |
| `RAZORPAY_KEY_SECRET` | ✅ | ✅ | ❌ |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ | ✅ | ❌ |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ✅ | ❌ |

---

## Domain mismatch analysis

| Component | Domain | Consistent? |
|-----------|--------|:-----------:|
| Production HTTP host | `www.shikshamahakumbh.com` | — |
| Documented webhook URL | `shikshamahakumbh.com` (apex) | ⚠️ Apex 308→www |
| `NEXT_PUBLIC_SITE_URL` local | `shikshamahakumbh.org` | ❌ |
| `NEXT_PUBLIC_SITE_URL` Vercel live effect | `www.rase.co.in` (fallback) | ❌ |
| Recommended canonical | `www.shikshamahakumbh.com` | — |

### Recommended webhook URL

```
https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
```

**Rationale:** Matches production traffic host; avoids apex 308 redirect chain.

### Mismatch risks

| Risk | Impact |
|------|--------|
| Webhook on apex, site canonical elsewhere | Redirect handling uncertainty |
| `SITE_URL` = `rase.co.in` in live SEO | Checkout return URLs / emails may use wrong domain |
| Local env `.org` | Next deploy propagates wrong URLs if env not fixed first |

---

## Verification commands (post-remediation)

```bash
# Endpoint must exist (not 404)
curl -s -o /dev/null -w "%{http_code}" -X POST \
  https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
# Expect: 401 (no signature) or 503 (secret missing) — NOT 404

# Razorpay Dashboard → send test webhook event
# Verify Firestore paymentStatus updates
```

---

## Razorpay events to enable

- [ ] `payment.captured`
- [ ] `payment.failed`
- [ ] `order.paid`

---

## Verdict

| Category | Score | Pass? |
|----------|------:|:-----:|
| Code implementation | 95/100 | ✅ |
| Env on Production | 80/100 | ✅ |
| Domain alignment | 20/100 | ❌ |
| Live E2E | 0/100 | ❌ |
| **Overall Razorpay** | **62/100** | **CONDITIONAL** |

**No Razorpay business logic modified.**
