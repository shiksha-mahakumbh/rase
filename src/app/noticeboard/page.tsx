import { getNoticeboardEvents } from "@/lib/noticeboard/getEvents";
import NoticeboardClient from "./NoticeboardClient";

export const revalidate = 300;

export default async function NoticeboardPage() {
  const initialEvents = await getNoticeboardEvents();
  return <NoticeboardClient initialEvents={initialEvents} />;
}
