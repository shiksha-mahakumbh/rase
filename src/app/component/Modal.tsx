"use client";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const pathname = usePathname();
  const shouldRenderModal = pathname === "/";

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
            The 5th edition of <strong>Shiksha Mahakumbh</strong> was successfully concluded at <strong>NIPER Mohali</strong>.{" "}
            To view photographs,{" "}
            <a
              href="https://drive.google.com/drive/folders/1c2CKx2Z9IaN-dsoW-Ymw6Npx1EOTFcsA?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 font-semibold underline hover:text-red-800 transition-colors duration-300"
            >
              please click here.
            </a>
          </p>

          {/* Custom Child Content (Optional) */}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
