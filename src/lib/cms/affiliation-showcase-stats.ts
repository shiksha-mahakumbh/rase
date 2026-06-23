import type { PartnerShowcaseEntry, PartnerShowcaseTab } from "@/lib/cms/partner-showcase";

export type AffiliationShowcaseStats = {
  total: number;
  linked: number;
  byTab: Record<PartnerShowcaseTab, number>;
};

export function getAffiliationShowcaseStats(
  grouped: Record<PartnerShowcaseTab, PartnerShowcaseEntry[]>
): AffiliationShowcaseStats {
  const tabs: PartnerShowcaseTab[] = ["academic", "media", "sponsors"];
  const byTab = { academic: 0, media: 0, sponsors: 0 } as Record<
    PartnerShowcaseTab,
    number
  >;

  let linked = 0;
  let total = 0;

  for (const tab of tabs) {
    const count = grouped[tab].length;
    byTab[tab] = count;
    total += count;
    linked += grouped[tab].filter((e) => e.website).length;
  }

  return { total, linked, byTab };
}
