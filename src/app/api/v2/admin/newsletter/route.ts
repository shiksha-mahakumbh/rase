import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { listNewsletterSubscriptions } from "@/server/services/newsletter.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listNewsletterSubscriptions({
      limit: Number(searchParams.get("limit") ?? 50),
      offset: Number(searchParams.get("offset") ?? 0),
    });
  },
  { requireAdmin: true }
);
