import type { PartnerShowcaseEntry, PartnerShowcaseTab } from "@/lib/cms/partner-showcase";
import { canonicalizeAffiliationName } from "@/lib/cms/affiliation-canonical";
import {
  CONFERENCE_SUPPORT_SECTIONS,
  tierOrderForSection,
  type ConferenceSectionId,
} from "@/lib/cms/conference-support-sections";

export type TierGroup = {
  id: string;
  labelEn: string;
  labelHi: string;
  entries: PartnerShowcaseEntry[];
};

const ORGANIZING_PATTERN =
  /holistic education|शिक्षा महाकुंभ|shiksha mahakumbh|rase\.co|विद्या भारती|vidya bharat|भारतीय शिक्षण|swadeshi jagran|स्वदेशी जागरण|think india|थिंक इंडिया|abvp|एबीवीपी|virasa|विरसा|arogya bharat|आरोग्य भारत|department of holistic|dhe\b|jaipur dialogue|जयपुर डायलॉग|geio|जी\.ई\.आई\.ओ/i;

const GOVERNMENT_PATTERN =
  /drdo|डीआरडीओ|nhpc|एनएचपीसी|nfil|एनएफआईएल|isro|csir|ugc|icar|barc|iiser|dst\b|tdb|ministry|मंत्रालय|government|सरकार|ayog|आयोग|board|बोर्ड|council|परिषद|commission|army|सेना|navy|नौसेना|ncert|pgimer|supreme court|pollution control|niscpr|higher education council|skill development|ncvet|ncism|jkbose/i;

const NATIONAL_INSTITUTE_PATTERN =
  /\biit[\s-]|आईआईटी|\bnit[\s-]|एनआईटी|\biim[\s-]|आईआईएम|\biiit\b|\biiser\b|आईआईएसईआर|\bnip[ae]r\b|नाइपर|\baiims\b|nittr|sliet/i;

const CENTRAL_UNIVERSITY_PATTERN =
  /central university|केंद्रीय विश्वविद्यालय/i;

const STATE_UNIVERSITY_PATTERN =
  /university|विश्वविद्यालय|vishwavidyalaya/i;

const COLLEGE_PATTERN =
  /college|महाविद्यालय|polytechnic|institute of engineering/i;

const PRIVATE_INSTITUTE_PATTERN =
  /deemed|chitkara|plaksha|shobhit|ramaiah|icfai|boston university|oxford/i;

const SCHOOL_PATTERN =
  /school|vidyalaya|विद्यालय|gurukul|smart school|pathshala|niketan|balghar|kendriya/i;

const YOUTUBE_PATTERN =
  /youtube|english lover|adhyayan|abhinay|ankit madan|fox path|gate smashers|technocrat/i;

const NGO_PATTERN =
  /ngo|foundation|trust|society|mission|iskcon|sarvhitkari|patanjali|vijnana|shikshan mandal|chinmaya|ramakrishna|viksit bharat/i;

const LAB_PATTERN =
  /laborator|lab\b|research centre|csir|barc|icar-|drdo|igcar|irde/i;

const MEDIA_NATIONAL_PATTERN =
  /business world|dainik|pioneer|uttam hindu|press|journal|newspaper/i;

const SPONSOR_INDUSTRY_PATTERN =
  /private limited|pvt\.?\s*ltd|english connection|youngov|requil|savantx|nhpc|nfil|allengers|hero ecotech|mbd books/i;

function academicTierOrder(name: string): number {
  if (ORGANIZING_PATTERN.test(name)) return 1;
  if (GOVERNMENT_PATTERN.test(name)) return 2;
  if (LAB_PATTERN.test(name)) return 3;
  if (NATIONAL_INSTITUTE_PATTERN.test(name)) return 4;
  if (CENTRAL_UNIVERSITY_PATTERN.test(name)) return 5;
  if (STATE_UNIVERSITY_PATTERN.test(name) && !PRIVATE_INSTITUTE_PATTERN.test(name)) return 6;
  if (COLLEGE_PATTERN.test(name)) return 7;
  if (PRIVATE_INSTITUTE_PATTERN.test(name)) return 8;
  if (SCHOOL_PATTERN.test(name)) return 9;
  if (NGO_PATTERN.test(name)) return 10;
  if (YOUTUBE_PATTERN.test(name)) return 11;
  return 12;
}

function mediaTierOrder(name: string): number {
  if (MEDIA_NATIONAL_PATTERN.test(name)) return 1;
  return 2;
}

function sponsorTierOrder(name: string): number {
  if (SPONSOR_INDUSTRY_PATTERN.test(name)) return 1;
  return 2;
}

const ACADEMIC_TIER_META: Record<number, { id: string; labelEn: string; labelHi: string }> = {
  1: { id: "organizing", labelEn: "Organizing Institutions", labelHi: "संयोजक संस्थाएँ" },
  2: { id: "government", labelEn: "Government Bodies", labelHi: "सरकारी संस्थाएँ" },
  3: { id: "research-lab", labelEn: "Research Laboratories", labelHi: "अनुसंधान प्रयोगशालाएँ" },
  4: { id: "national", labelEn: "National Institutes", labelHi: "राष्ट्रीय संस्थान" },
  5: { id: "central-uni", labelEn: "Central Universities", labelHi: "केंद्रीय विश्वविद्यालय" },
  6: { id: "state-uni", labelEn: "State Universities", labelHi: "राज्य विश्वविद्यालय" },
  7: { id: "college", labelEn: "Colleges & Institutes", labelHi: "महाविद्यालय" },
  8: { id: "private", labelEn: "Private Universities", labelHi: "निजी विश्वविद्यालय" },
  9: { id: "school", labelEn: "Schools", labelHi: "विद्यालय" },
  10: { id: "ngo", labelEn: "NGOs & Educational Bodies", labelHi: "एनजीओ" },
  11: { id: "youtube", labelEn: "Digital & YouTube", labelHi: "डिजिटल" },
  12: { id: "other", labelEn: "Other Affiliations", labelHi: "अन्य" },
};

function tierOrderForTab(tab: PartnerShowcaseTab, name: string): number {
  if (tab === "media") return mediaTierOrder(name);
  if (tab === "sponsors") return sponsorTierOrder(name);
  return academicTierOrder(name);
}

function tierOrderForEntry(tab: PartnerShowcaseTab, entry: PartnerShowcaseEntry): number {
  if (entry.sectionId) {
    return tierOrderForSection(entry.sectionId as ConferenceSectionId, tab);
  }
  return tierOrderForTab(tab, entry.name);
}

export function sortAffiliationsByTier(
  tab: PartnerShowcaseTab,
  entries: PartnerShowcaseEntry[]
): PartnerShowcaseEntry[] {
  return [...entries].sort((a, b) => {
    const tierDiff = tierOrderForEntry(tab, a) - tierOrderForEntry(tab, b);
    if (tierDiff !== 0) return tierDiff;
    if (a.website && !b.website) return -1;
    if (!a.website && b.website) return 1;
    return a.name.localeCompare(b.name, "hi", { sensitivity: "base", numeric: true });
  });
}

function groupByExplicitSection(
  tab: PartnerShowcaseTab,
  entries: PartnerShowcaseEntry[]
): TierGroup[] {
  const sections = CONFERENCE_SUPPORT_SECTIONS.filter((s) => s.tab === tab);
  const groups: TierGroup[] = [];

  for (const section of sections) {
    const sectionEntries = entries.filter((e) => e.sectionId === section.id);
    if (!sectionEntries.length) continue;
    groups.push({
      id: section.tierId,
      labelEn: section.labelEn,
      labelHi: section.labelHi,
      entries: sectionEntries,
    });
  }

  const unsectioned = entries.filter((e) => !e.sectionId);
  if (unsectioned.length) {
    groups.push({
      id: "other",
      labelEn: "Other Affiliations",
      labelHi: "अन्य संबद्ध संस्थाएँ",
      entries: unsectioned,
    });
  }

  return groups;
}

function groupByRegexTier(tab: PartnerShowcaseTab, entries: PartnerShowcaseEntry[]): TierGroup[] {
  const sorted = sortAffiliationsByTier(tab, entries);
  const map = new Map<string, TierGroup>();

  for (const entry of sorted) {
    const order = tierOrderForTab(tab, entry.name);
    const meta =
      tab === "academic"
        ? ACADEMIC_TIER_META[order] ?? ACADEMIC_TIER_META[12]!
        : { id: "other", labelEn: "Other", labelHi: "अन्य" };

    const existing = map.get(meta.id);
    const key = canonicalizeAffiliationName(entry.name).dedupeKey;
    if (existing) {
      if (!existing.entries.some((e) => canonicalizeAffiliationName(e.name).dedupeKey === key)) {
        existing.entries.push(entry);
      }
    } else {
      map.set(meta.id, {
        id: meta.id,
        labelEn: meta.labelEn,
        labelHi: meta.labelHi,
        entries: [entry],
      });
    }
  }

  return Array.from(map.values());
}

export function groupAffiliationsByTier(
  tab: PartnerShowcaseTab,
  entries: PartnerShowcaseEntry[]
): TierGroup[] {
  const sorted = sortAffiliationsByTier(tab, entries);
  const hasSections = sorted.some((e) => e.sectionId);
  if (hasSections) {
    return groupByExplicitSection(tab, sorted);
  }
  return groupByRegexTier(tab, sorted);
}
