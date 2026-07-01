import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { listAttendees } from "@/server/services/lifecycle/attendee.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listAttendees({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      state: searchParams.get("state") ?? undefined,
      institution: searchParams.get("institution") ?? undefined,
      checkInStatus: searchParams.get("checkInStatus") ?? undefined,
      paymentStatus: searchParams.get("paymentStatus") ?? undefined,
    });
  },
  { requireAdmin: true, adminResource: "registrations", rateLimitKey: "admin-attendees", limit: 120 }
);
