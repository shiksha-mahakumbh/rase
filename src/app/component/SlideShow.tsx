"use client";
import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
  legend: string;
  ctaText?: string;
  ctaLink?: string;
}

interface SlideShowProps {
  slides: Slide[];
}

const SlideShow: React.FC<SlideShowProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalId);
  }, [slides.length]);

  return (
    <div className="m-4 rounded-lg overflow-hidden shadow-lg border border-[#F59E0B]">
      <Carousel
        selectedItem={currentIndex}
        showStatus={false}
        showThumbs={false}
        showArrows={true}
        autoPlay={false}
        infiniteLoop={true}
        onChange={(index) => setCurrentIndex(index)}
        emulateTouch
        transitionTime={800}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <Image
              src={slide.src}
              alt={slide.alt}
              className="w-full h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] object-cover"
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
            {slide.legend && (
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-900 via-transparent to-transparent px-6 py-4">
                <p className="text-white text-sm sm:text-base lg:text-lg font-semibold text-center drop-shadow-lg">
                  {slide.legend}
                </p>
                {slide.ctaText && slide.ctaLink && (
                  <div className="flex justify-center mt-2">
                    <a
                      href={slide.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#F59E0B] hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-md transition duration-300 shadow-md"
                    >
                      {slide.ctaText}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default SlideShow;
