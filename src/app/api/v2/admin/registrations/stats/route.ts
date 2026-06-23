import { createApiHandler } from "@/server/lib/api-handler";
import { getRegistrationAdminStats } from "@/server/services/dashboard.service";

export const GET = createApiHandler(
  async () => getRegistrationAdminStats(),
  { requireAdmin: true, rateLimitKey: "v2-admin-registrations-stats", limit: 60 }
);
