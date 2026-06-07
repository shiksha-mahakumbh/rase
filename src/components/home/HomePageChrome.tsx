"use client";

import dynamic from "next/dynamic";

const StickyRegisterBar = dynamic(() => import("./StickyRegisterBar"), {
  ssr: false,
});
const FloatingActionButton = dynamic(() => import("./FloatingActionButton"), {
  ssr: false,
});

export default function HomePageChrome() {
  return (
    <>
      <StickyRegisterBar />
      <FloatingActionButton />
    </>
  );
}
