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
    displayName: "IISER Mohali",
    dedupeKey: "iiser mohali",
    patterns: [/iiser\s*mohali|आईआईएसईआर\s*मोहाली|आईसएर\s*मोहाली|आईसएर\s*मोहली/i],
    website: "https://www.iisermohali.ac.in/",
  },
  {
    displayName: "NIPER Mohali",
    dedupeKey: "niper mohali",
    patterns: [/niper\s*mohali|नाइपर\s*मोहाली|नाइपर\s*मोहली/i],
    website: "https://www.niper.gov.in/",
  },
  {
    displayName: "Central University of Punjab",
    dedupeKey: "central university of punjab",
    patterns: [/central university of punjab|cu punjab|पंजाब\s*केंद्रीय\s*विश्वविद्यालय/i],
  },
  {
    displayName: "Central University of Haryana",
    dedupeKey: "central university of haryana",
    patterns: [/central university of haryana|cu haryana|हरियाणा\s*केंद्रीय\s*विश्वविद्यालय/i],
  },
  {
    displayName: "Central University of Himachal Pradesh",
    dedupeKey: "central university of himachal pradesh",
    patterns: [/central university of himachal|cu himachal|हिमाचल\s*प्रदेश\s*केंद्रीय/i],
  },
  {
    displayName: "Kurukshetra University",
    dedupeKey: "kurukshetra university",
    patterns: [/kurukshetra university|कुरुक्षेत्र\s*विश्वविद्यालय/i],
    website: "https://kuk.ac.in/",
  },
  {
    displayName: "Chaudhary Bansi Lal University",
    dedupeKey: "chaudhary bansi lal university",
    patterns: [/chaudhary bansi lal|cblu|चौधरी\s*बंसी\s*लाल/i],
  },
  {
    displayName: "Indira Gandhi University",
    dedupeKey: "indira gandhi university",
    patterns: [/\bigu\b|indira gandhi university/i],
  },
  {
    displayName: "Guru Jambheshwar University of Science & Technology",
    dedupeKey: "guru jambheshwar university",
    patterns: [/gjust|guru jambheshwar|गुरु\s*जंभेश्वर/i],
  },
  {
    displayName: "CCS Haryana Agricultural University",
    dedupeKey: "ccs haryana agricultural university",
    patterns: [/ccshau|ccs haryana agricultural|चौ\.?\s*चरण\s*सिंह\s*हरियाणा\s*कृषि/i],
  },
  {
    displayName: "Dada Lakhmi Chand State University of Performing & Visual Arts",
    dedupeKey: "dada lakhmi chand state university",
    patterns: [/dada lakhmi|dlcuva|दादा\s*लख्मी\s*चंद/i],
  },
  {
    displayName: "NITTTR Chandigarh",
    dedupeKey: "nitttr chandigarh",
    patterns: [/nitttr|nittt?r\s*chandigarh/i],
  },
  {
    displayName: "SLIET Longowal",
    dedupeKey: "sliet longowal",
    patterns: [/sliet\s*longowal|एसएलआईईडी\s*लोंगोवाल/i],
    website: "https://www.sliet.ac.in/",
  },
  {
    displayName: "Haryana Yog Aayog",
    dedupeKey: "haryana yog aayog",
    patterns: [/haryana yog aayog|हरियाणा\s*योग\s*आयोग/i],
  },
  {
    displayName: "National Council for Vocational Education and Training (NCVET)",
    dedupeKey: "ncvet",
    patterns: [/ncvet|vocational education and training/i],
  },
  {
    displayName: "National Commission for Indian System of Medicine (NCISM)",
    dedupeKey: "ncism",
    patterns: [/ncism|indian system of medicine/i],
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
