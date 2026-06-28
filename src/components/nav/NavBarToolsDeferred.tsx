"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { scheduleAfterLcp } from "@/lib/perf/schedule-after-lcp";

const NavBarTools = dynamic(() => import("@/components/nav/NavBarTools"), { ssr: false });

type Props = {
  visibility?: "desktop" | "mobile" | "always";
};

function ToolsPlaceholder({ visibility }: { visibility: Props["visibility"] }) {
  const className =
    visibility === "desktop"
      ? "hidden lg:flex items-center gap-2"
      : visibility === "mobile"
        ? "flex lg:hidden items-center gap-2"
        : "flex items-center gap-2";

  return (
    <div className={className} aria-hidden="true">
      {visibility !== "mobile" ? (
        <div className="hidden h-10 w-28 rounded-lg border border-slate-200 bg-white lg:block xl:w-36" />
      ) : null}
      <div className="h-11 min-w-[7.5rem] rounded-lg border border-slate-200 bg-white" />
    </div>
  );
}

/** Defer search + language switcher until after LCP to reduce homepage TBT. */
export default function NavBarToolsDeferred({ visibility = "desktop" }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return scheduleAfterLcp(() => setReady(true), {
      bufferMs: 400,
      fallbackMs: 9000,
    });
  }, []);

  if (!ready) {
    return <ToolsPlaceholder visibility={visibility} />;
  }

  return <NavBarTools visibility={visibility} />;
}
