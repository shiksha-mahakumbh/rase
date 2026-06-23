"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  fallbackHeight?: string;
  children: ReactNode;
};

/** Mount children after idle — keeps react-fast-marquee etc. off the critical path. */
export default function IdleMount({ fallbackHeight = "4.5rem", children }: Props) {
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
    return <div style={{ minHeight: fallbackHeight }} aria-hidden className="border-b border-primary/5" />;
  }

  return <>{children}</>;
}
