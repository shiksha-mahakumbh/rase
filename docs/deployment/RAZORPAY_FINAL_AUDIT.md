# Razorpay Final Audit

**Date:** 2026-06-10  
**Method:** Code review + Vercel env audit + live domain probes

---

## Summary

| Area | Status | Verdict |
|------|--------|---------|
| Webhook route | ✅ Implemented | PASS |
| Signature validation | ✅ HMAC-SHA256 | PASS |
| Webhook secret env | ✅ On Vercel Prod/Dev | PASS |
| Rate limiting | ✅ 100/min/IP | PASS |
| Domain consistency | ❌ Mismatch | **BLOCKER** |
| Live E2E test | ❌ Not executed | BLOCKER |

---

## Webhook route

**File:** `src/app/api/payments/razorpay-webhook/route.ts`

| Check | Implementation |
|-------|----------------|
| Method | `POST` only |
| Secret | `process.env.RAZORPAY_WEBHOOK_SECRET` |
| Missing secret in production | Returns **503** |
| Missing secret in dev | Returns `{ ok: true, mode: "dev-skip" }` |
| Signature header | `x-razorpay-signature` |
| Validation | `crypto.createHmac("sha256", secret).update(body)` |
| Invalid signature | **401** |
| Processing | `processRazorpayWebhookEvent()` → Firestore |
| Rate limit | 100 req/min per IP |

**Business logic not modified** — audit read-only.

---

## Payment processing flow

```
Razorpay → POST /api/payments/razorpay-webhook
         → HMAC verify
         → processRazorpayWebhookEvent()
         → Firestore registrations.paymentStatus update
```

**File:** `src/lib/firestore/payments.server.ts` — finds registration by `order_id`, maps status (`captured`/`paid` → `Paid`).

---

## Environment configuration

| Variable | Local | Vercel Production | Vercel Preview |
|----------|:-----:|:-----------------:|:--------------:|
| `RAZORPAY_KEY_ID` | ✅ | ✅ | ❌ |
| `RAZORPAY_KEY_SECRET` | ✅ | ✅ | ❌ |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ | ✅ | ❌ |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | ✅ | ❌ |

---

## Domain consistency

| Component | Domain | Match? |
|-----------|--------|:------:|
| Production traffic host | `www.shikshamahakumbh.com` | — |
| Documented Razorpay webhook | `shikshamahakumbh.com` (apex) | ⚠️ Apex 308→www |
| Live SEO canonical | `www.rase.co.in` | ❌ |
| Local `NEXT_PUBLIC_SITE_URL` | `shikshamahakumbh.org` | ❌ |
| Vercel `NEXT_PUBLIC_SITE_URL` | **empty** | ❌ |

### Recommended webhook URL

```
https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
```

**Rationale:**
- Matches production traffic host (no apex redirect)
- Aligns with recommended canonical domain
- Webhook route is host-agnostic — works on any Vercel-assigned domain

### Risk if domain not aligned

- Payment webhooks may hit a host that 308-redirects (verify Razorpay follows redirects)
- SEO/checkout return URLs may use wrong domain from `SITE_URL`
- Google and users see different domain than payment infrastructure

---

## Events to enable (Razorpay Dashboard)

- [ ] `payment.captured`
- [ ] `payment.failed`
- [ ] `order.paid`

---

## Verification commands (post-deploy)

```bash
# Webhook endpoint exists
curl -s -o /dev/null -w "%{http_code}" -X POST https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
# Expect: 401 (no signature) or 503 (secret missing) — NOT 404

# Razorpay Dashboard → Webhooks → Test webhook
# Confirm Firestore paymentStatus updates to Paid
```

---

## Razorpay readiness score

| Category | Score |
|----------|------:|
| Code implementation | 95 |
| Env configuration | 80 |
| Domain alignment | 25 |
| Live E2E verification | 0 |
| **Overall Razorpay** | **62/100** |
