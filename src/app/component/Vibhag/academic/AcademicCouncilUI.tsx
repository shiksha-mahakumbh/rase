"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface SectionCTAProps {
  buttonText: string;
  href: string;
  title?: string;
}

export interface ACHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: "primary" | "indigo" | "purple" | "amber" | "emerald" | "rose" | "sky";
}

export interface ACSectionProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

const accentGradients: Record<NonNullable<ACHeroProps["accent"]>, string> = {
  primary: "from-primary via-[#5c3535] to-[#3d2222]",
  indigo: "from-indigo-900 via-indigo-800 to-blue-900",
  purple: "from-purple-900 via-indigo-800 to-indigo-900",
  amber: "from-amber-600 via-orange-600 to-amber-700",
  emerald: "from-emerald-800 via-teal-700 to-emerald-900",
  rose: "from-rose-700 via-pink-700 to-rose-800",
  sky: "from-sky-800 via-blue-800 to-indigo-900",
};

export const ACPage: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="min-h-full bg-gradient-to-b from-slate-50 via-white to-[#faf8f6] text-gray-800">
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
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"
    />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 mx-auto max-w-5xl text-center"
    >
      <h1 className="text-2xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <div className="mt-5 text-base leading-relaxed text-white/90 md:text-lg md:leading-8">
          {subtitle}
        </div>
      )}
    </motion.div>
  </section>
);

export const ACSection: React.FC<ACSectionProps> = ({
  title,
  children,
  className = "",
}) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.45 }}
    className={`px-4 py-8 md:px-8 md:py-10 ${className}`}
  >
    <div className="mx-auto max-w-5xl">
      <h2 className="mb-6 text-xl font-bold text-primary md:text-2xl lg:text-3xl">
        {title}
      </h2>
      {children}
    </div>
  </motion.section>
);

export const ACCard: React.FC<{
  children: ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = "", hover = true }) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-white/90 p-5 shadow-[0_8px_32px_rgba(80,42,42,0.06)] backdrop-blur-sm md:p-6 ${
      hover ? "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" : ""
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
    className={`rounded-2xl border border-white/60 bg-white/75 p-5 shadow-lg backdrop-blur-md md:p-8 ${className}`}
  >
    {children}
  </div>
);

export const ACObjectiveCard: React.FC<{ children: ReactNode; index?: number }> = ({
  children,
  index,
}) => (
  <ACCard className="border-primary/10 bg-gradient-to-br from-white to-[#faf7f5]">
    <div className="flex gap-3">
      {index !== undefined && (
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {index + 1}
        </span>
      )}
      <p className="text-sm leading-relaxed text-gray-700 md:text-base">{children}</p>
    </div>
  </ACCard>
);

export const ACTimelineStep: React.FC<{ step: number; children: ReactNode }> = ({
  step,
  children,
}) => (
  <div className="relative flex flex-col items-center text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#7a4343] text-lg font-bold text-white shadow-md">
      {step}
    </div>
    <p className="text-xs leading-relaxed text-gray-700 md:text-sm">{children}</p>
  </div>
);

export const ACInfoBadge: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="rounded-xl border border-amber-200/60 bg-amber-50/80 px-4 py-3 text-sm text-gray-800 md:text-base">
    {children}
  </div>
);

export const ACContactBlock: React.FC = () => (
  <ACGlassPanel className="border-primary/10 bg-gradient-to-br from-primary/5 to-amber-50/30 text-center">
    <h2 className="mb-4 text-xl font-bold text-primary md:text-2xl">📞 Contact</h2>
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-[#5c3535] to-[#3d2222] p-6 text-center text-white shadow-xl md:p-10"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
        {title}
      </p>
      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-xl"
      >
        {buttonText}
      </Link>
    </motion.div>
  </section>
);

export const ACFooterStatement: React.FC<{
  title: ReactNode;
  children: ReactNode;
}> = ({ title, children }) => (
  <section className="px-4 py-10 text-center md:px-8">
    <div className="mx-auto max-w-4xl">
      <h3 className="mb-4 text-xl font-bold text-primary md:text-2xl lg:text-3xl">
        {title}
      </h3>
      <p className="text-base leading-relaxed text-gray-600 md:text-lg md:leading-8">
        {children}
      </p>
    </div>
  </section>
);

export const REG_LINKS = {
  general: "/registration",
  conclave: "/registration",
  talent: "/registration",
  ngo: "/registration",
  volunteer: "/registration",
  participant: "/registration",
} as const;
