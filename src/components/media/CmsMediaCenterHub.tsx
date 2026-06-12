"use client";

import Link from "next/link";
import Image from "next/image";
import type { CmsMediaCenterItem } from "@/lib/cms/types";

const CATEGORY_LABELS: Record<string, string> = {
  press_release: "Press Releases",
  photo_gallery: "Photo Gallery",
  interview: "Interviews",
  publication: "Publications",
  video: "Videos",
  document: "Documents",
};

export default function CmsMediaCenterHub({ items = [] }: { items?: CmsMediaCenterItem[] }) {
  if (items.length === 0) return null;

  const featured = items.filter((i) => i.isFeatured).slice(0, 3);
  const rest = items.filter((i) => !featured.some((f) => f.id === i.id));

  return (
    <section className="mb-12" aria-labelledby="cms-media-hub">
      <h2 id="cms-media-hub" className="mb-6 text-xl font-bold text-brand-navy">
        Latest from Media Centre
      </h2>

      {featured.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <MediaHubCard key={item.id} item={item} featured />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => (
            <li key={item.id}>
              <MediaHubCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MediaHubCard({ item, featured = false }: { item: CmsMediaCenterItem; featured?: boolean }) {
  const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category;

  return (
    <Link
      href={item.href}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
        featured ? "border-brand-saffron/30" : "border-slate-200"
      }`}
    >
      {item.imageUrl && (
        <div className={`relative w-full overflow-hidden ${featured ? "aspect-video" : "aspect-[4/3]"}`}>
          <Image
            src={item.imageUrl}
            alt=""
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">
          {categoryLabel}
        </span>
        <h3 className="mt-1 text-sm font-bold text-brand-navy line-clamp-2 group-hover:underline">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="mt-2 flex-1 text-xs text-slate-500 line-clamp-3">{item.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
