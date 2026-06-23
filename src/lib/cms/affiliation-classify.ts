import type { PartnerShowcaseEntry, PartnerShowcaseTab } from "@/lib/cms/partner-showcase";
import { resolveAffiliationWebsite } from "@/lib/cms/affiliation-websites";
import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";

/** Curated media names retained from earlier homepage partner sections (text only). */
export const CURATED_MEDIA_AFFILIATIONS: PartnerShowcaseEntry[] = [
  { name: "Business World", website: "https://businessworld.in/" },
  { name: "Dainik Savera", website: "https://epaper.dainiksaveratimes.in/" },
  { name: "Uttam Hindu", website: "https://www.uttamhindu.com/" },
  { name: "The Pioneer", website: "https://www.dailypioneer.com/" },
];

/** Known sponsor / industry names with official sites where available. */
export const CURATED_SPONSOR_AFFILIATIONS: PartnerShowcaseEntry[] = [
  { name: "DRDO", website: "https://www.drdo.gov.in/" },
  { name: "NHPC", website: "https://www.nhpcindia.com/" },
  { name: "NFIL", website: "https://www.nfil.in/" },
];

export function lookupAffiliationWebsite(name: string): string | undefined {
  return resolveAffiliationWebsite(name);
}

const SKIP_ORG_PATTERN =
  /^(academic partner|official channel|एक माँ ब्लॉगर)$/i;

const MEDIA_ORG_PATTERN =
  /media|newspaper|hindu|dainik|pioneer|business world|epaper|press|journal|samachar|akhbar|संवाद|पत्र|हिंदू|पायनियर|uttam|savera|businessworld/i;

const SPONSOR_ORG_PATTERN =
  /drdo|nhpc|nfil|private limited|pvt\.?\s*ltd|startup|industry|csr|sponsor|english connection|youngovator|यंगो|patel|bank|bharat petroleum|reliance|tata |adani|wipro|infosys/i;

const GOVERNMENT_PERSON_PATTERN =
  /^(hon'?ble|shri|smt\.|dr\.|prof\.|lt\.|major|admiral|governor|president|minister|chief minister|lieutenant governor|ias|ips|hcs|dgp|cabinet)/i;

export function classifyAffiliationTab(name: string): PartnerShowcaseTab | null {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 2 || SKIP_ORG_PATTERN.test(trimmed)) {
    return null;
  }

  if (MEDIA_ORG_PATTERN.test(trimmed)) return "media";
  if (SPONSOR_ORG_PATTERN.test(trimmed)) return "sponsors";

  if (GOVERNMENT_PERSON_PATTERN.test(trimmed)) return null;

  return "academic";
}

export function extractInstitutionFromDesignation(designation: string): string | null {
  const text = designation.trim();
  if (!text) return null;

  if (/governor of|president of india|chief minister|union minister|lieutenant governor/i.test(text)) {
    return null;
  }

  const commaParts = text.split(",").map((p) => p.trim()).filter(Boolean);
  if (commaParts.length >= 2) {
    const last = commaParts[commaParts.length - 1];
    if (last.length >= 3 && !GOVERNMENT_PERSON_PATTERN.test(last)) {
      return last;
    }
  }

  const directorMatch = text.match(
    /(?:Director(?: General)?|Vice-Chancellor|President),?\s+(.+)/i
  );
  if (directorMatch?.[1]) {
    const inst = directorMatch[1].trim();
    if (inst.length >= 3) return inst;
  }

  if (
    /University|IIT|NIT|IIM|Institute|College|CSIR|UGC|Academy|Board|Council|DRDO|ISRO|ICAR|BARC|Research|विश्वविद्यालय|संस्थान|आयोग|परिषद/i.test(
      text
    )
  ) {
    return text.replace(/^Hon'?ble\s+/i, "").trim();
  }

  return null;
}

export function toAffiliationEntry(
  name: string,
  website?: string,
  forcedTab?: PartnerShowcaseTab
): { entry: PartnerShowcaseEntry; tab: PartnerShowcaseTab } | null {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 2) return null;

  const tab = forcedTab ?? classifyAffiliationTab(trimmed);
  if (!tab) return null;

  const resolvedWebsite = sanitizeExternalUrl(
    website?.trim() || resolveAffiliationWebsite(trimmed)
  );

  return {
    tab,
    entry: {
      name: trimmed,
      ...(resolvedWebsite ? { website: resolvedWebsite } : {}),
    },
  };
}
