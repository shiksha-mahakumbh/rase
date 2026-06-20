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
import { tracks } from "../tracks-data";
import OverviewPage from "../AcademicCouncilOverview";
import { OpenBestPracticesSection } from "../OpenBestPracticesSection";

import { conclaves } from "../academic-content-data";

export default function ConclavePage() {
  return (
    <ACPage>
      <ACHero
        title="🎓 Conclaves – Shiksha Mahakumbh 6.0"
      />

      <ACSection title="🌟 Overview">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
            The Conclaves at Shiksha Mahakumbh 6.0 serve as high-impact dialogue
            platforms bringing together leaders from academia, research,
            governance, industry, and society. These thematic conclaves aim to
            foster policy discussions, innovation exchange, and actionable
            outcomes aligned with the vision of Viksit Bharat 2047.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="🧩 Conclave Categories">
        <div className="space-y-4">
          {conclaves.map((conclave, index) => (
            <ACCard key={index}>
              <h3 className="mb-4 text-lg font-bold text-purple-700 md:text-xl">
                🧩 {index + 1}. {conclave.icon} {conclave.title}
              </h3>
              <div className="space-y-3 text-sm leading-relaxed text-gray-700 md:text-base">
                <p>
                  <span className="font-semibold">Participants:</span>{" "}
                  {conclave.participants}
                </p>
                <p>
                  <span className="font-semibold">Focus:</span> {conclave.focus}
                </p>
                <p>
                  <span className="font-semibold">Output:</span> {conclave.output}
                </p>
                <p>
                  <span className="font-semibold">Theme:</span> {conclave.theme}
                </p>
                <p>
                  <span className="font-semibold">Coordinators:</span>{" "}
                  {conclave.coordinators}
                </p>
              </div>
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="🧭 Leadership & Coordination">
        <ACGlassPanel>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-3">
                🔹 Chair
              </h3>

              <p className="text-gray-700 text-lg">
                Dr. Praveen Kumar Sharma
                <br />
                Plaksha University, Mohali
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-3">
                🔹 Co-Chairs
              </h3>

              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Dr. Sujeet Thakur, IIT Delhi</li>
                <li>Prof. Y. D. Sharma, NIT Hamirpur</li>
                <li>Dr. Rajeshwar Banshtu, NIT Hamirpur</li>
                <li>
                  Dr. Jatinder Garg,
                  Central University of Himachal Pradesh
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-3">
                🔹 Conveners
              </h3>

              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Dr. Vipin Jain, CBLU Bhiwani</li>
                <li>Registrar, NIT Hamirpur</li>
                <li>Registrar, IIT Mandi</li>
                <li>
                  Registrar,
                  Central University of Himachal Pradesh
                </li>
              </ul>
            </div>
          </div>
        </ACGlassPanel>
      </ACSection>

      <ACFooterStatement title="✨ Driving Dialogue to Action">
        Each conclave is designed to move beyond discussions and generate
        practical frameworks, policy inputs, and collaborative pathways that
        contribute to shaping the future of education in India.
      </ACFooterStatement>

      <SectionCTA buttonText="आवेदन करें" href={REG_LINKS.conclave} />
    </ACPage>
  );
}
// ─── INDIVIDUAL PAGES ────────────────────────────────────────────────────────

// ... (Keep your existing ConferencePage and ConclavePage)

// ─── INDIVIDUAL PAGES ────────────────────────────────────────────────────────

// Keep your ConferencePage and ConclavePage as they are...


const awardCategories = [
  {
    title: "Research Publications",
    details: [
      "Journal Name",
      "Paper Title",
      "Impact Factor",
      "Indexing (Scopus / SCI / UGC Care / etc.)",
      "Year of Publication",
    ],
  },
  {
    title: "Books & Book Chapters",
    details: [
      "Book Title / Chapter Title",
      "Publisher Name",
      "ISBN Number",
      "Year of Publication",
    ],
  },
  {
    title: "Patents",
    details: [
      "Patent Title",
      "Patent Number",
      "Patent Office",
      "Status (Filed / Published / Granted)",
      "Date of Grant (if applicable)",
    ],
  },
  {
    title: "Startups / Innovations",
    details: [
      "Name of Startup / Innovation",
      "Brief Description",
      "Registration Details (if any)",
      "Impact / Outcome",
    ],
  },
  {
    title: "Research Projects / Grants",
    details: [
      "Project Title",
      "Funding Agency",
      "Grant Amount",
      "Duration",
      "Status (Ongoing / Completed)",
    ],
  },
];

