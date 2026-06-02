"use client";

import React, { useEffect, useState } from "react";
import type { AnimatedCounterProps } from "./types";

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 1800,
  icon,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let frameId = 0;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return (
    <div className="flex flex-col items-center text-center">
      {icon && (
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <p className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500 md:text-sm">
        {label}
      </p>
    </div>
  );
};

export default AnimatedCounter;
