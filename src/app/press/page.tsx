import PublicPageShell from "@/components/layouts/PublicPageShell";
import Press from "../component/Press";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function PressHubPage() {
  return (
    <PublicPageShell
      hero={PAGE_HEROES.press}
      relatedPath={CANONICAL_ROUTES.press}
      showCta
    >
      <Press />
    </PublicPageShell>
  );
}
