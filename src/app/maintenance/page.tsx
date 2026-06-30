import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance — Shiksha Mahakumbh",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-saffron">
          Shiksha Mahakumbh
        </p>
        <h1 className="mt-3 text-2xl font-bold text-brand-navy">We&apos;ll be back shortly</h1>
        <p className="mt-4 text-slate-600">
          The site is temporarily unavailable while we perform scheduled maintenance. Please check
          again in a few minutes.
        </p>
      </div>
    </main>
  );
}
