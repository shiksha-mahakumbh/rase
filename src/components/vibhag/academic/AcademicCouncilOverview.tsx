"use client";

import React from "react";
import {
  ACPage,
  ACSection,
  ACCard,
  ACGlassPanel,
  ACObjectiveCard,
  SectionCTA,
  REG_LINKS,
} from "./AcademicCouncilUI";
import AcademicProgrammeHub from "./AcademicProgrammeHub";
import { AuthoritySections } from "@/components/authority";
import type { AcademicCouncilTabId } from "@/data/academic-council-content";

interface OverviewPageProps {
  onNavigate: (tabId: AcademicCouncilTabId) => void;
}

const FUNCTIONAL_DOMAINS: { label: string; tabId: AcademicCouncilTabId }[] = [
  { label: "Multi-Track Research Conference", tabId: "ConferencePage" },
  { label: "National & Thematic Conclaves", tabId: "ConclavePage" },
  { label: "Excellence Awards", tabId: "AwardsPage" },
  { label: "Olympiads (School Outreach Programs)", tabId: "OlympiadPage" },
  { label: "Student Projects (School & Higher Education)", tabId: "ProjectsPage" },
  { label: "Best Practices (Grassroots to Global Models)", tabId: "BestPracticesPage" },
  { label: "Exhibitions & Knowledge Showcases", tabId: "ExhibitionPage" },
  { label: "Publications & Compendiums (Research, Reports, Journals)", tabId: "PatrikaPage" },
  { label: "Cultural Programmes", tabId: "CulturalPage" },
];

function OverviewPage({ onNavigate }: OverviewPageProps) {
  return (
    <>
      <ACPage>
        <AcademicProgrammeHub onNavigate={onNavigate} />

        <ACSection title="About the Academic Council">
          <ACGlassPanel>
            <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
              The Academic Council of Shiksha Mahakumbh 6.0 serves as the central
              intellectual and strategic body responsible for designing, guiding,
              and overseeing all academic, research, and knowledge-driven
              initiatives under the Mahakumbh.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
              It integrates diverse platforms such as Multi-Track Conference,
              Conclaves, Olympiads, Student Projects, Best Practices, Exhibitions,
              and Knowledge Publications into a unified framework aimed at
              transforming ideas into impact.
            </p>
          </ACGlassPanel>
        </ACSection>

        <ACSection title="Purpose">
          <p className="mb-4 text-base text-gray-700 md:text-lg">
            The Council ensures that every initiative under Shiksha Mahakumbh
            maintains:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ACObjectiveCard index={0}>
              Academic rigor and research excellence
            </ACObjectiveCard>
            <ACObjectiveCard index={1}>
              Practical relevance and real-world impact
            </ACObjectiveCard>
            <ACObjectiveCard index={2}>
              Inclusivity across all sections of society
            </ACObjectiveCard>
            <ACObjectiveCard index={3}>
              Alignment with national priorities and Viksit Bharat 2047 vision
            </ACObjectiveCard>
          </div>
        </ACSection>

        <ACSection title="Key Functional Domains">
          <p className="mb-4 text-base text-gray-700 md:text-lg">
            The Academic Council governs and coordinates — select a programme to
            explore:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {FUNCTIONAL_DOMAINS.map(({ label, tabId }) => (
              <button
                key={tabId}
                type="button"
                onClick={() => onNavigate(tabId)}
                className="group w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
              >
                <ACCard className="text-sm transition group-hover:border-brand-saffron/40 md:text-base">
                  <span className="font-medium text-brand-navy">{label}</span>
                  <span className="mt-1 block text-xs font-semibold text-brand-saffron-dark">
                    View programme →
                  </span>
                </ACCard>
              </button>
            ))}
          </div>
        </ACSection>

        <ACSection title="Inclusive & Multi-Level Approach">
          <p className="mb-4 text-base text-gray-700 md:text-lg">
            The Council embraces a holistic and inclusive academic ecosystem,
            engaging:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Universities, Colleges & Schools",
              "Researchers, Scientists & Educators",
              "Startups, Industry & Entrepreneurs",
              "NGOs, CSR Bodies & Social Organizations",
              "Students (School to PhD Level)",
              "Grassroots Innovators & Individual Contributors",
              "National & International Participants",
            ].map((item, i) => (
              <ACCard key={i} className="text-sm md:text-base">
                {item}
              </ACCard>
            ))}
          </div>
        </ACSection>

        <ACSection title="Core Responsibilities">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Designing themes, tracks, and academic frameworks",
              "Ensuring quality control through review and evaluation systems",
              "Facilitating interdisciplinary collaboration",
              "Guiding publications, journals, and research outputs",
              "Supporting innovation, policy dialogue, and knowledge exchange",
              "Creating measurable academic and societal outcomes",
            ].map((item, i) => (
              <ACObjectiveCard key={i} index={i}>
                {item}
              </ACObjectiveCard>
            ))}
          </div>
        </ACSection>

        <ACSection title="Vision">
          <ACGlassPanel className="border-brand-navy/15 bg-gradient-to-br from-brand-navy/5 to-brand-surface-warm">
            <p className="text-base leading-relaxed text-gray-800 md:text-lg md:leading-8">
              To build a dynamic, inclusive, and impact-driven academic ecosystem
              that bridges education, research, innovation, and society, and
              contributes meaningfully to the vision of a knowledge-driven,
              self-reliant, and globally leading Bharat.
            </p>
          </ACGlassPanel>
        </ACSection>

        <SectionCTA
          title="Ready to participate"
          buttonText="Register Now"
          href={REG_LINKS.general}
        />
      </ACPage>

      <AuthoritySections sections={["research", "institutions", "government"]} />
    </>
  );
}

export default OverviewPage;
