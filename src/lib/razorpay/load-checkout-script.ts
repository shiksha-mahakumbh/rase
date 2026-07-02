/** First-party path — proxied in next.config.js to avoid ad-blocker lists on razorpay.com */
const CHECKOUT_SCRIPT_FIRST_PARTY = "/pay/v1/checkout.js";
const CHECKOUT_SCRIPT_DIRECT = "https://checkout.razorpay.com/v1/checkout.js";

const CHECKOUT_SCRIPT_SOURCES = [CHECKOUT_SCRIPT_FIRST_PARTY, CHECKOUT_SCRIPT_DIRECT];

let loadPromise: Promise<void> | null = null;
let lastLoadedSrc: string | null = null;

function razorpayReady(): boolean {
  return typeof window !== "undefined" && Boolean(window.Razorpay);
}

function waitForRazorpayGlobal(timeoutMs = 12_000): Promise<boolean> {
  if (razorpayReady()) return Promise.resolve(true);

  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      if (razorpayReady()) {
        resolve(true);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(false);
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

function removeCheckoutScriptTags() {
  for (const src of CHECKOUT_SCRIPT_SOURCES) {
    document.querySelectorAll<HTMLScriptElement>(`script[src="${src}"]`).forEach((el) => {
      el.remove();
    });
  }
}

/** Clear cached load state so the next call tries all sources again (e.g. after ad-blocker retry). */
export function resetRazorpayCheckoutScriptLoad() {
  loadPromise = null;
  lastLoadedSrc = null;
  if (typeof document !== "undefined") {
    removeCheckoutScriptTags();
  }
}

function attachScriptListeners(
  script: HTMLScriptElement,
  src: string,
  resolve: () => void,
  reject: (error: Error) => void
) {
  const onLoad = async () => {
    script.removeEventListener("load", onLoad);
    script.removeEventListener("error", onError);
    const ready = await waitForRazorpayGlobal();
    if (!ready) {
      console.error("RAZORPAY_SCRIPT_LOAD_FAILED", {
        src,
        reason: "window.Razorpay missing after load",
      });
      reject(new Error("Razorpay checkout did not initialize"));
      return;
    }
    lastLoadedSrc = src;
    console.info("RAZORPAY_SCRIPT_LOAD_SUCCESS", { src, reused: true });
    resolve();
  };
  const onError = () => {
    script.removeEventListener("load", onLoad);
    script.removeEventListener("error", onError);
    console.error("RAZORPAY_SCRIPT_LOAD_FAILED", { src, reused: true });
    reject(new Error(`Failed to load Razorpay checkout script (${src})`));
  };
  script.addEventListener("load", onLoad);
  script.addEventListener("error", onError);
}

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (existing) {
      if (razorpayReady()) {
        lastLoadedSrc = src;
        console.info("RAZORPAY_SCRIPT_LOAD_SUCCESS", { src, reused: true, ready: true });
        resolve();
        return;
      }
      attachScriptListeners(existing, src, resolve, reject);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = async () => {
      const ready = await waitForRazorpayGlobal();
      if (!ready) {
        console.error("RAZORPAY_SCRIPT_LOAD_FAILED", {
          src,
          injected: true,
          reason: "window.Razorpay missing after load",
        });
        reject(new Error("Razorpay checkout did not initialize"));
        return;
      }
      lastLoadedSrc = src;
      console.info("RAZORPAY_SCRIPT_LOAD_SUCCESS", { src, injected: true });
      resolve();
    };
    script.onerror = () => {
      console.error("RAZORPAY_SCRIPT_LOAD_FAILED", { src, injected: true });
      reject(new Error(`Failed to load Razorpay checkout script (${src})`));
    };
    document.body.appendChild(script);
  });
}

async function loadFromSources(sources: string[]): Promise<void> {
  let lastError: Error | null = null;

  for (const src of sources) {
    console.info("RAZORPAY_SCRIPT_LOAD_START", { src });
    try {
      await injectScript(src);
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)?.remove();
    }
  }

  throw lastError ?? new Error("Failed to load Razorpay checkout script");
}

/** Load Razorpay checkout.js once; safe to call repeatedly. Tries first-party proxy first. */
export function loadRazorpayCheckoutScript(options?: { forceRetry?: boolean }): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout requires browser"));
  }

  if (options?.forceRetry) {
    resetRazorpayCheckoutScriptLoad();
  }

  if (razorpayReady()) {
    console.info("RAZORPAY_SCRIPT_LOAD_SUCCESS", { cached: true, src: lastLoadedSrc });
    return Promise.resolve();
  }

  if (loadPromise) return loadPromise;

  loadPromise = loadFromSources(CHECKOUT_SCRIPT_SOURCES).catch((error) => {
    loadPromise = null;
    throw error;
  });

  return loadPromise;
}

export function isRazorpayCheckoutReady(): boolean {
  return razorpayReady();
}
