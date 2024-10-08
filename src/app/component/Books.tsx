"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import bookImage from '/public/book.png';

const Books: React.FC = () => {
  const text2 = `Recent Advances in School Education is a compendium of events from the inauguration to the passing of the world’s first Shiksha Mahakumbh, inspired by the spirit of Kumbh culture in ancient Bharat. Shiksha Mahakumbh is the brainchild of Dr. Thakur SKR, a prominent scientist of ISRO . The inaugural edition of Shiksha Mahakumbh i.e., National Conference on Recent Advances in School Education (RASE 2023) was organised by Sarvhitkari Educational Society, a prominent unit of Vidya Bharti – Akhil Bhartiya Shiksha Sansthan in the state of Punjab, in collaboration with Dr. B. R. Ambedkar National Institute of Technology Jalandhar. The conference was held from June 9 - 11, 2023 at the esteemed premises of Dr. B. R. Ambedkar National Institute of Technology, Jalandhar.
  `;
  const [isText2Expanded, setIsText2Expanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const toggleText2 = () => {
    setIsText2Expanded(!isText2Expanded);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      function isMobileScreen() {
        return window.innerWidth < 640;
      }
      setIsMobile(isMobileScreen());
    };
    function isMobileScreen() {
      return window.innerWidth < 640;
    }
    setIsMobile(isMobileScreen());
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  const textClass = isMobile ? "text-l" : "text-l";
  const textClassHeading = isMobile ? "text-2xl" : "text-2xl";

  return (
    <div className="bg-white p-2 flex flex-col justify-between items-start">
      <h1
        className={`${textClassHeading} headd font-bold py-4 text-primary text-center`}
      >
        Books
      </h1>
      <div
        className={`whitespace-pre-line text-justify ${textClass} text-black`}
      >
        {isText2Expanded ? text2 : isMobile ? text2.slice(0, 248) : text2}
        <button
          onClick={toggleText2}
          className={`text-blue-500 ${
            isText2Expanded || !isMobile ? "hidden" : ""
          }`}
        >
          Read More
        </button>
      </div>
      <p> <Link className="text-blue-400 cursor-pointer" href="/ContactUs">{`To acquire a copy of this book, please don't hesitate to get in touch with us.`}</Link></p>
      <div className="relative w-full max-w-md mx-auto my-8 perspective">
        <div className="book-card relative bg-white w-64 h-80 mx-auto shadow-xl rounded-lg transform transition-transform duration-700 hover:rotate-y-6">
          <a href="/" target="_blank">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Image alt="book" src={bookImage} className="w-full h-full object-cover rounded-lg cursor-pointer" />
            </div>
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-white bg-black bg-opacity-50 p-4 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-500">
              <div>
                <h2 className="text-lg font-bold">Book Preview</h2>
                <p className="text-sm">Click to view the book preview</p>
              </div>
            </div>
          </a>
        </div>
      </div>
      
    </div>
  );
};

export default Books;
