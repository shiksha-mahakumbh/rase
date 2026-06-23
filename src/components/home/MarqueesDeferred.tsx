"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MarqueesSkeleton from "./MarqueesSkeleton";

const Marquees = dynamic(() => import("@/components/layout/Marquees"), { ssr: false });

/** SSR skeleton first, swap to live marquee after idle — same footprint, no layout shift. */
export default function MarqueesDeferred() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  if (!ready) {
    return <MarqueesSkeleton />;
  }

  return <Marquees />;
}
