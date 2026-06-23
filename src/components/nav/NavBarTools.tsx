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

type NavBarToolsProps = {
  /** desktop: search + language (lg+); mobile: language only (<lg); always: both visible */
  visibility?: "desktop" | "mobile" | "always";
};

export default function NavBarTools({ visibility = "desktop" }: NavBarToolsProps) {
  const className =
    visibility === "desktop"
      ? "hidden lg:flex items-center gap-2"
      : visibility === "mobile"
        ? "flex lg:hidden items-center gap-2"
        : "flex items-center gap-2";

  return (
    <div className={className}>
      {visibility !== "mobile" && <GlobalSearch />}
      <NavIntlProvider>
        <LanguageSwitcher />
      </NavIntlProvider>
    </div>
  );
}
