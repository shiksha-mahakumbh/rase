import { normalizePhoneInput, validatePanForAmount } from "@/lib/registration/validation";
import { parseProjectStudentType } from "@/lib/registration/project-student-type";
import { resolveRegistrationFee } from "@/lib/registration/fees";
import { validateDelegateRegistrationPayload } from "@/lib/registration/delegate-categories";
import type { PaymentStatus, RegistrationType } from "@/types/registration";
import { assertVerifiedPaymentForSubmit } from "@/server/services/razorpay-verified.service";
import { createRegistrationLookupToken } from "@/lib/security/registration-lookup";
import { ServiceError } from "@/server/lib/errors";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type RegistrationSubmitGuardResult = {
  type: RegistrationType;
  data: Record<string, unknown>;
  email: string;
  fullName: string;
  contact: string;
  fee: number;
  razorpayPaymentId: string;
  paymentStatus?: PaymentStatus;
  duplicate?: {
    registrationId: string;
    registrationUuid?: string;
    lookupToken: string;
  };
};

/**
 * Validates registration submit payload with the same rules as
 * `/api/v2/registration/submit` (fee, PAN, payment proof, Razorpay verify).
 */
export async function guardRegistrationSubmit(input: {
  registrationType: string;
  data: Record<string, unknown>;
  paymentStatus?: PaymentStatus;
}): Promise<RegistrationSubmitGuardResult> {
  const { registrationType: type, data, paymentStatus } = input;

  const fullName = String(data.fullName ?? "").trim();
  const email = String(data.email ?? "").trim();

  if (fullName.length < 2) {
    throw new ServiceError("Full name is required", 400, "INVALID_NAME");
  }

  if (!EMAIL_RE.test(email)) {
    throw new ServiceError("Valid email is required", 400, "INVALID_EMAIL");
  }

  const contact = normalizePhoneInput(String(data.contactNumber ?? ""));
  if (contact.length !== 10) {
    throw new ServiceError(
      "Valid 10-digit contact number is required",
      400,
      "INVALID_PHONE"
    );
  }
  data.contactNumber = contact;

  const payment = data.payment as Record<string, unknown> | undefined;
  const rawFee = Number(data.registrationFee ?? payment?.registrationFee ?? 0);
  const fee = type === "Olympiad" ? 0 : rawFee;
  if (type === "Olympiad") {
    data.registrationFee = 0;
  }

  const expectedFee = resolveRegistrationFee(type as RegistrationType, {
    delegateCategory: String(data.delegateCategory ?? ""),
    projectStudentType: parseProjectStudentType(
      data.projectStudentType,
      String(data.category ?? "")
    ),
    accommodationBedType:
      data.accommodationBedType === "Double Bed" ? "Double Bed" : "Single Bed",
  });

  if (type === "Accommodation") {
    throw new ServiceError(
      "Accommodation registration opens in September. Please complete your programme registration and check back later.",
      400,
      "ACCOMMODATION_CLOSED"
    );
  }

  if (type !== "Olympiad" && fee !== expectedFee) {
    throw new ServiceError(
      "Registration fee does not match selected category",
      400,
      "FEE_MISMATCH"
    );
  }

  if (type === "Delegate Registration") {
    const delegateErr = validateDelegateRegistrationPayload(data);
    if (delegateErr) {
      throw new ServiceError(delegateErr, 400, "INVALID_DELEGATE_DATA");
    }
  }

  const panErr = validatePanForAmount(
    String(data.panNumber ?? payment?.panNumber ?? ""),
    fee
  );
  if (panErr) {
    throw new ServiceError(panErr, 400, "INVALID_PAN");
  }

  if (fee > 0) {
    const hasProof = Boolean(
      data.razorpayPaymentId ||
        payment?.razorpayPaymentId ||
        data.utrNumber ||
        payment?.utrNumber ||
        data.paymentReceipt
    );
    if (!hasProof) {
      throw new ServiceError(
        "Payment proof is required for paid registration",
        400,
        "PAYMENT_PROOF_REQUIRED"
      );
    }
  }

  const razorpayPaymentId = String(
    data.razorpayPaymentId ?? payment?.razorpayPaymentId ?? ""
  ).trim();

  if (fee > 0 && razorpayPaymentId) {
    const paymentCheck = await assertVerifiedPaymentForSubmit(
      razorpayPaymentId,
      fee
    );

    if (paymentCheck.alreadyRegistered && paymentCheck.registrationPublicId) {
      const lookupToken = createRegistrationLookupToken(
        paymentCheck.registrationPublicId,
        email
      );
      return {
        type: type as RegistrationType,
        data,
        email,
        fullName,
        contact,
        fee,
        razorpayPaymentId,
        paymentStatus,
        duplicate: {
          registrationId: paymentCheck.registrationPublicId,
          registrationUuid: paymentCheck.registrationUuid,
          lookupToken,
        },
      };
    }

    if (!paymentCheck.alreadyRegistered && paymentCheck.orderId) {
      data.razorpayOrderId = data.razorpayOrderId ?? paymentCheck.orderId;
      if (payment && !payment.razorpayOrderId) {
        payment.razorpayOrderId = paymentCheck.orderId;
      }
    }
  }

  return {
    type: type as RegistrationType,
    data,
    email,
    fullName,
    contact,
    fee,
    razorpayPaymentId,
    paymentStatus,
  };
}
