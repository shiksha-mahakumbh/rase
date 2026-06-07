"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import Modal from "./component/Modal";
import ErrorBoundary from "@/components/errors/ErrorBoundary";

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

const MODAL_SEEN_KEY = "smk_announcement_seen";

/** Global client chrome — does not wrap page children (server-first layout). */
export default function ClientChrome() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(MODAL_SEEN_KEY);
    if (!seen) setIsModalOpen(true);
  }, []);

  const closeModal = () => {
    sessionStorage.setItem(MODAL_SEEN_KEY, "1");
    setIsModalOpen(false);
  };

  return (
    <ErrorBoundary>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col items-center justify-center rounded-xl bg-primary p-4 text-center text-white md:p-6">
          <h1 className="text-2xl font-extrabold leading-tight md:text-4xl">
            शिक्षा महाकुंभ अभियान
          </h1>
          <h2 className="mt-2 text-xl font-bold text-yellow-300 md:text-3xl">
            6th Edition
          </h2>
          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed md:text-xl">
            Join the national educational movement at{" "}
            <span className="font-bold text-yellow-200">NIT Hamirpur</span> from{" "}
            <span className="font-bold">9th October to 11th October 2026</span>
          </p>
          <div className="mt-5 max-w-4xl rounded-lg border border-white/20 bg-white/10 p-4 text-sm leading-relaxed md:text-lg">
            To know more about multi-track conferences, conclaves, olympiads, and
            academic activities,{" "}
            <a
              href="https://www.rase.co.in/VibhagRoute/AcademicCouncil24"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cyan-300 underline transition hover:text-cyan-200"
            >
              click here
            </a>
            .
          </div>
        </div>
      </Modal>

      <Toaster position="top-right" />
      <CookieConsent />
      <TrafficSourceCapture />
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
