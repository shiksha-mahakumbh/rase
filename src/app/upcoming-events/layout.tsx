import { createEventMetadata } from "@/lib/seo/metadataBuilders";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createEventMetadata({
  title: "शिक्षा महाकुंभ 6.0 — Upcoming Programmes",
  description:
    "Upcoming programmes and registration for Shiksha Mahakumbh Abhiyan edition 6.0.",
  path: CANONICAL_ROUTES.upcomingEvents,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
