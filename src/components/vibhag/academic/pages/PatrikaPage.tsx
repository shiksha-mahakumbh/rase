"use client";

import {
  ACPage,
  ACHero,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { patrikaSections, patrikaThemes, submissionFormats, patrikaBenefits } from "../academic-content-data";

export default function PatrikaPage() {
  return (
    <ACPage>
      <ACHero
        title="📘 Bal Shodh Patrika – Shiksha Mahakumbh 6.0"
        subtitle={
          <p className="max-w-5xl mx-auto">
            A unique academic initiative designed to nurture
            research, inquiry, innovation, and critical thinking
            among school students through structured academic
            publication and project-based learning.
          </p>
        }
      />

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

      <ACFooterStatement title="✨ Igniting Young Researchers">
        Bal Shodh Patrika is a step towards building a generation of young
        thinkers, researchers, and innovators who will shape the future of the
        nation.
      </ACFooterStatement>

      <SectionCTA buttonText="आवेदन करें" href={REG_LINKS.general} />
    </ACPage>
  );
}
