"use client";

import React from "react";
import {
  ACPage,
  ACHero,
  ACSection,
  ACCard,
  ACGlassPanel,
  ACObjectiveCard,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "./AcademicCouncilUI";

function OverviewPage() {
  return (
    <ACPage>
      <ACHero
        accent="primary"
        title="🎓 Academic Council – Shiksha Mahakumbh 6.0"
        subtitle={
          <p>
            The Academic Backbone of Shiksha Mahakumbh – Integrating Knowledge,
            Innovation, and Impact.
          </p>
        }
      />

      <ACSection title="🌟 Overview">
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

      <ACSection title="🎯 Purpose">
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

      <ACSection title="🧩 Key Functional Domains">
        <p className="mb-4 text-base text-gray-700 md:text-lg">
          The Academic Council governs and coordinates:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "📚 Multi-Track Research Conference",
            "🎓 National & Thematic Conclaves",
            "🧠 Olympiads (School Outreach Programs)",
            "🚀 Student Projects (School & Higher Education)",
            "🌍 Best Practices (Grassroots to Global Models)",
            "🏢 Exhibitions & Knowledge Showcases",
            "📘 Publications & Compendiums (Research, Reports, Journals)",
          ].map((item, i) => (
            <ACCard key={i} className="text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="🌐 Inclusive & Multi-Level Approach">
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

      <ACSection title="⚙️ Core Responsibilities">
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

      <ACSection title="✨ Vision">
        <ACGlassPanel className="border-primary/15 bg-gradient-to-br from-primary/5 to-amber-50/40">
          <p className="text-base leading-relaxed text-gray-800 md:text-lg md:leading-8">
            To build a dynamic, inclusive, and impact-driven academic ecosystem
            that bridges education, research, innovation, and society, and
            contributes meaningfully to the vision of a knowledge-driven,
            self-reliant, and globally leading Bharat.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="🚀 Positioning Line (for brochure highlight)">
        <ACCard hover={false} className="border-amber-200/50 bg-gradient-to-r from-amber-50 to-white text-center">
          <p className="text-lg font-semibold italic text-primary md:text-xl">
            &ldquo;The Academic Backbone of Shiksha Mahakumbh – Integrating
            Knowledge, Innovation, and Impact.&rdquo;
          </p>
        </ACCard>
      </ACSection>

      <SectionCTA
        title="प्रतिभागिता हेतु पंजीकरण करें"
        buttonText="पंजीकरण करें"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
}

export default OverviewPage;
