import Link from "next/link";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { PILLAR_REGISTRY } from "@/lib/knowledge-graph/pillar-registry";

const INITIATIVE_SLUGS = [
  "innovation",
  "olympiad",
  "awards",
  "skill-development",
  "teacher-development",
  "student-development",
  "educational-technology",
] as const;

const initiatives = PILLAR_REGISTRY.filter((p) =>
  (INITIATIVE_SLUGS as readonly string[]).includes(p.slug)
);

export default function InitiativesPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <ShowcaseHero
        eyebrow="National Programmes"
        title="DHE Initiatives"
        subtitle="Flagship programmes and national initiatives under the Department of Holistic Education and Shiksha Mahakumbh Abhiyan."
        accent="emerald"
      />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Education", href: "/education" },
            { label: "Initiatives" },
          ]}
          className="mb-10"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {initiatives.map((item) => (
            <Link
              key={item.slug}
              href={item.path}
              className="group flex min-h-[200px] flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-saffron/40 hover:shadow-lg"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-brand-saffron">
                Initiative
              </span>
              <h2 className="mt-2 text-xl font-bold text-brand-navy group-hover:text-brand-saffron">
                {item.label}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-600">{item.tagline}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                {item.intro}
              </p>
              <span className="mt-4 text-sm font-semibold text-brand-navy group-hover:text-brand-saffron">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
