import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { SITE_URL } from "@/config/site";
import { PRABANDHAN_TEAMS, prabandhanMemberCount } from "@/data/departments/prabandhan-members";
import { PRACHAR_MEMBERS } from "@/data/departments/prachar-members";
import { SAMPARK_MEMBERS } from "@/data/departments/sampark-members";
import { VITT_MEMBERS } from "@/data/departments/vitt-members";
import { getVibhagBySlug, type VibhagPage } from "@/data/vibhag-pages";

export const DEPARTMENTS_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export const DEPARTMENTS_OG_IMAGE = `${SITE_URL}${DEPARTMENTS_HERO_IMAGE}`;

export const SMK_6_0_VENUE_DATES = "NIT Hamirpur · 9–11 October 2026";

export type VibhagHubQuickLink = {
  label: string;
  href: string;
  icon: string;
  external?: boolean;
};

export type VibhagHubConfig = {
  slug: string;
  cmsSlug: string;
  path: string;
  pageTitle: string;
  hero: {
    eyebrow: string;
    title: string;
    titleHindi: string;
    subtitle: string;
    imageAlt: string;
  };
  intro: string;
  stats: readonly { label: string; value: string; hint: string }[];
  quickLinks: readonly VibhagHubQuickLink[];
  keywords: readonly string[];
  memberCount: number;
  coordinatorNames: string[];
};

function breadcrumbsFor(path: string, title: string) {
  return [
    { name: "Home", path: "/" },
    { name: "About", path: CANONICAL_ROUTES.introduction },
    { name: title, path },
  ] as const;
}

const SHARED_KEYWORDS = [
  "Shiksha Mahakumbh 6.0",
  "Department of Holistic Education",
  "NIT Hamirpur 2026",
  "Shiksha Mahakumbh Abhiyan",
] as const;

export const VIBHAG_HUB_BY_SLUG: Record<string, VibhagHubConfig> = {
  Prabandhan24: {
    slug: "Prabandhan24",
    cmsSlug: "prabandhan",
    path: CANONICAL_ROUTES.departments.prabandhan,
    pageTitle: "Prabandhan Vibhag — SMK 6.0 Operations",
    hero: {
      eyebrow: "Shiksha Mahakumbh 6.0 · प्रबंधन विभाग · Event Operations",
      title: "Prabandhan Vibhag",
      titleHindi: "प्रबंधन विभाग",
      subtitle:
        "Event management, registration, transport, accommodation, catering, medical, photography, exhibition, and war-room coordination for Shiksha Mahakumbh 6.0 at NIT Hamirpur.",
      imageAlt:
        "Prabandhan Vibhag — Shiksha Mahakumbh 6.0 event operations and logistics coordinators",
    },
    intro:
      "The Prabandhan Vibhag coordinates on-ground logistics for delegates, sessions, and exhibitions. Contact the team leads below for registration desks, accommodation, transport, and operational support during 9–11 October 2026.",
    stats: [
      { label: "Operations teams", value: String(PRABANDHAN_TEAMS.length), hint: "Anchoring through war room" },
      { label: "Coordinators", value: String(prabandhanMemberCount()), hint: "Listed team leads" },
      { label: "Summit dates", value: "Oct 2026", hint: SMK_6_0_VENUE_DATES },
      { label: "Host", value: "NIT Hamirpur", hint: "Shiksha Mahakumbh 6.0" },
    ],
    quickLinks: [
      { label: "Register for SMK 6.0", href: CANONICAL_ROUTES.registration, icon: "✅" },
      { label: "Academic Council", href: CANONICAL_ROUTES.departments.academicCouncil, icon: "🎓" },
      { label: "Contact DHE", href: CANONICAL_ROUTES.contact, icon: "📞" },
      { label: "Edition Brochures", href: CANONICAL_ROUTES.downloads, icon: "📄" },
      { label: "Organising Committee", href: "/committees", icon: "👥" },
      { label: "Upcoming Events", href: CANONICAL_ROUTES.upcomingEvents, icon: "🗓️" },
    ],
    keywords: [
      ...SHARED_KEYWORDS,
      "event management Shiksha Mahakumbh",
      "summit logistics India",
      "registration desk coordinator",
      "accommodation transport NIT Hamirpur",
    ],
    memberCount: prabandhanMemberCount(),
    coordinatorNames: PRABANDHAN_TEAMS.flatMap((t) => t.members.map((m) => m.name)),
  },
  Prachar24: {
    slug: "Prachar24",
    cmsSlug: "prachar",
    path: CANONICAL_ROUTES.departments.prachar,
    pageTitle: "Prachar Vibhag — SMK 6.0 Communications",
    hero: {
      eyebrow: "Shiksha Mahakumbh 6.0 · प्रचार विभाग · Outreach & Media",
      title: "Prachar Vibhag",
      titleHindi: "प्रचार विभाग",
      subtitle:
        "Communications, publicity, and national outreach for Shiksha Mahakumbh 6.0 — amplifying the Abhiyan's academic programmes and delegate engagement.",
      imageAlt: "Prachar Vibhag — Shiksha Mahakumbh 6.0 communications and outreach team",
    },
    intro:
      "The Prachar Vibhag leads publicity and outreach for the national education movement. For media partnerships, campaign coordination, and communications support, contact the coordinators listed below.",
    stats: [
      { label: "Core team", value: String(PRACHAR_MEMBERS.length), hint: "Communications leadership" },
      { label: "Focus", value: "Outreach", hint: "National publicity & engagement" },
      { label: "Summit dates", value: "Oct 2026", hint: SMK_6_0_VENUE_DATES },
      { label: "Host", value: "NIT Hamirpur", hint: "Shiksha Mahakumbh 6.0" },
    ],
    quickLinks: [
      { label: "Press Releases", href: CANONICAL_ROUTES.press, icon: "📰" },
      { label: "Media Centre", href: CANONICAL_ROUTES.mediaCenter, icon: "📺" },
      { label: "Gallery", href: CANONICAL_ROUTES.gallery, icon: "📷" },
      { label: "Best Wishes", href: CANONICAL_ROUTES.bestWishes, icon: "🙏" },
      { label: "Register for SMK 6.0", href: CANONICAL_ROUTES.registration, icon: "✅" },
      { label: "Academic Council", href: CANONICAL_ROUTES.departments.academicCouncil, icon: "🎓" },
    ],
    keywords: [
      ...SHARED_KEYWORDS,
      "education summit publicity India",
      "Shiksha Mahakumbh media outreach",
      "communications department DHE",
    ],
    memberCount: PRACHAR_MEMBERS.length,
    coordinatorNames: PRACHAR_MEMBERS.map((m) => m.name),
  },
  Sampark24: {
    slug: "Sampark24",
    cmsSlug: "sampark",
    path: CANONICAL_ROUTES.departments.sampark,
    pageTitle: "Sampark Vibhag — SMK 6.0 Institutional Liaison",
    hero: {
      eyebrow: "Shiksha Mahakumbh 6.0 · संपर्क विभाग · Stakeholder Engagement",
      title: "Sampark Vibhag",
      titleHindi: "संपर्क विभाग",
      subtitle:
        "Institutional liaison and stakeholder engagement — connecting universities, IITs, research bodies, and partner institutions with Shiksha Mahakumbh 6.0.",
      imageAlt: "Sampark Vibhag — Shiksha Mahakumbh 6.0 institutional liaison coordinators",
    },
    intro:
      "The Sampark Vibhag builds bridges between the Department of Holistic Education and participating institutions nationwide. For partnership enquiries, institutional onboarding, and delegate coordination, reach out to the liaison team below.",
    stats: [
      { label: "Liaison leads", value: String(SAMPARK_MEMBERS.length), hint: "Universities & research institutes" },
      { label: "Focus", value: "Partnerships", hint: "Institutional engagement" },
      { label: "Summit dates", value: "Oct 2026", hint: SMK_6_0_VENUE_DATES },
      { label: "Host", value: "NIT Hamirpur", hint: "Shiksha Mahakumbh 6.0" },
    ],
    quickLinks: [
      { label: "Organising Committees", href: CANONICAL_ROUTES.committees, icon: "👥" },
      { label: "Contact DHE", href: CANONICAL_ROUTES.contact, icon: "📞" },
      { label: "Introduction", href: CANONICAL_ROUTES.introduction, icon: "📜" },
      { label: "Register for SMK 6.0", href: CANONICAL_ROUTES.registration, icon: "✅" },
      { label: "Academic Council", href: CANONICAL_ROUTES.departments.academicCouncil, icon: "🎓" },
      { label: "Past Editions", href: CANONICAL_ROUTES.pastEvents, icon: "🗓️" },
    ],
    keywords: [
      ...SHARED_KEYWORDS,
      "institutional liaison education summit",
      "university partnership Shiksha Mahakumbh",
      "stakeholder engagement DHE",
    ],
    memberCount: SAMPARK_MEMBERS.length,
    coordinatorNames: SAMPARK_MEMBERS.map((m) => m.name),
  },
  Vitt24: {
    slug: "Vitt24",
    cmsSlug: "vitt",
    path: CANONICAL_ROUTES.departments.vitt,
    pageTitle: "Vitt Vibhag — SMK 6.0 Finance & Resources",
    hero: {
      eyebrow: "Shiksha Mahakumbh 6.0 · वित्त विभाग · Finance & Sponsorship",
      title: "Vitt Vibhag",
      titleHindi: "वित्त विभाग",
      subtitle:
        "Finance, resource management, and sponsorship coordination for Shiksha Mahakumbh 6.0 — supporting the Abhiyan's national programmes at NIT Hamirpur.",
      imageAlt: "Vitt Vibhag — Shiksha Mahakumbh 6.0 finance and resource management team",
    },
    intro:
      "The Vitt Vibhag oversees financial planning and resource mobilisation for the summit. For sponsorship, institutional support, or donation-related enquiries, contact the finance coordinators below or visit the donation page for secure 80G contributions.",
    stats: [
      { label: "Finance leads", value: String(VITT_MEMBERS.length), hint: "Resource management" },
      { label: "Donations", value: "80G", hint: "Tax-deductible support via Razorpay" },
      { label: "Summit dates", value: "Oct 2026", hint: SMK_6_0_VENUE_DATES },
      { label: "Host", value: "NIT Hamirpur", hint: "Shiksha Mahakumbh 6.0" },
    ],
    quickLinks: [
      { label: "Donate (80G)", href: CANONICAL_ROUTES.donation, icon: "💝" },
      { label: "Register for SMK 6.0", href: CANONICAL_ROUTES.registration, icon: "✅" },
      { label: "Contact DHE", href: CANONICAL_ROUTES.contact, icon: "📞" },
      { label: "Academic Council", href: CANONICAL_ROUTES.departments.academicCouncil, icon: "🎓" },
      { label: "Merchandise", href: CANONICAL_ROUTES.merchandise, icon: "🛍️" },
      { label: "Introduction", href: CANONICAL_ROUTES.introduction, icon: "📜" },
    ],
    keywords: [
      ...SHARED_KEYWORDS,
      "education summit sponsorship India",
      "Shiksha Mahakumbh donation 80G",
      "finance department DHE",
    ],
    memberCount: VITT_MEMBERS.length,
    coordinatorNames: VITT_MEMBERS.map((m) => m.name),
  },
};

export function getVibhagHubConfig(slug: string): VibhagHubConfig | undefined {
  return VIBHAG_HUB_BY_SLUG[slug];
}

export function vibhagHubBreadcrumbs(slug: string) {
  const hub = getVibhagHubConfig(slug);
  if (!hub) return [];
  return breadcrumbsFor(hub.path, hub.hero.title);
}

export function vibhagHubMetaDescription(slug: string): string {
  const hub = getVibhagHubConfig(slug);
  const page = getVibhagBySlug(slug);
  if (!hub || !page) return "";
  return `${page.description} — ${hub.memberCount} coordinator${hub.memberCount === 1 ? "" : "s"} listed for ${SMK_6_0_VENUE_DATES}. Contact team leads for Shiksha Mahakumbh 6.0.`;
}

export function vibhagCoordinatorItemsForSchema(slug: string): { name: string; url: string }[] {
  const hub = getVibhagHubConfig(slug);
  if (!hub) return [];
  return hub.coordinatorNames.map((name) => ({
    name,
    url: `${SITE_URL}${hub.path}#coordinators`,
  }));
}

export function cmsSlugToVibhagSlug(cmsSlug: string): string {
  const hub = Object.values(VIBHAG_HUB_BY_SLUG).find((h) => h.cmsSlug === cmsSlug);
  return hub?.slug ?? cmsSlug;
}

export function isOperationalVibhagSlug(slug: string): boolean {
  return slug in VIBHAG_HUB_BY_SLUG;
}

export function vibhagPageFromSlug(slug: string): VibhagPage | undefined {
  return getVibhagBySlug(slug);
}
