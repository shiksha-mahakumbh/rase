import PastEditionsJsonLd from "@/components/past-editions/PastEditionsJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  PAST_EVENTS_OG_IMAGE,
  PAST_EVENTS_PAGE_HERO,
  PAST_EVENTS_SEO_KEYWORDS,
} from "@/data/past-events-hub";

export const metadata = createPageMetadata({
  title: "Past Editions — शिक्षा महाकुंभ 1.0 to 5.0",
  description:
    "Official archive of five completed Shiksha Mahakumbh Abhiyan national editions: NIT Jalandhar (1.0), NIT Kurukshetra (2.0), NIT Srinagar (3.0), Kurukshetra University (4.0), and NIPER Mohali (5.0). Themes, impact stats, proceedings, galleries, and campaign reports.",
  path: "/past-events",
  keywords: [...PAST_EVENTS_SEO_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: PAST_EVENTS_OG_IMAGE,
});

export default function PastEventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PastEditionsJsonLd />
      {children}
    </>
  );
}
