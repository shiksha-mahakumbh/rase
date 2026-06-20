"use client";

import {
  ACPage,
  ACHero,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { exhibitionSegments, exhibitionParticipants, exhibitionObjectives, exhibitionBenefits } from "../academic-content-data";

export default function ExhibitionPage() {
  return (
    <ACPage>
      <ACHero
        title="🏛️ Exhibition – Shiksha Mahakumbh 6.0"
        subtitle={
          <p className="max-w-5xl mx-auto">
            A dynamic showcase of innovation, culture,
            institutional excellence, and transformative ideas
            bringing together students, universities,
            organizations, and innovators on one platform.
          </p>
        }
      />

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

      <ACFooterStatement title="✨ A Confluence of Ideas & Innovation">
        Explore a vibrant ecosystem where education, innovation, culture, and
        sustainability come together at the Shiksha Mahakumbh 6.0 Exhibition.
      </ACFooterStatement>

      <SectionCTA buttonText="अभी जुड़ें" href={REG_LINKS.general} />
    </ACPage>
  );
}
