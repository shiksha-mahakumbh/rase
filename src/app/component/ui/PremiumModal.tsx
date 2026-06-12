"use client";

import React, { useEffect, useCallback, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export type ModalVariant = "default" | "success" | "error" | "info";

export interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  title?: string;
  variant?: ModalVariant;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  ariaLabel?: string;
}

const maxWidthClass: Record<NonNullable<PremiumModalProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

const variantAccent: Record<ModalVariant, string> = {
  default: "from-primary/20 via-amber-400/10 to-primary/5",
  success: "from-emerald-400/20 via-emerald-50 to-white",
  error: "from-rose-400/20 via-rose-50 to-white",
  info: "from-sky-400/20 via-sky-50 to-white",
};

const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  variant = "default",
  showCloseButton = true,
  closeOnBackdrop = true,
  maxWidth = "2xl",
  ariaLabel = "Dialog",
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !focusable?.length) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={closeOnBackdrop ? onClose : undefined}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={`relative w-full ${maxWidthClass[maxWidth]} max-h-[90vh] overflow-y-auto rounded-3xl border border-white/40 bg-white/90 shadow-[0_24px_80px_rgba(80,42,42,0.25)] backdrop-blur-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-3xl bg-gradient-to-b ${variantAccent[variant]}`}
              aria-hidden="true"
            />

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200/80 bg-white/90 text-gray-600 shadow-md transition hover:border-primary/30 hover:bg-primary hover:text-white"
                aria-label="Close dialog"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            <div className="relative p-6 md:p-8">
              {title && (
                <h2 className="mb-4 pr-10 text-center text-xl font-bold text-primary md:text-2xl">
                  {title}
                </h2>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PremiumModal;
