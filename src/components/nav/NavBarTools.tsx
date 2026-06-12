"use client";

import dynamic from "next/dynamic";

const GlobalSearch = dynamic(() => import("@/components/search/GlobalSearch"), {
  ssr: false,
  loading: () => (
    <div
      className="h-10 w-32 animate-pulse rounded-lg bg-slate-100 xl:w-44"
      aria-hidden="true"
    />
  ),
});

const LanguageSwitcher = dynamic(
  () => import("@/components/i18n/LanguageSwitcher"),
  {
    ssr: false,
    loading: () => (
      <div className="h-9 w-16 animate-pulse rounded-lg bg-slate-100" aria-hidden="true" />
    ),
  }
);

const NavIntlProvider = dynamic(
  () => import("@/components/i18n/NavIntlProvider"),
  { ssr: false }
);

export default function NavBarTools({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "hidden lg:flex"}`}>
      {!compact && <GlobalSearch />}
      <NavIntlProvider>
        <LanguageSwitcher />
      </NavIntlProvider>
    </div>
  );
}
