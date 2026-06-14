import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "./ui/ImageLightbox";

interface ImageData {
  src: string;
  column: number;
}

const images: ImageData[] = [
  { src: "/sm24printmedia/49.jpg", column: 1 },
{ src: "/sm24printmedia/48.jpg", column: 2 },
{ src: "/sm24printmedia/47.jpg", column: 3 },
{ src: "/sm24printmedia/46.jpg", column: 4 },
{ src: "/sm24printmedia/45.jpg", column: 5 },
{ src: "/sm24printmedia/44.jpg", column: 6 },
{ src: "/sm24printmedia/43.jpg", column: 7 },
{ src: "/sm24printmedia/42.jpg", column: 8 },
{ src: "/sm24printmedia/41.jpg", column: 9 },
{ src: "/sm24printmedia/40.jpg", column: 10 },
{ src: "/sm24printmedia/39.jpg", column: 11 },
{ src: "/sm24printmedia/38.jpg", column: 12 },
{ src: "/sm24printmedia/37.jpg", column: 13 },
{ src: "/sm24printmedia/36.jpg", column: 14 },
{ src: "/sm24printmedia/35.jpg", column: 15 },
{ src: "/sm24printmedia/34.jpg", column: 16 },
{ src: "/sm24printmedia/33.jpg", column: 17 },
{ src: "/sm24printmedia/32.jpg", column: 18 },
{ src: "/sm24printmedia/31.jpg", column: 19 },
{ src: "/sm24printmedia/30.jpg", column: 20 },
{ src: "/sm24printmedia/29.jpg", column: 21 },
{ src: "/sm24printmedia/28.jpg", column: 22 },
{ src: "/sm24printmedia/27.jpg", column: 23 },
{ src: "/sm24printmedia/26.jpg", column: 24 },
{ src: "/sm24printmedia/25.jpg", column: 25 },
{ src: "/sm24printmedia/24.jpg", column: 26 },
{ src: "/sm24printmedia/23.jpg", column: 27 },
{ src: "/sm24printmedia/22.jpg", column: 28 },
{ src: "/sm24printmedia/21.jpg", column: 29 },
{ src: "/sm24printmedia/20.jpg", column: 30 },
{ src: "/sm24printmedia/19.jpg", column: 31 },
{ src: "/sm24printmedia/18.jpg", column: 32 },
{ src: "/sm24printmedia/17.jpg", column: 33 },
{ src: "/sm24printmedia/16.jpg", column: 34 },
{ src: "/sm24printmedia/15.jpg", column: 35 },
{ src: "/sm24printmedia/14.jpg", column: 36 },
{ src: "/sm24printmedia/13.jpg", column: 37 },
{ src: "/sm24printmedia/12.jpg", column: 38 },
{ src: "/sm24printmedia/11.jpg", column: 39 },
{ src: "/sm24printmedia/10.jpg", column: 40 },
{ src: "/sm24printmedia/9.jpg", column: 41 },
{ src: "/sm24printmedia/8.jpg", column: 42 },
{ src: "/sm24printmedia/7.jpg", column: 43 },
{ src: "/sm24printmedia/6.jpg", column: 44 },
{ src: "/sm24printmedia/5.jpg", column: 45 },
{ src: "/sm24printmedia/4.jpg", column: 46 },
{ src: "/sm24printmedia/3.jpg", column: 47 },
{ src: "/sm24printmedia/2.jpg", column: 48 },
{ src: "/sm24printmedia/1.jpg", column: 49 }


 
];

export default function PrintMediaShikshaMahaKumbh2024() {
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
        Shiksha Mahakumbh 4.0
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
