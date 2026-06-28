"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { scheduleAfterLcp } from "@/lib/perf/schedule-after-lcp";

const GlobalSearch = dynamic(() => import("@/components/search/GlobalSearch"), { ssr: false });

function SearchPlaceholder() {
  return (
    <div
      className="hidden h-10 w-36 rounded-lg border border-slate-200 bg-white lg:block xl:w-44"
      aria-hidden="true"
    />
  );
}

/** Desktop search only — loads well after LCP to avoid chunk 1255 on the critical path. */
export default function NavBarSearchDeferred() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return scheduleAfterLcp(() => setReady(true), { bufferMs: 900, fallbackMs: 10000 });
  }, []);

  if (!ready) {
    return <SearchPlaceholder />;
  }

  return (
    <div className="hidden items-center lg:flex">
      <GlobalSearch />
    </div>
  );
}
