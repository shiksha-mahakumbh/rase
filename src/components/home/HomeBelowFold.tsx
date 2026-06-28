import dynamic from "next/dynamic";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";
import { loadCmsPageData } from "@/lib/cms/server";
import { loadCmsSpeakers, loadCmsPartners } from "@/lib/cms/organizational";
import LazySection from "@/components/performance/LazySection";
import SectionSkeleton from "@/components/performance/SectionSkeleton";
import HomePageChromeDeferred from "./HomePageChromeDeferred";
import type { HomeSectionsContent } from "@/lib/home/build-home-sections";
import type { ContentLocale } from "@prisma/client";
import { CmsProvider } from "@/lib/cms/context";

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

type Props = {
  locale?: ContentLocale;
  homeSections: HomeSectionsContent;
};

/** Below-fold homepage — streamed after hero to shorten LCP path. */
export default async function HomeBelowFold({ locale = "en", homeSections }: Props) {
  const [cmsData, featuredSpeakers, cmsPartners] = await Promise.all([
    loadCmsPageData(locale),
    loadCmsSpeakers(locale, true),
    loadCmsPartners(locale),
  ]);

  return (
    <CmsProvider data={cmsData}>
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
        <section aria-label="Upcoming events" className="bg-white px-4 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-7xl">
            <GlassCard className="overflow-hidden p-6 md:p-8">
              <UpcomingEvent />
            </GlassCard>
          </div>
        </section>
      </LazySection>

      <LazySection minHeight="20rem" rootMargin="0px 0px 200px 0px" idleFirst fallback={<SectionSkeleton lines={3} />}>
        <SpeakerHighlightsSection speakers={featuredSpeakers} />
      </LazySection>
      <LazySection minHeight="22rem" rootMargin="0px 0px 200px 0px" idleFirst fallback={<SectionSkeleton lines={4} />}>
        <GallerySection />
      </LazySection>

      <LazySection minHeight="24rem" rootMargin="0px 0px 200px 0px" idleFirst fallback={<SectionSkeleton lines={4} />}>
        <VenueTravelSection />
      </LazySection>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <ReservedAdSlot slotId="home-footer" />
      </div>
      <LazySection minHeight="12rem" rootMargin="0px 0px 120px 0px" idleFirst fallback={<SectionSkeleton lines={2} />}>
        <TestimonialsStrip />
      </LazySection>
      <LazySection minHeight="20rem" rootMargin="0px 0px 120px 0px" idleFirst fallback={<SectionSkeleton lines={4} />}>
        <HomeFaqSection />
      </LazySection>
      <HomeEducationEcosystemNav />

      <Footer />
      <HomePageChromeDeferred />
    </CmsProvider>
  );
}
