import { NextRequest } from "next/server";
import type { AccommodationStatus } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { withDeprecationHeaders } from "@/server/lib/admin-deprecation";
import { listAccommodationRequests } from "@/server/services/accommodation.service";

const handler = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as AccommodationStatus | null;
    return listAccommodationRequests({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      status: status ?? undefined,
    });
  },
  { requireAdmin: true, adminResource: "registrations" }
);

export const GET = withDeprecationHeaders(handler, {
  successor: "/api/v2/admin/accommodation-lifecycle",
  note: "Legacy accommodation API — use /api/v2/admin/accommodation-lifecycle instead",
});
