"use client";

import React from "react";
import {
  ACSection,
  ACCard,
  ACGlassPanel,
  ACObjectiveCard,
  ACTimelineStep,
} from "./AcademicCouncilUI";

/** Open & inclusive Best Practices platform — content preserved verbatim */
export function OpenBestPracticesSection() {
  return (
    <>
      <ACSection title="Open & Inclusive Platform — Overview">
        <ACGlassPanel>
          <p className="text-base leading-relaxed text-gray-700 md:leading-8">
            The Best Practices Platform at Shiksha Mahakumbh 6.0 is a
            revolutionary, inclusive and multi-level initiative that invites
            impactful practices from every section of society—from individuals to
            institutions, from grassroots workers to global organizations.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-700 md:leading-8">
            This platform recognizes that innovation is not limited to labs or
            universities, but exists in daily life, local solutions, and
            real-world problem solving.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="🎯 Who Can Participate? (Open for All)">
        <p className="mb-4 text-base text-gray-700">
          This platform is open to contributions from:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "🎓 Educational Institutions (Schools, Colleges, Universities)",
            "🚀 Startups & Entrepreneurs",
            "🏢 Organizations / NGOs / CSR Initiatives",
            "👨‍🏫 Teachers, Researchers, Professionals",
            "🧑‍🎓 Students (School & College Level)",
            "🛒 Small Businesses / Shopkeepers / Vendors / Street Entrepreneurs",
            "🛠 Skilled Workers / Artisans / Labour Workforce",
            "🌱 Farmers & Rural Innovators",
            "♻️ Sanitation Workers / Waste Management Innovators",
            "👤 Individual Change-makers (Any Citizen)",
            "🌐 International Participants (Global Best Practices)",
          ].map((item, i) => (
            <ACCard key={i} className="text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
        <p className="mt-4 text-base font-medium text-gray-800">
          👉 Anyone who has created a meaningful, innovative, or impactful
          practice can participate.
        </p>
      </ACSection>

      <ACSection title="🧩 Levels of Participation">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "🧑 Individual Level",
            "🏫 Institutional Level",
            "🚀 Startup / Business Level",
            "🤝 Organizational / Community Level",
            "🌍 National & International Level",
          ].map((item, i) => (
            <ACCard key={i}>{item}</ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="💡 What Qualifies as a Best Practice?">
        <p className="mb-4 text-base text-gray-700">
          Any initiative that demonstrates:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Innovation in solving real-life problems",
            "Positive social, educational, economic, or environmental impact",
            "Practical implementation (not just theory)",
            "Replicability or scalability",
            "Contribution towards Viksit Bharat 2047",
          ].map((item, i) => (
            <ACObjectiveCard key={i} index={i}>
              {item}
            </ACObjectiveCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="🗂 Broad Domains (Flexible & Open)">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Education & Learning Innovations",
            "Business & Entrepreneurship Models",
            "Social Impact & Community Development",
            "Agriculture & Rural Development",
            "Technology & Digital Innovation",
            "Health, Wellness & Lifestyle",
            "Environment & Sustainability",
            "Culture, Skills & Traditional Knowledge",
            "Livelihood & Self-Reliance Models",
          ].map((item, i) => (
            <ACCard key={i} className="text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
        <p className="mt-4 text-base text-gray-700">
          👉 Participants are free to submit practices beyond these categories as
          well.
        </p>
      </ACSection>

      <ACSection title="📂 Submission Format">
        <p className="mb-4 text-base text-gray-700">
          Participants need to submit:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Title of Practice",
            "Participant Name / Organization",
            "Category & Level (Individual / Institution / etc.)",
            "Problem Addressed",
            "Description of Practice",
            "Impact & Outcomes",
            "Scalability / Replication Scope",
            "Supporting Proof (Photos / Videos / Documents)",
          ].map((item, i) => (
            <ACCard key={i} className="text-sm">
              📄 {item}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="⚙️ Evaluation Criteria">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Innovation & Creativity",
            "Real-world Impact",
            "Sustainability",
            "Inclusivity",
            "Scalability",
            "Practical Implementation",
          ].map((item, i) => (
            <ACCard key={i} className="text-center text-sm md:text-base">
              ⭐ {item}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="🏆 Recognition & Opportunities">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "🌟 National & International Recognition",
            "🏅 Best Practice Awards (Multi-Level)",
            "📜 Certificates for All Selected Participants",
            "🎤 Opportunity to Present on National Platform",
            "🏢 Exhibition Stall at Shiksha Mahakumbh",
            "📘 Inclusion in Best Practices Compendium",
          ].map((item, i) => (
            <ACCard key={i} className="text-sm md:text-base">
              {item}
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="🌐 Exhibition & Showcase">
        <p className="mb-4 text-base text-gray-700">
          Selected practices will be showcased through:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Interactive Exhibition Stalls",
            "Live Demonstrations",
            "Digital Display & Case Studies",
            "Thematic Pavilions (Education, Rural, Innovation, etc.)",
          ].map((item, i) => (
            <ACCard key={i}>{item}</ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="✨ Vision Statement">
        <ACGlassPanel className="border-emerald-200/50 bg-gradient-to-br from-emerald-50/80 to-white">
          <p className="text-base leading-relaxed text-gray-800 md:leading-8">
            This initiative aims to create a People&apos;s Movement of Innovation,
            where every citizen becomes a contributor to nation-building, and
            every idea—small or big—gets a platform to inspire the world.
          </p>
        </ACGlassPanel>
      </ACSection>
    </>
  );
}

export default OpenBestPracticesSection;
