import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const p = new PrismaClient();

const [
  regCount,
  payCount,
  emailCount,
  auditCount,
  uploadCount,
  accommodationCount,
  counter,
  emailStatus,
  payStatus,
  latestRegs,
  latestEmails,
  latestPayments,
  orphanEmailLogs,
  orphanPayments,
] = await Promise.all([
  p.registration.count(),
  p.paymentRecord.count(),
  p.emailLog.count(),
  p.auditLog.count(),
  p.uploadedFile.count(),
  p.accommodationRequest.count().catch(() => -1),
  p.registrationCounter.findUnique({ where: { prefix: "SMK2026" } }),
  p.emailLog.groupBy({ by: ["status"], _count: { status: true } }),
  p.paymentRecord.groupBy({ by: ["status"], _count: { status: true } }),
  p.registration.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      registrationId: true,
      registrationType: true,
      email: true,
      registrationFee: true,
      paymentStatus: true,
      emailDeliveryStatus: true,
      createdAt: true,
    },
  }),
  p.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      registrationId: true,
      toEmail: true,
      status: true,
      provider: true,
      providerMsgId: true,
      sentAt: true,
      createdAt: true,
      errorMessage: true,
    },
  }),
  p.paymentRecord.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { registration: { select: { registrationId: true, email: true } } },
  }),
  p.$queryRaw`
    SELECT e.id, e.registration_id
    FROM email_logs e
    LEFT JOIN registrations r ON r.id = e.registration_id
    WHERE e.registration_id IS NOT NULL AND r.id IS NULL
    LIMIT 10`,
  p.$queryRaw`
    SELECT pr.id, pr.registration_id
    FROM payment_records pr
    LEFT JOIN registrations r ON r.id = pr.registration_id
    WHERE r.id IS NULL
    LIMIT 10`,
]);

console.log(
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      counts: {
        registrations: regCount,
        payment_records: payCount,
        email_logs: emailCount,
        audit_logs: auditCount,
        uploaded_files: uploadCount,
        accommodation_requests: accommodationCount,
      },
      registration_counter: counter,
      email_logs_by_status: emailStatus,
      payment_records_by_status: payStatus,
      latest_registrations: latestRegs.map((r) => ({
        ...r,
        registrationFee: r.registrationFee != null ? String(r.registrationFee) : null,
      })),
      latest_email_logs: latestEmails,
      latest_payment_records: latestPayments.map((x) => ({
        ...x,
        amount: String(x.amount),
        publicRegistrationId: x.registration?.registrationId,
      })),
      orphan_checks: {
        email_logs_without_registration: orphanEmailLogs,
        payment_records_without_registration: orphanPayments,
      },
    },
    null,
    2
  )
);

await p.$disconnect();
