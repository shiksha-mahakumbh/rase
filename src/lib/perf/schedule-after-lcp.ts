/** Run after LCP (or fallback) so modals/tools do not steal the main thread during paint. */
export function scheduleAfterLcp(
  callback: () => void,
  options?: { bufferMs?: number; fallbackMs?: number }
) {
  if (typeof window === "undefined") return () => undefined;

  const bufferMs = options?.bufferMs ?? 800;
  const fallbackMs = options?.fallbackMs ?? 10000;
  let done = false;
  let fallbackId = 0;
  let bufferId = 0;

  const run = () => {
    if (done) return;
    done = true;
    callback();
  };

  fallbackId = window.setTimeout(run, fallbackMs);

  try {
    const po = new PerformanceObserver((list) => {
      if (list.getEntries().length === 0) return;
      window.clearTimeout(fallbackId);
      bufferId = window.setTimeout(run, bufferMs);
      po.disconnect();
    });
    po.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // LCP API unavailable — fallback timer only
  }

  return () => {
    window.clearTimeout(fallbackId);
    window.clearTimeout(bufferId);
  };
}
