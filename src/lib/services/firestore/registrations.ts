import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RegistrationRow } from "@/lib/exportRegistrations";

export const REGISTRATIONS_PAGE_SIZE = 50;

export interface RegistrationsPageResult {
  rows: RegistrationRow[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

function mapDocs(
  docs: QueryDocumentSnapshot<DocumentData>[]
): RegistrationRow[] {
  return docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as RegistrationRow[];
}

export async function fetchRegistrationsPage(
  cursor?: QueryDocumentSnapshot<DocumentData> | null
): Promise<RegistrationsPageResult> {
  try {
    const base = collection(db, "registrations");
    const q = cursor
      ? query(
          base,
          orderBy("createdAt", "desc"),
          startAfter(cursor),
          limit(REGISTRATIONS_PAGE_SIZE)
        )
      : query(base, orderBy("createdAt", "desc"), limit(REGISTRATIONS_PAGE_SIZE));

    const snap = await getDocs(q);
    const docs = snap.docs;

    return {
      rows: mapDocs(docs),
      lastDoc: docs.length ? docs[docs.length - 1] : null,
      hasMore: docs.length === REGISTRATIONS_PAGE_SIZE,
    };
  } catch (error) {
    console.warn("Paginated query failed, falling back to full fetch:", error);
    const snap = await getDocs(collection(db, "registrations"));
    const all = mapDocs(snap.docs);
    all.sort((a, b) => {
      const ta = (a.createdAt as { seconds?: number })?.seconds ?? 0;
      const tb = (b.createdAt as { seconds?: number })?.seconds ?? 0;
      return tb - ta;
    });
    return {
      rows: all.slice(0, REGISTRATIONS_PAGE_SIZE),
      lastDoc: null,
      hasMore: all.length > REGISTRATIONS_PAGE_SIZE,
    };
  }
}

export async function fetchAllRegistrations(): Promise<RegistrationRow[]> {
  const snap = await getDocs(collection(db, "registrations"));
  const rows = mapDocs(snap.docs);
  rows.sort((a, b) => {
    const ta = (a.createdAt as { seconds?: number })?.seconds ?? 0;
    const tb = (b.createdAt as { seconds?: number })?.seconds ?? 0;
    return tb - ta;
  });
  return rows;
}
