import Image from "next/image";
import { useState } from "react";

interface ImageData {
  src: string;
  column: number;
}

const images: ImageData[] = [
  { src: "/sm24printmedia/12.jpg", column: 1},
  { src: "/sm24printmedia/13.jpg", column: 2 },
  { src: "/sm24printmedia/15.jpg", column: 3 },
  { src: "/sm24printmedia/16.jpg", column: 4},
  { src: "/sm24printmedia/17.jpg", column: 5},
  { src: "/sm24printmedia/18.jpg", column: 6 },
  { src: "/sm24printmedia/8.jpg", column: 7},
  { src: "/sm24printmedia/9.jpg", column: 8 },
  { src: "/sm24printmedia/10.jpg", column:9 },
  { src: "/sm24printmedia/11.jpg", column: 10},
  { src: "/sm24printmedia/5.jpg", column: 11},
  { src: "/sm24printmedia/6.jpg", column: 12 },
  { src: "/sm24printmedia/7.jpg", column: 13},
  { src: "/sm24printmedia/1.jpg", column: 14},
  { src: "/sm24printmedia/2.jpg", column: 15},
  { src: "/sm24printmedia/3.jpg", column: 16 },
  { src: "/sm24printmedia/4.jpg", column: 17 },

 
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
        Shiksha Mahakumbh 2024
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

      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="relative p-4 bg-white rounded-lg max-w-full max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Selected Image"
              className="rounded-lg"
              layout="intrinsic"
              width={800}
              height={600}
              objectFit="contain"
            />
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => {
                  window.open(selectedImage, "_blank");
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
              >
                Download
              </button>
            </div>
            <button
              onClick={handleCloseModal}
              className="absolute top-0 right-0 p-4 text-white"
            >
              <svg
                className="w-8 h-8 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 10.293l4.707-4.707 1.414 1.414L13.414 12l4.707 4.707-1.414 1.414L12 13.414l-4.707 4.707-1.414-1.414L10.586 12 5.879 7.293 7.293 5.879 12 10.293z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
