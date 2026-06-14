import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function mask(v) {
  if (!v) return "(missing)";
  if (v.length <= 4) return "****";
  return `${v.slice(0, 3)}***${v.slice(-2)}`;
}

console.log("=== SMTP ENV (masked) ===");
console.log({
  SMTP_HOST: process.env.SMTP_HOST ?? "(missing)",
  SMTP_PORT: process.env.SMTP_PORT ?? "587 (default)",
  SMTP_USER: mask(process.env.SMTP_USER),
  SMTP_PASS: process.env.SMTP_PASS ? "(set)" : "(missing)",
  SMTP_FROM: process.env.SMTP_FROM ?? "(missing)",
  BREVO_API_KEY: process.env.BREVO_API_KEY ? "(set)" : "(missing)",
});

console.log("\n=== Test email_logs create with human registrationId ===");
try {
  await prisma.emailLog.create({
    data: {
      registrationId: "SMK2026-000004",
      toEmail: "audit-test@example.com",
      subject: "audit probe",
      template: "registration_confirmation",
      status: "queued",
      provider: "smtp",
    },
  });
  console.log("UNEXPECTED: create succeeded with human id");
} catch (e) {
  console.log("EXPECTED FAIL:", e instanceof Error ? e.message : e);
}

console.log("\n=== Resolve registration UUID for SMK2026-000004 ===");
const reg = await prisma.registration.findUnique({
  where: { registrationId: "SMK2026-000004" },
  select: { id: true, registrationId: true, email: true, emailDeliveryStatus: true },
});
console.log(reg);

if (reg) {
  console.log("\n=== Test email_logs create with UUID ===");
  try {
    const log = await prisma.emailLog.create({
      data: {
        registrationId: reg.id,
        toEmail: "audit-test@example.com",
        subject: "audit probe uuid",
        template: "registration_confirmation",
        status: "queued",
        provider: "smtp",
      },
    });
    console.log("UUID create OK:", log.id, log.status);
    await prisma.emailLog.delete({ where: { id: log.id } });
  } catch (e) {
    console.log("UUID create FAIL:", e instanceof Error ? e.message : e);
  }
}

console.log("\n=== email_logs count ===");
console.log(await prisma.emailLog.count());

await prisma.$disconnect();
