#!/usr/bin/env node
/** Safe read-only production registration audit probes. No submissions, no payments. */
const BASE = "https://www.shikshamahakumbh.com";

const pages = [
  "/registration",
  "/en/registration",
  "/registration/success",
  "/registration/Accomodation",
  "/accommodation",
  "/heiprojectdisplaysubmission",
  "/schoolprojectdisplaysubmission",
  "/abstract",
  "/fulllengthpaper",
  "/registration/volunteer",
  "/registration/ngo",
  "/registration/talent",
  "/registration/conclaveReg",
];

const apis = [
  { name: "lookup_no_auth", method: "GET", path: "/api/registration/SMK2026-000001" },
  { name: "lookup_fake_id", method: "GET", path: "/api/registration/SMK2026-999999" },
  { name: "submit_empty", method: "POST", path: "/api/registration/submit", body: {} },
  {
    name: "submit_invalid_type",
    method: "POST",
    path: "/api/registration/submit",
    body: { registrationType: "Bal Shodh Patrika", data: { fullName: "Test User", email: "test@example.com" } },
  },
  {
    name: "submit_conclave_no_captcha",
    method: "POST",
    path: "/api/registration/submit",
    body: {
      registrationType: "Conclave",
      data: { fullName: "Audit Test", email: "audit-test@example.com" },
    },
  },
  { name: "webhook_unsigned", method: "POST", path: "/api/payments/razorpay-webhook", body: "{}" },
  { name: "create_order_empty", method: "POST", path: "/api/payments/create-order", body: {} },
  { name: "verify_payment_empty", method: "POST", path: "/api/payments/verify-payment", body: {} },
  { name: "admin_registrations", method: "GET", path: "/api/v2/admin/registrations" },
  { name: "admin_gateway", method: "GET", path: "/api/admin/gateway/registrations" },
  { name: "upload_get", method: "GET", path: "/api/registration/upload" },
  { name: "v2_health", method: "GET", path: "/api/v2/health" },
];

const results = { checkedAt: new Date().toISOString(), base: BASE, pages: [], apis: [] };

for (const p of pages) {
  try {
    const res = await fetch(`${BASE}${p}`, { redirect: "follow" });
    const text = await res.text();
    results.pages.push({
      path: p,
      status: res.status,
      finalUrl: res.url,
      hasRegistrationForm: /registrationType|RegistrationHub|submitLegacyForm|useRegistrationSubmit/i.test(text),
      redirected: res.url !== `${BASE}${p}`,
    });
  } catch (e) {
    results.pages.push({ path: p, error: e.message });
  }
}

for (const a of apis) {
  try {
    const opts = {
      method: a.method,
      headers: { "Content-Type": "application/json" },
      body: a.body !== undefined ? (typeof a.body === "string" ? a.body : JSON.stringify(a.body)) : undefined,
    };
    const res = await fetch(`${BASE}${a.path}`, opts);
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = text.slice(0, 200);
    }
    const bodyStr = JSON.stringify(body);
    results.apis.push({
      name: a.name,
      path: a.path,
      method: a.method,
      status: res.status,
      body,
      exposesPii: /"email"\s*:|"contactNumber"\s*:/.test(bodyStr),
    });
  } catch (e) {
    results.apis.push({ name: a.name, path: a.path, error: e.message });
  }
}

console.log(JSON.stringify(results, null, 2));
