"use client";

import dynamic from "next/dynamic";

const EventImageSlider = dynamic(() => import("./EventImageSlider"), {
  ssr: false,
  loading: () => (
    <div
      className="mb-6 min-h-[320px] animate-pulse rounded-lg bg-gray-200"
      aria-hidden
    />
  ),
});

export default EventImageSlider;
