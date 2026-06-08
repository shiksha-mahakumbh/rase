"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import PremiumModal from "./ui/PremiumModal";
import { GlobeEducationIcon } from "./home/icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const pathname = usePathname();
  const shouldRenderModal = pathname === "/";

  return (
    <PremiumModal
      isOpen={shouldRenderModal && isOpen}
      onClose={onClose}
      maxWidth="2xl"
      ariaLabel="Welcome announcement"
    >
      <div className="space-y-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <GlobeEducationIcon className="h-8 w-8" />
        </div>

        <h2 className="text-2xl font-bold text-primary md:text-3xl">
          Welcome to{" "}
          <span className="text-brand-saffron">शिक्षा महाकुंभ अभियान</span>
        </h2>

        <p className="text-lg font-medium leading-relaxed text-gray-700 md:text-xl">
          Join India&apos;s largest{" "}
          <strong>Annual Educational Conclave</strong> – Shiksha Mahakumbh
          Abhiyan, organized by the Department of Holistic Education (DHE) in
          collaboration with premier INIs.
        </p>

        {/* <p className="text-md md:text-lg text-gray-700 font-medium">
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
          </p> */}

        {children && <div className="mt-4">{children}</div>}
      </div>
    </PremiumModal>
  );
};

export default Modal;
