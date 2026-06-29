import { SITE_URL } from "@/config/site";
import { PRESS_CANONICAL_PATHS } from "@/constants/canonical-routes";

/** Canonical share URL for Press1–Press9 client pages */
export function getPressShareUrl(pressNumber: number): string {
  const base = SITE_URL.replace(/\/$/, "");
  const path = PRESS_CANONICAL_PATHS[pressNumber] ?? `/press/article-${pressNumber}`;
  return encodeURIComponent(`${base}${path}`);
}

/** OG image path per press article (under /public) */
export const PRESS_OG_IMAGES: Record<number, string> = {
  1: "/2024M/press1.jpg",
  2: "/2024M/press2.jpg",
  3: "/2024M/press3.jpg",
  4: "/2024M/press4.jpg",
  5: "/2024M/press5.jpg",
  6: "/2024M/Press6.jpg",
  7: "/2024M/Press7.jpg",
  8: "/2024M/Press8.jpg",
  9: "/2024M/Press8.jpg",
};

export function getPressOgImageUrl(pressNumber: number): string {
  const path = PRESS_OG_IMAGES[pressNumber] ?? "/sLogo.png";
  return `${SITE_URL.replace(/\/$/, "")}${path}`;
}
