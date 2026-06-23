"use client";

import { useState } from "react";
import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

interface Slide {
  src: string;
  alt: string;
  legend: string;
  ctaText?: string;
  ctaLink?: string;
}

interface SlideShowProps {
  slides: Slide[];
  badge?: string;
}

export default function SlideShow({
  slides,
  badge = "Shiksha Mahakumbh Abhiyan",
}: SlideShowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!slides.length) return null;

  return (
    <div className="relative m-2 overflow-hidden rounded-3xl border border-primary/20 shadow-[0_20px_60px_rgba(80,42,42,0.15)] md:m-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent"
      />

      {badge ? (
        <div className="absolute left-4 top-4 z-20 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          {badge}
        </div>
      ) : null}

      <Carousel
        showStatus={false}
        showThumbs={false}
        showArrows
        autoPlay
        infiniteLoop
        interval={5000}
        stopOnHover
        onChange={(index) => setCurrentIndex(index)}
        emulateTouch
        transitionTime={800}
      >
        {slides.map((slide, index) => (
          <div key={`${slide.src}-${index}`} className="relative aspect-[3/2] w-full sm:aspect-[16/10]">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
              priority={index === 0}
            />
            {slide.legend ? (
              <div className="absolute bottom-0 z-20 w-full bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent px-6 py-5">
                <p className="text-center text-sm font-semibold text-white drop-shadow-lg sm:text-base lg:text-lg">
                  {slide.legend}
                </p>
                {slide.ctaText && slide.ctaLink ? (
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
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </Carousel>

      <div className="absolute bottom-4 right-4 z-20 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
}
