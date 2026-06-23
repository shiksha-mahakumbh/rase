"use client";

import dynamic from "next/dynamic";
import IdleMount from "@/components/performance/IdleMount";

const Marquees = dynamic(() => import("@/components/layout/Marquees"), { ssr: false });

export default function MarqueesDeferred() {
  return (
    <IdleMount fallbackHeight="4.5rem">
      <Marquees />
    </IdleMount>
  );
}
