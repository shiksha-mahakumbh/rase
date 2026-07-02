import { NextRequest } from "next/server";
import { after } from "next/server";
import { verifyRegistrationSubmitProtection } from "@/lib/security/registration-captcha";
import { assertHoneypotEmpty } from "@/lib/security/honeypot";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getRequestContext } from "@/server/lib/request";
import { getRegistrationService } from "@/server/backend";
import { isSupportedType } from "@/server/lib/registration-types";
import { guardRegistrationSubmit } from "@/server/lib/registration-submit-guard";
import { writeAuditLog } from "@/server/services/audit.service";
import { runRegistrationPostSubmit } from "@/server/services/registration-post-submit.service";
import { ServiceError } from "@/server/lib/errors";

export { runtime, maxDuration } from "@/lib/server/pdf-api-route";

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      registrationProof?: string;
      captchaToken?: string;
      companyWebsite?: string;
      registrationType?: string;
      data?: Record<string, unknown>;
      paymentStatus?: string;
    }>(await request.json());

    assertHoneypotEmpty(body.companyWebsite);

    if (!body.registrationType || !isSupportedType(body.registrationType)) {
      throw new ServiceError("Invalid registration type", 400, "INVALID_TYPE");
    }
    if (!body.data) throw new ServiceError("Invalid registration data", 400);

    const paymentData =
      body.data.payment && typeof body.data.payment === "object"
        ? (body.data.payment as Record<string, unknown>)
        : null;
    const fee = Number(body.data.registrationFee ?? paymentData?.registrationFee ?? 0);
    const razorpayPaymentId = String(
      body.data.razorpayPaymentId ?? paymentData?.razorpayPaymentId ?? ""
    ).trim();

    const ctx = getRequestContext(request);

    const protection = await verifyRegistrationSubmitProtection({
      registrationProof: body.registrationProof,
      captchaToken: body.captchaToken,
      fee,
      razorpayPaymentId: razorpayPaymentId || null,
      clientIp: ctx.ip ?? undefined,
    });
    if (!protection.ok) {
      throw new ServiceError(
        protection.error ?? "Security verification failed",
        403,
        "REGISTRATION_SESSION_INVALID"
      );
    }

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

    const service = getRegistrationService();
    const result = await service.saveRegistration({
      registrationType: guarded.type,
      data: guarded.data,
      paymentStatus: guarded.paymentStatus,
      submittedIp: ctx.ip,
      userAgent: ctx.userAgent,
      razorpayPaymentId: guarded.razorpayPaymentId || undefined,
      expectedFeeRupees: guarded.fee > 0 ? guarded.fee : undefined,
    });

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

    const postSubmitInput = {
      result,
      registrationType: guarded.type,
      data: guarded.data,
      email: guarded.email,
      fullName: guarded.fullName,
      contact: guarded.contact,
      fee: guarded.fee,
      razorpayPaymentId: guarded.razorpayPaymentId,
    };

    after(async () => {
      try {
        await runRegistrationPostSubmit(postSubmitInput);
      } catch (err) {
        console.error("REGISTRATION_POST_SUBMIT_FAILED", {
          registrationId: result.registrationId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    });

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
