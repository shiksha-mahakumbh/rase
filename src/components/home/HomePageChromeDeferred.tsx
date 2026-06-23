"use client";

import dynamic from "next/dynamic";

const HomePageChrome = dynamic(() => import("./HomePageChrome"), { ssr: false });

/** Fixed-position chrome (FAB / sticky bar) — no document flow, safe to defer without CLS. */
export default function HomePageChromeDeferred() {
  return <HomePageChrome />;
}
