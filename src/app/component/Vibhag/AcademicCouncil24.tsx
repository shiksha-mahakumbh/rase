"use client";

import React, { useState } from "react";


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



function ConferencePage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Conference Page 2026</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Shiksha Mahakumbh 2026 hosts a hybrid global conference bringing together researchers, academicians,
          industry experts and innovators aligned with Viksit Bharat 2047.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Paper Length</p>
          <p className="font-semibold">5–6 Pages (IEEE)</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Similarity</p>
          <p className="font-semibold">Below 15%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Submission</p>
          <p className="font-semibold">CMT Portal (PDF)</p>
        </div>
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
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Track</th>
                <th className="p-2 border">Domains</th>
                <th className="p-2 border">Chair</th>
              </tr>
            </thead>
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
          <li>Students: ₹500</li>
          <li>Research Scholars: ₹1,000</li>
          <li>Academia: ₹2,100</li>
          <li>Industry: ₹5,000</li>
          <li>International: Free</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Publication & Awards</h2>
        <p className="text-gray-700">
          Peer-reviewed open access journal (ISSN). Selected papers for Scopus / Web of Science.
        </p>
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
        <p className="text-gray-600 mt-2 max-w-3xl">
          High-impact dialogue platforms bringing together academia, governance, industry and society to drive actionable outcomes aligned with Viksit Bharat 2047.
        </p>
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
          <div className="border p-3 rounded">
            <p className="text-gray-500">Chair</p>
            <p className="font-medium">Dr. Praveen Kumar Sharma</p>
          </div>
          <div className="border p-3 rounded">
            <p className="text-gray-500">Co-Chairs</p>
            <p>Dr. Sujeet Thakur, Prof. Y. D. Sharma, Dr. Rajeshwar Banshtu</p>
          </div>
          <div className="border p-3 rounded">
            <p className="text-gray-500">Conveners</p>
            <p>Dr. Vipin Jain & Institutional Registrars</p>
          </div>
        </div>
      </div>
    </>
  );
}

function AwardsPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Excellence Awards – Shiksha Mahakumbh 6.0</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Recognizing outstanding contributions in research, innovation, publications, and entrepreneurship across faculty and students.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold">Faculty Excellence Award</h3>
          <p className="text-sm text-gray-600 mt-1">Academic & research contributions</p>
        </div>
        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold">Student Excellence Award</h3>
          <p className="text-sm text-gray-600 mt-1">Innovation, research & creativity</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Levels</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>School Level</li>
          <li>College / University Level</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-3">Evaluation Criteria</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Required Details</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Research Publications", "Journal, Title, Impact Factor, Indexing, Year"],
                ["Books / Chapters", "Title, Publisher, ISBN, Year"],
                ["Patents", "Title, Number, Status, Office"],
                ["Startups", "Name, Description, Registration, Impact"],
                ["Projects / Grants", "Title, Agency, Amount, Status"],
              ].map(([cat, det], i) => (
                <tr key={i}>
                  <td className="p-2 border">{cat}</td>
                  <td className="p-2 border">{det}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Selection Process</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
          <li>Application Submission</li>
          <li>Document Verification</li>
          <li>Expert Evaluation</li>
          <li>Final Selection</li>
        </ol>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Recognition & Benefits</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Trophy & Certificate</li>
          <li>National Recognition</li>
          <li>Presentation Opportunity</li>
          <li>Networking</li>
        </ul>
      </div>

      <div className="bg-white border p-4 rounded-xl text-sm shadow-sm">
        <p><strong>Email:</strong> academics@shikshamahakumbh.com</p>
        <p><strong>Phone:</strong> +91-7903431900</p>
      </div>
    </>
  );
}

function OlympiadPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">DHE Olympiad – Shiksha Mahakumbh 6.0</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          A nationwide academic initiative to identify and nurture young talent, promoting excellence, analytical thinking, and national-level recognition.
        </p>
      </header>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Objectives</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Encourage academic excellence</li>
          <li>Promote analytical thinking</li>
          <li>Strengthen subject competencies</li>
          <li>Provide national recognition</li>
          <li>Build strong academic foundation</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {["English Olympiad", "Maths Olympiad", "Tech Olympiad", "Sanskriti Olympiad"].map((sub, i) => (
          <div key={i} className="bg-white border p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold">DHE {sub}</h4>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
        <p className="text-gray-700">Classes 1–10 | Participation through schools</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Exam Format</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>School-based (Online/Offline)</li>
          <li>Objective questions</li>
          <li>Concept-based assessment</li>
          <li>Class-wise papers</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Participation Process</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
          <li>School Registration</li>
          <li>Student Enrollment</li>
          <li>Conduct in School</li>
          <li>Evaluation</li>
          <li>Results</li>
        </ol>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Recognition & Awards</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Participation Certificates</li>
          <li>Merit Certificates</li>
          <li>Top achievers felicitated</li>
          <li>National recognition</li>
        </ul>
      </div>

      <div className="text-center mt-6">
        <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Register Your School
        </button>
      </div>
    </>
  );
}

function ExhibitionPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Exhibition – Shiksha Mahakumbh 6.0</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          A dynamic showcase of innovation, culture, sustainability, and institutional excellence bringing together students, universities, and organizations.
        </p>
      </header>

      <div className="mb-6 p-4 border rounded-xl bg-white shadow-sm">
        <h3 className="text-lg font-semibold">Theme</h3>
        <p className="mt-1 font-medium">"Shiksha, Prakriti aur Pragati"</p>
        <p className="text-sm text-gray-600">Educating for Development and Harmony with Nature</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {["Student Projects Zone", "University & Institutional Stalls", "Laboratory & Research Displays", "Best Practices Pavilion", "Cultural Theme Stalls", "State Representation Zone", "Organizations & NGO Stalls", "Host Institution Showcase"].map((item, i) => (
          <div key={i} className="bg-white border p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold">{item}</h4>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Participants</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Students (School & College)</li>
          <li>Universities & Institutions</li>
          <li>Research Labs & Innovators</li>
          <li>NGOs & Organizations</li>
          <li>State Representatives</li>
          <li>Cultural Groups</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Objectives</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Showcase innovation and creativity</li>
          <li>Highlight best practices</li>
          <li>Promote collaboration</li>
          <li>Integrate culture, science, and sustainability</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Opportunities & Recognition</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Participation Certificates</li>
          <li>Recognition for outstanding exhibits</li>
          <li>Networking opportunities</li>
          <li>National-level exposure</li>
        </ul>
      </div>

      <div className="bg-white p-4 border rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold">Exhibition Dates</h3>
        <p className="text-gray-700 mt-1">9–11 October 2026 | NIT Hamirpur</p>
      </div>

      <div className="text-center mt-6">
        <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Apply for Exhibition Stall
        </button>
      </div>
    </>
  );
}

function ProjectsPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Student Projects – Shiksha Mahakumbh 6.0</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          A national platform to nurture innovation, creativity, and problem-solving by enabling students to turn ideas into impactful, real-world solutions aligned with Viksit Bharat 2047.
        </p>
      </header>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Objectives</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Promote innovation-driven learning</li>
          <li>Encourage research & practical application</li>
          <li>Identify and nurture young talent</li>
          <li>Provide a national showcase platform</li>
          <li>Connect students with mentors & institutions</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold">School Level</h3>
          <p className="text-sm text-gray-600 mt-1">Classes 6–10 | Models, basic innovation, problem-solving ideas</p>
        </div>
        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold">College Level</h3>
          <p className="text-sm text-gray-600 mt-1">UG / PG | Advanced projects, research, prototypes</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {["Science & Innovation", "AI, Robotics & Emerging Technologies", "Environment & Sustainability", "Health & Well-being", "Agriculture & Rural Development", "Indian Knowledge Systems (IKS)", "Social Innovation & Public Solutions", "Engineering & Applied Technology"].map((theme, i) => (
          <div key={i} className="bg-white border p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold">{theme}</h4>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Submission Guidelines</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Project Abstract (200–300 words)</li>
          <li>Detailed Report / Documentation</li>
          <li>Short Video Demo (2–5 minutes)</li>
          <li>Images / Prototype (if available)</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Selection Process</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
          <li>Registration & Submission</li>
          <li>Initial Screening</li>
          <li>Expert Evaluation</li>
          <li>Shortlisting</li>
          <li>Final Showcase</li>
        </ol>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Recognition & Benefits</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Certificates for all participants</li>
          <li>Awards for top projects</li>
          <li>Presentation before experts</li>
          <li>Mentorship & institutional support</li>
          <li>Website & exhibition feature</li>
        </ul>
      </div>

      <div className="bg-white p-4 border rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold">Final Showcase</h3>
        <p className="text-gray-700 mt-1">9–11 October 2026 | NIT Hamirpur</p>
      </div>

      <div className="text-center mt-6">
        <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Submit Your Project
        </button>
      </div>
    </>
  );
}

function BestPracticesPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Best Practices – Shiksha Mahakumbh 6.0</h1>
        <p className="text-sm text-gray-500 mb-1">From Grassroots to Global Excellence</p>
        <p className="text-gray-600 mt-2 max-w-3xl">
          A revolutionary, inclusive platform inviting impactful practices from individuals, institutions, and communities—celebrating real-world innovation and solutions that drive Viksit Bharat 2047.
        </p>
      </header>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-3">Who Can Participate?</h3>
        <div className="grid md:grid-cols-2 gap-3 text-gray-700">
          {["Educational Institutions", "Startups & Entrepreneurs", "Organizations / NGOs / CSR", "Teachers & Professionals", "Students", "Small Businesses & Vendors", "Artisans & Skilled Workers", "Farmers & Rural Innovators", "Sanitation & Waste Innovators", "Individual Change-makers", "International Participants"].map((item, i) => (
            <div key={i} className="border p-3 rounded-lg">{item}</div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {["Individual", "Institutional", "Startup/Business", "Community", "National & International"].map((lvl, i) => (
          <div key={i} className="bg-white border p-4 rounded-xl text-center font-medium shadow-sm">{lvl}</div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">What Qualifies as a Best Practice?</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Innovation in solving real-life problems</li>
          <li>Measurable impact</li>
          <li>Practical implementation</li>
          <li>Scalability & replication</li>
          <li>Contribution to Viksit Bharat 2047</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {["Education & Learning", "Business & Entrepreneurship", "Social Impact", "Agriculture & Rural", "Technology & Innovation", "Health & Wellness", "Environment & Sustainability", "Culture & Skills", "Livelihood Models"].map((d, i) => (
          <div key={i} className="bg-white border p-3 rounded-lg shadow-sm">{d}</div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Submission Format</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Title & Participant Details</li>
          <li>Problem Addressed</li>
          <li>Description & Implementation</li>
          <li>Impact & Outcomes</li>
          <li>Scalability</li>
          <li>Supporting Proof</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Evaluation Criteria</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Innovation & Creativity</li>
          <li>Impact</li>
          <li>Sustainability</li>
          <li>Inclusivity</li>
          <li>Scalability</li>
          <li>Practicality</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Recognition & Opportunities</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>National & International Recognition</li>
          <li>Best Practice Awards</li>
          <li>Certificates</li>
          <li>Presentation Opportunity</li>
          <li>Exhibition Stall</li>
          <li>Publication in Compendium</li>
        </ul>
      </div>

      <div className="p-4 border rounded-xl bg-gray-50 mb-6">
        <h3 className="text-lg font-semibold">Vision</h3>
        <p className="text-gray-700 mt-1">
          Building a people's movement of innovation where every citizen contributes to nation-building and every idea gets a platform.
        </p>
      </div>

      <div className="text-center mt-6">
        <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Submit Your Best Practice
        </button>
      </div>
    </>
  );
}

function PatrikaPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Bal Shodh Patrika – Shiksha Mahakumbh 6.0</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          A unique initiative to nurture research, inquiry, and innovation among school students by providing a national platform for structured academic writing and publication.
        </p>
      </header>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Objectives</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Develop research aptitude</li>
          <li>Promote critical thinking</li>
          <li>Encourage documentation of ideas</li>
          <li>Enable academic publication</li>
          <li>Inspire innovation & knowledge creation</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold">Section 1</h3>
          <p className="text-sm text-gray-600 mt-1">Classes 9–10 | Basic research & project documentation</p>
        </div>
        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold">Section 2</h3>
          <p className="text-sm text-gray-600 mt-1">Classes 11–12 | Advanced research & analytical studies</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {["Viksit Bharat 2047", "Environment & Sustainability", "AI & Future Tech", "Agriculture & Rural Development", "Indian Knowledge Systems", "Science Discoveries", "Social Issues & Solutions", "Global Challenges"].map((theme, i) => (
          <div key={i} className="bg-white border p-3 rounded-lg shadow-sm">{theme}</div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Submission Format</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Research Paper (800–1500 words)</li>
          <li>Abstract (150–200 words)</li>
          <li>Data / Case Study (if applicable)</li>
          <li>Diagrams / Images</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Review & Selection</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
          <li>Submission</li>
          <li>Screening</li>
          <li>Expert Review</li>
          <li>Selection</li>
          <li>Publication</li>
        </ol>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Recognition & Benefits</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Publication in Student Research Journal</li>
          <li>Certificates</li>
          <li>Special recognition</li>
          <li>Presentation opportunity</li>
          <li>Mentorship exposure</li>
        </ul>
      </div>

      <div className="text-center mt-6">
        <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Submit Research Paper
        </button>
      </div>
    </>
  );
}

function CulturalPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Cultural Program – Shiksha Mahakumbh 6.0</h1>
        <p className="text-gray-600 mt-2 max-w-3xl">
          Celebrating the vibrant spirit of Indian culture with a blend of Himachali traditions and theme-based creative expressions that connect education, sustainability, and contemporary thought.
        </p>
      </header>

      <div className="mb-6 p-4 border rounded-xl bg-white shadow-sm">
        <h3 className="text-lg font-semibold">Theme</h3>
        <p className="mt-1 font-medium">"Shiksha, Prakriti aur Pragati"</p>
        <p className="text-sm text-gray-600">Educating for Development and Harmony with Nature</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {["Folk Performances (Himachal Heritage)", "Classical & Contemporary Dance", "Theme-based Skits & Drama", "Eco-conscious Performances", "Music & Creative Expressions"].map((item, i) => (
          <div key={i} className="bg-white border p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold">{item}</h4>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Participation</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>School & College Students</li>
          <li>Cultural Teams & Institutions</li>
          <li>Independent Performers</li>
          <li>Folk Artists (Local Representation)</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Objectives</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Promote Indian culture and heritage</li>
          <li>Encourage creative expression</li>
          <li>Integrate education with cultural values</li>
          <li>Highlight sustainability through art</li>
        </ul>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-2">Opportunities & Recognition</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Certificates of Participation</li>
          <li>Special Recognition</li>
          <li>National Stage Performance</li>
          <li>Exposure to leaders & experts</li>
        </ul>
      </div>

      <div className="bg-white p-4 border rounded-xl shadow-sm mb-6">
        <h3 className="text-lg font-semibold">Event Schedule</h3>
        <p className="text-gray-700 mt-1">9–11 October 2026 | NIT Hamirpur</p>
        <p className="text-sm text-gray-500">Detailed schedule to be announced</p>
      </div>

      <div className="text-center mt-6">
        <button className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Register for Cultural Program
        </button>
      </div>
    </>
  );
}

// ─── SIDEBAR CONFIG ───────────────────────────────────────────────────────────

type PageId =
  | "ConferencePage"
  | "ConclavePage"
  | "AwardsPage"
  | "OlympiadPage"
  | "ExhibitionPage"
  | "ProjectsPage"
  | "BestPracticesPage"
  | "PatrikaPage"
  | "CulturalPage";

const pages: { id: PageId; label: string }[] = [
  { id: "ConferencePage",    label: "Conference" },
  { id: "ConclavePage",      label: "Conclave" },
  { id: "AwardsPage",        label: "Awards" },
  { id: "OlympiadPage",      label: "Olympiad" },
  { id: "ExhibitionPage",    label: "Exhibition" },
  { id: "ProjectsPage",      label: "Projects" },
  { id: "BestPracticesPage", label: "Best Practices" },
  { id: "PatrikaPage",       label: "Bal Shodh Patrika" },
  { id: "CulturalPage",      label: "Cultural Program" },
];

const pageMap: Record<PageId, React.ReactElement> = {
  ConferencePage:    <ConferencePage />,
  ConclavePage:      <ConclavePage />,
  AwardsPage:        <AwardsPage />,
  OlympiadPage:      <OlympiadPage />,
  ExhibitionPage:    <ExhibitionPage />,
  ProjectsPage:      <ProjectsPage />,
  BestPracticesPage: <BestPracticesPage />,
  PatrikaPage:       <PatrikaPage />,
  CulturalPage:      <CulturalPage />,
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function AcademicCouncilDashboard() {
  const [active, setActive] = useState<PageId>("ConferencePage");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar – desktop */}
      <aside className="w-64 bg-white border-r p-4 hidden md:flex flex-col">
        <h2 className="text-xl font-bold mb-6">Academic Council</h2>
        <nav className="space-y-1">
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                active === p.id
                  ? "bg-black text-white font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <span className="font-bold">Academic Council</span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-sm border px-3 py-1 rounded"
        >
          {menuOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 z-40 bg-white border-b shadow-lg px-4 py-3">
          <nav className="space-y-1">
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => { setActive(p.id); setMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  active === p.id
                    ? "bg-black text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {p.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 pt-16 md:pt-6 max-w-5xl">
        {pageMap[active]}
      </main>
    </div>
  );
}
