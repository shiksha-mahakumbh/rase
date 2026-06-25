"use client";

import {
  ACPage,
  ACHero,
  ACSection,
  ACCard,
  ACGlassPanel,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { ACADEMIC_PUBLICATION_NOTE } from "@/data/academic-council-tracks";
import { CMT_SUBMISSION_URL, cmtSubmissionDateLabel } from "@/lib/registration/config";
import { tracks } from "../tracks-data";

export default function ConferencePage() {
  return (
    <ACPage>
      <ACHero title="Multi-Track Conference – Shiksha Mahakumbh 6.0" />

      <ACSection title="Overview">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
            Shiksha Mahakumbh 6.0 (6th Edition) will host a Hybrid Multi-Track International
            Conference, bringing together researchers, academicians, industry experts, and scholars
            to present original research, participate in plenary talks, workshops, and engage in
            cross-disciplinary dialogue aligned with Viksit Bharat 2047.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Overall Conference Coordination">
        <ACGlassPanel>
          <p className="mb-4 text-sm leading-relaxed text-gray-600 md:text-base">
            The leadership below coordinates the conference as a whole. Each of the 15 tracks has
            its own chair, co-chair, and convenor — listed in the Conference Tracks section.
          </p>
          <div className="space-y-6 text-sm text-gray-700 md:text-base">
            <div>
              <h3 className="mb-2 text-lg font-bold text-brand-navy md:text-xl">Chair</h3>
              <p>Prof. Brahmjit Singh, NIT Kurukshetra</p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-brand-navy md:text-xl">Co-Chairs</h3>
              <p>
                Dr. Vikash Kumar Garg, Prof. R. K. Sehgal, Prof. Raman Parti, Prof. Sushil Chauhan,
                Prof. Ravi Ranade, Dr. Chander Prakash
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-brand-navy md:text-xl">Conveners</h3>
              <p>
                Dr. Pankaj Verma, Dr. Gaurav, Dr. Tarun, Dr. T. P. Sharma, Dr. Ramesh Vats
              </p>
            </div>
          </div>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Submission via Microsoft CMT">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ACCard>
            <p className="mb-2 text-sm text-gray-500">Paper Length</p>
            <p className="text-lg font-bold md:text-xl">5–6 pages (IEEE Format)</p>
          </ACCard>
          <ACCard>
            <p className="mb-2 text-sm text-gray-500">Similarity Index</p>
            <p className="text-lg font-bold md:text-xl">Below 15%</p>
          </ACCard>
          <ACCard>
            <p className="mb-2 text-sm text-gray-500">Format</p>
            <p className="text-lg font-bold md:text-xl">PDF submission via CMT Portal</p>
          </ACCard>
        </div>
        <p className="mt-4 text-sm text-brand-navy">
          All abstracts and full-length papers are submitted through the{" "}
          <a
            href={CMT_SUBMISSION_URL}
            className="font-semibold underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Multi Track Conference (CMT) portal
          </a>
          .
        </p>
      </ACSection>

      <ACSection title="Important Dates">
        <div className="grid gap-3 md:grid-cols-2">
          <ACCard>CMT submissions: {cmtSubmissionDateLabel()}</ACCard>
          <ACCard>Acceptance Notification: 31 July 2026</ACCard>
          <ACCard>Final manuscript deadline: 31 August 2026</ACCard>
          <ACCard>Registration Deadline: 31 August 2026</ACCard>
        </div>
      </ACSection>

      <ACSection title="Conference Tracks">
        <div className="space-y-4">
          {tracks.map((track, index) => (
            <ACCard key={index}>
              <h3 className="mb-3 text-lg font-bold text-brand-navy md:text-xl">
                {index + 1}. {track.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                {track.details}
              </p>
              <div className="space-y-1 text-sm text-gray-700 md:text-base">
                <p>
                  <span className="font-semibold">Chair:</span> {track.chair}
                </p>
                <p>
                  <span className="font-semibold">Co-Chair:</span> {track.coChair}
                </p>
                <p>
                  <span className="font-semibold">Convenor:</span> {track.convenor}
                </p>
              </div>
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="Registration Fees">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ACCard>Students (UG/PG/PhD): ₹500</ACCard>
          <ACCard>Research Scholars: ₹1,000</ACCard>
          <ACCard>Academia & R&D: ₹2,100</ACCard>
          <ACCard>Industry: ₹5,000</ACCard>
          <ACCard>International Delegates: Free (with DHE Membership)</ACCard>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-700 md:text-base">
          <p>Includes Lunch, Kit & Certificate (one author)</p>
          <p>Additional Author: ₹500</p>
        </div>
      </ACSection>

      <ACSection title="Publication & Review">
        <ACGlassPanel className="border-brand-navy/10 bg-gradient-to-br from-brand-navy/5 to-white">
          <div className="space-y-3 text-base text-gray-700 md:text-lg">
            <p>{ACADEMIC_PUBLICATION_NOTE}</p>
            <p>Peer-reviewed Open Access Journal (ISSN) options may apply for selected tracks.</p>
          </div>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="Awards">
        <ACCard
          hover={false}
          className="border-brand-saffron/30 bg-gradient-to-r from-brand-saffron to-brand-saffron-dark text-center text-brand-navy"
        >
          <p className="text-xl font-bold md:text-2xl">Track-wise Best Paper Award</p>
        </ACCard>
      </ACSection>

      <ACSection title="Submission">
        <div className="space-y-2 text-base text-gray-700 md:text-lg">
          <p>CMT Portal (Primary Submission)</p>
          <p>Backup Email (if required)</p>
          <p>Website: www.shikshamahakumbh.com</p>
        </div>
      </ACSection>

      <ACFooterStatement title="Advancing Research to Impact">
        This conference aims to transform ideas into innovation and research into real-world
        impact, fostering collaboration across disciplines for a future-ready Bharat.
      </ACFooterStatement>

      <SectionCTA
        title="Submit your research paper"
        buttonText="Register & Submit"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
}
