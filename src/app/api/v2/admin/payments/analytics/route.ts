import { createApiHandler } from "@/server/lib/api-handler";
import { getPaymentMonitoringAnalytics } from "@/server/services/admin/monitoring.service";

export const GET = createApiHandler(
  async () => getPaymentMonitoringAnalytics(),
  { requireAdmin: true, adminResource: "payments", rateLimitKey: "admin-payments-analytics", limit: 60 }
);
