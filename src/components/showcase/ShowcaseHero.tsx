"use client";

import { ReactNode } from "react";
import Image from "next/image";

interface ShowcaseHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: "navy" | "saffron" | "emerald" | "brand";
  imageSrc?: string;
}

const darkAccents = {
  navy: "from-brand-navy via-brand-navy-light to-brand-navy text-white",
  saffron: "from-brand-saffron-dark via-brand-saffron to-amber-500 text-white",
  emerald: "from-emerald-800 via-teal-700 to-brand-navy text-white",
};

export default function ShowcaseHero({
  eyebrow,
  title,
  subtitle,
  accent = "brand",
  imageSrc,
}: ShowcaseHeroProps) {
  const isBrand = accent === "brand";

  if (isBrand) {
    return (
      <section
        className="brand-hero-bg relative overflow-hidden border-b border-brand-saffron/20 px-4 py-10 md:px-8 md:py-14"
        aria-labelledby="showcase-hero-title"
      >
        <div
          className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-brand-saffron/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-brand-blue/10 blur-3xl"
          aria-hidden
        />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            {eyebrow && (
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-saffron-dark">
                {eyebrow}
              </p>
            )}
            <h1
              id="showcase-hero-title"
              className="text-3xl font-extrabold leading-tight text-brand-navy md:text-4xl lg:text-5xl"
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg lg:mx-0">
                {subtitle}
              </p>
            )}
          </div>
          {imageSrc ? (
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-brand-saffron/25 to-brand-blue/15 blur-sm" aria-hidden />
              <Image
                src={imageSrc}
                alt=""
                width={560}
                height={420}
                className="relative rounded-xl border-2 border-white bg-white shadow-lg"
                priority
              />
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${darkAccents[accent]} px-4 py-14 md:px-8 md:py-20`}
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
            className="animate-fade-in mx-auto mt-5 max-w-3xl text-base leading-relaxed opacity-90 md:text-lg"
            style={{ animationDelay: "100ms" }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </section>
  );
}
