"use client";

/**
 * Root error boundary — must define its own html/body (Next.js requirement).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center font-sans antialiased">
        <h1 className="text-2xl font-bold text-slate-900">Application error</h1>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          Shiksha Mahakumbh — please refresh the page or try again later.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
