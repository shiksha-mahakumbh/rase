#!/usr/bin/env node
/**
 * Production go-live audit — live evidence only.
 * Usage: node scripts/launch-go-live-audit.mjs [baseUrl]
 */
const BASE = (process.argv[2] || "https://www.rase.co.in").replace(/\/$/, "");
const PROJECT = "shiksha-mahakumbh-abhiyan";
const API_KEY = "AIzaSyDL6UJwLh8KaNHARuedHNTjWIcFixkfv5s";
const DB = "default";

const report = {
  checkedAt: new Date().toISOString(),
  base: BASE,
  commit: "51672b0",
  deploymentUrl: "https://rase-co-nzketx6v4-dhe-projects.vercel.app",
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

let adminToken = null;
async function getAdminToken() {
  if (adminToken) return adminToken;
  const fs = await import("node:fs");
  const { GoogleAuth } = await import("google-auth-library");
  const candidates = [
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    process.env.FIREBASE_SA_PATH,
  ].filter(Boolean);
  let raw = candidates[0];
  if (!raw && process.env.FIREBASE_SA_PATH) {
    raw = fs.readFileSync(process.env.FIREBASE_SA_PATH, "utf8");
  }
  if (!raw) {
    const local = [
      ".env.local",
      "c:/Users/LENOVO/Downloads/shiksha-mahakumbh-abhiyan-firebase-adminsdk-fbsvc-99720e9ed8.json",
    ];
    for (const p of local) {
      if (fs.existsSync(p)) {
        raw = p.endsWith(".json")
          ? fs.readFileSync(p, "utf8")
          : fs
              .readFileSync(p, "utf8")
              .split(/\r?\n/)
              .find((l) => l.startsWith("FIREBASE_SERVICE_ACCOUNT_JSON="))
              ?.slice("FIREBASE_SERVICE_ACCOUNT_JSON=".length);
        if (raw) break;
      }
    }
  }
  if (!raw) throw new Error("No service account for admin Firestore reads");
  const sa = JSON.parse(raw);
  const auth = new GoogleAuth({
    credentials: sa,
    scopes: ["https://www.googleapis.com/auth/datastore"],
  });
  const client = await auth.getClient();
  adminToken = (await client.getAccessToken()).token;
  return adminToken;
}

async function firestoreRest(path, { admin = false } = {}) {
  const encodedDb = encodeURIComponent(DB);
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/${encodedDb}/documents/${path}`;
  const headers = admin
    ? { Authorization: `Bearer ${await getAdminToken()}` }
    : { "x-goog-api-key": API_KEY };
  const res = await fetch(url, { headers });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

function fieldVal(f) {
  if (!f) return null;
  return (
    f.stringValue ??
    f.integerValue ??
    f.timestampValue ??
    f.booleanValue ??
    "(complex)"
  );
}

async function phase7() {
  const health = await http("GET", "/api/health");
  const adminHealth = await http("GET", "/api/health/firebase-admin");
  report.phases.diagnostics = {
    health: { status: health.status, body: health.json },
    firebaseAdmin: { status: adminHealth.status, body: adminHealth.json },
  };
}

async function phase2(registrationId = "SMK2026-000001") {
  const counter = await firestoreRest("registrationCounters/smk2026", {
    admin: true,
  });
  const regs = await firestoreRest(
    `registrations?pageSize=10`,
    { admin: true }
  );
  const conclave = await firestoreRest(
    `conclave_registrations?pageSize=10`,
    { admin: true }
  );
  const audits = await firestoreRest(`audit_logs?pageSize=10`, { admin: true });

  const masterDoc = (regs.body.documents || []).find((d) => {
    const id = fieldVal(d.fields?.registrationId);
    return id === registrationId;
  });

  const typeDoc = (conclave.body.documents || []).find((d) => {
    const id = fieldVal(d.fields?.registrationId);
    return id === registrationId;
  });

  const auditDoc = (audits.body.documents || []).find((d) => {
    const id = fieldVal(d.fields?.registrationId);
    return id === registrationId;
  });

  report.phases.firestore = {
    counter: {
      status: counter.status,
      lastNumber: fieldVal(counter.body.fields?.lastNumber),
      currentNumber: fieldVal(counter.body.fields?.currentNumber),
    },
    registrationId,
    masterDocId: masterDoc?.name?.split("/").pop() ?? null,
    typeDocId: typeDoc?.name?.split("/").pop() ?? null,
    auditLogId: auditDoc?.name?.split("/").pop() ?? null,
    masterFields: masterDoc
      ? Object.fromEntries(
          Object.entries(masterDoc.fields || {}).map(([k, v]) => [k, fieldVal(v)])
        )
      : null,
    lookup: await http("GET", `/api/registration/${registrationId}`),
  };
}

async function phase3() {
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

async function phase4() {
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
      masterDocId: "Im8yQc0E2KH9T6HT3R81",
    }),
  });
  report.phases.email = {
    missingFields: { status: missing.status, body: missing.json },
    conclaveSend: { status: send.status, body: send.json },
  };
}

async function phase5() {
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

async function phase6() {
  const admin = await http("GET", "/admin");
  const registration = await http("GET", "/registration");
  report.phases.admin = {
    adminPage: {
      status: admin.status,
      hasSignIn:
        typeof admin.text === "string" &&
        (admin.text.includes("Sign in") ||
          admin.text.includes("Google") ||
          admin.text.includes("Loading")),
      titleSnippet: admin.text.match(/<title>([^<]+)/)?.[1] ?? null,
    },
    registrationHub: { status: registration.status },
  };
}

async function phase8() {
  const paths = [
    "registrations",
    "paymentRecords",
    "audit_logs",
    "registrationCounters/smk2026",
  ];
  const anonDefault = {};
  for (const p of paths) {
    const r = await firestoreRest(p);
    anonDefault[p] = {
      status: r.status,
      error: r.body?.error?.message ?? null,
      denied:
        r.status === 403 ||
        r.body?.error?.status === "PERMISSION_DENIED" ||
        (r.status === 200 && !r.body.documents && !r.body.fields),
    };
  }
  const wrongDb = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/registrations?pageSize=1`,
    { headers: { "x-goog-api-key": API_KEY } }
  );
  const wrongDbBody = await wrongDb.json().catch(() => ({}));
  report.phases.security = {
    anonymousReadsDbDefault: anonDefault,
    wrongDatabaseId_default: {
      status: wrongDb.status,
      error: wrongDbBody?.error?.message ?? null,
    },
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
  };
}

async function main() {
  await phase7();
  await phase2();
  await phase3();
  await phase4();
  await phase5();
  await phase6();
  await phase8();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
