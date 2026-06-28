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
      <div className="h-11 w-[5.5rem] rounded-lg border border-slate-200 bg-white" />
    </div>
  );
}

/** Defer search + language switcher until idle to reduce homepage TBT. */
export default function NavBarToolsDeferred({ visibility = "desktop" }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return scheduleAfterLcp(() => setReady(true), {
      bufferMs: visibility === "mobile" ? 1200 : 600,
      fallbackMs: visibility === "mobile" ? 12000 : 9000,
    });
  }, [visibility]);

  if (!ready) {
    return <ToolsPlaceholder visibility={visibility} />;
  }

  return <NavBarTools visibility={visibility} />;
}
