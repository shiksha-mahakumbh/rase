const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise: Promise<void> | null = null;

function razorpayReady(): boolean {
  return typeof window !== "undefined" && Boolean(window.Razorpay);
}

function attachScriptListeners(
  script: HTMLScriptElement,
  resolve: () => void,
  reject: (error: Error) => void
) {
  const onLoad = () => {
    script.removeEventListener("load", onLoad);
    script.removeEventListener("error", onError);
    console.info("RAZORPAY_SCRIPT_LOAD_SUCCESS", { reused: true });
    resolve();
  };
  const onError = () => {
    script.removeEventListener("load", onLoad);
    script.removeEventListener("error", onError);
    loadPromise = null;
    console.error("RAZORPAY_SCRIPT_LOAD_FAILED", { reused: true });
    reject(new Error("Failed to load Razorpay checkout script"));
  };
  script.addEventListener("load", onLoad);
  script.addEventListener("error", onError);
}

/** Load Razorpay checkout.js once; safe to call repeatedly. */
export function loadRazorpayCheckoutScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout requires browser"));
  }

  if (razorpayReady()) {
    console.info("RAZORPAY_SCRIPT_LOAD_SUCCESS", { cached: true });
    return Promise.resolve();
  }

  if (loadPromise) return loadPromise;

  console.info("RAZORPAY_SCRIPT_LOAD_START", { src: CHECKOUT_SCRIPT });

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CHECKOUT_SCRIPT}"]`
    );

    if (existing) {
      if (razorpayReady()) {
        console.info("RAZORPAY_SCRIPT_LOAD_SUCCESS", { reused: true, ready: true });
        resolve();
        return;
      }
      attachScriptListeners(existing, resolve, reject);
      return;
    }

    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => {
      console.info("RAZORPAY_SCRIPT_LOAD_SUCCESS", { injected: true });
      resolve();
    };
    script.onerror = () => {
      loadPromise = null;
      console.error("RAZORPAY_SCRIPT_LOAD_FAILED", { injected: true });
      reject(new Error("Failed to load Razorpay checkout script"));
    };
    document.body.appendChild(script);
  });

  return loadPromise;
}

export function isRazorpayCheckoutReady(): boolean {
  return razorpayReady();
}
