import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const ROUTES = {
  home: CANONICAL_ROUTES.home,
  registration: CANONICAL_ROUTES.registration,
  registrationSuccess: "/registration/success",
  admin: "/admin",
  adminRegistration: (id: string) => `/admin/registrations/${id}`,
  contact: CANONICAL_ROUTES.contact,
  introduction: CANONICAL_ROUTES.introduction,
  academicCouncil: CANONICAL_ROUTES.departments.academicCouncil,
  upcomingEvents: CANONICAL_ROUTES.upcomingEvents,
  pastEvents: CANONICAL_ROUTES.pastEvents,
  committees: CANONICAL_ROUTES.committees,
  mediaCenter: CANONICAL_ROUTES.mediaCenter,
  bestWishes: CANONICAL_ROUTES.bestWishes,
  press: CANONICAL_ROUTES.press,
  merchandise: CANONICAL_ROUTES.merchandise,
  downloads: CANONICAL_ROUTES.downloads,
  speakers: CANONICAL_ROUTES.speakers,
  donation: CANONICAL_ROUTES.donation,
  privacy: "/privacy-policy",
  faq: "/faq",
  newsletterUnsubscribe: "/newsletter/unsubscribe",
  terms: "/terms-and-conditions",
  disclaimer: "/disclaimer",
  refund: "/refund-policy",
  dashboard: "/dashboard",
  cmtSubmit: "/research/submit",
  search: "/search",
} as const;

/** Routes that expose PII — require admin session cookie */
export const PROTECTED_DATA_ROUTE_PREFIXES = ["/admin"] as const;
