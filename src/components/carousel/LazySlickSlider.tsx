"use client";

import dynamic from "next/dynamic";
import type { Settings } from "react-slick";

const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-[320px] w-full animate-pulse rounded-lg bg-gray-200"
      aria-hidden
    />
  ),
});

type Props = {
  settings: Settings;
  className?: string;
  children: React.ReactNode;
};

export default function LazySlickSlider({
  settings,
  className,
  children,
}: Props) {
  return (
    <Slider {...settings} className={className}>
      {children}
    </Slider>
  );
}
