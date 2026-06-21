import PublicPageShell from "@/components/layouts/PublicPageShell";
import CommitteesShowcase from "@/components/committee/CommitteesShowcase";
import CommitteesJsonLd from "@/components/committee/CommitteesJsonLd";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import AdSlotRegion from "@/components/showcase/AdSlotRegion";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { brandPageHero } from "@/lib/page-heroes";

export default function CommitteesPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Organising Committees",
        "National advisory, organising, and conference leadership across Shiksha Mahakumbh editions 1.0–6.0 — IITs, NITs, universities, Vidya Bharti, and DHE.",
        "Governance & Leadership"
      )}
      relatedPath={CANONICAL_ROUTES.committees}
      containerClassName="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14"
    >
      <CommitteesJsonLd />
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Past Events", href: "/past-events" },
          { label: "Organising Committees" },
        ]}
        className="mb-8"
      />
      <CommitteesShowcase />
      <AdSlotRegion label="Partner showcase" className="mt-12" />
    </PublicPageShell>
  );
}
