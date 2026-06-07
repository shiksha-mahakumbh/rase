export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rase.co.in";

export const SITE_NAME = "Shiksha Mahakumbh Abhiyan";
export const SITE_NAME_HINDI = "शिक्षा महाकुंभ अभियान";
export const EVENT_EDITION = "6.0";
export const EVENT_NAME = `Shiksha Mahakumbh ${EVENT_EDITION}`;

export const DEFAULT_OG_IMAGE = `${SITE_URL}/sLogo.png`;

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
  name: `Shiksha Mahakumbh ${EVENT_EDITION}`,
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
