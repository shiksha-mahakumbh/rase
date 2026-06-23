import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { DONATION_BREADCRUMBS, DONATION_QUICK_LINKS } from "@/data/donation-hub";

export default function DonationQuickLinks() {
  return (
    <div className="border-b border-brand-navy/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-5 md:px-8">
        <BreadcrumbNav
          items={DONATION_BREADCRUMBS.map((item, index, arr) => ({
            label: item.name,
            href: index < arr.length - 1 ? item.path : undefined,
          }))}
          className="mb-4"
        />
        <section
          aria-label="Donation resources"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {DONATION_QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
            >
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
