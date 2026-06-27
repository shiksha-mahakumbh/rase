/**
 * Shiksha Mahakumbh 2026 — global design tokens
 * Reference: docs/GLOBAL_DIGITAL_TRANSFORMATION.md
 */

export const colors = {
  navy: "#0B1F3B",
  navyLight: "#1E3A5F",
  saffron: "#FF9933",
  saffronDark: "#E67E00",
  emerald: "#059669",
  violet: "#7C3AED",
  violetLight: "#A78BFA",
  surface: "#F8FAFC",
  surfaceWarm: "#FFFBF5",
  white: "#FFFFFF",
  muted: "#64748B",
} as const;

export const event = {
  edition: "6.0",
  name: "Shiksha Mahakumbh 6.0",
  startDate: "2026-10-09",
  endDate: "2026-10-11",
  venue: "NIT Hamirpur",
  location: "Hamirpur, Himachal Pradesh, India",
  tagline: "Education · Research · Innovation · Indian Knowledge Systems",
} as const;

/** Homepage hero stats — aligned with authority.ts impactStatistics */
/** Edition messaging — keep copy aligned site-wide. */
export const editionSeries = {
  completed: "5 completed editions (1.0–5.0)",
  current: "6.0",
  currentName: "Shiksha Mahakumbh 6.0",
  programmeRange: "1.0–6.0",
  speakerArchive: "1.0–5.0",
  next: "7.0 at IIT Jammu (TBA)",
} as const;

export const impactStats = [
  { value: 5, label: "Completed Editions", suffix: "" },
  { value: 6, label: "Current Edition", suffix: ".0" },
  { value: 500, label: "Institutions Engaged", suffix: "+" },
  { value: 1200, label: "Research Papers Presented", suffix: "+" },
  { value: 14, label: "States & UTs Reached", suffix: "+" },
  { value: 2047, label: "Bharat@2047 Vision", suffix: "" },
] as const;
