"use client";

import dynamic from "next/dynamic";

const CountdownBanner = dynamic(() => import("./CountdownBanner"), { ssr: false });

/** Reserve countdown height so client hydration does not shift the hero. */
export default function HeroCountdown() {
  return (
    <div className="min-h-[4.25rem]">
      <CountdownBanner theme="light" />
    </div>
  );
}
