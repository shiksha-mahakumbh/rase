"use client";

import { impactStatistics } from "@/data/authority";
import { event } from "@/design/tokens";
import { REGISTRATION_DEADLINE } from "@/data/registration-hub";

const DISPLAY_COUNT =
  process.env.NEXT_PUBLIC_DISPLAY_REGISTRATION_COUNT ?? "10,000+";

/**
 * Lightweight trust / urgency strip for the registration funnel (no layout redesign).
 */
export default function RegistrationTrustBar() {
  const institutions =
    impactStatistics.find((s) => s.label.includes("Institutions"))?.value ?? 500;

  return (
    <div
      className="mb-4 grid gap-2 rounded-xl border border-brand-saffron/25 bg-white px-4 py-3 text-sm shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      role="region"
      aria-label="Registration trust indicators"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Official event
        </p>
        <p className="font-semibold text-brand-navy">
          {event.name} · {event.venue}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Registration deadline
        </p>
        <p className="font-semibold text-brand-saffron">{REGISTRATION_DEADLINE}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          National participation
        </p>
        <p className="font-semibold text-brand-navy">
          {DISPLAY_COUNT} participants (movement scale)
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Institutions engaged
        </p>
        <p className="font-semibold text-brand-navy">{institutions}+ partners</p>
      </div>
    </div>
  );
}
