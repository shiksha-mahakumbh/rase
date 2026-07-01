import { NextRequest } from "next/server";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { assertHoneypotEmpty } from "@/lib/security/honeypot";
import { contactSubmitSchema } from "@/lib/schemas/contactSchema";
import { parseBody } from "@/lib/validation/parse-body";
import { createApiHandler } from "@/server/lib/api-handler";
import { assertSameOrigin } from "@/server/lib/same-origin";
import { getRequestContext } from "@/server/lib/request";
import { submitContactMessage } from "@/server/services/contact.service";
import { ServiceError } from "@/server/lib/errors";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    assertSameOrigin(request);
    const body = parseBody(contactSubmitSchema, await request.json());
    assertHoneypotEmpty(body.website);

    const captcha = await verifyRecaptchaToken(body.captchaToken, "contact");
    if (!captcha.ok) throw new ServiceError("Security verification failed", 403);

    const ctx = getRequestContext(request);
    const row = await submitContactMessage({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone || undefined,
      subject: body.subject || undefined,
      message: body.message,
      submittedIp: ctx.ip,
    });

    return { success: true, id: row.id };
  },
  { rateLimitKey: "v2-contact", limit: 5 }
);
