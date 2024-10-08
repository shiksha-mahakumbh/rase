import React from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";

const MarqueeList: React.FC = () => {
  return (
    <Marquee direction="left" play={true} className="bg-black" speed={20}>
      <p className="text-black">RASE Conference 2023 Live Streaming</p>
      <p className="text-black">RASE Conference 2023 Live Streaming</p> 
      <p className="text-black">RASE Conference 2023 Live Streaming</p>
    </Marquee>
  );
};

export default Marquee;
