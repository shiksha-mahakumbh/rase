#!/usr/bin/env node
/**
 * Production go-live audit — live HTTP evidence only (Supabase backend).
 * Usage: node scripts/launch-go-live-audit.mjs [baseUrl]
 */
const BASE = (process.argv[2] || "https://www.shikshamahakumbh.com").replace(/\/$/, "");

const report = {
  checkedAt: new Date().toISOString(),
  base: BASE,
  backend: "supabase",
  phases: {},
};

async function http(method, path, opts = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, { method, ...opts });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = text.slice(0, 300);
  }
  return { status: res.status, json, text: text.slice(0, 500) };
}

async function phaseDiagnostics() {
  const health = await http("GET", "/api/health");
  const v2Health = await http("GET", "/api/v2/health");
  report.phases.diagnostics = {
    health: { status: health.status, body: health.json },
    v2Health: {
      status: v2Health.status,
      backend: v2Health.json?.backend ?? null,
      database: v2Health.json?.supabase?.database ?? null,
      body: v2Health.json,
    },
  };
}

async function phaseRegistration(registrationId = "SMK2026-000001") {
  const lookup = await http("GET", `/api/registration/${registrationId}`);
  const lookupPost = await http("POST", "/api/v2/registration/lookup", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registrationId, email: "probe@example.invalid" }),
  });

  report.phases.registration = {
    registrationId,
    publicGet: {
      status: lookup.status,
      requiresAuth: lookup.status === 401 || lookup.status === 400,
      body: lookup.json,
    },
    lookupPost: {
      status: lookupPost.status,
      body: lookupPost.json,
    },
  };
}

async function phaseUpload() {
  const noFile = await http("POST", "/api/registration/upload", {
    method: "POST",
    body: new FormData(),
  });
  const form = new FormData();
  const pdf = new Blob(["%PDF-1.4 launch-audit\n"], { type: "application/pdf" });
  form.append("file", pdf, "launch-audit.pdf");
  form.append("registrationType", "Best Practices");
  form.append("field", "supportingPdf");
  const upload = await http("POST", "/api/registration/upload", {
    method: "POST",
    body: form,
  });
  report.phases.upload = {
    noFile: { status: noFile.status, body: noFile.json },
    pdfUpload: { status: upload.status, body: upload.json },
  };
}

async function phaseEmail() {
  const missing = await http("POST", "/api/registration/send-email", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const send = await http("POST", "/api/registration/send-email", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      registrationId: "SMK2026-000001",
      registrationType: "Conclave",
      fullName: "Release Verify",
      email: "release-verify+20260609@rase.co.in",
    }),
  });
  report.phases.email = {
    missingFields: { status: missing.status, body: missing.json },
    conclaveSend: { status: send.status, body: send.json },
  };
}

async function phaseRazorpay() {
  const badSig = await http("POST", "/api/payments/razorpay-webhook", {
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": "invalid",
    },
    body: JSON.stringify({ event: "payment.captured" }),
  });
  const noSig = await http("POST", "/api/payments/razorpay-webhook", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "payment.captured" }),
  });
  report.phases.razorpay = {
    invalidSignature: { status: badSig.status, body: badSig.json },
    missingSignature: { status: noSig.status, body: noSig.json },
  };
}

async function phaseAdmin() {
  const admin = await http("GET", "/admin");
  const registration = await http("GET", "/registration");
  report.phases.admin = {
    adminPage: {
      status: admin.status,
      hasSignIn:
        typeof admin.text === "string" &&
        (admin.text.includes("Sign in") ||
          admin.text.includes("Email") ||
          admin.text.includes("Password") ||
          admin.text.includes("Loading")),
      titleSnippet: admin.text.match(/<title>([^<]+)/)?.[1] ?? null,
    },
    registrationHub: { status: registration.status },
  };
}

async function phaseSecurity() {
  report.phases.security = {
    submitWithoutCaptcha: await http("POST", "/api/registration/submit", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationType: "Conclave",
        data: {
          fullName: "Security Probe",
          email: "security-probe@rase.co.in",
          gender: "Male",
          designation: "Tester",
          institution: "QA",
          address: "Test",
          country: "India",
          contactNumber: "9999999999",
          vidyaBharti: "Non Vidya Bharti",
          accommodationRequired: "No",
          conclaveSelection: "Research Conclave",
          participationType: "Observer",
        },
      }),
    }),
    captchaProbe: await http("POST", "/api/registration/verify-captcha", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "probe", action: "registration" }),
    }),
  };
}

async function main() {
  await phaseDiagnostics();
  await phaseRegistration();
  await phaseUpload();
  await phaseEmail();
  await phaseRazorpay();
  await phaseAdmin();
  await phaseSecurity();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
