import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { listWebhookLogs } from "@/server/services/admin/reconciliation.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get("status") ?? "all") as "success" | "failed" | "all";
    return listWebhookLogs({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      status,
    });
  },
  { requireAdmin: true, adminResource: "payments", rateLimitKey: "admin-webhooks",
    limit: 60,
  }
);
