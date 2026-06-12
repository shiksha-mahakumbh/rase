import type { PageCategory } from "@prisma/client";
import { createHash } from "crypto";

export const LEGACY_VISITOR_OFFSET = 94_567;
export const ACTIVE_WINDOW_MS = 5 * 60 * 1000;

const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /mediapartners/i,
  /headless/i,
  /phantom/i,
  /selenium/i,
  /curl\//i,
  /wget/i,
  /python-requests/i,
  /go-http-client/i,
  /ahrefs/i,
  /semrush/i,
  /petalbot/i,
  /bytespider/i,
];

export function hashIp(ip: string): string {
  return createHash("sha256").update(`${ip}:smk-analytics`).digest("hex").slice(0, 32);
}

export function isBotUserAgent(userAgent?: string | null): boolean {
  if (!userAgent || userAgent.length < 4) return true;
  return BOT_PATTERNS.some((p) => p.test(userAgent));
}

export function categorizePath(path: string): PageCategory {
  const p = path.split("?")[0].toLowerCase();
  if (p === "/" || p === "/en" || p === "/hi") return "homepage";
  if (p.startsWith("/registration")) return "registration";
  if (p.startsWith("/conclave")) return "conclave";
  if (
    p.startsWith("/events") ||
    p.startsWith("/upcoming") ||
    p.startsWith("/past") ||
    p.startsWith("/workshops") ||
    p.startsWith("/summits") ||
    p.startsWith("/conferences")
  ) {
    return "event";
  }
  if (p.startsWith("/downloads")) return "download";
  if (p.startsWith("/noticeboard")) return "noticeboard";
  if (p.startsWith("/media") || p.startsWith("/videos") || p.startsWith("/gallery")) {
    return "media";
  }
  if (p.startsWith("/committee") || p.startsWith("/committees")) return "committee";
  if (p.startsWith("/press") || /^\/press\d/i.test(p)) return "press";
  return "other";
}

export function parseUserAgent(ua: string): {
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  browser: string;
  browserVersion?: string;
  os: string;
  osVersion?: string;
} {
  const lower = ua.toLowerCase();
  let deviceType: "desktop" | "mobile" | "tablet" | "unknown" = "desktop";
  if (/ipad|tablet/i.test(ua)) deviceType = "tablet";
  else if (/mobile|android|iphone/i.test(ua)) deviceType = "mobile";

  let browser = "Unknown";
  let browserVersion: string | undefined;
  if (/edg\//i.test(ua)) {
    browser = "Edge";
    browserVersion = ua.match(/Edg\/([\d.]+)/i)?.[1];
  } else if (/chrome\//i.test(ua) && !/edg/i.test(ua)) {
    browser = "Chrome";
    browserVersion = ua.match(/Chrome\/([\d.]+)/i)?.[1];
  } else if (/firefox\//i.test(ua)) {
    browser = "Firefox";
    browserVersion = ua.match(/Firefox\/([\d.]+)/i)?.[1];
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = "Safari";
    browserVersion = ua.match(/Version\/([\d.]+)/i)?.[1];
  }

  let os = "Unknown";
  let osVersion: string | undefined;
  if (/windows nt/i.test(ua)) {
    os = "Windows";
    osVersion = ua.match(/Windows NT ([\d.]+)/i)?.[1];
  } else if (/android/i.test(ua)) {
    os = "Android";
    osVersion = ua.match(/Android ([\d.]+)/i)?.[1];
  } else if (/iphone|ipad/i.test(ua)) {
    os = "iOS";
    osVersion = ua.match(/OS ([\d_]+)/i)?.[1]?.replace(/_/g, ".");
  } else if (/mac os x/i.test(ua)) {
    os = "macOS";
    osVersion = ua.match(/Mac OS X ([\d_]+)/i)?.[1]?.replace(/_/g, ".");
  } else if (/linux/i.test(lower)) {
    os = "Linux";
  }

  return { deviceType, browser, browserVersion, os, osVersion };
}

export function extractReferrerDomain(referrer?: string | null): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function resolveTrafficSource(input: {
  utmSource?: string | null;
  utmMedium?: string | null;
  referrer?: string | null;
}): { source: string; medium: string } {
  if (input.utmSource) {
    return {
      source: input.utmSource,
      medium: input.utmMedium ?? "unknown",
    };
  }
  const domain = extractReferrerDomain(input.referrer);
  if (!domain) return { source: "direct", medium: "none" };
  if (/google|bing|yahoo|duckduckgo|baidu/i.test(domain)) {
    return { source: domain, medium: "organic" };
  }
  if (/facebook|instagram|twitter|x\.com|linkedin|youtube|t\.co/i.test(domain)) {
    return { source: domain, medium: "social" };
  }
  return { source: domain, medium: "referral" };
}

export function startOfDay(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function startOfWeek(d = new Date()): Date {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

export function startOfMonth(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function startOfYear(d = new Date()): Date {
  return new Date(d.getFullYear(), 0, 1);
}
