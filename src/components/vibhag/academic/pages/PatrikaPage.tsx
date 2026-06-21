"use client";

import {
  ACPage,
  ACHero,
  ACSection,
  ACCard,
  ACGlassPanel,
  ACObjectiveCard,
  ACTimelineStep,
  ACContactBlock,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import {
  patrikaSections,
  patrikaThemes,
  submissionFormats,
  patrikaBenefits,
} from "../academic-content-data";

const PATRIKA_OBJECTIVES = [
  "Develop research aptitude among school students",
  "Promote critical thinking and analytical skills",
  "Encourage documentation of student projects and ideas",
  "Provide a platform for academic expression and publication",
  "Inspire students towards innovation and knowledge creation",
];

const REVIEW_STEPS = [
  "Submission of entries",
  "Screening for eligibility and originality",
  "Review by subject experts",
  "Selection of best entries",
  "Final publication in Bal Shodh Patrika",
];

const TIMELINE = [
  "Call for Submissions: To be announced",
  "Last Date for Submission: To be announced",
  "Review & Selection: To be announced",
  "Publication & Release: During Shiksha Mahakumbh 2026",
];

const SCHOOL_SUPPORT = [
  "Motivate students for participation",
  "Guide students in research writing",
  "Support documentation and submission",
];

export default function PatrikaPage() {
  return (
    <ACPage>
      <ACHero
        title="Bal Shodh Patrika – Shiksha Mahakumbh 6.0"
        subtitle={
          <p>
            A unique academic initiative designed to nurture research, inquiry, innovation, and
            critical thinking among school students through structured academic publication and
            project-based learning.
          </p>
        }
      />

      <ACSection title="Overview">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
            Bal Shodh Patrika serves as a national platform for young learners to present their
            ideas, research work, and project-based learnings in a structured academic format. This
            initiative bridges the gap between school education and research orientation, encouraging
            students to contribute meaningfully to society through innovation and knowledge creation.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Objectives">
        <div className="grid gap-3 sm:grid-cols-2">
          {PATRIKA_OBJECTIVES.map((objective, index) => (
            <ACObjectiveCard key={index} index={index}>
              {objective}
            </ACObjectiveCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Participation Categories">
        <div className="grid gap-4 md:grid-cols-2">
          {patrikaSections.map((section, index) => (
            <ACCard key={index}>
              <h3 className="mb-3 text-lg font-bold text-brand-navy md:text-xl">
                {section.icon} {section.title}
              </h3>
              <p className="mb-2 font-semibold text-gray-800">{section.classes}</p>
              <p className="text-sm leading-relaxed text-gray-700 md:text-base">{section.focus}</p>
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Themes & Topics">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {patrikaThemes.map((theme, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {theme}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Submission Format">
        <div className="grid gap-3 sm:grid-cols-2">
          {submissionFormats.map((format, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {format}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Review & Selection Process">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {REVIEW_STEPS.map((step, index) => (
            <ACTimelineStep key={index} step={index + 1}>
              {step}
            </ACTimelineStep>
          ))}
        </div>
      </ACSection>

      <ACSection title="Recognition & Benefits">
        <div className="grid gap-3 sm:grid-cols-2">
          {patrikaBenefits.map((benefit, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {benefit}
            </ACCard>
          ))}
        </div>
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

      <ACSection title="Institutional Collaboration">
        <div className="grid gap-3 sm:grid-cols-3">
          {SCHOOL_SUPPORT.map((item, index) => (
            <ACObjectiveCard key={index} index={index}>
              {item}
            </ACObjectiveCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Contact & Support">
        <ACContactBlock />
      </ACSection>

      <ACFooterStatement title="Igniting Young Researchers">
        Bal Shodh Patrika is a step towards building a generation of young thinkers, researchers,
        and innovators who will shape the future of the nation.
      </ACFooterStatement>

      <SectionCTA
        title="Submit to Bal Shodh Patrika"
        buttonText="Register Now"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
}
