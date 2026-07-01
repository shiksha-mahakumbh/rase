"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  COOKIE_ACCEPTED_EVENT,
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_ESSENTIAL,
  COOKIE_CONSENT_KEY,
  COOKIE_WITHDRAWN_EVENT,
  setAnalyticsConsent,
} from "@/lib/cookie-consent";

export default function CookiePreferences() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const sync = () => {
      const value = localStorage.getItem(COOKIE_CONSENT_KEY);
      setAnalytics(value === COOKIE_CONSENT_ACCEPTED);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(COOKIE_ACCEPTED_EVENT, sync);
    window.addEventListener(COOKIE_WITHDRAWN_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(COOKIE_ACCEPTED_EVENT, sync);
      window.removeEventListener(COOKIE_WITHDRAWN_EVENT, sync);
    };
  }, []);

  const save = () => {
    setAnalyticsConsent(analytics);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-[99] rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-brand-navy shadow-md backdrop-blur hover:bg-white"
      >
        Cookie preferences
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Cookie preferences"
          className="fixed inset-0 z-[101] flex items-end justify-center bg-black/40 p-4 md:items-center"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-brand-navy">Cookie preferences</h2>
            <p className="mt-2 text-sm text-slate-600">
              Essential cookies are always on. You can enable or disable analytics and
              marketing cookies below. See our{" "}
              <Link href="/privacy-policy" className="font-semibold underline">
                Privacy Policy
              </Link>
              .
            </p>
            <label className="mt-4 flex items-start gap-3 rounded-xl border p-3">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span>
                <span className="block text-sm font-semibold text-brand-navy">Analytics</span>
                <span className="text-xs text-slate-600">
                  Google Analytics, Clarity, Meta Pixel, AdSense (when enabled), and
                  first-party visitor stats.
                </span>
              </span>
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="rounded-lg bg-brand-saffron px-4 py-2 text-sm font-bold text-brand-navy"
              >
                Save preferences
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Current: {analytics ? COOKIE_CONSENT_ACCEPTED : COOKIE_CONSENT_ESSENTIAL}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
