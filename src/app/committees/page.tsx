import PublicPageShell from "@/components/layouts/PublicPageShell";
import CommitteeTree from "@/components/content/CommitteeTree";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import AdSlotRegion from "@/components/showcase/AdSlotRegion";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { brandPageHero } from "@/lib/page-heroes";

export default function CommitteesPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Abhiyan Edition Timeline",
        "Explore organising committees across Abhiyan editions — the leadership backbone of India's national education movement.",
        "Governance & Leadership"
      )}
      relatedPath={CANONICAL_ROUTES.committees}
      containerClassName="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16"
    >
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Past Events", href: "/past-events" },
          { label: "Organising Committees" },
        ]}
        className="mb-8"
      />
      <CommitteeTree />
      <AdSlotRegion label="Partner showcase" />
    </PublicPageShell>
  );
}
