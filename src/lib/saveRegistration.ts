import {
  doc,
  runTransaction,
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  REGISTRATION_ID_PREFIX,
  TYPE_COLLECTION_MAP,
  RegistrationType,
  PaymentStatus,
  RegistrationStatus,
  AccommodationStatus,
} from "@/types/registration";

const MASTER_COLLECTION = "registrations";
const COUNTER_COLLECTION = "registrationCounters";
const COUNTER_DOC = "smk2026";

export async function generateRegistrationId(): Promise<string> {
  const counterRef = doc(db, COUNTER_COLLECTION, COUNTER_DOC);

  const nextNumber = await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    const current = counterSnap.exists()
      ? (counterSnap.data().lastNumber as number)
      : 0;
    const updated = current + 1;
    transaction.set(
      counterRef,
      { lastNumber: updated, updatedAt: serverTimestamp() },
      { merge: true }
    );
    return updated;
  });

  return `${REGISTRATION_ID_PREFIX}-${String(nextNumber).padStart(6, "0")}`;
}

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

export async function saveRegistration(
  input: SaveRegistrationInput
): Promise<SaveRegistrationResult> {
  const registrationId = await generateRegistrationId();
  const now = serverTimestamp();

  const payload = {
    ...input.data,
    registrationId,
    registrationType: input.registrationType,
    paymentStatus: input.paymentStatus ?? "Pending",
    registrationStatus: input.registrationStatus ?? "Pending",
    accommodationStatus:
      input.accommodationStatus ??
      (input.data.accommodationRequired === "Yes"
        ? "Requested"
        : "Not Required"),
    createdAt: now,
    updatedAt: now,
  };

  const typeCollection = TYPE_COLLECTION_MAP[input.registrationType];

  const [masterRef, typeRef] = await Promise.all([
    addDoc(collection(db, MASTER_COLLECTION), payload),
    addDoc(collection(db, typeCollection), payload),
  ]);

  if (input.data.accommodationRequired === "Yes") {
    await addDoc(collection(db, "accommodationRequests"), {
      ...payload,
      masterDocId: masterRef.id,
      registrationDocId: typeRef.id,
    });
  }

  if (input.data.payment && typeof input.data.payment === "object") {
    await addDoc(collection(db, "paymentRecords"), {
      registrationId,
      registrationType: input.registrationType,
      masterDocId: masterRef.id,
      payment: input.data.payment,
      paymentStatus: payload.paymentStatus,
      createdAt: now,
      updatedAt: now,
    });
  }

  try {
    await addDoc(collection(db, "audit_logs"), {
      action: "registration_created",
      registrationId,
      registrationType: input.registrationType,
      masterDocId: masterRef.id,
      createdAt: serverTimestamp(),
    });
  } catch {
    // Non-blocking audit trail
  }

  return {
    registrationId,
    masterDocId: masterRef.id,
    typeDocId: typeRef.id,
  };
}

export function formatFirestoreDate(value: unknown): string {
  if (!value) return "—";
  if (value instanceof Timestamp) {
    return value.toDate().toLocaleString("en-IN");
  }
  if (value instanceof Date) {
    return value.toLocaleString("en-IN");
  }
  return String(value);
}
