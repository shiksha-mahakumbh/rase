"use client";

import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

export type SectionBackground = "default" | "gradient" | "warm" | "cool" | "dark";

export interface SectionShellProps {
  children: ReactNode;
  id?: string;
  className?: string;
  background?: SectionBackground;
  ariaLabel?: string;
}

const backgroundStyles: Record<SectionBackground, string> = {
  default: "bg-white",
  gradient:
    "bg-gradient-to-br from-slate-50 via-white to-amber-50/40 relative overflow-hidden",
  warm: "bg-gradient-to-br from-[#fff9f5] via-white to-[#fef3e8] relative overflow-hidden",
  cool: "bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/50 relative overflow-hidden",
  dark: "bg-gradient-to-br from-[#1a1210] via-[#2a1818] to-[#1f1414] text-white relative overflow-hidden",
};

/** Lightweight section wrapper — CSS reveal (no framer-motion). */
export default function SectionShell({
  children,
  id,
  className = "",
  background = "default",
  ariaLabel,
}: SectionShellProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      className={`${backgroundStyles[background]} transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
      } ${className}`}
    >
      {background !== "default" && background !== "dark" && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
