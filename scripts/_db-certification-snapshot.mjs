import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
try {
  const counter = await prisma.registrationCounter.findUnique({
    where: { prefix: "SMK2026" },
  });
  const recent = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      registrationId: true,
      registrationType: true,
      registrationFee: true,
      paymentStatus: true,
      createdAt: true,
      emailDeliveryStatus: true,
    },
  });
  const emails = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      toEmail: true,
      status: true,
      template: true,
      registrationId: true,
      sentAt: true,
      errorMessage: true,
      provider: true,
    },
  });
  const payments = await prisma.paymentRecord.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      razorpayPaymentId: true,
      razorpayOrderId: true,
      amount: true,
      status: true,
      createdAt: true,
    },
  });
  console.log(JSON.stringify({ counter, recent, emails, payments }, null, 2));
} finally {
  await prisma.$disconnect();
}
