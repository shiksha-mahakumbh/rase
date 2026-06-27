import type { CmsHomepage } from "@/lib/cms/types";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";
import { event, impactStats } from "@/design/tokens";
import { resolveHeroStatHref } from "@/lib/home/home-link-targets";

export type HeroStat = {
  label: string;
  value: number;
  suffix: string;
  href?: string;
};

export type HeroCtaLabels = {
  register: string;
  conference: string;
  donation: string;
  photoFrame: string;
};

export type HeroContent = {
  headline: string;
  subheadline: string;
  description: string;
  badge: string;
  dates: string;
  venue: string;
  heroImage: string;
  stats: HeroStat[];
  cta?: HeroCtaLabels;
  countdown?: {
    label: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
};

const BRAND_HERO = "/branding/shiksha-mahakumbh-brand-hero.png";

type HomeLocale = "en" | "hi";

const HI_HERO = {
  headline: "शिक्षा महाकुंभ 6.0",
  subheadline: "वैश्विक विमर्श निर्माण को समर्पित",
  description:
    "समग्र शिक्षा विभाग · NEP 2020, अनुसंधान, नवाचार और भारतीय ज्ञान परंपराओं के साथ राष्ट्रीय शिक्षा आंदोलन।",
  badge: "शिक्षा महाकुंभ 6.0 · पंजीकरण खुला",
  dates: "📅 9–11 अक्टूबर 2026",
  venue: "📍 एनआईटी हमीरपुर, हिमाचल प्रदेश",
  cta: {
    register: "पंजीकरण करें",
    conference: "बहु-ट्रैक सम्मेलन",
    donation: "दान के माध्यम से सहयोग",
    photoFrame: "अभियान फोटो फ्रेम →",
  },
  countdown: {
    label: "कार्यक्रम शुरू होने में",
    days: "दिन",
    hours: "घंटे",
    minutes: "मिनट",
    seconds: "सेकंड",
  },
} as const;

const HI_STAT_LABELS: Record<string, string> = {
  "Completed Editions": "पूर्ण संस्करण",
  "States & UTs Reached": "राज्य और केंद्र शासित प्रदेश",
  "Institutions Engaged": "संस्थान",
  "Research Papers": "शोध पत्र",
  "500+ Institutions": "500+ संस्थान",
  "14+ States": "14+ राज्य",
  "1200+ Papers": "1200+ शोध पत्र",
};

/** Resolve homepage hero + counter fields on the server (no client CMS hook). */
export function buildHeroContent(
  homepage: CmsHomepage | null | undefined,
  locale: HomeLocale = "en"
): HeroContent {
  const hero = getSection(homepage, "hero");
  const counters = getSection(homepage, "counters");

  const stats = sectionItems<{ label: string; value: string | number; suffix?: string }>(
    counters
  );
  const displayStats: HeroStat[] = stats.length
    ? stats.map((s) => {
        const numeric =
          typeof s.value === "number" ? s.value : parseInt(String(s.value), 10);
        const label =
          locale === "hi"
            ? (HI_STAT_LABELS[s.label] ?? s.label)
            : s.label;
        return {
          label,
          value: Number.isFinite(numeric) ? numeric : 0,
          suffix:
            s.suffix ??
            (typeof s.value === "string" && Number.isNaN(Number(s.value)) ? s.value : ""),
          href: resolveHeroStatHref(s.label),
        };
      })
    : impactStats.map((s) => ({
        label:
          locale === "hi"
            ? (HI_STAT_LABELS[s.label] ?? s.label)
            : s.label,
        value: s.value,
        suffix: s.suffix ?? "",
        href: resolveHeroStatHref(s.label),
      }));

  if (locale === "hi") {
    return {
      headline: HI_HERO.headline,
      subheadline: HI_HERO.subheadline,
      description: HI_HERO.description,
      badge: HI_HERO.badge,
      dates: HI_HERO.dates,
      venue: HI_HERO.venue,
      heroImage: sectionField(hero, "imageUrl", BRAND_HERO),
      stats: displayStats,
      cta: { ...HI_HERO.cta },
      countdown: { ...HI_HERO.countdown },
    };
  }

  return {
    headline: sectionField(hero, "headline", "शिक्षा महाकुंभ अभियान"),
    subheadline: sectionField(hero, "subheadline", "वैश्विक विमर्श निर्माण को समर्पित"),
    description: sectionField(
      hero,
      "description",
      "Department of Holistic Education · A national movement aligning NEP 2020, research, innovation, and Bharatiya knowledge traditions on one vibrant global platform."
    ),
    badge: sectionField(hero, "badge", `${event.name} · Registration Open`),
    dates: sectionField(hero, "dates", "📅 9–11 October 2026"),
    venue: sectionField(hero, "venue", `📍 ${event.venue}, HP`),
    heroImage: sectionField(hero, "imageUrl", BRAND_HERO),
    stats: displayStats,
  };
}
