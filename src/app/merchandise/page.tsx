import PublicPageShell from "@/components/layouts/PublicPageShell";
import Merchandise from "@/components/content/Merchandise";
import { brandPageHero } from "@/lib/page-heroes";

export default function MerchandisePage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Merchandise",
        "Official Shiksha Mahakumbh merchandise and programme materials.",
        "Official Store"
      )}
      showCta={false}
      skipContainer
    >
      <Merchandise />
    </PublicPageShell>
  );
}
