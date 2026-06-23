import { SITE_URL } from "@/config/site";

export const CONFERENCES_PAGE_HERO = {
  eyebrow: "Events · National & Global",
  title: "Conferences & Programmes",
  subtitle:
    "Upcoming editions, past archives, workshops, and national summits under Shiksha Mahakumbh Abhiyan — aligned with NEP 2020 and open to delegates across India and abroad.",
} as const;

export const CONFERENCES_STATS = [
  { label: "Upcoming", value: "SMK 6.0 & 7.0", hint: "NIT Hamirpur · IIT Jammu" },
  { label: "Completed", value: "5 editions", hint: "1.0 through 5.0" },
  { label: "Workshops", value: "2 archives", hint: "Teacher development" },
  { label: "Registration", value: "Open", hint: "Join SMK 6.0 now" },
] as const;

export const CONFERENCES_SEO_KEYWORDS = [
  "Shiksha Mahakumbh conferences",
  "national education summit India",
  "NEP 2020 conference",
  "NIT Hamirpur Shiksha Mahakumbh 6.0",
  "international education delegates",
  "Indian education conclave",
];

export const CONFERENCES_CANONICAL_URL = `${SITE_URL}/conferences`;

export const CONFERENCES_PRIMARY_LINKS = [
  { href: "/upcoming-events", label: "Upcoming Events", hint: "SMK 6.0 & 7.0", accent: "from-brand-saffron to-amber-500" },
  { href: "/past-events", label: "Past Editions", hint: "Editions 1.0 – 5.0", accent: "from-brand-navy to-slate-700" },
  { href: "/registration", label: "Registration", hint: "Join SMK 6.0", accent: "from-emerald-600 to-teal-800" },
  { href: "/workshops", label: "Workshops", hint: "Teacher & innovation archives", accent: "from-violet-600 to-indigo-800" },
] as const;
