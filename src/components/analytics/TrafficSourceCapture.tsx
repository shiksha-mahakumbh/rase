"use client";

import { useEffect } from "react";
import { captureTrafficSource } from "@/lib/analytics/events";
import { captureAttribution } from "@/lib/analytics/attribution";

const CONSENT_KEY = "smk_cookie_consent";

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}

export default function TrafficSourceCapture() {
  useEffect(() => {
    const run = () => {
      if (!hasAnalyticsConsent()) return;
      captureTrafficSource();
      captureAttribution();
    };

    run();
    window.addEventListener("smk-cookie-accepted", run);
    return () => window.removeEventListener("smk-cookie-accepted", run);
  }, []);
  return null;
}
