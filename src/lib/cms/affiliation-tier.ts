import type { PartnerShowcaseEntry, PartnerShowcaseTab } from "@/lib/cms/partner-showcase";
import { canonicalizeAffiliationName } from "@/lib/cms/affiliation-canonical";

export type TierGroup = {
  id: string;
  labelEn: string;
  labelHi: string;
  entries: PartnerShowcaseEntry[];
};

const ORGANIZING_PATTERN =
  /holistic education|शिक्षा महाकुंभ|shiksha mahakumbh|rase\.co|विद्या भारती|vidya bharat|भारतीय शिक्षण|swadeshi jagran|स्वदेशी जागरण|think india|थिंक इंडिया|abvp|एबीवीपी|virasa|विरसा|arogya bharat|आरोग्य भारत|department of holistic|dhe\b|jaipur dialogue|जयपुर डायलॉग|geio|जी\.ई\.आई\.ओ/i;

const GOVERNMENT_PATTERN =
  /drdo|डीआरडीओ|nhpc|एनएचपीसी|nfil|एनएफआईएल|isro|csir|ugc|icar|barc|iiser|dst\b|tdb|ministry|मंत्रालय|government|सरकार|ayog|आयोग|board|बोर्ड|council|परिषद|commission|army|सेना|navy|नौसेना|air force|वायु सेना|ias\b|ips\b|hcs\b|patent|trademark|pollution control|प्रदूषण|niscpr|nicpr|higher education council|उच्च शिक्षा परिषद|education board|शिक्षा बोर्ड|des haryana|skill development|कौशल विकास|ncert|pgimer|supreme court|सर्वोच्च न्यायालय|high court|उच्च न्यायालय|district court|जिला न्यायालय|niti aayog|नीति आयोग|rbi\b|भारतीय रिज़र्व|reserve bank|public service commission|लोक सेवा आयोग|municipal|नगर निगम|nagar nigam|collectorate|जिलाधिकारी|police|पुलिस|forest department|वन विभाग|health department|स्वास्थ्य विभाग|education department|शिक्षा विभाग|directorate|निदेशालय|secretariat|सचिवालय|parliament|संसद|lok sabha|राज्य सभा|rajya sabha|embassy|दूतावास|consulate|राजधानी|chief minister|मुख्यमंत्री|governor|राज्यपाल|bharatiya sena|भारतीय सेना|defence|रक्षा/i;

const NATIONAL_INSTITUTE_PATTERN =
  /\biit[\s-]|आईआईटी|\bnit[\s-]|एनआईटी|\biim[\s-]|आईआईएम|\biiit\b|\biiser\b|आईआईएसईआर|\bnip[ae]r\b|नाइपर|\bmit[\s-]|एमआईटी|\baiims\b|\binstitute of national importance\b|national institute|राष्ट्रीय संस्थान|national law|nl[uū]|nittr|nittt|iisc\b|barc\b/i;

const CENTRAL_UNIVERSITY_PATTERN =
  /central university|केंद्रीय विश्वविद्यालय|cu jammu|cu haryana|cu punjab|cu kashmir|cu himachal/i;

const STATE_UNIVERSITY_PATTERN =
  /university|विश्वविद्यालय|vishwavidyalaya|vishvidyalaya/i;

const COLLEGE_PATTERN =
  /college|महाविद्यालय|pgcollege|p\.?g\.?\s*college|institute of engineering|polytechnic|पॉलिटेक्निक/i;

const PRIVATE_INSTITUTE_PATTERN =
  /private|deemed|pvt\.?\s*ltd|limited|university.*private|शोभित|chitkara|lovely|amity|manipal|sharda|galgotias|gehu|arni university|plaksha|नीदोनॉमिक्स|neodonomics/i;

const ASSOCIATION_PATTERN =
  /association|एसोसिएशन|federation|फेडरेशन|sangh|संघ|mandal|मंडल(?!.*शिक्षण)/i;

const ACADEMY_PATTERN =
  /academy|अकादमी|sahitya|साहित्य|sanskrit|संस्कृत/i;

const SCHOOL_PATTERN =
  /school|vidyalaya|विद्यालय|gurukul|गुरुकुल|smart school|स्कूल|pathshala|पाठशाला|hostel.*school|residential school|niketan|निकेतन|saveri|संस्थान.*विद्यालय/i;

const YOUTUBE_PATTERN =
  /youtube|यूट्यूब|official|ऑफिशियल|english lover|इंग्लिश लवर|अभिनय|ankit madan|अंकित मदान|youngov|यंगो|fox path|फॉक्स पाथ|study mantra|अध्ययन मंत्रा|techrocrat|टेक्रोक्रेट|आरती की पाठशाला|madan official/i;

const NGO_PATTERN =
  /ngo|foundation|trust|society|संस्था|समिति|sangathan|mission|मिशन|iskcon|इस्कॉन|sarvhitkari|सर्वहितकारी|patanjali|पतंजलि|historical research|ऐतिहासिक अनुसंधान/i;

const LAB_PATTERN =
  /laborator|lab\b|प्रयोगशाल|research centre|research center|अनुसंधान/i;

const MEDIA_NATIONAL_PATTERN =
  /business world|dainik|pioneer|पायनियर|uttam hindu|हिंदू|press|journal|newspaper|संवाद|reporter|संवाददाता/i;

const MEDIA_DIGITAL_PATTERN =
  /youtube|digital media|channel|ब्लॉग|blog/i;

const SPONSOR_PSU_PATTERN =
  /drdo|nhpc|nfil|isro|bhel|ongc|ntpc|sail|gail|ioc|hpcl|bpcl|airtel|bsnl|indian oil|bharat petroleum/i;

const SPONSOR_INDUSTRY_PATTERN =
  /private limited|pvt\.?\s*ltd|startup|industry|english connection|youngov|patel|reliance|tata |adani|wipro|infosys|requil|timie/i;

function academicTierOrder(name: string): number {
  if (ORGANIZING_PATTERN.test(name)) return 1;
  if (GOVERNMENT_PATTERN.test(name)) return 2;
  if (NATIONAL_INSTITUTE_PATTERN.test(name)) return 3;
  if (CENTRAL_UNIVERSITY_PATTERN.test(name)) return 4;
  if (STATE_UNIVERSITY_PATTERN.test(name) && !PRIVATE_INSTITUTE_PATTERN.test(name)) return 5;
  if (COLLEGE_PATTERN.test(name)) return 6;
  if (PRIVATE_INSTITUTE_PATTERN.test(name)) return 7;
  if (SCHOOL_PATTERN.test(name)) return 8;
  if (YOUTUBE_PATTERN.test(name)) return 9;
  if (NGO_PATTERN.test(name) || LAB_PATTERN.test(name) || ACADEMY_PATTERN.test(name)) return 10;
  if (ASSOCIATION_PATTERN.test(name)) return 10;
  return 11;
}

function mediaTierOrder(name: string): number {
  if (ORGANIZING_PATTERN.test(name)) return 1;
  if (MEDIA_NATIONAL_PATTERN.test(name)) return 2;
  if (MEDIA_DIGITAL_PATTERN.test(name)) return 3;
  return 4;
}

function sponsorTierOrder(name: string): number {
  if (ORGANIZING_PATTERN.test(name)) return 1;
  if (SPONSOR_PSU_PATTERN.test(name)) return 2;
  if (GOVERNMENT_PATTERN.test(name)) return 3;
  if (SPONSOR_INDUSTRY_PATTERN.test(name)) return 4;
  return 5;
}

const ACADEMIC_TIER_META: Record<number, { id: string; labelEn: string; labelHi: string }> = {
  1: { id: "organizing", labelEn: "Organizing Institutions", labelHi: "संयोजक संस्थाएँ" },
  2: { id: "government", labelEn: "Government Bodies", labelHi: "सरकारी संस्थाएँ" },
  3: { id: "national", labelEn: "National Institutes (IIT · NIT · IIM…)", labelHi: "राष्ट्रीय संस्थान" },
  4: { id: "central-uni", labelEn: "Central Universities", labelHi: "केंद्रीय विश्वविद्यालय" },
  5: { id: "state-uni", labelEn: "State Universities", labelHi: "राज्य विश्वविद्यालय" },
  6: { id: "college", labelEn: "Colleges & Institutes", labelHi: "महाविद्यालय व संस्थान" },
  7: { id: "private", labelEn: "Private Universities & Colleges", labelHi: "निजी विश्वविद्यालय" },
  8: { id: "school", labelEn: "Schools", labelHi: "विद्यालय" },
  9: { id: "youtube", labelEn: "YouTube & Digital Educators", labelHi: "यूट्यूब व डिजिटल शिक्षक" },
  10: { id: "ngo-lab", labelEn: "NGOs · Councils · Laboratories", labelHi: "एनजीओ · परिषद · प्रयोगशाला" },
  11: { id: "other", labelEn: "Other Affiliations", labelHi: "अन्य संबद्ध संस्थाएँ" },
};

const MEDIA_TIER_META: Record<number, { id: string; labelEn: string; labelHi: string }> = {
  1: { id: "organizing", labelEn: "Movement Media", labelHi: "अभियान मीडिया" },
  2: { id: "national-press", labelEn: "National Press", labelHi: "राष्ट्रीय प्रेस" },
  3: { id: "digital", labelEn: "Digital & YouTube Media", labelHi: "डिजिटल मीडिया" },
  4: { id: "other-media", labelEn: "Other Media", labelHi: "अन्य मीडिया" },
};

const SPONSOR_TIER_META: Record<number, { id: string; labelEn: string; labelHi: string }> = {
  1: { id: "organizing", labelEn: "Institutional Support", labelHi: "संस्थागत सहयोग" },
  2: { id: "psu", labelEn: "PSUs & National Bodies", labelHi: "सार्वजनिक उपक्रम" },
  3: { id: "government", labelEn: "Government Partners", labelHi: "सरकारी सहयोग" },
  4: { id: "industry", labelEn: "Industry & CSR", labelHi: "उद्योग व CSR" },
  5: { id: "other-sponsor", labelEn: "Other Sponsors", labelHi: "अन्य प्रायोजक" },
};

function tierOrderForTab(tab: PartnerShowcaseTab, name: string): number {
  if (tab === "media") return mediaTierOrder(name);
  if (tab === "sponsors") return sponsorTierOrder(name);
  return academicTierOrder(name);
}

function tierMetaForTab(tab: PartnerShowcaseTab, order: number) {
  if (tab === "media") return MEDIA_TIER_META[order] ?? MEDIA_TIER_META[4]!;
  if (tab === "sponsors") return SPONSOR_TIER_META[order] ?? SPONSOR_TIER_META[5]!;
  return ACADEMIC_TIER_META[order] ?? ACADEMIC_TIER_META[11]!;
}

export function sortAffiliationsByTier(
  tab: PartnerShowcaseTab,
  entries: PartnerShowcaseEntry[]
): PartnerShowcaseEntry[] {
  return [...entries].sort((a, b) => {
    const tierDiff = tierOrderForTab(tab, a.name) - tierOrderForTab(tab, b.name);
    if (tierDiff !== 0) return tierDiff;
    if (a.website && !b.website) return -1;
    if (!a.website && b.website) return 1;
    return a.name.localeCompare(b.name, "hi", { sensitivity: "base", numeric: true });
  });
}

export function groupAffiliationsByTier(
  tab: PartnerShowcaseTab,
  entries: PartnerShowcaseEntry[]
): TierGroup[] {
  const sorted = sortAffiliationsByTier(tab, entries);
  const map = new Map<string, TierGroup>();

  for (const entry of sorted) {
    const order = tierOrderForTab(tab, entry.name);
    const meta = tierMetaForTab(tab, order);
    const existing = map.get(meta.id);
    if (existing) {
      const key = canonicalizeAffiliationName(entry.name).dedupeKey;
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

  const orderIds =
    tab === "media"
      ? ["organizing", "national-press", "digital", "other-media"]
      : tab === "sponsors"
        ? ["organizing", "psu", "government", "industry", "other-sponsor"]
        : [
            "organizing",
            "government",
            "national",
            "central-uni",
            "state-uni",
            "college",
            "private",
            "school",
            "youtube",
            "ngo-lab",
            "other",
          ];

  return orderIds
    .map((id) => map.get(id))
    .filter((g): g is TierGroup => Boolean(g && g.entries.length > 0));
}
