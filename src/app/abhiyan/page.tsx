import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { PAST_EDITIONS, UPCOMING_EDITION } from "@/data/past-editions";
import { SITE_NAME_HINDI } from "@/config/site";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata = {
  title: `${SITE_NAME_HINDI} — Edition Timeline`,
  description:
    "Unified timeline of Shiksha Mahakumbh Abhiyan editions 1.0 through 6.0 — venues, themes, core focus, and key outcomes.",
};

const UPCOMING = {
  edition: UPCOMING_EDITION.edition,
  title: UPCOMING_EDITION.title,
  venue: UPCOMING_EDITION.venueFull ?? UPCOMING_EDITION.venue,
  dates: UPCOMING_EDITION.dates,
  theme: UPCOMING_EDITION.theme,
  coreEssence: UPCOMING_EDITION.coreEssence,
  impact: "Building on five completed editions toward the next national gathering.",
  href: UPCOMING_EDITION.href,
};

export default function AbhiyanPage() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: SITE_NAME_HINDI,
        title: "Edition Timeline",
        subtitle:
          "One movement, one identity — from शिक्षा महाकुंभ 1.0 to 6.0.",
        accent: "navy",
      }}
      relatedPath="/abhiyan"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: SITE_NAME_HINDI, path: "/abhiyan" },
        ]}
      />

      <p className="mb-8 text-center text-slate-600 md:text-lg">
        The {SITE_NAME_HINDI} unifies all national editions under a single brand. Explore each
        edition&apos;s year, venue, theme, core focus, and highlights.
      </p>

      <div className="space-y-6">
        {PAST_EDITIONS.map((e) => (
          <section
            key={e.id}
            id={`edition-${e.edition.replace(".", "-")}`}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-saffron">
                  Edition {e.edition} · {e.year}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-brand-navy">
                  शिक्षा महाकुंभ {e.edition}
                </h2>
                <p className="text-slate-600">{e.venueFull ?? e.venue}</p>
                <p className="text-sm text-slate-500">{e.dates}</p>
              </div>
              <Link
                href={e.href}
                className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                View edition
              </Link>
            </div>
            <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div>
                <dt className="font-semibold text-brand-navy">Theme</dt>
                <dd className="text-slate-700">{e.theme}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-navy">Core Focus</dt>
                <dd className="text-slate-700">{e.coreEssence}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-semibold text-brand-navy">Key Outcomes</dt>
                <dd className="text-slate-700">{e.impact}</dd>
              </div>
            </dl>
          </section>
        ))}

        <section
          id="edition-6-0"
          className="rounded-2xl border-2 border-brand-saffron bg-brand-saffron/5 p-6"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-saffron">
            Current Edition
          </p>
          <h2 className="mt-1 text-2xl font-bold text-brand-navy">{UPCOMING.title}</h2>
          <p className="text-slate-600">{UPCOMING.venue}</p>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div>
              <dt className="font-semibold text-brand-navy">Theme</dt>
              <dd>{UPCOMING.theme}</dd>
            </div>
            <div>
              <dt className="font-semibold text-brand-navy">Core Focus</dt>
              <dd>{UPCOMING.coreEssence}</dd>
            </div>
          </dl>
          <Link
            href={UPCOMING.href}
            className="mt-4 inline-block rounded-lg bg-brand-saffron px-5 py-2 text-sm font-bold text-brand-navy hover:opacity-90"
          >
            Register for 6.0 →
          </Link>
        </section>
      </div>

      <p className="mt-8 text-center">
        <Link href="/introduction" className="font-semibold text-brand-navy hover:underline">
          Read the full Abhiyan introduction
        </Link>
      </p>
    </PublicPageShell>
  );
}
