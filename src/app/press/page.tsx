import PublicPageShell from "@/components/layouts/PublicPageShell";
import PressShowcase from "@/components/press/PressShowcase";
import PressJsonLd from "@/components/press/PressJsonLd";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { loadCmsArticles } from "@/lib/cms/server";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Media Centre", path: "/media-center" },
  { name: "Press Releases", path: CANONICAL_ROUTES.press },
];

export default async function PressHubPage() {
  const articles = await loadCmsArticles();
  return (
    <PublicPageShell
      showHero={false}
      relatedPath={CANONICAL_ROUTES.press}
      showCta
      skipContainer
      breadcrumbs={BREADCRUMBS}
    >
      <PressJsonLd />
      <PressShowcase articles={articles} />
    </PublicPageShell>
  );
}
