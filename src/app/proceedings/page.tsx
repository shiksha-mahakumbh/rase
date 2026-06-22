import ProceedingsJsonLd from "@/components/proceedings/ProceedingsJsonLd";
import ProceedingsShowcase from "@/components/proceedings/ProceedingsShowcase";
import PublicPageShell from "@/components/layouts/PublicPageShell";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Publications", path: "/publications" },
  { name: "Proceedings", path: "/proceedings" },
];

export default function ProceedingsPage() {
  return (
    <PublicPageShell
      showHero={false}
      showCta={false}
      breadcrumbs={BREADCRUMBS}
      relatedPath="/proceedings"
      skipContainer
    >
      <ProceedingsJsonLd />
      <ProceedingsShowcase />
    </PublicPageShell>
  );
}
