// pages/announcements.tsx
"use client"
import { useState, useEffect } from 'react';
import { css, Global } from '@emotion/react';

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
    <div className="flex md:flex-col items-center justify-center h-auto bg-white w-full">
      <Global styles={shadowAnimation} />
      <div className="w-full flex md:flex-col items-center">
        <div className={`transition-all duration-500 flex-1 min-h-[200px] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} animated-shadow bg-white p-6 m-4 rounded-lg text-center w-11/12`}>
          <h2 className="mb-4 text-l font-semibold">Register to Participate in Shiksha Mahakumbh 2024</h2>
          <button 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary"
            onClick={() => window.location.href = 'https://sm24.rase.co.in/register'}>
            Click Here
          </button>
        </div>
        <div className={`transition-all duration-500 flex-1 min-h-[200px] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} animated-shadow bg-white p-6 m-4 rounded-lg text-center w-11/12`}>
          <span className='text-red-700 text-sm'><img src="new.gif" alt="" />&nbsp;Note&#58; The Last Date for Abstract Submission has been extended to September 28, 2024.</span>
          <h2 className="mb-4 text-xl font-semibold">Call for Papers</h2>
          <button 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary"
            onClick={() => window.location.href = 'https://sm24.rase.co.in/PaperSubmission'}>
            Click Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
