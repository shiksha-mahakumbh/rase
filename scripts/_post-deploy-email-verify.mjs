import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const prisma = new PrismaClient();
const PROD_BASE =
  process.env.PROD_VERIFY_URL ?? "https://www.shikshamahakumbh.com";

const reg = await prisma.registration.findFirst({
  orderBy: { createdAt: "desc" },
  select: {
    id: true,
    registrationId: true,
    email: true,
    fullName: true,
    emailDeliveryStatus: true,
  },
});

if (!reg) {
  console.log(JSON.stringify({ error: "no registration row" }, null, 2));
  process.exit(1);
}

const beforeCount = await prisma.emailLog.count();
const beforeLatest = await prisma.emailLog.findFirst({
  orderBy: { createdAt: "desc" },
});

console.log("Before:", { beforeCount, latestStatus: beforeLatest?.status ?? null });

const res = await fetch(`${PROD_BASE}/api/registration/send-email`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    registrationId: reg.registrationId,
    masterDocId: reg.id,
    fullName: reg.fullName,
    email: reg.email,
  }),
});

const apiBody = await res.json().catch(() => ({}));

const afterLatest = await prisma.emailLog.findFirst({
  orderBy: { createdAt: "desc" },
});

const statusDistribution = await prisma.emailLog.groupBy({
  by: ["status"],
  _count: { status: true },
});

const updatedReg = await prisma.registration.findUnique({
  where: { id: reg.id },
  select: { emailDeliveryStatus: true },
});

console.log(
  JSON.stringify(
    {
      verifiedAt: new Date().toISOString(),
      prodUrl: PROD_BASE,
      api: { http: res.status, body: apiBody },
      registration: {
        registrationId: reg.registrationId,
        registrationUuid: reg.id,
        email: reg.email,
        emailDeliveryStatus: updatedReg?.emailDeliveryStatus ?? null,
      },
      email_logs: {
        countBefore: beforeCount,
        countAfter: await prisma.emailLog.count(),
        statusDistribution,
        latest: afterLatest
          ? {
              id: afterLatest.id,
              status: afterLatest.status,
              registrationId: afterLatest.registrationId,
              toEmail: afterLatest.toEmail,
              provider: afterLatest.provider,
              providerMsgId: afterLatest.providerMsgId,
              errorMessage: afterLatest.errorMessage,
              retryCount: afterLatest.retryCount,
              sentAt: afterLatest.sentAt,
              createdAt: afterLatest.createdAt,
            }
          : null,
        uuidFkValid:
          afterLatest?.registrationId === reg.id ||
          afterLatest?.registrationId === null,
      },
    },
    null,
    2
  )
);

await prisma.$disconnect();
