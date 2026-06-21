/**
 * Canonical public URLs (P2). Legacy paths redirect here via next.config.js.
 */
export { MEDIA_ARCHIVE_CANONICAL } from "@/constants/canonical-routes-media";

export const CANONICAL_ROUTES = {
  home: "/",
  registration: "/registration",
  introduction: "/introduction",
  pastEvents: "/past-events",
  upcomingEvents: "/upcoming-events",
  contact: "/contact-us",
  bestWishes: "/best-wishes",
  committees: "/committees",
  mediaCenter: "/media-center",
  glimpses: "/glimpses",
  merchandise: "/merchandise",
  press: "/press",
  comingSoon: "/coming-soon",
  downloads: "/downloads",
  speakers: "/speakers/directory",
  donation: "/donation",
  /** Accommodation registration — unified hub only (legacy `/accommodation` redirects here) */
  accommodation: "/registration",
  departments: {
    academicCouncil: "/departments/academic-council",
    prabandhan: "/departments/prabandhan",
    prachar: "/departments/prachar",
    sampark: "/departments/sampark",
    vitt: "/departments/vitt",
  },
} as const;

export const PRESS_CANONICAL_PATHS: Record<number, string> = {
  1: "/press/baton-ceremony-smk-4",
  2: "/press/shiksha-mahakumbh-4-0",
  3: "/press/residential-camp-success",
  4: "/press/residential-camp-hindi",
  5: "/press/national-coverage",
  6: "/press/education-summit-coverage",
  7: "/press/mahakumbh-programme-update",
  8: "/press/education-movement",
  9: "/press/summit-highlights",
};
