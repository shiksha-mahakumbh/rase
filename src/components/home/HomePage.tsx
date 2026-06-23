import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import TrustStrip from "./TrustStrip";
import BrandShowcaseSection from "./BrandShowcaseSection";
import SectionShell from "@/components/ui/SectionShell";
import { CtaButton, SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";
import DiscoverStrip from "./DiscoverStrip";
import WhyAttendSection from "./WhyAttendSection";
import EventTracksSection from "./EventTracksSection";
import SpeakerHighlightsSection from "./SpeakerHighlightsSection";
import type { CmsPartnerCard, CmsSpeakerCard } from "@/lib/cms/types";
import VenueTravelSection from "./VenueTravelSection";
import HomeEducationEcosystemNav from "./HomeEducationEcosystemNav";
import LazySection from "@/components/performance/LazySection";
import SectionSkeleton from "@/components/performance/SectionSkeleton";
import HomePageChrome from "./HomePageChrome";

const NavBar = dynamic(() => import("@/components/layout/NavBar"), {
  loading: () => (
    <div className="h-16 w-full border-b border-slate-200 bg-white/90" aria-hidden />
  ),
});
const Marquees = dynamic(() => import("@/components/layout/Marquees"));
const Footer = dynamic(() => import("@/components/layout/Footer"));
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
}: {
  featuredSpeakers?: CmsSpeakerCard[];
  cmsPartners?: CmsPartnerCard[];
}) {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Marquees />

      <main id="main-content">
        <HeroSection />
        <TrustStrip />
        <BrandShowcaseSection />

        <SectionShell
          background="warm"
          className="px-4 py-8 md:px-8 md:py-10"
          ariaLabel="Programmes and notices"
        >
          <div className="mx-auto max-w-7xl">
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
        </SectionShell>

        <DiscoverStrip />
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ReservedAdSlot slotId="home-mid" />
        </div>

        <LazySection fallback={<SectionSkeleton lines={4} />}>
          <WhyAttendSection />
        </LazySection>
        <LazySection fallback={<SectionSkeleton />}>
          <EventTracksSection />
        </LazySection>

        <LazySection
          minHeight="16rem"
          fallback={
            <div className="mx-auto max-w-7xl">
              <SectionSkeleton lines={4} />
            </div>
          }
        >
          <SectionShell
            background="default"
            className="px-4 py-10 md:px-8 md:py-14"
            ariaLabel="Upcoming events"
          >
            <div className="mx-auto max-w-7xl">
              <GlassCard className="overflow-hidden p-6 md:p-8">
                <UpcomingEvent />
              </GlassCard>
            </div>
          </SectionShell>
        </LazySection>

        <LazySection fallback={<SectionSkeleton />}>
          <SpeakerHighlightsSection speakers={featuredSpeakers} />
        </LazySection>
        <LazySection fallback={<SectionSkeleton lines={4} />}>
          <GallerySection />
        </LazySection>

        <LazySection fallback={<SectionSkeleton />}>
          <VenueTravelSection />
        </LazySection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ReservedAdSlot slotId="home-footer" />
        </div>
        <LazySection fallback={<SectionSkeleton lines={4} />}>
          <HomeFaqSection />
        </LazySection>
        <LazySection fallback={<SectionSkeleton />}>
          <HomeEducationEcosystemNav />
        </LazySection>

        <LazySection minHeight="8rem">
          <PartnersShowcase cmsPartners={cmsPartners} cmsSpeakers={featuredSpeakers} />
        </LazySection>
      </main>

      <Footer />
      <HomePageChrome />
    </div>
  );
}
