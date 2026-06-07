"use client";

import { impactStatistics } from "@/data/authority";
import { event } from "@/design/tokens";

const DISPLAY_COUNT =
  process.env.NEXT_PUBLIC_DISPLAY_REGISTRATION_COUNT ?? "10,000+";

/**
 * Lightweight trust / urgency strip for the registration funnel (no layout redesign).
 */
export default function RegistrationTrustBar() {
  const institutions =
    impactStatistics.find((s) => s.label.includes("Institutions"))?.value ?? 500;
  const deadline = "31 August 2026";

  return (
    <div
      className="mb-4 grid gap-2 rounded-xl border border-brand-saffron/25 bg-brand-surfaceWarm px-4 py-3 text-sm sm:grid-cols-2 lg:grid-cols-4"
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
        <p className="font-semibold text-brand-saffron">{deadline}</p>
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
