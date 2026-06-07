import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import CommitteeTree from "@/app/component/CommitteeTree";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import AdSlotRegion from "@/components/showcase/AdSlotRegion";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function CommitteesPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <ShowcaseHero
        eyebrow="Governance & Leadership"
        title="Shiksha Mahakumbh Timeline"
        subtitle="Explore organising committees across Mahakumbh editions — the leadership backbone of India's national education movement."
      />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
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
      </main>
      <Footer />
    </div>
  );
}
