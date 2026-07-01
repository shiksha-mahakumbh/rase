import { NextRequest } from "next/server";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { assertHoneypotEmpty } from "@/lib/security/honeypot";
import { feedbackSubmitSchema } from "@/lib/schemas/feedbackSchema";
import { parseBody } from "@/lib/validation/parse-body";
import { createApiHandler } from "@/server/lib/api-handler";
import { assertSameOrigin } from "@/server/lib/same-origin";
import { getRequestContext } from "@/server/lib/request";
import { submitFeedback } from "@/server/services/feedback.service";
import { ServiceError } from "@/server/lib/errors";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    assertSameOrigin(request);
    const body = parseBody(feedbackSubmitSchema, await request.json());
    assertHoneypotEmpty(body.website);

    const captcha = await verifyRecaptchaToken(body.captchaToken, "feedback");
    if (!captcha.ok) throw new ServiceError(captcha.error ?? "Captcha failed", 400);

    const ctx = getRequestContext(request);
    const row = await submitFeedback({
      fullName: body.fullName,
      email: body.email,
      rating: body.rating,
      category: body.category,
      message: body.message,
      submittedIp: ctx.ip,
    });

    return { success: true, id: row.id };
  },
  { rateLimitKey: "v2-feedback", limit: 5 }
);
