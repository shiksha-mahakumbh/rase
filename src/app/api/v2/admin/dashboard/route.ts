import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { getDashboardStats } from "@/server/services/dashboard.service";
import { withDeprecationHeaders } from "@/server/lib/admin-deprecation";

const handler = createApiHandler(async () => getDashboardStats(), { requireAdmin: true });

export const GET = withDeprecationHeaders(handler, {
  successor: "/api/v2/admin/analytics/dashboard",
});
