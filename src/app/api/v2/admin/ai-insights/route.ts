import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
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
  { requireAdmin: true, adminResource: "audit_logs", rateLimitKey: "admin-ai-insights",
    limit: 30,
  }
);

export const POST = createApiHandler(
  async () => generateAiInsights(true),
  { requireAdmin: true, adminResource: "audit_logs", mutationPermission: "media.manage", rateLimitKey: "admin-ai-insights-gen", limit: 10 }
);
