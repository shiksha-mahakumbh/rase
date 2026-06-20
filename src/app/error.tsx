"use client";

import { useEffect } from "react";
import Link from "next/link";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

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
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <main
        id="main-content"
        className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center"
      >
        <h1 className="home-section-title text-2xl md:text-3xl">Something went wrong</h1>
        <p className="mt-2 max-w-md text-sm text-slate-600 md:text-base">
          Please try again. If this continues, email{" "}
          <a
            href="mailto:academics@shikshamahakumbh.com"
            className="font-semibold text-brand-saffron underline"
          >
            academics@shikshamahakumbh.com
          </a>
          .
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-6 py-3 text-sm font-bold text-white hover:bg-brand-navy-light"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand-saffron px-5 py-2.5 text-sm font-bold text-brand-saffron"
          >
            Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
