import { NextRequest } from "next/server";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { assertHoneypotEmpty } from "@/lib/security/honeypot";
import { newsletterUnsubscribeSchema } from "@/lib/schemas/newsletterSchema";
import { parseBody } from "@/lib/validation/parse-body";
import { createApiHandler } from "@/server/lib/api-handler";
import { assertSameOrigin } from "@/server/lib/same-origin";
import { unsubscribeNewsletter } from "@/server/services/newsletter.service";
import { ServiceError } from "@/server/lib/errors";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    assertSameOrigin(request);
    const body = parseBody(newsletterUnsubscribeSchema, await request.json());
    assertHoneypotEmpty(body.website);

    let verifiedViaCaptcha = false;
    if (!body.token) {
      const captcha = await verifyRecaptchaToken(body.captchaToken, "newsletter_unsubscribe");
      if (!captcha.ok) throw new ServiceError(captcha.error ?? "Captcha failed", 400);
      verifiedViaCaptcha = true;
    }

    await unsubscribeNewsletter({
      email: body.email,
      token: body.token,
      verifiedViaCaptcha,
    });
    return { success: true };
  },
  { rateLimitKey: "v2-newsletter-unsub", limit: 10 }
);
