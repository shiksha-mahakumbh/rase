import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const LINKS = [
  { href: "#why-attend", label: "Why Attend" },
  { href: "#programmes", label: "Programme" },
  { href: "#conference-support", label: "Partners" },
  { href: "#speakers", label: "Speakers" },
  { href: "#venue", label: "Venue" },
  { href: "#faq", label: "FAQ" },
] as const;

/** Sticky in-page section shortcuts — mobile-first, no client JS. */
export default function HomeSectionNav() {
  return (
    <nav
      aria-label="Homepage sections"
      className="sticky top-[var(--nav-offset,3.5rem)] z-40 border-b border-brand-saffron/15 bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 md:px-8 md:py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full border border-brand-navy/10 bg-brand-surface px-3.5 py-1.5 text-xs font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:bg-brand-surface-warm hover:text-brand-saffron-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron md:text-sm"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href={ROUTES.registration}
          className="ml-auto shrink-0 rounded-full bg-brand-saffron px-4 py-1.5 text-xs font-bold text-brand-navy shadow-sm transition hover:bg-brand-saffron-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron md:text-sm"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
