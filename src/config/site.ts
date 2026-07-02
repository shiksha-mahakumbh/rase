export const CANONICAL_SITE_URL = "https://www.rase.co.in";

const LEGACY_SITE_HOSTS = new Set([
  "www.shikshamahakumbh.com",
  "shikshamahakumbh.com",
]);

/** Rewrite legacy marketing hostnames to the canonical public domain (SEO/sitemap). */
export function toCanonicalSiteUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (LEGACY_SITE_HOSTS.has(parsed.hostname.toLowerCase())) {
      return `${CANONICAL_SITE_URL}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return parsed.href.replace(/\/$/, "") === parsed.origin
      ? parsed.origin
      : parsed.href;
  } catch {
    return url;
  }
}

function resolveSiteUrl(raw?: string): string {
  const value = raw?.trim();
  if (!value) return CANONICAL_SITE_URL;

  try {
    const normalized = value.replace(/\/$/, "");
    const withProtocol = normalized.startsWith("http") ? normalized : `https://${normalized}`;
    const host = new URL(withProtocol).hostname.toLowerCase();
    if (LEGACY_SITE_HOSTS.has(host)) {
      return CANONICAL_SITE_URL;
    }
    return normalized.startsWith("http") ? normalized : `https://${normalized}`;
  } catch {
    return CANONICAL_SITE_URL;
  }
}

/** Public site origin for metadata, sitemap, emails, and JSON-LD. */
export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const SITE_NAME = "Shiksha Mahakumbh Abhiyan";
export const SITE_NAME_HINDI = "शिक्षा महाकुंभ अभियान";
export const EVENT_EDITION = "6.0";
export const EVENT_NAME = `Shiksha Mahakumbh Abhiyan ${EVENT_EDITION}`;

export const DEFAULT_OG_IMAGE = `${SITE_URL}/branding/shiksha-mahakumbh-brand-hero.png`;
export const DEFAULT_OG_WIDTH = 1200;
export const DEFAULT_OG_HEIGHT = 630;

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  sameAs: [
    "https://www.facebook.com/shikshamahakumbh",
    "https://www.youtube.com/@ShikshaMahakumbh",
    "https://www.linkedin.com/in/shiksha-mahakumbh-abhiyan-3a134a283",
  ],
};

export const EVENT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `Shiksha Mahakumbh Abhiyan ${EVENT_EDITION}`,
  startDate: "2026-10-09",
  endDate: "2026-10-11",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "NIT Hamirpur",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hamirpur",
      addressRegion: "Himachal Pradesh",
      addressCountry: "IN",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Department of Holistic Education (DHE)",
  },
};
