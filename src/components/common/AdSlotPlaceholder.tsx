/**
 * Reserved ad placement — no AdSense script loaded (Phase 2).
 * Activate only after policy review and user consent.
 */
export default function AdSlotPlaceholder({
  slot = "content",
  className = "",
}: {
  slot?: "content" | "sidebar" | "footer";
  className?: string;
}) {
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_ADS_SLOTS_PREVIEW) {
    return null;
  }

  return (
    <div
      data-ad-slot={slot}
      className={`hidden min-h-[90px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center text-xs text-slate-400 md:flex ${className}`}
      aria-hidden
    >
      Ad placement ({slot}) — disabled
    </div>
  );
}
