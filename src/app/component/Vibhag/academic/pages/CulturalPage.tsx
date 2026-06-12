"use client";

import {
  ACPage,
  ACHero,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { culturalHighlights, participationGroups, culturalObjectives, culturalRecognitionBenefits } from "../academic-content-data";

export default function CulturalPage() {
  return (
    <ACPage>
      <ACHero
        accent="rose"
        title="🎭 Cultural Program – Shiksha Mahakumbh 6.0"
        subtitle={
          <p className="max-w-5xl mx-auto">
            Celebrating the vibrant spirit of Indian culture,
            traditions, and creative expression through inspiring
            performances that connect education, sustainability,
            and heritage.
          </p>
        }
      />

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

      <ACFooterStatement title="✨ Where Culture Meets Consciousness">
        Experience the harmony of tradition, creativity, and sustainability
        through inspiring cultural expressions at Shiksha Mahakumbh 6.0.
      </ACFooterStatement>

      <SectionCTA buttonText="प्रतिभागिता हेतु पंजीकरण करें" href={REG_LINKS.general} />
    </ACPage>
  );
}
