"use client";

import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { ConferenceIcon } from "@/components/icons/home";
import { useCms } from "@/lib/cms/context";
import {
  formatNoticeDate,
  resolveWidgetNotices,
} from "@/data/default-notices";

function CategoryBadge({ name }: { name: string }) {
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
      {name}
    </span>
  );
}

export default function NoticeBoard() {
  const cms = useCms();
  const notices = resolveWidgetNotices(cms?.widgetNotices, cms?.notices, "en", 5);

  return (
    <GlassCard hover={false} className="h-full px-4 py-5 md:px-5 md:py-6">
      <div className="mb-4 text-center md:mb-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/60">
          Stay Updated
        </p>
        <h3 className="text-xl font-bold text-brand-navy md:text-2xl">Latest Notices</h3>
      </div>

      {notices.length === 0 ? (
        <p className="text-center text-sm text-slate-500">No notices at this time.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notices.map((notice) => {
            const published = formatNoticeDate(notice.publishAt);
            const excerpt =
              notice.description.length > 120
                ? `${notice.description.slice(0, 117).trim()}…`
                : notice.description;

            return (
              <Link key={notice.id} href={`/noticeboard#${notice.slug}`} className="block">
                <div className="home-card-hover group cursor-pointer rounded-xl border border-gray-100 bg-white/80 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <ConferenceIcon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        {notice.isPinned && (
                          <span className="text-[10px] font-bold uppercase text-amber-600">
                            Pinned
                          </span>
                        )}
                        {notice.category && <CategoryBadge name={notice.category.name} />}
                        {published && (
                          <time
                            dateTime={notice.publishAt ?? undefined}
                            className="text-[10px] font-medium text-slate-400"
                          >
                            {published}
                          </time>
                        )}
                      </div>
                      <h4 className="text-base font-semibold leading-snug text-gray-800 transition-colors group-hover:text-primary md:text-lg">
                        {notice.title}
                      </h4>
                      {excerpt ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                          {excerpt}
                        </p>
                      ) : null}
                      {notice.attachments.length > 0 && (
                        <p className="mt-1 text-xs text-slate-500">
                          {notice.attachments.length} attachment
                          {notice.attachments.length > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
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
    </GlassCard>
  );
}
