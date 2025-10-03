"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaBookOpen, FaLightbulb, FaGlobe } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const pathname = usePathname();
  const shouldRenderModal = pathname === "/";

  // Countdown Timer
  const calculateTimeLeft = () => {
    const eventDate = new Date("2025-10-31T09:00:00");
    const difference = +eventDate - +new Date();
    let timeLeft: any = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const countdown = timeLeft.days !== undefined ? (
    <div className="flex justify-center gap-4 text-white font-bold mt-4 text-sm md:text-base">
      <span>{timeLeft.days}d</span> : 
      <span>{timeLeft.hours}h</span> : 
      <span>{timeLeft.minutes}m</span> : 
      <span>{timeLeft.seconds}s</span>
    </div>
  ) : (
    <p className="text-white mt-2">Event Started!</p>
  );

  // Floating icons for particles effect
  const floatingIcons = [
    { icon: <FaBookOpen />, size: 24, style: { top: "10%", left: "5%", animationDelay: "0s" } },
    { icon: <FaLightbulb />, size: 20, style: { top: "30%", right: "10%", animationDelay: "1s" } },
    { icon: <FaGlobe />, size: 22, style: { top: "60%", left: "15%", animationDelay: "2s" } },
    { icon: <FaBookOpen />, size: 18, style: { top: "50%", right: "20%", animationDelay: "3s" } },
  ];

  return shouldRenderModal && isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fadeIn">
      <div className="relative bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-300 p-6 md:p-10 rounded-3xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/3 transform transition-transform duration-500 hover:scale-105 overflow-hidden">
        
        {/* Floating Icons */}
        {floatingIcons.map((item, idx) => (
          <div
            key={idx}
            className="absolute animate-float"
            style={{
              fontSize: item.size,
              ...item.style,
            }}
          >
            {item.icon}
          </div>
        ))}

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 font-bold px-3 py-1 rounded-full shadow-lg transition-all duration-300"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4 animate-bounce">
          <Image src="/shiksha.png" alt="Shiksha Mahakumbh Logo" width={100} height={100} />
        </div>

        {/* Headings */}
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-white animate-fadeInUp">
          शिक्षा महाकुंभ अभियान
        </h2>
        <h3 className="text-center text-lg md:text-xl font-semibold text-yellow-100 mt-1 animate-fadeInUp">
          5th Edition | NIPER Mohali | 31st Oct – 2nd Nov 2025
        </h3>

        {/* Description */}
        <p className="text-center text-white mt-4 mb-4 px-2 md:px-6 text-sm md:text-base animate-fadeInUp">
          Join India's largest **Annual Educational Conclave** featuring workshops, paper presentations, conclaves, and cultural showcases celebrating holistic learning and Indian Knowledge Systems. Connect with educators, researchers, innovators, and global institutions.
        </p>

        {/* Countdown */}
        {countdown}

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
          <a
            href="/registration/Single_Registration"
            className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-yellow-400 hover:text-white"
          >
            Register Now
          </a>
          <a
            href="/events"
            className="bg-white text-purple-600 font-bold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-pink-500 hover:text-white"
          >
            Explore Events
          </a>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in forwards;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-in forwards;
        }
      `}</style>
    </div>
  ) : null;
};

export default Modal;
