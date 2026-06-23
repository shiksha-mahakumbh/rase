"use client";

import { useMemo, useState } from "react";
import SectionShell from "@/components/ui/SectionShell";
import GlassCard from "@/components/ui/GlassCard";
import { groupAffiliationsByTier } from "@/lib/cms/affiliation-tier";
import { getAffiliationShowcaseStats } from "@/lib/cms/affiliation-showcase-stats";
import { getHomepagePartners } from "@/lib/cms/partners";
import { buildAffiliationShowcase } from "@/lib/cms/build-affiliation-showcase";
import {
  PARTNER_SHOWCASE_TABS,
  PARTNER_TAB_ACCENT_STYLES,
  type PartnerShowcaseTab,
} from "@/lib/cms/partner-showcase";
import { useCms } from "@/lib/cms/context";
import type { CmsPartnerCard, CmsSpeakerCard } from "@/lib/cms/types";
import { GlobalReachBanner, TierSection } from "./partners/AffiliationCard";
import ShowcaseTabNav from "./partners/ShowcaseTabNav";

type Props = {
  cmsPartners?: CmsPartnerCard[];
  cmsSpeakers?: CmsSpeakerCard[];
};

export default function PartnersShowcase({
  cmsPartners = [],
  cmsSpeakers = [],
}: Props) {
  const cms = useCms();
  const [tab, setTab] = useState<PartnerShowcaseTab>("academic");

  const grouped = useMemo(
    () =>
      buildAffiliationShowcase({
        cmsPartners,
        cmsSpeakers,
        homepagePartners: getHomepagePartners(cms?.homepage),
      }),
    [cms?.homepage, cmsPartners, cmsSpeakers]
  );

  const stats = useMemo(() => getAffiliationShowcaseStats(grouped), [grouped]);
  const activeTabMeta = PARTNER_SHOWCASE_TABS.find((t) => t.id === tab)!;
  const tierGroups = useMemo(
    () => groupAffiliationsByTier(tab, grouped[tab]),
    [tab, grouped]
  );
  const accent = PARTNER_TAB_ACCENT_STYLES[activeTabMeta.accent];
  const totalInTab = grouped[tab].length;

  return (
    <SectionShell
      id="conference-support"
      background="gradient"
      className="relative overflow-hidden px-4 py-10 md:px-8 md:py-12"
      ariaLabel="Academic, media, and sponsor partners"
    >
      <div
        className={`pointer-events-none absolute -left-24 top-10 h-48 w-48 rounded-full blur-3xl ${accent.glow}`}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        <header className="mb-4 text-center">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 sm:text-sm">
            Conference Support
          </p>
          <h2 className="home-section-title">Academic · Media · Sponsors</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
            Editions 1.0–6.0 — institutions sequenced from organizing bodies to schools,
            media, and industry.
          </p>
        </header>

        <GlobalReachBanner total={stats.total} linked={stats.linked} />

        <ShowcaseTabNav activeTab={tab} counts={stats.byTab} onChange={setTab} />

        <GlassCard hover={false} className="overflow-hidden p-3 sm:p-5 md:p-6">
          <div
            id={`partners-panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`partners-tab-${tab}`}
          >
            <div className="mb-4 flex items-end justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className={`text-base font-bold md:text-lg ${accent.text}`}>
                  {activeTabMeta.label}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  {activeTabMeta.description}
                </p>
              </div>
              <p className="shrink-0 text-[11px] font-medium text-slate-500">
                {totalInTab} total
              </p>
            </div>

            {tierGroups.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No affiliations listed in this category yet.
              </p>
            ) : (
              tierGroups.map((group) => (
                <TierSection key={group.id} group={group} tab={activeTabMeta} />
              ))
            )}
          </div>
        </GlassCard>

        <p className="mt-3 text-center text-[11px] text-slate-500">
          Organisation names only · Click linked names for official websites
        </p>
      </div>
    </SectionShell>
  );
}
