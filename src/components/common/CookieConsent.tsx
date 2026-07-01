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
  COOKIE_CONSENT_KEY,
  setAnalyticsConsent,
} from "@/lib/cookie-consent";

const COOKIE_DEFER_MS = 8_000;

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

    const armFallback = () => window.setTimeout(show, COOKIE_DEFER_MS);
    let fallback = 0;
    if (typeof requestIdleCallback !== "undefined") {
      const idleId = requestIdleCallback(() => {
        fallback = armFallback();
      }, { timeout: COOKIE_DEFER_MS });
      return () => {
        window.removeEventListener(WELCOME_MODAL_CLOSED_EVENT, onModalClosed);
        cancelIdleCallback(idleId);
        if (fallback) window.clearTimeout(fallback);
      };
    }
    fallback = armFallback();

    return () => {
      window.removeEventListener(WELCOME_MODAL_CLOSED_EVENT, onModalClosed);
      window.clearTimeout(fallback);
    };
  }, [pathname]);

  const accept = () => {
    setAnalyticsConsent(true);
    setVisible(false);
  };

  const decline = () => {
    setAnalyticsConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-200 bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-md md:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-700">
          We use essential cookies for site functionality. With your consent, we also use
          analytics and advertising cookies (Google Analytics, AdSense when enabled) to
          improve the site. See our{" "}
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
