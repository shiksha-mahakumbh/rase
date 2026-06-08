import { getNoticeboardEvents } from "@/lib/noticeboard/getEvents";
import NoticeboardClient from "./NoticeboardClient";
import PublicPageShell from "@/components/layouts/PublicPageShell";

export const revalidate = 300;

const PAGE_HERO = {
  eyebrow: "Live Updates",
  title: "Notice Board",
  subtitle: "Campus notices, deadlines, and programme announcements.",
  accent: "saffron" as const,
};

export default async function NoticeboardPage() {
  const initialEvents = await getNoticeboardEvents();
  return (
    <PublicPageShell hero={PAGE_HERO} showCta={false}>
      <NoticeboardClient initialEvents={initialEvents} />
    </PublicPageShell>
  );
}
