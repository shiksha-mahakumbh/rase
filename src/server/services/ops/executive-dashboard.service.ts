import { prisma } from "@/server/db/prisma";
import { getLifecycleAnalytics } from "@/server/services/lifecycle/lifecycle-analytics.service";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export type ExecutiveAlert = {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  metric?: number;
};

export async function getExecutiveDashboard() {
  const [
    lifecycle,
    totalRevenueAgg,
    researchSubmitted,
    pendingReviews,
    recentFailedPayments,
    recentEmailFailures,
    roomStats,
    eligibleNoCert,
    unreviewedPapers,
  ] = await Promise.all([
    getLifecycleAnalytics(),
    prisma.registration.aggregate({
      where: { deletedAt: null, paymentStatus: "Paid" },
      _sum: { registrationFee: true },
    }),
    prisma.researchSubmission.count(),
    prisma.researchSubmission.count({
      where: { status: { in: ["Submitted", "Under_Review"] } },
    }),
    prisma.registration.count({
      where: { deletedAt: null, paymentStatus: "Failed", updatedAt: { gte: daysAgo(1) } },
    }),
    prisma.emailLog.count({
      where: { status: "failed", createdAt: { gte: daysAgo(1) } },
    }),
    prisma.accommodationRoom.aggregate({ _sum: { capacity: true, occupied: true } }),
    prisma.registration.count({
      where: {
        deletedAt: null,
        certificateEligible: true,
        certificateLifecycleStatus: "Eligible",
        attendeeCertificate: { is: null },
      },
    }),
    prisma.researchSubmission.count({
      where: { status: "Submitted", reviewerUserId: null },
    }),
  ]);

  const totalRevenue = Number(totalRevenueAgg._sum.registrationFee ?? 0);
  const capacity = roomStats._sum.capacity ?? 0;
  const occupied = roomStats._sum.occupied ?? 0;
  const occupancyPct = capacity ? Math.round((occupied / capacity) * 100) : 0;

  const metrics = {
    totalRegistrations: lifecycle.cards.totalRegistrations,
    totalRevenue,
    occupancyPercent: lifecycle.cards.accommodationOccupancy,
    checkInPercent: lifecycle.cards.checkInPercent,
    certificatesIssued: lifecycle.cards.certificatesIssued,
    researchPapersSubmitted: researchSubmitted,
    pendingReviews,
    accommodationUtilization: occupancyPct,
    sessionAttendanceRecords: lifecycle.cards.sessionAttendanceRecords,
  };

  const alerts: ExecutiveAlert[] = [];

  if (recentFailedPayments >= 5) {
    alerts.push({
      id: "payment-failures",
      severity: "critical",
      title: "Payment failures spike",
      message: `${recentFailedPayments} failed payments in the last 24 hours`,
      metric: recentFailedPayments,
    });
  } else if (recentFailedPayments > 0) {
    alerts.push({
      id: "payment-failures",
      severity: "warning",
      title: "Payment failures detected",
      message: `${recentFailedPayments} failed payment(s) in last 24h`,
      metric: recentFailedPayments,
    });
  }

  if (recentEmailFailures >= 10) {
    alerts.push({
      id: "email-failures",
      severity: "critical",
      title: "Email delivery failures",
      message: `${recentEmailFailures} emails failed in the last 24 hours`,
      metric: recentEmailFailures,
    });
  } else if (recentEmailFailures > 0) {
    alerts.push({
      id: "email-failures",
      severity: "warning",
      title: "Email delivery issues",
      message: `${recentEmailFailures} email failure(s) in last 24h`,
      metric: recentEmailFailures,
    });
  }

  if (capacity > 0 && occupancyPct >= 90) {
    alerts.push({
      id: "room-capacity",
      severity: occupancyPct >= 95 ? "critical" : "warning",
      title: "Room capacity nearing limit",
      message: `${occupancyPct}% occupancy (${occupied}/${capacity} beds)`,
      metric: occupancyPct,
    });
  }

  if (unreviewedPapers > 0) {
    alerts.push({
      id: "unreviewed-papers",
      severity: unreviewedPapers > 20 ? "critical" : "warning",
      title: "Unreviewed papers",
      message: `${unreviewedPapers} paper(s) awaiting reviewer assignment`,
      metric: unreviewedPapers,
    });
  }

  if (eligibleNoCert > 0) {
    alerts.push({
      id: "missing-certificates",
      severity: "info",
      title: "Certificates pending issuance",
      message: `${eligibleNoCert} eligible attendee(s) without issued certificate`,
      metric: eligibleNoCert,
    });
  }

  if (pendingReviews > 15) {
    alerts.push({
      id: "pending-reviews",
      severity: "warning",
      title: "Review backlog",
      message: `${pendingReviews} research submissions under review`,
      metric: pendingReviews,
    });
  }

  const categoryBreakdown = lifecycle.charts.registrationsByCategory.map((c) => ({
    category: c.category,
    count: c.count,
  }));

  return {
    metrics,
    alerts,
    charts: {
      registrationsByState: lifecycle.charts.registrationsByState,
      dailyRegistrations: lifecycle.charts.dailyRegistrations,
      revenueByCategory: lifecycle.charts.revenueByCategory,
      categoryBreakdown,
    },
    generatedAt: new Date().toISOString(),
  };
}

export async function getSessionAttendanceSummary() {
  const sessions = await prisma.eventSession.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { startAt: "asc" },
    include: { _count: { select: { attendances: true } } },
  });

  return sessions.map((s) => ({
    id: s.id,
    title: s.title,
    sessionType: s.sessionType,
    venue: s.venue,
    capacity: s.capacity,
    attendance: s._count.attendances,
    fillPercent: s.capacity ? Math.round((s._count.attendances / s.capacity) * 100) : 0,
    startAt: s.startAt.toISOString(),
  }));
}
