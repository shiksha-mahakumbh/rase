#!/usr/bin/env node
/**
 * Razorpay Standard Checkout E2E test (test mode).
 * Usage: node scripts/razorpay-e2e-test.mjs [baseUrl]
 */
import crypto from "node:crypto";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const results = [];

function log(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function apiCreateOrder() {
  const res = await fetch(`${BASE}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 100000, currency: "INR", receipt: `e2e_${Date.now()}` }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  if (!data.order_id || !data.amount) throw new Error("Missing order fields");
  return data;
}

async function apiVerifyInvalid() {
  const res = await fetch(`${BASE}/api/payments/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_payment_id: "pay_test_fake",
      razorpay_order_id: "order_test_fake",
      razorpay_signature: "invalid_signature",
    }),
  });
  const data = await res.json();
  return res.status === 400 && data.ok === false;
}

async function apiVerifyValidSignature(orderId, paymentId, keySecret) {
  const signature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const res = await fetch(`${BASE}/api/payments/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
    }),
  });
  const data = await res.json();
  return { ok: res.ok && data.ok === true, status: res.status, data };
}

async function browserCardCheckout(orderId, keyId) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const html = `<!DOCTYPE html><html><head>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </head><body><button id="pay">Pay</button><div id="result"></div>
    <script>
      document.getElementById('pay').onclick = function() {
        var rzp = new Razorpay({
          key: '${keyId}',
          amount: 100000,
          currency: 'INR',
          name: 'E2E Test',
          order_id: '${orderId}',
          handler: function(r) {
            document.getElementById('result').textContent = JSON.stringify(r);
          }
        });
        rzp.open();
      };
    </script></body></html>`;

    await page.setContent(html);
    await page.click("#pay");

    const frame = page.frameLocator('iframe[name="razorpay-checkout-frame"]');
    await frame.locator('input[name="card[number]"]').fill("4111111111111111", { timeout: 30000 });
    await frame.locator('input[name="card[expiry]"]').fill("12 / 26");
    await frame.locator('input[name="card[cvv]"]').fill("123");
    await frame.getByRole("button", { name: /pay/i }).click({ timeout: 15000 });

    await page.waitForFunction(
      () => document.getElementById("result")?.textContent?.includes("razorpay_payment_id"),
      { timeout: 60000 }
    );

    const raw = await page.locator("#result").textContent();
    return JSON.parse(raw);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log(`Razorpay E2E test: ${BASE}\n`);

  try {
    const health = await fetch(`${BASE}/api/health`);
    log("health-endpoint", health.ok, `HTTP ${health.status}`);
  } catch (e) {
    log("health-endpoint", false, e.message);
    console.log("\nStart dev server: npm run dev");
    process.exit(1);
  }

  let order;
  try {
    order = await apiCreateOrder();
    log("create-order", true, `order_id=${order.order_id} amount=${order.amount}`);
  } catch (e) {
    log("create-order", false, e.message);
    process.exit(1);
  }

  try {
    const bad = await apiVerifyInvalid();
    log("verify-invalid-signature", bad, "returns 400");
  } catch (e) {
    log("verify-invalid-signature", false, e.message);
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (keySecret) {
    const synth = await apiVerifyValidSignature(
      order.order_id,
      "pay_e2e_synthetic_test",
      keySecret
    );
    log("verify-valid-hmac", synth.ok, `HTTP ${synth.status}`);
  } else {
    log("verify-valid-hmac", false, "RAZORPAY_KEY_SECRET not in env — load .env");
  }

  const keyId = order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    log("browser-card-checkout", false, "No Razorpay key_id");
  } else {
    try {
      console.log("\nRunning browser checkout with test card 4111…1111 …");
      const payment = await browserCardCheckout(order.order_id, keyId);
      log("browser-card-checkout", Boolean(payment.razorpay_payment_id), payment.razorpay_payment_id);

      if (payment.razorpay_payment_id && keySecret) {
        const verifyRes = await fetch(`${BASE}/api/payments/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payment),
        });
        const verifyData = await verifyRes.json();
        log(
          "verify-real-payment",
          verifyRes.ok && verifyData.ok === true,
          verifyData.razorpay_payment_id ?? verifyData.error
        );
      }
    } catch (e) {
      log("browser-card-checkout", false, e.message);
      console.log("  Tip: npm install -D playwright && npx playwright install chromium");
    }
  }

  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${passed}/${results.length} checks passed`);
  process.exit(passed === results.length ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
