import PublicPageShell from "@/components/layouts/PublicPageShell";
import Best_Wishes from "@/app/component/Best_Wishes";

const PAGE_HERO = {
  eyebrow: "Community",
  title: "Best Wishes",
  subtitle: "Messages of support for the Shiksha Mahakumbh national education movement.",
  accent: "saffron" as const,
};

export default function BestWishesPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} showHero={false} skipContainer>
      <Best_Wishes />
    </PublicPageShell>
  );
}
