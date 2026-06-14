import PublicPageShell from "@/components/layouts/PublicPageShell";
import PastEditionsShowcase from "@/components/past-editions/PastEditionsShowcase";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function PastEventsPage() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: "Programmes",
        title: "Past Events",
        subtitle:
          "Explore Shiksha Mahakumbh Abhiyan editions 1.0 through 5.0, workshops, and national programmes.",
        accent: "saffron",
      }}
      relatedPath={CANONICAL_ROUTES.pastEvents}
      skipContainer
      showCta
    >
      <div className="mx-auto max-w-6xl px-4 pt-2 md:px-6">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Abhiyan", href: "/abhiyan" },
            { label: "Past Events" },
          ]}
          className="mb-2"
        />
      </div>
      <PastEditionsShowcase />
    </PublicPageShell>
  );
}
