"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { SectionShellProps } from "./types";

const backgroundStyles: Record<
  NonNullable<SectionShellProps["background"]>,
  string
> = {
  default: "bg-white",
  gradient:
    "bg-gradient-to-br from-slate-50 via-white to-amber-50/40 relative overflow-hidden",
  warm: "bg-gradient-to-br from-[#fff9f5] via-white to-[#fef3e8] relative overflow-hidden",
  cool: "bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/50 relative overflow-hidden",
  dark: "bg-gradient-to-br from-[#1a1210] via-[#2a1818] to-[#1f1414] text-white relative overflow-hidden",
};

const SectionShell: React.FC<SectionShellProps> = ({
  children,
  id,
  className = "",
  background = "default",
  ariaLabel,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <motion.section
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`${backgroundStyles[background]} ${className}`}
    >
      {background !== "default" && background !== "dark" && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
};

export default SectionShell;
