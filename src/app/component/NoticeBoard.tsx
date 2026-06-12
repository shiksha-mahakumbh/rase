"use client";

import Link from "next/link";
import GlassCard from "./home/GlassCard";
import { ConferenceIcon } from "./home/icons";
import type { CmsNotice } from "@/lib/cms/types";
import { useCms } from "@/lib/cms/context";

const FALLBACK_NOTICES: CmsNotice[] = [
  { id: "1", title: "Registration Open for Shiksha Mahakumbh 6.0", slug: "registration-open", description: "", priority: 0, isPinned: false, publishAt: null, expireAt: null, category: null, attachments: [] },
  { id: "2", title: "Workshops & Volunteer Orientation – Starting Soon", slug: "workshops", description: "", priority: 0, isPinned: false, publishAt: null, expireAt: null, category: null, attachments: [] },
  { id: "3", title: "Sponsorship Window Now Open", slug: "sponsorship", description: "", priority: 0, isPinned: false, publishAt: null, expireAt: null, category: null, attachments: [] },
  { id: "4", title: "Project Display Registration Begins", slug: "project-display", description: "", priority: 0, isPinned: false, publishAt: null, expireAt: null, category: null, attachments: [] },
  { id: "5", title: "Accommodation Details Will Be Released Soon", slug: "accommodation", description: "", priority: 0, isPinned: false, publishAt: null, expireAt: null, category: null, attachments: [] },
];

function CategoryBadge({ name }: { name: string }) {
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
      {name}
    </span>
  );
}

export default function NoticeBoard() {
  const cms = useCms();
  const notices = cms?.widgetNotices?.length ? cms.widgetNotices : FALLBACK_NOTICES;

  return (
    <div className="px-3 py-6 md:px-6 md:py-8">
      <div className="mb-6 text-center md:mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/60">
          Stay Updated
        </p>
        <h2 className="home-section-title text-2xl md:text-3xl">Latest Notices</h2>
      </div>

      {notices.length === 0 ? (
        <p className="text-center text-sm text-slate-500">No notices at this time.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notices.map((notice) => (
            <Link key={notice.id} href={`/noticeboard#${notice.slug}`} className="block">
              <GlassCard className="home-card-hover group cursor-pointer border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <ConferenceIcon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      {notice.isPinned && (
                        <span className="text-[10px] font-bold uppercase text-amber-600">Pinned</span>
                      )}
                      {notice.category && <CategoryBadge name={notice.category.name} />}
                    </div>
                    <h3 className="text-base font-semibold leading-snug text-gray-800 transition-colors group-hover:text-primary md:text-lg">
                      {notice.title}
                    </h3>
                    {notice.attachments.length > 0 && (
                      <p className="mt-1 text-xs text-slate-500">
                        {notice.attachments.length} attachment{notice.attachments.length > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <Link
          href="/noticeboard"
          className="text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          View all notices →
        </Link>
      </div>
    </div>
  );
}
