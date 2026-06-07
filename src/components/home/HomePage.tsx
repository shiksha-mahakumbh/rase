"use client";

import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import Marquees from "@/app/component/Marquees";
import Conference_Support from "@/app/component/Conference_Support";
import Media_Partners from "@/app/component/Media_Partners";
import Organiger from "@/app/component/organiger";
import UpcomingEvent from "@/app/component/UpcomingEvent";
import { CustomCard } from "@/app/component/card";
import Announcement from "@/app/component/Annoucement";
import NoticeBoard from "@/app/component/NoticeBoard";
import SectionShell from "@/app/component/home/SectionShell";
import GlassCard from "@/app/component/home/GlassCard";
import HeroSection from "./HeroSection";
import TrustStrip from "./TrustStrip";
import WhyAttendSection from "./WhyAttendSection";
import MovementTimelineSection from "./MovementTimelineSection";
import WhoShouldAttendSection from "./WhoShouldAttendSection";
import EventTracksSection from "./EventTracksSection";
import SpeakerHighlightsSection from "./SpeakerHighlightsSection";
import TestimonialsSection from "./TestimonialsSection";
import GallerySection from "./GallerySection";
import VenueTravelSection from "./VenueTravelSection";
import HomeFaqSection from "./HomeFaqSection";
import DiscoverStrip from "./DiscoverStrip";
import StickyRegisterBar from "./StickyRegisterBar";
import FloatingActionButton from "./FloatingActionButton";
import { CtaButton, SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";
import HomeEducationEcosystemNav from "./HomeEducationEcosystemNav";

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
          </div>
        </SectionShell>

        <DiscoverStrip />
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ReservedAdSlot slotId="home-mid" />
        </div>
        <WhyAttendSection />
        <MovementTimelineSection />
        <WhoShouldAttendSection />
        <EventTracksSection />

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

        <SpeakerHighlightsSection />
        <TestimonialsSection />
        <GallerySection />

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

        <VenueTravelSection />
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ReservedAdSlot slotId="home-footer" />
        </div>
        <HomeFaqSection />
        <HomeEducationEcosystemNav />

        <Conference_Support />
        <Media_Partners />
        <Organiger />
      </main>

      <Footer />
      <StickyRegisterBar />
      <FloatingActionButton />
    </div>
  );
}
