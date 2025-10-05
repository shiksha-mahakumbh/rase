"use client";
import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
  legend?: string; // 👈 legend is now optional
}

interface SlideShowProps {
  slides: Slide[];
}

const SlideShow: React.FC<SlideShowProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [slides.length]);

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <Carousel
        selectedItem={currentIndex}
        showStatus={false}
        showThumbs={false}
        infiniteLoop
        autoPlay
        interval={4000}
        showArrows={true}
        className="max-w-full"
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <Image
              src={slide.src}
              alt={slide.alt}
              width={1200}
              height={800}
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
            {slide.legend && (
              <div className="absolute bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white w-full px-4 py-2 text-center text-sm sm:text-base">
                {slide.legend}
              </div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default SlideShow;


import React from "react";
import SlideShow from "./SlideShow";
import Head from "next/head";

const merchandiseItems = [
  {
    id: 1,
    title: "Official Shiksha Mahakumbh T-Shirt",
    slides: [
      { src: "/merchandise/tshirt/1.jpg", alt: "Shiksha Mahakumbh T-shirt" },
      { src: "/merchandise/tshirt/2.jpg", alt: "Conference T-shirt back view" },
      { src: "/merchandise/tshirt/3.jpg", alt: "T-shirt close-up logo" },
    ],
    price: 500,
  },
  {
    id: 2,
    title: "Conference Mug",
    slides: [
      { src: "/merchandise/mug/1.jpg", alt: "Official Mug Shiksha Mahakumbh" },
    ],
    price: 200,
  },
  {
    id: 3,
    title: "Event Cap",
    slides: [
      { src: "/merchandise/cap/1.jpg", alt: "Shiksha Mahakumbh Cap" },
    ],
    price: 200,
  },
  {
    id: 4,
    title: "Backpack",
    slides: [
      { src: "/merchandise/bag/1.jpg", alt: "Event Backpack" },
    ],
    price: 400,
  },
];

const Merchandise = () => {
  return (
    <>
      {/* 🌍 SEO Optimized Head Section */}
      <Head>
        <title>Shiksha Mahakumbh Official Merchandise | Buy Online</title>
        <meta
          name="description"
          content="Explore official merchandise of Shiksha Mahakumbh Abhiyan — T-shirts, Caps, Mugs, and more. Celebrate the spirit of Bharat through education!"
        />
        <meta
          name="keywords"
          content="Shiksha Mahakumbh merchandise, education conference India, buy event t-shirt, Bharat@2047 campaign, educational initiatives, Vidya Bharti"
        />
        <meta name="author" content="Department of Holistic Education" />
      </Head>

      <div className="bg-gradient-to-b from-gray-50 to-white py-10 px-6 md:px-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-primary mb-2">
            शिक्षा महाकुंभ अभियान - Official Merchandise
          </h1>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            Celebrate the spirit of <strong>Shiksha Mahakumbh Abhiyan</strong> with exclusive 
            event merchandise. Every item supports the educational transformation movement of Bharat@2047.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {merchandiseItems.map((item) => (
            <section
              key={item.id}
              className="p-5 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <h2 className="text-xl font-semibold mb-3 text-center text-primary">
                {item.title}
              </h2>

              <div className="rounded-lg overflow-hidden mb-4">
                <SlideShow slides={item.slides} />
              </div>

              <p className="text-center text-lg font-semibold text-gray-800 mb-2">
                <span className="text-primary font-bold">Price:</span> ₹{item.price}{" "}
                <span className="text-sm text-gray-500">(plus delivery charges)</span>
              </p>

              <div className="flex justify-center">
                <a
                  href="/comingsoon"
                  className="inline-block bg-primary text-white py-2 px-6 rounded-full hover:bg-primary-dark transition-all duration-300"
                >
                  Buy Now
                </a>
              </div>
            </section>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-700 italic max-w-2xl mx-auto">
            “Each merchandise purchase contributes to our mission — 
            empowering education, innovation, and the holistic development of Bharat.”
          </p>
        </div>
      </div>
    </>
  );
};

export default Merchandise;
