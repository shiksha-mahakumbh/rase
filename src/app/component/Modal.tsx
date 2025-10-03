"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const pathname = usePathname();
  const shouldRenderModal = pathname === "/";

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Event Date
  const eventDate = new Date("2025-10-31T09:00:00"); // Event starts on 31st Oct 2025 9:00 AM

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return shouldRenderModal && isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 animate-fadeIn">
      <div className="relative bg-gradient-to-br from-yellow-100 to-red-100 p-8 rounded-2xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 border-4 border-primary transform transition-transform duration-300 hover:scale-105">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 z-50 bg-primary text-white font-bold px-4 py-2 rounded-full shadow-md hover:bg-red-500 transition-colors duration-300"
          onClick={onClose}
        >
          Close
        </button>

        {/* Modal Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Welcome to <span className="text-red-600">शिक्षा महाकुंभ अभियान</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-700 font-medium">
            Join India&apos;s largest <strong>Annual Educational Conclave</strong> – Shiksha Mahakumbh Abhiyan, organized by the Department of Holistic Education (DHE) in collaboration with premier INIs.
          </p>

          <p className="text-md md:text-lg text-gray-700 font-medium">
            The <strong>5th Edition</strong> will be held at <strong>NIPER Mohali</strong> from <strong>31st October to 2nd November 2025</strong>.
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center space-x-4 mt-4 text-white font-bold text-xl md:text-2xl">
            <div className="bg-primary rounded-lg px-4 py-2 shadow-md">
              {timeLeft.days} <span className="text-sm block">Days</span>
            </div>
            <div className="bg-primary rounded-lg px-4 py-2 shadow-md">
              {timeLeft.hours} <span className="text-sm block">Hours</span>
            </div>
            <div className="bg-primary rounded-lg px-4 py-2 shadow-md">
              {timeLeft.minutes} <span className="text-sm block">Minutes</span>
            </div>
            <div className="bg-primary rounded-lg px-4 py-2 shadow-md">
              {timeLeft.seconds} <span className="text-sm block">Seconds</span>
            </div>
          </div>

          <a
            href="/registration/Single_Registration"
            className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300 mt-4"
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
