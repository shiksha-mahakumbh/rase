import Link from "next/link";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import { getPillarEntry, type PillarSlug } from "@/lib/knowledge-graph/pillar-registry";
import { getClustersForPillar } from "@/lib/knowledge-graph/topic-clusters";
import { getRelatedLinksForPillar } from "@/lib/knowledge-graph/internal-link-engine";
import { notFound } from "next/navigation";
import InternalLinksBlock from "./InternalLinksBlock";
import PillarJsonLd from "./PillarJsonLd";

export default function PillarPageTemplate({ slug }: { slug: PillarSlug }) {
  const entry = getPillarEntry(slug);
  if (!entry) notFound();

  const clusters = getClustersForPillar(entry.id);
  const links = getRelatedLinksForPillar(entry.id, 10);

  return (
    <div className="min-h-screen bg-brand-surface">
      <PillarJsonLd entry={entry} />
      <NavBar />
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
          <Link href="/" className="hover:text-brand-saffron">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/education" className="hover:text-brand-saffron">
            Education
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-brand-navy">{entry.label}</span>
        </nav>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-saffron">
            Education Pillar
          </p>
          <h1 className="mt-2 text-3xl font-bold text-brand-navy md:text-4xl">
            {entry.label}
          </h1>
          <p className="mt-2 text-lg font-medium text-slate-600">{entry.tagline}</p>
          <p className="mt-4 leading-relaxed text-slate-700">{entry.intro}</p>
        </header>

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
          <InternalLinksBlock links={links} title="Explore programmes & pages" />
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          <Link href="/registration" className="font-semibold text-brand-saffron hover:underline">
            Register for Shiksha Mahakumbh 6.0
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
