export type PartnerShowcaseTab = "academic" | "media" | "sponsors";

export type PartnerShowcaseEntry = {
  name: string;
  website?: string;
};

export type PartnerShowcaseTabMeta = {
  id: PartnerShowcaseTab;
  label: string;
  shortLabel: string;
  description: string;
  seoHeading: string;
  /** Hindi subtitle for global / bilingual reach */
  subtitleHi: string;
  accent: "indigo" | "rose" | "emerald";
};

export const PARTNER_SHOWCASE_TABS: PartnerShowcaseTabMeta[] = [
  {
    id: "academic",
    label: "Academic & Knowledge Partners",
    shortLabel: "Academic",
    description:
      "Universities, IITs, NITs, research councils, and knowledge institutions across India linked to Shiksha Mahakumbh editions and proceedings.",
    seoHeading: "Academic and Knowledge Partners of Shiksha Mahakumbh",
    subtitleHi: "विश्वविद्यालय · संस्थान · अनुसंधान",
    accent: "indigo",
  },
  {
    id: "media",
    label: "Media Partners",
    shortLabel: "Media",
    description:
      "National press and digital media organisations documenting the Mahakumbh movement and education reform dialogue.",
    seoHeading: "Media Partners of Shiksha Mahakumbh",
    subtitleHi: "प्रेस · मीडिया · संवाद",
    accent: "rose",
  },
  {
    id: "sponsors",
    label: "Sponsors & Industry",
    shortLabel: "Sponsors",
    description:
      "Industry, CSR, PSUs, and institutional sponsors strengthening India's flagship multidisciplinary education summit.",
    seoHeading: "Sponsors and Industry Partners of Shiksha Mahakumbh",
    subtitleHi: "उद्योग · सहयोग · CSR",
    accent: "emerald",
  },
];

export const PARTNER_TAB_ACCENT_STYLES: Record<
  PartnerShowcaseTabMeta["accent"],
  {
    ring: string;
    bg: string;
    text: string;
    chip: string;
    glow: string;
    icon: string;
  }
> = {
  indigo: {
    ring: "ring-indigo-200/80",
    bg: "from-indigo-50/90 via-white to-violet-50/50",
    text: "text-indigo-900",
    chip: "bg-indigo-600",
    glow: "bg-indigo-400/20",
    icon: "text-indigo-600",
  },
  rose: {
    ring: "ring-rose-200/80",
    bg: "from-rose-50/90 via-white to-orange-50/40",
    text: "text-rose-900",
    chip: "bg-rose-600",
    glow: "bg-rose-400/20",
    icon: "text-rose-600",
  },
  emerald: {
    ring: "ring-emerald-200/80",
    bg: "from-emerald-50/90 via-white to-teal-50/40",
    text: "text-emerald-900",
    chip: "bg-emerald-600",
    glow: "bg-emerald-400/20",
    icon: "text-emerald-600",
  },
};

export function showcaseTabLabel(tab: PartnerShowcaseTab): string {
  return PARTNER_SHOWCASE_TABS.find((t) => t.id === tab)?.label ?? tab;
}

/** Maps admin PartnerCategory (+ legacy homepage JSON types) to homepage showcase tabs. */
export function mapCategoryToShowcaseTab(category: string): PartnerShowcaseTab {
  const normalized = category.toLowerCase();
  if (normalized === "media") return "media";
  if (normalized === "sponsor" || normalized === "sponsors") return "sponsors";
  if (normalized === "industry" || normalized === "csr") return "sponsors";
  return "academic";
}

export function adminCategoryShowcaseHint(category: string): string {
  return `Homepage tab: ${showcaseTabLabel(mapCategoryToShowcaseTab(category))}`;
}

export function normalizeAffiliationKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;:'"]/g, "");
}

export function sortAffiliations(entries: PartnerShowcaseEntry[]): PartnerShowcaseEntry[] {
  return [...entries].sort((a, b) =>
    a.name.localeCompare(b.name, "hi", { sensitivity: "base", numeric: true })
  );
}
