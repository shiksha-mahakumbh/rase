import PublicPageShell from "@/components/layouts/PublicPageShell";
import Press from "@/components/press/Press";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { PAGE_HEROES } from "@/lib/page-heroes";
import { loadCmsArticles } from "@/lib/cms/server";

export default async function PressHubPage() {
  const articles = await loadCmsArticles();
  return (
    <PublicPageShell
      hero={PAGE_HEROES.press}
      relatedPath={CANONICAL_ROUTES.press}
      showCta
    >
      <Press articles={articles} />
    </PublicPageShell>
  );
}
