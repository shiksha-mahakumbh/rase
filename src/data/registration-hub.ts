import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { SITE_URL } from "@/config/site";
import { CMT_SUBMIT_PATH } from "@/lib/registration/config";
import { committeePathForEdition } from "@/lib/committee/edition-slugs";
import { event } from "@/design/tokens";
import type { RegistrationType } from "@/types/registration";

export const REGISTRATION_PATH = CANONICAL_ROUTES.registration;

export const REGISTRATION_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export const REGISTRATION_HERO_IMAGE_ALT =
  "Register for Shiksha Mahakumbh 6.0 — official delegate and programme registration at NIT Hamirpur";

export const REGISTRATION_OG_IMAGE = `${SITE_URL}${REGISTRATION_HERO_IMAGE}`;

export const REGISTRATION_CANONICAL_URL = `${SITE_URL}${REGISTRATION_PATH}`;

export const REGISTRATION_DEADLINE = "31 August 2026";

export const REGISTRATION_PAGE_HERO = {
  eyebrow: "Shiksha Mahakumbh 6.0 · NIT Hamirpur",
  titleEn: "Register",
  titleHi: "आधिकारिक पंजीकरण",
  subtitle:
    "Official registration for delegates, conclaves, olympiad, awards, exhibitions, research tracks, and project displays — 9–11 October 2026.",
} as const;

export const REGISTRATION_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Register", path: REGISTRATION_PATH },
] as const;

/** Step-1 category groupings — reduces choice paralysis on the registration hub. */
export const REGISTRATION_CATEGORY_GROUPS: {
  title: string;
  hint: string;
  types: RegistrationType[];
  recommended?: boolean;
}[] = [
  {
    title: "Most participants",
    hint: "Faculty, students, and institutional delegates attending SMK 6.0",
    types: ["Delegate Registration"],
    recommended: true,
  },
  {
    title: "Programme tracks",
    hint: "Free on-site forms — conclaves, awards, olympiad, exhibitions, and more",
    types: [
      "Conclave",
      "Awards",
      "Olympiad",
      "Exhibition",
      "Best Practices",
      "Bal Shodh Patrika",
      "Cultural Program",
    ],
  },
  {
    title: "Project displays",
    hint: "School, college, and university level projects (paid registration)",
    types: ["Projects"],
  },
  {
    title: "Research papers",
    hint: "Secure on-site page before Microsoft CMT (opens 30 June 2026)",
    types: ["Multi Track Conference"],
  },
];

export const REGISTRATION_QUICK_LINKS = [
  { label: "Edition Brochures", href: `${CANONICAL_ROUTES.downloads}#edition-brochures`, icon: "📄" },
  { label: "Academic Council", href: CANONICAL_ROUTES.departments.academicCouncil, icon: "🎓" },
  { label: "My Registration", href: "/dashboard", icon: "🪪" },
  { label: "Organising Committee", href: committeePathForEdition("6.0"), icon: "👥" },
  { label: "Upcoming Events", href: CANONICAL_ROUTES.upcomingEvents, icon: "🗓️" },
  { label: "Contact DHE", href: CANONICAL_ROUTES.contact, icon: "📞" },
  { label: "Submit Paper (CMT)", href: CMT_SUBMIT_PATH, icon: "📝" },
] as const;

export const REGISTRATION_SUCCESS_LINKS = [
  { label: "My registration portal", href: "/dashboard" },
  { label: "Academic Council programmes", href: CANONICAL_ROUTES.departments.academicCouncil },
  { label: "Edition 6.0 brochure", href: `${CANONICAL_ROUTES.downloads}#edition-brochures` },
  { label: "Official merchandise", href: CANONICAL_ROUTES.merchandise },
  { label: "Organising committee", href: committeePathForEdition("6.0") },
  { label: "Prabandhan (logistics)", href: CANONICAL_ROUTES.departments.prabandhan },
] as const;

export const REGISTRATION_SEO_KEYWORDS = [
  "Shiksha Mahakumbh registration",
  "SMK 2026 register",
  "NIT Hamirpur conference registration",
  "education summit India registration",
  "Shiksha Mahakumbh 6.0 delegate",
  "DHE olympiad registration",
  "NEP 2020 conference register",
  "Department of Holistic Education registration",
] as const;

export function registrationMetaDescription(): string {
  return `Official registration for ${event.name} at ${event.venue}, 9–11 October 2026. Delegate, conclave, olympiad, awards, exhibitions, research tracks, and project displays. Accommodation opens September 2026. Deadline ${REGISTRATION_DEADLINE}.`;
}

export const REGISTRATION_FAQ = [
  {
    question: "How do I register for Shiksha Mahakumbh 6.0?",
    answer: `Complete the official registration form at ${REGISTRATION_CANONICAL_URL}. You will receive an SMK2026 registration ID after submission.`,
  },
  {
    question: "When is Shiksha Mahakumbh 6.0?",
    answer: "9–11 October 2026 at NIT Hamirpur, Himachal Pradesh, India.",
  },
  {
    question: "What is the registration deadline?",
    answer: `${REGISTRATION_DEADLINE} for summit registration categories on the official DHE platform.`,
  },
  {
    question: "What registration categories are available?",
    answer:
      "Delegate, Conclave, Best Practices, Olympiad, Awards, Exhibition, Projects, Bal Shodh Patrika, and Cultural Program. Multi Track Conference papers are submitted via Microsoft CMT. Accommodation booking opens in September 2026.",
  },
  {
    question: "How do I submit a research paper?",
    answer: `Authors submit via the official Microsoft CMT portal (${CMT_SUBMIT_PATH}).`,
  },
  {
    question: "How do I access my registration after signing up?",
    answer: `Use the Participant Portal at ${SITE_URL}/dashboard with your registration ID and the email you used during registration. Download receipts, badges, and update your profile there.`,
  },
  {
    question: "Which categories require payment?",
    answer:
      "Delegate registration may require payment depending on category and fee. Projects use the paid registration flow (₹200 school level · ₹500 college/university level). Conclave, Olympiad, Awards, Exhibition, Best Practices, Bal Shodh Patrika, and Cultural Program are free on-site forms unless otherwise noted. Accommodation is not open for booking yet — details in September.",
  },
] as const;
