import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";

const PRINT_COUNT = 85;
const COLUMN_COUNT = 4;

const images = Array.from({ length: PRINT_COUNT }, (_, index) => ({
  src: `/sm25printmedia/${index + 1}.jpg`,
  column: (index % COLUMN_COUNT) + 1,
}));

export default function PrintMediaShikshaMahaKumbh2025() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const groupedImages = images.reduce<Record<number, typeof images>>((acc, image) => {
    acc[image.column] = [...(acc[image.column] || []), image];
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="mb-8 text-center text-4xl font-bold">Shiksha Mahakumbh 5.0 — Print Media</h1>
      <p className="mx-auto mb-8 max-w-3xl text-center text-slate-600">
        {PRINT_COUNT} newspaper and magazine clippings from Shiksha Mahakumbh 5.0 at NIPER Mohali,
        October–November 2025.
      </p>
      <div className="-mx-2 flex flex-wrap">
        {Object.keys(groupedImages).map((columnKey) => (
          <div key={columnKey} className="w-full px-2 sm:w-1/2 md:w-1/3 lg:w-1/4">
            {groupedImages[parseInt(columnKey, 10)].map((image, imgIndex) => (
              <button
                key={image.src}
                type="button"
                className="mb-4 w-full cursor-pointer text-left"
                onClick={() => setSelectedImage(image.src)}
              >
                <Image
                  src={image.src}
                  alt={`SMK 5.0 print media ${imgIndex + 1}`}
                  className="rounded-lg border-2 border-solid border-red-950"
                  width={300}
                  height={200}
                  style={{ width: "100%", height: "auto" }}
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      <ImageLightbox
        isOpen={!!selectedImage}
        imageSrc={selectedImage ?? ""}
        onClose={() => setSelectedImage(null)}
        alt="SMK 5.0 print clipping"
        downloadUrl={selectedImage ?? undefined}
      />
    </div>
  );
}
