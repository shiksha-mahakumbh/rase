"use client";

import React, { ReactNode } from "react";
import { formClasses } from "./formClasses";
import { GlobeEducationIcon, KnowledgeIcon } from "../home/icons";

interface RegistrationShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
}

const RegistrationShell: React.FC<RegistrationShellProps> = ({
  children,
  title = "Event Registration",
  subtitle = "Secure registration for Shiksha Mahakumbh Abhiyan — national educational movement",
  step,
  totalSteps,
}) => {
  const progress =
    step && totalSteps ? Math.round((step / totalSteps) * 100) : null;

  return (
    <div className={formClasses.page}>
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        {/* Trust header */}
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
          <h1 className={formClasses.title}>{title}</h1>
          <p className={formClasses.subtitle}>{subtitle}</p>

          {progress !== null && (
            <div className="mx-auto mt-6 max-w-md">
              <div className="mb-2 flex justify-between text-xs font-semibold text-gray-500">
                <span>
                  Step {step} of {totalSteps}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-navy to-brand-saffron transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className={`${formClasses.shell} animate-fade-in`}>
            {children}
          </div>

          {/* Benefits sidebar */}
          <aside className="hidden animate-fade-in lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-primary/10 bg-white/80 p-5 shadow-lg backdrop-blur-sm">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                  Registration Highlights
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-[#F59E0B]">✓</span>
                    Multi-track conferences &amp; conclaves
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#F59E0B]">✓</span>
                    Research &amp; innovation showcases
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#F59E0B]">✓</span>
                    National academic networking
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#F59E0B]">✓</span>
                    DHE Olympiad &amp; exhibitions
                  </li>
                </ul>
              </div>
              <div className={formClasses.notice}>
                <p className="font-semibold">Important</p>
                <p className="mt-1">
                  Complete all required fields marked with{" "}
                  <span className="text-red-600">*</span>. Keep your fee receipt
                  ready for upload where applicable.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-primary/5 to-amber-50/50 p-4 text-xs text-gray-600">
                <p className="font-bold text-primary">Registration Checklist</p>
                <ol className="mt-2 list-decimal space-y-1 pl-4">
                  <li>Select event &amp; registration type</li>
                  <li>Fill personal / institutional details</li>
                  <li>Upload documents if required</li>
                  <li>Submit &amp; save confirmation</li>
                </ol>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RegistrationShell;
