import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import HomeSectionNav from "./HomeSectionNav";
import { CtaButton, SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";
import type { CmsPartnerCard, CmsSpeakerCard } from "@/lib/cms/types";
import LazySection from "@/components/performance/LazySection";
import SectionSkeleton from "@/components/performance/SectionSkeleton";
import AnnouncementsMarquee from "@/components/layout/AnnouncementsMarquee";
import NavBarShell from "@/components/layout/navbar/NavBarShell";
import HomePageChromeDeferred from "./HomePageChromeDeferred";
import HomeWelcomeModal from "./HomeWelcomeModal";
import type { HeroContent } from "@/lib/home/build-hero-content";
import type { TickerItem } from "@/data/default-announcements";
import type { Menu } from "@/components/layout/navbar/types";

const Footer = dynamic(() => import("@/components/layout/Footer"));
const TrustStrip = dynamic(() => import("./TrustStrip"));
const BrandShowcaseSection = dynamic(() => import("./BrandShowcaseSection"));
const DiscoverStrip = dynamic(() => import("./DiscoverStrip"));
const Announcement = dynamic(() => import("@/components/home/sections/Announcement"));
const NoticeBoard = dynamic(() => import("@/components/home/sections/NoticeBoard"));
const GlassCard = dynamic(() => import("@/components/ui/GlassCard"));
const UpcomingEvent = dynamic(() => import("@/components/home/sections/UpcomingEvent"));
const GallerySection = dynamic(() => import("./GallerySection"));
const HomeFaqSection = dynamic(() => import("./HomeFaqSection"));
const PartnersShowcase = dynamic(() => import("@/components/home/sections/PartnersShowcase"));
const HomeEditionCta = dynamic(() => import("./HomeEditionCta"));
const WhyAttendSection = dynamic(() => import("./WhyAttendSection"));
const EventTracksSection = dynamic(() => import("./EventTracksSection"));
const SpeakerHighlightsSection = dynamic(() => import("./SpeakerHighlightsSection"));
const VenueTravelSection = dynamic(() => import("./VenueTravelSection"));
const HomeEducationEcosystemNav = dynamic(() => import("./HomeEducationEcosystemNav"));

export default function HomePage({
  featuredSpeakers = [],
  cmsPartners = [],
  heroContent,
  tickerItems,
  navMenus,
}: {
  featuredSpeakers?: CmsSpeakerCard[];
  cmsPartners?: CmsPartnerCard[];
  heroContent: HeroContent;
  tickerItems: readonly TickerItem[];
  navMenus: Menu[];
}) {
  return (
    <div className="min-h-screen bg-white">
      <NavBarShell menus={navMenus} />
      <AnnouncementsMarquee items={tickerItems} />

      <main id="main-content">
        <HeroSection content={heroContent} />
        <HomeSectionNav />

        <LazySection minHeight="3rem" rootMargin="120px 0px" fallback={<SectionSkeleton lines={1} />}>
          <TrustStrip />
        </LazySection>

        <LazySection rootMargin="120px 0px" idleFirst fallback={<SectionSkeleton lines={4} />}>
          <WhyAttendSection />
        </LazySection>

        <LazySection minHeight="8rem" rootMargin="120px 0px" fallback={<SectionSkeleton lines={3} />}>
          <BrandShowcaseSection />
        </LazySection>

        <section
          id="programmes"
          aria-label="Programmes and notices"
          className="relative overflow-hidden home-section-warm px-4 py-8 md:px-8 md:py-10 [content-visibility:auto] [contain-intrinsic-size:auto_28rem]"
        >
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeader
                align="left"
                eyebrow="Live Updates"
                title="Programmes & Announcements"
                description="Registration tracks, deadlines, and campus notices."
                className="mb-0"
              />
              <CtaButton href={ROUTES.registration} variant="ghost" className="shrink-0">
                All registration types
              </CtaButton>
            </div>
            <LazySection
              minHeight="20rem"
              rootMargin="80px 0px"
              fallback={
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <SectionSkeleton />
                  <SectionSkeleton />
                  <SectionSkeleton />
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                <div className="lg:col-span-4">
                  <Announcement />
                </div>
                <div className="lg:col-span-4">
                  <NoticeBoard />
                </div>
                <div className="lg:col-span-4">
                  <HomeEditionCta />
                </div>
              </div>
            </LazySection>
          </div>
        </section>

        <LazySection minHeight="6rem" rootMargin="0px 0px 80px 0px" idleFirst fallback={<SectionSkeleton lines={2} />}>
          <DiscoverStrip />
        </LazySection>

        <LazySection rootMargin="0px 0px 60px 0px" idleFirst fallback={<SectionSkeleton />}>
          <EventTracksSection />
        </LazySection>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ReservedAdSlot slotId="home-mid" />
        </div>

        <LazySection minHeight="12rem" rootMargin="0px 0px 60px 0px" idleFirst fallback={<SectionSkeleton lines={6} />}>
          <PartnersShowcase cmsPartners={cmsPartners} cmsSpeakers={featuredSpeakers} />
        </LazySection>

        <LazySection
          minHeight="16rem"
          rootMargin="0px 0px 60px 0px"
          idleFirst
          fallback={
            <div className="mx-auto max-w-7xl">
              <SectionSkeleton lines={4} />
            </div>
          }
        >
          <section
            aria-label="Upcoming events"
            className="bg-white px-4 py-10 md:px-8 md:py-14 [content-visibility:auto] [contain-intrinsic-size:auto_20rem]"
          >
            <div className="mx-auto max-w-7xl">
              <GlassCard className="overflow-hidden p-6 md:p-8">
                <UpcomingEvent />
              </GlassCard>
            </div>
          </section>
        </LazySection>

        <LazySection rootMargin="0px 0px 60px 0px" idleFirst fallback={<SectionSkeleton />}>
          <SpeakerHighlightsSection speakers={featuredSpeakers} />
        </LazySection>
        <LazySection rootMargin="0px 0px 60px 0px" idleFirst fallback={<SectionSkeleton lines={4} />}>
          <GallerySection />
        </LazySection>

        <LazySection rootMargin="0px 0px 60px 0px" idleFirst fallback={<SectionSkeleton />}>
          <VenueTravelSection />
        </LazySection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ReservedAdSlot slotId="home-footer" />
        </div>
        <LazySection rootMargin="0px 0px 60px 0px" idleFirst fallback={<SectionSkeleton lines={4} />}>
          <HomeFaqSection />
        </LazySection>
        <LazySection rootMargin="0px 0px 40px 0px" idleFirst fallback={<SectionSkeleton />}>
          <HomeEducationEcosystemNav />
        </LazySection>
      </main>

      <Footer />
      <HomePageChromeDeferred />
      <HomeWelcomeModal />
    </div>
  );
}
