"use client";

import Proceedings from "@/components/proceedings/Proceedings";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";

export default function ProceedingsShell() {
  return (
    <>
      <ReservedAdSlot slotId="publications-top" />
      <Proceedings />
    </>
  );
}
