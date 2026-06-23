"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={hover && !reduceMotion ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={`rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(80,42,42,0.08)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
