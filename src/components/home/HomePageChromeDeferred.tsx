"use client";

import IdleMount from "@/components/performance/IdleMount";
import HomePageChrome from "./HomePageChrome";

export default function HomePageChromeDeferred() {
  return (
    <IdleMount fallbackHeight="0">
      <HomePageChrome />
    </IdleMount>
  );
}
