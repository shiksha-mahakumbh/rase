"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const GlobalSearchInner = dynamic(() => import("@/components/search/GlobalSearchInner"), {
  ssr: false,
});

type GlobalSearchProps = {
  compact?: boolean;
};

/** Loads search JS only after the user opens the field — saves ~100KB+ parse on initial load. */
export default function GlobalSearch({ compact = false }: GlobalSearchProps) {
  const [active, setActive] = useState(false);

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className={`min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 text-left text-sm text-slate-500 ${compact ? "w-full min-w-0" : "w-36 min-w-[9rem] sm:w-44 xl:w-44"}`}
        aria-label="Open site search"
      >
        Search…
      </button>
    );
  }

  return <GlobalSearchInner compact={compact} autoFocus />;
}
