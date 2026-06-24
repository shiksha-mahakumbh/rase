import { CtaButton } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import type { TickerItem } from "@/data/default-announcements";
import MarqueeTrack from "./MarqueeTrack";

type Props = {
  items: readonly TickerItem[];
};

/** Homepage announcements ticker — server-resolved items, client animation only. */
export default function AnnouncementsMarquee({ items }: Props) {
  return (
    <section
      className="border-y border-primary/10 bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm"
      aria-label="Announcements"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-saffron opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-saffron" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-navy md:text-base">
              Announcements
            </h2>
          </div>
          <CtaButton href={ROUTES.registration} variant="primary" className="min-h-[44px] px-3 py-2 text-xs md:text-sm">
            Register Now
          </CtaButton>
        </div>

        <MarqueeTrack items={items} />
      </div>
    </section>
  );
}
