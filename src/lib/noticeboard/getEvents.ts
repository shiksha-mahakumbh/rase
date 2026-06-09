import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";

export type NoticeboardEvent = {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
};

/** Server-safe Firestore read for noticeboard (ISR / RSC). */
export async function getNoticeboardEvents(): Promise<NoticeboardEvent[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<NoticeboardEvent, "id">),
    }));
  } catch {
    return [];
  }
}
