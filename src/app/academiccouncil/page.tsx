// src/components/PaperTracks.tsx
"use client";

import React from "react";
import Link from "next/link";

type Track = {
  id: number;
  title: string;
  bullets: string[];
  chair?: string;
};

const tracks: Track[] = [
  {
    id: 1,
    title: "Fundamental & Applied Sciences",
    bullets: [
      "Physics, Chemistry, Biology, Mathematics",
      "Earth & Space Sciences",
      "Interdisciplinary Sciences (Biotech, Material Science, etc.)",
    ],
    chair: "Dr. Praveen Kumar",
  },
  {
    id: 2,
    title: "Engineering & Technology",
    bullets: [
      "Core Engineering (Mechanical, Civil, Electrical)",
      "Emerging Tech (AI, Robotics, Data Science, Quantum)",
    ],
    chair: "Dr. Anish Sachdeva",
  },
  {
    id: 3,
    title: "Management, Business & Entrepreneurship",
    bullets: ["Business Administration", "Startups & Family Business", "Social Entrepreneurship"],
    chair: "Dr. Sanjeev Bansal",
  },
  {
    id: 4,
    title: "International Relations, Law & Governance",
    bullets: ["Global Affairs", "Public Policy & Administration", "Legal Studies & Human Rights"],
    chair: "Dr. Poornima Pawar",
  },
  {
    id: 5,
    title: "Social Sciences & Humanities",
    bullets: ["Sociology, Psychology, Political Science, History", "Philosophy & Ethics"],
    chair: "Dr. Bala Lakhendra",
  },
  {
    id: 6,
    title: "Education Systems & Pedagogy",
    bullets: [
      "School Education (Foundational to Secondary)",
      "Higher Education & Research",
      "Inclusive & Lifelong Learning",
    ],
    chair: "Dr. P K Singh",
  },
  {
    id: 7,
    title: "EdTech & Digital Education",
    bullets: ["EdTech Innovations", "Online & Blended Learning", "AI in Education"],
    chair: "Dr. Rajneesh Talwar",
  },
  {
    id: 8,
    title: "Health Sciences & Traditional Medicine",
    bullets: ["Modern Medicine", "AYUSH (Ayurveda, Yoga etc.)", "Public Health & Preventive Care"],
    chair: "Dr. Nitin Bansal",
  },
  {
    id: 9,
    title: "Sports, Physical Education & Well-being",
    bullets: ["Sports Science", "Mental Health & Wellness", "Yoga & Lifestyle Education"],
    chair: "Dr. Lakha Singh",
  },
  {
    id: 10,
    title: "Agriculture, Food & Veterinary Sciences",
    bullets: ["Sustainable Agriculture", "Agri-Tech & Innovation", "Animal Health & Husbandry"],
    chair: "Dr. Neelesh Sharma",
  },
  {
    id: 11,
    title: "Environment, Sustainability & Water Resources",
    bullets: ["Climate Change", "Environmental Education", "Water & Resource Management"],
    chair: "Dr. Ashwani Sharma",
  },
  {
    id: 12,
    title: "Culture, Arts & Heritage",
    bullets: ["Performing & Visual Arts", "Folk & Tribal Traditions", "Cultural Conservation"],
    chair: "Dr. Ravi Prakash",
  },
  {
    id: 13,
    title: "Languages & Linguistics",
    bullets: ["Bharatiya Classical & Modern Languages", "Translation & Language Tech"],
    chair: "Dr. Anshu",
  },
  {
    id: 14,
    title: "Vocational & Skill-based Education",
    bullets: ["Industrial Training", "Crafts & Traditional Skills", "Workforce Readiness"],
    chair: "Dr. Kamlesh Prasad",
  },
  {
    id: 15,
    title: "Indian Knowledge System",
    bullets: [
      "Philosophy & Science in Indian Traditions",
      "Vedic Literature, Epistemology & Performing Arts",
      "Education in Ancient India (Gurukula to Nalanda)",
    ],
    chair: "Dr. V K Singh",
  },
];

const PaperTracks: React.FC = () => {
  const submitLink =
    "https://cmt3.research.microsoft.com/SK2025/Submission/Index";

  // JSON-LD structured data for SEO (conference + tracks)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ConferenceEvent",
    name: "Shiksha Mahakumbh 2025 - Paper Presentation",
    startDate: "2025-10-31",
    endDate: "2025-11-02",
    location: {
      "@type": "Place",
      name: "NIPER Mohali",
      address: "Sector 67, SAS Nagar (Mohali), Punjab, India",
    },
    description:
      "Multitrack conference at Shiksha Mahakumbh 2025. Paper presentations across 15 tracks including sciences, engineering, education, health, and Bhartiya Knowledge Systems.",
    organizer: {
      "@type": "Organization",
      name: "Department of Holistic Education (DHE) & NIPER Mohali",
      url: "https://shikshamahakumbh.com",
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    subEvent: tracks.map((t) => ({
      "@type": "Event",
      name: t.title,
      description: t.bullets.join(" | "),
      performer: t.chair || "",
    })),
  };

  return (
    <section aria-labelledby="paper-presentation" className="max-w-6xl mx-auto px-4 py-8">
      {/* Structured data (SEO) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="mb-6 text-center">
        <h2 id="paper-presentation" className="text-2xl sm:text-3xl font-bold text-black">
          Paper Presentation — Multitrack Conference
        </h2>
        <p className="mt-2 text-gray-700 max-w-2xl mx-auto">
          The Shiksha Mahakumbh 2025 (5th Edition) will host a hybrid multitrack conference—featuring
          original research, plenary talks, workshops and cross-disciplinary dialogue. Submit a paper
          aligned with NEP 2020, innovation, and Bhartiya knowledge systems.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row sm:justify-center gap-3">
          <a
            href={submitLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition"
          >
            Submit Paper (CMT Portal)
          </a>
          <Link href="/paper">
            <a className="inline-block text-black border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition">
              Call for Papers & Guidelines
            </a>
          </Link>
        </div>
      </header>

      {/* Chairs / Conveners card */}
      <div className="bg-white border rounded-lg shadow-sm px-5 py-4 mb-6">
        <h3 className="text-lg font-semibold text-black">General Chair & Conveners</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 border rounded-md">
            <p className="text-sm text-gray-600">General Chair</p>
            <p className="font-semibold text-black">Prof. Brahmjit Singh (NIT Kurukshetra)</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-sm text-gray-600">Co-Chairs</p>
            <p className="font-semibold text-black">Dr. Krishan Gopal, Dr. Deepak B. Salunke (NIPER SAS Nagar)</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-sm text-gray-600">Conveners</p>
            <p className="font-semibold text-black">Dr. Vikash Kumar Garg • 9988610629</p>
            <p className="mt-1 font-semibold text-black">Dr. Kapil Sood • 8588820738</p>
            <p className="mt-1 font-semibold text-black">Dr. Pankaj Kumar • 9540344621</p>
            <p className="mt-1 font-semibold text-black">Dr. Dhirender Kumar • 9015625255</p>
            <p className="mt-1 font-semibold text-black">Dr. Pankaj Verma • 8295577722</p>
          </div>
        </div>
      </div>

      {/* Tracks grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tracks.map((t) => (
          <article
            key={t.id}
            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
            aria-labelledby={`track-${t.id}-title`}
          >
            <h4 id={`track-${t.id}-title`} className="text-lg font-semibold text-black">
              {t.id}. {t.title}
            </h4>

            <ul className="mt-3 text-gray-700 list-disc list-inside space-y-1">
              {t.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            {t.chair && (
              <div className="mt-4 text-sm text-gray-800">
                <span className="font-medium">Track Chair:</span> <span>{t.chair}</span>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <a
                href={submitLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm inline-block px-3 py-1 rounded bg-black text-white hover:bg-gray-800 transition"
                aria-label={`Submit paper for ${t.title}`}
              >
                Submit Paper
              </a>
              <Link href="/contact">
                <a className="text-sm inline-block px-3 py-1 rounded border border-black text-black hover:bg-black hover:text-white transition">
                  Contact Convenor
                </a>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Publication & Notes */}
      <aside className="mt-8 bg-white border rounded-lg p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-black">Publication & Review</h3>
        <p className="mt-2 text-gray-700">
          All accepted papers will be published in a peer-reviewed open access journal with ISSN.
          Selected high-quality papers will be considered for Web of Science / Scopus indexed journals.
          Submissions undergo a double-blind peer review; similarity index must be within acceptable limits.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 border rounded">
            <p className="text-sm text-gray-600">Best Paper</p>
            <p className="font-semibold text-black">Track-wise Best Paper Award</p>
          </div>
          <div className="p-3 border rounded">
            <p className="text-sm text-gray-600">Submission</p>
            <p className="font-semibold text-black">
              <a href={submitLink} target="_blank" rel="noopener noreferrer" className="underline">
                CMT Submission Portal
              </a>
            </p>
          </div>
          <div className="p-3 border rounded">
            <p className="text-sm text-gray-600">Backup Email</p>
            <p className="font-semibold text-black">smkchair@gmail.com</p>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default PaperTracks;
