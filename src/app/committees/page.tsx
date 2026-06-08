import PublicPageShell from "@/components/layouts/PublicPageShell";
import CommitteeTree from "@/app/component/CommitteeTree";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import AdSlotRegion from "@/components/showcase/AdSlotRegion";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function CommitteesPage() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: "Governance & Leadership",
        title: "Shiksha Mahakumbh Timeline",
        subtitle:
          "Explore organising committees across Mahakumbh editions — the leadership backbone of India's national education movement.",
        accent: "navy",
      }}
      relatedPath={CANONICAL_ROUTES.committees}
      containerClassName="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16"
    >
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Shiksha Mahakumbh", href: "/shikshamahakumbh" },
          { label: "Organising Committees" },
        ]}
        className="mb-8"
      />
      <CommitteeTree />
      <AdSlotRegion label="Partner showcase" />
    </PublicPageShell>
  );
}
