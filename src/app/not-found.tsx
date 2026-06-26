import Link from "next/link";
import NavBarShell from "@/components/layout/navbar/NavBarShell";
import { NAV_MENUS } from "@/constants/navigation";
import { DynamicFooter } from "@/components/layout/SiteDynamicChrome";

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
            href="/registration"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand-saffron px-5 py-2.5 text-sm font-bold text-brand-saffron"
          >
            Register
          </Link>
        </div>
      </main>
      <DynamicFooter />
    </div>
  );
}
