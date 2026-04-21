"use client";
import React, { useState } from "react";

const Info: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <section className="bg-gradient-to-br from-[#fff7f7] to-[#f5f0f0] px-6 py-8 rounded-2xl shadow-lg border border-[#e7dcdc] max-w-5xl mx-auto">
      
      {/* SEO Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-[#502a2a] text-center mb-6 leading-snug">
        Shiksha Mahakumbh Abhiyan: A People’s Movement for Global Educational Transformation
      </h1>

      <div className={`text-gray-800 leading-relaxed text-justify space-y-4 ${expanded ? "" : "line-clamp-6"}`}>
        
        <p>
        Shiksha Mahakumbh Abhiyan is a visionary, multi-edition, multinational, and multidimensional movement conceptualized by a distinguished ISRO scientist and eminent author, and shaped under the guidance of visionary educationists and social reformers. The initiative brings together education, policy, industry, civil society, and youth on a shared platform to reimagine and strengthen the Bhartiya education system while positioning Bharat as a meaningful contributor to the global education discourse.
        </p>

        <p>
        Rooted in Bharatiya knowledge traditions and aligned with global educational contexts, the Abhiyan serves as a powerful platform for collaboration, innovation, and implementation. Its aspiration goes beyond national boundaries—envisioning education on a global stage, much like the Olympic spirit—where local experiences and global perspectives converge to shape the future of learning.
        </p>

        <p>
        At its core lies a pragmatic yet forward-looking vision: to build a global education ecosystem that is inclusive, interdisciplinary, ethical, and transformation-driven—deeply connected with the real needs of society.
        </p>

        <p>
        Each edition of the Mahakumbh extends beyond dialogue and deliberation. It generates concrete action plans, fosters institutional partnerships, and encourages community participation, ensuring sustainable and measurable impact.
        </p>

        <p>
        A distinctive strength of the Shiksha Mahakumbh Abhiyan is its Whole-of-Society approach, transcending academic boundaries to engage teachers, students, institutional leaders, policymakers, industry representatives, social organizations, and media in a unified mission.
        </p>

        <p>
        By positioning education as a catalyst for societal transformation, the movement calls for advancing with national consciousness and global responsibility.
        </p>

        <p>
        Each edition builds upon the achievements of the previous one, creating a continuous chain of innovation and implementation.
        </p>

        {/* Divider */}
        <hr className="my-4 border-gray-300" />

        <h2 className="text-xl font-semibold text-[#502a2a]">
          Major Editions
        </h2>

        <ul className="space-y-3">
          <li>🔹 First Edition – NIT Jalandhar | 9–11 June 2023<br/>Theme: Recent Advances in School Education<br/>Core Focus: A strong beginning in innovation within school education</li>

          <li>🔹 Second Edition – NIT Kurukshetra | 20 December 2023<br/>Theme: Role of Academic-driven Startups in Economy<br/>Core Focus: From Education to Startups, Startups to Economy</li>

          <li>🔹 Third Edition – NIT Srinagar | 29–30 June 2024<br/>Theme: Role of Academic-driven Startups in Developing Economy of J&amp;K<br/>Core Focus: From Education to Enterprise, Enterprise to Regional Development</li>

          <li>🔹 Fourth Edition – Kurukshetra University | 16–17 December 2024<br/>Theme: Indian Education System for Global Development<br/>Core Focus: Indian Education as a Global Solution</li>

          <li>🔹 Fifth Edition – NIPER Mohali | 31 October – 2 November 2025<br/>Theme: Classroom to Society – Building a Healthier World through Education<br/>Core Focus: The Journey of Education from Classroom to Society</li>
        </ul>

        <hr className="my-4 border-gray-300" />

        <p className="font-semibold text-center text-[#502a2a]">
        Shiksha Mahakumbh Abhiyan continues to evolve as a dynamic national and global movement—bridging vision with action, and ideas with impact.
        </p>
      </div>

      {/* Toggle Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-6 py-2 bg-[#502a2a] text-white rounded-full shadow-md hover:bg-[#7a4343] transition duration-300"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      </div>
    </section>
  );
};

export default Info;
