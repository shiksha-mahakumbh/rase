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
    <div className="flex flex-col items-center justify-center h-auto bg-white w-full">
      <Global styles={shadowAnimation} />
      <div className="flex flex-col items-center justify-center w-full">
        {/* First Component */}
        <div className={`transition-all duration-500 flex-1 min-h-[200px] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} animated-shadow bg-white p-6 m-4 rounded-lg text-center`}>
         
         {/* Paper Presentation Schedule */}
         {/* <span className='text-red-700 text-sm'>
            <img src="new.gif" alt="" />
          </span>
          <h2 className="mb-4 text-l font-semibold">Paper Presentation Schedule</h2>
          <button 
           className="px-4 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary"
           onClick={() => window.open('/2024M/Abstract Booklet.pdf', '_blank')}>
           Click Here
         </button> */}

         {/* <span className='text-red-700 text-sm'>
            <img src="new.gif" alt="" />
          </span>
          
          <h2 className="mb-4 text-l font-semibold">Tentative Schedule Shiksha Mahakumbh 2024</h2>
          <button 
           className="px-4 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary"
           onClick={() => window.open('/2024M/Tentative Schedule SM24.xlsx', '_blank')}>
           Click Here
         </button> */}

         <h2 className="mb-4 text-l font-semibold">Register to Participate in Shiksha Mahakumbh 2025</h2>
          <button 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary"
            onClick={() => window.location.href = '/registration/Single_Registration'}>
            Click Here
          </button>


         
         

        </div>
        {/* Second Component */ }
        {/* <div className={`transition-all duration-500 flex-1 min-h-[200px] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} animated-shadow bg-white p-6 m-4 rounded-lg text-center`}>
          <span className='text-red-700 text-sm'>
            <img src="new.gif" alt="" />&nbsp;Note&#58; The Last Date for Abstract Submission has been extended to  December 05, 2024.
          </span>
          <h2 className="mb-4 text-xl font-semibold">Call for Papers</h2>
          <button 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary"
            onClick={() => window.location.href = '/paper'}>
            Click Here
          </button>
        </div> */}
        {/* Third Component */}
        {/* <div className={`transition-all duration-500 flex-1 min-h-[200px] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} animated-shadow bg-white p-6 m-4 rounded-lg text-center`}>
          <span className='text-red-700 text-sm'>
            <img src="new.gif" alt="" />&nbsp;Note&#58; Visit and view our upcoming conclaves with destinations
          </span>
          <h2 className="mb-4 text-xl font-semibold">Call for Conclave</h2>
          <button 
            className="px-4 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary"
            onClick={() => window.location.href = '/conclave'}>
            Click Here
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Announcement;
