import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import {
  UPCOMING_EVENTS_BREADCRUMBS,
  UPCOMING_EVENTS_QUICK_LINKS,
} from "@/data/upcoming-events-hub";

export default function UpcomingEventsQuickLinks() {
  return (
    <div className="border-b border-brand-navy/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-5 md:px-8">
        <BreadcrumbNav
          items={UPCOMING_EVENTS_BREADCRUMBS.map((item, index, arr) => ({
            label: item.name,
            href: index < arr.length - 1 ? item.path : undefined,
          }))}
          className="mb-4"
        />
        <section
          aria-label="Upcoming events resources"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {UPCOMING_EVENTS_QUICK_LINKS.map((link) =>
            "external" in link && link.external ? (
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
      </div>
    </div>
  );
}
