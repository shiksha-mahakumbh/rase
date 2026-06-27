import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import HomeSectionNav from "./HomeSectionNav";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";
import type { CmsPartnerCard, CmsSpeakerCard } from "@/lib/cms/types";
import LazySection from "@/components/performance/LazySection";
import SectionSkeleton from "@/components/performance/SectionSkeleton";
import AnnouncementsMarquee from "@/components/layout/AnnouncementsMarquee";
import NavBarShell from "@/components/layout/navbar/NavBarShell";
import HomePageChromeDeferred from "./HomePageChromeDeferred";
import HomeWelcomeModal from "./HomeWelcomeModal";
import type { HeroContent } from "@/lib/home/build-hero-content";
import type { HomeSectionsContent } from "@/lib/home/build-home-sections";
import type { TickerItem } from "@/data/default-announcements";
import type { Menu } from "@/components/layout/navbar/types";

const Footer = dynamic(() => import("@/components/layout/Footer"));
const GlassCard = dynamic(() => import("@/components/ui/GlassCard"));
const UpcomingEvent = dynamic(() => import("@/components/home/sections/UpcomingEvent"));
const GallerySection = dynamic(() => import("./GallerySection"));
const TestimonialsStrip = dynamic(() => import("./TestimonialsStrip"));
const HomeFaqSection = dynamic(() => import("./HomeFaqSection"));
const SpeakerHighlightsSection = dynamic(() => import("./SpeakerHighlightsSection"));
const VenueTravelSection = dynamic(() => import("./VenueTravelSection"));
const HomeEducationEcosystemNav = dynamic(() => import("./HomeEducationEcosystemNav"));
const PartnersShowcase = dynamic(() => import("./sections/PartnersShowcase"));
const TrustStrip = dynamic(() => import("./TrustStrip"));
const WhyAttendSection = dynamic(() => import("./WhyAttendSection"));
const BrandShowcaseSection = dynamic(() => import("./BrandShowcaseSection"));
const DiscoverStrip = dynamic(() => import("./DiscoverStrip"));
const EventTracksSection = dynamic(() => import("./EventTracksSection"));
const ProgrammesNoticesSection = dynamic(() => import("./ProgrammesNoticesSection"));

export default function HomePage({
  featuredSpeakers = [],
  cmsPartners = [],
  heroContent,
  homeSections,
  tickerItems,
  navMenus,
}: {
  featuredSpeakers?: CmsSpeakerCard[];
  cmsPartners?: CmsPartnerCard[];
  heroContent: HeroContent;
  homeSections: HomeSectionsContent;
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

        <LazySection minHeight="7rem" rootMargin="0px 0px 300px 0px" idleFirst fallback={<SectionSkeleton lines={1} />}>
          <TrustStrip content={homeSections.trustStrip} />
        </LazySection>

        <LazySection minHeight="24rem" rootMargin="0px 0px 250px 0px" idleFirst fallback={<SectionSkeleton lines={4} />}>
          <WhyAttendSection content={homeSections.whyAttend} />
        </LazySection>

        <LazySection minHeight="22rem" rootMargin="0px 0px 250px 0px" idleFirst fallback={<SectionSkeleton lines={3} />}>
          <BrandShowcaseSection />
        </LazySection>

        <LazySection minHeight="20rem" rootMargin="0px 0px 200px 0px" idleFirst fallback={<SectionSkeleton lines={4} />}>
          <ProgrammesNoticesSection />
        </LazySection>

        <LazySection minHeight="22rem" rootMargin="0px 0px 200px 0px" idleFirst fallback={<SectionSkeleton lines={3} />}>
          <DiscoverStrip content={homeSections.discover} />
        </LazySection>

        <LazySection minHeight="24rem" rootMargin="0px 0px 200px 0px" idleFirst fallback={<SectionSkeleton lines={4} />}>
          <EventTracksSection content={homeSections.eventTracks} />
        </LazySection>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ReservedAdSlot slotId="home-mid" />
        </div>

        <LazySection
          minHeight="28rem"
          rootMargin="0px 0px 200px 0px"
          idleFirst
          fallback={
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <SectionSkeleton lines={5} />
            </div>
          }
        >
          <PartnersShowcase cmsPartners={cmsPartners} cmsSpeakers={featuredSpeakers} />
        </LazySection>

        <LazySection
          minHeight="18rem"
          rootMargin="0px 0px 200px 0px"
          idleFirst
          fallback={
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <SectionSkeleton lines={4} />
            </div>
          }
        >
          <section
            aria-label="Upcoming events"
            className="bg-white px-4 py-10 md:px-8 md:py-14"
          >
            <div className="mx-auto max-w-7xl">
              <GlassCard className="overflow-hidden p-6 md:p-8">
                <UpcomingEvent />
              </GlassCard>
            </div>
          </section>
        </LazySection>

        <LazySection
          minHeight="20rem"
          rootMargin="0px 0px 200px 0px"
          idleFirst
          fallback={<SectionSkeleton lines={3} />}
        >
          <SpeakerHighlightsSection speakers={featuredSpeakers} />
        </LazySection>
        <LazySection
          minHeight="22rem"
          rootMargin="0px 0px 200px 0px"
          idleFirst
          fallback={<SectionSkeleton lines={4} />}
        >
          <GallerySection />
        </LazySection>

        <LazySection
          minHeight="24rem"
          rootMargin="0px 0px 200px 0px"
          idleFirst
          fallback={<SectionSkeleton lines={4} />}
        >
          <VenueTravelSection />
        </LazySection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ReservedAdSlot slotId="home-footer" />
        </div>
        <LazySection
          minHeight="12rem"
          rootMargin="0px 0px 120px 0px"
          idleFirst
          fallback={<SectionSkeleton lines={2} />}
        >
          <TestimonialsStrip />
        </LazySection>
        <LazySection
          minHeight="20rem"
          rootMargin="0px 0px 120px 0px"
          idleFirst
          fallback={<SectionSkeleton lines={4} />}
        >
          <HomeFaqSection />
        </LazySection>
        <HomeEducationEcosystemNav />
      </main>

      <Footer />
      <HomePageChromeDeferred />
      <HomeWelcomeModal />
    </div>
  );
}
