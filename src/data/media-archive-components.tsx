"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import type { MediaArchiveKey } from "@/data/media-archive-keys";

export type { MediaArchiveKey } from "@/data/media-archive-keys";
export { MEDIA_ARCHIVE_KEYS, isMediaArchiveKey } from "@/data/media-archive-keys";

const LOADERS: Record<MediaArchiveKey, () => Promise<{ default: ComponentType }>> = {
  "shiksha-mahakumbh/1.0/digital": () =>
    import("@/app/component/ShikshaMahaKumbh2023DigitalMedia"),
  "shiksha-mahakumbh/2.0/digital": () =>
    import("@/app/component/ShikshaKumbh2023DigitalMedia"),
  "shiksha-mahakumbh/3.0/digital": () =>
    import("@/app/component/ShikshaKumbh2024DigitalMedia"),
  "shiksha-mahakumbh/4.0/digital": () =>
    import("@/app/component/ShikshaMahaKumbh2024DigitalMedia"),
  "shiksha-mahakumbh/1.0/print": () =>
    import("@/app/component/PrintMediaShikshaMahaKumbh2023"),
  "shiksha-mahakumbh/2.0/print": () =>
    import("@/app/component/PrintMediaShikshaKumbh2023"),
  "shiksha-mahakumbh/3.0/print": () =>
    import("@/app/component/PrintMediaShikshaKumbh2024"),
  "shiksha-mahakumbh/4.0/print": () =>
    import("@/app/component/PrintMediaShikshaMahaKumbh2024"),
};

export function getMediaArchiveComponent(key: MediaArchiveKey) {
  return dynamic(LOADERS[key], {
    loading: () => <div className="p-8 text-center text-gray-600">Loading archive…</div>,
  });
}
