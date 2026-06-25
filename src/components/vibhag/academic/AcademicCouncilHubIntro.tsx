import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  ACADEMIC_COUNCIL_BREADCRUMBS,
  ACADEMIC_COUNCIL_HUB_STATS,
  ACADEMIC_COUNCIL_PAGE_HERO,
  ACADEMIC_COUNCIL_QUICK_LINKS,
} from "@/data/academic-council-hub";

const quickLinkClassName =
  "flex min-h-[44px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:bg-brand-surface-warm hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron";

export default function AcademicCouncilHubIntro() {
  return (
    <div className="border-b border-brand-navy/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <BreadcrumbNav
          items={ACADEMIC_COUNCIL_BREADCRUMBS.map((item, index, arr) => ({
            label: item.name,
            href: index < arr.length - 1 ? item.path : undefined,
          }))}
          className="mb-6"
        />

        <HubGradientBanner
          id="academic-council-hub-banner"
          titleAs="h1"
          eyebrow={ACADEMIC_COUNCIL_PAGE_HERO.eyebrow}
          title={ACADEMIC_COUNCIL_PAGE_HERO.title}
          subtitle={ACADEMIC_COUNCIL_PAGE_HERO.subtitle}
          stats={ACADEMIC_COUNCIL_HUB_STATS}
          footer={
            <p className="max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
              {ACADEMIC_COUNCIL_PAGE_HERO.tagline}
            </p>
          }
        />

        <section
          aria-label="Quick actions"
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ACADEMIC_COUNCIL_QUICK_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={quickLinkClassName}
              >
                {link.label}
                <span aria-hidden className="text-brand-saffron-dark">
                  ↗
                </span>
              </a>
            ) : (
              <Link key={link.href} href={link.href} className={quickLinkClassName}>
                {link.label}
                <span aria-hidden className="text-brand-saffron-dark">
                  →
                </span>
              </Link>
            )
          )}
        </section>
      </div>
    </div>
  );
}
