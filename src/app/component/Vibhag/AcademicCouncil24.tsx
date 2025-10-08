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
  const submitLink = "https://cmt3.research.microsoft.com/SK2025/Submission/Index";

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
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">
          Paper Presentation — Multitrack Conference
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Shiksha Mahakumbh 2025 (5th Edition) will host a hybrid multitrack conference — featuring
          original research, plenary talks, workshops, and cross-disciplinary dialogue.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={submitLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Submit Paper (CMT Portal)
          </a>
          <Link href="/paper">
            <span className="border border-black text-black px-4 py-2 rounded-md hover:bg-black hover:text-white cursor-pointer">
              Call for Papers & Guidelines
            </span>
          </Link>
        </div>
      </header>

      {/* Important Dates & Fees */}
      <div className="bg-white border rounded-lg shadow-sm p-6 mb-10">
        <h3 className="text-2xl font-semibold text-black mb-4">Important Dates & Registration Fees</h3>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-black mb-2">Important Dates</h4>
            <ul className="text-gray-700 space-y-1">
              <li>📅 Call for Papers — <strong>01 Aug 2025</strong></li>
              <li>📅 Abstract Submission — <strong>7 Oct 2025</strong></li>
              <li>📅 Abstract Acceptance — <strong>10 Oct 2025</strong></li>
              <li>📅 Full Paper Submission — <strong>20 Oct 2025</strong></li>
              <li>📅 Regular Registration — <strong>20 Oct 2025</strong></li>
              <li>📅 Late Registration — <strong>30 Oct 2025</strong></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-black mb-2">Registration Fees</h4>
            <ul className="text-gray-700 space-y-1">
              <li>🎓 Students (UG/PG/PhD): ₹500</li>
              <li>🔬 Research Scholars: ₹1,000</li>
              <li>🏫 Academia & R&D: ₹2,100</li>
              <li>🏢 Industry: ₹5,000</li>
              <li className="text-sm text-gray-600 mt-2">
                *Includes Lunch, Kit & Certificate for one author<br />
                *Additional Author: ₹500/person<br />
                *No fee for International Delegates. Includes complimentary DHE Membership.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Author Guidelines */}
      <div className="bg-white border rounded-lg shadow-sm p-6 mb-10">
        <h3 className="text-2xl font-semibold text-black mb-4">Author Guidelines for Paper Submission</h3>
        <p className="text-gray-700 mb-3">
          Authors are invited to submit original, unpublished research papers relevant to conference tracks.
          Submissions (5–6 pages) should include title, abstract, keywords, author details, and follow
          the official IEEE conference format.
        </p>

        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Similarity index (plagiarism) must be below <strong>15%</strong>.</li>
          <li>Submit papers in <strong>PDF</strong> format using the specified IEEE template.</li>
          <li>Papers should not exceed <strong>5–6 pages</strong>.</li>
          <li>Final camera-ready paper must be submitted before the deadline.</li>
          <li>All correspondence and documents must be sent together within deadlines.</li>
        </ul>

        <p className="mt-3 text-sm text-gray-600">
          📥 IEEE Paper Template available on the conference website.
        </p>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tracks.map((t) => (
          <article
            key={t.id}
            className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition hover:-translate-y-1"
          >
            <h4 className="text-lg font-semibold text-black">{t.id}. {t.title}</h4>
            <ul className="mt-3 text-gray-700 list-disc list-inside space-y-1">
              {t.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            {t.chair && (
              <div className="mt-4 text-sm text-gray-800">
                <strong>Track Chair:</strong> {t.chair}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Publication Info */}
      <aside className="mt-10 bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-2xl font-semibold text-black mb-3">Publication & Review</h3>
        <p className="text-gray-700 mb-4">
          All accepted papers will be published in a peer-reviewed open-access journal (ISSN).
          Selected high-quality papers may be recommended for Scopus / Web of Science indexed journals.
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-3 border rounded text-center">
            <p className="text-sm text-gray-600">🏆 Best Paper</p>
            <p className="font-semibold text-black">Track-wise Best Paper Award</p>
          </div>
          <div className="p-3 border rounded text-center">
            <p className="text-sm text-gray-600">📤 Submission</p>
            <a href={submitLink} target="_blank" className="font-semibold underline text-black">
              CMT Submission Portal
            </a>
          </div>
          <div className="p-3 border rounded text-center">
            <p className="text-sm text-gray-600">✉️ Backup Email</p>
            <p className="font-semibold text-black">smkchair@gmail.com</p>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default PaperTracks;
