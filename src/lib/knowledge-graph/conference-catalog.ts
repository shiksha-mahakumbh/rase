export type ConferenceYearEdition = {
  year: string;
  label: string;
  routes: { path: string; label: string }[];
};

export const CONFERENCE_YEAR_ARCHIVE: ConferenceYearEdition[] = [
  {
    year: "2026",
    label: "Shiksha Mahakumbh 6.0",
    routes: [
      { path: "/registration", label: "Register SMK 6.0" },
      { path: "/upcoming-events", label: "Upcoming Programmes" },
      { path: "/departments/academic-council", label: "Academic Council 6.0" },
    ],
  },
  {
    year: "2025",
    label: "Shiksha Mahakumbh 5.0",
    routes: [
      { path: "/past_event/sm25", label: "SMK 5.0 — NIPER Mohali" },
      { path: "/past-events", label: "Past Editions Archive" },
    ],
  },
  {
    year: "2024",
    label: "Shiksha Mahakumbh 3.0 & 4.0",
    routes: [
      { path: "/past_event/sm24", label: "SMK 4.0 — Kurukshetra University" },
      { path: "/past_event/sk24", label: "SMK 3.0 — NIT Srinagar" },
      { path: "/media/shiksha-mahakumbh/4.0/digital", label: "Digital Media 4.0" },
      { path: "/proceeding1", label: "Proceedings 2024" },
    ],
  },
  {
    year: "2023",
    label: "Shiksha Mahakumbh 1.0 & 2.0",
    routes: [
      { path: "/past_event/sm23", label: "SMK 1.0 — NIT Jalandhar" },
      { path: "/past_event/sk23", label: "SMK 2.0 — NIT Kurukshetra" },
      { path: "/media/shiksha-mahakumbh/1.0/digital", label: "Digital Media 1.0" },
    ],
  },
];

export const WORKSHOP_ARCHIVE = [
  {
    path: "/past_event/Teacher_Development_Program",
    label: "Teacher Development Program",
  },
  {
    path: "/past_event/Spoken_English_Workshop",
    label: "Spoken English Workshop",
  },
  {
    path: "/past_event/Innovation_and_Entrepreneurship_Dhe_Workshop",
    label: "Innovation & Entrepreneurship Workshop",
  },
] as const;

export const SUMMIT_ROUTES = [
  { path: "/past-events", label: "Past Editions" },
  { path: "/introduction", label: "Introduction" },
  { path: "/conferences", label: "Conferences Hub" },
] as const;

export const EVENT_HUB_ROUTES = [
  { path: "/upcoming-events", label: "Upcoming Events — 6.0 & 7.0" },
  { path: "/past-events", label: "Past Editions" },
  { path: "/past_event/sk24", label: "SMK 3.0 — NIT Srinagar" },
  { path: "/past_event/sk23", label: "SMK 2.0 — NIT Kurukshetra" },
] as const;

export const EVENTS_HUB = {
  path: "/events",
  title: "Events — Shiksha Mahakumbh Abhiyan",
  description:
    "Upcoming and past Shiksha Mahakumbh Abhiyan editions, registration pathways, and national programmes.",
} as const;

export const SUMMITS_HUB = {
  path: "/summits",
  title: "Summits & Conclaves",
  description:
    "National summits, academic conclaves, and leadership programmes in the SMK conference network.",
} as const;

export const WORKSHOPS_HUB = {
  path: "/workshops",
  title: "Workshops",
  description:
    "Teacher development, innovation, and skills workshops from past Shiksha Mahakumbh editions.",
  accent: "brand" as const,
  imageSrc: "/branding/shiksha-mahakumbh-brand-hero.png",
} as const;
