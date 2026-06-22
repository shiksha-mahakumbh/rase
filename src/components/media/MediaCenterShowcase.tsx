"use client";

import type { ReactNode } from "react";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import { MEDIA_CENTER_PAGE_HERO, MEDIA_CENTER_STATS } from "@/data/media-center-hub";

type Props = {
  children: ReactNode;
};

export default function MediaCenterShowcase({ children }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <HubGradientBanner
        id="media-center-banner"
        eyebrow={MEDIA_CENTER_PAGE_HERO.eyebrow}
        title={
          <>
            <span className="text-brand-blue">Media &amp; Archives</span>
            <span className="mt-1 block text-xl text-brand-saffron md:text-2xl">
              झलकियाँ – शिक्षा महाकुंभ अभियान
            </span>
          </>
        }
        subtitle={MEDIA_CENTER_PAGE_HERO.subtitle}
        stats={MEDIA_CENTER_STATS}
      />
      <div className="mt-10">{children}</div>
    </div>
  );
}
