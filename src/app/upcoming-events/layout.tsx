import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { UPCOMING_EVENTS_KEYWORDS } from "@/data/upcoming-events-hub";

export const metadata: Metadata = createPageMetadata({
  title: "Upcoming Events — Shiksha Mahakumbh 6.0 & 7.0 | National Education Summit",
  description:
    "Register for Shiksha Mahakumbh 6.0 at NIT Hamirpur (9–11 October 2026). Shiksha Mahakumbh 7.0 at IIT Jammu — coming soon. National multidisciplinary education summit aligned with NEP 2020.",
  path: CANONICAL_ROUTES.upcomingEvents,
  keywords: [...UPCOMING_EVENTS_KEYWORDS],
  locale: "en_IN",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
