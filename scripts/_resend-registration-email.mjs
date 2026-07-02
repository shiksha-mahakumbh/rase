/**
 * Resend registration confirmation for a public registration ID (uses local .env SMTP).
 * Usage: node scripts/_resend-registration-email.mjs SMK2026-000026
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const registrationId = process.argv[2];
if (!registrationId) {
  console.error("Usage: node scripts/_resend-registration-email.mjs <registrationId>");
  process.exit(1);
}

const { prisma } = await import("../src/server/db/prisma.ts");
const { resendRegistrationConfirmationEmail } = await import(
  "../src/server/services/registration-post-submit.service.ts"
);
const { displayRegistrationType } = await import(
  "../src/server/lib/registration-type-labels.ts"
);

const reg = await prisma.registration.findFirst({
  where: { registrationId, deletedAt: null },
  include: {
    paymentRecords: {
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 1,
    },
  },
});

if (!reg) {
  console.error("Registration not found:", registrationId);
  process.exit(1);
}

const metadata = reg.metadata ?? {};
const payment = reg.paymentRecords[0];
const fee = Number(reg.registrationFee ?? payment?.amount ?? 0);

const log = await resendRegistrationConfirmationEmail({
  result: {
    registrationId: reg.registrationId,
    id: reg.id,
    typeDocId: reg.id,
  },
  registrationType: displayRegistrationType(reg.registrationType),
  data: metadata,
  email: reg.email,
  fullName: reg.fullName,
  contact: reg.contactNumber,
  fee,
  razorpayPaymentId: String(reg.razorpayPaymentId ?? payment?.razorpayPaymentId ?? ""),
});

console.log("Resent to", reg.email, "status:", log.status, "id:", log.id);
await prisma.$disconnect();
