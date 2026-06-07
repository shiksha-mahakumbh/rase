import dynamic from "next/dynamic";
import NavBar from "@/app/component/NavBar";
import HeroSection from "./HeroSection";
import TrustStrip from "./TrustStrip";
import SectionShell from "@/app/component/home/SectionShell";
import { CtaButton, SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";
import DiscoverStrip from "./DiscoverStrip";
import WhyAttendSection from "./WhyAttendSection";
import MovementTimelineSection from "./MovementTimelineSection";
import WhoShouldAttendSection from "./WhoShouldAttendSection";
import EventTracksSection from "./EventTracksSection";
import SpeakerHighlightsSection from "./SpeakerHighlightsSection";
import VenueTravelSection from "./VenueTravelSection";
import HomeEducationEcosystemNav from "./HomeEducationEcosystemNav";
import LazySection from "@/components/performance/LazySection";
import SectionSkeleton from "@/components/performance/SectionSkeleton";

const Marquees = dynamic(() => import("@/app/component/Marquees"));
const Footer = dynamic(() => import("@/app/component/Footer"));
const Announcement = dynamic(() => import("@/app/component/Annoucement"));
const NoticeBoard = dynamic(() => import("@/app/component/NoticeBoard"));
const GlassCard = dynamic(() => import("@/app/component/home/GlassCard"));
const UpcomingEvent = dynamic(() => import("@/app/component/UpcomingEvent"));
const TestimonialsSection = dynamic(() => import("./TestimonialsSection"));
const GallerySection = dynamic(() => import("./GallerySection"));
const HomeFaqSection = dynamic(() => import("./HomeFaqSection"));
const CustomCard = dynamic(() =>
  import("@/app/component/card").then((m) => ({ default: m.CustomCard }))
);
const ConferenceSupport = dynamic(() => import("@/app/component/Conference_Support"));
const MediaPartners = dynamic(() => import("@/app/component/Media_Partners"));
const Organiger = dynamic(() => import("@/app/component/organiger"));
import HomePageChrome from "./HomePageChrome";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <Marquees />

      <main id="main-content">
        <HeroSection />
        <TrustStrip />

        <SectionShell
          background="cool"
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
                  <GlassCard className="flex h-full flex-col justify-center p-6">
                    <p className="text-sm font-semibold text-brand-saffron">6th Edition</p>
                    <p className="mt-2 text-lg font-bold text-brand-navy">
                      NIT Hamirpur · 9–11 Oct 2026
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Multi-track conclaves, olympiads, research, exhibitions, and awards.
                    </p>
                    <div className="mt-4">
                      <CtaButton href={ROUTES.academicCouncil} variant="ghost">
                        View full programme
                      </CtaButton>
                    </div>
                  </GlassCard>
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
        <LazySection fallback={<SectionSkeleton lines={5} />}>
          <MovementTimelineSection />
        </LazySection>
        <LazySection fallback={<SectionSkeleton />}>
          <WhoShouldAttendSection />
        </LazySection>
        <LazySection fallback={<SectionSkeleton />}>
          <EventTracksSection />
        </LazySection>

        <LazySection
          minHeight="16rem"
          fallback={<div className="mx-auto max-w-7xl"><SectionSkeleton lines={4} /></div>}
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
          <SpeakerHighlightsSection />
        </LazySection>
        <LazySection fallback={<SectionSkeleton />}>
          <TestimonialsSection />
        </LazySection>
        <LazySection fallback={<SectionSkeleton lines={4} />}>
          <GallerySection />
        </LazySection>

        <LazySection fallback={<SectionSkeleton lines={4} />}>
          <SectionShell
            background="default"
            className="px-4 py-10 md:px-8 md:py-14"
            ariaLabel="Edition highlights"
          >
            <div className="mx-auto max-w-7xl">
              <SectionHeader
                eyebrow="Research & Publications"
                title="Edition Highlights"
                description="Proceedings and outcomes from past Mahakumbh editions."
              />
              <CustomCard />
            </div>
          </SectionShell>
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
          <ConferenceSupport />
          <MediaPartners />
          <Organiger />
        </LazySection>
      </main>

      <Footer />
      <HomePageChrome />
    </div>
  );
}
