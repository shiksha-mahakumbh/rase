import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  getVibhagHubConfig,
  vibhagHubBreadcrumbs,
} from "@/data/departments-hub";

type Props = { slug: string };

export default function DepartmentHubIntro({ slug }: Props) {
  const hub = getVibhagHubConfig(slug);
  if (!hub) return null;

  const breadcrumbs = vibhagHubBreadcrumbs(slug);

  return (
    <div className="border-b border-brand-navy/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <BreadcrumbNav
          items={breadcrumbs.map((item, index, arr) => ({
            label: item.name,
            href: index < arr.length - 1 ? item.path : undefined,
          }))}
          className="mb-6"
        />

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hub.quickLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
              >
                <span aria-hidden>{link.icon}</span>
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
              >
                <span aria-hidden>{link.icon}</span>
                {link.label}
              </Link>
            )
          )}
        </section>

        <div className="mt-6">
          <HubGradientBanner
            id={`${slug}-hub-banner`}
            titleAs="h1"
            eyebrow={hub.hero.eyebrow}
            title={
              <>
                {hub.hero.title}
                <span className="mt-1 block text-lg font-semibold text-brand-saffron md:text-xl">
                  {hub.hero.titleHindi}
                </span>
              </>
            }
            subtitle={hub.hero.subtitle}
            stats={hub.stats}
          />
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
          {hub.intro}
        </p>
      </div>
    </div>
  );
}
