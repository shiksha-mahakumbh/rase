import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env" });

const prisma = new PrismaClient();
const registrationId = process.argv[2] ?? "SMK2026-000026";

const reg = await prisma.registration.findFirst({
  where: { registrationId },
  select: {
    id: true,
    email: true,
    fullName: true,
    emailDeliveryStatus: true,
    receiptSentAt: true,
    qrSentAt: true,
  },
});

console.log("registration:", reg);

if (reg) {
  const logs = await prisma.emailLog.findMany({
    where: { registrationId: reg.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      status: true,
      errorMessage: true,
      createdAt: true,
      sentAt: true,
      toEmail: true,
      template: true,
      subject: true,
      provider: true,
      providerMsgId: true,
    },
  });
  console.log("email_logs:", logs);
}

await prisma.$disconnect();
