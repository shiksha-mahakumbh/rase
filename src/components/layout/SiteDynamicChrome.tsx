import dynamic from "next/dynamic";
import NavBarShell from "@/components/layout/navbar/NavBarShell";
import { NAV_MENUS } from "@/constants/navigation";

/** Deferred site chrome — footer only; NavBar is server-rendered via NavBarShell. */
export const DynamicFooter = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => (
    <div
      className="min-h-[16rem] w-full border-t border-slate-200 bg-brand-surface-warm"
      aria-hidden
    />
  ),
});

export function DefaultNavBarShell() {
  return <NavBarShell menus={NAV_MENUS} />;
}
