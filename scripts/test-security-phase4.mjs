#!/usr/bin/env node
/**
 * Security checklist items 58–62 — Razorpay flow, webhooks, refunds, receipts, failure recovery.
 */
import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(".");
const src = path.join(repo, "src");
const results = [];

function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

function readSrc(rel) {
  return fs.readFileSync(path.join(src, rel), "utf8");
}

function existsRepo(rel) {
  return fs.existsSync(path.join(repo, rel));
}

// 58 Razorpay Flow
if (
  existsRepo("src/lib/razorpay/handlers.ts") &&
  readSrc("lib/razorpay/handlers.ts").includes("recordVerifiedPayment") &&
  readSrc("lib/razorpay/handlers.ts").includes("assertSameOrigin")
) {
  pass("razorpay_checkout_flow", "Create-order and verify-payment handlers with same-origin CSRF");
} else {
  fail("razorpay_checkout_flow", "Razorpay handlers incomplete");
}

if (
  readSrc("server/services/razorpay-verified.service.ts").includes("PAYMENT_NOT_CAPTURED") &&
  readSrc("server/services/razorpay-verified.service.ts").includes("ORDER_ID_MISMATCH") &&
  readSrc("server/services/razorpay-verified.service.ts").includes("PAYMENT_STATUS_UNAVAILABLE")
) {
  pass("razorpay_verify_fail_closed", "Payment verification fails closed on capture/order/status errors");
} else {
  fail("razorpay_verify_fail_closed", "Razorpay verification not fail-closed");
}

// 59 Webhooks
if (
  readSrc("app/api/payments/razorpay-webhook/route.ts").includes("ingestRazorpayWebhook") &&
  readSrc("server/services/payment.service.ts").includes("recordWebhookEvent") &&
  readSrc("server/services/payment.service.ts").includes("razorpayEventId")
) {
  pass("webhook_idempotent_ingress", "Webhook route persists events and dedupes by Razorpay event id");
} else {
  fail("webhook_idempotent_ingress", "Webhook idempotency not wired");
}

if (readSrc("app/api/payments/razorpay-webhook/route.ts").includes("timingSafeHexEqual")) {
  pass("webhook_hmac_verify", "Webhook verifies HMAC signature with timing-safe compare");
} else {
  fail("webhook_hmac_verify", "Webhook HMAC verification missing");
}

// 60 Refunds
if (
  readSrc("server/services/payment.service.ts").includes("processRazorpayRefundWebhook") &&
  readSrc("server/services/payment.service.ts").includes("recordRefund")
) {
  pass("refund_webhook_handler", "Refund webhooks update payment records and registration status");
} else {
  fail("refund_webhook_handler", "Refund webhook handler missing");
}

// 61 Receipts
if (
  readSrc("server/lib/registration-receipt-handler.ts").includes("verifyRegistrationLookupToken") &&
  readSrc("server/lib/registration-receipt-handler.ts").includes("emailsMatch")
) {
  pass("receipt_token_email_binding", "Registration receipt requires lookup token bound to registrant email");
} else {
  fail("receipt_token_email_binding", "Receipt auth weaker than participant download");
}

if (existsRepo("src/server/services/receipt.service.ts") && existsRepo("src/app/api/donation/receipt/route.ts")) {
  pass("receipt_generation_routes", "Registration and donation receipt generation routes exist");
} else {
  fail("receipt_generation_routes", "Receipt routes missing");
}

// 62 Failure Recovery
if (
  readSrc("server/services/registration.service.ts").includes("consumeVerifiedPaymentInTransaction") &&
  readSrc("server/services/razorpay-verified.service.ts").includes("updateMany") &&
  readSrc("server/services/razorpay-verified.service.ts").includes("consumedAt: null")
) {
  pass("recovery_atomic_payment_consume", "Registration submit consumes verified payments inside DB transaction");
} else {
  fail("recovery_atomic_payment_consume", "Payment consume race not fixed");
}

if (
  existsRepo("src/server/services/admin/reconciliation.service.ts") &&
  readSrc("server/services/admin/reconciliation.service.ts").includes("detectOrphanPayments") &&
  readSrc("server/services/admin/reconciliation.service.ts").includes("AMOUNT_MISMATCH")
) {
  pass("recovery_orphan_admin", "Admin orphan detection and manual link validate payment amount");
} else {
  fail("recovery_orphan_admin", "Payment recovery tooling incomplete");
}

if (readSrc("app/api/donation/complete/route.ts").includes("assertSameOrigin")) {
  pass("recovery_donation_csrf", "Donation completion enforces same-origin CSRF");
} else {
  fail("recovery_donation_csrf", "Donation complete missing CSRF");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(`\nPhase 4 payment checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const r of results) {
  console.log(`${r.status === "PASS" ? "✓" : "✗"} ${r.test}: ${r.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
