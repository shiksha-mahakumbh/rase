import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { listFeedback } from "@/server/services/feedback.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listFeedback({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      status: searchParams.get("status") ?? undefined,
    });
  },
  { requireAdmin: true, adminResource: "feedback" }
);
