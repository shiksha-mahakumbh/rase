/**
 * Canonical public URLs (P2). Legacy paths redirect here via next.config.js.
 */
export const CANONICAL_ROUTES = {
  home: "/",
  registration: "/registration",
  introduction: "/introduction",
  pastEvents: "/past-events",
  upcomingEvents: "/upcoming-events",
  contact: "/contact-us",
  bestWishes: "/best-wishes",
  wishesReceived: "/wishes-received",
  committees: "/committees",
  mediaCenter: "/media-center",
  glimpses: "/glimpses",
  merchandise: "/merchandise",
  press: "/press",
  comingSoon: "/coming-soon",
  accommodation: "/accommodation",
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

export const MEDIA_ARCHIVE_CANONICAL: Record<
  string,
  { edition: string; year: string; type: string }
> = {
  "/shikshamahakumbh2024digitalmedia": {
    edition: "shiksha-mahakumbh",
    year: "2024",
    type: "digital",
  },
  "/shikshamahakumbh2023digitalmedia": {
    edition: "shiksha-mahakumbh",
    year: "2023",
    type: "digital",
  },
  "/shikshakumbh2024digitalmedia": {
    edition: "shiksha-kumbh",
    year: "2024",
    type: "digital",
  },
  "/shikshakumbh2023digitalmedia": {
    edition: "shiksha-kumbh",
    year: "2023",
    type: "digital",
  },
  "/printmediashikshamahakumbh2024": {
    edition: "shiksha-mahakumbh",
    year: "2024",
    type: "print",
  },
  "/printmediashikshamahakumbh2023": {
    edition: "shiksha-mahakumbh",
    year: "2023",
    type: "print",
  },
  "/printmediashikshakumbh2024": {
    edition: "shiksha-kumbh",
    year: "2024",
    type: "print",
  },
  "/printmediashikshakumbh2023": {
    edition: "shiksha-kumbh",
    year: "2023",
    type: "print",
  },
};

export function mediaArchivePath(edition: string, year: string, type: string) {
  return `/media/${edition}/${year}/${type}`;
}
