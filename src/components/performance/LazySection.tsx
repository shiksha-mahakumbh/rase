"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { ReactNode } from "react";

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
    const arm = () => setArmed(true);
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(arm, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(arm, 1500);
    return () => clearTimeout(t);
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
