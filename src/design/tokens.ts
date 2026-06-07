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

export const impactStats = [
  { value: 5, label: "Major Editions", suffix: "" },
  { value: 6, label: "Current Edition", suffix: ".0" },
  { value: 100, label: "Institutions Engaged", suffix: "+" },
  { value: 2047, label: "Bharat@2047 Vision", suffix: "" },
] as const;
