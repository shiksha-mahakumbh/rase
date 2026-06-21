"use client";

import {
  ACPage,
  ACHero,
  ACSection,
  ACCard,
  ACGlassPanel,
  ACObjectiveCard,
  ACContactBlock,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import {
  exhibitionSegments,
  exhibitionParticipants,
  exhibitionObjectives,
  exhibitionBenefits,
} from "../academic-content-data";

function ThemeBanner() {
  return (
    <ACGlassPanel className="border-brand-saffron/25 bg-gradient-to-br from-brand-navy/5 via-brand-surface-warm to-white text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-saffron-dark">
        Theme
      </p>
      <p className="mt-2 text-lg font-bold text-brand-navy md:text-2xl">
        &ldquo;Shiksha, Prakriti aur Pragati&rdquo;
      </p>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Educating for Development and Harmony with Nature
      </p>
    </ACGlassPanel>
  );
}

export default function ExhibitionPage() {
  return (
    <ACPage>
      <ACHero
        title="Exhibition – Shiksha Mahakumbh 6.0"
        subtitle={
          <p>
            A dynamic showcase of innovation, culture, institutional excellence, and transformative
            ideas bringing together students, universities, organizations, and innovators on one
            platform.
          </p>
        }
      />

      <ACSection title="Overview">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
            The Exhibition at Shiksha Mahakumbh 6.0 serves as a vibrant ecosystem where innovation,
            sustainability, culture, and education come together. Participants will present impactful
            ideas, research, working models, and transformative initiatives aligned with the vision
            of Viksit Bharat 2047.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Theme">
        <ThemeBanner />
      </ACSection>

      <ACSection title="Key Exhibition Segments">
        <div className="grid gap-4 md:grid-cols-2">
          {exhibitionSegments.map((segment, index) => (
            <ACCard key={index}>
              <h3 className="mb-3 text-lg font-bold text-brand-navy md:text-xl">
                {segment.icon} {segment.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                {segment.description}
              </p>
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Participants">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exhibitionParticipants.map((participant, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {participant}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Objectives">
        <div className="grid gap-3 sm:grid-cols-2">
          {exhibitionObjectives.map((objective, index) => (
            <ACObjectiveCard key={index} index={index}>
              {objective}
            </ACObjectiveCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Opportunities & Recognition">
        <div className="grid gap-3 sm:grid-cols-2">
          {exhibitionBenefits.map((benefit, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {benefit}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Exhibition Dates">
        <ACGlassPanel className="text-center">
          <p className="text-xl font-bold text-brand-navy md:text-2xl">
            9–11 October 2026 | NIT Hamirpur
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Participation & Enquiries">
        <ACContactBlock />
      </ACSection>

      <ACFooterStatement title="A Confluence of Ideas & Innovation">
        Explore a vibrant ecosystem where education, innovation, culture, and sustainability come
        together at the Shiksha Mahakumbh 6.0 Exhibition.
      </ACFooterStatement>

      <SectionCTA
        title="Join the exhibition"
        buttonText="Register Now"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
}
