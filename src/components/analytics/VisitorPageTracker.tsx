"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { shouldTrackAnalytics } from "@/lib/analytics/track-path";
import { getSessionId, getVisitorId } from "@/lib/analytics/visitor-ids";
import {
  COOKIE_ACCEPTED_EVENT,
  hasAnalyticsConsent,
} from "@/lib/cookie-consent";

const VISIT_COUNTED_KEY = "smk_analytics_visit_counted";

function utmParams(): Record<string, string | undefined> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
  };
}

function shouldCountAsVisit(sessionId: string): boolean {
  if (typeof sessionStorage === "undefined") return true;
  const key = `${VISIT_COUNTED_KEY}:${sessionId}`;
  if (sessionStorage.getItem(key)) return false;
  sessionStorage.setItem(key, "1");
  return true;
}

export default function VisitorPageTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const enteredAt = useRef<number>(Date.now());
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setConsent(hasAnalyticsConsent());
    const onAccept = () => setConsent(true);
    window.addEventListener(COOKIE_ACCEPTED_EVENT, onAccept);
    return () => window.removeEventListener(COOKIE_ACCEPTED_EVENT, onAccept);
  }, []);

  useEffect(() => {
    if (!consent) return;
    if (!pathname || pathname === lastPath.current) return;
    if (!shouldTrackAnalytics(pathname)) return;

    const durationMs =
      lastPath.current != null ? Date.now() - enteredAt.current : undefined;
    lastPath.current = pathname;
    enteredAt.current = Date.now();

    const sessionId = getSessionId();
    const payload = {
      sessionId,
      visitorId: getVisitorId(),
      path: pathname,
      title: typeof document !== "undefined" ? document.title : undefined,
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      screenWidth: typeof window !== "undefined" ? window.screen.width : undefined,
      screenHeight: typeof window !== "undefined" ? window.screen.height : undefined,
      durationMs,
      countAsVisit: shouldCountAsVisit(sessionId),
      ...utmParams(),
    };

    const send = () => {
      const body = JSON.stringify(payload);
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon("/api/v2/analytics/track", blob)) return;
      }
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 2500);
      fetch("/api/v2/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
        signal: controller.signal,
      })
        .catch(() => undefined)
        .finally(() => window.clearTimeout(timeout));
    };

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(send, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(send, 1500);
    return () => window.clearTimeout(t);
  }, [pathname, consent]);

  return null;
}
