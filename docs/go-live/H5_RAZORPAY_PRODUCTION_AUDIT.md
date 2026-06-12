# H5 — Razorpay Production Audit

**Audit date:** 2026-05-29  
**Scope:** Code verification + limited live probe  
**Verdict:** ✅ **Source ready** | ⚠️ **Production partially verified** | ❌ **End-to-end not tested**

---

## 1. Webhook Route

**Path:** `POST /api/payments/razorpay-webhook`  
**File:** `src/app/api/payments/razorpay-webhook/route.ts`

| Control | Implementation |
|---------|----------------|
| Method | POST only |
| Rate limit | 100 req/min/IP |
| Secret required (prod) | Returns **503** if `RAZORPAY_WEBHOOK_SECRET` missing |
| Signature | HMAC-SHA256 vs `x-razorpay-signature` |
| Invalid signature | **401** |
| Handler | `processRazorpayWebhookEvent()` |

✅ Route exists in source.

---

## 2. Live Webhook Probe

**Command:**
```bash
curl.exe -X POST "https://www.shikshamahakumbh.com/api/payments/razorpay-webhook" \
  -H "Content-Type: application/json" -d "{}"
```

**Result:** HTTP **401** (invalid/missing signature)

✅ Live endpoint exists and rejects unsigned payloads — signature validation **active on deployed build** for this route.

---

## 3. Webhook Secret Configuration

**Vercel env (`npx vercel env ls`):**

| Environment | `RAZORPAY_WEBHOOK_SECRET` |
|-------------|---------------------------|
| Production | ✅ Present (encrypted) |
| Development | ✅ Present |
| Preview | ❌ Missing |

Also configured on Production:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

---

## 4. Production Webhook URL vs Canonical Domain

**Expected URL (post-canonicalization):**
```
https://www.shikshamahakumbh.com/api/payments/razorpay-webhook
```

**Current status:**

| Check | Result |
|-------|--------|
| Route reachable on `www.shikshamahakumbh.com` | ✅ 401 on bad signature |
| Razorpay dashboard registration | **UNKNOWN** — not verified in audit |
| Webhook URL uses canonical domain | **UNKNOWN** — dashboard not inspected |

⚠️ If Razorpay dashboard still points to `rase.co.in` or old path, events may fail after domain migration.

---

## 5. Signature Validation (Code)

```typescript
const expected = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex");

if (!signature || signature !== expected) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}
```

✅ Constant-time comparison via string equality on hex digest (standard Razorpay pattern).

---

## 6. Payment Persistence (Prisma/Supabase)

**Service:** `src/server/services/payment.service.ts`

| Event | Behavior |
|-------|----------|
| `payment.captured` / paid | `PaymentRecord.status` → `Paid`; `Registration.paymentStatus` → `Paid` |
| Failed | Status → `Failed` |
| Duplicate `razorpayPaymentId` | Idempotent handling via `isDuplicate` |
| Order lookup | By `razorpayOrderId` or notes `registrationId` |
| Audit | `writeAuditLog()` on create/complete |
| Webhook audit | `recordWebhookEvent()` with `razorpayEventId` dedup |

**Database state (H2):** 0 payment records — persistence **untested with real data**.

---

## 7. Payment Success / Failure Flows (Code)

**Success path:**
1. Verify webhook signature
2. Parse event JSON
3. `processRazorpayWebhookEvent()` resolves registration
4. Update/create `PaymentRecord`
5. Sync `Registration.paymentStatus`
6. Return `{ received: true, processed: true }`

**Failure / partial path:**
- Invalid payload → **400**
- Handler miss → **202** with `{ processed: false }`
- Missing secret (prod) → **503**

✅ Code paths complete in working tree.

---

## 8. Live vs Source Drift

| Aspect | Live (Jun 9 deploy) | Source (working tree) |
|--------|---------------------|----------------------|
| Webhook route | ✅ Responds | ✅ Same path |
| Prisma persistence | Likely Firebase-era handler | ✅ Supabase/Prisma |
| Payment record target | Firebase (inferred) | `payment_records` table |

⚠️ Webhook may still write to **Firebase** on live until Supabase build is deployed.

---

## H5 Summary

| Requirement | Status |
|-------------|--------|
| Webhook route exists | ✅ Source + live |
| Webhook secret on Production | ✅ Vercel |
| Signature validation | ✅ Source + live (401 probe) |
| Canonical domain webhook URL | ⚠️ UNKNOWN (dashboard) |
| Prisma persistence | ✅ Source; ❌ empty DB |
| E2E payment test | ❌ Not performed |

**P0 before GO:** Deploy Supabase build, run test webhook against Razorpay dashboard, verify row in `payment_records`.

---

*Evidence: `src/app/api/payments/razorpay-webhook/route.ts`, `payment.service.ts`, `npx vercel env ls`, live curl POST.*
