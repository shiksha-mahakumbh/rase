import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import { CtaButton, SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";
import WhyAttendSection from "./WhyAttendSection";
import EventTracksSection from "./EventTracksSection";
import SpeakerHighlightsSection from "./SpeakerHighlightsSection";
import type { CmsPartnerCard, CmsSpeakerCard } from "@/lib/cms/types";
import VenueTravelSection from "./VenueTravelSection";
import HomeEducationEcosystemNav from "./HomeEducationEcosystemNav";
import LazySection from "@/components/performance/LazySection";
import SectionSkeleton from "@/components/performance/SectionSkeleton";
import AnnouncementsMarquee from "@/components/layout/AnnouncementsMarquee";
import HomePageChromeDeferred from "./HomePageChromeDeferred";
import type { HeroContent } from "@/lib/home/build-hero-content";
import type { TickerItem } from "@/data/default-announcements";

const NavBar = dynamic(() => import("@/components/layout/NavBar"), {
  loading: () => (
    <div className="h-16 w-full border-b border-slate-200 bg-white/90" aria-hidden />
  ),
});
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

export default function HomePage({
  featuredSpeakers = [],
  cmsPartners = [],
  heroContent,
  tickerItems,
}: {
  featuredSpeakers?: CmsSpeakerCard[];
  cmsPartners?: CmsPartnerCard[];
  heroContent: HeroContent;
  tickerItems: readonly TickerItem[];
}) {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <AnnouncementsMarquee items={tickerItems} />

      <main id="main-content">
        <HeroSection content={heroContent} />
        <LazySection minHeight="3rem" rootMargin="120px 0px" fallback={<SectionSkeleton lines={1} />}>
          <TrustStrip />
        </LazySection>

        <LazySection minHeight="12rem" rootMargin="120px 0px" fallback={<SectionSkeleton lines={6} />}>
          <PartnersShowcase cmsPartners={cmsPartners} cmsSpeakers={featuredSpeakers} />
        </LazySection>

        <LazySection minHeight="8rem" rootMargin="120px 0px" fallback={<SectionSkeleton lines={3} />}>
          <BrandShowcaseSection />
        </LazySection>

        <section
          aria-label="Programmes and notices"
          className="relative overflow-hidden bg-gradient-to-br from-[#fff9f5] via-white to-[#fef3e8] px-4 py-8 md:px-8 md:py-10 [content-visibility:auto] [contain-intrinsic-size:auto_28rem]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"
          />
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

        <LazySection minHeight="6rem" rootMargin="80px 0px" fallback={<SectionSkeleton lines={2} />}>
          <DiscoverStrip />
        </LazySection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ReservedAdSlot slotId="home-mid" />
        </div>

        <LazySection rootMargin="80px 0px" fallback={<SectionSkeleton lines={4} />}>
          <WhyAttendSection />
        </LazySection>
        <LazySection rootMargin="80px 0px" fallback={<SectionSkeleton />}>
          <EventTracksSection />
        </LazySection>

        <LazySection
          minHeight="16rem"
          rootMargin="80px 0px"
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

        <LazySection rootMargin="80px 0px" fallback={<SectionSkeleton />}>
          <SpeakerHighlightsSection speakers={featuredSpeakers} />
        </LazySection>
        <LazySection rootMargin="80px 0px" fallback={<SectionSkeleton lines={4} />}>
          <GallerySection />
        </LazySection>

        <LazySection rootMargin="80px 0px" fallback={<SectionSkeleton />}>
          <VenueTravelSection />
        </LazySection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ReservedAdSlot slotId="home-footer" />
        </div>
        <LazySection rootMargin="80px 0px" fallback={<SectionSkeleton lines={4} />}>
          <HomeFaqSection />
        </LazySection>
        <LazySection rootMargin="80px 0px" fallback={<SectionSkeleton />}>
          <HomeEducationEcosystemNav />
        </LazySection>
      </main>

      <Footer />
      <HomePageChromeDeferred />
    </div>
  );
}
