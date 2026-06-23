import Image from "next/image";
import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { ABIYAN_PHOTO_FRAME } from "@/data/abhiyan-photo-frame";
import {
  INTRODUCTION_CLOSING,
  INTRODUCTION_HERO,
  INTRODUCTION_HERO_IMAGE,
  INTRODUCTION_MEETING_TAGLINE,
  INTRODUCTION_OBJECTIVES,
  INTRODUCTION_PARAGRAPHS,
  INTRODUCTION_QUICK_LINKS,
  INTRODUCTION_SECTION_NAV,
  INTRODUCTION_STATS,
} from "@/data/introduction-content";
import { PAST_EDITIONS, UPCOMING_EDITION } from "@/data/past-editions";

function initials(name: string) {
  const trimmed = name.replace(/^[\s\d./]+/, "");
  return trimmed.charAt(0) || "?";
}

function SectionHeading({
  id,
  headingId,
  title,
  description,
}: {
  id: string;
  headingId: string;
  title: string;
  description?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 id={headingId} className="text-xl font-bold text-brand-navy md:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">{description}</p>
      ) : null}
    </div>
  );
}

export default function Introduction() {
  const { patron, advisors, coordinators, dedication, introParagraphs, taglineHindi } =
    ABIYAN_PHOTO_FRAME;

  const editions = [
    ...PAST_EDITIONS.map((e) => ({
      edition: e.edition,
      title: e.title,
      venue: e.venue,
      dates: e.dates,
      theme: e.theme,
      coreFocus: e.coreEssence,
      href: e.href,
      imageSrc: e.imageSrc ?? INTRODUCTION_HERO_IMAGE,
      imageAlt: `${e.title} — ${e.venue} ${e.year}`,
      upcoming: false,
    })),
    {
      edition: UPCOMING_EDITION.edition,
      title: UPCOMING_EDITION.title,
      venue: UPCOMING_EDITION.venue,
      dates: UPCOMING_EDITION.dates,
      theme: UPCOMING_EDITION.theme,
      coreFocus: UPCOMING_EDITION.coreEssence,
      href: UPCOMING_EDITION.registrationHref,
      imageSrc: INTRODUCTION_HERO_IMAGE,
      imageAlt: `${UPCOMING_EDITION.title} — ${UPCOMING_EDITION.venue} 2026`,
      upcoming: true,
    },
  ];

  return (
    <div className="space-y-12 md:space-y-16">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/introduction" },
          { label: "Introduction" },
        ]}
        className="-mt-2 mb-2"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {INTRODUCTION_QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
          >
            <span aria-hidden>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

      <section id="overview" className="scroll-mt-24" aria-labelledby="overview-heading">
        <div className="relative overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-surface-warm via-white to-brand-blue/5 p-6 shadow-sm md:p-8">
          <div
            className="brand-grid-pattern pointer-events-none absolute inset-0 opacity-20"
            aria-hidden
          />
          <div className="relative">
            <p className="text-center text-sm italic text-slate-500">{dedication}</p>
            <h2
              id="overview-heading"
              className="mt-4 text-center text-2xl font-bold leading-tight text-brand-navy md:text-3xl"
            >
              {INTRODUCTION_HERO.tagline}
            </h2>

            <aside
              className="mt-6 rounded-xl border border-brand-saffron/25 bg-brand-saffron/5 p-4 md:p-5"
              lang="hi"
              aria-label="Hindi introduction"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-brand-saffron-dark">
                हिंदी में — परिचय
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 md:text-base">
                {taglineHindi}
              </p>
              <div className="mt-3 space-y-2">
                {introParagraphs.map((p) => (
                  <p key={p.slice(0, 32)} className="text-sm leading-relaxed text-slate-600">
                    {p}
                  </p>
                ))}
              </div>
            </aside>

            <div className="mt-8 space-y-5">
              {INTRODUCTION_PARAGRAPHS.map((p, i) => (
                <p
                  key={p.slice(0, 48)}
                  className={`text-sm leading-relaxed text-slate-700 md:text-base ${
                    i === 0 ? "text-base font-medium text-brand-navy md:text-lg" : "text-justify"
                  }`}
                >
                  {p}
                </p>
              ))}
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {INTRODUCTION_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/80 bg-white/80 px-3 py-4 text-center shadow-sm backdrop-blur-sm"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-xl font-bold text-brand-navy sm:text-2xl">{stat.value}</dd>
                  <dd className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">{stat.hint}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/registration"
                className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-saffron px-5 py-2.5 text-sm font-bold text-brand-navy shadow-md transition hover:bg-brand-saffron-dark hover:text-white"
              >
                Register for SMK 6.0
              </Link>
              <Link
                href={ABIYAN_PHOTO_FRAME.pagePath}
                className="inline-flex min-h-[44px] items-center rounded-xl border border-brand-navy/30 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/5"
              >
                Abhiyan Photo Frame
              </Link>
              <Link
                href="/past-events"
                className="inline-flex min-h-[44px] items-center rounded-xl border border-brand-blue/30 px-5 py-2.5 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/5"
              >
                Past Editions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav
        aria-label="Page sections"
        className="sticky top-[4.5rem] z-20 -mx-1 overflow-x-auto rounded-xl border border-slate-200/80 bg-white/95 px-2 py-2 shadow-sm backdrop-blur-md md:top-20"
      >
        <ul className="flex min-w-max gap-2 px-1">
          {INTRODUCTION_SECTION_NAV.map((item) => (
            <li key={item.id}>
              <a
                href={item.id === "join" ? "/registration" : `#${item.id}`}
                className="inline-flex min-h-[36px] items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:bg-brand-saffron/15 sm:text-sm"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="objectives-heading">
        <div className="overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-navy/5 via-white to-brand-saffron/5 p-6 md:p-8">
          <p className="text-center text-sm font-semibold text-brand-navy">
            <span lang="hi">{INTRODUCTION_MEETING_TAGLINE.titleHi}</span>
            {" · "}
            {INTRODUCTION_MEETING_TAGLINE.titleEn} — {INTRODUCTION_MEETING_TAGLINE.subtitle}
          </p>

          <div className="mt-6">
            <SectionHeading
              id="objectives"
              headingId="objectives-heading"
              title="Our Objectives"
              description="हमारे उद्देश्य — Eight guiding aims that shape every Shiksha Mahakumbh edition and programme."
            />
          </div>

          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {INTRODUCTION_OBJECTIVES.map((item) => (
              <li
                key={item.number}
                className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-brand-saffron/35 hover:shadow-md md:p-5"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-saffron to-brand-saffron/80 text-sm font-bold text-brand-navy shadow-sm"
                  aria-hidden
                >
                  {item.number}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold leading-snug text-brand-navy">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="leadership-heading">
        <SectionHeading
          id="leadership"
          headingId="leadership-heading"
          title="Leadership"
          description="Patron and advisory council guiding the Abhiyan across editions and programmes."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <article className="lg:col-span-2 overflow-hidden rounded-2xl border border-brand-saffron/30 bg-gradient-to-br from-brand-saffron/10 to-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-saffron-dark">Patron</p>
            <div className="mt-4 flex items-start gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-brand-saffron/40 bg-white text-xl font-bold text-brand-navy shadow"
                aria-hidden
              >
                {initials(patron.name)}
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{patron.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {patron.role} · {patron.organization}
                </p>
                <p className="mt-1 text-sm text-slate-500">{patron.nameEn}</p>
              </div>
            </div>
          </article>

          <article className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-blue">Advisors</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {advisors.map((a) => (
                <li
                  key={a.name}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition hover:border-brand-saffron/30 hover:bg-white"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-bold text-brand-blue"
                    aria-hidden
                  >
                    {initials(a.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug text-brand-navy">{a.name}</p>
                    <p className="text-xs text-slate-600">
                      {[a.role, a.organization].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <Link
                href={ABIYAN_PHOTO_FRAME.pagePath}
                className="text-sm font-semibold text-brand-blue hover:underline"
              >
                View full Abhiyan Photo Frame (PDF) →
              </Link>
            </p>
          </article>
        </div>
      </section>

      <section id="coordinators" className="scroll-mt-24" aria-labelledby="coordinators-heading">
        <SectionHeading
          id="coordinators-inner"
          headingId="coordinators-heading"
          title="Core coordinators"
          description="Programme leads across conclaves, olympiad, exhibitions, and national outreach — from the Abhiyan Photo Frame."
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coordinators.map((c) => (
            <li
              key={c.name}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-saffron/30"
            >
              <p className="font-semibold text-brand-navy">{c.name}</p>
              <p className="mt-1 text-xs text-slate-600">
                {[c.role, c.organization].filter(Boolean).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="editions-heading">
        <SectionHeading
          id="editions"
          headingId="editions-heading"
          title="Major Editions"
          description="Five completed national editions and the upcoming Shiksha Mahakumbh 6.0 — each building on the last."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {editions.map((e) => (
            <article
              key={e.edition}
              className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                e.upcoming
                  ? "border-brand-saffron/50 ring-2 ring-brand-saffron/20"
                  : "border-slate-200 hover:border-brand-saffron/35"
              }`}
            >
              <div className="relative h-36 bg-slate-100">
                <Image
                  src={e.imageSrc}
                  alt={e.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div
                  className={`absolute inset-0 ${e.upcoming ? "bg-brand-saffron/40" : "bg-brand-navy/50"}`}
                />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-navy">
                      Edition {e.edition}
                    </span>
                    {e.upcoming ? (
                      <span className="rounded-full bg-brand-navy px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        Upcoming
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm font-bold line-clamp-1">{e.venue}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-bold text-brand-navy">{e.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{e.dates}</p>
                <p className="mt-2 text-sm font-medium text-brand-navy">
                  <span className="text-brand-saffron-dark">Theme:</span> {e.theme}
                </p>
                <p className="mt-1 flex-1 text-sm text-slate-600">{e.coreFocus}</p>
                <Link
                  href={e.href}
                  className="mt-4 inline-flex text-sm font-semibold text-brand-blue hover:underline"
                >
                  View edition {e.edition} →
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center sm:text-left">
          <Link href="/past-events" className="font-semibold text-brand-blue hover:underline">
            Explore full past editions archive →
          </Link>
        </p>
      </section>

      <section
        id="join"
        className="scroll-mt-24 overflow-hidden rounded-2xl border border-brand-blue/20 bg-gradient-to-br from-brand-blue/10 via-white to-brand-saffron/10 p-6 text-center md:p-10"
        aria-labelledby="join-heading"
      >
        <h2 id="join-heading" className="sr-only">
          Register for Shiksha Mahakumbh 6.0
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
          {INTRODUCTION_CLOSING}
        </p>
        <Link
          href="/registration"
          className="mt-6 inline-flex min-h-[48px] items-center rounded-xl bg-brand-saffron px-8 py-3 text-sm font-bold text-brand-navy shadow-lg transition hover:bg-brand-saffron-dark hover:text-white"
        >
          Register for Shiksha Mahakumbh 6.0
        </Link>
      </section>
    </div>
  );
}
