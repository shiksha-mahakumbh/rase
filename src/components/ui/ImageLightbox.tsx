"use client";

import React from "react";
import Image from "next/image";
import PremiumModal from "@/components/ui/PremiumModal";
import { normalizeStaticImageSrc } from "@/lib/images/normalizeStaticImageSrc";

export interface ImageLightboxProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  alt?: string;
  downloadUrl?: string;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  imageSrc,
  onClose,
  alt = "Larger view",
  downloadUrl,
}) => {
  const src = normalizeStaticImageSrc(imageSrc);
  const download = downloadUrl ?? imageSrc;

  return (
    <PremiumModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      ariaLabel="Image preview"
    >
      <div className="relative">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
          <Image
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="h-auto w-full object-contain"
            unoptimized
          />
        </div>
        {download && (
          <div className="mt-4 flex justify-center">
            <a
              href={download}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#7a4343]"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </PremiumModal>
  );
};

export default ImageLightbox;
