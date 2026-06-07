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
      { path: "/upcomingevent", label: "Upcoming Programmes" },
      { path: "/VibhagRoute/AcademicCouncil24", label: "Academic Council 6.0" },
    ],
  },
  {
    year: "2025",
    label: "Shiksha Mahakumbh 5.0",
    routes: [
      { path: "/past_event/sm25", label: "SMK 5.0 — NIPER Mohali" },
      { path: "/pastevent", label: "Past Editions Archive" },
    ],
  },
  {
    year: "2024",
    label: "Shiksha Mahakumbh 3.0 & 4.0",
    routes: [
      { path: "/past_event/sm24", label: "SMK 4.0 — Kurukshetra University" },
      { path: "/past_event/sk24", label: "SMK 3.0 — NIT Srinagar" },
      { path: "/shikshamahakumbh2024digitalmedia", label: "Digital Media 2024" },
      { path: "/proceeding1", label: "Proceedings 2024" },
    ],
  },
  {
    year: "2023",
    label: "Shiksha Mahakumbh 1.0 & 2.0",
    routes: [
      { path: "/past_event/sm23", label: "SMK 1.0 — NIT Jalandhar" },
      { path: "/past_event/sk23", label: "SMK 2.0 — NIT Kurukshetra" },
      { path: "/shikshamahakumbh2023digitalmedia", label: "Digital Media 2023" },
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
  { path: "/shikshamahakumbh", label: "Shiksha Mahakumbh" },
  { path: "/shikshakumbh", label: "Shiksha Kumbh" },
  { path: "/conferences", label: "Conferences Hub" },
] as const;

export const EVENT_HUB_ROUTES = [
  { path: "/upcomingevent", label: "Upcoming Events" },
  { path: "/pastevent", label: "Past Events" },
  { path: "/past_event/sk24", label: "Shiksha Kumbh 2024" },
  { path: "/past_event/sk23", label: "Shiksha Kumbh 2023" },
] as const;

export const EVENTS_HUB = {
  path: "/events",
  title: "Events — Shiksha Mahakumbh",
  description:
    "Upcoming and past Shiksha Mahakumbh events, editions by year, and registration pathways.",
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
} as const;
