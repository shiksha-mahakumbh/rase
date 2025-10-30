"use client";

import { useState, useEffect } from "react";
import { css, Global } from "@emotion/react";

const Announcement = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const shadowAnimation = css`
    @keyframes shadow-move {
      0% {
        box-shadow: 0 0 10px 2px rgba(255, 0, 0, 0.5);
      }
      25% {
        box-shadow: 0 0 10px 2px rgba(0, 255, 0, 0.5);
      }
      50% {
        box-shadow: 0 0 10px 2px rgba(0, 0, 255, 0.5);
      }
      75% {
        box-shadow: 0 0 10px 2px rgba(255, 255, 0, 0.5);
      }
      100% {
        box-shadow: 0 0 10px 2px rgba(255, 0, 0, 0.5);
      }
    }

    .animated-shadow {
      animation: shadow-move 2s infinite;
    }
  `;

  // ✅ Updated openFile function
  const openFile = (filePath: string) => {
    // Ensure leading slash is preserved and use the same domain
    const url = `${window.location.origin}${filePath}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto bg-white w-full py-8">
      <Global styles={shadowAnimation} />

      <div className="flex flex-col w-full max-w-6xl space-y-6">
        {/* Tentative Schedule */}
        <div
          className={`transition-all duration-500 min-h-[200px] ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } animated-shadow bg-white p-6 rounded-lg text-center shadow-md`}
        >
          <span className="text-red-700 text-sm flex justify-center mb-2">
            <img src="/new.gif" alt="New" className="w-10 h-auto" />
          </span>
          <h2 className="mb-4 text-lg font-semibold px-6 py-6 text-gray-800">
            Tentative Schedule
          </h2>
          <button
            className="px-5 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary border border-primary transition"
            onClick={() =>
              openFile("/2024M/Tentative%20Schedule%20SM25%20-%20V2.0.xlsx")
            }
          >
            Click Here
          </button>
        </div>

        {/* DHE English Olympiad Result */}
        <div
          className={`transition-all duration-500 min-h-[200px] ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } animated-shadow bg-white p-6 rounded-lg text-center shadow-md`}
        >
          <span className="text-red-700 text-sm flex justify-center mb-2">
            <img src="/new.gif" alt="New" className="w-10 h-auto" />
          </span>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            DHE English Olympiad Result
          </h2>
          <button
            className="px-5 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary border border-primary transition"
            onClick={() =>
              openFile("public/2024M/DHE-English-Olympaid-Result.jpg")
            }
          >
            Click Here
          </button>
        </div>

        {/* व्यवस्था जानकारी शिक्षा महाकुंभ 2025 */}
        <div
          className={`transition-all duration-500 min-h-[200px] ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } animated-shadow bg-white p-6 rounded-lg text-center shadow-md`}
        >
          <span className="text-red-700 text-sm flex justify-center mb-2">
            <img src="/new.gif" alt="New" className="w-10 h-auto" />
          </span>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            व्यवस्था जानकारी शिक्षा महाकुंभ 2025
          </h2>
          <button
            className="px-5 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary border border-primary transition"
            onClick={() =>
              openFile("/2024M/व्यवस्था%20जानकारी%20शिक्षा%20महाकुंभ%202025 .jpg")
            }
          >
            Click Here
          </button>
        </div>
      </div>

      {/* Registration Section */}
      <div
        className={`transition-all duration-500 mt-10 w-full max-w-4xl ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        } animated-shadow bg-white p-6 rounded-lg text-center shadow-md`}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Register to Participate in Shiksha Mahakumbh 2025
        </h2>
        <button
          className="px-6 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary border border-primary transition"
          onClick={() =>
            (window.location.href = "/registration/Single_Registration")
          }
        >
          Click Here
        </button>
      </div>
    </div>
  );
};

export default Announcement;
