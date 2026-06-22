"use client";

import HubGradientBanner from "@/components/ui/HubGradientBanner";
import { NOTICEBOARD_PAGE_HERO, NOTICEBOARD_STATS } from "@/data/noticeboard-hub";
import NoticeboardClient from "@/app/noticeboard/NoticeboardClient";
import type { CmsNotice } from "@/lib/cms/types";

type Props = {
  initialNotices: CmsNotice[];
};

export default function NoticeboardShowcase({ initialNotices }: Props) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
      <HubGradientBanner
        id="noticeboard-banner"
        eyebrow={NOTICEBOARD_PAGE_HERO.eyebrow}
        title={NOTICEBOARD_PAGE_HERO.title}
        subtitle={NOTICEBOARD_PAGE_HERO.subtitle}
        stats={NOTICEBOARD_STATS}
      />
      <div className="mt-10">
        <NoticeboardClient initialNotices={initialNotices} />
      </div>
    </div>
  );
}
