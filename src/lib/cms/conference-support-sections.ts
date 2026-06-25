import type { PartnerShowcaseTab } from "@/lib/cms/partner-showcase";

export type ConferenceSectionId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M";

export type ConferenceSectionMeta = {
  id: ConferenceSectionId;
  tierId: string;
  tab: PartnerShowcaseTab;
  labelEn: string;
  labelHi: string;
  order: number;
};

export const CONFERENCE_SUPPORT_SECTIONS: ConferenceSectionMeta[] = [
  {
    id: "A",
    tierId: "organizing",
    tab: "academic",
    labelEn: "Organizing Institutions",
    labelHi: "संयोजक संस्थाएँ",
    order: 1,
  },
  {
    id: "B",
    tierId: "government",
    tab: "academic",
    labelEn: "Government Bodies & National Agencies",
    labelHi: "सरकारी संस्थाएँ",
    order: 2,
  },
  {
    id: "C",
    tierId: "research-lab",
    tab: "academic",
    labelEn: "National Research Laboratories & Scientific Bodies",
    labelHi: "राष्ट्रीय अनुसंधान प्रयोगशालाएँ",
    order: 3,
  },
  {
    id: "D",
    tierId: "national",
    tab: "academic",
    labelEn: "Institutes of National Importance (IIT · IIM · NIT · AIIMS)",
    labelHi: "राष्ट्रीय महत्व के संस्थान",
    order: 4,
  },
  {
    id: "E",
    tierId: "central-uni",
    tab: "academic",
    labelEn: "Central Universities",
    labelHi: "केंद्रीय विश्वविद्यालय",
    order: 5,
  },
  {
    id: "F",
    tierId: "state-uni",
    tab: "academic",
    labelEn: "State Universities",
    labelHi: "राज्य विश्वविद्यालय",
    order: 6,
  },
  {
    id: "G",
    tierId: "private",
    tab: "academic",
    labelEn: "Private & Deemed Universities",
    labelHi: "निजी व डीम्ड विश्वविद्यालय",
    order: 7,
  },
  {
    id: "H",
    tierId: "college",
    tab: "academic",
    labelEn: "Colleges & Higher Education Institutions",
    labelHi: "महाविद्यालय व संस्थान",
    order: 8,
  },
  {
    id: "I",
    tierId: "school",
    tab: "academic",
    labelEn: "Schools",
    labelHi: "विद्यालय",
    order: 9,
  },
  {
    id: "J",
    tierId: "ngo",
    tab: "academic",
    labelEn: "NGOs, Educational Bodies & Social Organizations",
    labelHi: "एनजीओ व शैक्षिक संस्थाएँ",
    order: 10,
  },
  {
    id: "M",
    tierId: "youtube",
    tab: "academic",
    labelEn: "Digital & YouTube Partners",
    labelHi: "डिजिटल व यूट्यूब साझेदार",
    order: 11,
  },
  {
    id: "L",
    tierId: "national-press",
    tab: "media",
    labelEn: "Media Partners",
    labelHi: "मीडिया साझेदार",
    order: 1,
  },
  {
    id: "K",
    tierId: "industry",
    tab: "sponsors",
    labelEn: "PSU, Industry, CSR & Corporate Partners",
    labelHi: "उद्योग व CSR साझेदार",
    order: 1,
  },
];

export function sectionMeta(id: ConferenceSectionId): ConferenceSectionMeta {
  return CONFERENCE_SUPPORT_SECTIONS.find((s) => s.id === id)!;
}

export function tierOrderForSection(sectionId: ConferenceSectionId, tab: PartnerShowcaseTab): number {
  const meta = CONFERENCE_SUPPORT_SECTIONS.find((s) => s.id === sectionId && s.tab === tab);
  return meta?.order ?? 99;
}
