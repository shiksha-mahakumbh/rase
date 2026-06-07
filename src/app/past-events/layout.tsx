import { createEventMetadata } from "@/lib/seo/metadataBuilders";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createEventMetadata({
  title: "Past Editions — Shiksha Mahakumbh 1.0 to 5.0",
  description:
    "Official archive of five completed Shiksha Mahakumbh Abhiyan editions: NIT Jalandhar, NIT Kurukshetra, NIT Srinagar, Kurukshetra University, and NIPER Mohali.",
  path: CANONICAL_ROUTES.pastEvents,
  keywords: [
    "Shiksha Mahakumbh past editions",
    "Indian Education Conference",
    "Education Conclave India",
  ],
});

export default function PastEventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Shiksha Mahakumbh", path: "/shikshamahakumbh" },
          { name: "Past Events", path: CANONICAL_ROUTES.pastEvents },
        ]}
      />
      {children}
    </>
  );
}
