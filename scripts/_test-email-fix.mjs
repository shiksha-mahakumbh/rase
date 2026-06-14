import dotenv from "dotenv";
import { sendRegistrationConfirmation } from "../src/server/services/email.service.ts";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const prisma = new PrismaClient();

const reg = await prisma.registration.findFirst({
  orderBy: { createdAt: "desc" },
  select: { id: true, registrationId: true, email: true, fullName: true },
});

if (!reg) {
  console.log("No registration row to test");
  process.exit(1);
}

console.log("Testing sendRegistrationConfirmation for", reg.registrationId);

try {
  const log = await sendRegistrationConfirmation({
    registrationId: reg.registrationId,
    registrationUuid: reg.id,
    fullName: reg.fullName,
    email: reg.email,
  });
  console.log("Result:", {
    emailLogId: log.id,
    status: log.status,
    errorMessage: log.errorMessage,
    providerMsgId: log.providerMsgId,
  });
} catch (e) {
  console.error("FAILED:", e instanceof Error ? e.message : e);
}

const count = await prisma.emailLog.count();
console.log("email_logs count:", count);

await prisma.$disconnect();
