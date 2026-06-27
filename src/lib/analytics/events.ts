import {
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_KEY,
} from "@/lib/cookie-consent";
import { getSessionId } from "@/lib/analytics/visitor-ids";

export const ANALYTICS_EVENTS = {
  registrationStarted: "registration_started",
  registrationCompleted: "registration_completed",
  paperSubmitted: "paper_submitted",
  volunteerApplied: "volunteer_applied",
  accommodationRequested: "accommodation_requested",
  brochureDownload: "brochure_download",
  knowledgeHubView: "knowledge_hub_view",
  globalSearch: "global_search",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export interface AnalyticsEventPayload {
  registrationType?: string;
  step?: number;
  source?: string;
  path?: string;
  [key: string]: string | number | boolean | undefined;
}

const FUNNEL_KEY = "smk_analytics_funnel";

function readFunnel(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(FUNNEL_KEY) ?? "{}") as Record<
      string,
      number
    >;
  } catch {
    return {};
  }
}

function writeFunnel(counts: Record<string, number>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FUNNEL_KEY, JSON.stringify(counts));
}

/** Consent-gated analytics: pushes to dataLayer and local funnel tallies for admin */
export function trackEvent(
  name: AnalyticsEventName,
  payload: AnalyticsEventPayload = {}
) {
  if (typeof window === "undefined") return;

  const consent =
    localStorage.getItem(COOKIE_CONSENT_KEY) === COOKIE_CONSENT_ACCEPTED;
  const enriched = {
    event: name,
    ...payload,
    page_path: payload.path ?? window.location.pathname,
    timestamp: new Date().toISOString(),
  };

  if (consent) {
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push(enriched);

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
      .gtag;
    if (gtag) {
      gtag("event", name, payload);
    }

    void fetch("/api/v2/analytics/funnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        eventName: name,
        path: enriched.page_path,
        metadata: payload,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }

  const funnel = readFunnel();
  funnel[name] = (funnel[name] ?? 0) + 1;
  writeFunnel(funnel);
}

export function getLocalFunnelCounts(): Record<string, number> {
  return readFunnel();
}

export function captureTrafficSource() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const source =
    params.get("utm_source") ??
    params.get("ref") ??
    document.referrer?.split("/")[2] ??
    "direct";
  sessionStorage.setItem("smk_traffic_source", source);
}

export function getTrafficSource(): string {
  if (typeof window === "undefined") return "direct";
  return sessionStorage.getItem("smk_traffic_source") ?? "direct";
}
