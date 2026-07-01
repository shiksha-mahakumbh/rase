"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  COOKIE_ACCEPTED_EVENT,
  COOKIE_WITHDRAWN_EVENT,
  hasAnalyticsConsent,
} from "@/lib/cookie-consent";
import { ADSENSE_PUBLISHER_ID } from "@/lib/growth/adsense";
import { applyConsentDenied, applyConsentGranted } from "@/lib/analytics/consent-mode";

export default function ConsentGatedAdSense() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      const ok = hasAnalyticsConsent();
      setEnabled(ok);
      if (ok) applyConsentGranted();
      else applyConsentDenied();
    };
    sync();
    window.addEventListener(COOKIE_ACCEPTED_EVENT, sync);
    window.addEventListener(COOKIE_WITHDRAWN_EVENT, sync);
    return () => {
      window.removeEventListener(COOKIE_ACCEPTED_EVENT, sync);
      window.removeEventListener(COOKIE_WITHDRAWN_EVENT, sync);
    };
  }, []);

  if (!enabled || process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "true") {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
