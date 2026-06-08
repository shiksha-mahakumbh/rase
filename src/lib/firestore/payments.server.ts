import { initializeApp, getApps, getApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  initializeFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
  addDoc,
  type Firestore,
} from "firebase/firestore";
import { firebaseConfig } from "@/app/firebase";
import { TYPE_COLLECTION_MAP, type PaymentStatus } from "@/types/registration";

const SERVER_APP_NAME = "payments-server";
const MASTER_COLLECTION = "registrations";

let db: Firestore | null = null;

function getPaymentsDb(): Firestore {
  if (db) return db;
  const app = getApps().some((a) => a.name === SERVER_APP_NAME)
    ? getApp(SERVER_APP_NAME)
    : initializeApp(firebaseConfig, SERVER_APP_NAME);
  try {
    db = initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch {
    db = getFirestore(app);
  }
  return db;
}

export type RazorpayWebhookResult = {
  ok: boolean;
  registrationId?: string;
  masterDocId?: string;
  paymentStatus?: PaymentStatus;
  event?: string;
  error?: string;
};

type RazorpayPaymentEntity = {
  id?: string;
  order_id?: string;
  status?: string;
  notes?: Record<string, string>;
};

function mapRazorpayStatus(status?: string): PaymentStatus {
  if (status === "captured" || status === "paid") return "Paid";
  if (status === "failed") return "Failed";
  return "Pending Payment";
}

async function findRegistrationByOrderId(orderId: string) {
  const database = getPaymentsDb();
  const recordsRef = collection(database, "paymentRecords");
  const snap = await getDocs(
    query(recordsRef, where("payment.razorpayOrderId", "==", orderId))
  );
  if (!snap.empty) {
    const data = snap.docs[0].data();
    return {
      masterDocId: data.masterDocId as string | undefined,
      registrationId: data.registrationId as string | undefined,
      registrationType: data.registrationType as string | undefined,
    };
  }

  const masterSnap = await getDocs(
    query(
      collection(database, MASTER_COLLECTION),
      where("payment.razorpayOrderId", "==", orderId)
    )
  );
  if (!masterSnap.empty) {
    const data = masterSnap.docs[0].data();
    return {
      masterDocId: masterSnap.docs[0].id,
      registrationId: data.registrationId as string | undefined,
      registrationType: data.registrationType as string | undefined,
    };
  }

  return null;
}

async function findRegistrationByNotes(notes?: Record<string, string>) {
  if (!notes) return null;
  const database = getPaymentsDb();

  if (notes.masterDocId) {
    return {
      masterDocId: notes.masterDocId,
      registrationId: notes.registrationId,
      registrationType: notes.registrationType,
    };
  }

  if (notes.registrationId) {
    const snap = await getDocs(
      query(
        collection(database, MASTER_COLLECTION),
        where("registrationId", "==", notes.registrationId)
      )
    );
    if (!snap.empty) {
      const data = snap.docs[0].data();
      return {
        masterDocId: snap.docs[0].id,
        registrationId: data.registrationId as string,
        registrationType: data.registrationType as string | undefined,
      };
    }
  }

  return null;
}

export async function processRazorpayWebhookEvent(body: {
  event?: string;
  payload?: {
    payment?: { entity?: RazorpayPaymentEntity };
    order?: { entity?: { id?: string; status?: string; notes?: Record<string, string> } };
  };
}): Promise<RazorpayWebhookResult> {
  const eventName = body.event ?? "unknown";
  const paymentEntity = body.payload?.payment?.entity;
  const orderEntity = body.payload?.order?.entity;

  const orderId = paymentEntity?.order_id ?? orderEntity?.id;
  const notes = paymentEntity?.notes ?? orderEntity?.notes;
  const razorpayStatus = paymentEntity?.status ?? orderEntity?.status;
  const paymentStatus = mapRazorpayStatus(razorpayStatus);

  let match =
    (orderId ? await findRegistrationByOrderId(orderId) : null) ??
    (await findRegistrationByNotes(notes));

  if (!match?.masterDocId) {
    return { ok: false, event: eventName, error: "Registration not found for payment" };
  }

  const database = getPaymentsDb();
  const masterRef = doc(database, MASTER_COLLECTION, match.masterDocId);
  const now = serverTimestamp();

  const updatePayload = {
    paymentStatus,
    updatedAt: now,
    razorpayPaymentId: paymentEntity?.id ?? null,
    razorpayOrderId: orderId ?? null,
    razorpayEvent: eventName,
    razorpayStatus: razorpayStatus ?? null,
  };

  await updateDoc(masterRef, updatePayload);

  if (match.registrationType && match.registrationId) {
    const typeCollection =
      TYPE_COLLECTION_MAP[match.registrationType as keyof typeof TYPE_COLLECTION_MAP];
    if (typeCollection) {
      const typeSnap = await getDocs(
        query(
          collection(database, typeCollection),
          where("registrationId", "==", match.registrationId)
        )
      );
      if (!typeSnap.empty) {
        await updateDoc(typeSnap.docs[0].ref, updatePayload);
      }
    }
  }

  try {
    await addDoc(collection(database, "audit_logs"), {
      action: "razorpay_webhook",
      event: eventName,
      registrationId: match.registrationId,
      masterDocId: match.masterDocId,
      paymentStatus,
      razorpayPaymentId: paymentEntity?.id ?? null,
      razorpayOrderId: orderId ?? null,
      createdAt: now,
    });
  } catch {
    // Non-blocking audit trail
  }

  return {
    ok: true,
    event: eventName,
    registrationId: match.registrationId,
    masterDocId: match.masterDocId,
    paymentStatus,
  };
}
