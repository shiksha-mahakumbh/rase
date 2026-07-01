import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { listEmailLogs } from "@/server/services/admin/monitoring.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listEmailLogs({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      status: searchParams.get("status") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      registrationId: searchParams.get("registrationId") ?? undefined,
    });
  },
  { requireAdmin: true, adminResource: "audit_logs", rateLimitKey: "admin-email-logs",
    limit: 120,
  }
);
