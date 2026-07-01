import { NextRequest } from "next/server";
import type { AuditAction } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listAuditLogs } from "@/server/services/audit.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") as AuditAction | null;
    return listAuditLogs({
      limit: Number(searchParams.get("limit") ?? 50),
      offset: Number(searchParams.get("offset") ?? 0),
      action: action ?? undefined,
      registrationId: searchParams.get("registrationId") ?? undefined,
    });
  },
  { requireAdmin: true, adminResource: "audit_logs" }
);
