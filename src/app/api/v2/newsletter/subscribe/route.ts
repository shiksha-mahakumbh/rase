import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { subscribeNewsletter } from "@/server/services/newsletter.service";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{ email?: string; fullName?: string; marketingConsent?: boolean }>(
      await request.json()
    );
    const ctx = getRequestContext(request);
    const row = await subscribeNewsletter({
      email: body.email ?? "",
      fullName: body.fullName,
      subscribedIp: ctx.ip,
      marketingConsent: body.marketingConsent === true,
    });
    return { success: true, id: row.id };
  },
  { rateLimitKey: "v2-newsletter", limit: 5 }
);
