"use client";
import React, { useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
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
    <div className='m-4'> 
      <Carousel
        selectedItem={currentIndex}
        showStatus={false} // Hide status indicator
        showThumbs={false} 
        onChange={(index) => setCurrentIndex(index)}
      >
        {slides.map((slide, index) => (
          <div key={index}>
            <Image
              src={slide.src}
              alt={slide.alt}
              style={{ maxWidth: '100%', maxHeight: '60vh' }}
              width = "1000"
              height= "1000"
            />
         
         <div className='invisible lg:visible'>
{slide.legend!=="" &&
            <div className="absolute bottom-0 px-4 py-3 bg-gray-500/50 w-full">
    
      <p className="text-gray-200">
      {
        slide.legend
      }
      <br />
      <br />
      </p>
      </div>
}</div>
          </div>
          
        ))}
      </Carousel>
      
    </div>
  );
};

export default SlideShow;
