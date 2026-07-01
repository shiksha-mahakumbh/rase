import { createApiHandler } from "@/server/lib/api-handler";
import { getAnalyticsDashboard } from "@/server/services/visitor-analytics.service";
import { getDashboardStats } from "@/server/services/dashboard.service";

export const GET = createApiHandler(
  async () => {
    const [analytics, operations] = await Promise.all([
      getAnalyticsDashboard(),
      getDashboardStats(),
    ]);
    return { success: true, analytics, operations };
  },
  { requireAdmin: true, adminResource: "audit_logs" }
);
