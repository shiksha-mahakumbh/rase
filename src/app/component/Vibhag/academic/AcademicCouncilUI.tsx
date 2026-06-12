"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import "./academic-council.css";

export interface SectionCTAProps {
  buttonText: string;
  href: string;
  title?: string;
}

export interface ACHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: "primary" | "indigo" | "purple" | "amber" | "emerald" | "rose" | "sky" | "cyan";
}

export interface ACSectionProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

const accentGradients: Record<NonNullable<ACHeroProps["accent"]>, string> = {
  primary: "from-brand-navy via-brand-navy-light to-brand-navy",
  indigo: "from-indigo-900 via-indigo-800 to-brand-navy",
  purple: "from-purple-900 via-indigo-800 to-brand-navy-light",
  amber: "from-brand-saffron-dark via-brand-saffron to-amber-500",
  emerald: "from-emerald-800 via-teal-700 to-brand-navy-light",
  rose: "from-rose-700 via-pink-700 to-brand-navy",
  sky: "from-sky-800 via-blue-800 to-brand-navy",
  cyan: "from-cyan-800 via-blue-800 to-brand-navy-light",
};

export const ACPage: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="ac-page min-h-full bg-gradient-to-b from-brand-surface via-white to-brand-surface-warm text-gray-800">
    {children}
  </div>
);

export const ACHero: React.FC<ACHeroProps> = ({
  title,
  subtitle,
  accent = "primary",
}) => (
  <section
    className={`relative overflow-hidden bg-gradient-to-br ${accentGradients[accent]} px-4 py-12 text-white md:px-8 md:py-16`}
    aria-labelledby="ac-hero-title"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-brand-saffron/15 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"
    />
    <div className="animate-fade-in relative z-10 mx-auto max-w-5xl text-center">
      <h1
        id="ac-hero-title"
        className="text-2xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl"
      >
        {title}
      </h1>
      {subtitle && (
        <div className="mt-5 text-base leading-relaxed text-white/90 md:text-lg md:leading-8">
          {subtitle}
        </div>
      )}
    </div>
  </section>
);

export const ACSection: React.FC<ACSectionProps> = ({
  title,
  children,
  className = "",
  id,
}) => (
  <section
    id={id}
    className={`animate-fade-in px-4 py-8 md:px-8 md:py-10 ${className}`}
    aria-labelledby={id ? `${id}-heading` : undefined}
  >
    <div className="mx-auto max-w-5xl">
      <h2
        id={id ? `${id}-heading` : undefined}
        className="mb-6 text-xl font-bold text-brand-navy md:text-2xl lg:text-3xl"
      >
        {title}
      </h2>
      {children}
    </div>
  </section>
);

export const ACCard: React.FC<{
  children: ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = "", hover = true }) => (
  <div
    className={`rounded-2xl border border-slate-100 bg-white/95 p-5 shadow-[0_8px_32px_rgba(11,31,59,0.06)] backdrop-blur-sm md:p-6 ${
      hover
        ? "transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-saffron/30 hover:shadow-lg"
        : ""
    } ${className}`}
  >
    {children}
  </div>
);

export const ACGlassPanel: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg backdrop-blur-md md:p-8 ${className}`}
  >
    {children}
  </div>
);

export const ACObjectiveCard: React.FC<{ children: ReactNode; index?: number }> = ({
  children,
  index,
}) => (
  <ACCard className="border-brand-navy/10 bg-gradient-to-br from-white to-brand-surface-warm">
    <div className="flex gap-3">
      {index !== undefined && (
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-navy/10 text-sm font-bold text-brand-navy"
          aria-hidden
        >
          {index + 1}
        </span>
      )}
      <p className="min-w-0 text-sm leading-relaxed text-gray-700 md:text-base">{children}</p>
    </div>
  </ACCard>
);

export const ACTimelineStep: React.FC<{ step: number; children: ReactNode }> = ({
  step,
  children,
}) => (
  <div className="relative flex min-w-0 flex-col items-center text-center">
    <div
      className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy to-brand-navy-light text-lg font-bold text-white shadow-md"
      aria-hidden
    >
      {step}
    </div>
    <p className="text-xs leading-relaxed text-gray-700 md:text-sm">{children}</p>
  </div>
);

export const ACInfoBadge: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="rounded-xl border border-brand-saffron/30 bg-brand-surface-warm px-4 py-3 text-sm text-gray-800 md:text-base">
    {children}
  </div>
);

/** Gradient highlight band — preserves inner content verbatim */
export const ACHighlightPanel: React.FC<{
  title: ReactNode;
  children: ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div
    className={`rounded-2xl bg-gradient-to-br from-brand-saffron via-brand-saffron-dark to-amber-600 p-6 text-white shadow-xl md:rounded-3xl md:p-10 ${className}`}
  >
    <h2 className="mb-6 text-center text-2xl font-bold md:mb-8 md:text-3xl">{title}</h2>
    {children}
  </div>
);

export const ACLeadershipBlock: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ACGlassPanel className="border-brand-navy/10">
    <div className="space-y-6 text-sm leading-relaxed text-gray-700 md:text-base">{children}</div>
  </ACGlassPanel>
);

export const ACContactBlock: React.FC = () => (
  <ACGlassPanel className="border-brand-navy/10 bg-gradient-to-br from-brand-navy/5 to-brand-surface-warm text-center">
    <h2 className="mb-4 text-xl font-bold text-brand-navy md:text-2xl">📞 Contact</h2>
    <div className="space-y-2 text-sm text-gray-700 md:text-base">
      <p>📧 Email: academics@shikshamahakumbh.com</p>
      <p>📞 WhatsApp: +91-7903431900</p>
      <p>🌐 Website: www.shikshamahakumbh.com</p>
    </div>
  </ACGlassPanel>
);

export const SectionCTA: React.FC<SectionCTAProps> = ({
  buttonText,
  href,
  title = "Ready to participate?",
}) => (
  <section className="px-4 pb-12 pt-4 md:px-8">
    <div className="animate-fade-in mx-auto max-w-5xl overflow-hidden rounded-3xl border border-brand-navy/20 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-6 text-center text-white shadow-xl md:p-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-saffron/90">
        {title}
      </p>
      <Link
        href={href}
        className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-navy shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-surface-warm hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
      >
        {buttonText}
      </Link>
    </div>
  </section>
);

export const ACFooterStatement: React.FC<{
  title: ReactNode;
  children: ReactNode;
}> = ({ title, children }) => (
  <section className="px-4 py-10 text-center md:px-8">
    <div className="mx-auto max-w-4xl">
      <h3 className="mb-4 text-xl font-bold text-brand-navy md:text-2xl lg:text-3xl">{title}</h3>
      <p className="text-base leading-relaxed text-gray-600 md:text-lg md:leading-8">{children}</p>
    </div>
  </section>
);

export const REG_LINKS = {
  general: "/registration",
  conclave: "/registration",
  participant: "/registration",
} as const;
