"use client";

import {
  ACPage,
  ACHero,
  ACSection,
  ACCard,
  ACGlassPanel,
  ACFooterStatement,
  SectionCTA,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { conclaves } from "../academic-content-data";

export default function ConclavePage() {
  return (
    <ACPage>
      <ACHero title="Conclaves – Shiksha Mahakumbh 6.0" />

      <ACSection title="Overview">
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

      <ACSection title="Conclave Categories">
        <div className="space-y-4">
          {conclaves.map((conclave, index) => (
            <ACCard key={index}>
              <h3 className="mb-4 text-lg font-bold text-brand-navy md:text-xl">
                {index + 1}. {conclave.icon} {conclave.title}
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

      <ACSection title="Leadership & Coordination">
        <ACGlassPanel>
          <div className="space-y-8">
            <div>
              <h3 className="mb-2 text-lg font-bold text-brand-navy md:text-xl">
                Chair
              </h3>
              <p className="text-gray-700 md:text-lg">
                Dr. Praveen Kumar Sharma
                <br />
                Plaksha University, Mohali
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-brand-navy md:text-xl">
                Co-Chairs
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>Dr. Sujeet Thakur, IIT Delhi</li>
                <li>Prof. Y. D. Sharma, NIT Hamirpur</li>
                <li>Dr. Rajeshwar Banshtu, NIT Hamirpur</li>
                <li>Dr. Jatinder Garg, Central University of Himachal Pradesh</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-bold text-brand-navy md:text-xl">
                Conveners
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                <li>Dr. Vipin Jain, CBLU Bhiwani</li>
                <li>Registrar, NIT Hamirpur</li>
                <li>Registrar, IIT Mandi</li>
                <li>Registrar, Central University of Himachal Pradesh</li>
              </ul>
            </div>
          </div>
        </ACGlassPanel>
      </ACSection>

      <ACFooterStatement title="Driving Dialogue to Action">
        Each conclave is designed to move beyond discussions and generate
        practical frameworks, policy inputs, and collaborative pathways that
        contribute to shaping the future of education in India.
      </ACFooterStatement>

      <SectionCTA
        title="Apply for the conclave"
        buttonText="Register Now"
        href={REG_LINKS.conclave}
      />
    </ACPage>
  );
}
