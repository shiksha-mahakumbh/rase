"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  COOKIE_ACCEPTED_EVENT,
  hasAnalyticsConsent,
} from "@/lib/cookie-consent";

export default function ConsentGatedAdSense() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(hasAnalyticsConsent());
    const onAccept = () => setEnabled(true);
    window.addEventListener(COOKIE_ACCEPTED_EVENT, onAccept);
    return () => window.removeEventListener(COOKIE_ACCEPTED_EVENT, onAccept);
  }, []);

  if (!enabled || process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "true") {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4330032354977759"
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
}
