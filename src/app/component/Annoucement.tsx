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

  return (
    <div className="flex flex-col items-center justify-center h-auto bg-white w-full py-8">
      <Global styles={shadowAnimation} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Paper Presentation Schedule */}
        <div
          className={`transition-all duration-500 min-h-[200px] ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } animated-shadow bg-white p-6 rounded-lg text-center shadow-md`}
        >
          <span className="text-red-700 text-sm flex justify-center mb-2">
            <img src="new.gif" alt="New" className="w-10 h-auto" />
          </span>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Paper Presentation Schedule
          </h2>
          <button
            className="px-5 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary border border-primary transition"
            onClick={() => window.open("/2024M/Abstract Booklet.pdf", "_blank")}
          >
            Click Here
          </button>
        </div>

        {/* Call for Papers */}
        <div
          className={`transition-all duration-500 min-h-[200px] ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } animated-shadow bg-white p-6 rounded-lg text-center shadow-md`}
        >
          <span className="text-red-700 text-sm flex justify-center mb-2">
            <img src="new.gif" alt="New" className="w-10 h-auto" />
          </span>
          <p className="text-red-700 text-sm mb-2 p-6">
            Note: The Last Date for Abstract Submission has been extended to
            December 05, 2024.
          </p>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Call for Papers
          </h2>
          <button
            className="px-5 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary border border-primary transition"
            onClick={() => (window.location.href = "/paper")}
          >
            Click Here
          </button>
        </div>

        {/* Call for Conclave */}
        <div
          className={`transition-all duration-500 min-h-[200px] ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } animated-shadow bg-white p-6 rounded-lg text-center shadow-md`}
        >
          <span className="text-red-700 text-sm flex justify-center mb-2">
            <img src="new.gif" alt="New" className="w-10 h-auto" />
          </span>
          <p className="text-red-700 text-sm mb-2">
            Note: Visit and view our upcoming conclaves with destinations.
          </p>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Call for Conclave
          </h2>
          <button
            className="px-5 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary border border-primary transition"
            onClick={() => (window.location.href = "/conclave")}
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
