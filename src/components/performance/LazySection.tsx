"use client";

import { useInView } from "react-intersection-observer";
import type { ReactNode } from "react";

type LazySectionProps = {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: string;
  rootMargin?: string;
  className?: string;
};

export default function LazySection({
  children,
  fallback = null,
  minHeight = "12rem",
  rootMargin = "250px 0px",
  className,
}: LazySectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
  });

  return (
    <div
      ref={ref}
      className={className}
      style={!inView && minHeight ? { minHeight } : undefined}
    >
      {inView ? children : fallback}
    </div>
  );
}
