import { prisma } from "@/server/db/prisma";
import { displayRegistrationType } from "@/server/services/admin/receipt-admin.service";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export async function getLifecycleAnalytics() {
  const [
    totalRegistrations,
    checkedIn,
    certificatesIssued,
    accommodationAllocated,
    roomStats,
    byCategory,
    byStateRaw,
    byInstitutionRaw,
    dailyRegs,
    revenueByCategory,
    sessionCount,
  ] = await Promise.all([
    prisma.registration.count({ where: { deletedAt: null } }),
    prisma.registration.count({ where: { deletedAt: null, checkInStatus: "Checked_In" } }),
    prisma.attendeeCertificate.count(),
    prisma.accommodationRequest.count({ where: { status: "Allocated", deletedAt: null } }),
    prisma.accommodationRoom.aggregate({ _sum: { capacity: true, occupied: true } }),
    prisma.registration.groupBy({
      by: ["registrationType"],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.registration.findMany({
      where: { deletedAt: null, state: { not: null } },
      select: { state: true },
    }),
    prisma.registration.groupBy({
      by: ["institution"],
      where: { deletedAt: null },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.registration.findMany({
      where: { deletedAt: null, createdAt: { gte: daysAgo(14) } },
      select: { createdAt: true },
    }),
    prisma.registration.findMany({
      where: { deletedAt: null, paymentStatus: "Paid" },
      select: { registrationType: true, registrationFee: true },
    }),
    prisma.sessionAttendance.count(),
  ]);

  const stateMap = new Map<string, number>();
  for (const r of byStateRaw) {
    const s = r.state?.trim() || "Unknown";
    stateMap.set(s, (stateMap.get(s) ?? 0) + 1);
  }

  const dailyMap = new Map<string, number>();
  for (const r of dailyRegs) {
    const key = r.createdAt.toISOString().slice(0, 10);
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
  }

  const revenueMap = new Map<string, number>();
  for (const r of revenueByCategory) {
    const cat = displayRegistrationType(String(r.registrationType));
    revenueMap.set(cat, (revenueMap.get(cat) ?? 0) + Number(r.registrationFee ?? 0));
  }

  const totalCapacity = roomStats._sum.capacity ?? 0;
  const totalOccupied = roomStats._sum.occupied ?? 0;

  return {
    cards: {
      totalRegistrations,
      checkInPercent: totalRegistrations
        ? Math.round((checkedIn / totalRegistrations) * 1000) / 10
        : 0,
      checkedIn,
      accommodationOccupancy: totalCapacity
        ? Math.round((totalOccupied / totalCapacity) * 1000) / 10
        : 0,
      accommodationAllocated,
      certificatesIssued,
      sessionAttendanceRecords: sessionCount,
    },
    charts: {
      registrationsByCategory: byCategory.map((r) => ({
        category: displayRegistrationType(String(r.registrationType)),
        count: r._count.id,
      })),
      registrationsByState: Array.from(stateMap.entries())
        .map(([state, count]) => ({ state, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15),
      registrationsByInstitution: byInstitutionRaw.map((r) => ({
        institution: r.institution,
        count: r._count.id,
      })),
      dailyRegistrations: Array.from(dailyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count })),
      revenueByCategory: Array.from(revenueMap.entries()).map(([category, revenue]) => ({
        category,
        revenue,
      })),
    },
  };
}
