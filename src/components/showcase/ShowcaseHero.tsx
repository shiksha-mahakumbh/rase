"use client";

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
          <p className="mb-3 animate-fade-in text-xs font-bold uppercase tracking-[0.25em] text-brand-saffron/90">
            {eyebrow}
          </p>
        )}
        <h1
          id="showcase-hero-title"
          className="animate-fade-in text-3xl font-extrabold leading-tight md:text-5xl"
          style={{ animationDelay: "50ms" }}
        >
          {title}
        </h1>
        {subtitle && (
          <div
            className="animate-fade-in mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg"
            style={{ animationDelay: "100ms" }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </section>
  );
}
