"use client";

import Image from "next/image";
import { useState } from "react";
import { allFramePageImages } from "@/data/abhiyan-photo-frame-images";

export default function AbhiyanPhotoFrameGallery() {
  const pages = allFramePageImages();
  const [active, setActive] = useState(pages[0]);

  return (
    <section className="mb-10">
      <h2 className="mb-2 text-lg font-bold text-brand-navy">Photo Frame — All Pages</h2>
      <p className="mb-4 text-sm text-slate-600">
        37 pages extracted from the official Abhiyan photo frame PDF.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-[3/4] w-full bg-slate-100 md:aspect-[4/3]">
          <Image
            key={active.src}
            src={active.src}
            alt={`${active.labelEn} — page ${active.page}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
        </div>
        <div className="border-t border-slate-200 px-4 py-3">
          <p className="font-semibold text-brand-navy">
            Page {active.page} — {active.label}
          </p>
          <p className="text-sm text-slate-500">{active.labelEn}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {pages.map((p) => (
          <button
            key={p.page}
            type="button"
            onClick={() => setActive(p)}
            className={`relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition ${
              active.page === p.page
                ? "border-brand-saffron ring-2 ring-brand-saffron/30"
                : "border-slate-200 hover:border-brand-navy/40"
            }`}
            title={`${p.labelEn} (page ${p.page})`}
          >
            <Image
              src={p.src}
              alt=""
              fill
              className="object-cover object-top"
              sizes="80px"
              loading="lazy"
            />
            <span className="absolute bottom-0 left-0 right-0 bg-brand-navy/75 py-0.5 text-center text-[10px] font-bold text-white">
              {p.page}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
