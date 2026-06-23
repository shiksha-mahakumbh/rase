"use client";

import PrintMediaArchiveGrid from "./PrintMediaArchiveGrid";

const images = [
  { src: "/sk23printmedia/6.png", column: 1 },
  { src: "/sk23printmedia/3.png", column: 1 },
  { src: "/sk23printmedia/2.png", column: 1 },
  { src: "/sk23printmedia/10.jpg", column: 1 },

  { src: "/sk23printmedia/9.jpg", column: 2 },
  { src: "/sk23printmedia/4.png", column: 2 },

  { src: "/sk23printmedia/7.png", column: 3 },
  { src: "/sk23printmedia/1.jpg", column: 3 },

  { src: "/sk23printmedia/11.jpg", column: 4 },
  { src: "/sk23printmedia/5.png", column: 4 },
  { src: "/sk23printmedia/8.png", column: 4 },
];

export default function PrintMediaShikshaKumbh2023() {
  return (
    <PrintMediaArchiveGrid
      title="Shiksha Kumbh 2.0 — Print Media"
      description="Print media from Shiksha Kumbh 2.0 at NIT Kurukshetra, December 2023."
      images={images.map((img) => ({ src: img.src, alt: img.src.split("/").pop() }))}
      initialCount={16}
    />
  );
}
