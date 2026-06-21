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
import { projectThemes, projectBenefits } from "../academic-content-data";

const PROJECT_OBJECTIVES = [
  "Promote innovation-driven learning",
  "Encourage research and practical application",
  "Identify and nurture young talent",
  "Provide a national platform for showcasing ideas",
  "Connect students with experts, mentors, and institutions",
];

const SUBMISSION_ITEMS = [
  "Project Abstract (200–300 words)",
  "Detailed Report / Documentation",
  "Short Video Demonstration (2–5 minutes)",
  "Images / Prototype (if available)",
];

const SELECTION_STEPS = [
  "Registration & Submission",
  "Initial Screening",
  "Expert Review & Evaluation",
  "Shortlisting of Top Projects",
  "Final Showcase at Shiksha Mahakumbh 6.0",
];

const TIMELINE = [
  "Topic Finalization: To be announced",
  "Registration Start: To be announced",
  "Submission Deadline: To be announced",
  "Final Showcase: 9–11 October 2026 (NIT Hamirpur)",
];

const COLLABORATORS = [
  "IITs / NITs / Central Universities",
  "Research Institutions",
  "Industry Experts & Mentors",
];

export default function ProjectsPage() {
  return (
    <ACPage>
      <ACHero
        title="Student Projects – Shiksha Mahakumbh 6.0"
        subtitle={
          <p>
            A national-level innovation platform designed to nurture creativity, research, and
            problem-solving skills among students while contributing towards{" "}
            <span className="font-semibold">Viksit Bharat 2047</span>.
          </p>
        }
      />

      <ACSection title="Overview">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
            The Student Projects Initiative under Shiksha Mahakumbh 6.0 provides students from
            schools and higher education institutions with a platform to present innovative ideas,
            prototypes, and impactful working models that address real-world challenges. This
            initiative bridges the gap between academic learning and practical implementation.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Objectives">
        <div className="grid gap-3 sm:grid-cols-2">
          {PROJECT_OBJECTIVES.map((item, index) => (
            <ACObjectiveCard key={index} index={index}>
              {item}
            </ACObjectiveCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Participation Categories">
        <div className="grid gap-4 md:grid-cols-2">
          <ACCard className="border-t-4 border-t-brand-saffron">
            <h3 className="mb-3 text-lg font-bold text-brand-navy md:text-xl">School Level</h3>
            <p className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">Classes:</span> 6–10
            </p>
            <p className="text-sm leading-relaxed text-gray-700 md:text-base">
              Focus on basic innovation, creative models, practical ideas, and problem-solving
              concepts.
            </p>
          </ACCard>
          <ACCard className="border-t-4 border-t-brand-navy">
            <h3 className="mb-3 text-lg font-bold text-brand-navy md:text-xl">College Level</h3>
            <p className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">Eligibility:</span> UG / PG Students
            </p>
            <p className="text-sm leading-relaxed text-gray-700 md:text-base">
              Focus on advanced projects, research-based solutions, prototypes, and emerging
              technologies.
            </p>
          </ACCard>
        </div>
      </ACSection>

      <ACSection title="Themes & Domains">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {projectThemes.map((theme, index) => (
            <ACCard key={index} className="text-center text-sm font-medium md:text-base">
              {theme}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Project Submission Guidelines">
        <div className="grid gap-3 sm:grid-cols-2">
          {SUBMISSION_ITEMS.map((item, index) => (
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projectBenefits.map((benefit, index) => (
            <ACCard key={index} className="text-sm md:text-base">
              {benefit}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Important Timeline">
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
          {COLLABORATORS.map((item, index) => (
            <ACCard key={index} className="text-center text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
        <p className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg">
          Institutions are encouraged to adopt and refine promising student projects for further
          development and innovation.
        </p>
      </ACSection>

      <ACSection title="Contact & Support">
        <ACContactBlock />
      </ACSection>

      <ACFooterStatement title="Be the Innovator of Tomorrow">
        Transform your ideas into impactful solutions and become a part of India&apos;s largest
        academic innovation movement.
      </ACFooterStatement>

      <SectionCTA
        title="Submit your student project"
        buttonText="Register & Submit"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
}
