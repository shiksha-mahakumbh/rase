"use client";

import React, { ReactNode } from "react";
import { formClasses } from "@/components/forms/formClasses";
import { GlobeEducationIcon, KnowledgeIcon } from "@/components/icons/home";

interface RegistrationShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  sidebar?: ReactNode;
}

const RegistrationShell: React.FC<RegistrationShellProps> = ({
  children,
  title = "Event Registration",
  subtitle = "Secure registration for Shiksha Mahakumbh Abhiyan — national educational movement",
  sidebar,
}) => {
  return (
    <div className={formClasses.page}>
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="mb-8 animate-fade-in text-center">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            <span className={formClasses.trustBadge}>
              <GlobeEducationIcon className="h-3.5 w-3.5" />
              Official DHE Platform
            </span>
            <span className={formClasses.trustBadge}>
              <KnowledgeIcon className="h-3.5 w-3.5" />
              Secure Submission
            </span>
          </div>
          <h2 className={formClasses.title}>{title}</h2>
          <p className={formClasses.subtitle}>{subtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className={`${formClasses.shell} animate-fade-in`}>{children}</div>
          {sidebar ?? (
            <aside className="hidden animate-fade-in lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-brand-saffron/20 bg-brand-surface-warm p-5 shadow-sm">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-saffron-dark">
                    Registration Highlights
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex gap-2">
                      <span className="text-brand-saffron">✓</span>
                      Multi-track conferences &amp; conclaves
                    </li>
                    <li className="flex gap-2">
                      <span className="text-brand-saffron">✓</span>
                      Research &amp; innovation showcases
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationShell;
