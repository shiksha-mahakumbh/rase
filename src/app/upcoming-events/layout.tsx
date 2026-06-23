import UpcomingEventsJsonLd from "@/components/upcoming-events/UpcomingEventsJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  UPCOMING_EVENTS_KEYWORDS,
  UPCOMING_EVENTS_OG_IMAGE,
  UPCOMING_EVENTS_PATH,
  upcomingEventsMetaDescription,
} from "@/data/upcoming-events-hub";

export const metadata = createPageMetadata({
  title: `Upcoming Events — Shiksha Mahakumbh 6.0 & 7.0 | National Education Summit`,
  description: upcomingEventsMetaDescription(),
  path: UPCOMING_EVENTS_PATH,
  keywords: [...UPCOMING_EVENTS_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: UPCOMING_EVENTS_OG_IMAGE,
});

export default function UpcomingEventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UpcomingEventsJsonLd />
      {children}
    </>
  );
}
