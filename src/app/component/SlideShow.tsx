"use client";

import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { motion } from "framer-motion";

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
    <div className="relative m-2 overflow-hidden rounded-3xl border border-primary/20 shadow-[0_20px_60px_rgba(80,42,42,0.15)] md:m-4">
      {/* Decorative gradient overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent"
      />

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute left-4 top-4 z-20 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md"
      >
        Shiksha Mahakumbh Abhiyan
      </motion.div>

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
              className="h-[380px] w-full object-cover sm:h-[450px] md:h-[520px] lg:h-[580px]"
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
              priority={index === 0}
            />
            {slide.legend && (
              <div className="absolute bottom-0 z-20 w-full bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent px-6 py-5">
                <p className="text-center text-sm font-semibold text-white drop-shadow-lg sm:text-base lg:text-lg">
                  {slide.legend}
                </p>
                {slide.ctaText && slide.ctaLink && (
                  <div className="mt-3 flex justify-center">
                    <a
                      href={slide.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#F59E0B] px-5 py-2.5 font-bold text-black shadow-md transition duration-300 hover:bg-yellow-400"
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

      {/* Slide counter */}
      <div className="absolute bottom-4 right-4 z-20 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
};

export default SlideShow;
