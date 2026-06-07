"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { KnowledgeIcon } from "../home/icons";

interface DepartmentPageShellProps {
  children: ReactNode;
  departmentTitle: string;
  departmentTitleHindi?: string;
  icon?: ReactNode;
}

const DepartmentPageShell: React.FC<DepartmentPageShellProps> = ({
  children,
  departmentTitle,
  departmentTitleHindi,
  icon,
}) => {
  return (
    <div className="min-h-full bg-gradient-to-b from-brand-surface via-white to-brand-surface-warm">
      <section
        className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy px-4 py-12 text-white md:py-16"
        aria-labelledby="dept-hero-title"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-brand-saffron/15 blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm"
          >
            <KnowledgeIcon className="h-4 w-4" />
            विभाग पृष्ठ · Department Page
          </motion.div>
          <motion.h1
            id="dept-hero-title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-2xl font-extrabold md:text-4xl lg:text-5xl"
          >
            Shiksha Mahakumbh Abhiyan
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-base font-medium text-white/90 md:text-lg"
          >
            Department of Holistic Education
            <br />
            Vidya Bharti Institute of Training and Research Chandigarh
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md"
          >
            {icon ?? (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-saffron/20 text-brand-saffron">
                <KnowledgeIcon className="h-7 w-7" />
              </div>
            )}
            <div className="text-left">
              {departmentTitleHindi && (
                <p className="text-sm text-brand-saffron/90">{departmentTitleHindi}</p>
              )}
              <h3 className="text-xl font-bold md:text-2xl lg:text-3xl">
                {departmentTitle}
              </h3>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-[0_16px_48px_rgba(11,31,59,0.08)] backdrop-blur-sm sm:rounded-3xl"
        >
          <div className="p-5 md:p-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default DepartmentPageShell;
