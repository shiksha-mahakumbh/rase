"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { ReactNode } from "react";
import { scheduleAfterLcp } from "@/lib/perf/schedule-after-lcp";

type LazySectionProps = {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: string;
  rootMargin?: string;
  className?: string;
  /** Defer intersection observer until idle to avoid loading below-fold chunks during TBT window. */
  idleFirst?: boolean;
};

export default function LazySection({
  children,
  fallback = null,
  minHeight = "12rem",
  rootMargin = "250px 0px",
  className,
  idleFirst = false,
}: LazySectionProps) {
  const [armed, setArmed] = useState(!idleFirst);

  useEffect(() => {
    if (!idleFirst) return;
    return scheduleAfterLcp(() => setArmed(true), { bufferMs: 500, fallbackMs: 9000 });
  }, [idleFirst]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
    skip: !armed,
  });

  return (
    <div
      ref={ref}
      className={className}
      style={minHeight ? { minHeight } : undefined}
    >
      {inView ? children : fallback}
    </div>
  );
}
