import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

const STORAGE_BUCKET = "shiksha-mahakumbh-abhiyan.firebasestorage.app";
const EXPECTED_PROJECT_ID = "shiksha-mahakumbh-abhiyan";
/** Named Firestore database (project uses `default`, not legacy `(default)`). */
const FIRESTORE_DATABASE_ID = "default";

let adminApp: App | undefined;
let adminDb: Firestore | undefined;
let adminStorage: Storage | undefined;

export type FirebaseAdminDiagnostics = {
  envPresent: boolean;
  envLength: number;
  jsonParseOk: boolean;
  projectId: string | null;
  projectIdMatches: boolean;
  clientEmailPresent: boolean;
  privateKeyPresent: boolean;
  privateKeyFormatOk: boolean;
  initOk: boolean;
  firestoreOk: boolean;
  counterDocExists: boolean | null;
  lastNumber: number | null;
  legacyCurrentNumber: number | null;
  error: string | null;
  errorStage: "env" | "parse" | "init" | "firestore" | "counter" | null;
};

function parseServiceAccount(): Record<string, string> {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw?.trim()) {
    console.error("[firebase-admin] FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    console.info("[firebase-admin] service account JSON parsed", {
      projectId: parsed.project_id ?? null,
      clientEmail: parsed.client_email ? "present" : "missing",
      privateKey: parsed.private_key ? "present" : "missing",
    });
    return parsed;
  } catch (error) {
    console.error("[firebase-admin] invalid FIREBASE_SERVICE_ACCOUNT_JSON", {
      message: error instanceof Error ? error.message : String(error),
    });
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON");
  }
}

export function getAdminApp(): App {
  if (adminApp) return adminApp;

  const existing = getApps();
  if (existing.length > 0) {
    adminApp = existing[0]!;
    return adminApp;
  }

  const serviceAccount = parseServiceAccount();
  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
    storageBucket: STORAGE_BUCKET,
  });

  console.info("[firebase-admin] initialized", {
    projectId: serviceAccount.project_id,
    storageBucket: STORAGE_BUCKET,
  });

  return adminApp;
}

export function getAdminFirestore(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp(), FIRESTORE_DATABASE_ID);
  }
  return adminDb;
}

export function getAdminStorage(): Storage {
  if (!adminStorage) {
    adminStorage = getStorage(getAdminApp());
  }
  return adminStorage;
}

export async function diagnoseFirebaseAdmin(): Promise<FirebaseAdminDiagnostics> {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const result: FirebaseAdminDiagnostics = {
    envPresent: Boolean(raw?.trim()),
    envLength: raw?.length ?? 0,
    jsonParseOk: false,
    projectId: null,
    projectIdMatches: false,
    clientEmailPresent: false,
    privateKeyPresent: false,
    privateKeyFormatOk: false,
    initOk: false,
    firestoreOk: false,
    counterDocExists: null,
    lastNumber: null,
    legacyCurrentNumber: null,
    error: null,
    errorStage: null,
  };

  if (!result.envPresent) {
    result.error = "FIREBASE_SERVICE_ACCOUNT_JSON is not configured";
    result.errorStage = "env";
    return result;
  }

  let serviceAccount: Record<string, string>;
  try {
    serviceAccount = JSON.parse(raw!) as Record<string, string>;
    result.jsonParseOk = true;
    result.projectId = serviceAccount.project_id ?? null;
    result.projectIdMatches = result.projectId === EXPECTED_PROJECT_ID;
    result.clientEmailPresent = Boolean(serviceAccount.client_email);
    result.privateKeyPresent = Boolean(serviceAccount.private_key);
    result.privateKeyFormatOk = Boolean(
      serviceAccount.private_key?.includes("BEGIN PRIVATE KEY")
    );
  } catch (error) {
    result.error =
      error instanceof Error ? error.message : "Invalid service account JSON";
    result.errorStage = "parse";
    return result;
  }

  try {
    getAdminApp();
    result.initOk = true;
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Init failed";
    result.errorStage = "init";
    return result;
  }

  try {
    const db = getAdminFirestore();
    await db.collection("registrations").limit(1).get();
    result.firestoreOk = true;
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Firestore failed";
    result.errorStage = "firestore";
    return result;
  }

  try {
    const counterSnap = await getAdminFirestore()
      .collection("registrationCounters")
      .doc("smk2026")
      .get();
    result.counterDocExists = counterSnap.exists;
    if (counterSnap.exists) {
      const data = counterSnap.data();
      result.lastNumber =
        typeof data?.lastNumber === "number" ? data.lastNumber : null;
      result.legacyCurrentNumber =
        typeof data?.currentNumber === "number" ? data.currentNumber : null;
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Counter read failed";
    result.errorStage = "counter";
  }

  return result;
}
