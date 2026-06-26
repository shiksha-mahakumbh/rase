"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  isHomePath,
  WELCOME_MODAL_CLOSED_EVENT,
  WELCOME_MODAL_SEEN_KEY,
} from "@/lib/home/is-home-path";

import {
  COOKIE_ACCEPTED_EVENT,
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_ESSENTIAL,
  COOKIE_CONSENT_KEY,
} from "@/lib/cookie-consent";

const COOKIE_DEFER_MS = 18_000;

export default function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(COOKIE_CONSENT_KEY)) return;

    const show = () => setVisible(true);

    if (!isHomePath(pathname ?? "")) {
      show();
      return;
    }

    if (sessionStorage.getItem(WELCOME_MODAL_SEEN_KEY)) {
      show();
      return;
    }

    const onModalClosed = () => show();
    window.addEventListener(WELCOME_MODAL_CLOSED_EVENT, onModalClosed);
    const fallback = window.setTimeout(show, COOKIE_DEFER_MS);

    return () => {
      window.removeEventListener(WELCOME_MODAL_CLOSED_EVENT, onModalClosed);
      window.clearTimeout(fallback);
    };
  }, [pathname]);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_ACCEPTED);
    setVisible(false);
    window.dispatchEvent(new Event(COOKIE_ACCEPTED_EVENT));
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_ESSENTIAL);
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
