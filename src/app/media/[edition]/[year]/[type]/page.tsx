import { notFound } from "next/navigation";
import {
  isMediaArchiveKey,
  MEDIA_ARCHIVE_KEYS,
  type MediaArchiveKey,
} from "@/data/media-archive-keys";
import MediaArchiveView from "./MediaArchiveView";

type Props = { params: Promise<{ edition: string; year: string; type: string }> };

export function generateStaticParams() {
  return MEDIA_ARCHIVE_KEYS.map((key) => {
    const [edition, year, type] = key.split("/");
    return { edition, year, type };
  });
}

export default async function MediaArchivePage({ params }: Props) {
  const { edition, year, type } = await params;
  const key = `${edition}/${year}/${type}`;
  if (!isMediaArchiveKey(key)) notFound();
  return <MediaArchiveView archiveKey={key as MediaArchiveKey} />;
}
