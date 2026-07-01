import { NextRequest } from "next/server";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { assertHoneypotEmpty } from "@/lib/security/honeypot";
import { newsletterSubscribeSchema } from "@/lib/schemas/newsletterSchema";
import { parseBody } from "@/lib/validation/parse-body";
import { createApiHandler } from "@/server/lib/api-handler";
import { assertSameOrigin } from "@/server/lib/same-origin";
import { getRequestContext } from "@/server/lib/request";
import { subscribeNewsletter } from "@/server/services/newsletter.service";
import { ServiceError } from "@/server/lib/errors";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    assertSameOrigin(request);
    const body = parseBody(newsletterSubscribeSchema, await request.json());
    assertHoneypotEmpty(body.website);

    const captcha = await verifyRecaptchaToken(body.captchaToken, "newsletter");
    if (!captcha.ok) throw new ServiceError(captcha.error ?? "Captcha failed", 400);

    const ctx = getRequestContext(request);
    const result = await subscribeNewsletter({
      email: body.email,
      fullName: body.fullName || undefined,
      subscribedIp: ctx.ip,
      marketingConsent: body.marketingConsent,
    });

    return {
      success: true,
      id: result.row.id,
      pendingConfirmation: result.pendingConfirmation,
    };
  },
  { rateLimitKey: "v2-newsletter", limit: 5 }
);
