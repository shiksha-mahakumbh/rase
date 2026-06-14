import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function mask(v) {
  if (!v) return null;
  if (v.length <= 4) return "****";
  return `${v.slice(0, 4)}***`;
}

function readEnvFile(name) {
  const p = path.join(process.cwd(), name);
  if (!fs.existsSync(p)) return { exists: false };
  const raw = fs.readFileSync(p, "utf8");
  const keys = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    const [, key, val] = m;
    if (key.startsWith("SMTP_") || key.startsWith("BREVO_")) {
      keys[key] = val ? (key.includes("PASS") || key.includes("KEY") ? "(set)" : val.replace(/^["']|["']$/g, "")) : "(empty)";
    }
  }
  return { exists: true, keys };
}

const envFiles = [".env", ".env.local", ".env.production", ".env.example", ".env.supabase.example"];
const envAudit = {};
for (const f of envFiles) {
  envAudit[f] = readEnvFile(f);
}

const runtime = {
  SMTP_HOST: process.env.SMTP_HOST ?? null,
  SMTP_PORT: process.env.SMTP_PORT ?? null,
  SMTP_USER: mask(process.env.SMTP_USER),
  SMTP_PASS: process.env.SMTP_PASS ? "(set)" : null,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD ? "(set)" : null,
  SMTP_FROM: process.env.SMTP_FROM ?? null,
  SMTP_SECURE: process.env.SMTP_SECURE ?? null,
  SMTP_PROVIDER: process.env.SMTP_PROVIDER ?? null,
  BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST ?? null,
  BREVO_SMTP_PORT: process.env.BREVO_SMTP_PORT ?? null,
  BREVO_SMTP_USER: mask(process.env.BREVO_SMTP_USER),
  BREVO_SMTP_PASS: process.env.BREVO_SMTP_PASS ? "(set)" : null,
  BREVO_SMTP_FROM: process.env.BREVO_SMTP_FROM ?? null,
  BREVO_API_KEY: process.env.BREVO_API_KEY ? "(set)" : null,
  DATABASE_URL: process.env.DATABASE_URL ? "(set)" : null,
};

const totalLogs = await prisma.emailLog.count();
const statusGroups = await prisma.emailLog.groupBy({
  by: ["status"],
  _count: { status: true },
});
const latestLogs = await prisma.emailLog.findMany({
  orderBy: { createdAt: "desc" },
  take: 10,
  select: {
    id: true,
    status: true,
    toEmail: true,
    template: true,
    registrationId: true,
    errorMessage: true,
    provider: true,
    providerMsgId: true,
    retryCount: true,
    sentAt: true,
    createdAt: true,
  },
});

const recentRegs = await prisma.registration.findMany({
  orderBy: { createdAt: "desc" },
  take: 10,
  select: {
    registrationId: true,
    email: true,
    emailDeliveryStatus: true,
    createdAt: true,
  },
});

// Test UUID vs public ID insert behavior
let uuidInsertTest = null;
let publicIdInsertError = null;
try {
  await prisma.emailLog.create({
    data: {
      registrationId: "SMK2026-000001",
      toEmail: "probe@test.local",
      subject: "probe",
      status: "queued",
    },
  });
  uuidInsertTest = "unexpected_success";
} catch (e) {
  publicIdInsertError = e instanceof Error ? e.message.split("\n")[0] : String(e);
}

console.log(
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      envFiles: envAudit,
      runtimeEnv: runtime,
      database: {
        email_logs_total: totalLogs,
        status_distribution: statusGroups,
        latest_logs: latestLogs,
        recent_registrations_email_status: recentRegs,
        public_id_insert_error: publicIdInsertError,
      },
    },
    null,
    2
  )
);

await prisma.$disconnect();
