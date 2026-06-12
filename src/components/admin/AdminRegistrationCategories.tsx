"use client";

import {
  PAID_REGISTRATION_TYPES,
  EXTERNAL_REDIRECT_TYPES,
} from "@/lib/registration/config";
import { REGISTRATION_TYPE_OPTIONS, RegistrationType } from "@/types/registration";

const FREE_HUB_TYPES = REGISTRATION_TYPE_OPTIONS.filter(
  (t) =>
    !PAID_REGISTRATION_TYPES.includes(t as (typeof PAID_REGISTRATION_TYPES)[number]) &&
    !EXTERNAL_REDIRECT_TYPES.includes(t as (typeof EXTERNAL_REDIRECT_TYPES)[number])
);

export default function AdminRegistrationCategories() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <h3 className="text-sm font-bold text-amber-900">Paid categories</h3>
        <p className="mt-1 text-xs text-amber-800">
          Status: <strong>Pending Payment</strong> → <strong>Paid</strong>
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-amber-950">
          {PAID_REGISTRATION_TYPES.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-bold text-blue-900">Free categories (on-site hub)</h3>
        <p className="mt-1 text-xs text-blue-800">
          Status: <strong>Submitted</strong>
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-blue-950">
          {FREE_HUB_TYPES.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-blue-800">
          External (CMT): {EXTERNAL_REDIRECT_TYPES.join(", ")}
        </p>
      </div>
    </div>
  );
}
