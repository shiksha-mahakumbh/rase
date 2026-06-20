import PublicPageShell from "@/components/layouts/PublicPageShell";
import Best_Wishes from "@/components/content/Best_Wishes";
import { brandPageHero } from "@/lib/page-heroes";

export default function BestWishesPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Best Wishes",
        "Messages of support for the Shiksha Mahakumbh national education movement.",
        "Community"
      )}
      skipContainer
    >
      <Best_Wishes />
    </PublicPageShell>
  );
}
