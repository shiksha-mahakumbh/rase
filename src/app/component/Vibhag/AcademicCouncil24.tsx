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

function ConclavePage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-900 to-indigo-700 text-white py-16 px-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎓 Conclaves – Shiksha Mahakumbh 6.0
          </h1>

          <p className="text-lg md:text-xl max-w-5xl mx-auto leading-8">
            High-impact dialogue platforms bringing together
            leaders from academia, research, governance,
            industry, and society to shape the future of
            education aligned with
            <span className="font-semibold">
              {" "}Viksit Bharat 2047
            </span>.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">
            🌟 Overview
          </h2>

          <p className="text-lg text-gray-700 leading-8">
            The Conclaves at Shiksha Mahakumbh 6.0 serve as
            high-impact dialogue platforms fostering policy
            discussions, innovation exchange, and actionable
            outcomes across diverse sectors of education,
            governance, entrepreneurship, and research.
          </p>
        </div>
      </section>

      {/* Conclave Cards */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <h2 className="text-3xl font-bold text-purple-700 mb-8">
          🧩 Conclave Categories
        </h2>

        <div className="space-y-8">
          {conclaves.map((conclave, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-8"
            >
              <h3 className="text-2xl font-bold text-purple-700 mb-5">
                {index + 1}. {conclave.icon} {conclave.title}
              </h3>

              <div className="space-y-4 text-gray-700 leading-7">
                <p>
                  <span className="font-semibold">
                    Participants:
                  </span>{" "}
                  {conclave.participants}
                </p>

                <p>
                  <span className="font-semibold">
                    Focus:
                  </span>{" "}
                  {conclave.focus}
                </p>

                <p>
                  <span className="font-semibold">
                    Output:
                  </span>{" "}
                  {conclave.output}
                </p>

                <p>
                  <span className="font-semibold">
                    Theme:
                  </span>{" "}
                  {conclave.theme}
                </p>

                <p>
                  <span className="font-semibold">
                    Coordinators:
                  </span>{" "}
                  {conclave.coordinators}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-8">
            🧭 Leadership & Coordination
          </h2>

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
        </div>
      </section>

      {/* Footer */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-2xl shadow-xl p-10 text-center">
          <h2 className="text-4xl font-bold mb-5">
            ✨ Driving Dialogue to Action
          </h2>

          <p className="max-w-4xl mx-auto text-lg leading-8">
            Each conclave is designed to move beyond discussions
            and generate practical frameworks, policy inputs,
            and collaborative pathways contributing to the
            future of education in India.
          </p>
        </div>
      </section>
    </div>
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


const olympiadCategories = [
  {
    title: "DHE English Olympiad",
    icon: "🇬🇧",
    description:
      "Enhancing language proficiency, comprehension, grammar, and communication skills.",
  },
  {
    title: "DHE Maths Olympiad",
    icon: "🔢",
    description:
      "Strengthening analytical thinking, problem-solving, and conceptual understanding in mathematics.",
  },
  {
    title: "DHE Tech Olympiad",
    icon: "💻",
    description:
      "Promoting digital literacy, logical reasoning, and technology awareness among students.",
  },
];

const olympiadObjectives = [
  "Identify and encourage academic excellence among students",
  "Promote analytical thinking and conceptual clarity",
  "Strengthen subject-wise competencies",
  "Provide a national recognition platform",
  "Build a strong academic foundation for future learning",
];

const examFeatures = [
  "Conducted within schools (Offline/Online mode)",
  "Objective-based assessment",
  "Focus on conceptual understanding and application",
  "Class-wise question papers",
];

const participationSteps = [
  "School Registration",
  "Student Enrollment",
  "Conduct of Olympiad in School",
  "Evaluation & Result Compilation",
  "Declaration of Results",
];

const olympiadBenefits = [
  "Certificates for all participants",
  "Merit Certificates for top performers",
  "Top achievers felicitated at Shiksha Mahakumbh 6.0",
  "National-level recognition",
];

function OlympiadPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-16 px-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            🏆 DHE Olympiad – Shiksha Mahakumbh 6.0
          </h1>

          <p className="text-lg md:text-xl leading-8 max-w-5xl mx-auto">
            A nationwide academic initiative designed to
            identify, nurture, and celebrate young talent
            by promoting academic excellence, analytical
            thinking, and healthy competition among students.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">
            🌟 Overview
          </h2>

          <p className="text-lg leading-8 text-gray-700">
            The DHE Olympiad under Shiksha Mahakumbh 6.0
            provides students across India with an opportunity
            to test their knowledge, strengthen conceptual
            understanding, and compete at a national level.
            Conducted directly within schools, the Olympiad
            ensures maximum participation and encourages a
            culture of academic excellence.
          </p>
        </div>
      </section>

      {/* Objectives */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-8">
            🎯 Objectives
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {olympiadObjectives.map((objective, index) => (
              <div
                key={index}
                className="bg-purple-50 rounded-xl p-5 shadow-sm"
              >
                ✅ {objective}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <h2 className="text-3xl font-bold text-purple-700 mb-8">
          📚 Olympiad Categories
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {olympiadCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-8"
            >
              <h3 className="text-2xl font-bold text-purple-700 mb-4">
                {category.icon} {category.title}
              </h3>

              <p className="text-gray-700 leading-7">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Eligibility */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl shadow-xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-6">
            👥 Eligibility
          </h2>

          <div className="space-y-4 text-lg">
            <p>🎓 Students from Classes 3 to 10</p>

            <p>🏫 Participation through respective schools</p>
          </div>
        </div>
      </section>

      {/* Format */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-8">
            📝 Format of Examination
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {examFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl p-5"
              >
                📌 {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-8">
            ⚙️ Participation Process
          </h2>

          <div className="grid md:grid-cols-5 gap-5">
            {participationSteps.map((step, index) => (
              <div
                key={index}
                className="bg-purple-50 rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-purple-700 mb-3">
                  {index + 1}
                </div>

                <p className="text-sm text-gray-700 leading-6">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-8 text-center">
            🏆 Recognition & Awards
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {olympiadBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-xl p-5"
              >
                🌟 {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-8">
            📅 Timeline
          </h2>

          <div className="space-y-4 text-lg text-gray-700">
            <p>📌 Registration Start: To be announced</p>

            <p>📌 Exam Dates: To be announced</p>

            <p>📌 Result Declaration: To be announced</p>

            <p>
              📌 Felicitation:
              During Shiksha Mahakumbh 2026 (NIT Hamirpur)
            </p>
          </div>
        </div>
      </section>

      {/* School Participation */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-8">
            🏫 School Participation
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              "Coordinating student registrations",
              "Conducting the Olympiad smoothly",
              "Encouraging maximum participation",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-indigo-50 rounded-xl p-5 shadow-sm"
              >
                ✅ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-center">
            📞 Contact & Support
          </h2>

          <div className="space-y-4 text-lg text-center">
            <p>📧 academics@shikshamahakumbh.com</p>

            <p>📞 +91-7903431900</p>

            <p>🌐 www.shikshamahakumbh.com</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-12 px-6">
        <h3 className="text-3xl font-bold text-purple-700 mb-4">
          ✨ Empowering Young Minds
        </h3>

        <p className="max-w-4xl mx-auto text-gray-600 leading-8 text-lg">
          The DHE Olympiad is not just an examination,
          but a journey towards building confident,
          capable, and future-ready students for
          a stronger Bharat.
        </p>
      </section>
    </div>
  );
}
const exhibitionSegments = [
  {
    title: "Student Projects Zone",
    icon: "🚀",
    description:
      "Innovative models and ideas by school & college students",
  },
  {
    title: "University & Institutional Stalls",
    icon: "🎓",
    description:
      "Showcasing academic excellence, research, and initiatives",
  },
  {
    title: "Laboratory & Research Displays",
    icon: "🔬",
    description:
      "Live demonstrations of technologies and experiments",
  },
  {
    title: "Best Practices Pavilion",
    icon: "💡",
    description:
      "Successful educational and social models",
  },
  {
    title: "Cultural Theme Stalls",
    icon: "🎭",
    description:
      "Exhibits reflecting Indian traditions and theme-based concepts",
  },
  {
    title: "State Representation Zone",
    icon: "🌍",
    description:
      "Showcasing diverse culture, education models, and innovations from different states",
  },
  {
    title: "Organizations & Institutions Stalls",
    icon: "🤝",
    description:
      "Participation from educational bodies, NGOs, and social organizations",
  },
  {
    title: "Host Institution Showcase",
    icon: "🏫",
    description:
      "NIT Hamirpur & Local Institutions",
  },
];

const exhibitionParticipants = [
  "School & College Students",
  "Universities & Institutions",
  "Research Labs & Innovators",
  "NGOs & Organizations",
  "State Representatives",
  "Cultural Groups",
];

const exhibitionObjectives = [
  "Provide a platform to showcase innovation and creativity",
  "Highlight best practices in education and society",
  "Promote collaboration among institutions and stakeholders",
  "Integrate culture, science, and sustainability",
];

const exhibitionBenefits = [
  "Participation Certificates",
  "Recognition for outstanding exhibits",
  "Networking with academicians, policymakers, and industry experts",
  "National-level exposure",
];

function ExhibitionPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-r from-cyan-700 to-blue-700 text-white py-16 px-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            🏛️ Exhibition – Shiksha Mahakumbh 6.0
          </h1>

          <p className="text-lg md:text-xl leading-8 max-w-5xl mx-auto">
            A dynamic showcase of innovation, culture,
            institutional excellence, and transformative ideas
            bringing together students, universities,
            organizations, and innovators on one platform.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-cyan-700 mb-6">
            🌟 Overview
          </h2>

          <p className="text-lg leading-8 text-gray-700">
            The Exhibition at Shiksha Mahakumbh 6.0 serves as a
            vibrant ecosystem where innovation, sustainability,
            culture, and education come together. Participants
            will present impactful ideas, research, working
            models, and transformative initiatives aligned with
            the vision of Viksit Bharat 2047.
          </p>
        </div>
      </section>

      {/* Theme */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl shadow-xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            🌿 Theme
          </h2>

          <h3 className="text-2xl md:text-3xl font-semibold mb-4">
            “Shiksha, Prakriti aur Pragati”
          </h3>

          <p className="text-lg md:text-xl">
            Educating for Development and Harmony with Nature
          </p>
        </div>
      </section>

      {/* Segments */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <h2 className="text-3xl font-bold text-cyan-700 mb-8">
          🧩 Key Exhibition Segments
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {exhibitionSegments.map((segment, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h3 className="text-2xl font-bold text-cyan-700 mb-4">
                {segment.icon} {segment.title}
              </h3>

              <p className="text-gray-700 leading-7">
                {segment.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Participants */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-cyan-700 mb-8">
            👥 Participants
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {exhibitionParticipants.map((participant, index) => (
              <div
                key={index}
                className="bg-cyan-50 rounded-xl p-5 shadow-sm"
              >
                🎓 {participant}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-cyan-700 mb-8">
            🎯 Objectives
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {exhibitionObjectives.map((objective, index) => (
              <div
                key={index}
                className="bg-green-50 rounded-xl p-5 shadow-sm"
              >
                ✅ {objective}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-cyan-700 mb-8">
            🏆 Opportunities & Recognition
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {exhibitionBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-orange-50 rounded-xl p-5 shadow-sm"
              >
                🌟 {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dates */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold text-cyan-700 mb-8">
            📅 Exhibition Dates
          </h2>

          <p className="text-2xl font-bold text-cyan-700">
            9–11 October 2026 | NIT Hamirpur
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-cyan-700 to-blue-700 text-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-center">
            📞 Participation & Enquiries
          </h2>

          <div className="space-y-4 text-lg text-center">
            <p>📧 academics@shikshamahakumbh.com</p>

            <p>📞 +91-7903431900</p>

            <p>🌐 www.shikshamahakumbh.com</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-12 px-6">
        <h3 className="text-3xl font-bold text-cyan-700 mb-4">
          ✨ A Confluence of Ideas & Innovation
        </h3>

        <p className="max-w-4xl mx-auto text-gray-600 leading-8 text-lg">
          Explore a vibrant ecosystem where education,
          innovation, culture, and sustainability come
          together at the Shiksha Mahakumbh 6.0 Exhibition.
        </p>
      </section>
    </div>
  );
}

const projectThemes = [
  "Science & Innovation",
  "AI, Robotics & Emerging Technologies",
  "Environment & Sustainability",
  "Health & Well-being",
  "Agriculture & Rural Development",
  "Indian Knowledge Systems (IKS)",
  "Social Innovation & Public Solutions",
  "Engineering & Applied Technology",
];

const projectBenefits = [
  "Certificates for all participants",
  "Awards for top projects",
  "Opportunity to present before national-level experts",
  "Mentorship & institutional support for selected projects",
  "Featured on official website & exhibitions",
];

function ProjectsPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-16 px-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            🚀 Student Projects – Shiksha Mahakumbh 6.0
          </h1>

          <p className="text-lg md:text-xl leading-8 max-w-5xl mx-auto">
            A national-level innovation platform designed to nurture
            creativity, research, and problem-solving skills among
            students while contributing towards
            <span className="font-semibold">
              {" "}Viksit Bharat 2047
            </span>.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">
            🌟 Overview
          </h2>

          <p className="text-lg leading-8 text-gray-700">
            The Student Projects Initiative under Shiksha Mahakumbh 6.0
            provides students from schools and higher education
            institutions with a platform to present innovative ideas,
            prototypes, and impactful working models that address
            real-world challenges. This initiative bridges the gap
            between academic learning and practical implementation.
          </p>
        </div>
      </section>

      {/* Objectives */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            🎯 Objectives
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              "Promote innovation-driven learning",
              "Encourage research and practical application",
              "Identify and nurture young talent",
              "Provide a national platform for showcasing ideas",
              "Connect students with experts, mentors, and institutions",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-emerald-50 rounded-xl p-5 shadow-sm"
              >
                ✅ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participation */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <h2 className="text-3xl font-bold text-emerald-700 mb-8">
          👥 Participation Categories
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-emerald-600">
            <h3 className="text-2xl font-bold mb-4">
              🏫 School Level
            </h3>

            <p className="mb-3 text-gray-700">
              <span className="font-semibold">Classes:</span> 6–10
            </p>

            <p className="text-gray-700 leading-7">
              Focus on basic innovation, creative models,
              practical ideas, and problem-solving concepts.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-teal-600">
            <h3 className="text-2xl font-bold mb-4">
              🎓 College Level
            </h3>

            <p className="mb-3 text-gray-700">
              <span className="font-semibold">Eligibility:</span> UG / PG Students
            </p>

            <p className="text-gray-700 leading-7">
              Focus on advanced projects, research-based
              solutions, prototypes, and emerging technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Themes */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            🧠 Themes & Domains
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {projectThemes.map((theme, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-5 shadow-sm text-center font-medium"
              >
                {theme}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            📌 Project Submission Guidelines
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Project Abstract (200–300 words)",
              "Detailed Report / Documentation",
              "Short Video Demonstration (2–5 minutes)",
              "Images / Prototype (if available)",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl p-5"
              >
                📄 {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selection Process */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <h2 className="text-3xl font-bold text-emerald-700 mb-8">
          ⚙️ Selection Process
        </h2>

        <div className="grid md:grid-cols-5 gap-5">
          {[
            "Registration & Submission",
            "Initial Screening",
            "Expert Review & Evaluation",
            "Shortlisting of Top Projects",
            "Final Showcase at Shiksha Mahakumbh 6.0",
          ].map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 text-center"
            >
              <div className="text-4xl font-bold text-emerald-700 mb-4">
                {index + 1}
              </div>

              <p className="text-gray-700 leading-7">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            🏆 Recognition & Benefits
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-emerald-50 rounded-xl p-5 shadow-sm"
              >
                🎖️ {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            📅 Important Timeline
          </h2>

          <div className="grid md:grid-cols-2 gap-5 text-lg">
            <div>📌 Topic Finalization: To be announced</div>
            <div>📌 Registration Start: To be announced</div>
            <div>📌 Submission Deadline: To be announced</div>
            <div>
              📌 Final Showcase: 9–11 October 2026 (NIT Hamirpur)
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            🏛️ Institutional Collaboration
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <div className="bg-gray-100 rounded-xl p-5 text-center">
              IITs / NITs / Central Universities
            </div>

            <div className="bg-gray-100 rounded-xl p-5 text-center">
              Research Institutions
            </div>

            <div className="bg-gray-100 rounded-xl p-5 text-center">
              Industry Experts & Mentors
            </div>
          </div>

          <p className="text-gray-700 leading-8 text-lg">
            Institutions are encouraged to adopt and refine promising
            student projects for further development and innovation.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-center">
            📞 Contact & Support
          </h2>

          <div className="space-y-4 text-lg text-center">
            <p>📧 academics@shikshamahakumbh.com</p>
            <p>📞 +91-7903431900</p>
            <p>🌐 www.shikshamahakumbh.com</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-12 px-6">
        <h3 className="text-3xl font-bold text-emerald-700 mb-4">
          ✨ Be the Innovator of Tomorrow
        </h3>

        <p className="max-w-4xl mx-auto text-gray-600 leading-8 text-lg">
          Transform your ideas into impactful solutions and become
          a part of India’s largest academic innovation movement.
        </p>
      </section>
    </div>
  );
}

const bestPracticeCategories = [
  {
    title: "Academic Innovations",
    icon: "🎓",
    items: [
      "Experiential Learning Models",
      "Multidisciplinary Teaching Approaches",
      "Outcome-Based Education",
    ],
  },
  {
    title: "EdTech Integration",
    icon: "💻",
    items: [
      "AI & Digital Tools in Teaching",
      "Smart Classrooms & LMS",
      "Blended & Online Learning Models",
    ],
  },
  {
    title: "Community & Social Impact",
    icon: "🌱",
    items: [
      "Rural & Tribal Education Initiatives",
      "Inclusive Education Practices",
      "Women Empowerment through Education",
    ],
  },
  {
    title: "Institutional Excellence",
    icon: "🏫",
    items: [
      "Governance & Leadership Models",
      "School/University Transformation Initiatives",
      "Quality Assurance & Accreditation Practices",
    ],
  },
  {
    title: "Sustainability & Environment",
    icon: "🌍",
    items: [
      "Green Campus Initiatives",
      "Water Conservation & Waste Management",
      "Climate Awareness Programs",
    ],
  },
  {
    title: "Indian Knowledge System (IKS)",
    icon: "🕉",
    items: [
      "Gurukul-based Learning Models",
      "Value-based Education Practices",
      "Integration of Bharatiya Knowledge Traditions",
    ],
  },
];

const submissionRequirements = [
  "Title of Best Practice",
  "Institution / Organization Name",
  "Objective & Problem Addressed",
  "Detailed Description of Practice",
  "Implementation Methodology",
  "Impact & Outcomes (with data if available)",
  "Scalability & Replicability",
  "Supporting Documents (photos/videos/reports)",
];

const evaluationCriteria = [
  "Innovation & Originality",
  "Measurable Impact",
  "Sustainability",
  "Replicability",
  "Alignment with National Education Vision",
];

const recognitionBenefits = [
  "Best Practices Awards (Category-wise)",
  "Certificate of Excellence",
  "Opportunity to present at national platform",
  "Inclusion in “Shiksha Mahakumbh Best Practices Compendium”",
];

function BestPracticesPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white py-16 px-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            🌟 Best Practices – Shiksha Mahakumbh 6.0
          </h1>

          <p className="text-lg md:text-xl leading-8 max-w-5xl mx-auto">
            A national initiative to identify, showcase, and
            scale innovative, impactful, and replicable
            practices in education, governance, and
            community engagement aligned with
            Viksit Bharat 2047.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">
            🌟 Overview
          </h2>

          <p className="text-lg leading-8 text-gray-700">
            The Best Practices Initiative at Shiksha Mahakumbh 6.0
            provides a national platform for institutions and
            individuals to present successful and innovative
            models contributing towards quality education,
            inclusivity, sustainability, and social impact.
          </p>
        </div>
      </section>

      {/* Objectives */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            🎯 Objectives
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              "Promote innovation and excellence in education practices",
              "Share replicable models across institutions and regions",
              "Encourage community-driven and socially impactful initiatives",
              "Build a repository of best practices aligned with Viksit Bharat 2047",
            ].map((objective, index) => (
              <div
                key={index}
                className="bg-emerald-50 rounded-xl p-5 shadow-sm"
              >
                ✅ {objective}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <h2 className="text-3xl font-bold text-emerald-700 mb-8">
          🧩 Categories of Best Practices
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {bestPracticeCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-8"
            >
              <h3 className="text-2xl font-bold text-emerald-700 mb-5">
                {category.icon} {category.title}
              </h3>

              <ul className="space-y-3 text-gray-700">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Submission */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            📂 Submission Requirements
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {submissionRequirements.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl p-5"
              >
                📄 {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            ⚙️ Evaluation Criteria
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {evaluationCriteria.map((criteria, index) => (
              <div
                key={index}
                className="bg-teal-50 rounded-xl p-5 text-center shadow-sm"
              >
                ⭐ {criteria}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-8 text-center">
            🏆 Recognition
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {recognitionBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-xl p-5"
              >
                🌟 {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            📅 Process Flow
          </h2>

          <div className="grid md:grid-cols-5 gap-5">
            {[
              "Call for Submissions",
              "Screening & Shortlisting",
              "Expert Evaluation",
              "Presentation (Selected Entries)",
              "Final Recognition at Shiksha Mahakumbh 6.0",
            ].map((step, index) => (
              <div
                key={index}
                className="bg-emerald-50 rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-emerald-700 mb-3">
                  {index + 1}
                </div>

                <p className="text-sm text-gray-700 leading-6">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibition */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-8">
            🏢 Exhibition Opportunity
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              "🏫 Exhibition Stalls",
              "📊 Posters & Demonstrations",
              "🎥 Live Presentations",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-green-50 rounded-xl p-6 text-center shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-center">
            📞 Contact
          </h2>

          <div className="space-y-4 text-lg text-center">
            <p>📧 academics@shikshamahakumbh.com</p>

            <p>📞 WhatsApp: +91-7903431900</p>

            <p>🌐 www.shikshamahakumbh.com</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-12 px-6">
        <h3 className="text-3xl font-bold text-emerald-700 mb-4">
          ✨ From Practice to Policy
        </h3>

        <p className="max-w-4xl mx-auto text-gray-600 leading-8 text-lg">
          This initiative aims to transform grassroots
          innovations into national models, creating a
          strong ecosystem of knowledge sharing and
          continuous improvement in education.
        </p>
      </section>
    </div>
  );
}

const patrikaSections = [
  {
    title: "Section 1",
    icon: "📗",
    classes: "Classes: 9th – 10th",
    focus:
      "Basic research, observations, project documentation",
  },
  {
    title: "Section 2",
    icon: "📘",
    classes: "Classes: 11th – 12th",
    focus:
      "Advanced research, analytical studies, innovative ideas",
  },
];

const patrikaThemes = [
  "🇮🇳 Viksit Bharat 2047",
  "🌱 Environment & Sustainability",
  "🤖 AI, Technology & Future Innovations",
  "🚜 Agriculture & Rural Development",
  "🏛️ Indian Knowledge Systems (IKS)",
  "🧬 Science & Scientific Discoveries",
  "💡 Social Issues & Solutions",
  "🌍 Global Challenges & Local Solutions",
];

const submissionFormats = [
  "📄 Research Paper / Article (800–1500 words)",
  "🧾 Abstract (150–200 words)",
  "📊 Data / Case Study (if applicable)",
  "🖼️ Diagrams / Images / Project Documentation",
];

const patrikaBenefits = [
  "Publication in national-level Student Research Journal",
  "Certificates for participants",
  "Special recognition for outstanding research",
  "Opportunity to present at Shiksha Mahakumbh 6.0",
  "Academic exposure and mentorship opportunities",
];

function PatrikaPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-16 px-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            📘 Bal Shodh Patrika – Shiksha Mahakumbh 6.0
          </h1>

          <p className="text-lg md:text-xl leading-8 max-w-5xl mx-auto">
            A unique academic initiative designed to nurture
            research, inquiry, innovation, and critical thinking
            among school students through structured academic
            publication and project-based learning.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">
            🌟 Overview
          </h2>

          <p className="text-lg leading-8 text-gray-700">
            Bal Shodh Patrika serves as a national platform for
            young learners to present their ideas, research work,
            and project-based learnings in a structured academic
            format. This initiative bridges the gap between school
            education and research orientation, encouraging
            students to contribute meaningfully to society through
            innovation and knowledge creation.
          </p>
        </div>
      </section>

      {/* Objectives */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8">
            🎯 Objectives
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              "Develop research aptitude among school students",
              "Promote critical thinking and analytical skills",
              "Encourage documentation of student projects and ideas",
              "Provide a platform for academic expression and publication",
              "Inspire students towards innovation and knowledge creation",
            ].map((objective, index) => (
              <div
                key={index}
                className="bg-indigo-50 rounded-xl p-5 shadow-sm"
              >
                ✅ {objective}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participation */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8">
          👥 Participation Categories
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {patrikaSections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-8"
            >
              <h3 className="text-2xl font-bold text-indigo-700 mb-4">
                {section.icon} {section.title}
              </h3>

              <p className="text-lg font-semibold mb-3">
                {section.classes}
              </p>

              <p className="text-gray-700 leading-7">
                {section.focus}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Themes */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8">
            🧠 Themes & Topics
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {patrikaThemes.map((theme, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-xl p-5 shadow-sm"
              >
                {theme}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8">
            📝 Submission Format
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {submissionFormats.map((format, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl p-5"
              >
                {format}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8">
            ⚙️ Review & Selection Process
          </h2>

          <div className="grid md:grid-cols-5 gap-5">
            {[
              "Submission of entries",
              "Screening for eligibility and originality",
              "Review by subject experts",
              "Selection of best entries",
              "Final publication in Bal Shodh Patrika",
            ].map((step, index) => (
              <div
                key={index}
                className="bg-indigo-50 rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-indigo-700 mb-3">
                  {index + 1}
                </div>

                <p className="text-gray-700 text-sm leading-6">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8">
            🏆 Recognition & Benefits
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {patrikaBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-yellow-50 rounded-xl p-5 shadow-sm"
              >
                🌟 {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8">
            📅 Timeline
          </h2>

          <div className="space-y-4 text-lg text-gray-700">
            <p>📌 Call for Submissions: To be announced</p>

            <p>📌 Last Date for Submission: To be announced</p>

            <p>📌 Review & Selection: To be announced</p>

            <p>
              📌 Publication & Release:
              During Shiksha Mahakumbh 2026
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-center">
            🏫 Institutional Collaboration
          </h2>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
            <div className="bg-white/10 rounded-xl p-5">
              ✅ Motivate students for participation
            </div>

            <div className="bg-white/10 rounded-xl p-5">
              ✅ Guide students in research writing
            </div>

            <div className="bg-white/10 rounded-xl p-5">
              ✅ Support documentation and submission
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">
            📞 Contact & Support
          </h2>

          <div className="space-y-4 text-lg">
            <p>📧 academics@shikshamahakumbh.com</p>

            <p>📞 +91-7903431900</p>

            <p>🌐 www.shikshamahakumbh.com</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-12 px-6">
        <h3 className="text-3xl font-bold text-indigo-700 mb-4">
          ✨ Igniting Young Researchers
        </h3>

        <p className="max-w-4xl mx-auto text-gray-600 leading-8 text-lg">
          Bal Shodh Patrika is a step towards building
          a generation of young thinkers, researchers,
          and innovators who will shape the future
          of the nation.
        </p>
      </section>
    </div>
  );
}

const culturalHighlights = [
  "Folk Performances showcasing the rich cultural heritage of Himachal Pradesh",
  "Classical & Contemporary Dance Performances",
  "Theme-based Skits & Dramatic Presentations",
  "Eco-conscious Performances aligned with sustainability",
  "Music & Creative Expressions by students and artists",
];

const participationGroups = [
  "School & College Students",
  "Cultural Teams & Institutions",
  "Independent Performers",
  "Folk Artists (Local Representation)",
];

const culturalObjectives = [
  "Promote Indian culture and heritage",
  "Encourage creative expression among youth",
  "Integrate education with cultural values",
  "Highlight sustainability and harmony with nature through art",
];

const culturalRecognitionBenefits = [
  "Certificates of Participation",
  "Special Recognition for outstanding performances",
  "Opportunity to perform on a national stage",
  "Exposure to academicians, policymakers, and cultural leaders",
];

function CulturalPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-r from-pink-700 via-rose-600 to-orange-500 text-white py-16 px-6 rounded-b-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            🎭 Cultural Program – Shiksha Mahakumbh 6.0
          </h1>

          <p className="text-lg md:text-xl leading-8 max-w-5xl mx-auto">
            Celebrating the vibrant spirit of Indian culture,
            traditions, and creative expression through inspiring
            performances that connect education, sustainability,
            and heritage.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-rose-700 mb-6">
            🌟 Overview
          </h2>

          <p className="text-lg leading-8 text-gray-700">
            The Cultural Program at Shiksha Mahakumbh 6.0
            celebrates the rich diversity of Indian traditions
            and artistic expression. The event will showcase
            local Himachali culture along with theme-based
            performances that reflect the harmony between
            education, nature, and sustainable development.
          </p>
        </div>
      </section>

      {/* Theme */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl shadow-xl p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            🌿 Theme
          </h2>

          <h3 className="text-2xl md:text-3xl font-semibold mb-4">
            “Shiksha, Prakriti aur Pragati”
          </h3>

          <p className="text-lg md:text-xl">
            Educating for Development and Harmony with Nature
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-rose-700 mb-8">
            🎨 Key Highlights
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {culturalHighlights.map((item, index) => (
              <div
                key={index}
                className="bg-rose-50 rounded-xl p-6 shadow-sm"
              >
                🎭 {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participation */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <h2 className="text-3xl font-bold text-rose-700 mb-8">
          👥 Participation
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {participationGroups.map((group, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 text-center"
            >
              <div className="text-4xl mb-4">🎤</div>

              <p className="font-medium text-gray-700 leading-7">
                {group}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recognition */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-rose-700 mb-8">
            🏆 Opportunities & Recognition
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {culturalRecognitionBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-orange-50 rounded-xl p-5 shadow-sm"
              >
                🌟 {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-rose-700 mb-8">
            🎯 Objectives
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {culturalObjectives.map((objective, index) => (
              <div
                key={index}
                className="bg-green-50 rounded-xl p-5 shadow-sm"
              >
                ✅ {objective}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold text-rose-700 mb-8">
            📅 Event Schedule
          </h2>

          <div className="space-y-4 text-lg text-gray-700">
            <p>
              Cultural programs will be organised during
            </p>

            <p className="text-2xl font-bold text-rose-700">
              9–11 October 2026 | NIT Hamirpur
            </p>

            <p className="text-gray-500">
              (Detailed schedule to be announced)
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="bg-gradient-to-r from-rose-700 to-orange-500 text-white rounded-2xl shadow-xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-center">
            📞 Contact & Participation
          </h2>

          <div className="space-y-4 text-lg text-center">
            <p>📧 academics@shikshamahakumbh.com</p>

            <p>📞 +91-7903431900</p>

            <p>🌐 www.shikshamahakumbh.com</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-12 px-6">
        <h3 className="text-3xl font-bold text-rose-700 mb-4">
          ✨ Where Culture Meets Consciousness
        </h3>

        <p className="max-w-4xl mx-auto text-gray-600 leading-8 text-lg">
          Experience the harmony of tradition, creativity,
          and sustainability through inspiring cultural
          expressions at Shiksha Mahakumbh 6.0.
        </p>
      </section>
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
