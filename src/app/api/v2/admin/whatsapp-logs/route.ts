import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { listWhatsAppLogs } from "@/server/services/ops/whatsapp.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listWhatsAppLogs({
      limit: Number(searchParams.get("limit") ?? 30),
      offset: Number(searchParams.get("offset") ?? 0),
      status: searchParams.get("status") ?? undefined,
    });
  },
  { requireAdmin: true, adminResource: "audit_logs", rateLimitKey: "admin-whatsapp", limit: 60 }
);
