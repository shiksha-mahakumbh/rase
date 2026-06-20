import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface ImageData {
  src: string;
  column: number;
}

const images: ImageData[] = [
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Define the type for the groupedImages object
  const groupedImages: { [key: number]: ImageData[] } = images.reduce(
    (acc, image) => {
      acc[image.column] = [...(acc[image.column] || []), image];
      return acc;
    },
    {} as { [key: number]: ImageData[] }
  );

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">
        Shiksha Mahakumbh 2.0 — Print Media
      </h1>
      <div className="flex flex-wrap -mx-2">
        {Object.keys(groupedImages).map((columnKey) => (
          <div
            key={columnKey}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2"
          >
            {groupedImages[parseInt(columnKey)].map((image, imgIndex) => (
              <div
                key={imgIndex}
                className="mb-4 cursor-pointer"
                onClick={() => handleImageClick(image.src)}
              >
                <Image
                  src={image.src}
                  alt={`Print Media ${imgIndex + 1}`}
                  className="rounded-lg border-solid border-red-950 border-2"
                  layout="responsive"
                  width={300}
                  height={200}
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <ImageLightbox
        isOpen={!!selectedImage}
        imageSrc={selectedImage ?? ""}
        onClose={handleCloseModal}
        alt="Selected Image"
        downloadUrl={selectedImage ?? undefined}
      />
    </div>
  );
}
