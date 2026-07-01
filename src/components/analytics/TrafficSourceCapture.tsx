"use client";

import { useEffect } from "react";
import { captureTrafficSource } from "@/lib/analytics/events";
import { captureAttribution } from "@/lib/analytics/attribution";
import {
  COOKIE_ACCEPTED_EVENT,
  COOKIE_WITHDRAWN_EVENT,
  hasAnalyticsConsent,
} from "@/lib/cookie-consent";

export default function TrafficSourceCapture() {
  useEffect(() => {
    const run = () => {
      if (!hasAnalyticsConsent()) return;
      captureTrafficSource();
      captureAttribution();
    };

    run();
    window.addEventListener(COOKIE_ACCEPTED_EVENT, run);
    window.addEventListener(COOKIE_WITHDRAWN_EVENT, run);
    return () => {
      window.removeEventListener(COOKIE_ACCEPTED_EVENT, run);
      window.removeEventListener(COOKIE_WITHDRAWN_EVENT, run);
    };
  }, []);
  return null;
}
