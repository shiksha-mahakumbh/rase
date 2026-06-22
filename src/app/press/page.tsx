import PublicPageShell from "@/components/layouts/PublicPageShell";
import PressShowcase from "@/components/press/PressShowcase";
import PressJsonLd from "@/components/press/PressJsonLd";
import { buildPressCatalog } from "@/data/press-hub";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { loadCmsArticles } from "@/lib/cms/server";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Media Centre", path: "/media-center" },
  { name: "Press Releases", path: CANONICAL_ROUTES.press },
];

export default async function PressHubPage() {
  const cmsArticles = await loadCmsArticles(undefined, 50);
  const catalog = buildPressCatalog(cmsArticles);

  return (
    <PublicPageShell
      showHero={false}
      relatedPath={CANONICAL_ROUTES.press}
      showCta
      skipContainer
      breadcrumbs={BREADCRUMBS}
    >
      <PressJsonLd catalog={catalog} />
      <PressShowcase catalog={catalog} />
    </PublicPageShell>
  );
}
