import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";
import {
  REGISTRATION_ID_PREFIX,
  TYPE_COLLECTION_MAP,
  type RegistrationType,
  type PaymentStatus,
  type RegistrationStatus,
  type AccommodationStatus,
} from "@/types/registration";
import {
  isPaidRegistrationType,
  resolvePaymentStatus,
} from "@/lib/registration/config";

const MASTER_COLLECTION = "registrations";
const COUNTER_COLLECTION = "registrationCounters";
const COUNTER_DOC = "smk2026";

export interface SaveRegistrationInput {
  registrationType: RegistrationType;
  data: Record<string, unknown>;
  paymentStatus?: PaymentStatus;
  registrationStatus?: RegistrationStatus;
  accommodationStatus?: AccommodationStatus;
}

export interface SaveRegistrationResult {
  registrationId: string;
  masterDocId: string;
  typeDocId: string;
}

async function generateRegistrationId(db: Firestore): Promise<string> {
  const counterRef = db.collection(COUNTER_COLLECTION).doc(COUNTER_DOC);

  const nextNumber = await db.runTransaction(async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    const counterData = counterSnap.data();
    const current = counterSnap.exists
      ? Number(counterData?.lastNumber ?? counterData?.currentNumber ?? 0)
      : 0;
    const updated = current + 1;

    transaction.set(
      counterRef,
      {
        lastNumber: updated,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return updated;
  });

  return `${REGISTRATION_ID_PREFIX}-${String(nextNumber).padStart(6, "0")}`;
}

export async function saveRegistration(
  input: SaveRegistrationInput
): Promise<SaveRegistrationResult> {
  const db = getAdminFirestore();
  const registrationId = await generateRegistrationId(db);
  const now = FieldValue.serverTimestamp();

  const payload = {
    ...input.data,
    registrationId,
    registrationType: input.registrationType,
    paymentStatus:
      input.paymentStatus ??
      resolvePaymentStatus(input.registrationType, {
        registrationFee: input.data.registrationFee as number | undefined,
        hasPaymentProof: Boolean(
          input.data.utrNumber ||
            input.data.transactionId ||
            input.data.razorpayPaymentId
        ),
      }),
    registrationStatus:
      input.registrationStatus ??
      (isPaidRegistrationType(input.registrationType)
        ? "Pending"
        : "Submitted"),
    accommodationStatus:
      input.accommodationStatus ??
      (input.data.accommodationRequired === "Yes"
        ? "Requested"
        : "Not Required"),
    createdAt: now,
    updatedAt: now,
  };

  const typeCollection = TYPE_COLLECTION_MAP[input.registrationType];
  const masterRef = db.collection(MASTER_COLLECTION).doc();
  const typeRef = db.collection(typeCollection).doc();

  await db.runTransaction(async (transaction) => {
    transaction.set(masterRef, payload);
    transaction.set(typeRef, payload);
  });

  if (input.data.accommodationRequired === "Yes") {
    await db.collection("accommodationRequests").add({
      ...payload,
      masterDocId: masterRef.id,
      registrationDocId: typeRef.id,
    });
  }

  if (input.data.payment && typeof input.data.payment === "object") {
    const payment = input.data.payment as Record<string, unknown>;
    await db.collection("paymentRecords").add({
      registrationId,
      registrationType: input.registrationType,
      masterDocId: masterRef.id,
      payment: {
        ...payment,
        status: payload.paymentStatus,
        amount: payment.registrationFee ?? input.data.registrationFee ?? null,
      },
      paymentStatus: payload.paymentStatus,
      createdAt: now,
      updatedAt: now,
    });
  }

  try {
    await db.collection("audit_logs").add({
      action: "registration_created",
      registrationId,
      registrationType: input.registrationType,
      masterDocId: masterRef.id,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("audit_logs write failed:", error);
  }

  return {
    registrationId,
    masterDocId: masterRef.id,
    typeDocId: typeRef.id,
  };
}
