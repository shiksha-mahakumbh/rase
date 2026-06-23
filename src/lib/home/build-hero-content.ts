import type { CmsHomepage } from "@/lib/cms/types";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";
import { event, impactStats } from "@/design/tokens";

export type HeroStat = {
  label: string;
  value: number;
  suffix: string;
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
};

const BRAND_HERO = "/branding/shiksha-mahakumbh-brand-hero.png";

/** Resolve homepage hero + counter fields on the server (no client CMS hook). */
export function buildHeroContent(homepage: CmsHomepage | null | undefined): HeroContent {
  const hero = getSection(homepage, "hero");
  const counters = getSection(homepage, "counters");

  const stats = sectionItems<{ label: string; value: string | number; suffix?: string }>(
    counters
  );
  const displayStats: HeroStat[] = stats.length
    ? stats.map((s) => {
        const numeric =
          typeof s.value === "number" ? s.value : parseInt(String(s.value), 10);
        return {
          label: s.label,
          value: Number.isFinite(numeric) ? numeric : 0,
          suffix:
            s.suffix ??
            (typeof s.value === "string" && Number.isNaN(Number(s.value)) ? s.value : ""),
        };
      })
    : impactStats.map((s) => ({
        label: s.label,
        value: s.value,
        suffix: s.suffix ?? "",
      }));

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
