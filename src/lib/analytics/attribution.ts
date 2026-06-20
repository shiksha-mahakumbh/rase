const STORAGE_KEY = "smk_attribution";

export interface AttributionBundle {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  referrer: string;
  trafficSource: string;
  deviceType: string;
  browserLanguage: string;
  screenClass: string;
}

function deviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function screenClass(): string {
  if (typeof window === "undefined") return "unknown";
  const w = window.innerWidth;
  if (w < 640) return "sm";
  if (w < 1024) return "md";
  return "lg";
}

export function captureAttribution(): AttributionBundle {
  if (typeof window === "undefined") {
    return {
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
      referrer: "",
      trafficSource: "direct",
      deviceType: "unknown",
      browserLanguage: "en",
      screenClass: "unknown",
    };
  }

  const params = new URLSearchParams(window.location.search);
  const bundle: AttributionBundle = {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmTerm: params.get("utm_term") ?? "",
    utmContent: params.get("utm_content") ?? "",
    referrer: document.referrer ?? "",
    trafficSource:
      params.get("utm_source") ??
      params.get("ref") ??
      document.referrer?.split("/")[2] ??
      "direct",
    deviceType: deviceType(),
    browserLanguage: navigator.language ?? "en",
    screenClass: screenClass(),
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
  return bundle;
}

export function getAttribution(): AttributionBundle {
  if (typeof window === "undefined") {
    return captureAttribution();
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AttributionBundle;
  } catch {
    /* ignore */
  }
  return captureAttribution();
}

export function attributionForSubmission(): Record<string, string> {
  const a = getAttribution();
  return {
    trafficSource: a.trafficSource,
    utmSource: a.utmSource,
    utmMedium: a.utmMedium,
    utmCampaign: a.utmCampaign,
    utmTerm: a.utmTerm,
    utmContent: a.utmContent,
    deviceType: a.deviceType,
    browserLanguage: a.browserLanguage,
    screenClass: a.screenClass,
  };
}
