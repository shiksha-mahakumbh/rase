"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { KnowledgeIcon } from "@/components/home/legacy/icons";

interface DepartmentPageShellProps {
  children: ReactNode;
  departmentTitle: string;
  departmentTitleHindi?: string;
  icon?: ReactNode;
  /** When true, renders a compact brand hero. Default false — outer PublicPageShell already provides the page hero. */
  showHero?: boolean;
}

const DepartmentPageShell: React.FC<DepartmentPageShellProps> = ({
  children,
  departmentTitle,
  departmentTitleHindi,
  icon,
  showHero = false,
}) => {
  return (
    <div className="min-h-full bg-gradient-to-b from-brand-surface via-white to-brand-surface-warm">
      {showHero && (
        <section
          className="brand-hero-bg relative overflow-hidden border-b border-brand-saffron/20 px-4 py-8 md:py-10"
          aria-labelledby="dept-hero-title"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-brand-saffron/15 blur-3xl"
          />
          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-saffron/30 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-navy"
            >
              <KnowledgeIcon className="h-4 w-4 text-brand-saffron" />
              विभाग पृष्ठ · Department Page
            </motion.div>
            <motion.h1
              id="dept-hero-title"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-2xl font-extrabold text-brand-navy md:text-4xl"
            >
              {departmentTitle}
            </motion.h1>
            {departmentTitleHindi && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-2 text-base font-medium text-brand-saffron-dark md:text-lg"
              >
                {departmentTitleHindi}
              </motion.p>
            )}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        {!showHero && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-brand-saffron/20 bg-white/90 px-5 py-4 shadow-sm"
          >
            {icon ?? (
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-saffron/15 text-brand-saffron">
                <KnowledgeIcon className="h-6 w-6" />
              </div>
            )}
            <div>
              {departmentTitleHindi && (
                <p className="text-sm font-medium text-brand-saffron-dark">{departmentTitleHindi}</p>
              )}
              <h2 className="text-xl font-bold text-brand-navy md:text-2xl">{departmentTitle}</h2>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-[0_16px_48px_rgba(11,31,59,0.08)] backdrop-blur-sm sm:rounded-3xl"
        >
          <div className="p-5 md:p-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default DepartmentPageShell;
