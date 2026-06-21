"use client";

import {
  ACPage,
  ACHero,
  ACSection,
  ACCard,
  ACGlassPanel,
  ACObjectiveCard,
  ACTimelineStep,
  ACHighlightPanel,
  ACContactBlock,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import {
  olympiadCategories,
  olympiadObjectives,
  examFeatures,
  participationSteps,
  olympiadBenefits,
} from "../academic-content-data";

const SCHOOL_ROLES = [
  "Coordinating student registrations",
  "Conducting the Olympiad smoothly",
  "Encouraging maximum participation",
];

const TIMELINE = [
  "Registration Start: To be announced",
  "Exam Dates: To be announced",
  "Result Declaration: To be announced",
  "Felicitation: During Shiksha Mahakumbh 2026 (NIT Hamirpur)",
];

export default function OlympiadPage() {
  return (
    <ACPage>
      <ACHero
        title="DHE Olympiad – Shiksha Mahakumbh 6.0"
        subtitle={
          <p>
            A nationwide academic initiative designed to identify, nurture, and celebrate young
            talent by promoting academic excellence, analytical thinking, and healthy competition
            among students.
          </p>
        }
      />

      <ACSection title="Overview">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
            The DHE Olympiad under Shiksha Mahakumbh 6.0 provides students across India with an
            opportunity to test their knowledge, strengthen conceptual understanding, and compete
            at a national level. Conducted directly within schools, the Olympiad ensures maximum
            participation and encourages a culture of academic excellence.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Objectives">
        <div className="grid gap-3 sm:grid-cols-2">
          {olympiadObjectives.map((objective, index) => (
            <ACObjectiveCard key={index} index={index}>
              {objective}
            </ACObjectiveCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Olympiad Categories">
        <div className="grid gap-4 md:grid-cols-3">
          {olympiadCategories.map((category, index) => (
            <ACCard key={index}>
              <h3 className="mb-3 text-lg font-bold text-brand-navy md:text-xl">
                {category.icon} {category.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                {category.description}
              </p>
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Eligibility">
        <ACGlassPanel className="border-brand-navy/15 bg-gradient-to-br from-brand-navy/5 to-brand-surface-warm text-center">
          <p className="text-base font-medium text-brand-navy md:text-lg">
            Students from Classes 3 to 10
          </p>
          <p className="mt-2 text-sm text-slate-600 md:text-base">
            Participation through respective schools
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Format of Examination">
        <div className="grid gap-3 sm:grid-cols-2">
          {examFeatures.map((feature, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {feature}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Participation Process">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {participationSteps.map((step, index) => (
            <ACTimelineStep key={index} step={index + 1}>
              {step}
            </ACTimelineStep>
          ))}
        </div>
      </ACSection>

      <ACSection title="Recognition & Awards">
        <ACHighlightPanel title="Honours & Felicitation">
          <div className="grid gap-3 sm:grid-cols-2">
            {olympiadBenefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm md:text-base"
              >
                {benefit}
              </div>
            ))}
          </div>
        </ACHighlightPanel>
      </ACSection>

      <ACSection title="Timeline">
        <div className="grid gap-3 sm:grid-cols-2">
          {TIMELINE.map((item, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="School Participation">
        <div className="grid gap-3 sm:grid-cols-3">
          {SCHOOL_ROLES.map((item, index) => (
            <ACObjectiveCard key={index} index={index}>
              {item}
            </ACObjectiveCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Contact & Support">
        <ACContactBlock />
      </ACSection>

      <ACFooterStatement title="Empowering Young Minds">
        The DHE Olympiad is not just an examination, but a journey towards building confident,
        capable, and future-ready students for a stronger Bharat.
      </ACFooterStatement>

      <SectionCTA
        title="Register for the Olympiad"
        buttonText="Register Now"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
}
