"use client";

import Script from "next/script";
import {
  markRecaptchaScriptFailed,
  markRecaptchaScriptLoaded,
} from "@/lib/security/recaptcha-client";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function useRecaptcha() {
  const execute = async (action: string) => {
    const { executeRecaptcha } = await import("@/lib/security/recaptcha-client");
    return executeRecaptcha(action);
  };

  const verifyWithServer = async (action: string) => {
    const token = await execute(action);
    if (!token) return false;

    const res = await fetch("/api/registration/verify-captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action }),
    });

    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.ok);
  };

  return { execute, verifyWithServer };
}

export default function RecaptchaScript() {
  if (!SITE_KEY) return null;

  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
      strategy="afterInteractive"
      onLoad={() => markRecaptchaScriptLoaded()}
      onError={() => markRecaptchaScriptFailed()}
    />
  );
}
