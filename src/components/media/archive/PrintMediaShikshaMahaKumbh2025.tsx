"use client";

import PrintMediaArchiveGrid from "./PrintMediaArchiveGrid";

const images = Array.from({ length: 85 }, (_, index) => ({
  src: `/sm25printmedia/${index + 1}.jpg`,
  alt: `SMK 5.0 print clipping ${index + 1}`,
}));

export default function PrintMediaShikshaMahaKumbh2025() {
  return (
    <PrintMediaArchiveGrid
      title="Shiksha Mahakumbh 5.0 — Print Media"
      description="85 newspaper and magazine clippings from Shiksha Mahakumbh 5.0 at NIPER Mohali, October–November 2025."
      images={images}
      initialCount={16}
    />
  );
}
