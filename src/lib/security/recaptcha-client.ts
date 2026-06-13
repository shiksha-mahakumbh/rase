"use client";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (key: string, opts: { action: string }) => Promise<string>;
};

let scriptLoaded = false;
let scriptFailed = false;
let readyResolvers: Array<() => void> = [];

function getGrecaptcha(): Grecaptcha | undefined {
  return (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
}

/** Called by RecaptchaScript when the Google script finishes loading. */
export function markRecaptchaScriptLoaded(): void {
  scriptLoaded = true;
  const grecaptcha = getGrecaptcha();
  if (!grecaptcha) {
    scriptFailed = true;
    return;
  }
  grecaptcha.ready(() => {
    readyResolvers.forEach((r) => r());
    readyResolvers = [];
  });
}

export function markRecaptchaScriptFailed(): void {
  scriptFailed = true;
  readyResolvers.forEach((r) => r());
  readyResolvers = [];
}

export function isRecaptchaConfigured(): boolean {
  return Boolean(SITE_KEY);
}

export function waitForRecaptcha(timeoutMs = 15000): Promise<boolean> {
  if (!SITE_KEY) {
    return Promise.resolve(process.env.NODE_ENV !== "production");
  }
  if (scriptFailed) return Promise.resolve(false);
  if (scriptLoaded && getGrecaptcha()) return Promise.resolve(true);

  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeoutMs);
    readyResolvers.push(() => {
      clearTimeout(timer);
      resolve(!scriptFailed && Boolean(getGrecaptcha()));
    });
    if (scriptLoaded && getGrecaptcha()) {
      clearTimeout(timer);
      resolve(true);
    }
  });
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  if (!SITE_KEY) {
    return process.env.NODE_ENV !== "production" ? "dev-bypass" : null;
  }

  const ready = await waitForRecaptcha();
  if (!ready) return null;

  const grecaptcha = getGrecaptcha();
  if (!grecaptcha) return null;

  const run = (): Promise<string | null> =>
    new Promise((resolve) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(SITE_KEY!, { action })
          .then(resolve)
          .catch(() => resolve(null));
      });
    });

  const token = await run();
  if (token) return token;

  // One retry — tokens can fail if the script was still initializing.
  await new Promise((r) => setTimeout(r, 400));
  return run();
}
