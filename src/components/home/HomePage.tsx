import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import HomeSectionNav from "./HomeSectionNav";
import type { CmsPageData } from "@/lib/cms/types";
import { CmsProvider } from "@/lib/cms/context";
import SectionSkeleton from "@/components/performance/SectionSkeleton";
import AnnouncementsMarquee from "@/components/layout/AnnouncementsMarquee";
import NavBarShell from "@/components/layout/navbar/NavBarShell";
import HomeBelowFold from "./HomeBelowFold";
import type { HeroContent } from "@/lib/home/build-hero-content";
import type { HomeSectionsContent } from "@/lib/home/build-home-sections";
import type { TickerItem } from "@/data/default-announcements";
import type { Menu } from "@/components/layout/navbar/types";
import type { ContentLocale } from "@prisma/client";

const HomeWelcomeModal = dynamic(() => import("./HomeWelcomeModal"), { ssr: false });

export default function HomePage({
  cmsData,
  heroContent,
  homeSections,
  tickerItems,
  navMenus,
  locale = "en",
}: {
  cmsData: CmsPageData;
  heroContent: HeroContent;
  homeSections: HomeSectionsContent;
  tickerItems: readonly TickerItem[];
  navMenus: Menu[];
  locale?: ContentLocale;
}) {
  return (
    <div className="min-h-screen bg-white">
      <NavBarShell menus={navMenus} />

      <main id="main-content">
        <HeroSection content={heroContent} />
        <AnnouncementsMarquee items={tickerItems} />
        <HomeSectionNav />

        <CmsProvider data={cmsData}>
          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                <SectionSkeleton lines={6} />
              </div>
            }
          >
            <HomeBelowFold locale={locale} homeSections={homeSections} />
          </Suspense>
          <HomeWelcomeModal />
        </CmsProvider>
      </main>
    </div>
  );
}
