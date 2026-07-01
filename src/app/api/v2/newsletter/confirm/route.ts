import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { confirmNewsletterSubscription } from "@/server/services/newsletter.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const token = new URL(request.url).searchParams.get("token")?.trim();
    if (!token) {
      return { success: false, error: "Missing token" };
    }
    const row = await confirmNewsletterSubscription(token);
    return { success: true, email: row.email };
  },
  { rateLimitKey: "v2-newsletter-confirm", limit: 20 }
);
