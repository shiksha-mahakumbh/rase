import type { Metadata } from "next";
import BestWishesShowcase from "@/components/best-wishes/BestWishesShowcase";
import BestWishesJsonLd from "@/components/best-wishes/BestWishesJsonLd";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { BEST_WISHES_HERO, BEST_WISHES_KEYWORDS, bestWishesCount } from "@/data/best-wishes";
import { createPageMetadata } from "@/lib/seo/metadata";
import { brandPageHero } from "@/lib/page-heroes";

export const metadata: Metadata = createPageMetadata({
  title: `Best Wishes — ${bestWishesCount()} Dignitary Messages | Shiksha Mahakumbh Abhiyan`,
  description:
    `Read best wishes from ${bestWishesCount()} presidents, governors, ministers, IIT/IIM/CSIR directors, UGC leadership, and University of Oxford — supporting the Shiksha Mahakumbh Abhiyan across all editions. Search all messages.`,
  path: "/best-wishes",
  keywords: [...BEST_WISHES_KEYWORDS],
  locale: "en_IN",
});

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Best Wishes", path: "/best-wishes" },
];

export default function BestWishesPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        BEST_WISHES_HERO.title,
        BEST_WISHES_HERO.subtitle,
        BEST_WISHES_HERO.eyebrow
      )}
      showCta={false}
      breadcrumbs={BREADCRUMBS}
      relatedPath="/best-wishes"
      containerClassName="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14"
    >
      <BestWishesJsonLd />
      <BestWishesShowcase />
    </PublicPageShell>
  );
}
