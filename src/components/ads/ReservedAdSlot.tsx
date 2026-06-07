/**
 * CLS-safe reserved ad placement. Does not load AdSense unless explicitly enabled elsewhere.
 */
export type AdSlotId =
  | "home-mid"
  | "home-footer"
  | "knowledge-inline"
  | "pastevent-mid"
  | "publications-top"
  | "sidebar";

interface ReservedAdSlotProps {
  slotId: AdSlotId;
  className?: string;
  /** Taller slot for in-content placements */
  size?: "banner" | "rectangle";
}

const HEIGHT = {
  banner: "min-h-[90px] md:min-h-[120px]",
  rectangle: "min-h-[250px] md:min-h-[280px]",
} as const;

export default function ReservedAdSlot({
  slotId,
  className = "",
  size = "banner",
}: ReservedAdSlotProps) {
  return (
    <aside
      role="complementary"
      aria-label={`Sponsored content area (${slotId})`}
      data-ad-slot={slotId}
      data-adsense-ready="reserved"
      className={`my-6 flex w-full max-w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/80 ${HEIGHT[size]} ${className}`}
    >
      <span className="px-4 text-center text-xs text-slate-400">
        {/* Visible in staging; empty in production until AdSense approved */}
        {process.env.NEXT_PUBLIC_ADS_SLOTS_PREVIEW === "true"
          ? `Ad placement reserved · ${slotId}`
          : "\u00A0"}
      </span>
    </aside>
  );
}
