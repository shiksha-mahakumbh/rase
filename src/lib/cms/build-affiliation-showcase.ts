import { MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS } from "@/data/mahakumbh-abhiyan-speakers";
import { BEST_WISHES_ENTRIES } from "@/data/best-wishes";
import { COMMITTEE_EDITION_6_0 } from "@/data/committee-members/edition-6-0";
import { featuredSpeakers as SMK_6_FEATURED_SPEAKERS } from "@/data/authority-speakers";
import {
  CURATED_MEDIA_AFFILIATIONS,
  CURATED_SPONSOR_AFFILIATIONS,
  extractInstitutionFromDesignation,
  toAffiliationEntry,
} from "@/lib/cms/affiliation-classify";
import { canonicalizeAffiliationName } from "@/lib/cms/affiliation-canonical";
import { extractCommitteeAffiliations } from "@/lib/cms/committee-affiliations";
import { PROCEEDINGS_AFFILIATIONS } from "@/lib/cms/proceedings-affiliations";
import { sortAffiliationsByTier } from "@/lib/cms/affiliation-tier";
import { resolveAffiliationWebsite } from "@/lib/cms/affiliation-websites";
import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";
import type { PartnerItem } from "@/lib/cms/partners";
import {
  mapCategoryToShowcaseTab,
  type PartnerShowcaseEntry,
  type PartnerShowcaseTab,
} from "@/lib/cms/partner-showcase";
import type { CmsPartnerCard, CmsSpeakerCard } from "@/lib/cms/types";

function emptyGrouped(): Record<PartnerShowcaseTab, PartnerShowcaseEntry[]> {
  return { academic: [], media: [], sponsors: [] };
}

function mergeInto(
  target: Record<PartnerShowcaseTab, PartnerShowcaseEntry[]>,
  tab: PartnerShowcaseTab,
  entry: PartnerShowcaseEntry
) {
  const canonical = canonicalizeAffiliationName(entry.name);
  const merged: PartnerShowcaseEntry = {
    name: canonical.displayName,
    ...(entry.website || canonical.website
      ? { website: entry.website ?? canonical.website }
      : {}),
  };
  const key = canonical.dedupeKey;
  const list = target[tab];
  const idx = list.findIndex(
    (e) => canonicalizeAffiliationName(e.name).dedupeKey === key
  );
  if (idx === -1) {
    list.push(merged);
    return;
  }
  if (!list[idx].website && merged.website) {
    list[idx] = { ...list[idx], website: merged.website };
  }
}

function enrichEntryWebsite(entry: PartnerShowcaseEntry): PartnerShowcaseEntry {
  const resolved = sanitizeExternalUrl(
    entry.website || resolveAffiliationWebsite(entry.name)
  );
  return resolved ? { ...entry, website: resolved } : entry;
}

function finalizeTab(
  tab: PartnerShowcaseTab,
  entries: PartnerShowcaseEntry[]
): PartnerShowcaseEntry[] {
  return sortAffiliationsByTier(
    tab,
    entries.map(enrichEntryWebsite)
  );
}

function addRaw(
  grouped: Record<PartnerShowcaseTab, PartnerShowcaseEntry[]>,
  name: string,
  website?: string,
  forcedTab?: PartnerShowcaseTab
) {
  const parsed = toAffiliationEntry(name, website, forcedTab);
  if (!parsed) return;
  mergeInto(grouped, parsed.tab, parsed.entry);
}

export function buildAffiliationShowcase(input: {
  cmsPartners?: CmsPartnerCard[];
  homepagePartners?: PartnerItem[];
  cmsSpeakers?: CmsSpeakerCard[];
}): Record<PartnerShowcaseTab, PartnerShowcaseEntry[]> {
  const grouped = emptyGrouped();

  for (const partner of input.cmsPartners ?? []) {
    const name = partner.name?.trim();
    if (!name) continue;
    addRaw(
      grouped,
      name,
      partner.website ?? undefined,
      mapCategoryToShowcaseTab(partner.partnerCategory)
    );
  }

  for (const item of input.homepagePartners ?? []) {
    const name = (item.name || item.text || "").trim();
    if (!name) continue;
    const tab = mapCategoryToShowcaseTab(item.type ?? item.partnerType ?? "academic");
    addRaw(grouped, name, item.website ?? item.link, tab);
  }

  for (const entry of CURATED_MEDIA_AFFILIATIONS) {
    addRaw(grouped, entry.name, entry.website, "media");
  }
  for (const entry of CURATED_SPONSOR_AFFILIATIONS) {
    addRaw(grouped, entry.name, entry.website, "sponsors");
  }

  for (const edition of MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS) {
    for (const speaker of edition.speakers) {
      if (speaker.organization?.trim()) {
        addRaw(grouped, speaker.organization.trim());
      }
    }
  }

  for (const wish of BEST_WISHES_ENTRIES) {
    const fromDesignation = extractInstitutionFromDesignation(wish.designation);
    if (fromDesignation) {
      addRaw(grouped, fromDesignation);
    }
  }

  for (const affiliation of PROCEEDINGS_AFFILIATIONS) {
    addRaw(grouped, affiliation);
  }

  for (const org of extractCommitteeAffiliations(COMMITTEE_EDITION_6_0)) {
    addRaw(grouped, org);
  }

  for (const speaker of SMK_6_FEATURED_SPEAKERS) {
    if (speaker.organization?.trim()) {
      addRaw(grouped, speaker.organization.trim());
    }
  }

  for (const speaker of input.cmsSpeakers ?? []) {
    if (speaker.institution?.trim()) {
      addRaw(grouped, speaker.institution.trim());
    } else if (speaker.designation?.trim()) {
      const inst = extractInstitutionFromDesignation(speaker.designation);
      if (inst) addRaw(grouped, inst);
    }
  }

  return {
    academic: finalizeTab("academic", grouped.academic),
    media: finalizeTab("media", grouped.media),
    sponsors: finalizeTab("sponsors", grouped.sponsors),
  };
}

export function resolveShowcaseTabEntries(
  tab: PartnerShowcaseTab,
  grouped: Record<PartnerShowcaseTab, PartnerShowcaseEntry[]>
): PartnerShowcaseEntry[] {
  return grouped[tab];
}
