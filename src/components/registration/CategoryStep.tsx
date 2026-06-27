"use client";

import { RegistrationType } from "@/types/registration";
import {
  CMT_SUBMIT_PATH,
  isExternalRedirectType,
  redirectToExternalSubmission,
} from "@/lib/registration/config";
import { REGISTRATION_CATEGORY_GROUPS } from "@/data/registration-hub";
import {
  getCategoryFeeBadge,
  type FeeBadgeTone,
} from "@/lib/registration/categoryMeta";

const TYPE_HINTS: Partial<Record<RegistrationType, string>> = {
  "Delegate Registration": "Faculty, researchers, and institutional delegates",
  "Multi Track Conference": "Opens Microsoft CMT submission portal",
  Conclave: "Multi-track holistic education sessions",
  Olympiad: "School and student competitive programmes",
  Awards: "Recognition and excellence categories",
  "Best Practices": "Share institutional best practices (500+ words)",
  Exhibition: "Innovation and project exhibitions",
  Projects: "School / HEI project displays (paid registration)",
  Accommodation: "Lodging requests for event dates (paid registration)",
};

const BADGE_STYLES: Record<FeeBadgeTone, string> = {
  free: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  paid: "bg-amber-50 text-amber-900 ring-amber-200",
  external: "bg-violet-50 text-violet-800 ring-violet-200",
  variable: "bg-slate-100 text-slate-700 ring-slate-200",
};

interface CategoryStepProps {
  value: RegistrationType;
  onChange: (type: RegistrationType) => void;
  onContinue: () => void;
}

function CategoryCard({
  type,
  selected,
  onSelect,
}: {
  type: RegistrationType;
  selected: boolean;
  onSelect: (type: RegistrationType) => void;
}) {
  const external = isExternalRedirectType(type);
  const badge = getCategoryFeeBadge(type);

  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      className={`min-h-[44px] rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-brand-saffron bg-brand-saffron/10 shadow-md ring-2 ring-brand-saffron/40"
          : "border-slate-200 bg-white hover:border-brand-navy/30 hover:shadow-sm"
      }`}
      aria-pressed={selected}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="text-sm font-bold text-brand-navy">{type}</span>
        <span
          className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${BADGE_STYLES[badge.tone]}`}
        >
          {badge.label}
        </span>
      </div>
      {TYPE_HINTS[type] && (
        <span className="mt-1 block text-xs text-slate-500">{TYPE_HINTS[type]}</span>
      )}
      {external && (
        <span className="mt-1 block text-xs font-semibold text-brand-saffron">
          → External submission (on-site notice first)
        </span>
      )}
    </button>
  );
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
        Start with <strong className="text-brand-navy">Delegate Registration</strong> if
        you are attending the summit. Research authors use{" "}
        <a
          href={CMT_SUBMIT_PATH}
          className="font-semibold text-brand-saffron underline"
        >
          paper submission (CMT)
        </a>
        . Fees are shown on each card before you continue.
      </p>
      {REGISTRATION_CATEGORY_GROUPS.map((group) => (
        <section key={group.title} aria-labelledby={`reg-group-${group.title}`}>
          <div className="mb-3">
            <h3
              id={`reg-group-${group.title}`}
              className="flex flex-wrap items-center gap-2 text-sm font-bold text-brand-navy"
            >
              {group.title}
              {group.recommended ? (
                <span className="rounded-full bg-brand-saffron/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-saffron-dark">
                  Recommended
                </span>
              ) : null}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">{group.hint}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.types.map((type) => (
              <CategoryCard
                key={type}
                type={type}
                selected={value === type}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </section>
      ))}
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
