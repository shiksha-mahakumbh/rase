"use client";

import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function useRecaptcha() {
  const execute = async (action: string): Promise<string | null> => {
    if (!SITE_KEY) {
      if (process.env.NODE_ENV !== "production") return "dev-bypass-token";
      return null;
    }

    const grecaptcha = (
      window as unknown as {
        grecaptcha?: {
          ready: (cb: () => void) => void;
          execute: (key: string, opts: { action: string }) => Promise<string>;
        };
      }
    ).grecaptcha;

    if (!grecaptcha) return null;

    return new Promise((resolve) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(SITE_KEY, { action })
          .then(resolve)
          .catch(() => resolve(null));
      });
    });
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
      strategy="lazyOnload"
    />
  );
}
