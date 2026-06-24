import { CtaButton, SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import Announcement from "./sections/Announcement";
import NoticeBoard from "./sections/NoticeBoard";
import HomeEditionCta from "./HomeEditionCta";

/** Programmes grid — client widgets (framer-motion accordion) isolated in one lazy chunk. */
export default function ProgrammesNoticesSection() {
  return (
    <section
      id="programmes"
      aria-label="Programmes and notices"
      className="relative overflow-hidden home-section-warm px-4 py-8 md:px-8 md:py-10"
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
      </div>
    </section>
  );
}
