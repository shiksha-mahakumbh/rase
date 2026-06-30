import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { ADMIN_SENSITIVE_READ_ROLES } from "@/server/lib/admin-rbac";
import { generateAiInsights, listInsightHistory } from "@/server/services/ops/ai-insights.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    if (searchParams.get("history") === "1") {
      return listInsightHistory(Number(searchParams.get("limit") ?? 10));
    }
    const force = searchParams.get("refresh") === "1";
    return generateAiInsights(force);
  },
  {
    requireAdmin: true,
    adminRoles: ADMIN_SENSITIVE_READ_ROLES,
    rateLimitKey: "admin-ai-insights",
    limit: 30,
  }
);

export const POST = createApiHandler(
  async () => generateAiInsights(true),
  { requireAdmin: true, rateLimitKey: "admin-ai-insights-gen", limit: 10 }
);
