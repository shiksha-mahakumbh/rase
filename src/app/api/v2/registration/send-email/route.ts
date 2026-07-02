import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { ServiceError } from "@/server/lib/errors";
import {
  REG_ID_RE,
  emailsMatch,
  verifyRegistrationLookupToken,
} from "@/lib/security/registration-lookup";
import { prisma } from "@/server/db/prisma";
import { resendRegistrationConfirmationEmail } from "@/server/services/registration-post-submit.service";
import { displayRegistrationType } from "@/server/lib/registration-type-labels";

/** Resend confirmation email — requires lookup token from the success page. */
export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      registrationId?: string;
      token?: string;
      lookupToken?: string;
    }>(await request.json());

    const registrationId = String(body.registrationId ?? "").trim();
    const token = String(body.lookupToken ?? body.token ?? "").trim();

    if (!REG_ID_RE.test(registrationId)) {
      throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
    }
    if (!token) {
      throw new ServiceError("Confirmation token required", 401, "AUTH_REQUIRED");
    }

    const verified = verifyRegistrationLookupToken(registrationId, token);
    if (!verified?.email) {
      throw new ServiceError("Invalid or expired token", 401, "AUTH_REQUIRED");
    }

    const reg = await prisma.registration.findFirst({
      where: { registrationId, deletedAt: null },
      include: {
        paymentRecords: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!reg) {
      throw new ServiceError("Registration not found", 404, "NOT_FOUND");
    }
    if (!emailsMatch(reg.email, verified.email)) {
      throw new ServiceError("Unauthorized", 401, "AUTH_REQUIRED");
    }

    const metadata = (reg.metadata ?? {}) as Record<string, unknown>;
    const payment = reg.paymentRecords[0];
    const fee = Number(reg.registrationFee ?? payment?.amount ?? 0);

    try {
      await resendRegistrationConfirmationEmail({
        result: {
          registrationId: reg.registrationId,
          id: reg.id,
          typeDocId: reg.id,
        },
        registrationType: displayRegistrationType(reg.registrationType),
        data: metadata,
        email: reg.email,
        fullName: reg.fullName,
        contact: reg.contactNumber,
        fee,
        razorpayPaymentId: String(reg.razorpayPaymentId ?? payment?.razorpayPaymentId ?? ""),
      });
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(
        error instanceof Error ? error.message : "Could not send confirmation email",
        503,
        "EMAIL_SEND_FAILED"
      );
    }

    return {
      success: true,
      message: `Confirmation email sent to ${reg.email}. Check inbox, spam, and promotions folders.`,
    };
  },
  { rateLimitKey: "v2-registration-email", limit: 5 }
);
