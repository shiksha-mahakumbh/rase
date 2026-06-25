"use client";

import { useEffect, useState } from "react";
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

export default function SlideShow({ slides, badge = "Mahakumbh" }: SlideShowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      if (mq.matches) setAutoPlay(false);
    };
    syncMotion();
    mq.addEventListener("change", syncMotion);
    return () => mq.removeEventListener("change", syncMotion);
  }, []);

  if (!slides.length) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="gallery-carousel relative overflow-hidden rounded-2xl border border-white/15 bg-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      {badge ? (
        <div className="absolute left-3 top-3 z-20 max-w-[min(100%,14rem)] rounded-full border border-white/20 bg-brand-navy/85 px-3 py-1.5 text-[0.65rem] font-semibold uppercase leading-tight tracking-wide text-white backdrop-blur-sm sm:left-4 sm:top-4 sm:px-4 sm:text-xs">
          {badge}
        </div>
      ) : null}

      <div className="absolute right-3 top-3 z-20 flex items-center gap-2 sm:right-4 sm:top-4">
        <button
          type="button"
          onClick={() => setAutoPlay((playing) => !playing)}
          className="rounded-full border border-white/25 bg-brand-navy/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-brand-navy-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
          aria-pressed={autoPlay}
          aria-label={autoPlay ? "Pause slideshow" : "Play slideshow"}
        >
          {autoPlay ? "Pause" : "Play"}
        </button>
        <span
          className="rounded-full bg-brand-navy/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
          aria-hidden="true"
        >
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {slides.length}
        {currentSlide?.legend ? `: ${currentSlide.legend}` : ""}
      </p>

      <Carousel
        showStatus={false}
        showThumbs={false}
        showArrows
        autoPlay={autoPlay}
        infiniteLoop
        interval={5000}
        stopOnHover
        onChange={(index) => setCurrentIndex(index)}
        emulateTouch
        transitionTime={800}
        selectedItem={currentIndex}
      >
        {slides.map((slide, index) => (
          <div
            key={`${slide.src}-${index}`}
            className="relative aspect-[3/2] w-full bg-slate-100 sm:aspect-[16/10]"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
              priority={index === 0}
            />
            {slide.legend ? (
              <div className="absolute bottom-0 z-10 w-full bg-gradient-to-t from-brand-navy/95 via-brand-navy/70 to-transparent px-4 py-4 sm:px-6 sm:py-5">
                <p className="text-center text-sm font-semibold text-white sm:text-base lg:text-lg">
                  {slide.legend}
                </p>
                {slide.ctaText && slide.ctaLink ? (
                  <div className="mt-3 flex justify-center">
                    <a
                      href={slide.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-brand-saffron px-5 py-2.5 text-sm font-bold text-brand-navy shadow-md transition duration-300 hover:bg-brand-saffron-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
    </div>
  );
}
