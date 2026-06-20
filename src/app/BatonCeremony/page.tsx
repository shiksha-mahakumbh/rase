import PublicPageShell from "@/components/layouts/PublicPageShell";
import BatonCeremony from "@/components/content/Baton";
import { brandPageHero } from "@/lib/page-heroes";

export default function BatonCeremonyPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        "Baton Ceremony",
        "Ceremonial launch of Shiksha Mahakumbh editions.",
        "Events"
      )}
    >
      <BatonCeremony />
    </PublicPageShell>
  );
}
