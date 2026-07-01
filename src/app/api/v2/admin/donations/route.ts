import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { listDonationRecords } from "@/server/services/donation-list.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listDonationRecords({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      search: searchParams.get("search") ?? undefined,
    });
  },
  { requireAdmin: true, adminResource: "payments", rateLimitKey: "admin-donations", limit: 120 }
);
