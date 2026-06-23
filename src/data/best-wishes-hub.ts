import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { SITE_URL } from "@/config/site";
import { committeePathForEdition } from "@/lib/committee/edition-slugs";
import {
  BEST_WISHES_HERO,
  BEST_WISHES_KEYWORDS,
  BEST_WISHES_STATS,
  bestWishesCount,
} from "@/data/best-wishes";
import { UPCOMING_EDITION } from "@/data/past-editions";

export const BEST_WISHES_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export const BEST_WISHES_HERO_IMAGE_ALT =
  "Shiksha Mahakumbh Abhiyan best wishes — dignitary messages from national and international leaders";

export const BEST_WISHES_OG_IMAGE = `${SITE_URL}${BEST_WISHES_HERO_IMAGE}`;

export const BEST_WISHES_CANONICAL_URL = `${SITE_URL}${CANONICAL_ROUTES.bestWishes}`;

export { BEST_WISHES_HERO as BEST_WISHES_PAGE_HERO };

export const BEST_WISHES_HUB_STATS = [
  { label: "Total messages", value: String(BEST_WISHES_STATS.total), hint: "Dignitary greetings archived" },
  { label: "Featured", value: String(BEST_WISHES_STATS.featured), hint: "President, ministers, VCs" },
  {
    label: "International",
    value: `${BEST_WISHES_STATS.international}`,
    hint: "Oxford, Boston University & global leaders",
  },
  { label: "Languages", value: "EN + HI", hint: "English and Hindi messages" },
] as const;

export const BEST_WISHES_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "About", path: CANONICAL_ROUTES.introduction },
  { name: "Best Wishes", path: CANONICAL_ROUTES.bestWishes },
] as const;

export const BEST_WISHES_QUICK_LINKS = [
  { label: "Introduction", href: CANONICAL_ROUTES.introduction, icon: "📜" },
  { label: "Abhiyan Photo Frame", href: "/abhiyaninphotoframe", icon: "🖼️" },
  { label: "Speaker Directory", href: CANONICAL_ROUTES.speakers, icon: "🎤" },
  { label: "Past Editions", href: CANONICAL_ROUTES.pastEvents, icon: "🗓️" },
  { label: "Media Centre", href: CANONICAL_ROUTES.mediaCenter, icon: "📺" },
  { label: "Register for SMK 6.0", href: CANONICAL_ROUTES.registration, icon: "✅" },
] as const;

export { BEST_WISHES_KEYWORDS };

export const BEST_WISHES_UPCOMING_CTA = {
  title: UPCOMING_EDITION.title,
  venue: UPCOMING_EDITION.venue,
  dates: UPCOMING_EDITION.dates,
  registrationHref: UPCOMING_EDITION.registrationHref,
  learnMoreHref: UPCOMING_EDITION.href,
  committeeHref: committeePathForEdition("6.0"),
  message:
    "Share your institution's support for Shiksha, Prakriti aur Pragati — register as a delegate or explore the SMK 6.0 organising committee.",
} as const;

export function bestWishesMetaDescription(): string {
  const total = bestWishesCount();
  return `Read best wishes from ${total} presidents, governors, ministers, IIT/IIM/CSIR directors, UGC leadership, and University of Oxford — supporting the Shiksha Mahakumbh Abhiyan. Search all dignitary messages.`;
}

export function bestWishesPageTitle(): string {
  return `Best Wishes — ${bestWishesCount()} Dignitary Messages`;
}

export function wishAnchorUrl(wishId: string): string {
  return `${BEST_WISHES_CANONICAL_URL}#${wishId}`;
}
