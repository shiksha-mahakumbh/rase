"use client";

import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const tracks = [
  { title: "Fundamental & Applied Sciences", details: "Physics, Chemistry, Biology, Mathematics, Earth & Space Sciences", chair: "Prof. Sunil (NIT Hamirpur)" },
  { title: "Engineering & Technology", details: "AI, Robotics, Data Science, Quantum Technology", chair: "Dr. K. S. Pandey (IIT Mandi)" },
  { title: "Management & Entrepreneurship", details: "Business, Startups, Social Innovation", chair: "Dr. Suman Kumar (CUHP)" },
  { title: "Law & Governance", details: "Public Policy, Global Affairs, Legal Studies", chair: "Prof. Sudershan Kumar (IIT Bombay)" },
  { title: "Social Sciences & Humanities", details: "Psychology, Sociology, Philosophy", chair: "Dr. Yogesh Gupta" },
  { title: "Education & Pedagogy", details: "School, Higher, Inclusive Education", chair: "Dr. Naveen Mokta (NCERT)" },
  { title: "EdTech & Digital Education", details: "AI Learning, Digital Platforms", chair: "Prof. Dhirendra Kumar" },
  { title: "Health & AYUSH", details: "Medicine, Public Health, AYUSH", chair: "Dr. Shweta Chaurasia (PGIMER)" },
  { title: "Sports & Wellness", details: "Sports Science, Yoga, Mental Health", chair: "Dr. Pawan Kumar" },
  { title: "Agriculture & Veterinary", details: "Agri-Tech, Sustainability", chair: "Dr. Som Dev" },
  { title: "Environment & Sustainability", details: "Climate Change, Water Management", chair: "Dr. R. S. Banshtu" },
  { title: "Culture & Heritage", details: "Arts, Folk, Traditions", chair: "Dr. Nand Lal" },
  { title: "Languages & Linguistics", details: "Indian Languages, Translation", chair: "Prof. Mohini" },
  { title: "Vocational Education", details: "Skills, Industry Training", chair: "Prof. Ashok Sarial" },
  { title: "Indian Knowledge System", details: "Vedic, Philosophy, Nyaya", chair: "Prof. Bhag Chand Chauhan" },
];

const conclaves = [
  { title: "VC / Directors Conclave", theme: "Practical Innovation in Education System", focus: "Policy transformation, autonomy, global benchmarks", output: "Vision Charter for Higher Education @2047" },
  { title: "Principals & Teachers Conclave", theme: "Transformative Ethical Learning", focus: "School leadership, pedagogy, equity", output: "Teaching Excellence Toolkit" },
  { title: "Scientists & Researchers Conclave", theme: "Lab to the Last Mile", focus: "R&D, patents, interdisciplinary research", output: "Research-to-Policy Guide" },
  { title: "Startup & Entrepreneurs Conclave", theme: "Entrepreneurship for Employment", focus: "Innovation, startups, incubation", output: "Entrepreneurship Framework" },
  { title: "CSR & NGO Conclave", theme: "Inclusive Education Responsibility", focus: "Access, equity, social impact", output: "Education Investment Charter" },
  { title: "Media Conclave", theme: "Power of Truth", focus: "Responsible journalism, narratives", output: "Media Ethics Code" },
  { title: "Talent Conclave", theme: "Nurturing Excellence", focus: "Top students, mentorship", output: "Talent Recognition Pathway" },
];

// ─── INDIVIDUAL PAGES ────────────────────────────────────────────────────────

function ConferencePage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Conference Page 2026</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">Shiksha Mahakumbh 2026 hosts a hybrid global conference bringing together researchers, academicians, industry experts and innovators aligned with Viksit Bharat 2047.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm"><p className="text-sm text-gray-500">Paper Length</p><p className="font-semibold">5–6 Pages (IEEE)</p></div>
        <div className="bg-white p-4 rounded-xl shadow-sm"><p className="text-sm text-gray-500">Similarity</p><p className="font-semibold">Below 15%</p></div>
        <div className="bg-white p-4 rounded-xl shadow-sm"><p className="text-sm text-gray-500">Submission</p><p className="font-semibold">CMT Portal (PDF)</p></div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-3">Important Dates</h2>
        <ul className="space-y-2 text-gray-700">
          <li>Abstract Submission: 30 June 2026</li>
          <li>Acceptance: 31 July 2026</li>
          <li>Full Paper: 31 August 2026</li>
          <li>Registration: 31 August 2026</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Conference Tracks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead><tr className="bg-gray-100 text-left"><th className="p-2 border">Track</th><th className="p-2 border">Domains</th><th className="p-2 border">Chair</th></tr></thead>
            <tbody>
              {tracks.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 border font-medium">{t.title}</td>
                  <td className="p-2 border">{t.details}</td>
                  <td className="p-2 border">{t.chair}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-3">Registration Fees</h2>
        <ul className="grid md:grid-cols-2 gap-2 text-gray-700">
          <li>Students: ₹500</li><li>Research Scholars: ₹1,000</li><li>Academia: ₹2,100</li><li>Industry: ₹5,000</li><li>International: Free</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Publication & Awards</h2>
        <p className="text-gray-700">Peer-reviewed open access journal (ISSN). Selected papers for Scopus / Web of Science.</p>
        <p className="mt-2 font-medium">Track-wise Best Paper Award</p>
      </div>
    </>
  );
}

function ConclavePage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Conclaves – Shiksha Mahakumbh 6.0</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">High-impact dialogue platforms bringing together academia, governance, industry and society to drive actionable outcomes aligned with Viksit Bharat 2047.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {conclaves.map((c, i) => (
          <div key={i} className="bg-white border p-4 rounded-xl hover:shadow-md transition">
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="text-sm text-gray-600 mt-1">Theme: {c.theme}</p>
            <p className="text-sm mt-2"><strong>Focus:</strong> {c.focus}</p>
            <p className="text-sm mt-1"><strong>Outcome:</strong> {c.output}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-3">Leadership & Coordination</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="border p-3 rounded"><p className="text-gray-500">Chair</p><p className="font-medium">Dr. Praveen Kumar Sharma</p></div>
          <div className="border p-3 rounded"><p className="text-gray-500">Co-Chairs</p><p>Dr. Sujeet Thakur, Prof. Y. D. Sharma, Dr. Rajeshwar Banshtu</p></div>
          <div className="border p-3 rounded"><p className="text-gray-500">Conveners</p><p>Dr. Vipin Jain & Institutional Registrars</p></div>
        </div>
      </div>
    </>
  );
}
// ─── INDIVIDUAL PAGES ────────────────────────────────────────────────────────

// ... (Keep your existing ConferencePage and ConclavePage)

function AwardsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Awards & Recognition</h1>
      <p className="mt-2 text-gray-600">Details about the awards ceremony will be updated here.</p>
    </div>
  );
}

function OlympiadPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Olympiad 2026</h1>
      <p className="mt-2 text-gray-600">Information about the upcoming Olympiad competitions.</p>
    </div>
  );
}

function ExhibitionPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Exhibition</h1>
      <p className="mt-2 text-gray-600">Showcasing innovation and research projects.</p>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Projects</h1>
      <p className="mt-2 text-gray-600">Student and professional project submissions.</p>
    </div>
  );
}

function BestPracticesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Best Practices</h1>
      <p className="mt-2 text-gray-600">Shared institutional best practices and case studies.</p>
    </div>
  );
}

function PatrikaPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Bal Shodh Patrika</h1>
      <p className="mt-2 text-gray-600">Our official research publication and journal.</p>
    </div>
  );
}

function CulturalPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Cultural Program</h1>
      <p className="mt-2 text-gray-600">Details on the cultural events and performances.</p>
    </div>
  );
}

const pageMap = {
  ConferencePage: <ConferencePage />,
  ConclavePage: <ConclavePage />,
  AwardsPage: <AwardsPage />,
  OlympiadPage: <OlympiadPage />,
  ExhibitionPage: <ExhibitionPage />,
  ProjectsPage: <ProjectsPage />,
  BestPracticesPage: <BestPracticesPage />,
  PatrikaPage: <PatrikaPage />,
  CulturalPage: <CulturalPage />,
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AcademicCouncilDashboard() {
  const [active, setActive] = useState("ConferencePage");
  const [menuOpen, setMenuOpen] = useState(false);

  // MAKE SURE THIS IS HERE 👇
  const pages = [
    { id: "ConferencePage", label: "Conference" },
    { id: "ConclavePage", label: "Conclave" },
    { id: "AwardsPage", label: "Awards" },
    { id: "OlympiadPage", label: "Olympiad" },
    { id: "ExhibitionPage", label: "Exhibition" },
    { id: "ProjectsPage", label: "Projects" },
    { id: "BestPracticesPage", label: "Best Practices" },
    { id: "PatrikaPage", label: "Bal Shodh Patrika" },
    { id: "CulturalPage", label: "Cultural Program" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r p-4 hidden md:flex flex-col">
        <h2 className="text-xl font-bold mb-6">Academic Council</h2>
        <nav className="space-y-1">
          {/* This should now find 'pages' correctly */}
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                active === p.id ? "bg-black text-white font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ... Rest of your component (Mobile Menu & Main) ... */}
      <main className="flex-1 p-6 pt-16 md:pt-6 max-w-5xl">
        {pageMap[active as keyof typeof pageMap]}
      </main>
    </div>
  );
}
