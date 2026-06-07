"use client";

import {
  ACPage,
  ACHero,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { olympiadCategories, olympiadObjectives, examFeatures, participationSteps, olympiadBenefits } from "../academic-content-data";

export default function OlympiadPage() {
  return (
    <ACPage>
      <ACHero
        accent="purple"
        title="🏆 DHE Olympiad – Shiksha Mahakumbh 6.0"
        subtitle={
          <p className="max-w-5xl mx-auto">
            A nationwide academic initiative designed to
            identify, nurture, and celebrate young talent
            by promoting academic excellence, analytical
            thinking, and healthy competition among students.
          </p>
        }
      />

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

      <ACFooterStatement title="✨ Empowering Young Minds">
        The DHE Olympiad is not just an examination, but a journey towards
        building confident, capable, and future-ready students for a stronger
        Bharat.
      </ACFooterStatement>

      <SectionCTA buttonText="प्रतिभागिता हेतु पंजीकरण करें" href={REG_LINKS.talent} />
    </ACPage>
  );
}
