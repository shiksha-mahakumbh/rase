"use client";

import {
  ACPage,
  ACHero,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { projectThemes, projectBenefits } from "../academic-content-data";

export default function ProjectsPage() {
  return (
    <ACPage>
      <ACHero
        accent="emerald"
        title="🚀 Student Projects – Shiksha Mahakumbh 6.0"
        subtitle={
          <p className="max-w-5xl mx-auto">
            A national-level innovation platform designed to nurture
            creativity, research, and problem-solving skills among
            students while contributing towards
            <span className="font-semibold">
              {" "}Viksit Bharat 2047
            </span>.
          </p>
        }
      />

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

      <ACFooterStatement title="✨ Be the Innovator of Tomorrow">
        Transform your ideas into impactful solutions and become a part of
        India&apos;s largest academic innovation movement.
      </ACFooterStatement>

      <SectionCTA buttonText="अपना विवरण प्रस्तुत करें" href={REG_LINKS.general} />
    </ACPage>
  );
}
