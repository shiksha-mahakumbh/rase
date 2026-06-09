import { initializeApp, getApps, getApp, setLogLevel } from "firebase/app";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase/firestore";
import { firebaseConfig } from "@/app/firebase";
import { FIRESTORE_DATABASE_ID } from "@/lib/firebase/client";

const SERVER_APP_NAME = "visitors-server";
const LEGACY_TOTAL_OFFSET = 94567;
/** After a connectivity failure, skip Firestore for this long (avoids log spam). */
const FIRESTORE_COOLDOWN_MS = 5 * 60 * 1000;

export type VisitorCounts = {
  daily: number;
  total: number;
  displayTotal: number;
};

const FALLBACK_COUNTS: VisitorCounts = {
  daily: 0,
  total: 0,
  displayTotal: LEGACY_TOTAL_OFFSET,
};

let db: Firestore | null = null;
let firestoreCooldownUntil = 0;
let fallbackLogged = false;

setLogLevel("error");

function firestoreExplicitlyDisabled(): boolean {
  return process.env.VISITOR_COUNTER_USE_FIRESTORE === "false";
}

function firestoreInCooldown(): boolean {
  return Date.now() < firestoreCooldownUntil;
}

function shouldUseFirestore(): boolean {
  return !firestoreExplicitlyDisabled() && !firestoreInCooldown();
}

function markFirestoreUnavailable(): void {
  firestoreCooldownUntil = Date.now() + FIRESTORE_COOLDOWN_MS;
  if (!fallbackLogged) {
    fallbackLogged = true;
    console.warn(
      "[visitors] Firestore unreachable — using fallback counts for 5 minutes. " +
        "If this is local dev, set VISITOR_COUNTER_USE_FIRESTORE=false in .env. " +
        "For live counts, enable Firestore (Native mode) in Firebase Console for project shiksha-mahakumbh-abhiyan."
    );
  }
}

function getVisitorsDb(): Firestore {
  if (db) return db;

  const app = getApps().some((a) => a.name === SERVER_APP_NAME)
    ? getApp(SERVER_APP_NAME)
    : initializeApp(firebaseConfig, SERVER_APP_NAME);

  try {
    db = initializeFirestore(
      app,
      { experimentalForceLongPolling: true },
      FIRESTORE_DATABASE_ID
    );
  } catch {
    db = getFirestore(app, FIRESTORE_DATABASE_ID);
  }
  return db;
}

function refs() {
  const database = getVisitorsDb();
  return {
    total: doc(database, "visitors", "total"),
    daily: doc(database, "visitors", "daily"),
    yesterday: doc(database, "visitors", "yesterday"),
  };
}

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function isFirestoreConnectivityError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = String((error as { code?: string }).code ?? "");
  return (
    code === "unavailable" ||
    code === "not-found" ||
    code === "permission-denied" ||
    code === "failed-precondition"
  );
}

async function ensureVisitorDocs(today: string) {
  const { total: TOTAL_REF, daily: DAILY_REF, yesterday: YESTERDAY_REF } = refs();
  const [totalSnap, dailySnap] = await Promise.all([
    getDoc(TOTAL_REF),
    getDoc(DAILY_REF),
  ]);

  if (!totalSnap.exists()) {
    await setDoc(TOTAL_REF, { count: 0 });
  }

  if (!dailySnap.exists()) {
    await setDoc(DAILY_REF, { count: 0, date: today });
    return;
  }

  const dailyData = dailySnap.data();
  if (dailyData.date !== today) {
    await setDoc(YESTERDAY_REF, {
      count: dailyData.count ?? 0,
      date: dailyData.date,
    });
    await setDoc(DAILY_REF, { count: 0, date: today });
  }
}

/** Increment total + daily visitor counts (same semantics as legacy Footer). */
export async function incrementVisitorCounts(): Promise<void> {
  if (!shouldUseFirestore()) return;

  try {
    const today = todayKey();
    const { total: TOTAL_REF, daily: DAILY_REF } = refs();
    await ensureVisitorDocs(today);
    await Promise.all([
      updateDoc(TOTAL_REF, { count: increment(1) }),
      updateDoc(DAILY_REF, { count: increment(1) }),
    ]);
  } catch (error) {
    if (isFirestoreConnectivityError(error)) {
      markFirestoreUnavailable();
      return;
    }
    throw error;
  }
}

export async function getVisitorCounts(): Promise<VisitorCounts> {
  if (!shouldUseFirestore()) return FALLBACK_COUNTS;

  try {
    const today = todayKey();
    const { total: TOTAL_REF, daily: DAILY_REF } = refs();
    await ensureVisitorDocs(today);

    const [totalSnap, dailySnap] = await Promise.all([
      getDoc(TOTAL_REF),
      getDoc(DAILY_REF),
    ]);

    const total = totalSnap.exists() ? Number(totalSnap.data().count ?? 0) : 0;
    const daily = dailySnap.exists() ? Number(dailySnap.data().count ?? 0) : 0;

    return {
      daily,
      total,
      displayTotal: total + LEGACY_TOTAL_OFFSET,
    };
  } catch (error) {
    if (isFirestoreConnectivityError(error)) {
      markFirestoreUnavailable();
      return FALLBACK_COUNTS;
    }
    throw error;
  }
}
