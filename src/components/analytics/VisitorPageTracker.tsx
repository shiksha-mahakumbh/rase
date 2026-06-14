"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { shouldTrackAnalytics } from "@/lib/analytics/track-path";
import { getSessionId, getVisitorId } from "@/lib/analytics/visitor-ids";

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

  useEffect(() => {
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

    fetch("/api/v2/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
