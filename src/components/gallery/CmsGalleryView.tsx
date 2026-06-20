"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const TreeComponent = dynamic(() => import("@/components/content/TreeComponent"), {
  ssr: false,
});

export type GalleryAlbumView = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  items: Array<{ id: string; src: string; alt: string; caption: string | null }>;
};

export default function CmsGalleryView({ albums }: { albums: GalleryAlbumView[] }) {
  if (!albums.length) {
    return (
      <div className="border-t border-brand-saffron/15 bg-gradient-to-b from-brand-surface-warm to-white px-4 py-8">
        <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-slate-600">
          Browse edition archives below while CMS albums are being prepared.
        </p>
        <div className="flex justify-center overflow-x-auto">
          <TreeComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 md:px-8 md:py-12">
      {albums.map((album) => (
        <section
          key={album.id}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <h2 className="text-xl font-bold text-brand-navy md:text-2xl">{album.title}</h2>
          {album.description && (
            <p className="mt-2 text-sm text-slate-600 md:text-base">{album.description}</p>
          )}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {album.items.map((item) => (
              <figure
                key={item.id}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-saffron/30 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                {item.caption && (
                  <figcaption className="border-t border-slate-100 p-3 text-sm text-slate-600">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
