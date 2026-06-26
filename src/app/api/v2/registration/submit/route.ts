import { NextRequest } from "next/server";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { getRegistrationService } from "@/server/backend";
import { isSupportedType } from "@/server/lib/registration-types";
import { guardRegistrationSubmit } from "@/server/lib/registration-submit-guard";
import { markVerifiedPaymentConsumed } from "@/server/services/razorpay-verified.service";
import { writeAuditLog } from "@/server/services/audit.service";
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

    const guarded = await guardRegistrationSubmit({
      registrationType: body.registrationType,
      data: body.data,
      paymentStatus: body.paymentStatus as import("@/types/registration").PaymentStatus | undefined,
    });

    if (guarded.duplicate) {
      return {
        success: true,
        duplicate: true,
        registrationId: guarded.duplicate.registrationId,
        masterDocId: guarded.duplicate.registrationUuid,
        lookupToken: guarded.duplicate.lookupToken,
      };
    }

    const ctx = getRequestContext(request);
    const service = getRegistrationService();
    const result = await service.saveRegistration({
      registrationType: guarded.type,
      data: guarded.data,
      paymentStatus: guarded.paymentStatus,
      submittedIp: ctx.ip,
      userAgent: ctx.userAgent,
    });

    if (guarded.razorpayPaymentId) {
      await markVerifiedPaymentConsumed(
        guarded.razorpayPaymentId,
        result.id,
        result.registrationId
      );
    }

    await writeAuditLog({
      action: "registration_saved",
      registrationId: result.id,
      ipAddress: ctx.ip,
      userAgent: ctx.userAgent,
      payload: {
        registration_id: result.registrationId,
        registration_type: guarded.type,
        payment_id: guarded.razorpayPaymentId || null,
        order_id: guarded.data.razorpayOrderId ?? null,
        user_email: guarded.email,
        source: "v2",
      },
    });

    const { createRegistrationLookupToken } = await import(
      "@/lib/security/registration-lookup"
    );
    const lookupToken =
      guarded.email && result.registrationId
        ? createRegistrationLookupToken(result.registrationId, guarded.email)
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
