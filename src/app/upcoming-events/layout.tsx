import { createEventMetadata } from "@/lib/seo/metadataBuilders";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createEventMetadata({
  title: "Upcoming Events",
  description: "Upcoming Shiksha Mahakumbh events and national education programmes.",
  path: CANONICAL_ROUTES.upcomingEvents,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
