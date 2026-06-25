import type { CmsAnnouncementBar } from "@/lib/cms/types";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";
import { event } from "@/design/tokens";
import { resolveNavHref } from "@/lib/security/safe-nav-url";

export type AnnouncementIconKey = "programmes" | "registration" | "research" | "notices";

export type CmsAnnouncementItemInput = {
  title?: string;
  body?: string;
  detail?: string;
  url?: string;
  cta?: string;
};

export type ResolvedAnnouncementItem = {
  id: string;
  title: string;
  summary: string;
  detail: string;
  href: string;
  external: boolean;
  cta: string;
  iconKey: AnnouncementIconKey;
};

const DEFAULT_EN: Omit<ResolvedAnnouncementItem, "id">[] = [
  {
    title: "Programmes @ Shiksha Mahakumbh 6.0",
    summary: "7 conclaves, olympiads, exhibitions, awards & more",
    detail:
      "Explore the Academic Council schedule — policy conclaves, DHE Olympiads, best practices, student projects, and Bal Shodh Patrika at NIT Hamirpur.",
    href: CANONICAL_ROUTES.departments.academicCouncil,
    external: false,
    cta: "View Programmes",
    iconKey: "programmes",
  },
  {
    title: "Registration Open — Shiksha Mahakumbh 6.0",
    summary: `9–11 Oct 2026 · ${event.venue} · All registration types`,
    detail:
      "Delegates, institutions, volunteers, exhibitors, and accommodation requests — complete unified registration for SMK 6.0.",
    href: CANONICAL_ROUTES.registration,
    external: false,
    cta: "Register Now",
    iconKey: "registration",
  },
  {
    title: "Multi-Track Conference — Submit Research",
    summary: "Paper & abstract submission via Microsoft CMT (SMK2026)",
    detail:
      "Authors may submit to the Multi-Track International Conference on the official CMT portal for Shiksha Mahakumbh 6.0. Formatting guidelines and track details are on the Academic Council conference page.",
    href: CMT_SUBMISSION_URL,
    external: true,
    cta: "Open CMT Portal",
    iconKey: "research",
  },
  {
    title: "Official Notices & Deadlines",
    summary: "Campus circulars, accommodation, and programme updates",
    detail:
      "Registration windows, abstract timelines, and venue advisories are published on the notice board — refreshed for SMK 1.0–6.0 delegates.",
    href: "/noticeboard",
    external: false,
    cta: "View Notice Board",
    iconKey: "notices",
  },
];

const DEFAULT_HI: Omit<ResolvedAnnouncementItem, "id">[] = [
  {
    title: "शिक्षा महाकुंभ 6.0 — कार्यक्रम",
    summary: "अधिवेशन, ओलंपियाड, प्रदर्शनी एवं पुरस्कार",
    detail: "शैक्षणिक परिषद के अंतर्गत सभी सत्रों की जानकारी देखें।",
    href: CANONICAL_ROUTES.departments.academicCouncil,
    external: false,
    cta: "कार्यक्रम देखें",
    iconKey: "programmes",
  },
  {
    title: "पंजीकरण खुला — SMK 6.0",
    summary: "9–11 अक्टूबर 2026 · एनआईटी हमीरपुर",
    detail: "सभी श्रेणियों के लिए एकीकृत पंजीकरण प्रारंभ।",
    href: CANONICAL_ROUTES.registration,
    external: false,
    cta: "पंजीकरण करें",
    iconKey: "registration",
  },
  {
    title: "बहु-ट्रैक सम्मेलन — सार-पत्र",
    summary: "Microsoft CMT के माध्यम से जमा करें",
    detail: "शोध सार-पत्र और पत्र CMT पोर्टल पर जमा करें।",
    href: CMT_SUBMISSION_URL,
    external: true,
    cta: "CMT पोर्टल",
    iconKey: "research",
  },
  {
    title: "आधिकारिक सूचनाएँ",
    summary: "परिसर सूचनाएँ और समयसीमा",
    detail: "पंजीकरण, आवास और कार्यक्रम अपडेट नोटिस बोर्ड पर।",
    href: "/noticeboard",
    external: false,
    cta: "नोटिस बोर्ड",
    iconKey: "notices",
  },
];

export const DEFAULT_ANNOUNCEMENT_BARS_EN: CmsAnnouncementBar[] = [
  {
    id: "default-bar-registration",
    title: "SMK 6.0 Registration",
    message: `Shiksha Mahakumbh 6.0 — 9–11 Oct 2026 at ${event.venue}. Registration open.`,
    barType: "global",
    colorTheme: "primary",
    ctaLabel: "Register now",
    ctaUrl: CANONICAL_ROUTES.registration,
    isDismissible: true,
  },
  {
    id: "default-bar-programmes",
    title: "Programmes & Conclaves",
    message: "Explore 7 thematic conclaves, olympiads, exhibitions, and the Multi-Track Conference.",
    barType: "global",
    colorTheme: "primary",
    ctaLabel: "View programmes",
    ctaUrl: CANONICAL_ROUTES.departments.academicCouncil,
    isDismissible: true,
  },
  {
    id: "default-bar-notices",
    title: "Notice Board",
    message: "Official circulars, deadlines, and campus updates for delegates and institutions.",
    barType: "global",
    colorTheme: "primary",
    ctaLabel: "View notices",
    ctaUrl: "/noticeboard",
    isDismissible: true,
  },
];

export const DEFAULT_ANNOUNCEMENT_BARS_HI: CmsAnnouncementBar[] = [
  {
    id: "default-bar-registration-hi",
    title: "SMK 6.0 पंजीकरण",
    message: "9–11 अक्टूबर 2026, एनआईटी हमीरपुर — पंजीकरण खुला।",
    barType: "global",
    colorTheme: "primary",
    ctaLabel: "पंजीकरण करें",
    ctaUrl: CANONICAL_ROUTES.registration,
    isDismissible: true,
  },
  {
    id: "default-bar-programmes-hi",
    title: "कार्यक्रम",
    message: "अधिवेशन, ओलंपियाड और बहु-ट्रैक सम्मेलन की जानकारी।",
    barType: "global",
    colorTheme: "primary",
    ctaLabel: "कार्यक्रम देखें",
    ctaUrl: CANONICAL_ROUTES.departments.academicCouncil,
    isDismissible: true,
  },
];

export const FALLBACK_WELCOME_MODAL = {
  title: "शिक्षा महाकुंभ अभियान",
  subtitle: `${event.edition} Edition · ${event.venue}`,
  message: `Join the national educational movement at ${event.venue} from 9–11 October 2026.`,
  messageHi:
    "9–11 अक्टूबर 2026 को एनआईटी हमीरपुर में राष्ट्रीय शैक्षिक आंदोलन से जुड़ें।",
  ctaUrl: CANONICAL_ROUTES.registration,
  ctaLabel: "Register now",
  ctaLabelHi: "पंजीकरण करें",
} as const;

export function getFallbackWelcomeModal(locale: string) {
  const isHi = locale === "hi";
  return {
    title: FALLBACK_WELCOME_MODAL.title,
    subtitle: FALLBACK_WELCOME_MODAL.subtitle,
    message: isHi ? FALLBACK_WELCOME_MODAL.messageHi : FALLBACK_WELCOME_MODAL.message,
    ctaUrl: FALLBACK_WELCOME_MODAL.ctaUrl,
    ctaLabel: isHi ? FALLBACK_WELCOME_MODAL.ctaLabelHi : FALLBACK_WELCOME_MODAL.ctaLabel,
  };
}

export function filterCmsAnnouncementItems(
  items: CmsAnnouncementItemInput[]
): CmsAnnouncementItemInput[] {
  return items.filter((item) => Boolean(item.title?.trim() && item.body?.trim()));
}

function cmsItemToResolved(
  item: CmsAnnouncementItemInput,
  index: number
): ResolvedAnnouncementItem {
  const title = item.title!.trim();
  const summary = item.body!.trim();
  const detail = item.detail?.trim() || summary;
  const nav = resolveNavHref(item.url, CANONICAL_ROUTES.registration);
  const iconKeys: AnnouncementIconKey[] = ["programmes", "registration", "research", "notices"];

  return {
    id: `announcement-cms-${index}`,
    title,
    summary,
    detail,
    href: nav.href,
    external: nav.external,
    cta: item.cta?.trim() || "Learn more",
    iconKey: iconKeys[index % iconKeys.length],
  };
}

function withIds(items: Omit<ResolvedAnnouncementItem, "id">[]): ResolvedAnnouncementItem[] {
  return items.map((item, index) => ({
    id: `announcement-default-${index}`,
    ...item,
  }));
}

export function getDefaultAnnouncementItems(locale: string = "en"): ResolvedAnnouncementItem[] {
  return withIds(locale === "hi" ? DEFAULT_HI : DEFAULT_EN);
}

export function resolveAnnouncementItems(
  cmsItems: CmsAnnouncementItemInput[] | null | undefined,
  locale: string = "en"
): ResolvedAnnouncementItem[] {
  const valid = filterCmsAnnouncementItems(cmsItems ?? []);
  if (valid.length > 0) return valid.map(cmsItemToResolved);
  return getDefaultAnnouncementItems(locale);
}

export function getDefaultAnnouncementBars(locale: string = "en"): CmsAnnouncementBar[] {
  return locale === "hi" ? DEFAULT_ANNOUNCEMENT_BARS_HI : DEFAULT_ANNOUNCEMENT_BARS_EN;
}

export function resolveAnnouncementBars(
  bars: CmsAnnouncementBar[] | null | undefined,
  locale: string = "en"
): CmsAnnouncementBar[] {
  if (bars && bars.length > 0) return bars;
  return getDefaultAnnouncementBars(locale);
}

export type TickerItem = {
  text: string;
  href: string;
  external: boolean;
};

export function announcementBarsToTicker(bars: CmsAnnouncementBar[]): TickerItem[] {
  return bars.map((b) => {
    const nav = resolveNavHref(b.ctaUrl, CANONICAL_ROUTES.registration);
    return {
      text: b.message,
      href: nav.href,
      external: nav.external,
    };
  });
}

export function pickWelcomeModalBar(
  bars: CmsAnnouncementBar[] | null | undefined
): CmsAnnouncementBar | null {
  const list = bars ?? [];
  return (
    list.find((b) => b.barType === "registration_alert") ??
    list.find((b) => b.barType === "emergency") ??
    list.find((b) => b.barType === "global") ??
    list.find((b) => b.barType === "deadline_reminder") ??
    null
  );
}

export function barsForTicker(
  bars: CmsAnnouncementBar[] | null | undefined,
  locale: string = "en"
): CmsAnnouncementBar[] {
  const list = resolveAnnouncementBars(bars, locale);
  const modalBar = pickWelcomeModalBar(list);
  if (!modalBar) return list;
  return list.filter((b) => b.id !== modalBar.id);
}

export function resolveTickerItems(
  bars: CmsAnnouncementBar[] | null | undefined,
  locale: string = "en"
): TickerItem[] {
  return announcementBarsToTicker(barsForTicker(bars, locale));
}
