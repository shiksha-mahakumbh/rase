import { NextRequest } from "next/server";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { submitContactMessage } from "@/server/services/contact.service";
import { ServiceError } from "@/server/lib/errors";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      captchaToken?: string;
      fullName?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
    }>(await request.json());

    const captcha = await verifyRecaptchaToken(body.captchaToken, "contact");
    if (!captcha.ok) throw new ServiceError("Security verification failed", 403);

    const ctx = getRequestContext(request);
    const row = await submitContactMessage({
      fullName: body.fullName ?? "",
      email: body.email ?? "",
      phone: body.phone,
      subject: body.subject,
      message: body.message ?? "",
      submittedIp: ctx.ip,
    });

    return { success: true, id: row.id };
  },
  { rateLimitKey: "v2-contact", limit: 5 }
);
