"use client";

import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const tracks = [
  {
    title: "Fundamental & Applied Sciences",
    details:
      "Physics, Chemistry, Biology, Mathematics, Earth & Space Sciences, Interdisciplinary Sciences",
    chair: "Prof. Sunil (NIT Hamirpur)",
    coChair: "Dr. Kuldeep Kumar, Dr. Kalyan S. Ghosh",
    convenor: "Dr. Om Prakash, Dr. Vikram, Dr. Praveen Sharma",
  },
  {
    title: "Engineering & Technology",
    details:
      "Core Engineering, AI, Robotics, Data Science, Quantum Technology",
    chair: "Dr. K. S. Pandey (IIT Mandi)",
    coChair: "Dr. Nitin Gupta, Dr. Varun Kumar",
    convenor: "Dr. Taleri Ganesh, Dr. Kirti Mahajan",
  },
  {
    title: "Management, Business & Entrepreneurship",
    details:
      "Business Administration, Startups, Social Entrepreneurship",
    chair: "Dr. Suman Kumar (CUHP)",
    coChair: "Dr. Ashutosh Vashishth",
    convenor: "Dr. Shampy Kamboj, Dr. Neeraj Dhiman",
  },
  {
    title: "International Relations, Law & Governance",
    details:
      "Public Policy, Global Affairs, Legal Studies, Human Rights",
    chair: "Prof. Sudershan Kumar (IIT Bombay)",
    coChair: "Dr. Somesh K. Sharma",
    convenor: "Dr. Sachin Kumar",
  },
  {
    title: "Social Sciences & Humanities",
    details:
      "Sociology, Psychology, History, Philosophy, Ethics",
    chair: "Dr. Yogesh Gupta",
    coChair: "Dr. Manoj Sharma",
    convenor: "Dr. Rinshu Dwivedi, Dr. Priya Jaiswal",
  },
  {
    title: "Education Systems & Pedagogy",
    details:
      "School Education, Higher Education, Inclusive Education, IKS",
    chair: "Dr. Naveen Mokta (NCERT)",
    coChair: "Dr. Ramesh Vats",
    convenor: "Dr. Om Prakash",
  },
  {
    title: "EdTech & Digital Education",
    details:
      "AI in Education, Online Learning, Digital Literacy",
    chair: "Prof. Dhirendra Kumar",
    coChair: "Dr. Siddarath Chauhan",
    convenor: "Dr. Aman Kumar",
  },
  {
    title: "Health Sciences & Traditional Medicine",
    details:
      "Modern Medicine, AYUSH, Public Health",
    chair: "Dr. Shweta Chaurasia (PGIMER)",
    coChair: "Dr. Hem Raj",
    convenor: "Dr. Amit Kaul, Dr. S. Kala Negi",
  },
  {
    title: "Sports, Physical Education & Well-being",
    details:
      "Sports Science, Mental Health, Yoga",
    chair: "Dr. Pawan Kumar",
    coChair: "Dr. R. K. Jamalta",
    convenor: "Dr. Subit Jain, Dr. Rakesh Rakta",
  },
  {
    title: "Agriculture, Food & Veterinary Sciences",
    details:
      "Sustainable Agriculture, Agri-Tech, Animal Husbandry",
    chair: "Dr. Som Dev",
    coChair: "-",
    convenor: "Dr. Puneet Banta",
  },
  {
    title: "Environment, Sustainability & Water Resources",
    details:
      "Climate Change, Environmental Education, Water Management",
    chair: "Dr. R. S. Banshtu",
    coChair: "Dr. Vijay S. Dogra",
    convenor: "Dr. Vivek Kumar, Dr. Ray Singh Meena",
  },
  {
    title: "Culture, Arts & Heritage",
    details:
      "Performing Arts, Folk Traditions, Cultural Conservation",
    chair: "Dr. Nand Lal",
    coChair: "Dr. Ashwani",
    convenor: "Dr. Venu, Ar. Suresh Kumar",
  },
  {
    title: "Languages & Linguistics",
    details:
      "Indian & Foreign Languages, Translation Technology",
    chair: "Prof. Mohini",
    coChair: "Dr. Garima Bhati",
    convenor: "Dr. Zarina, Dr. Manoj Yadav",
  },
  {
    title: "Vocational & Skill-Based Education",
    details:
      "Industrial Training, Crafts, Workforce Development",
    chair: "Prof. Ashok Sarial",
    coChair: "Dr. Ashwani Rana",
    convenor: "Dr. Vivek Kumar, Dr. Jitendra Man",
  },
  {
    title: "Indian Knowledge System (IKS)",
    details:
      "Philosophy, Nyaya, Mimamsa, Vedic Literature",
    chair: "Prof. Bhag Chand Chauhan",
    coChair: "Dr. Sant Ram",
    convenor: "Dr. Rakesh Kumar, Dr. Himesh Handa",
  },
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
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-700 text-white py-16 px-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            📚 Multi-Track Conference – Shiksha Mahakumbh 6.0
          </h1>

          <p className="text-lg md:text-xl max-w-5xl mx-auto leading-8">
            Shiksha Mahakumbh 2026 hosts a Hybrid International Conference
            bringing together researchers, academicians, industry experts,
            innovators, and scholars aligned with the vision of
            <span className="font-semibold"> Viksit Bharat 2047</span>.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8">
            🧭 Conference Leadership
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-xl mb-2">🎯 Chair</h3>
              <p>Prof. Brahmjit Singh, NIT Kurukshetra</p>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-2">🔹 Co-Chairs</h3>
              <p>
                Dr. Vikash Kumar Garg, Prof. R. K. Sehgal,
                Prof. Raman Parti, Prof. Sushil Chauhan,
                Prof. Ravi Ranade, Dr. Chander Prakash
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-2">🔹 Conveners</h3>
              <p>
                Dr. Pankaj Verma, Dr. Gaurav, Dr. Tarun,
                Dr. T. P. Sharma, Dr. Ramesh Vats
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Details */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-sm text-gray-500 mb-2">📄 Paper Length</p>
            <h3 className="text-xl font-bold">5–6 Pages (IEEE Format)</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-sm text-gray-500 mb-2">📊 Similarity Index</p>
            <h3 className="text-xl font-bold">Below 15%</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-sm text-gray-500 mb-2">📤 Submission</p>
            <h3 className="text-xl font-bold">CMT Portal (PDF)</h3>
          </div>
        </div>
      </section>

      {/* Dates */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">
            📅 Important Dates
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-lg">
            <div>📌 Abstract Submission: 30 June 2026</div>
            <div>📌 Acceptance Notification: 31 July 2026</div>
            <div>📌 Full Paper Submission: 31 August 2026</div>
            <div>📌 Registration Deadline: 31 August 2026</div>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8">
          🧩 Conference Tracks
        </h2>

        <div className="space-y-6">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-8"
            >
              <h3 className="text-2xl font-bold text-indigo-700 mb-3">
                {index + 1}. {track.title}
              </h3>

              <p className="text-gray-700 leading-7 mb-4">
                {track.details}
              </p>

              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Chair:</span>{" "}
                  {track.chair}
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
            </div>
          ))}
        </div>
      </section>

      {/* Registration */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">
            💰 Registration Fees
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-5 rounded-xl">
              🎓 Students (UG/PG/PhD): ₹500
            </div>

            <div className="bg-gray-100 p-5 rounded-xl">
              🔬 Research Scholars: ₹1,000
            </div>

            <div className="bg-gray-100 p-5 rounded-xl">
              🏫 Academia & R&D: ₹2,100
            </div>

            <div className="bg-gray-100 p-5 rounded-xl">
              🏢 Industry: ₹5,000
            </div>

            <div className="bg-gray-100 p-5 rounded-xl">
              🌍 International Delegates: Free
            </div>
          </div>

          <div className="mt-6 text-gray-700 space-y-2">
            <p>✔ Includes Lunch, Kit & Certificate (one author)</p>
            <p>✔ Additional Author: ₹500</p>
          </div>
        </div>
      </section>

      {/* Publication */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">
            📚 Publication & Review
          </h2>

          <div className="space-y-3 text-gray-700 text-lg">
            <p>Peer-reviewed Open Access Journal (ISSN)</p>
            <p>
              Selected papers recommended for Scopus / Web of Science
            </p>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl shadow-xl p-10 text-center">
          <h2 className="text-4xl font-bold mb-4">
            🏆 Track-wise Best Paper Award
          </h2>

          <p className="text-lg max-w-3xl mx-auto">
            Outstanding research contributions across all conference
            tracks will be recognised and awarded during
            Shiksha Mahakumbh 2026.
          </p>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-12 px-6">
        <h3 className="text-3xl font-bold text-indigo-700 mb-4">
          ✨ Advancing Research to Impact
        </h3>

        <p className="max-w-4xl mx-auto text-gray-600 leading-8 text-lg">
          This conference aims to transform ideas into innovation and
          research into real-world impact, fostering collaboration across
          disciplines for a future-ready Bharat.
        </p>
      </section>
    </div>
  );
};

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

function AwardsPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-16 px-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🏆 Excellence Awards – Shiksha Mahakumbh 6.0
          </h1>

          <p className="text-lg md:text-xl max-w-5xl mx-auto leading-8">
            Celebrating outstanding contributions in research,
            innovation, publications, entrepreneurship, and
            academic excellence.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">
            🌟 Overview
          </h2>

          <p className="text-lg text-gray-700 leading-8">
            The Excellence Awards at Shiksha Mahakumbh 6.0 aim
            to recognize and celebrate outstanding contributions
            in the fields of research, innovation, publications,
            and entrepreneurship. These awards honour both
            faculty members and students who have demonstrated
            excellence and impact in their respective domains.
          </p>
        </div>
      </section>

      {/* Award Categories */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-orange-600 mb-8">
          🎯 Award Categories
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-8 border-l-4 border-orange-500">
            <h3 className="text-2xl font-bold mb-4">
              👨‍🏫 Faculty Excellence Award
            </h3>

            <p className="text-gray-700 leading-7">
              Recognizing outstanding academic and research
              contributions by faculty members.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 border-l-4 border-yellow-500">
            <h3 className="text-2xl font-bold mb-4">
              🎓 Student Excellence Award
            </h3>

            <p className="text-gray-700 leading-7">
              Honouring talented students for innovation,
              research, and creative achievements.
            </p>
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-orange-600 mb-8">
          🏫 Levels of Awards
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <h3 className="text-2xl font-bold">
              🏫 School Level
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <h3 className="text-2xl font-bold">
              🎓 College / University Level
            </h3>
          </div>
        </div>
      </section>

      {/* Evaluation Categories */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-orange-600 mb-8">
          📂 Evaluation Categories
        </h2>

        <div className="space-y-6">
          {awardCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-8"
            >
              <h3 className="text-2xl font-bold text-orange-600 mb-5">
                {index + 1}. {category.title}
              </h3>

              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {category.details.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">
            📋 Document Checklist
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div className="bg-gray-100 p-4 rounded-xl">
              Proof of publication (first page / DOI link)
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              ISBN / Patent certificate copies
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              Grant approval letters
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              Startup registration proof (if applicable)
            </div>

            <div className="bg-gray-100 p-4 rounded-xl md:col-span-2">
              Any other supporting documents
            </div>
          </div>
        </div>
      </section>

      {/* Selection Process */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-orange-600 mb-8">
          ⚙️ Selection Process
        </h2>

        <div className="grid md:grid-cols-5 gap-4">
          {[
            "Application Submission",
            "Document Verification",
            "Expert Review Committee Evaluation",
            "Final Selection",
            "Award Declaration",
          ].map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 text-center"
            >
              <div className="text-4xl font-bold text-orange-500 mb-3">
                {index + 1}
              </div>

              <p className="text-gray-700 text-sm">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-8 text-center">
            🏅 Recognition & Benefits
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "🏆 Trophy & Certificate of Excellence",
              "🌟 National Recognition",
              "📢 Opportunity to present work",
              "🤝 Networking with academicians & industry leaders",
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white/20 rounded-xl p-5 text-center"
              >
                <p className="font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">
            📅 Important Timeline
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-5 rounded-xl">
              📌 Call for Applications: To be announced
            </div>

            <div className="bg-gray-100 p-5 rounded-xl">
              📌 Last Date: To be announced
            </div>

            <div className="bg-gray-100 p-5 rounded-xl">
              📌 Result Declaration: During Shiksha Mahakumbh 2026
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">
            📞 Contact
          </h2>

          <div className="space-y-3 text-lg text-gray-700">
            <p>📧 academics@shikshamahakumbh.com</p>
            <p>📞 +91-7903431900</p>
            <p>🌐 www.shikshamahakumbh.com</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-12 px-6">
        <h3 className="text-3xl font-bold text-orange-600 mb-4">
          ✨ Celebrating Excellence, Inspiring Innovation
        </h3>

        <p className="max-w-4xl mx-auto text-gray-600 leading-8 text-lg">
          These awards aim to encourage a culture of research,
          creativity, and impactful contribution in education
          and society.
        </p>
      </section>
    </div>
  );
}


function OlympiadPage() { 
  return (
    <div>
      <h1 className="text-2xl font-bold">Olympiad</h1>
      <p>Content for Olympiad goes here.</p>
    </div>
  ); 
}

function ExhibitionPage() { 
  return (
    <div>
      <h1 className="text-2xl font-bold">Exhibition</h1>
      <p>Content for Exhibition goes here.</p>
    </div>
  ); 
}

function ProjectsPage() { 
  return (
    <div>
      <h1 className="text-2xl font-bold">Projects</h1>
      <p>Content for Projects goes here.</p>
    </div>
  ); 
}

function BestPracticesPage() { 
  return (
    <div>
      <h1 className="text-2xl font-bold">Best Practices</h1>
      <p>Content for Best Practices goes here.</p>
    </div>
  ); 
}

function PatrikaPage() { 
  return (
    <div>
      <h1 className="text-2xl font-bold">Bal Shodh Patrika</h1>
      <p>Content for Patrika goes here.</p>
    </div>
  ); 
}

function CulturalPage() { 
  return (
    <div>
      <h1 className="text-2xl font-bold">Cultural Program</h1>
      <p>Content for Cultural Program goes here.</p>
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
