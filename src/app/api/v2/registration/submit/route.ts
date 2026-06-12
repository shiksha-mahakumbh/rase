import { NextRequest } from "next/server";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { getRegistrationService } from "@/server/backend";
import { isSupportedType } from "@/server/lib/registration-types";
import { ServiceError } from "@/server/lib/errors";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      captchaToken?: string;
      registrationType?: string;
      data?: Record<string, unknown>;
      paymentStatus?: string;
    }>(await request.json());

    if (!body.registrationType || !isSupportedType(body.registrationType)) {
      throw new ServiceError("Invalid registration type", 400, "INVALID_TYPE");
    }
    if (!body.data) throw new ServiceError("Invalid registration data", 400);

    const captcha = await verifyRecaptchaToken(body.captchaToken, "registration");
    if (!captcha.ok) throw new ServiceError("Security verification failed", 403, "CAPTCHA_FAILED");

    const ctx = getRequestContext(request);
    const service = getRegistrationService();
    const result = await service.saveRegistration({
      registrationType: body.registrationType,
      data: body.data,
      paymentStatus: body.paymentStatus,
      submittedIp: ctx.ip,
      userAgent: ctx.userAgent,
    });

    const email =
      typeof body.data.email === "string" ? body.data.email : "";
    const { createRegistrationLookupToken } = await import(
      "@/lib/security/registration-lookup"
    );
    const lookupToken =
      email && result.registrationId
        ? createRegistrationLookupToken(result.registrationId, email)
        : undefined;

    return {
      success: true,
      registrationId: result.registrationId,
      id: result.id,
      typeDocId: result.typeDocId,
      lookupToken,
    };
  },
  { rateLimitKey: "v2-registration-submit", limit: 15 }
);
