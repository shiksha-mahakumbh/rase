import type { PartnerShowcaseTab } from "@/lib/cms/partner-showcase";
import { normalizeAffiliationKey } from "@/lib/cms/partner-showcase";

export type CanonicalAffiliation = {
  displayName: string;
  dedupeKey: string;
  forcedTab?: PartnerShowcaseTab;
  website?: string;
};

type CanonicalRule = {
  displayName: string;
  dedupeKey: string;
  patterns: RegExp[];
  forcedTab?: PartnerShowcaseTab;
  website?: string;
};

/** Canonical names, dedupe keys, and optional forced tab for Hindi/English variants */
const CANONICAL_RULES: CanonicalRule[] = [
  {
    displayName: "The Pioneer",
    dedupeKey: "the pioneer",
    patterns: [/the\s*pioneer|द\s*पायनियर|पायनियर/i],
    forcedTab: "media",
    website: "https://www.dailypioneer.com/",
  },
  {
    displayName: "Uttam Hindu",
    dedupeKey: "uttam hindu",
    patterns: [/uttam\s*hindu|उत्तम\s*हिंदू|द\s*उत्तम\s*हिंदू/i],
    forcedTab: "media",
    website: "https://www.uttamhindu.com/",
  },
  {
    displayName: "Business World",
    dedupeKey: "business world",
    patterns: [/business\s*world/i],
    forcedTab: "media",
    website: "https://businessworld.in/",
  },
  {
    displayName: "Dainik Savera",
    dedupeKey: "dainik savera",
    patterns: [/dainik\s*savera/i],
    forcedTab: "media",
    website: "https://epaper.dainiksaveratimes.in/",
  },
  {
    displayName: "DRDO",
    dedupeKey: "drdo",
    patterns: [/drdo|डीआरडीओ|tvrl/i],
    forcedTab: "sponsors",
    website: "https://www.drdo.gov.in/",
  },
  {
    displayName: "NHPC",
    dedupeKey: "nhpc",
    patterns: [/\bnhpc\b|एनएचपीसी/i],
    forcedTab: "sponsors",
    website: "https://www.nhpcindia.com/",
  },
  {
    displayName: "NFIL",
    dedupeKey: "nfil",
    patterns: [/nfil|एनएफआईएल/i],
    forcedTab: "sponsors",
    website: "https://www.nfil.in/",
  },
  {
    displayName: "English Connection",
    dedupeKey: "english connection",
    patterns: [/english\s*connection|इंग्लिश\s*कनेक्शन/i],
    forcedTab: "sponsors",
    website: "https://www.englishconnection.online/",
  },
  {
    displayName: "Youngovator",
    dedupeKey: "youngovator",
    patterns: [/youngov|यंगोवेटर|यंगोनोवेतर|यांगोनोवेतर/i],
    forcedTab: "sponsors",
    website: "https://youngovator.com/",
  },
  {
    displayName: "Vidya Bharati",
    dedupeKey: "vidya bharati",
    patterns: [/vidya\s*bharat|विद्या\s*भारती/i],
    website: "https://www.vidyabharati.org/",
  },
  {
    displayName: "Bharatiya Shikshan Mandal",
    dedupeKey: "bharatiya shikshan mandal",
    patterns: [/bharatiya\s*shikshan|भारतीय\s*शिक्षण\s*मंडल/i],
    website: "https://www.bharatiyashikshanmandalfbd.org/",
  },
  {
    displayName: "Department of Holistic Education",
    dedupeKey: "department of holistic education",
    patterns: [/holistic\s*education|\bdhe\b|डीएचई/i],
    website: "https://www.dhe.org.in/",
  },
  {
    displayName: "NIT Hamirpur",
    dedupeKey: "nit hamirpur",
    patterns: [/nit\s*hamirpur|एनआईटी\s*हमीरपुर/i],
    website: "https://nith.ac.in/",
  },
  {
    displayName: "NIT Kurukshetra",
    dedupeKey: "nit kurukshetra",
    patterns: [/nit\s*kurukshetra|एनआईटी\s*कुरुक्षेत्र/i],
    website: "https://nitkkr.ac.in/",
  },
  {
    displayName: "IIT Ropar",
    dedupeKey: "iit ropar",
    patterns: [/iit\s*ropar|आईआईटी\s*रोपड़/i],
    website: "https://www.iitrpr.ac.in/",
  },
  {
    displayName: "IIM Amritsar",
    dedupeKey: "iim amritsar",
    patterns: [/iim\s*amritsar|आईआईएम\s*अमृतसर|आइआइएम\s*अमृतसर/i],
    website: "https://iimamritsar.ac.in/",
  },
  {
    displayName: "IIM Trichy",
    dedupeKey: "iim trichy",
    patterns: [/iim\s*trichy|आईआईएम\s*तिरुचि|आइआइएम\s*तिरुचि/i],
    website: "https://www.iimtrichy.ac.in/",
  },
  {
    displayName: "NIT Srinagar",
    dedupeKey: "nit srinagar",
    patterns: [/nit\s*sri?nagar|एनआईटी\s*श्रीनगर/i],
    website: "https://nitsri.ac.in/",
  },
  {
    displayName: "NIT Jalandhar",
    dedupeKey: "nit jalandhar",
    patterns: [/nit\s*jalandhar|एनआईटी\s*जालंधर|एनआईटी\s*जलंधर/i],
    website: "https://nitj.ac.in/",
  },
  {
    displayName: "Swadeshi Jagran Manch",
    dedupeKey: "swadeshi jagran manch",
    patterns: [/swadeshi jagran|स्वदेशी जागरण/i],
    website: "https://www.swadeshijagran.org/",
  },
  {
    displayName: "SavantX Technology",
    dedupeKey: "savantx",
    patterns: [/savantx/i],
    forcedTab: "sponsors",
    website: "https://savantx.com/",
  },
  {
    displayName: "Requil India",
    dedupeKey: "requil india",
    patterns: [/requil|रिक्विल/i],
    forcedTab: "sponsors",
    website: "https://www.requil.com/",
  },
];

export function canonicalizeAffiliationName(name: string): CanonicalAffiliation {
  const trimmed = name.trim();
  for (const rule of CANONICAL_RULES) {
    if (rule.patterns.some((p) => p.test(trimmed))) {
      return {
        displayName: rule.displayName,
        dedupeKey: rule.dedupeKey,
        forcedTab: rule.forcedTab,
        website: rule.website,
      };
    }
  }
  return {
    displayName: trimmed,
    dedupeKey: normalizeAffiliationKey(trimmed),
  };
}
