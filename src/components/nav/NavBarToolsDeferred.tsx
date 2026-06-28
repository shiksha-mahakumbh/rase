"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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
        <div className="hidden h-10 w-28 rounded-lg bg-slate-100 lg:block xl:w-36" />
      ) : null}
      <div className="h-11 w-[5.5rem] rounded-lg bg-slate-100" />
    </div>
  );
}

/** Defer search + language switcher until idle to reduce homepage TBT. */
export default function NavBarToolsDeferred({ visibility = "desktop" }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const arm = () => setReady(true);
    const delay = visibility === "mobile" ? 6000 : 4000;
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(arm, { timeout: delay });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(arm, delay / 2);
    return () => window.clearTimeout(t);
  }, [visibility]);

  if (!ready) {
    return <ToolsPlaceholder visibility={visibility} />;
  }

  return <NavBarTools visibility={visibility} />;
}
