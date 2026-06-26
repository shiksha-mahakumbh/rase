"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Script from "next/script";
import ErrorBoundary from "@/components/errors/ErrorBoundary";

const Toaster = dynamic(
  () => import("react-hot-toast").then((m) => ({ default: m.Toaster })),
  { ssr: false }
);
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
const ConsentGatedAdSense = dynamic(
  () => import("@/components/analytics/ConsentGatedAdSense"),
  { ssr: false }
);

/** Global client chrome — does not wrap page children (server-first layout). */
export default function ClientChrome() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const arm = () => setReady(true);
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(arm, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(arm, 2000);
    return () => window.clearTimeout(t);
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

  return (
    <ErrorBoundary>
      {ready ? (
        <>
          <Toaster position="top-right" />
          <CookieConsent />
          <TrafficSourceCapture />
          <VisitorPageTracker />
          <AnalyticsLoader />
        </>
      ) : null}

      <ConsentGatedAdSense />

      {process.env.NEXT_PUBLIC_BOTPRESS_ENABLED === "true" ? (
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
      ) : null}
    </ErrorBoundary>
  );
}
