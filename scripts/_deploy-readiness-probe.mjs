#!/usr/bin/env node
/** Deployment-readiness probe — production bundle + live endpoints */
const BASE = "https://www.shikshamahakumbh.com";

async function fetchText(url) {
  const r = await fetch(url);
  return { status: r.status, text: await r.text(), headers: r.headers };
}

const htmlRes = await fetchText(`${BASE}/registration`);
const html = htmlRes.text;

const chunkPaths = [...new Set([...html.matchAll(/\/_next\/static\/chunks\/[^"']+\.js/g)].map((m) => m[0]))];

const markers = {
  afterInteractive: false,
  recaptchaClient: false,
  waitForRecaptcha: false,
  executeRecaptcha: false,
  registrationRazorpay: false,
  RegistrationFlowProvider: false,
  useRegisterPaymentGate: false,
  minScore03: false,
  registrationPayment: false,
  razorpayCheckoutScript: false,
  requestPaymentStep: false,
};

const matchedChunks = {};

for (const chunk of chunkPaths) {
  try {
    const js = await fetch(BASE + chunk).then((r) => r.text());
    const hits = [];
    if (js.includes("afterInteractive")) { markers.afterInteractive = true; hits.push("afterInteractive"); }
    if (js.includes("waitForRecaptcha")) { markers.recaptchaClient = true; markers.waitForRecaptcha = true; hits.push("waitForRecaptcha"); }
    if (js.includes("executeRecaptcha")) { markers.executeRecaptcha = true; hits.push("executeRecaptcha"); }
    if (js.includes("registration-razorpay")) { markers.registrationRazorpay = true; hits.push("registration-razorpay"); }
    if (js.includes("RegistrationFlowProvider")) { markers.RegistrationFlowProvider = true; hits.push("RegistrationFlowProvider"); }
    if (js.includes("useRegisterPaymentGate")) { markers.useRegisterPaymentGate = true; hits.push("useRegisterPaymentGate"); }
    if (js.includes('"0.3"') || js.includes("??\"0.3\"") || js.includes('??"0.3"')) { markers.minScore03 = true; hits.push("minScore0.3"); }
    if (js.includes("registration-payment")) { markers.registrationPayment = true; hits.push("registration-payment"); }
    if (js.includes("requestPaymentStep")) { markers.requestPaymentStep = true; hits.push("requestPaymentStep"); }
    if (js.includes("checkout.razorpay.com")) { markers.razorpayCheckoutScript = true; hits.push("razorpay-script"); }
    if (js.includes("razorpayPaymentId")) { hits.push("razorpayPaymentId"); }
    if (hits.length) matchedChunks[chunk] = hits;
  } catch { /* skip */ }
}

// Also scan layout chunks linked from html
const scriptPaths = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]);
for (const chunk of scriptPaths) {
  if (matchedChunks[chunk]) continue;
  try {
    const js = await fetch(BASE + chunk).then((r) => r.text());
    if (js.includes("waitForRecaptcha")) {
      markers.recaptchaClient = true;
      markers.waitForRecaptcha = true;
      matchedChunks[chunk] = ["waitForRecaptcha"];
    }
  } catch { /* skip */ }
}

// Live endpoints
const endpoints = {};

const verifyCaptcha = await fetch(`${BASE}/api/registration/verify-captcha`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token: "", action: "registration" }),
});
endpoints.verifyCaptcha = { status: verifyCaptcha.status, body: await verifyCaptcha.text() };

const verifyCaptchaInvalid = await fetch(`${BASE}/api/registration/verify-captcha`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token: "invalid-token-xyz", action: "registration" }),
});
endpoints.verifyCaptchaInvalid = { status: verifyCaptchaInvalid.status, body: await verifyCaptchaInvalid.text() };

const submitNoCaptcha = await fetch(`${BASE}/api/registration/submit`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    registrationType: "Bal Shodh Patrika",
    data: { fullName: "Deploy Check", email: "deploy-check@test.com" },
  }),
});
endpoints.submitNoCaptcha = { status: submitNoCaptcha.status, body: await submitNoCaptcha.text() };

const createOrder = await fetch(`${BASE}/api/payments/create-order`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 10000, currency: "INR", receipt: "deploy_probe" }),
});
endpoints.createOrder = { status: createOrder.status, body: await createOrder.text() };

const verifyPayment = await fetch(`${BASE}/api/payments/verify-payment`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
endpoints.verifyPayment = { status: verifyPayment.status, body: await verifyPayment.text() };

// Site key in bundle
let siteKey = null;
for (const chunk of Object.keys(matchedChunks).length ? Object.keys(matchedChunks) : chunkPaths.slice(0, 20)) {
  try {
    const js = await fetch(BASE + chunk).then((r) => r.text());
    const k = js.match(/6L[a-zA-Z0-9_-]{38,40}/);
    if (k) { siteKey = k[0]; break; }
  } catch { /* skip */ }
}
if (!siteKey) {
  for (const chunk of chunkPaths.slice(0, 30)) {
    try {
      const js = await fetch(BASE + chunk).then((r) => r.text());
      const k = js.match(/6L[a-zA-Z0-9_-]{38,40}/);
      if (k) { siteKey = k[0]; break; }
    } catch { /* skip */ }
  }
}

// Deployment headers
const deployMeta = {
  xVercelId: htmlRes.headers.get("x-vercel-id"),
  cacheControl: htmlRes.headers.get("cache-control"),
  date: htmlRes.headers.get("date"),
};

console.log(JSON.stringify({
  probedAt: new Date().toISOString(),
  productionUrl: BASE,
  deployMeta,
  siteKeyInBundle: siteKey,
  bundleMarkers: markers,
  matchedChunks,
  endpoints,
}, null, 2));
