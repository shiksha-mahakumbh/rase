"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const RecaptchaScript = dynamic(
  () => import("@/components/security/RecaptchaProvider"),
  { ssr: false }
);

/** Load reCAPTCHA after idle — keeps it off the critical path on contact/feedback pages. */
export default function DeferredRecaptchaScript() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const arm = () => setReady(true);
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(arm, { timeout: 10000 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(arm, 5000);
    return () => window.clearTimeout(t);
  }, []);

  if (!ready) return null;
  return <RecaptchaScript />;
}
