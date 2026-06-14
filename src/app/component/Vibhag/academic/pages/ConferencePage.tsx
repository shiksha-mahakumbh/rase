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


export default function ConferencePage() {
  return (
    <ACPage>
      <ACHero
        accent="indigo"
        title="📚 Multi-Track Conference – Shiksha Mahakumbh 6.0"
      />

      <ACSection title="🌟 Overview">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg md:leading-8">
            Shiksha Mahakumbh 2026 (6th Edition) will host a Hybrid Multi-Track
            International Conference, bringing together researchers, academicians,
            industry experts, and scholars to present original research,
            participate in plenary talks, workshops, and engage in
            cross-disciplinary dialogue aligned with Viksit Bharat 2047.
          </p>
        </ACGlassPanel>
      </ACSection>

      {/* Leadership */}
      <ACSection title="🧭 Conference Leadership">
        <ACGlassPanel>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-bold text-indigo-700 md:text-xl">
                🎯 Chair
              </h3>
              <p>Prof. Brahmjit Singh, NIT Kurukshetra</p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-indigo-700 md:text-xl">
                🔹 Co-Chairs
              </h3>
              <p>
                Dr. Vikash Kumar Garg, Prof. R. K. Sehgal, Prof. Raman Parti,
                Prof. Sushil Chauhan, Prof. Ravi Ranade, Dr. Chander Prakash
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-bold text-indigo-700 md:text-xl">
                🔹 Conveners
              </h3>
              <p>
                Dr. Pankaj Verma, Dr. Gaurav, Dr. Tarun, Dr. T. P. Sharma, Dr.
                Ramesh Vats
              </p>
            </div>
          </div>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="📢 Multi Track Conference">
        <h3 className="mb-4 text-lg font-semibold text-indigo-700">
          📝 Submission via Microsoft CMT
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ACCard>
            <p className="text-sm text-gray-500 mb-2">📄 Paper Length</p>
            <h3 className="text-lg font-bold md:text-xl">
              5–6 pages (IEEE Format)
            </h3>
          </ACCard>
          <ACCard>
            <p className="text-sm text-gray-500 mb-2">📊 Similarity Index</p>
            <h3 className="text-lg font-bold md:text-xl">Below 15%</h3>
          </ACCard>
          <ACCard>
            <p className="text-sm text-gray-500 mb-2">📤 Format</p>
            <h3 className="text-lg font-bold md:text-xl">
              PDF submission via CMT Portal
            </h3>
          </ACCard>
        </div>
        <p className="mt-4 text-sm text-indigo-800">
          All abstracts and full-length papers are submitted through the{" "}
          <a
            href="https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/"
            className="font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Multi Track Conference (CMT) portal
          </a>
          .
        </p>
      </ACSection>

      <ACSection title="📅 Important Dates">
        <div className="grid gap-3 md:grid-cols-2">
          <ACCard>📌 CMT submission opens: 30 June 2026</ACCard>
          <ACCard>📌 Acceptance Notification: 31 July 2026</ACCard>
          <ACCard>📌 Final manuscript deadline: 31 August 2026</ACCard>
          <ACCard>📌 Registration Deadline: 31 August 2026</ACCard>
        </div>
      </ACSection>

      <ACSection title="🧩 Conference Tracks">
        <div className="space-y-4">
          {tracks.map((track, index) => {
            const trackEmojis = [
              "🔬", "⚙️", "💼", "🌍", "📖", "🎓", "💻", "🏥", "🧘", "🌾",
              "🌱", "🎭", "🌐", "🛠", "🕉",
            ];
            return (
              <ACCard key={index}>
                <h3 className="mb-3 text-lg font-bold text-indigo-700 md:text-xl">
                  {trackEmojis[index] ?? "📚"} {index + 1}. {track.title}
                </h3>
                <p className="mb-4 leading-relaxed text-gray-700">{track.details}</p>
                <div className="space-y-1 text-sm text-gray-700 md:text-base">
                  <p>
                    <span className="font-semibold">Chair:</span> {track.chair}
                  </p>
                  <p>
                    <span className="font-semibold">Co-Chair:</span>{" "}
                    {track.coChair}
                  </p>
                  <p>
                    <span className="font-semibold">Convenor:</span>{" "}
                    {track.convenor}
                  </p>
                </div>
              </ACCard>
            );
          })}
        </div>
      </ACSection>

      <ACSection title="💰 Registration Fees">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ACCard>🎓 Students (UG/PG/PhD): ₹500</ACCard>
          <ACCard>🔬 Research Scholars: ₹1,000</ACCard>
          <ACCard>🏫 Academia & R&D: ₹2,100</ACCard>
          <ACCard>🏢 Industry: ₹5,000</ACCard>
          <ACCard>
            🌍 International Delegates: Free (with DHE Membership)
          </ACCard>
        </div>
        <div className="mt-4 space-y-2 text-gray-700">
          <p>✔ Includes Lunch, Kit & Certificate (one author)</p>
          <p>✔ Additional Author: ₹500</p>
        </div>
      </ACSection>

      <ACSection title="📚 Publication & Review">
        <div className="space-y-3 text-base text-gray-700 md:text-lg">
          <p>Peer-reviewed Open Access Journal (ISSN)</p>
          <p>Selected papers recommended for Scopus / Web of Science</p>
        </div>
      </ACSection>

      <ACSection title="🏆 Awards">
        <ACCard
          hover={false}
          className="border-amber-200/50 bg-gradient-to-r from-amber-400 to-orange-500 text-center text-white"
        >
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">
            🥇 Track-wise Best Paper Award
          </h2>
        </ACCard>
      </ACSection>

      <ACSection title="📤 Submission">
        <div className="space-y-2 text-base text-gray-700 md:text-lg">
          <p>CMT Portal (Primary Submission)</p>
          <p>Backup Email (if required)</p>
          <p>🌐 Website: www.shikshamahakumbh.com</p>
        </div>
      </ACSection>

      <ACFooterStatement title="✨ Advancing Research to Impact">
        This conference aims to transform ideas into innovation and research
        into real-world impact, fostering collaboration across disciplines for a
        future-ready Bharat.
      </ACFooterStatement>

      <SectionCTA
        buttonText="शोध-पत्र प्रस्तुत करें"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
};

const conclaves = [
  {
    title: "VC / Directors Conclave",
    icon: "🎓",
    participants:
      "Vice-Chancellors, Directors, Academic Thinkers, NEP Implementers",
    focus:
      "Systemic policy transformation, institutional autonomy, global benchmarks",
    output:
      "Vision Charter for Higher Education @2047",
    theme:
      "Practical Innovation in Education System",
    coordinators:
      "Dr. Chander Prakash, NIT Hamirpur",
  },
  {
    title: "Principals & Outstanding Teachers Conclave",
    icon: "🏫",
    participants:
      "School Principals, Outstanding Teachers, DEOs, Education Officers",
    focus:
      "Foundational literacy, school leadership, rural-urban equity, pedagogy reforms",
    output:
      "Model School Leadership & Teaching Excellence Toolkit",
    theme:
      "Transformative Ethical Learning with Innovations",
    coordinators:
      "Dr. Siddarath Chauhan, NIT Hamirpur | Dr. Kuldeep Kumar, NIT Hamirpur",
  },
  {
    title: "Scientists & Research Scholars Conclave",
    icon: "🔬",
    participants:
      "Scientists, Research Scholars, PhD Candidates, Innovators, R&D Professionals",
    focus:
      "Interdisciplinary R&D, patent ecosystem, Bharatiya knowledge",
    output:
      "Research-to-Policy Action Guide",
    theme:
      "Lab to the Last Mile",
    coordinators:
      "Prof. Ravi Kumar, NIT Hamirpur | Dr. Pooja, CSIR–CSIO Chandigarh",
  },
  {
    title: "Startup Leaders / Entrepreneurs Conclave",
    icon: "🚀",
    participants:
      "Startup Founders, Entrepreneurs, Business Leaders, Innovation Mentors",
    focus:
      "Entrepreneurship promotion through education",
    output:
      "Student Entrepreneurship Development Framework",
    theme:
      "Mitigation of Unemployment through Entrepreneurship",
    coordinators:
      "Er. Pankaj Kumar, NIT Hamirpur",
  },
  {
    title: "CSR & NGO Conclave",
    icon: "🤝",
    participants:
      "CSR Leaders, NGOs, Philanthropic Foundations, Social Activists",
    focus:
      "Equitable access, girls’ education, underserved communities",
    output:
      "Inclusive Education Investment Charter",
    theme:
      "Society of Knowledge, Obedience with Practical Responsibility",
    coordinators:
      "Dr. Somesh Kumar, NIT Hamirpur",
  },
  {
    title: "Media Conclave",
    icon: "📢",
    participants:
      "Journalists, Edufluencers, Digital Content Creators, Fact-checkers",
    focus:
      "Responsible storytelling, fact-based discourse, positive narratives",
    output:
      "Shiksha Media Ethics & Impact Code",
    theme:
      "Visualize the World with the Power of Truth",
    coordinators:
      "Dr. Rakesh Kumar, NIT Hamirpur | Adv. Aarti Sharma, Member, DHE",
  },
  {
    title: "Talent Conclave (90%+ Achievers)",
    icon: "🌟",
    participants:
      "Meritorious Students (90%+), Toppers, Academic Achievers",
    focus:
      "Talent recognition, motivation, academic excellence",
    output:
      "National Talent Recognition & Mentorship Pathway",
    theme:
      "Nurturing Excellence for Viksit Bharat",
    coordinators:
      "Dr. Arvind Kumar, NIT Hamirpur",
  },
];

