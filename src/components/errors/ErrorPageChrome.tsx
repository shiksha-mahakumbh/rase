"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicFooter = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => (
    <div className="min-h-[16rem] w-full border-t border-slate-200 bg-brand-surface-warm" aria-hidden />
  ),
});

/** Minimal chrome for client error boundary (NavBarShell is server-only). */
export default function ErrorPageChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-surface">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="text-sm font-bold text-brand-navy">
            Shiksha Mahakumbh
          </Link>
          <nav className="flex gap-3 text-sm font-semibold">
            <Link href="/" className="text-brand-navy hover:text-brand-saffron">
              Home
            </Link>
            <Link href="/registration" className="text-brand-saffron">
              Register
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <DynamicFooter />
    </div>
  );
}
