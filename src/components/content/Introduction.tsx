"use client";

import Link from "next/link";
import { ABIYAN_PHOTO_FRAME } from "@/data/abhiyan-photo-frame";
import { PAST_EDITIONS } from "@/data/past-editions";

const PILLARS = [
  {
    title: "Whole-of-Society",
    desc: "Teachers, students, policymakers, industry, NGOs & media — one mission.",
    color: "border-brand-blue/30 bg-brand-blue/5",
  },
  {
    title: "NEP 2020",
    desc: "Policy implementation, school & higher education, innovation.",
    color: "border-brand-saffron/30 bg-brand-saffron/5",
  },
  {
    title: "Global Stage",
    desc: "Bharatiya knowledge traditions meeting world education discourse.",
    color: "border-brand-emerald/30 bg-brand-emerald/5",
  },
];

export default function Introduction() {
  const { patron, advisors, taglineHindi, dedication, introParagraphs } = ABIYAN_PHOTO_FRAME;

  const editions = [
    ...PAST_EDITIONS.map((e) => ({
      edition: e.edition,
      venue: e.venue,
      dates: e.dates,
      theme: e.theme,
      coreFocus: e.coreEssence,
      href: e.href,
      imageSrc: undefined,
      upcoming: false,
    })),
    {
      edition: "6.0",
      venue: "NIT Hamirpur",
      dates: "9–11 October 2026",
      theme: "Current Edition — Registration Open",
      coreFocus: "Delegates, researchers, and institutions welcome",
      href: "/upcoming-events",
      imageSrc: undefined,
      upcoming: true,
    },
  ];

  return (
    <div className="space-y-12 text-brand-navy">
      {/* Opening */}
      <section className="rounded-2xl border border-brand-saffron/20 bg-gradient-to-br from-white to-brand-surface-warm p-6 md:p-8">
        <p className="text-center text-sm italic text-slate-500">{dedication}</p>
        <p className="mt-2 text-center text-lg font-medium text-brand-navy md:text-xl">{taglineHindi}</p>
        <div className="mt-6 space-y-4 text-justify text-slate-600 leading-relaxed">
          {introParagraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </section>

      {/* Vision pillars */}
      <section>
        <h2 className="text-xl font-bold text-brand-navy md:text-2xl">Our Vision</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className={`rounded-xl border p-5 ${p.color}`}
            >
              <h3 className="font-bold text-brand-navy">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section>
        <h2 className="text-xl font-bold md:text-2xl">Leadership</h2>
        <div className="mt-4 rounded-2xl border border-brand-saffron/30 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-saffron-dark">
            संरक्षक (Patron)
          </p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-4 border-brand-saffron/40 bg-brand-blue/10 text-3xl font-bold text-brand-blue shadow-md">
              {patron.name.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-bold">{patron.name}</p>
              <p className="text-sm text-slate-600">
                {patron.role} · {patron.organization}
              </p>
              <p className="text-sm text-slate-500">{patron.nameEn}</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-blue">
          परामर्शदाता (Advisors)
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {advisors.map((a) => (
            <li
              key={a.name}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-brand-saffron/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-bold text-brand-blue">
                {a.name.charAt(0)}
              </div>
              <div>
                <span className="font-semibold">{a.name}</span>
                <span className="block text-xs text-slate-600">
                  {[a.role, a.organization].filter(Boolean).join(" · ")}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/abhiyaninphotoframe" className="font-semibold text-brand-blue hover:underline">
            View full Abhiyan Photo Frame (PDF) →
          </Link>
        </p>
      </section>

      {/* Editions */}
      <section>
        <h2 className="text-xl font-bold md:text-2xl">Major Editions</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {editions.map((e) => (
            <article
              key={e.edition}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                e.upcoming ? "border-brand-saffron/50 ring-2 ring-brand-saffron/20" : "border-slate-200"
              }`}
            >
              <div className="p-5">
                <p className="font-bold text-brand-saffron-dark">
                  शिक्षा महाकुंभ {e.edition} · {e.venue}
                  {e.upcoming ? (
                    <span className="ml-2 rounded-full bg-brand-saffron px-2 py-0.5 text-xs font-bold text-brand-navy">
                      Upcoming
                    </span>
                  ) : null}
                </p>
                <p className="text-sm text-slate-500">{e.dates}</p>
                <p className="mt-2 text-sm">
                  <strong>Theme:</strong> {e.theme}
                </p>
                <p className="text-sm text-slate-600">{e.coreFocus}</p>
                <Link
                  href={e.href}
                  className="mt-3 inline-block text-sm font-semibold text-brand-blue hover:underline"
                >
                  View edition {e.edition} →
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6">
          <Link href="/past-events" className="font-semibold text-brand-blue hover:underline">
            Explore full past editions archive →
          </Link>
        </p>
      </section>

      {/* Closing */}
      <section className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6 text-center md:p-8">
        <p className="text-slate-700">
          Shiksha Mahakumbh Abhiyan continues to evolve as a dynamic national and global movement —
          bridging vision with action, and ideas with impact.
        </p>
        <Link
          href="/registration"
          className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-brand-saffron px-6 py-2.5 text-sm font-bold text-brand-navy shadow-md hover:bg-brand-saffron-dark hover:text-white"
        >
          Register for Shiksha Mahakumbh 6.0
        </Link>
      </section>
    </div>
  );
}
