"use client";

import {
  getMediaArchiveComponent,
  type MediaArchiveKey,
} from "@/data/media-archive-components";

export default function MediaArchiveClient({
  archiveKey,
}: {
  archiveKey: MediaArchiveKey;
}) {
  const Archive = getMediaArchiveComponent(archiveKey);
  return <Archive />;
}
