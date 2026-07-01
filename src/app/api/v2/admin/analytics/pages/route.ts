import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import {
  getTopPages,
  getTopDownloads,
  getTopNotices,
  getTrafficSources,
  getDeviceBreakdown,
  getRegistrationConversionRate,
} from "@/server/services/visitor-analytics.service";
import { startOfMonth } from "@/server/lib/visitor-analytics-utils";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 10);
    const since = searchParams.get("since")
      ? new Date(searchParams.get("since")!)
      : startOfMonth();

    const [topPages, topDownloads, topNotices, trafficSources, devices, conversion] =
      await Promise.all([
        getTopPages(limit, since),
        getTopDownloads(limit),
        getTopNotices(limit),
        getTrafficSources(limit, since),
        getDeviceBreakdown(since),
        getRegistrationConversionRate(),
      ]);

    return {
      success: true,
      topPages,
      topDownloads,
      topNotices,
      trafficSources,
      devices,
      conversion,
    };
  },
  { requireAdmin: true, adminResource: "media" }
);
