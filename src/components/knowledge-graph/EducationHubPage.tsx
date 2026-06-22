import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
} from "@/lib/seo/schema";
import { EDUCATION_HUB_PROGRAMME_LINKS } from "@/lib/knowledge-graph/site-cleanup";
import { EDUCATION_PAGE_HERO, EDUCATION_STATS } from "@/data/education-hub";
import { SITE_URL } from "@/config/site";

export default function EducationHubPage() {
  const collection = buildCollectionPageSchema({
    name: "Shiksha Mahakumbh Programmes",
    description:
      "Registration, editions, workshops, publications, media, and academic programmes under Shiksha Mahakumbh Abhiyan.",
    path: "/education",
  });

  const itemList = buildItemListSchema({
    name: "Programmes & resources",
    items: EDUCATION_HUB_PROGRAMME_LINKS.map((link) => ({
      name: link.label,
      url: link.href.startsWith("http") ? link.href : `${SITE_URL}${link.href}`,
    })),
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Programmes", path: "/education" },
  ]);

  return (
    <PublicPageShell
      showHero={false}
      showCta={false}
      skipContainer
      relatedPath="/education"
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Programmes", path: "/education" },
      ]}
    >
      <JsonLd data={collection} />
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbs} />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
        <HubGradientBanner
          id="education-banner"
          eyebrow={EDUCATION_PAGE_HERO.eyebrow}
          title={EDUCATION_PAGE_HERO.title}
          subtitle={EDUCATION_PAGE_HERO.subtitle}
          stats={EDUCATION_STATS}
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {EDUCATION_HUB_PROGRAMME_LINKS.map((link) => {
            const external = link.href.startsWith("http");
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-saffron/40 hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-blue">
                    {link.label}
                    {external && <span className="ml-1 text-xs font-normal text-slate-400">↗</span>}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{link.description}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </PublicPageShell>
  );
}
