"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import ErrorBoundary from "@/components/errors/ErrorBoundary";
import { NavCtaLink } from "@/components/ui/NavCtaLink";
import { useCms } from "@/lib/cms/context";
import {
  FALLBACK_WELCOME_MODAL,
  pickWelcomeModalBar,
  resolveAnnouncementBars,
} from "@/data/default-announcements";

const Modal = dynamic(() => import("@/components/layout/Modal"), { ssr: false });

const CookieConsent = dynamic(
  () => import("@/components/common/CookieConsent"),
  { ssr: false }
);
const AnalyticsLoader = dynamic(
  () => import("@/components/analytics/AnalyticsLoader"),
  { ssr: false }
);
const TrafficSourceCapture = dynamic(
  () => import("@/components/analytics/TrafficSourceCapture"),
  { ssr: false }
);
const VisitorPageTracker = dynamic(
  () => import("@/components/analytics/VisitorPageTracker"),
  { ssr: false }
);

const MODAL_SEEN_KEY = "smk_announcement_seen";

/** Global client chrome — does not wrap page children (server-first layout). */
export default function ClientChrome() {
  const cms = useCms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bars, setBars] = useState(() => resolveAnnouncementBars(cms?.announcementBars, "en"));

  useEffect(() => {
    if (cms?.announcementBars?.length) {
      setBars(resolveAnnouncementBars(cms.announcementBars, "en"));
      return;
    }
    fetch("/api/v2/announcement-bars")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setBars(resolveAnnouncementBars(d?.items, "en"));
      })
      .catch(() => {
        setBars(resolveAnnouncementBars([], "en"));
      });
  }, [cms?.announcementBars]);

  useEffect(() => {
    const onChunkError = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error ? reason.message : String(reason ?? "");
      const name = reason instanceof Error ? reason.name : "";
      if (name === "ChunkLoadError" || message.includes("ChunkLoadError")) {
        window.location.reload();
      }
    };
    window.addEventListener("unhandledrejection", onChunkError);
    return () => window.removeEventListener("unhandledrejection", onChunkError);
  }, []);

  useEffect(() => {
    const showModal = () => {
      const seen = sessionStorage.getItem(MODAL_SEEN_KEY);
      if (!seen) setIsModalOpen(true);
    };
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(showModal, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(showModal, 2000);
    return () => window.clearTimeout(t);
  }, []);

  const closeModal = () => {
    sessionStorage.setItem(MODAL_SEEN_KEY, "1");
    setIsModalOpen(false);
  };

  const modalBar = pickWelcomeModalBar(bars);
  const title = modalBar?.title ?? FALLBACK_WELCOME_MODAL.title;
  const subtitle = modalBar ? "Announcement" : FALLBACK_WELCOME_MODAL.subtitle;
  const message = modalBar?.message ?? FALLBACK_WELCOME_MODAL.message;
  const ctaUrl = modalBar?.ctaUrl ?? FALLBACK_WELCOME_MODAL.ctaUrl;
  const ctaLabel = modalBar?.ctaLabel ?? FALLBACK_WELCOME_MODAL.ctaLabel;

  return (
    <ErrorBoundary>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col items-center justify-center rounded-xl bg-primary p-4 text-center text-white md:p-6">
          <p className="text-2xl font-extrabold leading-tight text-white md:text-3xl">{title}</p>
          <p className="mt-2 text-lg font-bold text-amber-200 md:text-2xl">{subtitle}</p>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-white md:text-lg">
            {message}
          </p>
          {ctaUrl && (
            <div className="mt-5">
              <NavCtaLink
                href={ctaUrl}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white underline decoration-white/50 underline-offset-2 transition hover:bg-white/20 hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 md:text-base"
              >
                {ctaLabel}
              </NavCtaLink>
            </div>
          )}
        </div>
      </Modal>

      <Toaster position="top-right" />
      <CookieConsent />
      <TrafficSourceCapture />
      <VisitorPageTracker />
      <AnalyticsLoader />

      {process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4330032354977759"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}

      {process.env.NEXT_PUBLIC_BOTPRESS_ENABLED === "true" && (
        <>
          <Script
            src="https://cdn.botpress.cloud/webchat/v1/inject.js"
            strategy="lazyOnload"
          />
          <Script
            src="https://mediafiles.botpress.cloud/e2ba40e6-3b23-4f8d-a2f7-e2fbd8700925/webchat/config.js"
            strategy="lazyOnload"
          />
        </>
      )}
    </ErrorBoundary>
  );
}
