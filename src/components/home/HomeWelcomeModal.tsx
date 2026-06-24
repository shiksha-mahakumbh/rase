"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCms } from "@/lib/cms/context";
import {
  FALLBACK_WELCOME_MODAL,
  pickWelcomeModalBar,
  resolveAnnouncementBars,
} from "@/data/default-announcements";

const Modal = dynamic(() => import("@/components/layout/Modal"), { ssr: false });
const NavCtaLink = dynamic(
  () => import("@/components/ui/NavCtaLink").then((m) => ({ default: m.NavCtaLink })),
  { ssr: false }
);

const MODAL_SEEN_KEY = "smk_announcement_seen";

/** Home-only welcome modal — deferred until after load + idle to protect TBT/CLS. */
export default function HomeWelcomeModal() {
  const cms = useCms();
  const [enabled, setEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const bars = resolveAnnouncementBars(cms?.announcementBars, "en");
  const modalBar = pickWelcomeModalBar(bars);
  const title = modalBar?.title ?? FALLBACK_WELCOME_MODAL.title;
  const subtitle = modalBar ? "Announcement" : FALLBACK_WELCOME_MODAL.subtitle;
  const message = modalBar?.message ?? FALLBACK_WELCOME_MODAL.message;
  const ctaUrl = modalBar?.ctaUrl ?? FALLBACK_WELCOME_MODAL.ctaUrl;
  const ctaLabel = modalBar?.ctaLabel ?? FALLBACK_WELCOME_MODAL.ctaLabel;

  useEffect(() => {
    const arm = () => {
      if (sessionStorage.getItem(MODAL_SEEN_KEY)) return;
      const show = () => setEnabled(true);
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(show, { timeout: 8000 });
      } else {
        window.setTimeout(show, 5000);
      }
    };

    if (document.readyState === "complete") {
      arm();
      return;
    }
    window.addEventListener("load", arm, { once: true });
    return () => window.removeEventListener("load", arm);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const seen = sessionStorage.getItem(MODAL_SEEN_KEY);
    if (!seen) setIsOpen(true);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        sessionStorage.setItem(MODAL_SEEN_KEY, "1");
        setIsOpen(false);
      }}
    >
      <div className="flex flex-col items-center justify-center rounded-xl bg-primary p-4 text-center text-white md:p-6">
        <p className="text-2xl font-extrabold leading-tight text-white md:text-3xl">{title}</p>
        <p className="mt-2 text-lg font-bold text-amber-200 md:text-2xl">{subtitle}</p>
        <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-white md:text-lg">
          {message}
        </p>
        {ctaUrl ? (
          <div className="mt-5">
            <NavCtaLink
              href={ctaUrl}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white underline decoration-white/50 underline-offset-2 transition hover:bg-white/20 hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 md:text-base"
            >
              {ctaLabel}
            </NavCtaLink>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
