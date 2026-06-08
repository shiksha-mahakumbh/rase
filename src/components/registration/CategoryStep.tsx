"use client";

import { REGISTRATION_TYPE_OPTIONS, RegistrationType } from "@/types/registration";
import {
  CMT_SUBMISSION_URL,
  isExternalRedirectType,
  redirectToExternalSubmission,
} from "@/lib/registration/config";

const TYPE_HINTS: Partial<Record<RegistrationType, string>> = {
  "Delegate Registration": "Faculty, researchers, and institutional delegates",
  "Multi Track Conference": "Opens Microsoft CMT submission portal",
  "Paper Submission": "Full-length papers via Microsoft CMT",
  "Abstract Submission": "Abstracts via Microsoft CMT",
  Conclave: "Multi-track holistic education sessions",
  Olympiad: "School and student competitive programmes",
  Awards: "Recognition and excellence categories",
  "Best Practices": "Share institutional best practices (500+ words)",
  Exhibition: "Innovation and project exhibitions",
  Projects: "School / HEI project displays (paid registration)",
  Accommodation: "Lodging requests for event dates (paid registration)",
};

interface CategoryStepProps {
  value: RegistrationType;
  onChange: (type: RegistrationType) => void;
  onContinue: () => void;
}

export default function CategoryStep({
  value,
  onChange,
  onContinue,
}: CategoryStepProps) {
  const handleSelect = (type: RegistrationType) => {
    if (isExternalRedirectType(type)) {
      redirectToExternalSubmission(type);
      return;
    }
    onChange(type);
  };

  const canContinue = !isExternalRedirectType(value);

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Select the track that best matches your participation. Paper, abstract, and
        multi-track conference submissions open in{" "}
        <a
          href={CMT_SUBMISSION_URL}
          className="font-semibold text-brand-saffron underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Microsoft CMT
        </a>
        .
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {REGISTRATION_TYPE_OPTIONS.map((type) => {
          const selected = value === type;
          const external = isExternalRedirectType(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleSelect(type)}
              className={`min-h-[44px] rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-brand-saffron bg-brand-saffron/10 shadow-md ring-2 ring-brand-saffron/40"
                  : "border-slate-200 bg-white hover:border-brand-navy/30 hover:shadow-sm"
              }`}
              aria-pressed={selected}
            >
              <span className="block text-sm font-bold text-brand-navy">{type}</span>
              {TYPE_HINTS[type] && (
                <span className="mt-1 block text-xs text-slate-500">
                  {TYPE_HINTS[type]}
                </span>
              )}
              {external && (
                <span className="mt-1 block text-xs font-semibold text-brand-saffron">
                  → Redirects to CMT
                </span>
              )}
            </button>
          );
        })}
      </div>
      {canContinue ? (
        <button
          type="button"
          onClick={onContinue}
          className="w-full min-h-[48px] rounded-xl bg-brand-saffron font-bold text-brand-navy shadow-lg transition hover:bg-brand-saffron-dark hover:text-white sm:w-auto sm:px-10"
        >
          Continue to details →
        </button>
      ) : (
        <p className="text-sm text-slate-500">
          Selected category opens the external submission portal automatically.
        </p>
      )}
    </div>
  );
}
