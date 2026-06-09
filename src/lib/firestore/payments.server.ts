import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { TYPE_COLLECTION_MAP, type PaymentStatus } from "@/types/registration";

const MASTER_COLLECTION = "registrations";

export type RazorpayWebhookResult = {
  ok: boolean;
  registrationId?: string;
  masterDocId?: string;
  paymentStatus?: PaymentStatus;
  event?: string;
  error?: string;
  duplicate?: boolean;
};

type RazorpayPaymentEntity = {
  id?: string;
  order_id?: string;
  status?: string;
  amount?: number;
  notes?: Record<string, string>;
};

function mapRazorpayStatus(status?: string): PaymentStatus {
  if (status === "captured" || status === "paid") return "Paid";
  if (status === "failed") return "Failed";
  return "Pending Payment";
}

async function findRegistrationByOrderId(orderId: string) {
  const db = getAdminFirestore();
  const recordsSnap = await db
    .collection("paymentRecords")
    .where("payment.razorpayOrderId", "==", orderId)
    .limit(1)
    .get();

  if (!recordsSnap.empty) {
    const data = recordsSnap.docs[0]!.data();
    return {
      paymentRecordId: recordsSnap.docs[0]!.id,
      masterDocId: data.masterDocId as string | undefined,
      registrationId: data.registrationId as string | undefined,
      registrationType: data.registrationType as string | undefined,
      existingPaymentId: (data.payment as Record<string, unknown> | undefined)
        ?.razorpayPaymentId as string | undefined,
      existingStatus: data.paymentStatus as PaymentStatus | undefined,
    };
  }

  const masterSnap = await db
    .collection(MASTER_COLLECTION)
    .where("payment.razorpayOrderId", "==", orderId)
    .limit(1)
    .get();

  if (!masterSnap.empty) {
    const data = masterSnap.docs[0]!.data();
    return {
      paymentRecordId: undefined,
      masterDocId: masterSnap.docs[0]!.id,
      registrationId: data.registrationId as string | undefined,
      registrationType: data.registrationType as string | undefined,
      existingPaymentId: (data.payment as Record<string, unknown> | undefined)
        ?.razorpayPaymentId as string | undefined,
      existingStatus: data.paymentStatus as PaymentStatus | undefined,
    };
  }

  return null;
}

async function findRegistrationByNotes(notes?: Record<string, string>) {
  if (!notes) return null;
  const db = getAdminFirestore();

  if (notes.masterDocId) {
    return {
      paymentRecordId: undefined,
      masterDocId: notes.masterDocId,
      registrationId: notes.registrationId,
      registrationType: notes.registrationType,
      existingPaymentId: undefined,
      existingStatus: undefined,
    };
  }

  if (notes.registrationId) {
    const snap = await db
      .collection(MASTER_COLLECTION)
      .where("registrationId", "==", notes.registrationId)
      .limit(1)
      .get();

    if (!snap.empty) {
      const data = snap.docs[0]!.data();
      return {
        paymentRecordId: undefined,
        masterDocId: snap.docs[0]!.id,
        registrationId: data.registrationId as string,
        registrationType: data.registrationType as string | undefined,
        existingPaymentId: undefined,
        existingStatus: data.paymentStatus as PaymentStatus | undefined,
      };
    }
  }

  return null;
}

export async function processRazorpayWebhookEvent(body: {
  event?: string;
  payload?: {
    payment?: { entity?: RazorpayPaymentEntity };
    order?: {
      entity?: {
        id?: string;
        status?: string;
        amount?: number;
        notes?: Record<string, string>;
      };
    };
  };
}): Promise<RazorpayWebhookResult> {
  const eventName = body.event ?? "unknown";
  const paymentEntity = body.payload?.payment?.entity;
  const orderEntity = body.payload?.order?.entity;

  const orderId = paymentEntity?.order_id ?? orderEntity?.id;
  const notes = paymentEntity?.notes ?? orderEntity?.notes;
  const razorpayStatus = paymentEntity?.status ?? orderEntity?.status;
  const paymentStatus = mapRazorpayStatus(razorpayStatus);
  const razorpayPaymentId = paymentEntity?.id ?? null;
  const amount =
    paymentEntity?.amount ?? orderEntity?.amount ?? null;

  let match =
    (orderId ? await findRegistrationByOrderId(orderId) : null) ??
    (await findRegistrationByNotes(notes));

  if (!match?.masterDocId) {
    return {
      ok: false,
      event: eventName,
      error: "Registration not found for payment",
    };
  }

  if (
    match.existingStatus === "Paid" &&
    razorpayPaymentId &&
    match.existingPaymentId === razorpayPaymentId
  ) {
    return {
      ok: true,
      duplicate: true,
      event: eventName,
      registrationId: match.registrationId,
      masterDocId: match.masterDocId,
      paymentStatus: match.existingStatus,
    };
  }

  const db = getAdminFirestore();
  const now = FieldValue.serverTimestamp();

  const updatePayload = {
    paymentStatus,
    updatedAt: now,
    razorpayPaymentId,
    razorpayOrderId: orderId ?? null,
    razorpayEvent: eventName,
    razorpayStatus: razorpayStatus ?? null,
    "payment.razorpayPaymentId": razorpayPaymentId,
    "payment.razorpayOrderId": orderId ?? null,
    "payment.status": paymentStatus,
    "payment.amount": amount,
  };

  await db
    .collection(MASTER_COLLECTION)
    .doc(match.masterDocId)
    .update(updatePayload);

  if (match.registrationType && match.registrationId) {
    const typeCollection =
      TYPE_COLLECTION_MAP[
        match.registrationType as keyof typeof TYPE_COLLECTION_MAP
      ];
    if (typeCollection) {
      const typeSnap = await db
        .collection(typeCollection)
        .where("registrationId", "==", match.registrationId)
        .limit(1)
        .get();

      if (!typeSnap.empty) {
        await typeSnap.docs[0]!.ref.update(updatePayload);
      }
    }
  }

  if (match.paymentRecordId) {
    await db
      .collection("paymentRecords")
      .doc(match.paymentRecordId)
      .update({
        paymentStatus,
        updatedAt: now,
        "payment.razorpayPaymentId": razorpayPaymentId,
        "payment.razorpayOrderId": orderId ?? null,
        "payment.status": paymentStatus,
        "payment.amount": amount,
      });
  } else if (orderId && match.registrationId) {
    const existing = await db
      .collection("paymentRecords")
      .where("payment.razorpayOrderId", "==", orderId)
      .limit(1)
      .get();

    if (!existing.empty) {
      await existing.docs[0]!.ref.update({
        paymentStatus,
        updatedAt: now,
        "payment.razorpayPaymentId": razorpayPaymentId,
        "payment.razorpayOrderId": orderId,
        "payment.status": paymentStatus,
        "payment.amount": amount,
      });
    }
  }

  try {
    await db.collection("audit_logs").add({
      action: "razorpay_webhook",
      event: eventName,
      registrationId: match.registrationId,
      masterDocId: match.masterDocId,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId: orderId ?? null,
      duplicate: false,
      createdAt: now,
    });
  } catch (error) {
    console.error("razorpay webhook audit log failed:", error);
  }

  return {
    ok: true,
    event: eventName,
    registrationId: match.registrationId,
    masterDocId: match.masterDocId,
    paymentStatus,
  };
}
