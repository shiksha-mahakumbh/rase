"use client";

import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useCms } from "@/lib/cms/context";
import { resolveTickerItems } from "@/data/default-announcements";

const REGISTRATION_PATH = ROUTES.registration;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

const Marquees: React.FC = () => {
  const cms = useCms();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const reducedMotion = usePrefersReducedMotion();
  const [tickerItems, setTickerItems] = useState(() =>
    resolveTickerItems(cms?.announcementBars, locale)
  );

  useEffect(() => {
    if (cms?.announcementBars?.length) {
      setTickerItems(resolveTickerItems(cms.announcementBars, locale));
      return;
    }
    fetch(`/api/v2/announcement-bars?locale=${locale}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setTickerItems(resolveTickerItems(d?.items, locale));
      })
      .catch(() => {
        setTickerItems(resolveTickerItems([], locale));
      });
  }, [cms?.announcementBars, locale]);

  return (
    <section
      className="border-y border-primary/10 bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm"
      aria-label="Announcements"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-saffron opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-saffron" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary md:text-base">
              Announcements
            </h2>
          </div>
          <Link
            href={REGISTRATION_PATH}
            className="min-h-[44px] rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Register Now
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-brand-saffron/20 bg-white/90 shadow-sm">
          <Marquee
            pauseOnHover
            pauseOnClick
            play={!reducedMotion}
            gradient
            gradientColor="#ffffff"
            gradientWidth={40}
            speed={reducedMotion ? 0 : 40}
          >
            <div className="flex gap-3 px-3 py-2">
              {tickerItems.map((item, index) => {
                const content = (
                  <span className="flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-1.5 text-sm font-medium text-gray-800 shadow-sm">
                    <Image
                      src="/new.gif"
                      alt=""
                      width={16}
                      height={16}
                      className="shrink-0"
                      unoptimized
                    />
                    {item.text}
                  </span>
                );

                return item.external ? (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-1"
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={index} href={item.href} className="mx-1">
                    {content}
                  </Link>
                );
              })}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default Marquees;
