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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-[#faf8f6]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-primary via-[#5c3535] to-[#3d2222] px-4 py-12 text-white md:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl font-extrabold md:text-4xl lg:text-5xl"
          >
            Shiksha Mahakumbh Abhiyan
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-lg font-medium text-white/90 md:text-xl"
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20 text-amber-200">
                <KnowledgeIcon className="h-7 w-7" />
              </div>
            )}
            <div className="text-left">
              {departmentTitleHindi && (
                <p className="text-sm text-amber-200/90">{departmentTitleHindi}</p>
              )}
              <h3 className="text-2xl font-bold md:text-3xl">{departmentTitle}</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-3xl border border-gray-100 bg-white/80 shadow-[0_16px_48px_rgba(80,42,42,0.08)] backdrop-blur-sm"
        >
          <div className="p-6 md:p-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default DepartmentPageShell;
