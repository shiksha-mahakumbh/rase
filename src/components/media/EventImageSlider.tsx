"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import OptimizedImage from "./OptimizedImage";

interface EventImageSliderProps {
  images: string[];
  eventTitle: string;
}

export default function EventImageSlider({
  images,
  eventTitle,
}: EventImageSliderProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="mb-6 min-h-[320px]">
      <Slider {...settings} className="w-full">
        {images.map((image, index) => (
          <div key={image} className="flex justify-center">
            <OptimizedImage
              src={image}
              alt={`${eventTitle} — photo ${index + 1}`}
              width={800}
              height={320}
              sizes="(max-width: 768px) 100vw, 800px"
              className="h-80 w-full rounded-lg object-contain"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
