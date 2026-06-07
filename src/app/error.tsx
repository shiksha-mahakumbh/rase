"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-brand-navy">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Please try again. If this continues, email{" "}
        <a
          href="mailto:academics@shikshamahakumbh.com"
          className="font-semibold text-brand-saffron underline"
        >
          academics@shikshamahakumbh.com
        </a>
        .
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-brand-navy px-6 py-3 text-sm font-bold text-white hover:bg-brand-navy-light"
      >
        Try again
      </button>
    </div>
  );
}
