import Link from "next/link";
import NavBarShell from "@/components/layout/navbar/NavBarShell";
import { NAV_MENUS } from "@/constants/navigation";
import { DynamicFooter } from "@/components/layout/SiteDynamicChrome";
import { ROUTES } from "@/constants/routes";

const POPULAR_404_LINKS = [
  { label: "Register for SMK 6.0", href: ROUTES.registration },
  { label: "My Registration", href: ROUTES.dashboard },
  { label: "Academic Council", href: ROUTES.academicCouncil },
  { label: "Past Editions", href: ROUTES.pastEvents },
  { label: "Search site", href: ROUTES.search },
  { label: "FAQ", href: ROUTES.faq },
] as const;

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBarShell menus={NAV_MENUS} />
      <main
        id="main-content"
        className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center"
      >
        <h1 className="home-section-title text-2xl md:text-3xl">Page not found</h1>
        <p className="mt-2 max-w-md text-sm text-slate-600 md:text-base">
          The page you requested does not exist or has moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-navy-light"
          >
            Home
          </Link>
          <Link
            href={ROUTES.registration}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand-saffron px-5 py-2.5 text-sm font-bold text-brand-saffron"
          >
            Register
          </Link>
        </div>
        <form action="/search" method="get" className="mt-8 flex w-full max-w-md gap-2">
          <label htmlFor="not-found-search" className="sr-only">
            Search site
          </label>
          <input
            id="not-found-search"
            name="q"
            type="search"
            placeholder="Search pages, FAQ, registration…"
            className="min-h-[44px] flex-1 rounded-xl border border-slate-200 px-4 text-sm"
          />
          <button
            type="submit"
            className="min-h-[44px] rounded-xl bg-brand-saffron px-5 text-sm font-bold text-brand-navy"
          >
            Search
          </button>
        </form>
        <ul className="mt-8 grid max-w-lg gap-2 text-sm sm:grid-cols-2">
          {POPULAR_404_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-semibold text-brand-navy hover:border-brand-saffron/40"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <DynamicFooter />
    </div>
  );
}
