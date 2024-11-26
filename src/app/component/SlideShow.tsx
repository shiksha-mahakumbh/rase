"use client";
import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
  legend: string;
}

interface SlideShowProps {
  slides: Slide[];
}

const SlideShow: React.FC<SlideShowProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(intervalId);
  }, [currentIndex]);

  return (
    <div className="m-4">
      <Carousel
        selectedItem={currentIndex}
        showStatus={false} // Hide status indicator
        showThumbs={false} // Hide thumbnails
        onChange={(index) => setCurrentIndex(index)}
        className="max-w-full"
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <Image
              src={slide.src}
              alt={slide.alt}
              className="w-full h-auto object-cover"
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 768px" // Makes it responsive
              priority
            />

            {slide.legend && (
              <div className="absolute bottom-0 w-full bg-gray-800 bg-opacity-60 text-gray-200 px-4 py-3 text-sm sm:text-base lg:text-lg">
                <p className="text-center">{slide.legend}</p>
              </div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default SlideShow;
