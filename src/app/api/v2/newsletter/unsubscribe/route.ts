import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { unsubscribeNewsletter } from "@/server/services/newsletter.service";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{ email?: string }>(await request.json());
    await unsubscribeNewsletter(body.email ?? "");
    return { success: true };
  },
  { rateLimitKey: "v2-newsletter-unsub", limit: 10 }
);
