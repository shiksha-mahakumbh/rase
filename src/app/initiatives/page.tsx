import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { PILLAR_REGISTRY } from "@/lib/knowledge-graph/pillar-registry";

import { brandPageHero } from "@/lib/page-heroes";

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
    <PublicPageShell
      hero={brandPageHero(
        "Initiatives",
        "Olympiads, awards, innovation tracks, and skill programmes under Shiksha Mahakumbh Abhiyan.",
        "National Programmes"
      )}
      relatedPath="/initiatives"
    >
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
          { label: "Initiatives" },
        ]}
        className="mb-8"
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initiatives.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.path}
              className="home-card-hover block h-full rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h2 className="text-lg font-bold text-brand-navy">{item.label}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </PublicPageShell>
  );
}
