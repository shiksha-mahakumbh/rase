import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { getPillarEntry, type PillarSlug } from "@/lib/knowledge-graph/pillar-registry";
import { getClustersForPillar } from "@/lib/knowledge-graph/topic-clusters";
import { getRelatedLinksForPillar } from "@/lib/knowledge-graph/internal-link-engine";
import { notFound } from "next/navigation";
import InternalLinksBlock from "./InternalLinksBlock";
import PillarJsonLd from "./PillarJsonLd";
import { brandPageHero } from "@/lib/page-heroes";

export default function PillarPageTemplate({ slug }: { slug: PillarSlug }) {
  const entry = getPillarEntry(slug);
  if (!entry) notFound();

  const clusters = getClustersForPillar(entry.id);
  const links = getRelatedLinksForPillar(entry.id, 4);

  return (
    <PublicPageShell
      hero={brandPageHero(entry.label, entry.tagline, "Education Pillar")}
      showCta={false}
      containerClassName="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16"
    >
      <PillarJsonLd entry={entry} />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
        <Link href="/" className="hover:text-brand-saffron">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/conferences" className="hover:text-brand-saffron">
          Conferences
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-brand-navy">{entry.label}</span>
      </nav>

      <p className="mt-6 leading-relaxed text-slate-700">{entry.intro}</p>

      {clusters.length > 0 && (
        <section className="mt-10" aria-labelledby="topic-clusters">
          <h2 id="topic-clusters" className="text-xl font-bold text-brand-navy">
            Topic clusters
          </h2>
          <ul className="mt-4 space-y-3">
            {clusters.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-slate-100 bg-white p-4"
              >
                <p className="font-semibold text-brand-navy">{c.label}</p>
                <p className="mt-1 text-sm text-slate-600">{c.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10">
        <InternalLinksBlock links={links.slice(0, 4)} title="Explore programmes & pages" />
      </div>
    </PublicPageShell>
  );
}
