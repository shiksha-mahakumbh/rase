"use client";

import React from "react";
import { motion } from "framer-motion";
import type { GlassCardProps } from "./types";

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  hover = true,
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={`rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(80,42,42,0.08)] ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
