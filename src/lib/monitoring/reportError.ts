/**
 * Central error reporting. Requires @sentry/nextjs and NEXT_PUBLIC_SENTRY_DSN.
 */
export function reportError(
  error: unknown,
  context?: Record<string, string | undefined>
) {
  const err = error instanceof Error ? error : new Error(String(error));

  if (process.env.NODE_ENV === "development") {
    console.error("[reportError]", err, context);
  }

  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    void import("@sentry/nextjs")
      .then((Sentry) => {
        Sentry.captureException(err, { extra: context });
      })
      .catch(() => {
        void fetch("/api/client-error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: err.message,
            stack: err.stack,
            context,
            url: window.location.href,
          }),
        }).catch(() => undefined);
      });
  }
}
