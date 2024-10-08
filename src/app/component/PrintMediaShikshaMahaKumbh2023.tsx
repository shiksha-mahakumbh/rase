import Image from "next/image";
import { useState } from "react";

interface ImageData {
  src: string;
  column: number;
}

const images: ImageData[] = [
  { src: "/sm23printmedia/9.jpg", column: 1 },
  { src: "/sm23printmedia/17.jpg", column: 1 },
  { src: "/sm23printmedia/25.png", column: 1 },
  { src: "/sm23printmedia/1.jpg", column: 1 },
  { src: "/sm23printmedia/33.jpg", column: 1 },
  { src: "/sm23printmedia/41.jpg", column: 1 },
  { src: "/sm23printmedia/49.jpg", column: 1 },
  { src: "/sm23printmedia/57.jpg", column: 1 },
  { src: "/sm23printmedia/65.jpg", column: 1 },
  { src: "/sm23printmedia/73.jpg", column: 1 },
  { src: "/sm23printmedia/81.jpg", column: 1 },
  { src: "/sm23printmedia/89.jpg", column: 1 },
  { src: "/sm23printmedia/97.jpg", column: 1 },
  { src: "/sm23printmedia/105.jpg", column: 1 },
  { src: "/sm23printmedia/113.jpg", column: 1 },
  { src: "/sm23printmedia/121.jpg", column: 1 },
  { src: "/sm23printmedia/129.jpg", column: 1 },
  { src: "/sm23printmedia/137.jpg", column: 1 },
  { src: "/sm23printmedia/151.jpg", column: 1 },
  { src: "/sm23printmedia/153.jpg", column: 1 },
  { src: "/sm23printmedia/155.jpg", column: 1 },
  { src: "/sm23printmedia/157.jpg", column: 1 },
  
  { src: "/sm23printmedia/3.jpg", column: 2 },
  { src: "/sm23printmedia/11.jpg", column: 2 },
  { src: "/sm23printmedia/19.jpg", column: 2 },
  { src: "/sm23printmedia/27.jpg", column: 2 },
  { src: "/sm23printmedia/35.jpg", column: 2 },
  { src: "/sm23printmedia/43.jpg", column: 2 },
  { src: "/sm23printmedia/51.jpg", column: 2 },
  { src: "/sm23printmedia/59.jpg", column: 2 },
  { src: "/sm23printmedia/67.jpg", column: 2 },
  { src: "/sm23printmedia/75.jpg", column: 2 },
  { src: "/sm23printmedia/83.jpg", column: 2 },
  { src: "/sm23printmedia/91.jpg", column: 2 },
  { src: "/sm23printmedia/99.jpg", column: 2 },
  { src: "/sm23printmedia/107.jpg", column: 2 },
  { src: "/sm23printmedia/115.jpg", column: 2 },
  { src: "/sm23printmedia/123.jpg", column: 2 },
  { src: "/sm23printmedia/131.jpg", column: 2 },
  { src: "/sm23printmedia/139.jpg", column: 2 },
  { src: "/sm23printmedia/141.jpg", column: 2 },
  { src: "/sm23printmedia/147.jpg", column: 2 },
  { src: "/sm23printmedia/149.jpg", column: 2 },
  { src: "/sm23printmedia/159.jpg", column: 2 },
  { src: "/sm23printmedia/161.jpg", column: 2 },
  
  
  { src: "/sm23printmedia/5.jpg", column: 3 },
  { src: "/sm23printmedia/13.jpg", column: 3 },
  { src: "/sm23printmedia/37.jpg", column: 3 },
  { src: "/sm23printmedia/29.jpg", column: 3 },
  { src: "/sm23printmedia/45.jpg", column: 3 },
  { src: "/sm23printmedia/53.jpg", column: 3 },
  { src: "/sm23printmedia/61.jpg", column: 3 },
  { src: "/sm23printmedia/21.png", column: 3 },
  { src: "/sm23printmedia/69.jpg", column: 3 },
  { src: "/sm23printmedia/77.jpg", column: 3 },
  { src: "/sm23printmedia/85.jpg", column: 3 },
  { src: "/sm23printmedia/93.jpg", column: 3 },
  { src: "/sm23printmedia/101.jpg", column: 3 },
  { src: "/sm23printmedia/109.jpg", column: 3 },
  { src: "/sm23printmedia/117.jpg", column: 3 },
  { src: "/sm23printmedia/125.jpg", column: 3 },
  { src: "/sm23printmedia/133.jpg", column: 3 },
  { src: "/sm23printmedia/163.jpg", column: 3 },
  { src: "/sm23printmedia/165.jpg", column: 3 },
  { src: "/sm23printmedia/167.jpg", column: 3 },
  { src: "/sm23printmedia/179.jpg", column: 3 },
  
  { src: "/sm23printmedia/7.jpg", column: 4 },
  { src: "/sm23printmedia/15.jpg", column: 4 },
  { src: "/sm23printmedia/23.png", column: 4 },
  { src: "/sm23printmedia/31.jpg", column: 4 },
  { src: "/sm23printmedia/39.jpg", column: 4 },
  { src: "/sm23printmedia/47.jpg", column: 4 },
  { src: "/sm23printmedia/55.jpg", column: 4 },
  { src: "/sm23printmedia/63.jpg", column: 4 },
  { src: "/sm23printmedia/71.jpg", column: 4 },
  { src: "/sm23printmedia/79.jpg", column: 4 },
  { src: "/sm23printmedia/87.jpg", column: 4 },
  { src: "/sm23printmedia/95.jpg", column: 4 },
  { src: "/sm23printmedia/103.jpg", column: 4 },
  { src: "/sm23printmedia/111.jpg", column: 4 },
  { src: "/sm23printmedia/119.jpg", column: 4 },
  { src: "/sm23printmedia/127.jpg", column: 4 },
  { src: "/sm23printmedia/135.jpg", column: 4 },
  { src: "/sm23printmedia/143.jpg", column: 4 },
  { src: "/sm23printmedia/145.jpg", column: 4 },
  { src: "/sm23printmedia/169.jpg", column: 4 },
  { src: "/sm23printmedia/171.jpg", column: 4 },
  { src: "/sm23printmedia/173.jpg", column: 4 },
  { src: "/sm23printmedia/175.jpg", column: 4 },
  { src: "/sm23printmedia/177.jpg", column: 4 },
];

export default function PrintMediaShikshaMahaKumbh2023() {
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
