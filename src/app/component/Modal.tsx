"use client"; // Ensures client-side rendering for usePathname and state hooks
import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const pathname = usePathname();  // Retrieves the current path
  console.log(pathname);  // Logs the path to verify it's working as expected

  // Only render modal if it's on the homepage ("/") and if isOpen is true
  const shouldRenderModal = pathname === '/';

  return (
    shouldRenderModal && isOpen ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-white p-8 rounded-lg shadow-lg h-auto w-2/3 lg:w-2/5">
          {/* Close button positioned in the top-right */}
          <button
            className="absolute top-3 right-2 z-50 bg-gray-300 text-primary font-bold px-3 py-1 rounded"
            onClick={onClose}
          >
            Close
          </button>
          {/* Modal Content */}
          {children}
        </div>
      </div>
    ) : null // Return null if the modal shouldn't render
  );
};

export default Modal;
