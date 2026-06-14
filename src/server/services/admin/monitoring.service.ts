import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { displayRegistrationType } from "@/server/services/admin/receipt-admin.service";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export async function getPaymentMonitoringAnalytics() {
  const todayStart = startOfDay();

  const [
    totalRegistrations,
    paidRegs,
    pendingRegistrations,
    failedPayments,
    recoveredCount,
    emailsSent,
    emailsFailed,
    todayRevenueAgg,
    verifiedOrphans,
    revenueByDayRaw,
    byCategoryRaw,
    capturedPayments,
    attemptedPayments,
  ] = await Promise.all([
    prisma.registration.count({ where: { deletedAt: null } }),
    prisma.registration.findMany({
      where: { deletedAt: null, paymentStatus: "Paid" },
      select: { registrationFee: true },
    }),
    prisma.registration.count({
      where: { deletedAt: null, registrationStatus: "Pending" },
    }),
    prisma.registration.count({
      where: { deletedAt: null, paymentStatus: "Failed" },
    }),
    prisma.auditLog.count({ where: { action: "payment_recovered" } }),
    prisma.emailLog.count({ where: { status: "sent" } }),
    prisma.emailLog.count({ where: { status: "failed" } }),
    prisma.registration.aggregate({
      where: {
        deletedAt: null,
        paymentStatus: "Paid",
        createdAt: { gte: todayStart },
      },
      _sum: { registrationFee: true },
    }),
    prisma.razorpayVerifiedPayment.count({ where: { consumedAt: null } }),
    prisma.registration.findMany({
      where: {
        deletedAt: null,
        paymentStatus: "Paid",
        createdAt: { gte: daysAgo(14) },
      },
      select: { createdAt: true, registrationFee: true },
    }),
    prisma.registration.groupBy({
      by: ["registrationType"],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.registration.count({
      where: { deletedAt: null, paymentStatus: "Paid" },
    }),
    prisma.registration.count({
      where: {
        deletedAt: null,
        paymentStatus: { in: ["Paid", "Failed", "Pending_Payment"] },
        registrationFee: { gt: 0 },
      },
    }),
  ]);

  const totalRevenue = paidRegs.reduce(
    (sum, r) => sum + Number(r.registrationFee ?? 0),
    0
  );
  const todayRevenue = Number(todayRevenueAgg._sum.registrationFee ?? 0);

  const revenueByDayMap = new Map<string, number>();
  for (const row of revenueByDayRaw) {
    const key = row.createdAt.toISOString().slice(0, 10);
    revenueByDayMap.set(
      key,
      (revenueByDayMap.get(key) ?? 0) + Number(row.registrationFee ?? 0)
    );
  }

  const revenueByDay = Array.from(revenueByDayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));

  const registrationsByCategory = byCategoryRaw.map((row) => ({
    category: displayRegistrationType(String(row.registrationType)),
    count: row._count.id,
  }));

  const paymentSuccessRate =
    attemptedPayments > 0
      ? Math.round((capturedPayments / attemptedPayments) * 1000) / 10
      : 100;

  return {
    cards: {
      totalRegistrations,
      totalRevenue,
      todayRevenue,
      pendingRegistrations,
      failedPayments,
      recoveredPayments: recoveredCount,
      emailsSent,
      emailsFailed,
      orphanVerifiedPayments: verifiedOrphans,
      paymentSuccessRate,
    },
    charts: {
      registrationsByCategory,
      revenueByDay,
      paymentSuccessRate,
    },
  };
}

export async function listEmailLogs(options: {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
  registrationId?: string;
}) {
  const { limit = 25, offset = 0, status, search, registrationId } = options;
  const where: Prisma.EmailLogWhereInput = {};

  if (status) where.status = status as "sent" | "failed" | "queued" | "skipped" | "sending";

  if (registrationId) {
    const reg = await prisma.registration.findFirst({
      where: {
        OR: [{ registrationId }, { id: registrationId }],
        deletedAt: null,
      },
      select: { id: true, registrationId: true },
    });
    if (reg) where.registrationId = reg.id;
  }

  if (search?.trim()) {
    where.OR = [
      { toEmail: { contains: search.trim(), mode: "insensitive" } },
      { subject: { contains: search.trim(), mode: "insensitive" } },
      { template: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.emailLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        registration: {
          select: { registrationId: true, fullName: true },
        },
      },
    }),
    prisma.emailLog.count({ where }),
  ]);

  return {
    items: items.map((e) => ({
      id: e.id,
      registrationId: e.registration?.registrationId ?? null,
      registrationUuid: e.registrationId,
      email: e.toEmail,
      template: e.template,
      subject: e.subject,
      status: e.status,
      sentAt: e.sentAt?.toISOString() ?? null,
      errorMessage: e.errorMessage,
      retryCount: e.retryCount,
      createdAt: e.createdAt.toISOString(),
      applicantName: e.registration?.fullName ?? null,
    })),
    total,
    limit,
    offset,
  };
}
