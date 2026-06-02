"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { formClasses } from "./formClasses";

interface RegistrationFormWrapperProps {
  children: ReactNode;
  /** Preserves existing h1 text from each form */
  heading: string;
  icon?: ReactNode;
}

/**
 * Wraps individual registration forms — all fields/logic stay in children.
 */
const RegistrationFormWrapper: React.FC<RegistrationFormWrapperProps> = ({
  children,
  heading,
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="registration-form-root mx-auto w-full max-w-2xl"
    >
      <div className="mb-6 flex items-center justify-center gap-3 border-b border-gray-100 pb-4">
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <h1 className="text-center text-xl font-bold text-primary md:text-2xl">
          {heading}
        </h1>
      </div>
      <div className="registration-form-fields">{children}</div>
    </motion.div>
  );
};

export default RegistrationFormWrapper;
export { formClasses };
