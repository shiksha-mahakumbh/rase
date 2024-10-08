import Image from "next/image";
import { useState } from "react";

interface ImageData {
  src: string;
  column: number;
}

const images: ImageData[] = [
    { src: "/sk24printmedia/2.jpg", column: 1 },
  { src: "/sk24printmedia/6.jpg", column: 1 },
  { src: "/sk24printmedia/3.jpg", column: 1 },
  { src: "/sk24printmedia/10.jpg", column: 1 },
  { src: "/sk24printmedia/18.jpg", column: 1 },
  { src: "/sk24printmedia/20.jpg", column: 1 },
  { src: "/sk24printmedia/21.jpg", column: 1 },
  { src: "/sk24printmedia/31.jpg", column: 1 },
  { src: "/sk24printmedia/32.jpg", column: 1 },
  { src: "/sk24printmedia/33.jpg", column: 1 },
  { src: "/sk24printmedia/46.jpg", column: 1 },
  { src: "/sk24printmedia/47.jpg", column: 1 },
  { src: "/sk24printmedia/48.jpg", column: 1 },
  { src: "/sk24printmedia/49.jpg", column: 1 },
  { src: "/sk24printmedia/50.jpg", column: 1 },
  { src: "/sk24printmedia/61.jpg", column: 1 },
  { src: "/sk24printmedia/62.jpg", column: 1 },
  { src: "/sk24printmedia/65.jpg", column: 1 },
  { src: "/sk24printmedia/66.jpg", column: 1 },
  { src: "/sk24printmedia/67.jpg", column: 1 },
  { src: "/sk24printmedia/68.jpg", column: 1 },
  { src: "/sk24printmedia/84.jpg", column: 1 },

  { src: "/sk24printmedia/13.jpg", column: 2 },
  { src: "/sk24printmedia/9.jpg", column: 2 },
  { src: "/sk24printmedia/4.jpg", column: 2 },
  { src: "/sk24printmedia/12.jpg", column: 2 },
  { src: "/sk24printmedia/22.jpg", column: 2 },
  { src: "/sk24printmedia/23.jpg", column: 2 },
  { src: "/sk24printmedia/34.jpg", column: 2 },
  { src: "/sk24printmedia/35.jpg", column: 2 },
  { src: "/sk24printmedia/36.jpg", column: 2 },
  { src: "/sk24printmedia/51.jpg", column: 2 },
  { src: "/sk24printmedia/52.jpg", column: 2 },
  { src: "/sk24printmedia/53.jpg", column: 2 },
  { src: "/sk24printmedia/54.jpg", column: 2 },
  { src: "/sk24printmedia/55.jpg", column: 2 },
  { src: "/sk24printmedia/63.jpg", column: 2 },
  { src: "/sk24printmedia/69.jpg", column: 2 },
  { src: "/sk24printmedia/70.jpg", column: 2 },
  { src: "/sk24printmedia/71.jpg", column: 2 },
  { src: "/sk24printmedia/72.jpg", column: 2 },


  { src: "/sk24printmedia/39.jpg", column: 3 },
  { src: "/sk24printmedia/7.jpg", column: 3 },
  { src: "/sk24printmedia/1.jpg", column: 3 },
  { src: "/sk24printmedia/14.jpg", column: 3 },
  { src: "/sk24printmedia/15.jpg", column: 3 },
  { src: "/sk24printmedia/24.jpg", column: 3 },
  { src: "/sk24printmedia/25.jpg", column: 3 },
  { src: "/sk24printmedia/26.jpg", column: 3 },
  { src: "/sk24printmedia/37.jpg", column: 3 },
  { src: "/sk24printmedia/38.jpg", column: 3 },
  { src: "/sk24printmedia/40.jpg", column: 3 },
  { src: "/sk24printmedia/56.jpg", column: 3 },
  { src: "/sk24printmedia/57.jpg", column: 3 },
  { src: "/sk24printmedia/58.jpg", column: 3 },
  { src: "/sk24printmedia/64.jpg", column: 3 },
  { src: "/sk24printmedia/73.jpg", column: 3 },
  { src: "/sk24printmedia/74.jpg", column: 3 },
  { src: "/sk24printmedia/75.jpg", column: 3 },
  { src: "/sk24printmedia/76.jpg", column: 3 },
  { src: "/sk24printmedia/82.jpg", column: 3 },
  { src: "/sk24printmedia/83.jpg", column: 3 },
  { src: "/sk24printmedia/86.jpg", column: 3 },

  { src: "/sk24printmedia/17.jpg", column: 4 },
  { src: "/sk24printmedia/19.jpg", column: 4 },
  { src: "/sk24printmedia/11.jpg", column: 4 },
  { src: "/sk24printmedia/8.jpg", column: 4 },
  { src: "/sk24printmedia/5.jpg", column: 4 },
  { src: "/sk24printmedia/16.jpg", column: 4 },
  { src: "/sk24printmedia/27.jpg", column: 4 },
  { src: "/sk24printmedia/28.jpg", column: 4 },
  { src: "/sk24printmedia/29.jpg", column: 4 },
  { src: "/sk24printmedia/30.jpg", column: 4 },
  { src: "/sk24printmedia/41.jpg", column: 4 },
  { src: "/sk24printmedia/42.jpg", column: 4 },
  { src: "/sk24printmedia/43.jpg", column: 4 },
  { src: "/sk24printmedia/44.jpg", column: 4 },
  { src: "/sk24printmedia/45.jpg", column: 4 },
  { src: "/sk24printmedia/59.jpg", column: 4 },
  { src: "/sk24printmedia/60.jpg", column: 4 },
  { src: "/sk24printmedia/77.jpg", column: 4 },
  { src: "/sk24printmedia/78.jpg", column: 4 },
  { src: "/sk24printmedia/79.jpg", column: 4 },
  { src: "/sk24printmedia/80.jpg", column: 4 },
  { src: "/sk24printmedia/81.jpg", column: 4 },
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
        Shiksha Kumbh 2024
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
