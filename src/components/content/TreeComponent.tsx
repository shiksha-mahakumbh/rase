"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { PAST_EDITIONS } from "@/data/past-editions";

const ShikshaMahakumbhTimeline: React.FC = () => {
  const [archives, setArchives] = useState<{ [key: string]: boolean }>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const toggleArchive = (edition: string) =>
    setArchives((prev) => ({ ...prev, [edition]: !prev[edition] }));

  const mahakumbhSeries = PAST_EDITIONS.map((e) => ({
    title: e.title,
    year: e.year,
    description: e.theme,
    link: e.href,
    campaign: e.campaignPdf ?? e.galleryUrl ?? "#",
    mainPhotos: e.galleryUrl ?? "#",
    day1Photos: e.galleryUrl ?? "#",
  }));

  const scrollLeft = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const handleScroll = () => {
      if (scrollEl && lineRef.current) {
        const scrollWidth = scrollEl.scrollWidth - scrollEl.clientWidth;
        const scrollLeft = scrollEl.scrollLeft;
        const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
        lineRef.current.style.width = `${progress}%`;
      }
    };
    scrollEl?.addEventListener("scroll", handleScroll);
    return () => scrollEl?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="py-10 bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm">
      <div className="mb-10 text-center">
        <motion.h1
          className="text-3xl font-extrabold tracking-wide text-brand-navy md:text-4xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-brand-blue">शिक्षा</span>{" "}
          <span className="text-brand-saffron">महाकुंभ अभियान</span>
        </motion.h1>
        <p className="mx-auto mt-3 max-w-3xl text-base text-slate-600 md:text-lg">
          A nationwide movement redefining Indian education through innovation, inclusion, and inspiration.
        </p>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-brand-saffron p-3 text-brand-navy shadow-lg transition hover:bg-brand-saffron-dark hover:text-white"
        >
          <FaArrowLeft />
        </button>
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-brand-saffron p-3 text-brand-navy shadow-lg transition hover:bg-brand-saffron-dark hover:text-white"
        >
          <FaArrowRight />
        </button>

        <div className="absolute left-6 right-6 top-32 z-0 hidden h-1 rounded-full bg-slate-200 md:block" />
        <motion.div
          ref={lineRef}
          className="absolute left-6 top-32 z-10 hidden h-1 rounded-full bg-gradient-to-r from-brand-saffron to-brand-blue md:block"
        />

        <div
          ref={scrollRef}
          className="relative z-10 flex space-x-6 overflow-x-auto px-6 scrollbar-hide md:space-x-8 md:px-12"
        >
          {mahakumbhSeries.map((edition, index) => (
            <motion.div
              key={edition.title}
              className="relative min-w-[300px] flex-shrink-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:border-brand-saffron/30 hover:shadow-lg md:min-w-[380px]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="h-5 w-5 rounded-full border-2 border-white bg-brand-saffron shadow-md" />
              </div>

              <h2 className="mb-2 text-center text-xl font-bold text-brand-navy">{edition.title}</h2>
              <span className="mb-3 block text-center text-sm font-semibold text-brand-saffron-dark">
                Edition Year: {edition.year}
              </span>
              <p className="mb-4 text-center text-sm text-slate-600">{edition.description}</p>

              <div className="mb-3 flex flex-wrap justify-center gap-2">
                <Link
                  href={edition.link}
                  className="rounded-full bg-brand-saffron px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-saffron-dark hover:text-white"
                >
                  Visit Official Page
                </Link>
                <button
                  type="button"
                  onClick={() => toggleArchive(edition.title)}
                  className="rounded-full border border-brand-blue/30 px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/5"
                >
                  {archives[edition.title] ? "Hide Archive" : "View Archive"}
                </button>
              </div>

              {archives[edition.title] && (
                <motion.div
                  className="mt-3 space-y-3 rounded-xl bg-gradient-to-r from-brand-saffron/15 to-brand-blue/10 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col flex-wrap gap-2 md:flex-row md:justify-center">
                    <PhotoLink title="Campaign Details" link={edition.campaign} />
                    <PhotoLink title="Mahakumbh Photos" link={edition.mainPhotos} />
                    <PhotoLink title="Day 1 Photos" link={edition.day1Photos} />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PhotoLink = ({ title, link }: { title: string; link: string }) => (
  <Link
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-brand-navy shadow-sm transition hover:bg-brand-surface-warm"
  >
    {title}
  </Link>
);

export default ShikshaMahakumbhTimeline;
