"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { PAST_EDITIONS } from "@/data/past-editions";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

const editions = PAST_EDITIONS.map((edition) => ({
  title: edition.title,
  year: edition.year,
  theme: edition.theme,
  media: [{ label: "Wishes Received", link: CANONICAL_ROUTES.wishesReceived }],
}));

const ShikshaMahakumbhMediaTimeline: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [archives, setArchives] = useState<{ [key: string]: boolean }>({});

  const toggleArchive = (edition: string) =>
    setArchives((prev) => ({ ...prev, [edition]: !prev[edition] }));

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  useEffect(() => {
    const el = scrollRef.current;
    const handleScroll = () => {
      if (el && lineRef.current) {
        const scrollWidth = el.scrollWidth - el.clientWidth;
        const progress = scrollWidth > 0 ? (el.scrollLeft / scrollWidth) * 100 : 0;
        lineRef.current.style.width = `${progress}%`;
      }
    };
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Media Centre", href: CANONICAL_ROUTES.mediaCenter },
            { label: "Best Wishes" },
          ]}
          className="mb-10"
        />

        <div className="relative">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll timeline left"
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-brand-navy p-3 text-white shadow-lg hover:bg-brand-navy-light md:block"
          >
            ←
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll timeline right"
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-brand-navy p-3 text-white shadow-lg hover:bg-brand-navy-light md:block"
          >
            →
          </button>

          <div
            aria-hidden
            className="absolute top-32 left-6 right-6 hidden h-1 rounded-full bg-slate-200 md:block"
          />
          <motion.div
            ref={lineRef}
            aria-hidden
            className="absolute top-32 left-6 h-1 rounded-full bg-gradient-to-r from-brand-saffron to-brand-navy hidden md:block"
            style={{ width: "0%" }}
          />

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-2 pb-4 md:px-8"
            role="list"
            aria-label="Shiksha Mahakumbh editions timeline"
          >
            {editions.map((edition, index) => (
              <motion.article
                key={edition.title}
                role="listitem"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative min-w-[280px] flex-shrink-0 rounded-3xl border border-slate-100 bg-white p-6 shadow-lg md:min-w-[340px]"
              >
                <div
                  aria-hidden
                  className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-brand-saffron shadow-md md:-top-6 md:h-6 md:w-6"
                />
                <span className="mb-2 inline-block rounded-full bg-brand-navy/10 px-3 py-1 text-xs font-bold text-brand-navy">
                  {edition.year}
                </span>
                <h2 className="text-lg font-bold text-brand-navy md:text-xl">
                  {edition.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
                  {edition.theme}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {edition.media.map((mediaItem, idx) => (
                    <Link
                      key={idx}
                      href={mediaItem.link}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy text-sm font-semibold text-white hover:bg-brand-navy-light"
                    >
                      {mediaItem.label}
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => toggleArchive(edition.title)}
                  className="mt-4 w-full rounded-xl border border-brand-saffron/40 bg-brand-saffron/10 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-saffron/20"
                  aria-expanded={archives[edition.title]}
                >
                  {archives[edition.title] ? "Hide Archive" : "View Archive"}
                </button>
                <AnimatePresence>
                  {archives[edition.title] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden rounded-xl bg-gradient-to-br from-brand-navy to-brand-navy-light p-4 text-white"
                    >
                      <p className="text-center text-sm font-semibold">
                        Archived Media for {edition.title}
                      </p>
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {edition.media.map((mediaItem, idx) => (
                          <Link
                            key={idx}
                            href={mediaItem.link}
                            className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/25"
                          >
                            {mediaItem.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </div>
        </div>

        <section className="mt-12 rounded-2xl border border-brand-saffron/30 bg-brand-surface-warm p-6 text-center md:p-8">
          <h3 className="text-xl font-bold text-brand-navy">Featured Greetings</h3>
          <p className="mt-2 text-gray-600">
            View distinguished messages received across Shiksha Mahakumbh editions
          </p>
          <Link
            href={CANONICAL_ROUTES.wishesReceived}
            className="mt-4 inline-flex min-h-[48px] items-center rounded-xl bg-brand-saffron px-8 py-3 font-bold text-brand-navy hover:bg-brand-saffron-dark"
          >
            View Wishes Received
          </Link>
        </section>
      </main>
    </div>
  );
};

export default ShikshaMahakumbhMediaTimeline;
