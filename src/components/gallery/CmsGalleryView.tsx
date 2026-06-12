"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const TreeComponent = dynamic(() => import("@/app/component/TreeComponent"), {
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
      <div className="flex justify-center p-4">
        <div className="overflow-x-auto text-sm font-semibold text-white">
          <TreeComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 px-4 py-8">
      {albums.map((album) => (
        <section key={album.id}>
          <h2 className="mb-2 text-xl font-bold text-white">{album.title}</h2>
          {album.description && (
            <p className="mb-4 text-sm text-slate-300">{album.description}</p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {album.items.map((item) => (
              <figure
                key={item.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                {item.caption && (
                  <figcaption className="p-3 text-sm text-slate-200">{item.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
