"use client";

import {
  ACPage,
  ACHero,
  ACSection,
  ACCard,
  ACGlassPanel,
  ACTimelineStep,
  ACHighlightPanel,
  ACContactBlock,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { awardCategories } from "../academic-content-data";

const DOCUMENT_CHECKLIST = [
  "Proof of publication (first page / DOI link)",
  "ISBN / Patent certificate copies",
  "Grant approval letters",
  "Startup registration proof (if applicable)",
  "Any other supporting documents",
];

const SELECTION_STEPS = [
  "Application Submission",
  "Document Verification",
  "Expert Review Committee Evaluation",
  "Final Selection",
  "Award Declaration",
];

const RECOGNITION_BENEFITS = [
  "Trophy & Certificate of Excellence",
  "National Recognition",
  "Opportunity to present work",
  "Networking with academicians & industry leaders",
];

const TIMELINE = [
  "Call for Applications: To be announced",
  "Last Date: To be announced",
  "Result Declaration: During Shiksha Mahakumbh 2026",
];

export default function AwardsPage() {
  return (
    <ACPage>
      <ACHero
        title="Excellence Awards – Shiksha Mahakumbh 6.0"
        subtitle={
          <p>
            Celebrating outstanding contributions in research, innovation, publications,
            entrepreneurship, and academic excellence.
          </p>
        }
      />

      <ACSection title="Overview">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
            The Excellence Awards at Shiksha Mahakumbh 6.0 aim to recognize and celebrate
            outstanding contributions in the fields of research, innovation, publications, and
            entrepreneurship. These awards honour both faculty members and students who have
            demonstrated excellence and impact in their respective domains.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Award Categories">
        <div className="grid gap-4 md:grid-cols-2">
          <ACCard className="border-l-4 border-l-brand-saffron">
            <h3 className="mb-3 text-lg font-bold text-brand-navy md:text-xl">
              Faculty Excellence Award
            </h3>
            <p className="text-sm leading-relaxed text-gray-700 md:text-base">
              Recognizing outstanding academic and research contributions by faculty members.
            </p>
          </ACCard>
          <ACCard className="border-l-4 border-l-brand-navy">
            <h3 className="mb-3 text-lg font-bold text-brand-navy md:text-xl">
              Student Excellence Award
            </h3>
            <p className="text-sm leading-relaxed text-gray-700 md:text-base">
              Honouring talented students for innovation, research, and creative achievements.
            </p>
          </ACCard>
        </div>
      </ACSection>

      <ACSection title="Levels of Awards">
        <div className="grid gap-4 md:grid-cols-2">
          <ACCard className="text-center">
            <h3 className="text-lg font-bold text-brand-navy md:text-xl">School Level</h3>
          </ACCard>
          <ACCard className="text-center">
            <h3 className="text-lg font-bold text-brand-navy md:text-xl">
              College / University Level
            </h3>
          </ACCard>
        </div>
      </ACSection>

      <ACSection title="Evaluation Categories">
        <div className="space-y-4">
          {awardCategories.map((category, index) => (
            <ACCard key={index} hover={false}>
              <h3 className="mb-4 text-lg font-bold text-brand-navy md:text-xl">
                {index + 1}. {category.title}
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-sm text-gray-700 md:text-base">
                {category.details.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Document Checklist">
        <div className="grid gap-3 sm:grid-cols-2">
          {DOCUMENT_CHECKLIST.map((item, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Selection Process">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {SELECTION_STEPS.map((step, index) => (
            <ACTimelineStep key={index} step={index + 1}>
              {step}
            </ACTimelineStep>
          ))}
        </div>
      </ACSection>

      <ACSection title="Recognition & Benefits">
        <ACHighlightPanel title="Awards & Opportunities">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RECOGNITION_BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-sm md:text-base"
              >
                {benefit}
              </div>
            ))}
          </div>
        </ACHighlightPanel>
      </ACSection>

      <ACSection title="Important Timeline">
        <div className="grid gap-3 md:grid-cols-3">
          {TIMELINE.map((item, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Contact">
        <ACContactBlock />
      </ACSection>

      <ACFooterStatement title="Celebrating Excellence, Inspiring Innovation">
        These awards aim to encourage a culture of research, creativity, and impactful contribution
        in education and society.
      </ACFooterStatement>

      <SectionCTA
        title="Nominate for excellence awards"
        buttonText="Register Now"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
}
