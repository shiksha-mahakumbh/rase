import { createApiHandler } from "@/server/lib/api-handler";
import { getDashboardStats } from "@/server/services/dashboard.service";

export const GET = createApiHandler(
  async () => getDashboardStats(),
  { requireAdmin: true }
);
