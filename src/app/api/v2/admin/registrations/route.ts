import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { listRegistrations } from "@/server/services/registration.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listRegistrations({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      type: searchParams.get("type") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });
  },
  { requireAdmin: true, rateLimitKey: "v2-admin-registrations", limit: 60 }
);
