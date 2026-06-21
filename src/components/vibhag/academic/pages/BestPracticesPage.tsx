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
  ACHighlightPanel,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { OpenBestPracticesSection } from "../OpenBestPracticesSection";
import {
  bestPracticeCategories,
  submissionRequirements,
  evaluationCriteria,
  recognitionBenefits,
} from "../academic-content-data";

const INSTITUTIONAL_OBJECTIVES = [
  "Promote innovation and excellence in education practices",
  "Share replicable models across institutions and regions",
  "Encourage community-driven and socially impactful initiatives",
  "Build a repository of best practices aligned with Viksit Bharat 2047",
];

const PROCESS_STEPS = [
  "Call for Submissions",
  "Screening & Shortlisting",
  "Expert Evaluation",
  "Presentation (Selected Entries)",
  "Final Recognition at Shiksha Mahakumbh 6.0",
];

const EXHIBITION_ITEMS = [
  "Exhibition Stalls",
  "Posters & Demonstrations",
  "Live Presentations",
];

export default function BestPracticesPage() {
  return (
    <ACPage>
      <ACHero
        title="Best Practices – Shiksha Mahakumbh 6.0"
        subtitle={
          <p className="font-semibold italic">
            &ldquo;From Grassroots to Global Excellence&rdquo;
          </p>
        }
      />

      <OpenBestPracticesSection />

      <ACSection title="Institutional Best Practices Programme">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
            The Best Practices Initiative at Shiksha Mahakumbh 6.0 aims to
            identify, showcase, and scale innovative, impactful, and replicable
            practices in education, governance, and community engagement. It
            provides a national platform for institutions and individuals to
            present their successful models that contribute towards quality
            education, inclusivity, and sustainable development.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Objectives">
        <div className="grid gap-3 sm:grid-cols-2">
          {INSTITUTIONAL_OBJECTIVES.map((objective, index) => (
            <ACObjectiveCard key={index} index={index}>
              {objective}
            </ACObjectiveCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Categories of Best Practices">
        <div className="grid gap-4 md:grid-cols-2">
          {bestPracticeCategories.map((category, index) => (
            <ACCard key={index}>
              <h3 className="mb-4 text-lg font-bold text-brand-navy md:text-xl">
                {category.icon} {category.title}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 md:text-base">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-2">
                    <span aria-hidden className="text-brand-saffron">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Submission Requirements">
        <div className="grid gap-3 sm:grid-cols-2">
          {submissionRequirements.map((item, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Evaluation Criteria">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {evaluationCriteria.map((criteria, index) => (
            <ACCard key={index} className="text-center text-sm md:text-base">
              {criteria}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Recognition">
        <ACHighlightPanel title="Awards & Opportunities">
          <div className="grid gap-3 sm:grid-cols-2">
            {recognitionBenefits.map((benefit, index) => (
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

      <ACSection title="Process Flow">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {PROCESS_STEPS.map((step, index) => (
            <ACTimelineStep key={index} step={index + 1}>
              {step}
            </ACTimelineStep>
          ))}
        </div>
      </ACSection>

      <ACSection title="Exhibition Opportunity">
        <div className="grid gap-3 sm:grid-cols-3">
          {EXHIBITION_ITEMS.map((item, index) => (
            <ACCard key={index} className="text-center text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Contact">
        <ACContactBlock />
      </ACSection>

      <ACFooterStatement title="From Practice to Policy">
        This initiative aims to transform grassroots innovations into national
        models, creating a strong ecosystem of knowledge sharing and continuous
        improvement in education.
      </ACFooterStatement>

      <SectionCTA
        title="Submit your best practice"
        buttonText="Register & Submit"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
}
