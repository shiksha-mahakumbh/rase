import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getExecutiveDashboard, getSessionAttendanceSummary } from "@/server/services/ops/executive-dashboard.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("sessions") === "1") {
      return getSessionAttendanceSummary();
    }
    return getExecutiveDashboard();
  },
  { requireAdmin: true, rateLimitKey: "admin-executive", limit: 60 }
);
