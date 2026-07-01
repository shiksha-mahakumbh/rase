import dynamic from "next/dynamic";

/** Code-split heavy client showcase hubs (framer-motion, grids, etc.). */
export const CommitteesShowcase = dynamic(
  () => import("@/components/committee/CommitteesShowcase")
);
export const DonationShowcase = dynamic(
  () => import("@/components/donation/DonationShowcase")
);
export const GalleryShowcase = dynamic(
  () => import("@/components/gallery/GalleryShowcase")
);
export const DownloadsShowcase = dynamic(
  () => import("@/components/downloads/DownloadsShowcase")
);
export const UpcomingEventsShowcase = dynamic(
  () => import("@/components/upcoming-events/UpcomingEventsShowcase")
);
export const MediaCenterShowcase = dynamic(
  () => import("@/components/media/MediaCenterShowcase")
);
