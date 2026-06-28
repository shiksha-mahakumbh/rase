"use client";

import dynamic from "next/dynamic";

const HomeWelcomeModal = dynamic(() => import("./HomeWelcomeModal"), { ssr: false });

export default function HomeWelcomeModalDeferred() {
  return <HomeWelcomeModal />;
}
