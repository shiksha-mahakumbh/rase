"use client";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function FloatingActionButton() {
  return (
    <Link
      href={ROUTES.registration}
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-saffron text-brand-navy shadow-xl transition hover:scale-105 hover:bg-brand-saffron-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron md:bottom-8 md:right-8 md:h-16 md:w-16"
      aria-label="Register for Shiksha Mahakumbh 6.0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7"
        aria-hidden
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
      <span className="sr-only">Register now</span>
      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-emerald text-[10px] font-bold text-white">
        +
      </span>
    </Link>
  );
}
