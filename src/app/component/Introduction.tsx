"use client";

import Link from "next/link";

const EDITIONS = [
  {
    edition: "1.0",
    venue: "NIT Jalandhar",
    dates: "9–11 June 2023",
    theme: "Recent Advances in School Education",
    coreFocus: "A strong beginning in innovation within school education",
    href: "/past_event/sm23",
  },
  {
    edition: "2.0",
    venue: "NIT Kurukshetra",
    dates: "20 December 2023",
    theme: "Role of Academic-driven Startups in Economy",
    coreFocus: "From Education to Startups, Startups to Economy",
    href: "/past_event/sk23",
  },
  {
    edition: "3.0",
    venue: "NIT Srinagar",
    dates: "29–30 June 2024",
    theme: "Role of Academic-driven Startups in Developing Economy of J&K",
    coreFocus: "From Education to Enterprise, Enterprise to Regional Development",
    href: "/past_event/sk24",
  },
  {
    edition: "4.0",
    venue: "Kurukshetra University",
    dates: "16–17 December 2024",
    theme: "Indian Education System for Global Development",
    coreFocus: "Indian Education as a Global Solution",
    href: "/past_event/sm24",
  },
  {
    edition: "5.0",
    venue: "NIPER Mohali",
    dates: "31 October – 2 November 2025",
    theme: "Classroom to Society – Building a Healthier World through Education",
    coreFocus: "The Journey of Education from Classroom to Society",
    href: "/past_event/sm25",
  },
  {
    edition: "6.0",
    venue: "NIT Hamirpur",
    dates: "Upcoming",
    theme: "Current Edition",
    coreFocus: "Registration open for delegates, researchers, and institutions",
    href: "/upcoming-events",
    upcoming: true,
  },
];

export default function Introduction() {
  return (
    <article className="prose prose-slate max-w-none text-justify text-brand-navy">
      <h2 className="text-2xl font-bold text-brand-navy">
        Shiksha Mahakumbh Abhiyan: A People&apos;s Movement for Global Educational Transformation
      </h2>

      <p>
        Shiksha Mahakumbh Abhiyan is a visionary, multi-edition, multinational, and multidimensional
        movement conceptualized by a distinguished ISRO scientist and eminent author, and shaped under
        the guidance of visionary educationists and social reformers. The initiative brings together
        education, policy, industry, civil society, and youth on a shared platform to reimagine and
        strengthen the Bhartiya education system while positioning Bharat as a meaningful contributor
        to the global education discourse.
      </p>

      <p>
        Rooted in Bharatiya knowledge traditions and aligned with global educational contexts, the
        Abhiyan serves as a powerful platform for collaboration, innovation, and implementation. Its
        aspiration goes beyond national boundaries—envisioning education on a global stage, much like
        the Olympic spirit—where local experiences and global perspectives converge to shape the
        future of learning.
      </p>

      <p>
        At its core lies a pragmatic yet forward-looking vision: to build a global education ecosystem
        that is inclusive, interdisciplinary, ethical, and transformation-driven—deeply connected with
        the real needs of society.
      </p>

      <p>
        Each edition of the Mahakumbh extends beyond dialogue and deliberation. It generates concrete
        action plans, fosters institutional partnerships, and encourages community participation,
        ensuring sustainable and measurable impact.
      </p>

      <p>
        A distinctive strength of the Shiksha Mahakumbh Abhiyan is its Whole-of-Society approach,
        transcending academic boundaries to engage teachers, students, institutional leaders,
        policymakers, industry representatives, social organizations, and media in a unified mission.
      </p>

      <p>
        By positioning education as a catalyst for societal transformation, the movement calls for
        advancing with national consciousness and global responsibility.
      </p>

      <p>
        Each edition builds upon the achievements of the previous one, creating a continuous chain of
        innovation and implementation.
      </p>

      <h3 className="mt-8 text-xl font-bold text-brand-navy">Major Editions</h3>
      <ul className="list-none space-y-4 pl-0">
        {EDITIONS.filter((e) => !e.upcoming).map((e) => (
          <li key={e.edition} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="font-bold">
              🔹 {e.edition === "1.0" ? "First" : e.edition === "2.0" ? "Second" : e.edition === "3.0" ? "Third" : e.edition === "4.0" ? "Fourth" : "Fifth"} Edition – {e.venue} | {e.dates}
            </p>
            <p className="mt-1 text-sm">
              <strong>Theme:</strong> {e.theme}
            </p>
            <p className="text-sm">
              <strong>Core Focus:</strong> {e.coreFocus}
            </p>
            <Link href={e.href} className="mt-2 inline-block text-sm font-semibold text-brand-navy hover:underline">
              View शिक्षा महाकुंभ {e.edition} →
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6">
        Shiksha Mahakumbh Abhiyan continues to evolve as a dynamic national and global
        movement—bridging vision with action, and ideas with impact.
      </p>

      <p className="mt-4">
        <Link href="/abhiyan" className="font-semibold text-brand-navy hover:underline">
          Explore the full Abhiyan timeline →
        </Link>
      </p>
    </article>
  );
}
