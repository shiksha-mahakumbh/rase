import PublicPageShell from "@/components/layouts/PublicPageShell";
import ResidentialCamp from "@/components/content/Residential_Camp";
import { brandPageHero } from "@/lib/page-heroes";

export default function ResidentialCampPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Residential Camp",
        "Residential training programmes at Shiksha Mahakumbh.",
        "Programmes"
      )}
    >
      <ResidentialCamp />
    </PublicPageShell>
  );
}
