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
  culturalHighlights,
  participationGroups,
  culturalObjectives,
  culturalRecognitionBenefits,
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

export default function CulturalPage() {
  return (
    <ACPage>
      <ACHero
        title="Cultural Program – Shiksha Mahakumbh 6.0"
        subtitle={
          <p>
            Celebrating the vibrant spirit of Indian culture, traditions, and creative expression
            through inspiring performances that connect education, sustainability, and heritage.
          </p>
        }
      />

      <ACSection title="Overview">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
            The Cultural Program at Shiksha Mahakumbh 6.0 celebrates the rich diversity of Indian
            traditions and artistic expression. The event will showcase local Himachali culture along
            with theme-based performances that reflect the harmony between education, nature, and
            sustainable development.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Theme">
        <ThemeBanner />
      </ACSection>

      <ACSection title="Key Highlights">
        <div className="grid gap-3 sm:grid-cols-2">
          {culturalHighlights.map((item, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Participation">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {participationGroups.map((group, index) => (
            <ACCard key={index} className="text-center text-sm md:text-base">
              {group}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Opportunities & Recognition">
        <div className="grid gap-3 sm:grid-cols-2">
          {culturalRecognitionBenefits.map((benefit, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {benefit}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Objectives">
        <div className="grid gap-3 sm:grid-cols-2">
          {culturalObjectives.map((objective, index) => (
            <ACObjectiveCard key={index} index={index}>
              {objective}
            </ACObjectiveCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Event Schedule">
        <ACGlassPanel className="text-center">
          <p className="text-base text-gray-700 md:text-lg">
            Cultural programs will be organised during
          </p>
          <p className="mt-3 text-xl font-bold text-brand-navy md:text-2xl">
            9–11 October 2026 | NIT Hamirpur
          </p>
          <p className="mt-2 text-sm text-slate-500">(Detailed schedule to be announced)</p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Contact & Participation">
        <ACContactBlock />
      </ACSection>

      <ACFooterStatement title="Where Culture Meets Consciousness">
        Experience the harmony of tradition, creativity, and sustainability through inspiring
        cultural expressions at Shiksha Mahakumbh 6.0.
      </ACFooterStatement>

      <SectionCTA
        title="Join the cultural programme"
        buttonText="Register Now"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
}
