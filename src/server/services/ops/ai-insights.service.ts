import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { displayRegistrationType } from "@/server/lib/registration-type-labels";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

type Insight = { type: string; text: string; severity: "info" | "positive" | "warning" };
type Recommendation = { priority: "high" | "medium" | "low"; text: string };

export async function generateAiInsights(force = false) {
  const latest = await prisma.aiInsightSnapshot.findFirst({ orderBy: { generatedAt: "desc" } });
  if (!force && latest && Date.now() - latest.generatedAt.getTime() < 6 * 60 * 60 * 1000) {
    return {
      generatedAt: latest.generatedAt.toISOString(),
      insights: latest.insights as Insight[],
      recommendations: latest.recommendations as Recommendation[],
      metrics: latest.metrics as Record<string, unknown>,
      cached: true,
    };
  }

  const now = new Date();
  const weekAgo = daysAgo(7);
  const twoWeeksAgo = daysAgo(14);

  const [
    regsThisWeek,
    regsLastWeek,
    stateRegsThisWeek,
    stateRegsLastWeek,
    volunteerCount,
    totalRegs,
    roomStats,
    conclaveRegs,
    paidRevenue,
    dailyRegs,
  ] = await Promise.all([
    prisma.registration.count({ where: { deletedAt: null, createdAt: { gte: weekAgo } } }),
    prisma.registration.count({
      where: { deletedAt: null, createdAt: { gte: twoWeeksAgo, lt: weekAgo } },
    }),
    prisma.registration.findMany({
      where: { deletedAt: null, createdAt: { gte: weekAgo }, state: { not: null } },
      select: { state: true },
    }),
    prisma.registration.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: twoWeeksAgo, lt: weekAgo },
        state: { not: null },
      },
      select: { state: true },
    }),
    prisma.registration.count({ where: { deletedAt: null, registrationType: "Volunteer" } }),
    prisma.registration.count({ where: { deletedAt: null } }),
    prisma.accommodationRoom.aggregate({ _sum: { capacity: true, occupied: true } }),
    prisma.registration.groupBy({
      by: ["registrationType"],
      where: { deletedAt: null },
      _count: { id: true },
    }),
    prisma.registration.aggregate({
      where: { deletedAt: null, paymentStatus: "Paid" },
      _sum: { registrationFee: true },
    }),
    prisma.registration.findMany({
      where: { deletedAt: null, createdAt: { gte: daysAgo(14) } },
      select: { createdAt: true, registrationFee: true, paymentStatus: true },
    }),
  ]);

  const insights: Insight[] = [];
  const recommendations: Recommendation[] = [];

  const regChange = pctChange(regsThisWeek, regsLastWeek);
  insights.push({
    type: "registrations",
    text: `Registrations ${regChange >= 0 ? "increased" : "decreased"} ${Math.abs(regChange)}% vs previous week (${regsThisWeek} this week).`,
    severity: regChange >= 0 ? "positive" : "warning",
  });

  const stateCount = (rows: Array<{ state: string | null }>) => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const s = r.state?.trim() || "Unknown";
      m.set(s, (m.get(s) ?? 0) + 1);
    }
    return m;
  };

  const thisMap = stateCount(stateRegsThisWeek);
  const lastMap = stateCount(stateRegsLastWeek);
  let topStateDelta = { state: "", delta: 0, pct: 0 };
  for (const [state, count] of Array.from(thisMap.entries())) {
    const prev = lastMap.get(state) ?? 0;
    const delta = count - prev;
    const p = pctChange(count, prev);
    if (Math.abs(p) > Math.abs(topStateDelta.pct)) {
      topStateDelta = { state, delta, pct: p };
    }
  }
  if (topStateDelta.state) {
    insights.push({
      type: "state_trend",
      text: `Registrations from ${topStateDelta.state} ${topStateDelta.pct >= 0 ? "increased" : "decreased"} ${Math.abs(topStateDelta.pct)}% week-over-week.`,
      severity: topStateDelta.pct >= 0 ? "positive" : "info",
    });
  }

  const capacity = roomStats._sum.capacity ?? 0;
  const occupied = roomStats._sum.occupied ?? 0;
  if (capacity > 0) {
    const dailyRate = regsThisWeek / 7;
    const remaining = capacity - occupied;
    const daysToFull = dailyRate > 0 ? Math.ceil(remaining / (dailyRate * 0.3)) : 999;
    const forecastPct = Math.min(100, Math.round(((occupied + dailyRate * 2) / capacity) * 100));
    insights.push({
      type: "accommodation_forecast",
      text: `Accommodation occupancy projected at ${forecastPct}% within 2 days at current pace.`,
      severity: forecastPct >= 90 ? "warning" : "info",
    });
    if (forecastPct >= 90) {
      recommendations.push({
        priority: "high",
        text: "Open additional accommodation blocks or notify waitlisted guests within 48 hours.",
      });
    }
  }

  const volunteerPct = totalRegs ? Math.round((volunteerCount / totalRegs) * 100) : 0;
  if (volunteerPct < 5) {
    insights.push({
      type: "volunteer_gap",
      text: `Volunteer registrations are lower than expected (${volunteerCount} total, ${volunteerPct}% of all registrations).`,
      severity: "warning",
    });
    recommendations.push({
      priority: "medium",
      text: "Launch a targeted volunteer recruitment campaign via WhatsApp and institution outreach.",
    });
  }

  const topCategory = conclaveRegs.sort((a, b) => b._count.id - a._count.id)[0];
  if (topCategory) {
    insights.push({
      type: "popular_category",
      text: `Most popular category: ${displayRegistrationType(String(topCategory.registrationType))} (${topCategory._count.id} registrations).`,
      severity: "info",
    });
  }

  const avgDailyRevenue =
    dailyRegs.filter((r) => r.paymentStatus === "Paid").reduce((s, r) => s + Number(r.registrationFee ?? 0), 0) /
    14;
  const forecastRevenue = Math.round(avgDailyRevenue * 30);
  const totalRevenue = Number(paidRevenue._sum.registrationFee ?? 0);
  insights.push({
    type: "revenue_forecast",
    text: `Revenue forecast: ₹${forecastRevenue.toLocaleString("en-IN")} over next 30 days (current total ₹${totalRevenue.toLocaleString("en-IN")}).`,
    severity: "positive",
  });

  if (regChange < 0) {
    recommendations.push({
      priority: "high",
      text: "Registration momentum is slowing — consider a reminder email to pending payment registrations.",
    });
  }

  recommendations.push({
    priority: "low",
    text: "Review AI insights daily during peak registration window (2 weeks before event).",
  });

  const metrics = {
    regsThisWeek,
    regsLastWeek,
    regChangePct: regChange,
    volunteerCount,
    totalRevenue,
    forecastRevenue30d: forecastRevenue,
    accommodationOccupancy: capacity ? Math.round((occupied / capacity) * 100) : 0,
  };

  const snapshot = await prisma.aiInsightSnapshot.create({
    data: {
      insights: insights as object,
      recommendations: recommendations as object,
      metrics: metrics as object,
    },
  });

  await writeAuditLog({ action: "ai_insights_generated", payload: { snapshotId: snapshot.id } });

  return {
    generatedAt: snapshot.generatedAt.toISOString(),
    insights,
    recommendations,
    metrics,
    cached: false,
  };
}

export async function listInsightHistory(limit = 10) {
  return prisma.aiInsightSnapshot.findMany({
    orderBy: { generatedAt: "desc" },
    take: limit,
    select: { id: true, generatedAt: true, metrics: true },
  });
}
