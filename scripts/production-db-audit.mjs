#!/usr/bin/env node
/**
 * Production database audit (read-only)
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    if (!process.env[key]) {
      process.env[key] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
}

loadEnvFile(path.resolve(".env.local"));
loadEnvFile(path.resolve(".env"));

if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}

const prisma = new PrismaClient();

async function main() {
  let orphans = [];
  let orphanTableMissing = false;
  try {
    orphans = await prisma.razorpayVerifiedPayment.findMany({
      where: { consumedAt: null },
      orderBy: { verifiedAt: "desc" },
      take: 50,
    });
  } catch (error) {
    if (error?.code === "P2021") {
      orphanTableMissing = true;
    } else {
      throw error;
    }
  }

  const recentRegs = await prisma.registration.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 25,
    select: {
      id: true,
      registrationId: true,
      email: true,
      registrationType: true,
      paymentStatus: true,
      registrationFee: true,
      razorpayPaymentId: true,
      createdAt: true,
    },
  });

  const dupPayments = await prisma.$queryRaw`
    SELECT razorpay_payment_id, COUNT(*)::int AS cnt
    FROM registrations
    WHERE razorpay_payment_id IS NOT NULL AND deleted_at IS NULL
    GROUP BY razorpay_payment_id
    HAVING COUNT(*) > 1
  `;

  const recentEmails = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      template: true,
      status: true,
      toEmail: true,
      registrationId: true,
      provider: true,
      providerMsgId: true,
      errorMessage: true,
      sentAt: true,
      createdAt: true,
    },
  });

  const smkFormatBad = recentRegs.filter(
    (r) => !/^SMK\d{4}-\d{6}$/.test(r.registrationId)
  );

  console.log(
    JSON.stringify(
      {
        orphans: {
          tableMissing: orphanTableMissing,
          count: orphans.length,
          rows: orphans.map((o) => ({
            paymentId: o.razorpayPaymentId,
            orderId: o.razorpayOrderId,
            amount: Number(o.amount),
            verifiedAt: o.verifiedAt.toISOString(),
            email: o.metadata && typeof o.metadata === "object" ? o.metadata.email ?? null : null,
          })),
        },
        recentRegistrations: {
          count: recentRegs.length,
          rows: recentRegs.map((r) => ({
            registrationId: r.registrationId,
            uuid: r.id,
            email: r.email,
            type: r.registrationType,
            paymentStatus: r.paymentStatus,
            fee: r.registrationFee != null ? Number(r.registrationFee) : null,
            paymentId: r.razorpayPaymentId,
            createdAt: r.createdAt.toISOString(),
            smkFormatOk: /^SMK\d{4}-\d{6}$/.test(r.registrationId),
          })),
          smkFormatInvalid: smkFormatBad.map((r) => r.registrationId),
        },
        duplicatePaymentIds: dupPayments,
        recentEmails: {
          count: recentEmails.length,
          byTemplate: recentEmails.reduce(
            (acc, e) => {
              const k = `${e.template}:${e.status}`;
              acc[k] = (acc[k] ?? 0) + 1;
              return acc;
            },
            {}
          ),
          rows: recentEmails.slice(0, 15),
        },
      },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
