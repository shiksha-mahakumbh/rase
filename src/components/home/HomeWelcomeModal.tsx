"use client";

import dynamic from "next/dynamic";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { useCms } from "@/lib/cms/context";
import {
  welcomeModalCtaClass,
  welcomeModalPanelClass,
  welcomeModalSubtitleClass,
} from "@/lib/announcement-bar-theme";
import {
  isHomePath,
  notifyWelcomeModalClosed,
  WELCOME_MODAL_SEEN_KEY,
} from "@/lib/home/is-home-path";
import {
  FALLBACK_WELCOME_MODAL,
  pickWelcomeModalBar,
  resolveAnnouncementBars,
} from "@/data/default-announcements";

const PremiumModal = dynamic(() => import("@/components/ui/PremiumModal"), { ssr: false });
const NavCtaLink = dynamic(
  () => import("@/components/ui/NavCtaLink").then((m) => ({ default: m.NavCtaLink })),
  { ssr: false }
);

/** Home-only welcome modal — deferred until after load + idle to protect TBT/CLS. */
export default function HomeWelcomeModal() {
  const cms = useCms();
  const pathname = usePathname();
  const params = useParams();
  const titleId = useId();
  const [enabled, setEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const bars = resolveAnnouncementBars(cms?.announcementBars, locale);
  const modalBar = pickWelcomeModalBar(bars);
  const colorTheme = modalBar?.colorTheme ?? "primary";

  const title = modalBar?.title ?? FALLBACK_WELCOME_MODAL.title;
  const subtitle = modalBar
    ? modalBar.barType === "registration_alert"
      ? "Registration alert"
      : modalBar.barType === "emergency"
        ? "Important notice"
        : "Announcement"
    : FALLBACK_WELCOME_MODAL.subtitle;
  const message = modalBar?.message ?? FALLBACK_WELCOME_MODAL.message;
  const ctaUrl = modalBar?.ctaUrl ?? FALLBACK_WELCOME_MODAL.ctaUrl;
  const ctaLabel = modalBar?.ctaLabel ?? FALLBACK_WELCOME_MODAL.ctaLabel;

  const dismiss = () => {
    sessionStorage.setItem(WELCOME_MODAL_SEEN_KEY, "1");
    setIsOpen(false);
    notifyWelcomeModalClosed();
  };

  useEffect(() => {
    if (!isHomePath(pathname ?? "")) return;

    const arm = () => {
      if (sessionStorage.getItem(WELCOME_MODAL_SEEN_KEY)) {
        notifyWelcomeModalClosed();
        return;
      }
      const show = () => setEnabled(true);
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(show, { timeout: 15000 });
      } else {
        window.setTimeout(show, 12000);
      }
    };

    if (document.readyState === "complete") {
      arm();
      return;
    }
    window.addEventListener("load", arm, { once: true });
    return () => window.removeEventListener("load", arm);
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;
    if (!sessionStorage.getItem(WELCOME_MODAL_SEEN_KEY)) setIsOpen(true);
  }, [enabled]);

  if (!enabled || !isHomePath(pathname ?? "")) return null;

  const panelClass = welcomeModalPanelClass(colorTheme);
  const subtitleClass = welcomeModalSubtitleClass(colorTheme);
  const ctaClass = welcomeModalCtaClass(colorTheme);

  return (
    <PremiumModal
      isOpen={isOpen}
      onClose={dismiss}
      maxWidth="2xl"
      title={title}
      titleId={titleId}
      ariaLabel="Welcome announcement"
      showCloseButton={modalBar?.isDismissible !== false}
    >
      <div
        className={`flex flex-col items-center justify-center rounded-xl p-4 text-center md:p-6 ${panelClass}`}
      >
        <h2 id={titleId} className="text-2xl font-extrabold leading-tight md:text-3xl">
          {title}
        </h2>
        <p className={`mt-2 text-lg font-bold md:text-2xl ${subtitleClass}`}>{subtitle}</p>
        <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed md:text-lg opacity-95">
          {message}
        </p>
        {ctaUrl ? (
          <div className="mt-5">
            <NavCtaLink
              href={ctaUrl}
              onClick={dismiss}
              className={`inline-flex min-h-[44px] items-center rounded-lg border px-5 py-2.5 text-sm font-semibold underline underline-offset-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:text-base ${ctaClass}`}
            >
              {ctaLabel}
            </NavCtaLink>
          </div>
        ) : null}
      </div>
    </PremiumModal>
  );
}
