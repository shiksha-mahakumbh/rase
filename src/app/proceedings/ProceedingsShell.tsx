"use client";

import Proceedings from "@/app/component/Proceedings";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";

export default function ProceedingsShell() {
  return (
    <>
      <ReservedAdSlot slotId="publications-top" />
      <Proceedings />
    </>
  );
}
