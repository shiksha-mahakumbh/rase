"use client";

import dynamic from "next/dynamic";

const CountdownBanner = dynamic(() => import("./CountdownBanner"), { ssr: false });

export default function HeroCountdown() {
  return <CountdownBanner theme="light" />;
}
