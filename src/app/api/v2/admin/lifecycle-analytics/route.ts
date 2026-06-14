import { createApiHandler } from "@/server/lib/api-handler";
import { getLifecycleAnalytics } from "@/server/services/lifecycle/lifecycle-analytics.service";

export const GET = createApiHandler(
  async () => getLifecycleAnalytics(),
  { requireAdmin: true, rateLimitKey: "admin-lifecycle-analytics", limit: 60 }
);
