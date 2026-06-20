"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import ErrorBoundary from "@/components/errors/ErrorBoundary";
import type { CmsAnnouncementBar } from "@/lib/cms/types";

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

const FALLBACK_MODAL = {
  title: "शिक्षा महाकुंभ अभियान",
  subtitle: "6th Edition",
  message:
    "Join the national educational movement at NIT Hamirpur from 9th October to 11th October 2026.",
  ctaUrl: "/departments/academic-council",
  ctaLabel: "click here",
};

/** Global client chrome — does not wrap page children (server-first layout). */
export default function ClientChrome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bar, setBar] = useState<CmsAnnouncementBar | null>(null);

  useEffect(() => {
    fetch("/api/v2/announcement-bars")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const global = (d?.items as CmsAnnouncementBar[] | undefined)?.find(
          (b) => b.barType === "global" || b.barType === "registration_alert"
        );
        if (global) setBar(global);
      })
      .catch(() => undefined);
  }, []);

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

  const modal = bar ?? null;
  const title = modal?.title ?? FALLBACK_MODAL.title;
  const subtitle = modal ? "Announcement" : FALLBACK_MODAL.subtitle;
  const message = modal?.message ?? FALLBACK_MODAL.message;
  const ctaUrl = modal?.ctaUrl ?? FALLBACK_MODAL.ctaUrl;
  const ctaLabel = modal?.ctaLabel ?? FALLBACK_MODAL.ctaLabel;

  return (
    <ErrorBoundary>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col items-center justify-center rounded-xl bg-primary p-4 text-center text-white md:p-6">
          <h1 className="text-2xl font-extrabold leading-tight text-white md:text-4xl">
            {title}
          </h1>
          <h2 className="mt-2 text-xl font-bold text-amber-200 md:text-3xl">{subtitle}</h2>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-white md:text-xl">
            {message}
          </p>
          {ctaUrl && (
            <div className="mt-5 max-w-4xl rounded-lg border border-white/20 bg-white/10 p-4 text-sm leading-relaxed text-white md:text-lg">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white underline underline-offset-2 transition hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
              >
                {ctaLabel}
              </a>
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
