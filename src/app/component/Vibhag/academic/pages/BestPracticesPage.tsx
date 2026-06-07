"use client";

import {
  ACPage,
  ACHero,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { OpenBestPracticesSection } from "../OpenBestPracticesSection";
import { bestPracticeCategories, submissionRequirements, evaluationCriteria, recognitionBenefits } from "../academic-content-data";

export default function BestPracticesPage() {
  return (
    <ACPage>
      <OpenBestPracticesSection />

      <ACHero
        accent="emerald"
        title="🌟 Best Practices – Shiksha Mahakumbh 6.0"
      />

      {/* Overview */}
      <section className="max-w-7xl mx-auto py-14 px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">
            🌟 Overview
          </h2>

          <p className="text-lg leading-8 text-gray-700">
            The Best Practices Initiative at Shiksha Mahakumbh 6.0 aims to
            identify, showcase, and scale innovative, impactful, and replicable
            practices in education, governance, and community engagement. It
            provides a national platform for institutions and individuals to
            present their successful models that contribute towards quality
            education, inclusivity, and sustainable development.
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

      <ACFooterStatement title="✨ From Practice to Policy">
        This initiative aims to transform grassroots innovations into national
        models, creating a strong ecosystem of knowledge sharing and continuous
        improvement in education.
      </ACFooterStatement>

      <SectionCTA
        buttonText="अपना विवरण प्रस्तुत करें"
        href={REG_LINKS.general}
      />
    </ACPage>
  );
}
