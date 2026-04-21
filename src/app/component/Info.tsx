import React from "react";

const Info = () => {
  // Structured Data (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Shiksha Mahakumbh Abhiyan",
    description:
      "A global educational movement connecting policy, academia, industry, and society to transform education.",
    event: [
      {
        "@type": "Event",
        name: "First Edition – NIT Jalandhar",
        startDate: "2023-06-09",
        endDate: "2023-06-11",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      },
      {
        "@type": "Event",
        name: "Second Edition – NIT Kurukshetra",
        startDate: "2023-12-20",
      },
      {
        "@type": "Event",
        name: "Third Edition – NIT Srinagar",
        startDate: "2024-06-29",
        endDate: "2024-06-30",
      },
      {
        "@type": "Event",
        name: "Fourth Edition – Kurukshetra University",
        startDate: "2024-12-16",
        endDate: "2024-12-17",
      },
      {
        "@type": "Event",
        name: "Fifth Edition – NIPER Mohali",
        startDate: "2025-10-31",
        endDate: "2025-11-02",
      },
    ],
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Card Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12">

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-[#502a2a] leading-snug mb-6">
          Shiksha Mahakumbh Abhiyan:
          <span className="block text-[#7a4343] mt-2">
            A People’s Movement for Global Educational Transformation
          </span>
        </h1>

        {/* Content */}
        <div className="space-y-5 text-gray-800 text-justify leading-relaxed text-[15.5px] md:text-base">

          <p>
            <strong>Shiksha Mahakumbh Abhiyan</strong> is a <strong>visionary, multi-edition, multinational, and multidimensional movement</strong> conceptualized by a distinguished ISRO scientist and eminent author, and shaped under the guidance of visionary educationists and social reformers. The initiative brings together <strong>education, policy, industry, civil society, and youth</strong> on a shared platform to reimagine and strengthen the <strong>Bhartiya education system</strong> while positioning <strong>Bharat</strong> as a meaningful contributor to the global education discourse.
          </p>

          <p>
            Rooted in <strong>Bharatiya knowledge traditions</strong> and aligned with global educational contexts, the Abhiyan serves as a <strong>powerful platform for collaboration, innovation, and implementation</strong>. Its aspiration goes beyond national boundaries—envisioning education on a global stage, much like the Olympic spirit—where local experiences and global perspectives converge to shape the future of learning.
          </p>

          <p>
            At its core lies a <strong>pragmatic yet forward-looking vision</strong>: to build a global education ecosystem that is <strong>inclusive, interdisciplinary, ethical, and transformation-driven</strong>—deeply connected with the real needs of society.
          </p>

          <p>
            Each edition of the Mahakumbh extends beyond dialogue and deliberation. It generates <strong>concrete action plans</strong>, fosters <strong>institutional partnerships</strong>, and encourages <strong>community participation</strong>, ensuring sustainable and measurable impact.
          </p>

          <p>
            A distinctive strength of the Shiksha Mahakumbh Abhiyan is its <strong>Whole-of-Society approach</strong>, transcending academic boundaries to engage teachers, students, institutional leaders, policymakers, industry representatives, social organizations, and media in a unified mission.
          </p>

          <p>
            By positioning education as a <strong>catalyst for societal transformation</strong>, the movement calls for advancing with <strong>national consciousness and global responsibility</strong>.
          </p>

          <p>
            Each edition builds upon the achievements of the previous one, creating a <strong>continuous chain of innovation and implementation</strong>.
          </p>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-gray-200"></div>

        {/* Major Editions */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#502a2a] mb-8">
          Major Editions
        </h2>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {[
            {
              title: "First Edition – NIT Jalandhar",
              date: "9–11 June 2023",
              theme: "Recent Advances in School Education",
              focus: "A strong beginning in innovation within school education",
            },
            {
              title: "Second Edition – NIT Kurukshetra",
              date: "20 December 2023",
              theme: "Role of Academic-driven Startups in Economy",
              focus: "From Education to Startups, Startups to Economy",
            },
            {
              title: "Third Edition – NIT Srinagar",
              date: "29–30 June 2024",
              theme: "Role of Academic-driven Startups in Developing Economy of J&K",
              focus: "From Education to Enterprise, Enterprise to Regional Development",
            },
            {
              title: "Fourth Edition – Kurukshetra University",
              date: "16–17 December 2024",
              theme: "Indian Education System for Global Development",
              focus: "Indian Education as a Global Solution",
            },
            {
              title: "Fifth Edition – NIPER Mohali",
              date: "31 October – 2 November 2025",
              theme: "Classroom to Society – Building a Healthier World through Education",
              focus: "The Journey of Education from Classroom to Society",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl border border-gray-200 bg-gradient-to-br from-[#fff7f7] to-[#f5f0f0] shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-[#502a2a] text-lg mb-1">
                🔹 {item.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{item.date}</p>
              <p>
                <strong>Theme:</strong> {item.theme}
              </p>
              <p>
                <strong>Core Focus:</strong> {item.focus}
              </p>
            </div>
          ))}
        </div>

        {/* Closing Statement */}
        <p className="mt-10 text-center text-lg font-semibold text-[#502a2a]">
          Shiksha Mahakumbh Abhiyan continues to evolve as a dynamic national and global movement—bridging vision with action, and ideas with impact.
        </p>

      </div>
    </section>
  );
};

export default Info;
