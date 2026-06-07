"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShowcaseHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: "navy" | "saffron" | "emerald";
}

const accents = {
  navy: "from-brand-navy via-brand-navy-light to-brand-navy",
  saffron: "from-brand-saffron-dark via-brand-saffron to-amber-500",
  emerald: "from-emerald-800 via-teal-700 to-brand-navy",
};

export default function ShowcaseHero({
  eyebrow,
  title,
  subtitle,
  accent = "navy",
}: ShowcaseHeroProps) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${accents[accent]} px-4 py-14 text-white md:px-8 md:py-20`}
      aria-labelledby="showcase-hero-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-saffron/90"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          id="showcase-hero-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-3xl font-extrabold leading-tight md:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg"
          >
            {subtitle}
          </motion.div>
        )}
      </div>
    </section>
  );
}
