"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "smk_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
    window.dispatchEvent(new Event("smk-cookie-accepted"));
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "essential");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md md:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-700">
          We use cookies for essential functionality and, with your consent, analytics
          to improve the site. See our{" "}
          <Link href="/privacy-policy" className="font-semibold text-brand-navy underline">
            Privacy Policy
          </Link>
          {" "}and{" "}
          <Link href="/cookie-policy" className="font-semibold text-brand-navy underline">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-brand-saffron px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-saffron-dark hover:text-white"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
