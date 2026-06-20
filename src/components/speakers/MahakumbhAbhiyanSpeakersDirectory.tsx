"use client";

import {
  MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS,
  totalAbhiyanSpeakerCount,
  type AbhiyanSpeaker,
} from "@/data/mahakumbh-abhiyan-speakers";
import { EDITION_FRAME_IMAGES } from "@/data/abhiyan-photo-frame-images";
import Image from "next/image";

function SpeakerLine({ speaker }: { speaker: AbhiyanSpeaker }) {
  const detail = [speaker.role, speaker.organization].filter(Boolean).join(" · ");
  return (
    <li className="break-inside-avoid border-b border-slate-100 py-1.5 text-[11px] leading-snug print:py-0.5 print:text-[9px]">
      <p className="font-semibold text-brand-navy">{speaker.name}</p>
      {detail ? <p className="text-slate-600">{detail}</p> : null}
    </li>
  );
}

export default function MahakumbhAbhiyanSpeakersDirectory() {
  const total = totalAbhiyanSpeakerCount();

  return (
    <div className="mahakumbh-speakers-directory">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 print:mb-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-saffron print:text-[10px]">
            शिक्षा महाकुंभ अभियान
          </p>
          <h2 className="text-2xl font-bold text-brand-navy print:text-lg">
            वक्ता एवं गरिमामयी विभाग
          </h2>
          <p className="mt-1 text-sm text-slate-600 print:text-[10px]">
            संस्करण 1.0 से 5.0 — कुल {total} वक्ता
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg border border-brand-saffron/40 bg-brand-saffron/10 px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-saffron/20 print:hidden"
        >
          प्रिंट / PDF
        </button>
      </div>

      <div className="space-y-8 print:space-y-4">
        {MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS.map((edition) => (
          <section
            key={edition.edition}
            className="rounded-xl border border-brand-saffron/20 bg-gradient-to-br from-white to-brand-surface-warm p-4 shadow-sm print:rounded-none print:border-slate-300 print:p-2 print:shadow-none"
          >
            <h3 className="mb-3 border-b border-brand-saffron/40 pb-2 text-lg font-bold text-brand-navy print:mb-1 print:text-sm">
              {edition.title}
              <span className="ml-2 text-sm font-normal text-slate-500 print:text-[10px]">
                ({edition.speakers.length})
              </span>
            </h3>
            {EDITION_FRAME_IMAGES[edition.edition]?.speakers ? (
              <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 print:hidden">
                <div className="relative h-36 w-full bg-slate-50 sm:h-44">
                  <Image
                    src={EDITION_FRAME_IMAGES[edition.edition].speakers}
                    alt={`${edition.title} — photo frame`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 900px"
                  />
                </div>
              </div>
            ) : null}
            <ul className="columns-1 gap-x-6 sm:columns-2 lg:columns-3 xl:columns-4 print:columns-4 print:gap-x-3">
              {edition.speakers.map((speaker) => (
                <SpeakerLine
                  key={`${edition.edition}-${speaker.name}-${speaker.organization}`}
                  speaker={speaker}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          nav,
          header,
          footer,
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
