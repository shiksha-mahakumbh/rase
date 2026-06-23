import dynamic from "next/dynamic";

/** Deferred site chrome — matches HomePage pattern to keep Nav/Footer off the critical path. */
export const DynamicNavBar = dynamic(() => import("@/components/layout/NavBar"), {
  loading: () => (
    <div
      className="h-16 w-full border-b border-slate-200 bg-white/95"
      aria-hidden
    />
  ),
});

export const DynamicFooter = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => (
    <div
      className="min-h-[16rem] w-full border-t border-slate-200 bg-brand-surface-warm"
      aria-hidden
    />
  ),
});
