import PublicPageShell from "@/components/layouts/PublicPageShell";
import Merchandise from "@/app/component/Merchandise";

const PAGE_HERO = {
  eyebrow: "Official Store",
  title: "Merchandise",
  subtitle: "Official Shiksha Mahakumbh merchandise and programme materials.",
  accent: "saffron" as const,
};

export default function MerchandisePage() {
  return (
    <PublicPageShell hero={PAGE_HERO} showHero={false} skipContainer>
      <Merchandise />
    </PublicPageShell>
  );
}
