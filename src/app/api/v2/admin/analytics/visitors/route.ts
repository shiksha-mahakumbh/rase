import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import {
  getVisitorMetrics,
  getAnalyticsChartData,
  getPageCategoryBreakdown,
  getPublicVisitorStats,
} from "@/server/services/visitor-analytics.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") ?? "day") as "day" | "week" | "month" | "year";

    const [stats, metrics, chart, categories] = await Promise.all([
      getPublicVisitorStats(false),
      getVisitorMetrics(period),
      getAnalyticsChartData(period),
      getPageCategoryBreakdown(),
    ]);

    return { success: true, stats, metrics, chart, categories };
  },
  { requireAdmin: true }
);
