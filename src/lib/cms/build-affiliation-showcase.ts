import {
  CONFERENCE_SUPPORT_MASTER,
  isExcludedAffiliation,
} from "@/data/conference-support-master";
import { sectionMeta } from "@/lib/cms/conference-support-sections";
import { canonicalizeAffiliationName } from "@/lib/cms/affiliation-canonical";
import { sortAffiliationsByTier } from "@/lib/cms/affiliation-tier";
import { resolveAffiliationWebsite } from "@/lib/cms/affiliation-websites";
import type { PartnerItem } from "@/lib/cms/partners";
import {
  mapCategoryToShowcaseTab,
  type PartnerShowcaseEntry,
  type PartnerShowcaseTab,
} from "@/lib/cms/partner-showcase";
import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";
import { toAffiliationEntry } from "@/lib/cms/affiliation-classify";
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
    ...(entry.sectionId ? { sectionId: entry.sectionId } : {}),
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
  const existing = list[idx]!;
  list[idx] = {
    ...existing,
    ...(existing.sectionId ? {} : entry.sectionId ? { sectionId: entry.sectionId } : {}),
    ...(!existing.website && merged.website ? { website: merged.website } : {}),
  };
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
  return sortAffiliationsByTier(tab, entries.map(enrichEntryWebsite));
}

function addRaw(
  grouped: Record<PartnerShowcaseTab, PartnerShowcaseEntry[]>,
  name: string,
  website?: string,
  forcedTab?: PartnerShowcaseTab
) {
  if (isExcludedAffiliation(name)) return;
  const parsed = toAffiliationEntry(name, website, forcedTab);
  if (!parsed) return;
  mergeInto(grouped, parsed.tab, parsed.entry);
}

function isKnownFromMaster(
  grouped: Record<PartnerShowcaseTab, PartnerShowcaseEntry[]>,
  name: string
): boolean {
  const key = canonicalizeAffiliationName(name).dedupeKey;
  for (const tab of ["academic", "media", "sponsors"] as PartnerShowcaseTab[]) {
    if (
      grouped[tab].some(
        (e) => canonicalizeAffiliationName(e.name).dedupeKey === key
      )
    ) {
      return true;
    }
  }
  return false;
}

/** Build homepage #conference-support lists from curated master data + published CMS partners. */
export function buildAffiliationShowcase(input: {
  cmsPartners?: CmsPartnerCard[];
  homepagePartners?: PartnerItem[];
  cmsSpeakers?: CmsSpeakerCard[];
}): Record<PartnerShowcaseTab, PartnerShowcaseEntry[]> {
  const grouped = emptyGrouped();

  for (const item of CONFERENCE_SUPPORT_MASTER) {
    if (isExcludedAffiliation(item.name)) continue;
    const tab = sectionMeta(item.section).tab;
    mergeInto(grouped, tab, {
      name: item.name,
      website: item.website,
      sectionId: item.section,
    });
  }

  for (const partner of input.cmsPartners ?? []) {
    const name = partner.name?.trim();
    if (!name || isExcludedAffiliation(name) || isKnownFromMaster(grouped, name)) continue;
    addRaw(
      grouped,
      name,
      partner.website ?? undefined,
      mapCategoryToShowcaseTab(partner.partnerCategory)
    );
  }

  for (const item of input.homepagePartners ?? []) {
    const name = (item.name || item.text || "").trim();
    if (!name || isExcludedAffiliation(name) || isKnownFromMaster(grouped, name)) continue;
    const tab = mapCategoryToShowcaseTab(item.type ?? item.partnerType ?? "academic");
    addRaw(grouped, name, item.website ?? item.link, tab);
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
